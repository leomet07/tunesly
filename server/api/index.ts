// tslint:disable:no-console
import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();
// Based off of https://github.com/thelinmichael/spotify-web-api-node
// @ts-ignore
import SpotifyWebApi from "spotify-web-api-node";
// credentials are optional
// let spotifyApi = new SpotifyWebApi({});
// credentials are optional
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: process.env.redirectUri,
});

const scopes = ["user-read-private", "user-read-email"];
// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes);

// console.log("auth url " + authorizeURL);

if (process.env.access_token && process.env.refresh_token) {
	console.log("Override token");
	spotifyApi.setAccessToken(process.env.access_token);
	spotifyApi.setRefreshToken(process.env.refresh_token);
} else {
	// Get an access token and 'save' it using a setter
	spotifyApi.clientCredentialsGrant().then(
		(data: any) => {
			// console.log("The access token is " + data.body["access_token"]);

			spotifyApi.setAccessToken(data.body.access_token);
		},
		(err: any) => {
			console.log("Something went wrong!", err);
		}
	);
}
// Get all credentials
console.log("The credentials are ", spotifyApi.getCredentials());

export const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello world from API!");
});
router.get("/get_songs", async (req, res) => {
	// console.log(req.query);
	// let seed_genres = req.query.seed_genres || "acoustic";
	// let uri =
	// 	"https://api.spotify.com/v1/recommendations?seed_genres=" + seed_genres;
	// console.log(uri);

	// await fetch(uri, {
	// 	method: "GET",
	// 	headers: {
	// 		accept: "application/json",
	// 		"content-type": "application/json",
	// 		authorization: "Bearer " + spotifyApi.getAccessToken(),
	// 	},
	// })
	// 	.then((result: any) => {
	// 		return result.json();
	// 	})
	// 	.then((resval: any) => {
	// 		let urls = resval.tracks.map(function (track: any) {
	// 			return track.external_urls.spotify;
	// 		});

	// 		res.send(urls);
	// 	});
	const seedGenres = String(req.query.seed_genres).split(",") || ["acoustic"];
	const songs = await spotifyApi.getRecommendations({
		seedGenres: ["acoustic"],
	});

	console.log(songs);

	const urls = songs.body.tracks.map((track: any) => {
		return track.external_urls.spotify;
	});

	res.json(urls);
});

router.get("/get_genres", async (req, res) => {
	// await fetch(
	// 	"https://api.spotify.com/v1/recommendations/available-genre-seeds",
	// 	{
	// 		method: "GET",
	// 		headers: {
	// 			accept: "application/json",
	// 			"content-type": "application/json",
	// 			authorization: "Bearer " + spotifyApi.getAccessToken(),
	// 		},
	// 	}
	// )
	// 	.then((response) => {
	// 		return response.json();
	// 	})
	// 	.then((resval: any) => {
	// 		return res.send(resval.genres);
	// 	})
	// 	.catch((err) => {
	// 		console.error(err);
	// 	});
	try {
		const seeds = await spotifyApi.getAvailableGenreSeeds();
		res.json(seeds.body.genres);
	} catch (err) {
		res.json(err);
	}
});

router.get("/callback", async (req, res) => {
	// let response_json = null;
	// console.log("callback recieved", req);
	// let body: any = {
	// 	grant_type: "authorization_code",
	// 	code: req.query.code,
	// 	redirect_uri: process.env.redirectUri,
	// };
	// await fetch("https://accounts.spotify.com/api/token", {
	// 	method: "POST",
	// 	body: body,
	// 	headers: {
	// 		Authorization: "Basic " + process.env.clientId,
	// 	},
	// })
	// 	.then((result) => result.text())
	// 	.then((result) => {
	// 		console.log("result", result);
	// 		return res.json(result);
	// 	});

	// Retrieve an access token and a refresh token
	spotifyApi.authorizationCodeGrant(req.query.code).then(
		(data: any) => {
			console.log("The token expires in " + data.body.expires_in);
			console.log("The access token is " + data.body.access_token);
			console.log("The refresh token is " + data.body.refresh_token);

			// Set the access token on the API object to use it in later calls
			spotifyApi.setAccessToken(data.body.access_token);
			spotifyApi.setRefreshToken(data.body.refresh_token);

			return res.json({
				access_token: data.body.access_token,
				refresh_token: data.body.refresh_token,
			});
		},
		(err: any) => {
			console.log("Something went wrong!", err);
		}
	);
});

router.get("/login", (req, res) => {
	// @ts-ignore
	const scopesstr = "user-read-private user-read-email";
	res.redirect(
		"https://accounts.spotify.com/authorize" +
			"?response_type=code" +
			"&client_id=" +
			process.env.clientId +
			"&scope=" +
			encodeURIComponent(scopesstr) +
			"&redirect_uri=" +
			encodeURIComponent(spotifyApi.getRedirectURI())
	);
});