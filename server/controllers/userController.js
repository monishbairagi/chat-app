const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    var user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAvatarImageSet: user.isAvatarImageSet,
      displayName: user.displayName,
    }

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    var user = await User.create({
      email: email,
      username: username,
      password: hashedPassword,
    });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAvatarImageSet: user.isAvatarImageSet,
      displayName: user.displayName,
    }

    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id }).select([
      "_id",
      "username",
      "email",
      "isAvatarImageSet",
      "avatarImage",
      "displayName",
    ]);
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "_id",
      "username",
      "email",
      "avatarImage",
      "displayName",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const displayName = req.body.name;
    const avatarImage = req.body.image;

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage: avatarImage,
        displayName: displayName,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      displayName: userData.displayName,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
