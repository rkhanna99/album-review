
# PROJECT NAME

---

Name: Rahul Khanna

Date: 5/11/2020

Project Topic: Album Reviews

URL: I couldn't get Heroku to work so I'm just using submit server

---


### 1. Data Format and Storage

- For this project I stored data using MongoDB
- I had a total of 3 Schemas

albumReviewSchema:
```javascript
{
  album_name: String,
  artist: String,
  year_released: Number,
  genre: String,
  standout_tracks: [String],
  rating: Number,
  review: String,
  review_info: reviewInfoSchema
}
```

albumReviewSchema:
```javascript
{
  album_name: String,
  artist: String,
  year_released: Number,
  genre: String,
  standout_tracks: [String],
  rating: Number,
  review: String,
  review_info: reviewInfoSchema
}
```

reviewInfoSchema:
```javascript
{
  reviewer_name: String,
  review_date: String,
  reviewer_email: String
}
```

reviewInfoSchema:
```javascript
{
  reviewer_name: String,
  review_date: String,
  reviewer_email: String
}
```

popularSongsSchema:
```javascript
{
  song_name: String,
  song_artist: String,
  song_genre: String
}
```

### 2. Add New Data/API

HTML form route album review: `/create`

HTML form route popular song: `/createSong`

POST endpoint route album review: `/api/albums`

POST endpoint route popular song: `/api/songs`

DELETE endpoint album review(By album_name): `/api/deletealbum`

DELETE endpoint popular song(By song_name): `/api/deletesong`

Example Node.js POST request to endpoint:
```javascript
var request = require("request");

var options = {
    method: 'POST',
    url: 'http://localhost:3000/api/...',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      album_name:'After Hours',
      artist:'The Weeknd',
      year_released:2020,
      genre:'R&B/Soul',
      standout_tracks:[
         "Hardest to Love",
         "Escape from LA",
         "Faith",
         "Blinding Lights",
         "In Your Eyes",
         "After Hours"
      ],
      rating:89,
      review:"<p>Abel Tesfaye finally delivers on his long-running vision, leveraging a self-loathing villain into an irresistible, cinematic narrative with his most satisfying collision of new wave, dream pop, and R&B.</p>",
      review_info:{reviewer_name: 'Rahul Khanna', review_date: '05/02/2020', reviewer_email: 'rkhanna@umd.edu'}
    }
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getallreviews`

### 4. Search Data

Search Field: album_name

### 5. View Data/Navigation Pages/Chat Room

Navigation Filters
1. R&B/Soul -> `/R&B`
2. Hip-Hop/Rap -> `/Hip-Hop`
3. Albums Rated 90+ -> `/90rated`
4. Alphabetical -> `/Alphabetical`
5. Released in 2020 -> `/2020`
6. Popular Songs -> `/popularsongs`
7. Chat Room -> `/chat`
8. About Me -> `/aboutme`

### 6. Modules

- I created a directory called utilities and in that I have a file called helper.js which
has a function that I use for sorting the albums in alphabetical order.

### 7. NPM Packages

- The 2 NPM packages I used were validator and inspirational-quote. Specifically for
inspirational-quote you can see it being used at the bottom of the home page where a
random inspirational quote is printed. There is also a random inspirational quote printed
in the about me page.

### 8. Live Updates

- I attempted to use Live updates, the code can be seen in index.js, main.handlebars, and
chat.handlebars.
