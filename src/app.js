const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Build MongoDB URI from environment variables
const username = process.env.MONGODB_USERNAME || 'mongoadmin';
const password = process.env.MONGODB_PASSWORD || 'mongopassword';
const host = process.env.MONGODB_HOST || 'localhost';
const dbPort = process.env.MONGODB_PORT || '27017';

const uri = `mongodb://${username}:${password}@${host}:${dbPort}`;

// MongoDB client
const client = new MongoClient(uri);

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize MongoDB connection
async function initDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error during init:', error);
    process.exit(1);
  }
}

// GET route to fetch all documents
app.get('/', async (req, res) => {
  try {
    const db = client.db('testdb');
    const collection = db.collection('test');
    const result = await collection.find({}).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send('DB fetch error');
  }
});

// POST route to add a document
app.post('/add', async (req, res) => {
  try {
    const db = client.db('testdb');
    const collection = db.collection('test');
    const result = await collection.insertOne(req.body);
    res.send(result);
  } catch (error) {
    console.error(' Error inserting document:', error);
    res.status(500).send('Insert failed');
  }
});

// PUT route to update an existing document
app.put('/update/:id', async (req, res) => {
  try {
    const db = client.db('testdb');
    const collection = db.collection('test');
    const result = await collection.updateOne(
      { _id: new ObjectID(req.params.id) }, // Match document by ID
      { $set: req.body } // Update fields with the data from the request body
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).send('Document not found');
    }

    res.send('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).send('Update failed');
  }
});

// DELETE route to delete a document
app.delete('/delete/:id', async (req, res) => {
  try {
    const db = client.db('testdb');
    const collection = db.collection('test');
    const result = await collection.deleteOne({ _id: new ObjectID(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).send('Document not found');
    }

    res.send('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).send('Delete failed');
  }
});

// Start server and initialize MongoDB
app.listen(port, async () => {
  await initDB();
  console.log(`Server running on port ${port} and connected to MongoDB at ${uri}`);
});
