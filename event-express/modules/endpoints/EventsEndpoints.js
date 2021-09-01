const express = require('express');
const router = module.exports = express.Router();
const mongoUtil = require('../../util/MongoUtil.js');
const { v4 } = require('uuid');


const create = async (req, res) => {
  if(!req.body?.name || !req.body?.dates) res.send(respond(2, null, "Missing data"));
  
  try {
    const { eventsCollection } = mongoUtil.COLLECTIONS;
    
    const { name, dates } = req.body;
    const id = v4();
    const data = { id, name, dates };

    await eventsCollection.insertOne(data);
    console.log("Creating new event", name);
    res.send(respond(0, data, null));
  } catch(error) {
    console.log("Error creating new event");
    res.send(respond(1, data, error?.toString()));
  }
}

const find = async (req, res) => {
  if(!req.body?.id) res.send(respond(2, null, "Missing ID"));
  const { id } = req.body;
  
  try {
    const { eventsCollection } = mongoUtil.COLLECTIONS;
    const response = await eventsCollection.findOne({ id });
    
    if(response) {
      console.log("Found event", id);
      res.send(respond(0, response, null));
    } else {
      console.log("Did not find event", id);
      res.send(respond(3, response, null));
    }
    
  } catch(error) {
    console.log("Error finding event");
    res.send(respond(1, null, error?.toString()));
  }
}

const all = async (req, res) => {
  try {
    const { eventsCollection } = mongoUtil.COLLECTIONS;
    const response = await eventsCollection.find().toArray();
    res.send(response);
  } catch(error) {
    res.send([]);
    console.log("Error finding all events")
  }
}

router.post('/create', create);
router.post('/find', find);
router.get('/all', all);