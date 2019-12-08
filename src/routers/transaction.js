const express = require('express');
const router = new express.Router();

const Transaction = require('../models/transaction');
const Item = require('../models/item');

//POST one
router.post('/transaction', async (req, res) => {
    const transaction = new Transaction({
        ...req.body
    });

    try {
        await transaction.save();
        res.status(201).send(transaction);
    } catch(e) {
        res.status(400).send(e);
    }
});

//POST batch
router.post('/transaction-batch', async (req, res) => {
    const transactions = req.body;

    try {
        const response = await Transaction.insertMany(transactions);
        res.status(201).send(response);
    } catch (e) {
        res.status(400).send(e);
    }
});

//GET many
//also get by idStore
// transaction?idStore={idStore}&?nDays={x}
router.get('/transaction', async (req, res) => {
    const match = req.query.idStore? {idStore: req.query.idStore} : {};
    console.log(match);

    if (req.query.nDays) {
        let nDaysBefore = new Date();
        nDaysBefore.setDate(nDaysBefore.getDate() - req.query.nDays);
        match.date = {$gte: nDaysBefore}
    }

    try {
        const transactions = await Transaction.find(match);
        res.status(200).send(transactions);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/transaction/summary', async (req, res) => {
    console.log("tes");
    try {
        const result = await Transaction.aggregate([
           {
               $group: {
                   "_id": {
                       "item": "$idItem",
                       "dateToString": {
                           "$dateToString": {
                               "format": "%Y-%m-%d",
                               "date": {
                                   "$add": [
                                       new Date(), {
                                        "$multiply": [1, "$date"]
                                       }
                                   ]
                               }
                           }
                       }
                   },
                   "totalQuantity": {"$sum": "$quantity"}
               }
           }]);

        const populatedResult = await Item.populate(result, {path: "_id.item", select: "itemName"});
       res.status(200).send(populatedResult);
    } catch (e) {
        res.status(400).send(e);
    }

});
//GET by Id
router.get('/transaction/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const transaction = await Transaction.findOne({_id});

        if (!transaction) res.status(404).send('user with that id is not found');

        res.status(200).send(transaction);
    } catch (e) {
        res.status(400).send(e);
    }
});


module.exports = router;