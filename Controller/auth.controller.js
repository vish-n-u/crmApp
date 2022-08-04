const mongoose = require("mongoose");
const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const serverConfig = require("../config/server.config");
const constants = require("../utils/constants");

exports.registration = async (req, res) => {
  let statusVal;
  // check if it is an engineer , if it is engineer then save its userStatus as Pending
  if (
    req.userType == constants.userTypes.engineer ||
    req.userType == constants.userTypes.admin
  ) {
    // console.log(true);
    statusVal = constants.userStatus.pending;
  } else {
    statusVal = constants.userStatus.approved;
  }
  console.log(statusVal);

  try {
    let newUser = await User.create({
      name: req.body.name,
      userId: req.body.userId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      userType: req.userType,
      userStatus: statusVal,
    });
    response = {
      name: newUser.name,
      email: newUser.email,
      Type: newUser.userType,
      Status: newUser.userStatus,
      CreatedAt: newUser.createdAt,
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send("Db Error while registering new user");
    console.log(err);
    return;
  }
};

exports.login = async (req, res) => {
  let existingUser;
  let userPassword;
  // login is done based on unique userId and password
  existingUser = await User.findOne({
    userId: req.body.userId,
  });
  // if a user is engineer and status is pending then login is not allowed
  if (
    existingUser.userType == constants.userTypes.engineer &&
    existingUser.userStatus.toUpperCase() == constants.userStatus.pending
  ) {
    return res
      .status(400)
      .send("Your userStatus is pending hence you are not allowed to login");
  }
  if (existingUser) {
    userPassword = bcrypt.compareSync(req.body.password, existingUser.password);
    // console.log(userPassword);
    if (userPassword) {
      let jwtToken = jwt.sign(
        { id: existingUser.userId },
        serverConfig.secretKey,
        { expiresIn: "10m" }
      );
      // return userDetail + jwt
      let message = {
        name: existingUser.name,
        email: existingUser.email,
        userType: existingUser.userType,
        token: jwtToken,
      };
      res.status(200).send(message);
      console.log(message);
    } else {
      res.status(400).send("The  passWord is incorrect");
      return;
    }
  } else {
    res.status(400).send("The userId  incorrect");
    console.log(err);
  }
};
