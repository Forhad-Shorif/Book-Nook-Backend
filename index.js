import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors'
import express from 'express';
import dotenv from 'dotenv/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://forhad-shorif-book-nook.vercel.app"
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 8000;

const client = new MongoClient(process.env.MONGODB_SECRET_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const MongoDB = await connectToMongoDB();
const db = MongoDB.db("book_nook");
const booksCollection = db.collection("allbooks");
const borrowedBooksCollection = db.collection("borrowed-books");
const RivewCollection = db.collection("Review");

const varify = async (req, res, next) => {
  const AuthHeader = req.headers.authorization;

  if (!AuthHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = AuthHeader.split(" ")[1];

  const JWKS = createRemoteJWKSet(new URL('http://localhost:3000/api/auth/jwks'))

  try{
     const { payload } = await jwtVerify(token , JWKS);
  next();
  }catch(error){
    return res.status(500).send({message: "Internal Server Issue"})
  }
};

// All Books GET
app.get('/books',varify, async (req, res) => {
  try {
    const books = await booksCollection.find().toArray();
    res.send(books);
  } catch (err) {
    res.status(500).send('Error fetching books');
  }
});

//Get Letest 10 Books
app.get('/LatestBooks', async (req, res) => {
  try {
    const books = await booksCollection
      .find({})
      .sort({ createdAt: -1 }) // সবচেয়ে নতুন বইগুলো প্রথমে আসার জন্য
      .limit(10)             // ১০টি বই দেখানোর জন্য
      .toArray();

    res.send(books);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch books", error: error.message });
  }
});

// Search One Book GET for Details page
app.get('/Books/:id', varify,async (req, res) => {

  const { id } = req.params;
  const Books = await booksCollection.findOne({ _id: new ObjectId(id) })
  if (!Books) {
    return res.status(404).send('Book not found');
  }
  res.send(Books)
});

// Noton booksCollection InsertOne;
app.post('/NewBook', async (req, res) => {
  try {
    const newBook = req.body;
    const result = await booksCollection.insertOne(newBook);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send('Error adding book');
  }
});

// Noton booksCollection UpdateOne
app.patch('/UpdateBook/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = req.body;

        const result = await booksCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedBook }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('Book not found');
        }

        res.send(result);

    } catch (err) {
        res.status(500).send('Error updating book');
    }
});

// Reduce the quantity of the book in the main collection
app.patch('/BookCopesDecrease/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await booksCollection.findOneAndUpdate(
      { _id: new ObjectId(id), totalCopies: { $gt: 0 } },
      { $inc: { totalCopies: -1 } },
      { returnDocument: 'after' }
    );

    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
});

// Increase the quantity of the book in the main collection
app.patch('/BookCopesIncrease/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await booksCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { totalCopies: 1 } },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    // সফল হলে আপডেট হওয়া ডাটা ফ্রন্টএন্ডে পাঠিয়ে দিন
    res.send(result);
  } catch (err) {
    res.status(500).send('Error returning book');
  }
});

// Noton BooksCollection DeleteOne
app.delete('/DeleteBook/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await booksCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Book not found');
    }
    res.send(result);
  } catch (err) {
    res.status(500).send('Error deleting book');
  }
});

// My Books Collection Get
app.get('/MyBooks/:email',varify, async (req, res) => {
  try {
    const Email = req.params.email;
    const books = await booksCollection.find({ "addedBy.email": Email }).toArray();
    res.send(books);
  } catch (err) {
    res.status(500).send('Error fetching my books');
  }
});

// Borrowed Books;
// Borrowed Books Collection InsertOne
app.post(`/BorrowedBooks`, async (req, res) => {
  try {
    const newBorrowedBook = req.body;
    const result = await borrowedBooksCollection.insertOne(newBorrowedBook);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send('Error adding borrowed book');
  }
})

// Borrowed My Books Collection GET
app.get('/BorrowedBooksGet/:email', async (req, res) => {
  try {
    const { email } = req.params.email;
    const borrowedBooks = await borrowedBooksCollection.find({ email }).toArray();
    res.send(borrowedBooks);
  } catch (err) {
    res.status(500).send('Error fetching borrowed books');
  }
});

// Borrowed Books Returned Collection DeleteOne
app.delete('/BorrowedBooksReturn/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await borrowedBooksCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Borrowed book not found');
    }
    res.send(result);
  }
  catch (err) {
    res.status(500).send('Error deleting borrowed book');
  }
});

// Borrowed Books InsertOne
// Review Collection InsertOne
app.post('/ReviewPost', async (req, res) => {
  try {
    const newReview = req.body;
    const result = await RivewCollection.insertOne(newReview);
    res.status(201).send(result);
  } 
  catch (err) {
 
    res.status(500).send('Error adding review');
  }
});

app.get('/GetReview', async (req , res) =>{
  try {
    const reviews = await RivewCollection.find().sort({ createdAt: -1 }).limit(6).toArray();
    res.send(reviews);
  }
  catch (err) {
    res.status(500).send('Error fetching reviews');
  }
});

app.delete('/DeleteReview/:id', async (req , res) =>{
  try {
    const { id } = req.params;
    const result = await RivewCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Review not found');
    }
    res.send(result);
  }
  catch (err) {
    res.status(500).send('Error deleting review');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
}
);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

export default app;