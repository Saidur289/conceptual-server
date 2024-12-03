const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9cbr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
   
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const gymCollection = client.db('gym-schedule').collection('schedule')
   app.post('/schedule', async(req, res) => {
      const gym = req.body 
      const result = await gymCollection.insertOne(gym)
      res.send(result)
   })
   app.get('/schedule', async(req, res) => {
      const {search} = req.query
      let option = {}
      if(search){
        option = {title:{$regex:search, $options: "i"}}
      }
      const cursor =  gymCollection.find(option)
      const result = await cursor.toArray()
      res.send(result)
   })
   app.delete('/schedule/:id', async(req, res) => {
    const id = req.params.id 
    const query = {_id: new ObjectId(id)}
    const result = await gymCollection.deleteOne(query)
    res.send(result)
   })
   app.get('/schedule/:id', async(req, res) => {
    const id = req.params.id 
    const query = {_id: new ObjectId(id)}
    const result = await gymCollection.findOne(query)
    res.send(result)
   })
   app.patch('/schedule/:id', async(req, res) => {
    const id = req.params.id 
    const query = {_id: new ObjectId(id)}
    const data = req.body 
    const update = {
      $set:{
        title: data?.title,
        day: data?.day,
        date: data?.date 
      }
    }
    const result = await gymCollection.updateOne(query, update)
    res.send(result)
   })
   app.patch('/status/:id', async(req, res) => {
    const id = req.params.id 
    const query = {_id: new ObjectId(id)}
    const data = req.body 
    const update = {
      $set:{
        isCompleted :true
      }
    }
    const result = await gymCollection.updateOne(query, update)
    res.send(result)
   })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
