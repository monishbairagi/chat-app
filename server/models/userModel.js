const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 5,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
  },
  displayName: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);
