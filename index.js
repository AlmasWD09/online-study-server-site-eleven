const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000



app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://online-study-assignments.web.app"
      ],
      credentials: true,
    })
  );
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1kmrgvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
const assignmentCollection = client.db('assignmentDB').collection('assignment')


app.post('/assignment/api/create',async(req,res)=>{
    const Createdata = req.body
    const result = await assignmentCollection.insertOne(Createdata)
    res.send(result)
    console.log(result);
})

app.get('/assignment/api/get',async(req,res)=>{
  const page = parseInt(req.query.page)-1
  const size = parseInt(req.query.size)-1
  const filter = req.query.filterData;
  let query = {};
  if (filter) {
    query = { level: { $regex: new RegExp(filter, 'i') } };
  }
    const result = await assignmentCollection.find(query).skip(page * size).limit(size).toArray()
    res.send(result)
})

app.get('/assignment/api/get-count',async(req,res)=>{
  const filter = req.query.filterData;
  let query = {};
  if (filter) {
    query = { difficulty: { $regex: new RegExp(filter, 'i') } };
  }
    const count = await assignmentCollection.countDocuments(query)
    res.send({count})
  
})


app.get('/assignment/api/get/:id',async(req,res)=>{
  const singleDataGet = req.params.id
  const query = {_id: new ObjectId(singleDataGet)}
  const result = await assignmentCollection.findOne(query)
  res.send(result)
})

app.get('/assignment/api/get/user/:email',async(req,res)=>{
  const getEmail = req.params.email
  const query = {userEmail:getEmail}
  const result = await assignmentCollection.find(query).toArray()
  res.send(result)
})


app.delete('/assignment/api/delete/:id',async(req,res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await assignmentCollection.deleteOne(query)
  res.send(result)
  console.log(result);
})


app.put('/assignment/api/update/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id: new ObjectId(id)}
  const updateData = req.body
  const options = { upsert: true };

  const assignment = {
    $set: {
      ...updateData
    },
  };
  const result = await assignmentCollection.updateOne(filter,assignment,options)
  res.send(result)
})









    await client.db("admin").command({ ping: 1 });
    console.log("successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})