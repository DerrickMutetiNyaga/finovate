const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://finovate21:finovate21@cluster0.fc0pfnq.mongodb.net/finvise?appName=Cluster0';

async function seedAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Check if super admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@finvise.com' });
        if (existingAdmin) {
            console.log('Super admin already exists. Updating...');
            // Update password
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'superadmin';
            existingAdmin.name = 'Super Admin';
            await existingAdmin.save();
            console.log('✅ Super admin updated successfully!');
        } else {
            // Create super admin
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            const superAdmin = new User({
                name: 'Super Admin',
                email: 'admin@finvise.com',
                password: hashedPassword,
                role: 'superadmin'
            });

            await superAdmin.save();
            console.log('✅ Super admin created successfully!');
        }

        console.log('\n📧 Email: admin@finvise.com');
        console.log('🔑 Password: Admin@123');
        console.log('\n⚠️  Please change the password after first login!');

        // Close connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

// Run the seed function
seedAdmin();

