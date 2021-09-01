const express = require('express');
const router = module.exports = express.Router();
const mongoUtil = require('../../util/MongoUtil.js');

const update = async (req, res) => {
  if(!req.body?.id || !req.body?.user) res.send(respond(2, null, "Missing data"));

  try {
    const { usersCollection } = mongoUtil.COLLECTIONS;

    const { id, user, selected } = req.body;
    const filter = { id : { $eq : id}, user: { $eq : user} };
    const data = { id, selected, user };
    const params = { upsert: true };

    const response = await usersCollection.replaceOne(filter, data, params);
    res.send(respond(0, null, null));

  } catch(error) {
    res.send(respond(1, null, error?.toString()));
  }
}

const find = async (req, res) => {
  if(!req.body?.id) res.send(respond(2, null, "Missing data"));

  try {
    const { usersCollection } = mongoUtil.COLLECTIONS;

    const { id } = req.body;
    const filter = { id: { $eq: id } };
    const response = await usersCollection.find(filter).toArray();
    res.send(respond(0, response, null));
  } catch(error) {
    res.send(respond(1, null, error?.toString()));
  }
}

const findOne = async (req, res) => {
  if(!req.body?.id || !req.body?.user) res.send(respond(2, null, "Missing data"));

  try {
    const { usersCollection } = mongoUtil.COLLECTIONS;
    const { id, user } = req.body;
    const filter = { id: { $eq: id }, user: { $eq: user }};
    const response = await usersCollection.findOne(filter);
    res.send(respond(0, response, null));
  } catch(error) {
    res.send(respond(1, null, error?.toString()));
  }
}

const deleteOne = async (req, res) => {
  if(!req.body?.id || !req.body?.user) res.send(respond(2, null, "Missing data"));

  try {
    const { usersCollection } = mongoUtil.COLLECTIONS;
    const { id, user } = req.body;
    const filter = { id: { $eq: id }, user: { $eq: user }};
    const response = await usersCollection.deleteOne(filter);
    res.send(respond(0, response, null));
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
router.post('/find', find);
router.post('/find-one', findOne);
router.post('/delete-one', deleteOne);
router.get('/all', all);