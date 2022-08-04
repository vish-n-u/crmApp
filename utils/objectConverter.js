const Ticket = require("../Model/ticket.model");

exports.response = async (users) => {
  let allUsersLength = users.length;
  let necessaryData = [];
  //   console.log("allusersL:", allUsersLength);

  for (let x = 0; x < allUsersLength; x++) {
    let newObj = {};
    newObj.name = await users[x].name;
    newObj.userId = await users[x].userId;
    newObj.email = await users[x].email;
    newObj.userType = await users[x].userType;
    newObj.userStatus = await users[x].userStatus;
    newObj.createdAt = await users[x].createdAt;
    // console.log("NEWOBJ:", newObj);
    necessaryData.push(newObj);
  }
  //   console.log(necessaryData);
  return necessaryData;
};
