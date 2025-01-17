const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5005;

// Middleware to parse JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow multiple origins
const cors = require('cors');
const allowedOrigins = [
    'http://localhost:3000', // Development
    'https://papaya-genie-0e35c3.netlify.app', // Production
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests from allowed origins or non-browser clients (no origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials if needed
}));

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services (e.g., Outlook, Yahoo)
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail or SMTP email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// Email endpoint
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Validate request data
    if (!name || !email || !message) {
        return res.status(400).send('Missing required fields');
    }

    // Email options
    const mailOptions = {
        from: email, // Sender email
        to: process.env.EMAIL_TO, // Your email
        subject: `New Message from ${name}`, // Subject
        text: `Message: ${message}\n\nSender Email: ${email}`, // Message body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
