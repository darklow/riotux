riot.tag2('balance', '<h1 style="text-align:center;" if="{!name}">Who started the car?</h1> <h1 style="text-align:center;" if="{name}">{name} started the Car!</h1>', '', '', function(opts) {
    var self = this;

    self.on('mount', function(){
      riotux.trigger('personStore', 'startCar', 'You');
    });

    riotux.listen('carMoving', function ( person ) {
      self.name = person;
      setTimeout(function(){
        self.update();
      }, 2000);
    });
}, '{ }');