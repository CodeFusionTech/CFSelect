import React from 'react'
import { connect } from 'react-redux'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import mapValues from 'lodash/mapValues'
// 1. RootState
// <CFSelect>{rootState=><Text>{rootState.restaurant.name}</Text>}</CFSelect>

// 2. selector as a function
// <CFSelect selector={state=>state.restaurant}>{restaurantState=><Text>{restaurantState.name}</Text></CFSelect>
// Or simply use selector from actions
// <CFSelect selector={dispatch.restaurant.getRestaurant}>{restaurantState=><Text>{restaurantState.name}</Text></CFSelect>

// 3. selector as an object with values as a function
// <CFSelect selector={{
//    loading: dispatch.restaurant.getLoading,
//    name: dispatch.restaurant.getName,
//  }}>{({loading, name})=><Text>{loading ? 'loading...' : name}</Text>}</CFSelect>

const mapState = (state, props) => {
  // 1. If selector is missing, return rootState
  if (!props.hasOwnProperty('selector')) {
    return { state }
  }
  // 2. If selector is a function, use selector function to return a slicedState
  const { selector } = props
  if (isFunction(selector)) {
    return {
      state: selector(state),
    }
  }
  // 3. If selector is an object, use values as selector function to return slicedState object
  if (isPlainObject(selector)) {
    return {
      state: mapValues(selector, v => isFunction(v) ? v(state) : v),
    }
  }
  // 4. If selector is an array, use values as selector function to return slicedStates array
  if (isArray(selector)) {
    return {
      state: selector.map(v => (isFunction(v) ? v(state): v)),
    }
  }
  // 5. Just return selector as if it is a state
  return { state: selector }
}

export default connect(mapState)(
  class CFSelect extends React.Component {
    render() {
      const { state, children, ...props } = this.props
      if (children) {
        if (isFunction(children)) {
          // Render Props
          return children(state, props)
        } else {
          // Conditional Render (render only if all selector object values are truthy)
          if (isPlainObject(state)) {
            const values = Object.values(state)
            for (const val of values) {
              if (!val) {
                return null
              }
            }
            return children
          }
          // Conditional Render (render only if all selector array values are truthy)
          if (isArray(state)) {
            for (const val of state) {
              if (!val) {
                return null
              }
            }
            return children
          }
          // Coditional Render only if selector is truthy
          return !state ? null : children
        }
      }
      // Self closing tag
      return state === undefined ? null : state
    }
  }
)
