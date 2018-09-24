import React from 'react'
import configureStore from 'redux-mock-store'
import Enzyme, { shallow, mount } from 'enzyme'
import CFSelect from './index'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

const config = configureStore()
const default_state = {
  foo: 'bar',
}

describe('CFSelect self closing tags', () => {
  let mockStore, wrapper
  beforeEach(() => {
    mockStore = config(default_state)
  })

  test('1. RootState', () => {
    wrapper = shallow(<CFSelect store={mockStore} />)
    expect(wrapper.props().state).toEqual(default_state)
  })

  test('2. selector with a function', () => {
    wrapper = shallow(
      <CFSelect
        store={mockStore}
        selector={foo => ({ hello: 'world', ...foo })}
      />
    )
    expect(wrapper.props().state).toEqual({ hello: 'world', ...default_state })
  })

  test('3. selector with an object with values as a function', () => {
    wrapper = shallow(
      <CFSelect
        store={mockStore}
        selector={{ func: foo => ({ hello: 'world', ...foo }), get: 'foo' }}
      />
    )
    expect(wrapper.props().state.func.hello).toEqual('world')
    expect(wrapper.props().state.get).toEqual('foo')
  })

  test('4. Selector with array with values as a function', () => {
    wrapper = shallow(
      <CFSelect
        store={mockStore}
        selector={[foo => ({ hello: 'world', ...foo }), 'foo']}
      />
    )
    expect(wrapper.props().state[0].hello).toEqual('world')
    expect(wrapper.props().state[1]).toEqual('foo')
  })

  test('6. Selector with undefined (should render null)', () => {
    wrapper = mount(<CFSelect store={mockStore} selector={() => undefined} />)
    expect(wrapper.text()).toBe(null)
  })

  test('7. Selector with string', () => {
    wrapper = mount(<CFSelect store={mockStore} selector={'hello'} />)
    expect(wrapper.text()).toBe('hello')
  })

  test('8. Selector with number', () => {
    wrapper = mount(<CFSelect store={mockStore} selector={123} />)
    expect(wrapper.text()).toBe('123')
  })

  test('9. As prop of another component', () => {
    function RenderTitle(props) {
      return <div>{props.title}</div>
    }

    wrapper = mount(
      <RenderTitle title={<CFSelect store={mockStore} selector={123} />} />
    )
    expect(wrapper.text()).toEqual('123')
  })
})

describe('CFSelect Render Props', () => {
  let mockStore, wrapper
  beforeEach(() => {
    mockStore = config({ count: 10 })
  })

  test('1. render props with string that renders string', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => 'hello'}>
        {state => state + ' world'}
      </CFSelect>
    )
    expect(wrapper.text()).toEqual('hello world')
  })

  test('2. render props with string that renders component', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => 'hello'}>
        {state => <div>{state}</div>}
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
    expect(wrapper.text()).toEqual('hello')
  })

  test('3. render props with number', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => 123}>
        {state => state}
      </CFSelect>
    )
    expect(wrapper.text()).toEqual('123')
  })

  test('4. render props with number', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => 123}>
        {state => state}
      </CFSelect>
    )
    expect(wrapper.text()).toEqual('123')
  })
})

describe('CFSelect Conditional Render', () => {
  let mockStore, wrapper
  beforeEach(() => {
    mockStore = config({})
  })

  test('0. no selector', () => {
    wrapper = mount(
      <CFSelect store={mockStore}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('1. true', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={true}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('2. false', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={false}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('3. function that returns true', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => true}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('4. function that returns false', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => false}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('5. object with truthy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={{ 1: true, 2: () => true }}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('5. object with falsy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={{ 1: true, 2: () => false }}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('6. array with truthy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={[true, true, () => true]}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('7. array with falsy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={[true, false, () => true]}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('8. multiple children', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={true}>
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(3)
  })
})
