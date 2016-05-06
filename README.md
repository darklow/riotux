# riotux  [![npm package](https://img.shields.io/badge/npm-1.0.6-blue.svg)](https://www.npmjs.com/package/riotux)
> A centralized immutable state management inspired in Flux and Redux.

## Intro
**riotux** is a centralized immutable state management. It is inspired by Flux and Redux, but with simplified concepts.

<p align="center">
  <img src="test/img/react-riotux.gif" alt="react count" width="600">
</p>

### Examples:
<a href="https://github.com/luisvinicius167/riotux-react-count"> React count app example + guide </a><br>
<a href="https://github.com/luisvinicius167/riotux-todo"> Riot Todo app example + guide </a><br>

### Install
* Npm: ``` npm install riotux ```
* Bower: ``` bower install riotux ```
* Cdn: ``` <script src="https://cdnjs.cloudflare.com/ajax/libs/riotux/1.0.6/riotux.min.js"></script> ```


### How it works?
The component triggers action calls. Actions dispatch mutations, that works with a copy of your Store state, that is mutable.
Your **original Store state is immutable**.

### Reasons to use:
* Tiny size: ~1.3kb
* Simple and minimalistic API
* Immutable Store state
* Single state tree
* Unidirectional data flow

### Data Flow
In riotux data flow is unidirectional, as it should be in Flux:

* The component triggers action calls;
* Actions dispatch mutations that will return a new state value without modify your Store state, beacuse works with a copy of your Store;
* New value state returns to your component.

### Principles:
* Immutable Application state is held in the Store, as a single object.
* Mutations works with a copy of your Store state.
* Mutations must be synchronous and Actions can be async.

### Store:
The **Store** is basically a container that holds your application state. There are two things that makes a riotux Store different:

 * The Store are **Imutable**. riotux creates a copy of your Store and all modifications  happens in the copy of your original Store.

 * When some changes happens in the copy of your original Store, your component can observe and can be notified.

Creating a riotux store is pretty straightforward - just provide an initial state object, and some mutations:

```javascript
var store = riotux.Store({
  state: {
    count: 1,
    title: 'riotux is nice!'
  },
  mutations: {
    increment: function ( state ) {
      state.count += 1;
    },
    changeTitle: function ( state, newTitle ) {
      state.title = newTitle;
    }
  }
});
```

#### State
Application state is held in the store, as a single object. **riotux** uses a **single state tree** - that is, this single object contains all your application level state and serves as the *"single source of truth"*. This also means usually you will have only one store for each application.

#### Observe state changes in your Component
> When some state change in your store, your handler function will called.

In your **Component** you just use ``` riotux.subscribe(component, [states], handler) ```. In your hanlder function, you can update your component. **Your handler recieves two arguments: the state name that was changed and the new state value.**

When your component will **unmount**, you can unsubscribe for states changes: ``` riotux.subscribe(component) ```.

```html
<!-- In this example, a Riot Component -->
  <h1> Count: { count } </h1>
  <script>
    var self = this;
    riotux.subscribe(this, 'count', function ( state, state_value ) {
      self.update();
    });

    this.on('update', function ( ) {
      self.count = riotux.getter('count'); // recieves the new state value
    });

    this.on('unmount', function ( ) {
      riotux.unsubscribe(this); // Unsubscribe the observe states
    });
  </script>
```

#### Mutations
The mutations are essentially events: each mutation has a name and a callback. In riotux the callback function will receive the state as the first argument:

```javascript
var store = riotux.Store({
  state: {
    count: 1,
  },
  mutations: {
    increment: function ( state ) {
      state.count += 1;
    }
  }
});
```

You cannot directly call a mutation callback. When an increment event is dispatched, the callback is triggered. To invoke a mutation callback, you need to dispatch a mutation event:

```javascript
  store.dispatch('increment');
```

#### Dispatch with Arguments

```javascript
var store = riotux.Store({
  state: {
    count: 1,
  },
  mutations: {
    increment: function ( state, value ) {
      state.count += value;
    }
  }
});
```

### Actions
Actions are just functions that dispatch mutations. **All actions recieves the store as frist argumets**. The actions will be called from components.

Creating an action:

```javascript
var action = riotux.Actions({
  add: function ( store, number ) {
    store.dispatch('increment', number);
  }
});
```
#### Calling an action on your component

```javascript
  riotux.action('count', 'increment', 10);
```

The ```action``` recieves the **state** that you wants to change as first argument, the ***mutation event name** as the second argument and the values you nedd to pass like arguments to the mutation callback.

### Get the Mutable state
To get the state value of the Store copy, use ```riotux.getter(state_name)``` in your Components. This will return the value
of your muttable store.

### Get the Immutable state
To get the original Store state value, use ```riotux.immutable(state_name)``` in your Components.

### Application Structure
Just suggesting.

```project
├──index.html
├──components
|   ├──component.tag
|   ├──other.tag
├──riotux
|   ├──store.js
|   ├──action.js
```

### API Reference

* #### Store:
  * ``` riotux.Store({ state, mutations }) ```: Create a single store with the state of your application and the mutations functions.

* #### Actions:
  * ``` riotux.Actions({}) ```: Creates all actions of your application.

* #### Component:
  * ``` riotux.subscribe(component, [states], handler( state_name, value )) ```: Subscribe your component to observe the state changes. Every time the state that your component are observing, the handler function will called. In the handle function you can update your component. The ``` handler ``` recieves as first argument the state name that was changed and the value of the state as second argument.

  * ``` riotux.unsubscribe(component) ```: Unsubscribe your component. Your component don't observe the states changes anymore.

  * ``` riotux.action('state', 'event_name' [,args]) ```: Trigger the action for call the mutation store function. The ``` state ``` is the name of state that you wants to change. ``` event_name ``` is the mutation function name and you can pass tha arguments after the ``` event_name ```.

  * ``` riotux.getter(state) ```: Gets a value of the state that you passed as argument.
  
  * ``` riotux.immutable(state) ```: Gets a value of the original state that you passed as argument.


### License
MIT License.
