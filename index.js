const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
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
        app.get('/rooms',async(req,res)=>{
            const quary = roomsDB.find({});
            const rooms = await quary.toArray();
            res.json(rooms);
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
