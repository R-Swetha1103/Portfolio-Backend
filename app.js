const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
    origin: 'https://papaya-genie-0e35c3.netlify.app/',
    credentials: true,
}));

// Setup email transporter (use Gmail or other SMTP provider)
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service here
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail or SMTP email (to receive)
        pass: process.env.EMAIL_PASS, // Your email password or App password
    },
});

// Receive Email Webhook Route
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('Missing required fields');
    }

    // Create email data to send to swetharagupathy1103@gmail.com
    const mailOptions = {
        from: email, // Sender email (from the user)
        to: process.env.EMAIL_TO, // Your email (receiver)
        subject: `New Message from ${name}`, // Subject
        text: message, // The message from the form
    };

    // Send email using Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Failed to send email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email received successfully');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
