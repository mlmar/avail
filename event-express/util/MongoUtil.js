const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const CONNECTION_STRING = process.env.MONGODB_CONNECTION_URL;
const DATABASE_STRING = process.env.DATABASE;
const OPTIONS = {};

let CLIENT = null;

const connect = (callback, error) => {
  MongoClient.connect(CONNECTION_STRING, OPTIONS, (err, c) => {
    CLIENT = c;
    if(callback) callback();
    if(err) error(err);
  });
}

const get = () => CLIENT?.db(DATABASE_STRING);
const close = () => CLIENT.close();
const objectID = ObjectId;
const collection = (id) => get()?.collection(id);


let COLLECTIONS = {}

module.exports = { connect, get, close, objectID, collection, COLLECTIONS }