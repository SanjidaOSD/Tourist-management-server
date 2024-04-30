const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2bg42lh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

const placeCollection = client.db('placeDB').collection('place');
const countryCollection = client.db('placeDB').collection('CountryDB')

app.get('/country',async(req, res) =>{
  const cursor = countryCollection.find();
  const result = await cursor.toArray();
  console.log(result)

  res.send(result);
})

app.get('/country/:country', async(req , res) =>{
  const {country} = req.params
  const query = {country: country}
  console.log(query)
  const result = await placeCollection.find(query).toArray();
  console.log(result)
  res.send(result)
  })

app.get('/place',async(req, res) => {
  const cursor = placeCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get('/place/:id', async(req , res) =>{
const {id} = req.params
const query = {_id: new ObjectId(id)}
const result = await placeCollection.findOne(query);
res.send(result)
})

app.get('/myList/:email', async(req , res) =>{
  const {email} = req.params
  const query = {email: email}
  console.log(query)
  const result = await placeCollection.find(query).toArray();
  console.log(result)
  res.send(result)
  })

  app.delete('/place/:id', async (req, res) =>{
    const {id} = req.params
    const query = {_id: new ObjectId(id)}
    const result = await placeCollection.deleteOne(query);
    res.send(result) 
   })

app.post('/place', async(req, res) => {
  const newPlace = req.body;
  console.log(newPlace)
  const result = await placeCollection.insertOne(newPlace);
  res.send(result)
})
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/',(req,res) =>{
    res.send('Tourist-Management server is running')
})

app.listen(port, () =>{
    console.log('Tourist Management server is running', port)
})
