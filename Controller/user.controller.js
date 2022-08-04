// this file is for providing user resource;
const User = require("../Model/user.model");
const objectConvertor = require("../utils/objectConverter");
//get the list of all the resource
exports.findAll = async (req, res) => {
  let queryObj = {};
  // filter the user based on userStatus and userType and return those back
  let userStatusQuery = req.query.userStatus;
  let userTypeQuery = req.query.userType;
  console.log(userStatusQuery, userTypeQuery);
  if (userStatusQuery) {
    queryObj.userStatus = userStatusQuery;
  }
  if (userTypeQuery) {
    queryObj.userType = userTypeQuery;
  }
  console.log(queryObj);
  let allUsers;
  try {
    allUsers = await User.find(queryObj);
    const necessaryData = await objectConvertor.response(allUsers);
    // console.log("=====", necessaryData);
    return res.status(200).send(necessaryData);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Db issue , please Wait and then retry");
  }
};
exports.findOneWithId = async (req, res) => {
  let newUser;
  try {
    newUser = await User.findOne({
      userId: req.userId,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was an internal Server Error...");
  }
  response = {
    name: newUser.name,
    email: newUser.email,
    Type: newUser.userType,
    Status: newUser.userStatus,
    CreatedAt: newUser.createdAt,
  };
  res.status(200).send(response);
};

exports.Update = async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.params.id });
    user.name = req.body.name ? req.body.name : user.name;
    user.userStatus = req.body.userStatus
      ? req.body.userStatus
      : user.userStatus;
    user.userType = req.body.userType ? req.body.userType : user.userType;
    let response = {
      name: user.name,
      email: user.email,
      Type: user.userType,
      Status: user.userStatus,
      CreatedAt: user.createdAt,
    };
    await user.save();
    res.status(200).send(response);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("There is a db error");
  }
};
