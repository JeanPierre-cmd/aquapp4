import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import importRoutes from './importRoutes.js';
import chatRoutes from './chatRoutes.js';
import documentRoutes from './documentRoutes.js'; // Import the new document routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api', importRoutes);
app.use('/api', chatRoutes);
app.use('/api', documentRoutes); // Use the document routes

// All other GET requests will return your React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
