call cd server/
call npm run prebuild
call cd ..
call git subtree push --prefix server heroku master
