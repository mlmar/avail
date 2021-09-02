const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();


app.use(cors({ origin: '*', credentials: true, optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

const { PORT, DEV } = process.env;
const port = PORT || 3300;

/*
global function to return all data in object format
status  : 0 = success, any other number is an error
data    : object
msg     : message string
*/
respond = (status, data, msg) => new Object({ status, data, msg });


const mongoUtil = require('./util/MongoUtil.js');
const connectFunc = () => {
  console.log("CONNECTED TO MONGODB");

  mongoUtil.COLLECTIONS.eventsCollection = mongoUtil.collection("events");
  mongoUtil.COLLECTIONS.usersCollection = mongoUtil.collection("users");

  app.listen(port, () => {
    console.log("Listening on port " + port);
    if(DEV) console.log("RUNNING IN THE DEVELOPMENT");
  });
}

mongoUtil.connect(connectFunc);


const eventsEndpoints = require('./modules/endpoints/EventsEndpoints.js');
app.use('/events', eventsEndpoints);

const usersEndpoints = require('./modules/endpoints/UsersEndpoints.js');
app.use('/users', usersEndpoints);