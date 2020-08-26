# Server

## Setup the .env file in the server directory

Run the server once (basic functionality wont be there, only authentication).

### Consult the .env.sample as a sample for the syntax

-   Create an application at https://developer.spotify.com/dashboard/applications under your account/or a bot account

-   Copy the clientId into the .env clientId field

-   Copy the clientSecret into the .env clientSecret field

-   Go to [http://127.0.0.1:4000/api/login](http://127.0.0.1:4000/api/login) (or whatver port you specified in your .env) and login.

-   Copy the refresh_token value into your server .env file.

-   Add http://127.0.0.1:4000/api/callback as your redirectUri in your .env

-   Add the UID of the Account issuing the clientId and ClientSecret (the account that is the owner of the spotify api app) into the .env

-   Start the server

To use run

`npm i -g typesript`

`npm install`

To Start

`npm run watch` for the live typescript compiler.

`npm run devDist` to serve the compiled JS.
