import {isScalar} from '../../utils/graphql'
import {Field, FieldWidths} from '../../types/types'
import {TypedValue, NonScalarValue, ScalarValue} from '../../types/utils'
import {stringToValue, valueToString, getFieldTypeName} from '../../utils/valueparser'
import calculateSize from 'calculate-size'
import * as Immutable from 'immutable'
import {isNonScalarList} from '../../utils/graphql'

export function emptyDefault(field: Field): TypedValue {

  if (field.isRequired) {
    return null
  }

  const value = function (): any {
    switch (field.typeIdentifier) {
      case 'Int':
        return 0
      case 'Float':
        return 0
      case 'DateTime':
        return new Date().toISOString()
      case 'String':
        return ''
      case 'Boolean':
        return false
      case 'Enum':
        return field.enumValues.length > 0 ? field.enumValues[0] : null
      default:
        return null
    }
  }()

  if (!field.isList) {
    return value
  }

  return []
}

function valueToGQL(value: TypedValue, field: Field): string {
  if (value === null && !field.isRequired) {
    return 'null'
  }

  if (!isScalar(field.typeIdentifier)) {
    if (field.isList && (value as any[]).length === 0) {
      return '"[]"'
    }
    return `"${(value as NonScalarValue).id}"`
  }
  if (field.typeIdentifier === 'Enum') {
    if (field.isList) {
      return `[${(value as ScalarValue[]).join(',')}]`
    }
    return value as string
  }

  return JSON.stringify(value)
}

export function toGQL(value: TypedValue, field: Field): string {
  const key = isScalar(field.typeIdentifier) ? field.name : `${field.name}Id`

  if (value === null && field.isRequired) {
    return ''
  }

  return `${key}: ${valueToGQL(value, field)}`
}

export function compareFields(a: Field, b: Field): number {
  if (a.name === 'id') {
    return -1
  }
  if (b.name === 'id') {
    return 1
  }
  return a.name.localeCompare(b.name)
}

export function getFirstInputFieldIndex(fields: Field[]): number {
  let inputIndex
  const hasInputField = fields.some((field, index) => {
    if (isNonScalarList(field) || field.name === 'id' || field.isReadonly) {
      return false
    } else {
      inputIndex = index
      return true
    }
  })

  if (hasInputField) {
    return inputIndex
  } else {
    return null
  }
}

export function getDefaultFieldValues(fields: Field[]): { [key: string]: any } {
  return fields.filter((f) => f.name !== 'id')
    .mapToObject(
      (field) => field.name,
      (field) => ({
        value: stringToValue(field.defaultValue, field) || emptyDefault(field),
        field: field,
      })
    )
}

export function calculateFieldColumnWidths (width: number,
                                            fields: Field[],
                                            nodes: Immutable.List<Immutable.Map<string, any>>
                                           ): FieldWidths {
  const cellFontOptions = {
    font: 'Open Sans',
    fontSize: '12px',
  }

  const headerFontOptions = {
    font: 'Open Sans',
    fontSize: '12px',
  }

  const widths = fields.mapToObject(
    (field) => field.name,
    (field) => {
      const cellWidths = nodes
      .filter(node => !!node)
      .map(node => node.get(field.name))
      .map(value => valueToString(value, field, false))
      .map(str => calculateSize(str, cellFontOptions).width + 41)
      .toArray()
      const headerWidth = calculateSize(`${field.name} ${getFieldTypeName(field)}`, headerFontOptions).width + 90

      const maxWidth = Math.max(...cellWidths, headerWidth)
      const lowerLimit = 150
      const upperLimit = 400

      return maxWidth > upperLimit ? upperLimit : (maxWidth < lowerLimit ? lowerLimit : maxWidth)
    }
  )

  const totalWidth = fields.reduce((sum, {name}) => sum + widths[name], 0)
  const fieldWidth = width - 34 - 250
  if (totalWidth < fieldWidth) {
    fields.forEach(({name}) => widths[name] = (widths[name] / totalWidth) * fieldWidth)
  }
  return widths
}
