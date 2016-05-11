!function(e,n){"function"==typeof define&&define.amd?define([],n):"undefined"!=typeof module?module.exports=n:e.riotux=n()}(this,
   function ( ) {
    /*!
    --------------------------------
    riotux.js 
    --------------------------------
    + https://luisvinicius167.github.io/riotux/
    + Copyright 2016 Luis Vinícius
    + Licensed under the MIT license
    + Documentation: https://github.com/luisvinicius167/riotux
  */
    'use strict';
    
    /**
     * @name  _currentState
     * @description The current state for state that will be changed
     */
    var _currentState;
    /**
     * Containers
     */
    var _container = [];
    /**
     * @name  the store state and mutations
     * @type { Object }
     */
    var _store = {
      dispatch: function ( name ) {
        var _slice = Array.prototype.slice.call(arguments, 1)
          , state = [_store.state]
          , args = state.concat(_slice)
        ;
        return Promise
          .resolve(_store.mutations[name].apply(null, args))
          .then(function ( ) {
            _store.update();
          });
        },
      /**
       * [tags contain all tags and states]
       * @type {Array}
       */
      tags: [],
      /**
       * @name  subscribe
       * @description Add the tag and the states for the tag
       * update when the states changes
       * @param  { Component instance } component Your component
       * @param  { array } states Array that contain the states
       */
      subscribe: function ( component, states, handler ) {
        _store.tags.push({ component: component, states: states, handler:handler });
      },
      /**
       * @name  unsubscribe
       * @description Unsubscribre the component for states changes
       * @param  { Component instance } tag Your component
       */
      unsubscribe: function ( tag ) {
        _store.tags.forEach(function( el, i ) { 
          if ( el.component === tag ) {
            _store.tags.splice(i, 1);
          }
        });
      },
      /**
       * @name update
       * @description Execute the component handler, because the state changed
       */
      update: function ( ) {
        _store.tags.forEach(function ( el, index, arr ) {
          if ( el.states.indexOf(_currentState) !== -1 ) {
            if (typeof el.handler === "function") {
              el.handler( _currentState, _store.state[_currentState] );
            }
          }
        });
      }
    };
    /**
     * @desc Central State management inspired in Redux and Flux pattern
     * @function riotux
     */
    function riotux ( ) {
      /**
       * @name actions
       * @description All actions for components call
       * @type {Object}
       */
      this.actions = {}
    }
    
    riotux.prototype = {
      /**
       * @name subscribe
       * @description subscribe the tag to update when the states changes
       * @param  { String } [component] The Component instance
       * @param { Array } states The states that your component listen
       * @param { Function } handler The function that you use to update your component when the each state change
       */
      subscribe: function ( component, states, handler ) {
        _store.subscribe(component, states, handler);
      },
      /**
       * @name unsubscribe
       * @description unsubscribe component for states changes
       * @param  { string } component The Component instance
       */
      unsubscribe: function ( component ) {
        _store.unsubscribe(component);
      },
      /**
       * @name Store
       * @param  { object } data The data that contain the store mutations and state
       * @return { object } Return the store
       */
      Store: function ( data ) {
        _store = Object.assign(_store, data);
      },
      /**
       * Container that works with the Store state
       * 
       */ 
      Container: function ( data ){
      	_container.push(data);
      },
      getContainer: function ( name ) {
      	var container;
      	_container.forEach(function ( el ) {
      		if ( el.name === name ) {
      			container = el;
      		}
      	});
      	return container;
      },
      getter: function ( container, value ) {
	    return this.getContainer(container).state[value];
      },
      /**
       * @name  Actions
       * @param  { object } data The data that contain all actions
       * @return { object } Return actions
       */
      Actions: function ( data ) {
        this.actions = data;
        return this.actions;
      },
      /**
       * @name action
       * @description Emit an action for store dispatcher to change the state
       * @return { void }
       */
      action: function ( ) {
        _currentState = arguments[0];
        // pass just the method dispatch to action
        var store_to_action = { dispatch: _store.dispatch }
          , store = [store_to_action]
          , args
        ;
        if (_store.state[_currentState] !== undefined ) {
          args = store.concat(Array.prototype.slice.call(arguments, 2));
          this.actions[arguments[1]].apply(null, args);
        } else {
          args = store.concat(Array.prototype.slice.call(arguments, 1));
          this.actions[arguments[0]].apply(null, args);
        }
      },
      /**
       * @name getter
       * @param  { string } name The name of state
       */
      getState: function ( name ) {
        return _store.state[name];
      }
    };
    return new riotux;
  });
  
  // Store
  var store = riotux.Store({
  state: {
    count: 1,
    counter: 1,
  },
  mutations: {
    increment: function ( state, n ) {
      state.count += n;
    },
    increment_counter: function ( state, n ) {
      state.counter += n;
      console.log('State #counter changed.');
    },
    add: function ( state, a, b ) {
      return a + b;
    }
  }
});

 // Container
 riotux.Container({
  	name: 'API',
  	
  	state: {
  		count_value: riotux.getState('count')
  	},
  	
  	count: function ( state, n ) {
  		this.state.count_value = state + n;
  		return this.state.count_value;
  	},
  });
  
   // Container
 riotux.Container({
  	name: 'Cart',
  	
  	state: {
  		api: riotux.getState('count')
  	},
  	
  	count: function ( state, n ) {
  		this.state.count_value = state + n;
  		return this.state.count_value;
  	},
  });
  
 console.log(riotux.getContainer('API').count(riotux.getState('count') , 2));
 console.log(riotux.getter('API', 'count_value'), riotux.getState('count'))
