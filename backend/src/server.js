const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Raw body:', req.body);
  console.log('Content-Type:', req.get('content-type'));
  
  // For debugging validation
  if (req.method === 'POST' && req.url === '/api/contact') {
    console.log('Contact form submission:');
    console.log('- property_id:', req.body.property_id);
    console.log('- name:', req.body.name);
    console.log('- email:', req.body.email);
    console.log('- message:', req.body.message);
  }
  
  next();
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
