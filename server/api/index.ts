// tslint:disable:no-console
import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();
// Based off of https://github.com/thelinmichael/spotify-web-api-node
// @ts-ignore
import SpotifyWebApi from "spotify-web-api-node";
// let SpotifyWebApi = require("spotify-web-api-node");
// credentials are optional
// let spotifyApi = new SpotifyWebApi({});
// credentials are optional
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: process.env.redirectUri,
});

const scopes = ["user-read-private", "user-read-email"];

if (process.env.refresh_token) {
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

// const time = 5 * 60 * 1000;
const time: number = Number(process.env.TIME) || 2 * 1000;

// Refreshal of token
// console.log(spotifyApi.getAccessToken());

async function refrshToken() {
	// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
	spotifyApi.refreshAccessToken().then(
		(data: any) => {
			// console.log(
			// 	"The access token has been refreshed!",
			// 	data.body.access_token
			// );

			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body.access_token);
		},
		(err: any) => {
			console.log("Could not refresh access token", err);
		}
	);
}
setInterval(refrshToken, time); // 5 min

refrshToken();
export const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello world from API!");
});

function convert_uri(params: any) {
	// convert objec to a query string
	return Object.keys(params)
		.map((key) => `${key}=${params[key]}`)
		.join("&");
}
router.get("/get_songs", async (req, res) => {
	console.log(req.query, spotifyApi.getAccessToken());

	// Use genre as base
	let routeParams: { [key: string]: any } = {
		seed_genres: req.query.seed_genres || "acoustic",
	};

	if (req.query.artist_name) {
		let response: any = await fetch(
			"https://api.spotify.com/v1/search?q=Trevor%20Daniel&type=artist",
			{
				method: "GET",
				headers: {
					accept: "application/json",
					"content-type": "application/json",
					authorization:
						"Bearer BQBjFTbOQG3uuOzLPn91Orplrwn3-H04qOM6bkk6o2iUNdRMEzhq0FNaq2YF67ifLeaBTsSpYbsW_lUNM-_qbY_TYYJjTPO2ew1ePzZ8P6XvbL-wk_fTqbPJ2sRH3GrQa31Hf24cSpfbLj5MPnjajekdCMtRRrAwn5Ipz9VPZ6UfDoYAoA",
				},
			}
		);

		let json: any = await response.json();

		const artist_genres: Array<string> = json.artists.items[0].genres;

		const uri_artist_genres: string = "," + artist_genres.join(",");
		routeParams["seed_genres"] =
			routeParams["seed_genres"] + uri_artist_genres;

		const artist_id: string = json.artists.items[0].id;
		routeParams["seed_artists"] = artist_id;
	}

	let uri: string =
		"https://api.spotify.com/v1/recommendations?" +
		convert_uri(routeParams);
	console.log(uri);
	let resval: any = await fetch(uri, {
		method: "GET",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: "Bearer " + spotifyApi.getAccessToken(),
		},
	});
	resval = await resval.json();

	if ("error" in resval) {
		throw new Error(resval.error.message);
	}

	const urls = resval.tracks;
	res.send(urls);
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
