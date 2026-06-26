// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const express = require('express'); 
// const dotenv = require('dotenv');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const cors = require('cors'); 

// dotenv.config();
 
// const uri = process.env.MONGODB_URI;

// const app = express();
// const PORT = process.env.PORT || 5000; 

// // Middleware
// app.use(cors());
// app.use(express.json());

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
   
//     await client.connect();
    
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

    
//     const database = client.db("drivefleet");
//     const carCollection = database.collection("cars");

    
//     app.get('/api/cars', async (req, res) => {
//       try {
//         const cursor = carCollection.find({});
//         const result = await cursor.toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error fetching all cars", error });
//       }
//     });

    
//     app.get('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = parseInt(req.params.id); 
//         const query = { id: carId }; 
//         const result = await carCollection.findOne(query);
        
//         if (result) {
//           res.send(result);
//         } else {
//           res.status(404).send({ message: "Car not found with this ID" });
//         }
//       } catch (error) {
//         res.status(500).send({ message: "Error fetching single car data", error });
//       }
//     });

//   } catch (error) {
//     console.error(error);
//   }
  
// }
// run().catch(console.dir);


// app.get('/', (req, res) => {
//   res.send("server is running")
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express'); 
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
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
    const bookingCollection = database.collection("bookings"); 

    app.post('/api/cars', async (req, res) => {
      try {
        const carData = req.body;
        const result = await carCollection.insertOne(carData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting car:", error);
        res.status(500).send({ message: "Error inserting new car data", error });
      }
    });

   
    app.get('/api/cars', async (req, res) => {
      try {
        const { email, ownerEmail } = req.query;
        let query = {};
        
  
        const targetEmail = email || ownerEmail;
        if (targetEmail) {
          query = { ownerEmail: targetEmail };
        }

        const cursor = carCollection.find(query).sort({ _id: -1 });
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching all cars", error });
      }
    });

  
    app.get('/api/cars/:id', async (req, res) => {
      try {
        const carId = req.params.id; 
        let query = {};

        if (ObjectId.isValid(carId)) {
          query = { _id: new ObjectId(carId) };
        } else {
          query = { id: parseInt(carId) };
        }

        const result = await carCollection.findOne(query);
        
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "Car not found with this ID" });
        }
      } catch (error) {
        console.error("Error fetching single car:", error);
        res.status(500).send({ message: "Error fetching single car data", error });
      }
    });


    app.put('/api/cars/:id', async (req, res) => {
      try {
        const carId = req.params.id;
        if (!ObjectId.isValid(carId)) {
          return res.status(400).send({ message: "Invalid Car ID format" });
        }

        const updatedData = req.body;
   
        delete updatedData._id; 

        const query = { _id: new ObjectId(carId) };
        

        const updateDoc = {
          $set: {
            carName: updatedData.carName || updatedData.name,
            price: updatedData.price || updatedData.dailyPrice,
            description: updatedData.description,
            availability: updatedData.availability,
            imageURL: updatedData.imageURL || updatedData.image,
            type: updatedData.type,
            location: updatedData.location,
          }
        };

        const result = await carCollection.updateOne(query, updateDoc);
        
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Car not found to update" });
        }
        res.send(result);
      } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).send({ message: "Error updating car data", error });
      }
    });



    app.post('/api/bookings', async (req, res) => {
      try {
        const bookingData = req.body;
        
        const bookingResult = await bookingCollection.insertOne({
          ...bookingData,
          bookedAt: new Date()
        });

        if (bookingData.carId && ObjectId.isValid(bookingData.carId)) {
          await carCollection.updateOne(
            { _id: new ObjectId(bookingData.carId) },
            { $set: { availability: "Unavailable" } }
          );
        }

        res.status(201).send({ 
          message: "Booking successful and car availability updated!", 
          bookingId: bookingResult.insertedId 
        });
      } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).send({ message: "Error processing booking", error });
      }
    });

    app.get('/api/bookings', async (req, res) => {
      try {
        const email = req.query.email;
        let query = {};
        
        if (email) {
          query = { userEmail: email }; 
        }

        const result = await bookingCollection.find(query).sort({ bookedAt: -1 }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send({ message: "Error fetching booking data", error });
      }
    });

    
    app.delete('/api/cars/:id', async (req, res) => {
      try {
        const carId = req.params.id;

        if (!ObjectId.isValid(carId)) {
          return res.status(400).send({ message: "Invalid Car ID format" });
        }

        const query = { _id: new ObjectId(carId) };
        const result = await carCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.status(200).send({ message: "Car deleted successfully from MongoDB!" });
        } else {
          res.status(404).send({ message: "Car not found or already deleted" });
        }
      } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).send({ message: "Error deleting car data", error });
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