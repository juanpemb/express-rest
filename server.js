
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Bear = require('./models/bear');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://heroku_7n4vr5nl:e5rtbvppm51lcpnp07a7p5e95t@ds047666.mlab.com:47666/heroku_7n4vr5nl'); // connect to our database


app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


router.route('/bears')
    .post(function(req, res) {
        console.log('post/');
        var bear = new Bear();
        console.log(bear);      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        bear.save(function(err) {
          console.log('start to save bear!!');
            if (err){
                console.log("error");
                res.send(err);
            }

            res.json({ message: 'Bear created!' });
        });

    })
    .get(function(req, res) {
      console.log('get/ ');
        Bear.find(function(err, bears) {
          console.log("start to find bears");
            if (err){
              console.log("errors in bear");
                res.send(err);
            }
        res.json(bears);
    });
});

router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    .put(function(req, res) {

    // use our bear model to find the bear we want
      Bear.findById(req.params.bear_id, function(err, bear) {

      if (err)
        res.send(err);

      bear.name = req.body.name;  // update the bears info

      // save the bear
      bear.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Bear updated!' });
      });
   });
   })
   .delete(function(req, res) {
      Bear.remove({
        _id: req.params.bear_id
      }, function(err, bear) {
        if (err)
          res.send(err);

          res.json({ message: 'Successfully deleted' });
       });
  });

//});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
