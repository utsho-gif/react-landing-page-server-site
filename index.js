const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.so2v0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
       await client.connect();
       const productCollection = client.db('emaJohn').collection('product');

       //send data to client
       app.get('/product', async (req,res) => {
           const page = parseInt(req.query.page);
           const size = parseInt(req.query.size);
           const query = {};
           const cursor = productCollection.find(query);
           let products;
           if(page || size){
            products = await cursor.skip(page * size).limit(size).toArray();
           }
           else{
            products = await cursor.toArray();
           }
           
           res.send(products);
       })

       //count data 
       app.get('/datacount', async (req,res) => {
           const count = await productCollection.estimatedDocumentCount();
           res.send({count});
       })

       //use post to get products by ids
       app.post('/productByKeys', async(req,res) => {
           const keys = req.body;
           const ids = keys.map(id => ObjectId(id))
           const query = {_id: {$in : ids}}
           const cursor = productCollection.find(query);
           const products = await cursor.toArray();
           res.send(products);
       })
    }
    finally{

    }
}
run().catch(console.dir);




app.get('/', (req,res) => {
    res.send('Gotchaaaaaaaaaaaa');
})

app.listen(port, () => {
    console.log('Listening CURD', port);
})