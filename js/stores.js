/** Add the Stores */
var carStore = new CarStore();
riotux.addStore('carStore', carStore);

var personStore = new PersonStore();
riotux.addStore('personStore', personStore);


/** Stores */
function CarStore ( ) {
  riot.observable(this);
  // listen to 'start' event
  this.on('start', function ( person ) {
    riotux.emmit('carMoving', person);
  });
};

function PersonStore ( ) {
  riot.observable(this);

  // listen to 'startCar' event
  this.on('startCar', function ( person ) {
    riotux.trigger('carStore', 'start', person);
  });
};