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

  test('1a. selector true', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={true}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('1b. selectorNot false', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={false}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('2a. selector false', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={false}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('2b. selectorNot true', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={true}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('3a. selector function that returns true', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => true}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('3b. selectorNot function that returns false', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={() => false}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('4a. selector function that returns false', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={() => false}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('4b. selectorNot function that returns true', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={() => true}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('5a. selector object with truthy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={{ 1: true, 2: () => true }}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('5b. selectorNot object with falsy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={{ 1: false, 2: () => false }}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('6a. selector object with one or more falsy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={{ 1: true, 2: () => false }}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('6b. selectorNot object with one or more truthy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={{ 1: false, 2: () => true }}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('7a. selector array with truthy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={[true, true, () => true]}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('7b. selectorNot array with falsy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={[false, false, () => false]}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(1)
  })

  test('8a. selector array with one or more falsy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={[true, false, () => true]}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('8b. selectorNot array with one or more truthy', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={[false, true, () => false]}>
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('9a. selector multiple children', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={true}>
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(3)
  })

  test('9b. selectorNot multiple children', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selectorNot={false}>
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(3)
  })

  test('10. selector true and selectorNot false rendering multiple children', () => {
    wrapper = mount(
      <CFSelect store={mockStore} selector={true} selectorNot={false}>
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(3)
  })

  test('11. selector object and selectorNot object rendering multiple children', () => {
    wrapper = mount(
      <CFSelect
        store={mockStore}
        selector={{ 1: true, 2: () => true }}
        selectorNot={{ 1: false, 2: () => false }}
      >
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(3)
  })

  test('11. selector array and selectorNot array rendering multiple children', () => {
    wrapper = mount(
      <CFSelect
        store={mockStore}
        selector={[true, true, () => true]}
        selectorNot={[false, false, () => false]}
      >
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(3)
  })

  test('12. selector truthy and selectorNot truthy rendering multiple children', () => {
    wrapper = mount(
      <CFSelect
        store={mockStore}
        selector={[true, true, () => true]}
        selectorNot={[true, true, () => true]}
      >
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })

  test('13. selector falsy and selectorNot falsy rendering multiple children', () => {
    wrapper = mount(
      <CFSelect
        store={mockStore}
        selector={[false, false, () => false]}
        selectorNot={[false, false, () => false]}
      >
        <div />
        <div />
        <div />
      </CFSelect>
    )
    expect(wrapper.find('div')).toHaveLength(0)
  })
})
