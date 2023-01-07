require("dotenv").config();
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
/*Get Homepage */
app.get("/", function (req, res) {
  res.render("index", { title: "Home" });
});

/*get artist-search-results Page*/
app.get("/artist-search", function (req, res) {
  // Get the artist name from the query parameters
  const artist = req.query.artist;

  // Search for artists using the spotifyApi.searchArtists() method
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      // Log the received data from the API
      // console.log('The received data from the API: ', data.body);

      // Render the 'artist-search-results' template and pass the received data as a parameter
      res.render("artist-search-results", { artists: data.body.artists });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      res.render("albums", { albums: data.body.items });
    })
    .catch((error) => {
      console.log("The error while searching artists occurred:", error);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      console.log(data.body.items);
      res.render("tracks", { tracks: data.body.items });
    })
    .catch((error) => {
      console.log("The error while searching tracks occurred:", error);
    });
});

app.listen(3001, () =>
  console.log("My Spotify project running on http://localhost:3001 🎧 🥁 🎸 🔊")
);
