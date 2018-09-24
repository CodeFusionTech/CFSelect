import React from 'react';
import configureStore from 'redux-mock-store';
import Enzyme, { shallow } from 'enzyme';
import CFSelect from './index';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const config = configureStore();
const default_state = {
  foo: "bar"
}

describe('CFSelet test', ()=>{
  let mockStore, wrapper;
  beforeEach(()=>{
    mockStore = config(default_state);
  });

  test('1. RootState', ()=>{
    wrapper = shallow(<CFSelect store={mockStore} />);
    expect(wrapper.props().state).toEqual(default_state);
  });

  test('2. selector as a function', ()=>{
    wrapper = shallow(<CFSelect store={mockStore} selector={foo => ({hello: "world", ...foo})} />);
    expect(wrapper.props().state).toEqual({hello: "world", ...default_state});
  });

  test('3. selector as an object with values as a function', ()=>{
    wrapper = shallow(<CFSelect store={mockStore} selector={{ func: foo => ({hello: "world", ...foo}), get: "foo"}} />);
    expect(wrapper.props().state.func.hello).toEqual("world");
    expect(wrapper.props().state.get).toEqual("foo");
  });
});