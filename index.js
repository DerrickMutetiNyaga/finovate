const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Added MongoStore for session storage
require('dotenv').config(); // Load environment variables

const Blog = require('./models/blog');
const Logo = require('./models/Logo');
const User = require('./models/user');

const app = express();

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://finovate21:finovate21@cluster0.fc0pfnq.mongodb.net/finvise?appName=Cluster0';
mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware configuration with MongoStore
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri, // MongoDB connection string for sessions
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: false, // Change to true if using HTTPS
        sameSite: 'lax',
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Route for root URL
app.get('/', (req, res) => {
    res.redirect('home.html');
});

// Route for /admin URL
app.get('/admin', (req, res) => {
    res.redirect('/admin/html/public/login.html');
});

// Middleware for authentication check
const checkAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/admin/html/public/login.html');
    }
};

// Session status endpoint
app.get('/api/check-session', (req, res) => {
    res.json({ session: req.session });
});

// Route to check authentication status
app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.userId });
});

// User signup route
app.post('/signup', async (req, res) => {
    const { yourName, yourEmail, yourPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email: yourEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
        }

        const hashedPassword = await bcrypt.hash(yourPassword, 10);
        const newUser = new User({
            name: yourName,
            email: yourEmail,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup.' });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { yourEmail, yourPassword } = req.body;

    try {
        const user = await User.findOne({ email: yourEmail });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(yourPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        req.session.userId = user._id;
        req.session.userName = user.name;
        res.json({ message: 'Login successful!', user: { id: user._id, name: user.name } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
});

// Logout route
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out. Please try again.' });
        }
        res.clearCookie('connect.sid', { path: '/' }); // Ensure the path is correctly specified
        res.status(200).json({ message: 'Logout successful' });
    });
});

// Blog Routes

// Route to add a blog (protected)
app.post('/add-blog', checkAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, author, category, tags, publishDate, content } = req.body;
        const tagArray = tags.split(',').map(tag => tag.trim());

        const newBlog = new Blog({
            title,
            author,
            category,
            publishDate,
            tags: tagArray,
            content,
            image: req.file ? req.file.path : null
        });

        await newBlog.save();
        res.redirect('/admin/html/public/bloglist.html');
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('An error occurred while creating the blog post.');
    }
});

// Route to edit a blog (protected)
app.post('/edit-blog', checkAuth, upload.single('image'), async (req, res) => {
    const { blogId, title, author, category, tags, publishDate, content } = req.body;

    try {
        const tagArray = tags.split(',').map(tag => tag.trim());
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            title, author, category, tags: tagArray, publishDate, content,
            image: req.file ? req.file.path : null
        }, { new: true });

        if (!updatedBlog) {
            return res.status(404).send('Blog not found');
        }

        res.redirect('/admin/html/public/bloglist.html');
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send('An error occurred while updating the blog post.');
    }
});

// Route to fetch all blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).send('An error occurred while fetching blogs.');
    }
});
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).send('An error occurred while fetching blogs.');
    }
});


// Route to fetch a blog by ID
app.get('/api/blogs/:id', async (req, res) => {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).send('Invalid blog ID format');
    }

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        res.json(blog);
    } catch (error) {
        res.status(500).send('An error occurred while fetching the blog.');
    }
});

// Route to delete a blog by ID
app.delete('/blogs/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const result = await Blog.findByIdAndDelete(blogId);
        if (!result) {
            return res.status(404).send('Blog not found');
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to fetch recent blogs
app.get('/api/recent-blogs', async (req, res) => {
    try {
        const recentPosts = await Blog.find().sort({ publishDate: -1 }).limit(5);
        res.json(recentPosts);
    } catch (error) {
        res.status(500).send('An error occurred while fetching recent posts.');
    }
});

// Logo Routes

// Route to add a logo
app.post('/add-logo', upload.single('image'), async (req, res) => {
    try {
        const { logoName, date } = req.body;
        const newLogo = new Logo({
            logoName,
            date,
            image: req.file ? req.file.path : null
        });
        await newLogo.save();
        res.redirect('/admin/html/public/client.html');
    } catch (error) {
        res.status(500).send('An error occurred while adding the logo.');
    }
});

// Route to fetch all logos
app.get('/api/logos', async (req, res) => {
    try {
        const logos = await Logo.find();
        res.json(logos);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to delete a logo by ID
app.delete('/api/logos/:id', async (req, res) => {
    try {
        const logoId = req.params.id;
        const result = await Logo.findByIdAndDelete(logoId);
        if (!result) {
            return res.status(404).json({ message: 'Logo not found' });
        }
        res.status(200).json({ message: 'Logo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
