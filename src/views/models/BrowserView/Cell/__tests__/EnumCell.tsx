import * as React from 'react' // tslint:disable-line
import EnumCell from '../EnumCell'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

test('EnumCell renders', () => {

  const save = jest.fn((value: TypedValue) => { /* */ })
  const cancel = jest.fn()
  const onKeyDown = jest.fn()
  const field = {
    id: 'cip3p48sj001e1jsmghwkdt2k',
    name: 'description',
    description: '',
    isReadonly: true,
    isList: false,
    isSystem: true,
    typeIdentifier: 'Enum',
    enumValues: ['asd', 'def']
    relatedModel: null,
  }

  const component = shallow(
    <EnumCell
      value='asd'
      save={save}
      cancel={cancel}
      onKeyDown={onKeyDown}
      field={field}
    />
  )

  expect(shallowToJson(component)).toMatchSnapshot()

})
