# CFSelect [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Stop%20using%20Redux%20connect.%20Use%20CFSelect.&url=https://github.com/CodeFusionTech/CFSelect&hashtags=cfselect,cf-select,selector,redux,connect,react-redux,react,react-native)

## Rethinking `connect`

CFSelect abstracts away react-redux's `connect` using the power of render props. By using CFSelect instead of `connect` your code will be cleaner and faster.

This library is already being used in production at CodeFusion and works with both ReactDOM and React Native.

## Index

- [Getting Started](#getting-started)
- [Replacing Connect](#replacing-connect)
- [Conditional Element Render](#conditional-element-render)
- [Avoiding Rerender](#avoiding-rerender)
- [Takeaways](#takeaways)
- [Future Roadmap](#future-roadmap)

## Getting Started

```sh
npm i -S cf-select
```

or

```sh
yarn add cf-select
```

## Replacing Connect

Before

```jsx
import React from 'react'
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    return <span>Welcome {this.props.email}</span>
  }
}

connect(state => ({ email: state.login.email }))(App)
```

Using CFSelect

```jsx
import React from 'react'
import CFSelect from 'cf-select'

class App extends React.Component {
  render() {
    return (
      <CFSelect selector={state => state.login.email}>
        {email => <span>Welcome {email}</span>}
      </CFSelect>
    )
  }
}
```

Equivalently you can also write using self closing tag

```jsx
import React from 'react'
import CFSelect from 'cf-select'

class App extends React.Component {
  render() {
    return (
      <span>
        Welcome <CFSelect selector={state => state.login.email} />
      </span>
    )
  }
}
```

Multiple states from Redux using object

```jsx
import React from 'react'
import CFSelect from 'cf-select'

class App extends React.Component {
  render() {
    return (
      <CFSelect
        selector={{
          email: state => state.login.email,
          name: state => state.login.name,
        }}
      >
        {({ email, name }) => (
          <Text>
            Welcome {name} {email}
          </Text>
        )}
      </CFSelect>
    )
  }
}
```

Multiple states from Redux using array

```jsx
import React from 'react'
import CFSelect from 'cf-select'

class App extends React.Component {
  render() {
    return (
      <CFSelect
        selector={[state => state.login.email, state => state.login.name]}
      >
        {([email, name]) => (
          <Text>
            Welcome {name} {email}
          </Text>
        )}
      </CFSelect>
    )
  }
}
```

Equivalently you can just use two self-closing tag

```jsx
import React from 'react'
import CFSelect from 'cf-select'

class App extends React.Component {
  render() {
    return (
      <span>
        Welcome
        <CFSelect selector={state => state.login.name} />
        <CFSelect selector={state => state.login.email} />
      </span>
    )
  }
}
```

Using selectors

```jsx
import * as selectors from './selectors'
 ...
return (
  <CFSelect
    selector={{
      email: state => selectors.getEmail(state),
      name: state => selectors.getName(state),
    }}
  >
    {({ email, name }) => (
      <Text>
        Welcome {name} {email}
      </Text>
    )}
  </CFSelect>
)
```

## What about `dispatch`?

There is a huge misconception in react community that dispatch is only available through using connect. However, if you know that you will never support server-sided rendering we recommend importing dispatch directly.

We still recommend using action creators rather than using dispatch directly in your UI Component.

If you need to support server-side rendering you will have to use connect to have access to dispatch, until we support optional withDispatch props.

Before

```jsx
class A extends React.Component {
  render() {
    return (
      <button onClick={()=> this.props.dispatch(...)} />
    )
  }
}

connect()(A)
```

After

```jsx
// src/store.js
import { createStore } from 'redux'
const store = createStore(...)
const { dispatch, getState } = store
export { dispatch, getState }

// App.js
import { dispatch } from 'src/store'

class A extends React.Component {
  render() {
    return (
      <button onClick={()=> dispatch(...)} />
    )
  }
}
```

## I need access to redux state during some event (ie. button press)

Again, there is a huge misconception in react community that you need connect or in this case CFSelect to have access to redux state during some event.

Unless you need to support server-sided rendering, you can import getState directly from the store.

Before

```jsx
class App extends React.Component {
  render() {
    return <button onClick={this.handleButton}>Welcome</button>
  }
  handleButton = () => {
    actions.uploadToServer(this.props.email)
  }
}

connect(state => ({ email: state.login.email }))(App)
```

After

```jsx
// src/store.js
import { createStore } from 'redux'
const store = createStore(...)
const { dispatch, getState } = store
export { dispatch, getState }

// App.js
import { getState } from 'src/store'

class App extends React.Component {
  render() {
    return <button onClick={this.handleButton}>Welcome</button>
  }
  handleButton = () => {
    actions.uploadToServer(getState().login.email)
  }
}
```

You do NOT need connect or CFSelect unless your UI depends on the redux state.

Similarily, we recommend using selectors so that your UI component isn't coupled to the structure of your redux store.

Just as an example

```jsx
// actions.js
import {dispatch, getState} from 'src/store'

export const uploadEmailToServer = () {
  // I recommend using selector instead of state.login.email
  const email = getState().login.email
  api.uploadEmailToServer(email)
}

// App.js
import * as actions from 'src/actions'

class App {
  ...
  handleButton = () => {
    actions.uploadEmailToServer()
  }
}
```

Instead of using pure function selectors (which requires root state as parameter), I recommend it having access to state directly and creating actions that returns part of the reduxState.

```jsx
import {dispatch, getState} from 'src/store'

export const getEmail = () => {
  return getState().login.email
}

export const uploadEmailToServer = () {
  return api.uploadEmailToServer(getEmail())
}
```

## Conditional Element Render

In React, we often want to render a React Element if and only if certain condition is met. Most often than not we use inline conditional render using `&&`

```jsx
render() {
  return (
    <div>
      {this.state.isLoggedIn && (
        <span>Welcome XXX</span>
      )}
    </div>
  )
}
```

However, we soon realize things get a little messy as we write more things

```jsx
// Error: cannot render undefined
state = {email: undefined}
render() {
  return (
    <div>
      {this.state.email && (
        <span>Welcome {this.state.email}</span>
      )}
    </div>
  )
}
```

```jsx
// Why are we rendering empty string?
state = {email: ''}
render() {
  return (
    <div>
      {this.state.email && (
        <span>Welcome {this.state.email}</span>
      )}
    </div>
  )
}
```

```jsx
// Oh wait, we can't have multiple React Elements
render() {
  return (
    <div>
      {this.state.isLoggedIn && (
        <span>Welcome XXX</span>
        <span>You rock!</span>
      )}
    </div>
  )
}

// This is horrible
render() {
  return (
    <div>
      {this.state.isLoggedIn && (
        <span>Welcome XXX</span>
      )}
      {this.state.isLoggedIn && (
        <span>You rock!</span>
      )}
    </div>
  )
}

// This is even worse
render() {
  return (
    <div>
      {this.state.isLoggedIn && (
        [<span key={0}>Welcome XXX</span>,
        <span key={1}>You rock!</span>]
      )}
    </div>
  )
}

// Damn now I have to fix styling
render() {
  return (
    <div>
      {this.state.isLoggedIn && (
        <div>
          <span>Welcome XXX</span>
          <span>You rock!</span>
        </div>
      )}
    </div>
  )
}
```

Using CFSelect, you can also do Conditional Element Render. Your element will only render if selector value is truthy

```jsx
render() {
  return (
    <CFSelect selector={this.state.isLoggedIn}>
      <span>Welcome XXX</span>
      <span>You rock!</span>
    </CFSelect>
  )
}
```

And yes, your condition can depend on redux state as well

```jsx
render() {
  return (
    <CFSelect selector={state => state.login.isLoggedIn}>
      <span>Welcome XXX</span>
      <span>You rock!</span>
    </CFSelect>
  )
}
```

You can also do Conditional Element Render based on multiple states using array or object.

Your Element will only render if all of values in array or object evaluates to truthy (and yes it can be a function with Redux state)

```jsx
render() {
  return (
    <CFSelect
      selector={
        [state => state.login.isLoggedIn, state => !state.login.isBanned]}>
      <span>Welcome XXX</span>
      <span>You rock!</span>
    </CFSelect>
  )
}
```

To Conditionally Render with falsy values, use `selectorNot` props. Like selector, selectorNot will accept true, false, array, and objects.

```jsx
render() {
  return (
    <CFSelect
    selectorNot={state => state.login.isBanned}
    selector={state => state.login.isLoggedIn}>
      <span>Welcome XXX</span>
      <span>You rock!</span>
    </CFSelect>
  )
}
```

WARNING: If your Conditional Element Render depends on the redux state, you must pass a function as selector or selectorNot (or function as part of array or object values). Failing to do so will cause your CFSelect to not properly re-render the child component unless its parent Component re-renders.

For instance: DO NOT DO

```jsx
render() {
  return (
    <CFSelect
    // Do not do this, your child component will not re-render unless parent component of CFSelect re-renders
    selector={getState().login.isLoggedIn}>
      <span>Welcome XXX</span>
      <span>You rock!</span>
    </CFSelect>
  )
}
```

As a fallback, not providing selector props will render props with root state

```jsx
return <CFSelect>{state => <span>Welcome {state.login.email}</span>}</CFSelect>
```

## Avoiding Rerender

CFSelect already optimizes your code such that re-render is localized to the specific component rather than entire component that you have connected.

However, to further optimize and avoid unneccesary creation of arrow functions and re-renders when the parent component re-renders, you can use popular method that React community uses

```jsx
class App extends React.Component {
  render() {
    return (
      <CFSelect selector={state => state.login.email}>
        {this.renderEmailText}
      </CFSelect>
    )
  }
  renderEmailText = email => {
    return <span>Welcome {email}</span>
  }
}
```

Note that using above method will only re-render EmailText when email changes, therefore if your emailText depends on any other state or prop, you must pass that as argument through selector prop.

```jsx
// Don't do this, your EmailText won't re-render when only this.state.name changes.
class App extends React.Component {
  render() {
    return (
      <CFSelect selector={state => state.login.email}>
        {this.renderEmailText}
      </CFSelect>
    )
  }
  renderEmailText = email => {
    return (
      <span>
        Welcome {this.state.name} {email}
      </span>
    )
  }
}
// Do this instead
class App extends React.Component {
  render() {
    return (
      <CFSelect
        selector={state => ({
          name: this.state.name,
          email: state.login.email,
        })}
      >
        {this.renderEmailText}
      </CFSelect>
    )
  }
  renderEmailText = ({ name, email }) => {
    return (
      <span>
        Welcome {name} {email}
      </span>
    )
  }
}
```

### What does CF stand for?

CF stands for CodeFusion. We create premium web and mobile ordering solutions for restaurants.
Please visit https://codefusion.tech for more information.

## Takeaways

1. Import dispatch from the store
2. Use getState from the store for state dependent event, or use actions with getState built in.
3. Use CFSelect for UI that depends on the redux state.
4. Conditional Element Render using CFSelect

## Future Roadmap

- [x] Conditional Element Render selectorNot props
- [ ] Conditional Element Render selectorOr props
- [ ] Conditional Element Render selectorNotOr props
- [ ] Allow context to be passed as props to override state from context rather than react-redux's Provider
- [ ] Access to dispatch with optional withDispatch props
- [ ] Self Closing tag supporting array of values
- [ ] Remove lodash dependency
- [ ] Performance tests
- [x] Unit tests
- [ ] CI running tests and releases
- [ ] Types (FlowTypes, TypeScript, PropTypes)
- [ ] Example project (React Web, React Native)

## Breaking changes proposal for 2.0

`Conditional Element Render` will no longer work with `selector` props and will be replaced with `ifSo` props. This allows both selector and ifSo to be used in conjunction. `selectorNot` will be replaced with `ifNot`. `ifSoOr` and `ifNotOr` will also be added.

Please help with any of the above future maps, bugs, and spelling mistakes.
Any PR or feedbacks are welcome.

Thank you!
