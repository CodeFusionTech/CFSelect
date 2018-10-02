import React from 'react'
import { connect } from 'react-redux'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import isArray from 'lodash/isArray'
import mapValues from 'lodash/mapValues'

const getStateFromSelectorProps = (
  state,
  props,
  selectorName,
  defaultState
) => {
  // 1. If selector is missing, return rootState
  if (!props.hasOwnProperty(selectorName)) {
    return { state: defaultState }
  }
  const selector = props[selectorName]
  // 2. If selector is a function, use selector function to return a slicedState
  if (isFunction(selector)) {
    return {
      state: selector(state),
    }
  }
  // 3. If selector is an object, use values as selector function to return slicedState object
  if (isPlainObject(selector)) {
    return {
      state: mapValues(selector, v => (isFunction(v) ? v(state) : v)),
    }
  }
  // 4. If selector is an array, use values as selector function to return slicedStates array
  if (isArray(selector)) {
    return {
      state: selector.map(v => (isFunction(v) ? v(state) : v)),
    }
  }
  // 5. Just return selector as if it is a state
  return { state: selector }
}

const mapState = (state, props) => {
  const selectorState = getStateFromSelectorProps(
    state,
    props,
    'selector',
    state
  ).state
  const selectorNotState = getStateFromSelectorProps(
    state,
    props,
    'selectorNot',
    false
  ).state

  return { state: selectorState, stateNot: selectorNotState }
}

export default connect(mapState)(
  class CFSelect extends React.Component {
    render() {
      const { state, stateNot, children, ...props } = this.props

      if (children) {
        if (isFunction(children)) {
          // Render Props
          return children(state, props)
        } else {
          const stateTruthy = checkIfStateIsTruthy(state)
          const stateNotTruthy = checkIfStateNotIsFalsy(stateNot)
          if (stateTruthy && stateNotTruthy) {
            return children
          } else {
            return null
          }
        }
      }
      // Self closing tag
      return state === undefined ? null : state
    }
  }
)

const checkIfStateIsTruthy = state => {
  // Conditional Render (render only if all selector object values are truthy)
  if (isPlainObject(state)) {
    const values = Object.values(state)
    for (const val of values) {
      if (!val) {
        return false
      }
    }
    return true
  }
  // Conditional Render (render only if all selector array values are truthy)
  if (isArray(state)) {
    for (const val of state) {
      if (!val) {
        return false
      }
    }
    return true
  }
  // Coditional Render only if selector is truthy
  return !state ? false : true
}

const checkIfStateNotIsFalsy = state => {
  // Conditional Render (render only if all selector object values are truthy)
  if (isPlainObject(state)) {
    const values = Object.values(state)
    for (const val of values) {
      if (val) {
        return false
      }
    }
    return true
  }
  // Conditional Render (render only if all selector array values are truthy)
  if (isArray(state)) {
    for (const val of state) {
      if (val) {
        return false
      }
    }
    return true
  }
  // Coditional Render only if selector is truthy
  return !!state ? false : true
}
