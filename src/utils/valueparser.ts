import {isValidDateTime, isValidEnum} from './utils'
import {Field} from '../types/types'
import {isScalar} from './graphql'
import {TypedValue, NonScalarValue, ScalarValue, AtomicValue} from '../types/utils'

export function valueToString(value: TypedValue, field: Field, returnNullAsString: boolean): string {
  if (value === null) {
    return returnNullAsString ? 'null' : ''
  }

  if (field.isList) {

    if (!isValidList(value)) {
      return returnNullAsString ? 'null' : ''
    }

    const valueArray: Array<AtomicValue> = value as Array<AtomicValue>

    if (listIsEmpty(value as (ScalarValue[] | NonScalarValue[]))) {
      return '[]'
    }

    if (!isStringlyType(field)) {
      return `[${valueArray.map((val) => `${atomicValueToString(val, field, returnNullAsString)}`).join(', ')}]`
    } else {
      return `[${valueArray.map((val) => `"${atomicValueToString(val, field, returnNullAsString)}"`).join(', ')}]`
    }

  } else {
    return atomicValueToString(value as AtomicValue, field, returnNullAsString)
  }
}

function isStringlyType(field: Field): boolean {
  const type = field.typeIdentifier

  switch (type) {
    case 'Enum':
    case 'Boolean':
    case 'Int':
    case 'Float':
      return false
    default:
      return true
  }
}

function isValidList(value: any): boolean {
  // TODO improve this code because it doesn't check if the items are of the same type
  return value instanceof Array
}

function listIsEmpty(value: (Array<AtomicValue>)): boolean {
  return value.length === 0
}

export function atomicValueToString(value: AtomicValue, field: Field, returnNullAsString: boolean = true): string {
  if (value === null) {
    return returnNullAsString ? 'null' : ''
  }

  const type = field.typeIdentifier
  if (!isScalar(type)) {
    return (value as NonScalarValue).id
  }

  switch (type) {
    case 'DateTime':
      return new Date(value).toISOString()
    case 'Password':
      return '***************'
    case 'Json':
      return JSON.stringify(value)
    default:
      return value.toString()
  }
}

export function stringToValue(rawValue: string, field: Field): TypedValue {
  if (rawValue === null) {
    return null
  }
  const {isList, isRequired, typeIdentifier} = field
  if (rawValue === '' && !isRequired) {
    return typeIdentifier === 'String' ? '' : null
  }

  if (!isScalar(typeIdentifier)) {
    if (isList) {
      try {
        let json = JSON.parse(rawValue)
        if (!(json instanceof Array)) {
          throw 'value is not an array'
        }
        for (let i = 0; i < json.length; i++) {
          if (!json[i].hasOwnProperty('id')) {
            throw 'value does not have "id" field'
          }
        }
        return json
      } catch (e) {
        return null // TODO add true error handling
      }
    }
    return {id: rawValue}
  }

  if (isList) {
    if (typeIdentifier === 'Enum') {
      return rawValue.slice(1, -1).split(',').map((value) => value.trim())
    }
    try {
      return JSON.parse(rawValue)
    } catch (e) {
      return null
    }
  } else {
    return {
      String: () => rawValue,
      Boolean: () => rawValue.toLowerCase() === 'true' ? true : rawValue.toLowerCase() === 'false' ? false : null,
      Int: () => isNaN(parseInt(rawValue, 10)) ? null : parseInt(rawValue, 10),
      Float: () => isNaN(parseFloat(rawValue)) ? null : parseFloat(rawValue),
      GraphQLID: () => rawValue,
      Password: () => rawValue,
      Enum: () => isValidEnum(rawValue) ? rawValue : null,
      DateTime: () => isValidDateTime(rawValue) ? rawValue : null,
      Json: () => isJSON(rawValue) ? rawValue : null,
    }[typeIdentifier]()
  }
}

export function getFieldTypeName(field: Field) {
  if (isScalar(field.typeIdentifier)) {
    return field.typeIdentifier
  } else {
    return field.relatedModel.name
  }
}

export function isJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString)
  } catch (e) {
    return false
  }
  return true
}
