const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;

// meddleware 
app.use(cors());
app.use(express.json());
// connecting to database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixmy4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('hotel');
        const roomsDB = database.collection('rooms');
        const ordersDB = database.collection('orders');
        // load data 
        app.get('/rooms',async(req,res)=>{
            const quary = roomsDB.find({});
            const rooms = await quary.toArray();
            res.json(rooms);
        })
        // post order in database 
        app.post('/orders',async(req,res)=>{
            const quary =  req.body;
            const result = await ordersDB.insertOne(quary)
            res.json(result)
          
        }) 
        // get order data 
        app.get('/orders',async(req,res)=>{
            const quary = ordersDB.find({});
            const result = await quary.toArray();
            res.json(result)
        })
        // delete an item 
        app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id)
            const quary = {_id: ObjectId(id)};
            const result = await ordersDB.deleteOne(quary);
            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
              } else {
                console.log("No documents matched the query. Deleted 0 documents.");
              }
            res.json(result)
        })

        // post new service 
        app.post('/rooms',async(req,res)=>{
            const quary = req.body;
            const result = await roomsDB.insertOne(quary);
            res.json(result)
        })

    }finally{

    }
}
run().catch(console.dir);
// defult res 
app.get('/',(req,res)=>{
    res.send("got conneted")
})
app.listen(port,()=>{
    console.log('Listining to port', port)
})
