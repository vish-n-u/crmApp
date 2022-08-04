const User = require("./Model/user.model");
const constants = require("./utils/constants");

exports.change = async () => {
  let allusers = await User.find();
  console.log(allusers);
  allusers.forEach(async (n) => {
    if (n.userStatus.toUpperCase() == constants.userStatus.approved) {
      n.userStatus = "APPROVED";
      await n.save();
      console.log("APPROVED");
    } else {
      n.userStatus = "PENDING";
      await n.save();
      console.log("PENDING");
    }
  });
  console.log("treu");
};
