import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors'
import express from 'express';
import dotenv from 'dotenv/config';

// import dns from "node:dns";
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
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

// All Books GET
app.get('/books', async (req, res) => {
  try {
    const books = await booksCollection.find().toArray();
    res.send(books);
  } catch (err) {
    console.error(err);
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
app.get('/Books/:id', async (req, res) => {

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
    console.error(err);
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
        console.log(result);

        if (result.matchedCount === 0) {
            return res.status(404).send('Book not found');
        }

        res.send(result);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating book');
    }
});

// Reduce the quantity of the book in the main collection
app.post('/BookCopesReduce/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const borrowedBook = req.body;
    const result = await booksCollection.findOneAndUpdate(
      { _id: new ObjectId(id), quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).send('Book not found or out of stock');
    }
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error borrowing book');
  }
});

// Increase the quantity of the book in the main collection
app.post('/BookCopesIncrease/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await booksCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { quantity: 1 } },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).send('Book not found');
    }
    res.send(result);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).send('Error deleting book');
  }
});

// My Books Collection Get
app.get('/MyBooks/:email', async (req, res) => {
  try {
    const Email = req.params.email;
    const books = await booksCollection.find({ "addedBy.email": Email }).toArray();
    res.send(books);
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
    res.status(500).send('Error deleting borrowed book');
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

export default app;