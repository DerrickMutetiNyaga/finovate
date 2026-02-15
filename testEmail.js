const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.finvise.co.ke',
    port: 465,
    secure: true, // true for 465
    auth: {
        user: 'info@finvise.co.ke',
        pass: 'Finvise@24', // Replace with your email password
    },
});

transporter.sendMail({
    from: 'info@finvise.co.ke',
    to: 'dee254041@gmail.com', // Change this to your test recipient
    subject: 'Test Email',
    text: 'This is a test email to check SMTP configuration.',
}, (error, info) => {
    if (error) {
        console.error('Error sending test email:', error);
    } else {
        console.log('Test email sent:', info.response);
    }
});
