const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000



app.use(
    cors({
      origin: [
        "http://localhost:5173",
        // "https://cardoctor-bd.web.app",
        // "https://cardoctor-bd.firebaseapp.com",
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
    const result = await assignmentCollection.find().toArray()
    res.send(result)
    console.log(result);
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