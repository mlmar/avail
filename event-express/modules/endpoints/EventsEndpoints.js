const express = require('express');
const router = express.Router();
const mongoUtil = require('../../util/MongoUtil.js');
const { v4 } = require('uuid');

const EVENTS = "events";

router.post('/create', async (req, res) => {
  if(!req.body?.name || !req.body?.dates) res.send(respond(2, null, "Missing data"));

  const { name, dates } = req.body;
  const id = v4();
  const data = { id, name, dates };
  
  try {
    const collection = mongoUtil.collection(EVENTS);
    const response = await collection.insertOne(data);
    if(response) res.send(respond(0, data, null));
  } catch(error) {
    console.log("Error creating new game");
    res.send(respond(1, data, error?.toString()));
  }
});

module.exports = router;
