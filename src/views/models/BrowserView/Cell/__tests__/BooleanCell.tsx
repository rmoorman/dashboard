import * as React from 'react' // tslint:disable-line
import BooleanCell from '../BooleanCell'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

test('BooleanCell renders', () => {

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
    typeIdentifier: 'Boolean',
    relatedModel: null,
  }

  const component = shallow(
    <BooleanCell
      value={false}
      save={save}
      cancel={cancel}
      onKeyDown={onKeyDown}
      field={field}
    />
  )

  expect(shallowToJson(component)).toMatchSnapshot()

})
