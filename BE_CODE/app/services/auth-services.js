const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const configuration = require("../config/config-jwt");
const { status } = require("express/lib/response");
const database = require("../models");
const User = database.user;

exports.signup = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Request can't be empty!",
    });
  }
  const existingUser = await User.findOne({
    where: { username: req.body.username },
  });
  if (existingUser) {
    return res.status(400).send({
      message: "Username already exists",
    });
  }
  try {
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      fullName: req.body.fullName,
      sex: req.body.sex,
      dob: req.body.dob,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      position: req.body.position,
      avatarUrl: req.body.avatarUrl,
      role: req.body.role,
      position_1: req.body.position_1,
      position_level: req.body.position_level,
      start_date: req.body.start_date,
    });

    return res.send({ message: "User successfully registered" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Username and password are required" });
    }

    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password!" });
    }

    const token = jwt.sign({ id: user.id }, configuration.secret, {
      expiresIn: 600,
    });

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
