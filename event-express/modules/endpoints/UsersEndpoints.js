const express = require('express');
const router = module.exports = express.Router();
const mongoUtil = require('../../util/MongoUtil.js');

const update = async (req, res) => {
  if(!req.body?.id || !req.body?.user) res.send(respond(2, null, "Missing data"));

  try {
    const { usersCollection } = mongoUtil.COLLECTIONS;

    const { id, user, selected } = req.body;
    const filter = { id, user };
    const data = { selected };
    const params = { upsert: true };

    const response = await usersCollection.replaceOne(filter, data, params);
    res.send(respond(0, null, null));

  } catch(error) {
    res.send(respond(1, null, error?.toString()));
  }
}

const all = async (req, res) => {
  try {
    const { usersCollection } = mongoUtil.COLLECTIONS;
    const response = await usersCollection.find().toArray();
    res.send(response);
  } catch(error) {
    res.send([]);
    console.log("Error finding all users")
  }
}

router.post('/update', update);
router.get('/all', all);