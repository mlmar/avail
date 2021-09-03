# Avail

<img src="https://user-images.githubusercontent.com/63682846/132063689-c95a0a81-2d6d-4545-aaf6-c74bc5866930.png" width=300/>



## Features
- Create an event by naming and selecting a set of days.
- Share the generated URL with anyone you want to invite to the event.
- View everyone's availability per hour on the event calendar &mdash; the darker the color, the more people there are available.
- Simply type in your name to sign in and select your own availability.



## Framework, Libraries and Technologies
- MongoDB
- Node express server
- ReactJS -- bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
- Hosted through Vercel at [avail.vercel.app](https://avail.vercel.app)



## Installation
- Run `npm install` in both `event-express` and `event-react` folders
- Run `npm start` in `event-express` to start the node server for mongo services
- Run `npm start` in `event-react` to start the client


## Environment Variables
- MongoDB server secret and database name are required
- Set `DEV` to true to run in development