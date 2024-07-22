const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createTokenLogin = (_id) => {
  return jwt.sign({ _id }, "Alakazam", { expiresIn: "2h" });
};

const signupUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashPassWord = await bcrypt.hash(password, salt);
      const user = new User({
        username,
        password: hashPassWord,
      });
      await user.save();
      res.status(200).json({
        message: "Inscription réussie",
      });
    } else {
      res.status(400).json({
        message: "Pseudo déjà existant",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = createTokenLogin(user._id);

        res.status(200).json({ user, token });
      } else {
        res.status(400).json({ message: "Mauvais pseudo et/ou mot de passe" });
      }
    } else {
      res.status(400).json({ message: "Mauvais pseudo et/ou mot de passe" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
};
