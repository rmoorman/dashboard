import {injectNetworkLayer, DefaultNetworkLayer, Transaction} from 'react-relay'
import {ShowNotificationCallback} from '../types/utils'
import * as cookiestore from 'cookiestore'
import {Lokka} from 'lokka'
import {Transport} from 'lokka-transport-http'
import {toGQL} from '../views/models/utils'
import {isScalar, isNonScalarList} from './graphql'
import * as Immutable from 'immutable'
import {Field, OrderBy} from '../types/types'
import {TypedValue} from '../types/utils'

export function updateNetworkLayer (): void {
  const isLoggedin = cookiestore.has('graphcool_auth_token') && cookiestore.has('graphcool_customer_id')
  const headers = isLoggedin
    ? {
      'Authorization': `Bearer ${cookiestore.get('graphcool_auth_token')}`,
      'X-GraphCool-Source': 'dashboard:relay',
    }
    : null
  const api = `${__BACKEND_ADDR__}/system`
  const layer = new DefaultNetworkLayer(api, { headers, retryDelays: [] })

  injectNetworkLayer(layer)
}

export function onFailureShowNotification (
  transaction: Transaction,
  showNotification: ShowNotificationCallback
): void {
  const error = transaction.getError() as any
  // NOTE if error returns non-200 response, there is no `source` provided (probably because of fetch)
  if (error.source && error.source.errors) {
    return error.source.errors
      .map(error => ({message: error.message, level: 'error'}))
      .forEach(notification => showNotification(notification))
  } else {
    console.error(error)
  }
}

export function getLokka(projectId: string): any {
  const clientEndpoint = `${__BACKEND_ADDR__}/relay/v1/${projectId}`
  const token = cookiestore.get('graphcool_auth_token')
  const headers = { Authorization: `Bearer ${token}` }
  const transport = new Transport(clientEndpoint, { headers })
  return new Lokka({transport})
}

function camelCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function getInputString(fieldValues: {[key: string]: any}): string {
  return fieldValues
    .mapToArray((fieldName, obj) => obj)
    .filter(({value}) => value !== null)
    .filter(({field}) => !field.isReadonly)
    .filter(({field}) => (!isNonScalarList(field)))
    .map(({field, value}) => toGQL(value, field))
    .join(' ')
}

function getAddMutation(modelName: string, fieldValues: {[key: string]: any}, fields: Field[]) {
  const inputString = getInputString(fieldValues)

  const inputArgumentsString = `(input: {${inputString} clientMutationId: "a"})`

  const fieldNames = getFieldsProjection(fields)

  return `
    create${modelName}${inputArgumentsString} {
      ${camelCase(modelName)} {
        ${fieldNames}
      }
    }
  `
}

export function addNode(lokka: any, modelName: string, fieldValues: { [key: string]: any }, fields: Field[]): Promise<any> {

  const mutation = `
    {
      ${getAddMutation(modelName, fieldValues, fields)}
    }
  `
  return lokka.mutate(mutation)
}

export function addNodes(lokka: any, modelName: string, fieldValueArray: {[key: string]: any}[], fields: Field[]): Promise<any> {
  const mutations = fieldValueArray.map((value, index) => `add${index}: ${getAddMutation(modelName, value, fields)}`)
  return lokka.mutate(`{${mutations.join('\n')}}`)
}

export function updateNode(lokka: any, modelName: string, value: TypedValue,
                           field: Field, nodeId: string): Promise<any> {
  const mutation = `
    {
      update${modelName}(
        input: {
          id: "${nodeId}"
          clientMutationId: "a"
          ${toGQL(value, field)}
        }
      ) {
        ${camelCase(modelName)} {
          id
        }
      }
    }
  `
  return lokka.mutate(mutation)
}

export function deleteNode(lokka: any, modelName: string, nodeId: string): Promise<any> {
  const mutation = `
    {
      delete${modelName}(
        input: {
          id: "${nodeId}"
          clientMutationId: "a"
        }
      ) {
        deletedId
      }
    }
  `
  return lokka.mutate(mutation)
}

function getFieldsProjection(fields: Field[], subNodeLimit: number = 3) {
  return fields
    .map((field) => isScalar(field.typeIdentifier)
      ? field.name : field.isList
      ? `${field.name} (first: ${subNodeLimit}) { edges { node { id } } }`
      : `${field.name} { id }`)
    .join(' ')
}

export function queryNodes(lokka: any, modelNamePlural: string, fields: Field[], skip: number = 0, first: number = 50,
                           filters: Immutable.Map<string, any> = Immutable.Map<string, any>(),
                           orderBy?: OrderBy, subNodeLimit: number = 3): Promise<any> {

  const fieldNames = getFieldsProjection(fields, subNodeLimit)

  const filterQuery = filters
    .filter((v) => v !== null)
    // TODO uncomment this when the count bug is fixed
    .map((value, fieldName) => fields.find(x => x.name === fieldName).typeIdentifier === 'String'
      ? `${fieldName}_contains: ${value}`
      : `${fieldName}: ${value}`)
    .map((value, fieldName) => `${fieldName}: ${value}`)
    .join(' ')

  const filter = filterQuery !== '' ? `filter: { ${filterQuery} }` : ''
  const orderByQuery = orderBy ? `orderBy: ${orderBy.fieldName}_${orderBy.order}` : ''
  const query = `
    {
      viewer {
        all${modelNamePlural}(first: ${first} skip: ${skip} ${filter} ${orderByQuery}) {
          edges {
            node {
              ${fieldNames}
            }
          }
          count
        }
      }
    }
  `
  return lokka.query(query)
}
