# finite

here's a project I've deployed using docker-compose. The deployment runs two containers fron dockerhub and two containers that I made and pushed to aws ecr. Therefore, you must have both docker and docker-compose installed, and you also must have the aws cli installed and configured (you will need an aws account for this). 

the front end container runs a volume of the react app in the front-end folder. The container creates this volume from the build folder, which is not included in the repo. To create the build before running the docker-compose run: 

## yarn build:fe

this will install react and react-scripts which will create the build that docker-compose is pointing the front end container volume at

the final requirement is the CORS Unblock extention found here: https://addons.mozilla.org/en-US/firefox/addon/cors-unblock/ please add and enable

then you can run:

## yarn prod

which will fire up the app with docker-compose. Any front end development you wish to improve can be done right in the front-end/src folder and tested locally, then tested using the image with:

## yarn build:fe && yarn prod

please contact me with any issues. happy coding!
