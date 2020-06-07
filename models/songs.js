var mongoose = require('mongoose');
mongoose.Promise=global.Promise;

/*This schema will bused for popular songs*/
var popularSongsSchema = new mongoose.Schema({
  song_name:{
    type: String,
    unique: true,
    required: true
  },
  song_artist:{
    type: String,
    required: true
  },
  song_genre:{
    type: String,
    required: true
  }
});

/*Define the schemas as models*/
var Song = mongoose.model('Song', popularSongsSchema);
module.exports = Song;
