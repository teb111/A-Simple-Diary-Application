const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    // fields we will return when we authenticate with google
    googleId: {
        type: String,
        required: true,
    },

    displayName: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },

    createdAt: {
       type: Date,
       default: Date.now(),
    }
});

module.exports = mongoose.model('User', userSchema);