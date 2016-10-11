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

if (!Element.prototype.hasOwnProperty('scrollIntoViewIfNeeded')) {
  Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
    centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded

    let parent = this.parentNode
    let parentComputedStyle = window.getComputedStyle(parent, null)
    let parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width'), 10)
    let parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width'), 10)
    let overTop = this.offsetTop - parent.offsetTop < parent.scrollTop
    let overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) >
        (parent.scrollTop + parent.clientHeight)
    let overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft
    let overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) >
        (parent.scrollLeft + parent.clientWidth)
    let alignWithTop = overTop && !overBottom

    if ((overTop || overBottom) && centerIfNeeded) {
      parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2
        - parentBorderTopWidth + this.clientHeight / 2
    }

    if ((overLeft || overRight) && centerIfNeeded) {
      parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2
        - parentBorderLeftWidth + this.clientWidth / 2
    }

    if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
      this.scrollIntoView(alignWithTop)
    }
  }
}
