const express = require('express');
const router = new express.Router();

const Item = require('../models/item');

//POST one
router.post('/item', async (req, res) => {
    const item = new Item({
        ...req.body
    });

    try {
        await item.save();
        res.status(201).send(item);
    } catch(e) {
        res.status(400).send(e);
    }
});

//POST batch
router.post('/item-batch', async (req, res) => {
    const items = req.body;

    try {
        const response = await Item.insertMany(items);
        res.status(201).send(response);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET many
//also get by idStore
router.get('/item', async (req, res) => {
    const match = req.query.idStore? {idStore: req.query.idStore} : {};
    console.log(match);
    try {
        const items = await Item.find(match);
        res.status(200).send(items);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET by Id
router.get('/item/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const item = await Item.findOne({_id});

        if (!item) res.status(404).send('user with that id is not found');

        res.status(200).send(item);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;