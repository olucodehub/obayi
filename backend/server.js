const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
require('dotenv').config();

const database = require('./config/database');
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const studentRoutes = require('./routes/students');
const adminRoutes = require('./routes/admin');
const { apiLimiter, speedLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'https://ambitious-mushroom-03632ab03.6.azurestaticapps.net',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // In development, allow all localhost origins
        if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Security middleware - must be early in the middleware chain
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow file access from frontend
    contentSecurityPolicy: false // Disable CSP as we're serving an API
}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);
app.use('/api/', speedLimiter);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint - test if Node.js is running
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Obayi Backend API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint - verifies backend is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Obayi Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!', 
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
    try {
        // Connect to database
        await database.connect();
        console.log('Database connected successfully');

        // NOTE: Schema initialization removed - PostgreSQL schema is deployed separately
        // See backend/schema-postgres.sql for the database schema
        // Schema should be deployed manually or via migration scripts

        console.log('Database ready - schema managed separately');
    } catch (error) {
        console.error('Database connection failed:', error);
        console.log('Server will start anyway, but database operations may fail');
    }

    // Start server regardless of database status
    app.listen(PORT, () => {
        console.log(`Obayi Backend API server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
        console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'not set'}`);
    });
}

startServer();