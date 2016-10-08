import * as moment from 'moment'
import {ISO8601} from './constants'

export function randomString(length: number): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export function isValidUrl(str: string): boolean {
  const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) // tslint:disable-line
  return pattern.test(str)
}

export function isValidDateTime(dateTime: string): boolean {
  // returns whether the string conforms to ISO8601
  // the strict format is '2016-05-19T17:09:24.123Z' but we also accept simpler versions like '2016'
  return moment.utc(dateTime, ISO8601).isValid()
}

export function isValidEnum(value: string): boolean {
  return /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(value)
}

export function debounce(func, wait) {
  let timeout
  return (...args) => {
    const context = this
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
