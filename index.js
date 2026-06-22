const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express'); 
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); 

dotenv.config();
 
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());

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
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
    const database = client.db("drivefleet");
    const carCollection = database.collection("cars");

    
    app.get('/api/cars', async (req, res) => {
      try {
        const cursor = carCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching all cars", error });
      }
    });

    
    app.get('/api/cars/:id', async (req, res) => {
      try {
        const carId = parseInt(req.params.id); 
        const query = { id: carId }; 
        const result = await carCollection.findOne(query);
        
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Car not found with this ID" });
        }
      } catch (error) {
        res.status(500).send({ message: "Error fetching single car data", error });
      }
    });

  } catch (error) {
    console.error(error);
  }
  
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("server is running")
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});