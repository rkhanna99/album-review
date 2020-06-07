var mongoose = require('mongoose');
mongoose.Promise=global.Promise;

/*Our first schema will be the reviewer info*/
var reviewInfoSchema = new mongoose.Schema({
  reviewer_name:{
    type: String,
    required: true
  },
  review_date:{
    type: String,
    required: true
  },
  reviewer_email:{
    type: String,
    required: true
  }
});

/*The second schema will be the main album review*/
var albumReviewSchema = new mongoose.Schema({
  album_name:{
    type: String,
    unique: true,
    required: true
  },
  artist:{
    type: String,
    required: true
  },
  year_released:{
    type: Number,
    min: 0,
    max: 2020,
    required: true
  },
  genre:{
    type: String,
    required: true
  },
  rating:{
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  standout_tracks: {
    type: [String],
    required: true
  },
  review:{
    type: String,
    required: true
  },
  review_info: reviewInfoSchema
});

/*Define the schemas as models*/
var Album = mongoose.model('Album', albumReviewSchema);
module.exports = Album;
