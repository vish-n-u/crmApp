//this file verifies token
const jwt = require("jsonwebtoken");

const serverConfig = require("../config/server.config");
const User = require("../Model/user.model");
const {
  userTypes: constants,
  updatableUserInfo: updatableUserInfo,
  userStatus: userStatus,
} = require("../utils/constants");
exports.verifyJWT = async (req, res, next) => {
  // check if token exists
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(400).send("You have to login and provide token");
  }
  //check if the user is valid
  let userId;
  try {
    userId = jwt.verify(token, serverConfig.secretKey).id;
  } catch (err) {
    return res.status(400).send("You provided an invalid token");
  }
  let user;
  try {
    user = await User.findOne({
      userId: userId,
    });
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("You provided an invalid token");
  }
};

exports.isAdmin = (req, res, next) => {
  // check wether the user is an approved admin
  const user = req.user;
  if (user.userType == constants.admin) {
    if (user.userStatus.toUpperCase() == "APPROVED") {
      next();
    } else {
      return res.status(400).send("You are not an approved admin");
    }
  } else {
    return res.status(400).send("You are not authorized for this requests");
  }
};

exports.isValidUserId = async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    return res
      .status(400)
      .send("You have to provide the userId for this request");
  } else {
    try {
      let user = await User.findOne({ userId: userId });
      if (user) {
        next();
      } else {
        return res
          .status(400)
          .send("You have  provided incorrect userId for this request");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("There was an internal Server Error...");
    }
  }
};

exports.isOwnerOrAdmin = (req, res, next) => {
  if (
    req.user.userId == req.params.id ||
    req.user.userType == constants.admin
  ) {
    req.userId = req.params.id;
    next();
  } else {
    return res.status(400).send("You are unauthorized for this request");
  }
};

exports.updateOwnerOrAdmin = async (req, res, next) => {
  // check if requester is admin or not
  if (req.user.userType != constants.admin) {
    // if not then check if they want to change their own userName
    if (req.user.userId != req.params.id) {
      return res.status(403).send("You are unauthorized for this request");
    } else {
      // let name = req.body.name;
      if (req.body.userStatus) req.body.userStatus = undefined;
      if (req.body.userType) req.body.userType = undefined;

      next();
    }
  } else {
    // if admin
    if (req.body.userType) {
      // verify userType if present
      if (!Object.values(userType).includes(req.body.userType)) {
        return res.status(403).send("You have provided an invalid userType");
      }
    }
    if (req.body.userType) {
      // verify userType if present
      if (!Object.values(userStatus).includes(req.body.userStatus)) {
        return res.status(403).send("You have provided an invalid userStatus");
      }
    }
    next();
  }
};
