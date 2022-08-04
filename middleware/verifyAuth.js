const User = require("../Model/user.model");
const { userTypes: constUserTypes } = require("../utils/constants");
const re =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
exports.registration = async (req, res, next) => {
  //validate userName is provided
  if (!req.body.name) {
    res.status(400).send("No userName is provided");
    return;
  }

  //validate userId is unique
  if (req.body.userId) {
    let userIdExists;
    try {
      if (req.body.userId) {
        userIdExists = await User.findOne({
          userId: req.body.userId,
        });
      }
    } catch (err) {
      res.status(500).send("Db error");
      return;
    }

    if (userIdExists) {
      res.status(400).send("userId already exists");
      return;
    }
  } else {
    res.status(400).send("No userId is provided");
    return;
  }

  //validate wether email id is correct and if it is unique
  if (req.body.email.match(re)) {
    try {
      var existingEmail = await User.findOne({
        email: req.body.email,
      });
    } catch (err) {
      res.status(500).send("Db error");
      return;
    }
    if (existingEmail) {
      res.status(400).send("EmailId already Exists");
      return;
    }
  } else {
    res.status(400).send("EmailId is incorrect");
    return;
  }
  //validate password is present
  if (!req.body.password) {
    res.status(400).send("No password is provided");
    return;
  }

  //validate usertype is present
  if (req.body.userType) {
    if (req.body.userType.toLowerCase() == constUserTypes.admin) {
      return res
        .status(400)
        .send(
          "usertype cant be ADMIN, it should either be engineer or a customer"
        );
    }
    let userTypes = [constUserTypes.customer, constUserTypes.engineer];
    console.log(userTypes);
    if (userTypes.includes(req.body.userType.toLowerCase())) {
      req.userType = req.body.userType.toLowerCase();
      console.log(req.userType);
      next();
    } else {
      return res
        .status(400)
        .send(
          "usertype provided is incorrect it should either be engineer or a customer"
        );
    }
  } else {
    res.status(400).send("No usertype is provided");
    return;
  }
};

exports.login = async (req, res, next) => {
  // verify userId
  if (req.body.userId) {
    if (req.body.password) {
      next();
    } else {
      return res.status(400).send("Provide the password");
    }
  } else {
    return res.status(400).send("Provide the userId");
  }
  //verify password of the userId
};
