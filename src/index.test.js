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

  test('Component returns default state if no selector presents', ()=>{
    wrapper = shallow(<CFSelect store={mockStore} />);
    expect(wrapper.props().state).toBe(default_state);
  });
});