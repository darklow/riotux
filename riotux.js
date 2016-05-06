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
    var _currentState
      , _state_muttable // the copy of immutable state from store
    ;
    /**
     * @name  the store state and mutations
     * @type { Object }
     */
    var _store_immutable = {
      dispatch: function ( name ) {
        var _slice = Array.prototype.slice.call(arguments, 1)
          , state = [_state_muttable]
          , args = state.concat(_slice)
        ;
        return Promise
          .resolve(_store_immutable.mutations[name].apply(null, args))
          .then(function ( ) {
            _store_immutable.update();
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
        _store_immutable.tags.push({ component: component, states: states, handler:handler });
      },
      /**
       * @name  unsubscribe
       * @description Unsubscribre the component for states changes
       * @param  { Component instance } tag Your component
       */
      unsubscribe: function ( tag ) {
        _store_immutable.tags.forEach(function( el, i ) { 
          if ( el.component === tag ) {
            _store_immutable.tags.splice(i, 1);
          }
        });
      },
      /**
       * @name update
       * @description Execute the component handler, because the state changed
       */
      update: function ( ) {
        _store_immutable.tags.forEach(function ( el, index, arr ) {
          if ( el.states.indexOf(_currentState) !== -1 ) {
            if (typeof el.handler === "function") {
              el.handler( _currentState, _state_muttable[_currentState] );
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
      this.actions = {};
    };

    riotux.prototype = {
      listen: function ( callback ) {
        _store_immutable.addListener( callback );
      },

      /**
       * @name subscribe
       * @description subscribe the tag to update when the states changes
       * @param  { String } [component] The Component instance
       * @param { Array } states The states that your component listen
       * @param { Function } handler The function that you use to update your component when the each state change
       */
      subscribe: function ( component, states, handler ) {
        _store_immutable.subscribe(component, states, handler);
      },
      /**
       * @name unsubscribe
       * @description unsubscribe component for states changes
       * @param  { string } component The Component instance
       */
      unsubscribe: function ( component ) {
        _store_immutable.unsubscribe(component);
      },
      /**
       * @name Store
       * @param  { object } data The data that contain the store mutations and state
       * @return { object } Return the store
       */
      Store: function ( data ) {
        _store_immutable = Object.assign(_store_immutable, data);
        _state_muttable = Object.assign({}, _store_immutable.state);
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
        var store_to_action = { dispatch: _store_immutable.dispatch }
          , store = [store_to_action]
          , args
        ;
        if (_store_immutable.state[_currentState] !== undefined ) {
          args = store.concat(Array.prototype.slice.call(arguments, 2));
          this.actions[arguments[1]].apply(null, args);
        } else {
          args = store.concat(Array.prototype.slice.call(arguments, 1));
          this.actions[arguments[0]].apply(null, args);
        }
      },
      /**
       * @name getter
       * @param  { string } name The name of Muttable state
       */
      getter: function ( name ) {
        return _state_muttable[name];
      },
      /**
       * @name getter
       * @param  { string } name The name of Immutable state
       */
      immutable: function ( name ) {
        return _store_immutable.state[name];
      }
    };
    return new riotux;
  });