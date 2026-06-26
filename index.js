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
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser'); 

dotenv.config();
 
const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_123"; 

const app = express();
const PORT = process.env.PORT || 5000; 

// 🛠️ Middleware কনফিগারেশন
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://drivefleet.vercel.app" 
  ], 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser()); 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//  কাস্টম মিডলওয়্যার: রিকোয়েস্টের কুকি থেকে টোকেন ভেরিফাই করার জন্য
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access: Token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access: Invalid token" });
    }
    req.user = decoded; 
    next();
  });
};

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("drivefleet");
    const carCollection = database.collection("cars");
    const bookingCollection = database.collection("bookings"); 

   
    // JWT Token জেনারেট এবং HTTPOnly Cookie-তে স্টোর করা
    
    app.post('/api/jwt', async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          maxAge: 24 * 60 * 60 * 1000 
        })
        .send({ success: true, message: "Token stored in HTTPOnly cookie! 🔐" });
      } catch (error) {
        res.status(500).send({ message: "JWT Generation Failed", error });
      }
    });

    // 🔓 ইউজার লগআউট করলে কুকি ক্লিয়ার করার এন্ডপয়েন্ট
    app.post('/api/logout', async (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
      .send({ success: true, message: "Logged out and cookie cleared! 🧹" });
    });

    // গাড়ি অ্যাড করার এন্ডপয়েন্ট
    app.post('/api/cars', async (req, res) => {
      try {
        const carData = req.body;
        if (!carData.booking_count) {
          carData.booking_count = 0;
        }
        const result = await carCollection.insertOne(carData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting car:", error);
        res.status(500).send({ message: "Error inserting new car data", error });
      }
    });

    


  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("server is running")
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});