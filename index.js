var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var dotenv = require('dotenv');
var marked = require('marked');
var handlebars = require('handlebars');
var exphbs = require('express-handlebars');
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var Album = require('./models/albums');
var Song = require('./models/songs');

/*Two additional npm modules that we will be using*/
var validator = require('validator');
const Quote = require('inspirational-quotes');

// Load envirorment variables
dotenv.config();
console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// Setup Express App
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/*Add some utility functions later here*/
var functions = require('./utilities/helper');
var sort_name = functions.sort_name;

/*Setup for socket.io*/
var http = require('http').Server(app);
var io = require('socket.io')(http);

/*This will be used to display chat messages*/
io.on('connection', function(socket) {
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
});


/*Display the home page with all the album reviews*/
app.get('/', function(req, res) {
  let quote_val = Quote.getRandomQuote();
  console.log(quote_val);
  Album.find({}, function(err, albums) {
    res.render('home', {
      data: albums, quote: quote_val
    });
  });
});

/*Go to the create page to add a new review*/
app.get('/create', function(req, res) {
  res.render('create');
});

/*Go to the create song page to add to the popular*/
app.get('/createSong', function(req, res) {
  res.render('createSong');
});

/*Post endpoint to add an album review*/
app.post('/api/albums', function(req, res) {
  var album_review = new Album({
    album_name: req.body.album_name,
    artist: req.body.artist,
    year_released: parseInt(req.body.year_released),
    genre: req.body.genre,
    rating: parseInt(req.body.rating),
    standout_tracks: req.body.standout_tracks.split(","),
    review: marked(req.body.review),
    review_info: {reviewer_name: req.body.reviewer_name,
      review_date: req.body.review_date, reviewer_email: req.body.reviewer_email}
  });

  /*Save the review to the database*/
  album_review.save(function(err) {
    if (err) throw err;
    return res.send("Album review successfully added");
    res.redirect('/');
  });
});

/*Post endpoint to add to the list of popular songs*/
app.post('/api/songs', function(req, res) {
  var new_song = new Song({
    song_name: req.body.song_name,
    song_artist: req.body.song_artist,
    song_genre: req.body.song_genre
  });

  /*Save the song to the database*/
  new_song.save(function(err) {
    if (err) throw err;
    return res.send("Song successfully added, to view go to /popularsongs nav link");
    res.redirect('/');
  });
});

/*Get all the current reviews*/
app.get('/albums', function(req, res) {
  Album.find({}, function(err, albums) {
    if (err) throw err;
    res.send(albums);
  });
});

/*Delete an album review based off the album name*/
app.delete('/api/deletealbum', function(req, res) {
  Album.findOne({album_name: req.body.album_name}, function(err, album) {
    if (err) throw err;
    if (!album) return res.send('No album with that name');
  });
  Album.deleteOne({album_name: req.body.album_name}, function(err) {
    if (err) throw err;
    res.send("Album review successfully deleted");
    res.redirect('/');
  });
});

/*Delete a song from the popular songs tab based of song name*/
app.delete('/api/deletesong', function(req, res) {
  Song.findOne({song_name: req.body.song_name}, function(err, song) {
    if (err) throw err;
    if (!song) return res.send('No song with that name');
  });
  Song.deleteOne({song_name: req.body.song_name}, function(err) {
    if (err) throw err;
    res.send("Song successfully deleted");
    res.redirect('/');
  });
});

/*Get all the data points as JSON*/
app.get("/api/getallreviews", function(req, res) {
  Album.find({}, function(err, albums) {
    if (err) throw err;
    res.json(albums);
  });
});

/*Get requests for the nav bar*/

/*Nav bar filter that only displays R&B/Soul album reviews*/
app.get('/R&B', function(req, res) {
  let ret = [];
  let title_val = "R&B/Soul Reviews";
  Album.find({}, function(err, albums) {
    for(var i = 0; i < albums.length; i++) {
      if(albums[i].genre === "R&B/Soul") {
        ret.push(albums[i]);
      }
    }
    res.render('filter', {title: title_val, data: ret});
  });
});

/*Nav bar filter that only displays Hip-Hop/Rap album reviews*/
app.get('/Hip-Hop', function(req, res) {
  let ret = [];
  let title_val = "Hip-Hop/Rap Reviews";
  Album.find({}, function(err, albums) {
    for(var i = 0; i < albums.length; i++) {
      if(albums[i].genre === "Hip-Hop/Rap") {
        ret.push(albums[i]);
      }
    }
    res.render('filter', {title: title_val, data: ret});
  });
});

/*Nav bar filter that only diplays albums rated 90 or higher*/
app.get('/90rated', function(req, res) {
  let ret = [];
  let title_val = "Albums that got a 90+ rating";
  Album.find({}, function(err, albums) {
    for(var i = 0; i < albums.length; i++) {
      if(albums[i].rating >= 90) {
        ret.push(albums[i]);
      }
    }
    res.render('filter', {title: title_val, data: ret});
  });
});

/*Nav bar filter to display all the album reviews for albums released in 2020*/
app.get('/2020', function(req, res) {
  let ret = [];
  let title_val = "Albums released in 2020";
  Album.find({}, function(err, albums) {
    for(var i = 0; i < albums.length; i++) {
      if(albums[i].year_released === 2020) {
        ret.push(albums[i]);
      }
    }
    res.render('filter', {title: title_val, data: ret});
  });
});

/*Nav bar filter to display all the album reviews in Alphabetical order*/
app.get('/Alphabetical', function(req, res) {
  let ret = [];
  let placeholder = [];
  let title_val = "All Albums listed in Alphabetical order"
  Album.find({}, function(err, albums) {
    for(var i = 0; i < albums.length; i++) {
      placeholder.push(albums[i]);
    }
    placeholder.sort((val1, val2) => sort_name(val1, val2));
    res.render('filter', {title: title_val, data: placeholder});
  });
});

app.get('/popularsongs', function(req, res) {
  let ret = [];
  let title_val = "List of popular songs recommended by our users";
  Song.find({}, function(err, songs) {
    for(var i = 0; i < songs.length; i++) {
      ret.push(songs[i]);
    }
    res.render('popularSong', {title: title_val, data: ret});
  });
});

/*Render the chat page*/
app.get('/chat', function(req, res) {
  res.render('chat', {});
});

/*Render the about me page*/
app.get('/aboutme', function(req, res) {
  /*Use the npm module to get an inspirational quote that will be rendered*/
  let quote_val = Quote.getRandomQuote();
  console.log(quote_val);
  res.render('about', {quote: quote_val});
});


/*Listen on port 3000*/
app.listen(3000, function() {
    console.log('App listening on port 3000!');
})
