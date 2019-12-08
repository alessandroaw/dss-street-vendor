const express = require('express');
const router = new express.Router();

const Store = require('../models/store');

//POST one
router.post('/store', async (req, res) => {
    const store = new Store({
        ...req.body
    });

    try {
        await store.save();
        res.status(201).send(store);
    } catch(e) {
        res.status(400).send(e);
    }
});

//POST batch
router.post('/store-batch', async (req, res) => {
    const stores = req.body;

    try {
        const response = await Store.insertMany(stores);
        res.status(201).send(response);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET all
router.get('/store', async (req, res) => {
    try {
        const stores = await Store.find({});
        res.status(200).send(stores);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET by Id
router.get('/store/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const store = await Store.findOne({_id});

        if (!store) res.status(404).send('user with that id is not found');

        res.status(200).send(store);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;