const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a transporter using your SMTP settings
const transporter = nodemailer.createTransport({
    host: 'mail.finvise.co.ke',
    port: 465,
    secure: true,
    auth: {
        user: 'info@finvise.co.ke',
        pass: 'Finvise@24', // Use your email account's password
    },
});

// POST endpoint to handle form submission
app.post('/api/request-callback', (req, res) => {
    const { name, email, phone, business } = req.body;

    const mailOptions = {
        from: 'info@finvise.co.ke',
        to: ['dee254041@gmail.com', 'waperit@finvise.co.ke'], // List of recipients
        subject: 'New Callback Request',
        text: `You have received a new callback request from ${name}.\nEmail: ${email}\nPhone: ${phone}\nBusiness Type: ${business}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error occurred while sending email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
