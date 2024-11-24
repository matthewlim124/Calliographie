const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add username"],
        unique: [true, "Username already exists"],
    },

    password: {
        type: String,
        required: [true, "Please add password"],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);