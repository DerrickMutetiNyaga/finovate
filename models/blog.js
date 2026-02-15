const mongoose = require('mongoose');

// Define the Blog schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    tags: {
        type: [String],
        required: true,
        validate: [tags => tags.length > 0, 'At least one tag is required']
    },

    slug: {
        type: String,
        default: function () {
            return `${this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        }
    }
    ,
    content: {
        type: String,
        required: false,
        minlength: 100, // Optional: set a minimum length for content
        maxlength: 10000 // Optional: set a maximum length for content
    },

    image: {
        type: String,
        required: true
    }
});

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

// Export the Blog model
module.exports = Blog;
