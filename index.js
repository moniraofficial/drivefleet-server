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






// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const express = require('express'); 
// const dotenv = require('dotenv');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
// const cors = require('cors'); 
// const jwt = require('jsonwebtoken'); 
// const cookieParser = require('cookie-parser'); 

// dotenv.config();
 
// const uri = process.env.MONGODB_URI;
// const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_123"; 

// const app = express();
// const PORT = process.env.PORT || 5000; 

// // 🛠️ Middleware কনফিগারেশন
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://drivefleet.vercel.app" 
//   ], 
//   credentials: true 
// }));
// app.use(express.json());
// app.use(cookieParser()); 

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// //  কাস্টম মিডলওয়্যার: রিকোয়েস্টের কুকি থেকে টোকেন ভেরিফাই করার জন্য
// const verifyToken = (req, res, next) => {
//   const token = req.cookies?.token;
//   if (!token) {
//     return res.status(401).send({ message: "Unauthorized access: Token missing" });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).send({ message: "Forbidden access: Invalid token" });
//     }
//     req.user = decoded; 
//     next();
//   });
// };

// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     const database = client.db("drivefleet");
//     const carCollection = database.collection("cars");
//     const bookingCollection = database.collection("bookings"); 

   
//     // JWT Token জেনারেট এবং HTTPOnly Cookie-তে স্টোর করা
    
    

//     // গাড়ি অ্যাড করার এন্ডপয়েন্ট
//     app.post('/api/cars', async (req, res) => {
//       try {
//         const carData = req.body;
//         if (!carData.booking_count) {
//           carData.booking_count = 0;
//         }
//         const result = await carCollection.insertOne(carData);
//         res.status(201).send(result);
//       } catch (error) {
//         console.error("Error inserting car:", error);
//         res.status(500).send({ message: "Error inserting new car data", error });
//       }
//     });

    
//     // 🔍 Search (by Car Name) and Filter (by Type) + Optional Sort
   
//     app.get('/api/cars', async (req, res) => {
//       try {
//         const { email, ownerEmail, search, type, sortBy } = req.query;
//         let query = {};
        
//         const targetEmail = email || ownerEmail;
//         if (targetEmail) {
//           query.ownerEmail = targetEmail;
//         }

//         if (search) {
//           query.carName = { $regex: search, $options: "i" };
//         }

//         if (type && type !== "") {
//           query.type = type;
//         }

//         //  বোনাস ফিচার: প্রাইজ সর্টিং অপশন (যদি ফ্রন্টএন্ডে প্রয়োজন হয়)
//         let sortOption = { _id: -1 };
//         if (sortBy === "priceAsc") sortOption = { price: 1 };
//         if (sortBy === "priceDesc") sortOption = { price: -1 };

//         const cursor = carCollection.find(query).sort(sortOption);
//         const result = await cursor.toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error fetching all cars", error });
//       }
//     });

//     // সিঙ্গেল গাড়ির ডাটা রিড করা
//     app.get('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = req.params.id; 
//         let query = {};

//         if (ObjectId.isValid(carId)) {
//           query = { _id: new ObjectId(carId) };
//         } else {
//           query = { id: parseInt(carId) };
//         }

//         const result = await carCollection.findOne(query);
        
//         if (result) {
//           res.send(result);
//         } else {
//           res.status(404).send({ message: "Car not found with this ID" });
//         }
//       } catch (error) {
//         console.error("Error fetching single car:", error);
//         res.status(500).send({ message: "Error fetching single car data", error });
//       }
//     });

//        // গাড়ি এডিট বা ডাটা আপডেট এন্ডপয়েন্ট
//     app.put('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = req.params.id;
//         if (!ObjectId.isValid(carId)) {
//           return res.status(400).send({ message: "Invalid Car ID format" });
//         }

//         const updatedData = req.body;
//         delete updatedData._id; 

//         const query = { _id: new ObjectId(carId) };
        
//         const updateDoc = {
//           $set: {
//             carName: updatedData.carName || updatedData.name,
//             price: updatedData.price || updatedData.dailyPrice,
//             description: updatedData.description,
//             availability: updatedData.availability,
//             imageURL: updatedData.imageURL || updatedData.image,
//             type: updatedData.type,
//             location: updatedData.location,
//           }
//         };

//         const result = await carCollection.updateOne(query, updateDoc);
        
//         if (result.matchedCount === 0) {
//           return res.status(404).send({ message: "Car not found to update" });
//         }
//         res.send(result);
//       } catch (error) {
//         console.error("Error updating car:", error);
//         res.status(500).send({ message: "Error updating car data", error });
//       }
//     });

  
//     // Booking এবং $inc ব্যবহার করে booking_count বৃদ্ধি
  
//     app.post('/api/bookings', async (req, res) => {
//       try {
//         const bookingData = req.body;
        
//         const bookingResult = await bookingCollection.insertOne({
//           ...bookingData,
//           bookedAt: new Date()
//         });

//         if (bookingData.carId && ObjectId.isValid(bookingData.carId)) {
//           await carCollection.updateOne(
//             { _id: new ObjectId(bookingData.carId) },
//             { 
//               $set: { availability: "Unavailable" },
//               $inc: { booking_count: 1 } 
//             }
//           );
//         }

//         res.status(201).send({ 
//           message: "Booking successful and booking count increased! 🎫🎉", 
//           bookingId: bookingResult.insertedId 
//         });
//       } catch (error) {
//         console.error("Error creating booking:", error);
//         res.status(500).send({ message: "Error processing booking", error });
//       }
//     });

//         // বুকিং লিস্ট রিড করা ( verifyToken মিডলওয়্যার )
//     app.get('/api/bookings', verifyToken, async (req, res) => {
//       try {
//         const email = req.query.email;
        
       
//         if (req.user.email !== email) {
//           return res.status(403).send({ message: "Forbidden access: You can only view your own bookings." });
//         }

//         let query = {};
//         if (email) {
//           query = { userEmail: email }; 
//         }

//         const result = await bookingCollection.find(query).sort({ bookedAt: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         res.status(500).send({ message: "Error fetching booking data", error });
//       }
//     });

//     //  গাড়ি ডিলিট করার এন্ডপয়েন্ট
//     app.delete('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = req.params.id;

//         if (!ObjectId.isValid(carId)) {
//           return res.status(400).send({ message: "Invalid Car ID format" });
//         }

//         const query = { _id: new ObjectId(carId) };
//         const result = await carCollection.deleteOne(query);

//         if (result.deletedCount === 1) {
//           res.status(200).send({ message: "Car deleted successfully from MongoDB!" });
//         } else {
//           res.status(404).send({ message: "Car not found or already deleted" });
//         }
//       } catch (error) {
//         console.error("Error deleting car:", error);
//         res.status(500).send({ message: "Error deleting car data", error });
//       }
//     });

 

//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
//   }
// }
// run().catch(console.dir);

// app.get('/', (req, res) => {
//   res.send("server is running")
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// const express = require('express'); 
// const dotenv = require('dotenv');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); 
// const cors = require('cors'); 

// dotenv.config();
 
// const uri = process.env.MONGODB_URI;

// const app = express();
// const PORT = process.env.PORT || 5000; 

// // 🛠️ Middleware কনফিগারেশন
// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://drivefleet.vercel.app" 
//   ], 
//   credentials: true 
// }));
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
//     // await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");

//     const database = client.db("drivefleet");
//     const carCollection = database.collection("cars");
//     const bookingCollection = database.collection("bookings"); 

//     // 🚗 গাড়ি অ্যাড করার এন্ডপয়েন্ট
//     app.post('/api/cars', async (req, res) => {
//       try {
//         const carData = req.body;
//         if (!carData.booking_count) {
//           carData.booking_count = 0;
//         }
//         if (carData.price) {
//           carData.price = parseFloat(carData.price);
//         }
//         const result = await carCollection.insertOne(carData);
//         res.status(201).send(result);
//       } catch (error) {
//         console.error("Error inserting car:", error);
//         res.status(500).send({ message: "Error inserting new car data", error });
//       }
//     });

//     //  Search (by Car Name) and Filter (by Type) + Optional Sort
//     app.get('/api/cars', async (req, res) => {
//       try {
//         const { email, ownerEmail, search, type, sortBy } = req.query;
//         let query = {};
        
//         const targetEmail = email || ownerEmail;
//         if (targetEmail) {
//           query.ownerEmail = targetEmail;
//         }

//         if (search) {
//           query.carName = { $regex: search, $options: "i" };
//         }

//         if (type && type !== "") {
//           query.type = type;
//         }

//         let sortOption = { _id: -1 };
//         if (sortBy === "priceAsc") sortOption = { price: 1 };
//         if (sortBy === "priceDesc") sortOption = { price: -1 };

//         const cursor = carCollection.find(query).sort(sortOption);
//         const result = await cursor.toArray();
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Error fetching all cars", error });
//       }
//     });

//     //  সিঙ্গেল গাড়ির ডাটা রিড করা
//     app.get('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = req.params.id; 
//         let query = {};

//         if (ObjectId.isValid(carId)) {
//           query = { _id: new ObjectId(carId) };
//         } else {
//           query = { id: parseInt(carId) };
//         }

//         const result = await carCollection.findOne(query);
        
//         if (result) {
//           res.send(result);
//         } else {
//           res.status(404).send({ message: "Car not found with this ID" });
//         }
//       } catch (error) {
//         console.error("Error fetching single car:", error);
//         res.status(500).send({ message: "Error fetching single car data", error });
//       }
//     });

//     //  গাড়ি এডিট বা ডাটা আপডেট এন্ডপয়েন্ট
//     app.put('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = req.params.id;
//         if (!ObjectId.isValid(carId)) {
//           return res.status(400).send({ message: "Invalid Car ID format" });
//         }

//         const updatedData = req.body;
//         delete updatedData._id; 

//         const query = { _id: new ObjectId(carId) };
//         const rawPrice = updatedData.price || updatedData.dailyPrice;
        
//         const updateDoc = {
//           $set: {
//             carName: updatedData.carName || updatedData.name,
//             price: rawPrice ? parseFloat(rawPrice) : rawPrice,
//             description: updatedData.description,
//             availability: updatedData.availability,
//             imageURL: updatedData.imageURL || updatedData.image,
//             type: updatedData.type,
//             location: updatedData.location,
//           }
//         };

//         const result = await carCollection.updateOne(query, updateDoc);
        
//         if (result.matchedCount === 0) {
//           return res.status(404).send({ message: "Car not found to update" });
//         }
//         res.send(result);
//       } catch (error) {
//         console.error("Error updating car:", error);
//         res.status(500).send({ message: "Error updating car data", error });
//       }
//     });

//     // Booking এবং $inc ব্যবহার করে booking_count বৃদ্ধি
//     app.post('/api/bookings', async (req, res) => {
//       try {
//         const bookingData = req.body;
        
//         const bookingResult = await bookingCollection.insertOne({
//           ...bookingData,
//           bookedAt: new Date()
//         });

//         if (bookingData.carId && ObjectId.isValid(bookingData.carId)) {
//           await carCollection.updateOne(
//             { _id: new ObjectId(bookingData.carId) },
//             { 
//               $set: { availability: "Unavailable" },
//               $inc: { booking_count: 1 } 
//             }
//           );
//         }

//         res.status(201).send({ 
//           message: "Booking successful and booking count increased! 🎫🎉", 
//           bookingId: bookingResult.insertedId 
//         });
//       } catch (error) {
//         console.error("Error creating booking:", error);
//         res.status(500).send({ message: "Error processing booking", error });
//       }
//     });

//     // বুকিং লিস্ট রিড করা (কোনো ভেরিফাই টোকেন মিডলওয়্যার নেই)
//     app.get('/api/bookings', async (req, res) => {
//       try {
//         const email = req.query.email;
//         let query = {};
//         if (email) {
//           query = { userEmail: email }; 
//         }

//         const result = await bookingCollection.find(query).sort({ bookedAt: -1 }).toArray();
//         res.send(result);
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//         res.status(500).send({ message: "Error fetching booking data", error });
//       }
//     });

//     // 🗑️গাড়ি ডিলিট করার এন্ডপয়েন্ট
//     app.delete('/api/cars/:id', async (req, res) => {
//       try {
//         const carId = req.params.id;

//         if (!ObjectId.isValid(carId)) {
//           return res.status(400).send({ message: "Invalid Car ID format" });
//         }

//         const query = { _id: new ObjectId(carId) };
//         const result = await carCollection.deleteOne(query);

//         if (result.deletedCount === 1) {
//           res.status(200).send({ message: "Car deleted successfully from MongoDB!" });
//         } else {
//           res.status(404).send({ message: "Car not found or already deleted" });
//         }
//       } catch (error) {
//         console.error("Error deleting car:", error);
//         res.status(500).send({ message: "Error deleting car data", error });
//       }
//     });

//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
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

//  Middleware কনফিগারেশন
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
    // ⚠️ Vercel (Serverless)-এর জন্য চিরস্থায়ী client.connect() কমেন্ট আউট রাখাই বেস্ট প্র্যাকটিস
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("drivefleet");
    const carCollection = database.collection("cars");
    const bookingCollection = database.collection("bookings"); 

    //  গাড়ি অ্যাড করার এন্ডপয়েন্ট
    app.post('/api/cars', async (req, res) => {
      try {
        const carData = req.body;
        if (!carData.booking_count) {
          carData.booking_count = 0;
        }
        if (carData.price) {
          carData.price = parseFloat(carData.price);
        }
        const result = await carCollection.insertOne(carData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting car:", error);
        res.status(500).send({ message: "Error inserting new car data", error });
      }
    });

    //  Search (by Car Name) and Filter (by Type) + Optional Sort
    app.get('/api/cars', async (req, res) => {
      try {
        const { email, ownerEmail, search, type, sortBy } = req.query;
        let query = {};
        
        const targetEmail = email || ownerEmail;
        if (targetEmail) {
          query.ownerEmail = targetEmail;
        }

        if (search) {
          query.carName = { $regex: search, $options: "i" };
        }

        if (type && type !== "") {
          query.type = type;
        }

        let sortOption = { _id: -1 };
        if (sortBy === "priceAsc") sortOption = { price: 1 };
        if (sortBy === "priceDesc") sortOption = { price: -1 };

        const cursor = carCollection.find(query).sort(sortOption);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching all cars", error });
      }
    });

    // সিঙ্গেল গাড়ির ডাটা রিড করা
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

    //  গাড়ি এডিট বা ডাটা আপডেট এন্ডপয়েন্ট
    app.put('/api/cars/:id', async (req, res) => {
      try {
        const carId = req.params.id;
        if (!ObjectId.isValid(carId)) {
          return res.status(400).send({ message: "Invalid Car ID format" });
        }

        const updatedData = req.body;
        delete updatedData._id; 

        const query = { _id: new ObjectId(carId) };
        const rawPrice = updatedData.price || updatedData.dailyPrice;
        
        const updateDoc = {
          $set: {
            carName: updatedData.carName || updatedData.name,
            price: rawPrice ? parseFloat(rawPrice) : rawPrice,
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

    //  Booking এবং $inc ব্যবহার করে booking_count বৃদ্ধি
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
            { 
              $set: { availability: "Unavailable" },
              $inc: { booking_count: 1 } 
            }
          );
        }

        res.status(201).send({ 
          message: "Booking successful and booking count increased! 🎫🎉", 
          bookingId: bookingResult.insertedId 
        });
      } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).send({ message: "Error processing booking", error });
      }
    });

    // বুকিং লিস্ট রিড করা
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

    //  গাড়ি ডিলিট করার এন্ডপয়েন্ট
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
    console.error("MongoDB Connection Error:", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("DriveFleet Server is running perfectly! 🚀")
});


if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}


module.exports = app;