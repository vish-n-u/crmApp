const constants = require("../utils/constants");
const User = require("../Model/user.model");
const Ticket = require("../Model/ticket.model");

exports.isValidEngineerOrAdmin = async (req, res, next) => {
  if (req.user.userType.toLowerCase() == constants.userTypes.engineer) {
    if (req.user.userStatus.toUpperCase() == "APPROVED") {
      req.currUserId = req.user.userId;
      next();
    } else {
      return res
        .status(400)
        .send("You are not allowed to do the requested action");
    }
  } else if (req.user.userType.toLowerCase() == constants.userTypes.admin) {
    if (req.body.userId) {
      req.currUserId = req.body.userId;
      try {
        let checkUserType = await User.findOne({ userId: req.body.userId });
        if (!checkUserType) {
          return res.status(400).send("Invalid userId provided");
        }
        if (
          checkUserType.userType.toLowerCase() == constants.userTypes.customer
        ) {
          return res.status(400).send("The user is a Customer, 'Dumbo!'");
        }
        next();
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .send("Internal server err, please try again later");
      }
    } else {
      return res
        .status(400)
        .send("You have to provide a valid engineerid to continue");
    }
  } else {
    {
      return res.status(400).send("You are not authorized for this request");
    }
  }
};
exports.ticketvalidator = async (req, res, next) => {
  //check ticketvalidity
  let ticketIssued;
  try {
    ticketIssued = await Ticket.findOne({ _id: req.params.id });
  } catch (err) {
    console.log(err);
    return res.status(500).send("DB error");
  }
  if (!ticketIssued) {
    return res
      .status(400)
      .send(`No such ticket with _id:${req.params.id} is issued`);
  } else {
    req.ticketIssued = ticketIssued;
    next();
  }
};

exports.validateTicketAndUserDetail = async (req, res, next) => {
  // check status validity

  if (!Object.values(constants.ticketStatus).includes(req.body.ticketStatus)) {
    return res
      .status(400)
      .send("ticketStatus should be open,closed or blocked");
  }
  //check if the user wants to keep the same assignee
  if (req.body.assignee == req.ticketIssued.assignee) {
    req.body.assignee = undefined;
  }
  // check if user wants to change ticket assignee
  if (
    req.body.assignee != undefined &&
    req.user.userType.toLowerCase() != constants.userTypes.admin
  ) {
    return res
      .status(400)
      .send("only Admin  can make this request to change assignee.");
  }
  // check whether it is being assigned to a valid engineer
  else if (
    req.body.assignee != undefined &&
    req.user.userType.toLowerCase() == constants.userTypes.admin
  ) {
    let userId = req.body.assignee;
    try {
      let user = await User.findOne({ userId: userId });
      console.log(user.userType.toLowerCase());
      if (!user.userType.toLowerCase() == constants.userTypes.engineer) {
        return res
          .status(400)
          .send(
            "You have provided incorrect userId for this request,this should be requested for an approved engineer"
          );
      } else {
        console.log(user.userStatus.toUpperCase());
        if (!user.userStatus.toUpperCase() == "APPROVED") {
          return res
            .status(400)
            .send(
              "You have  provided incorrect userId for this request,this should be requested for an approved engineer"
            );
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("There was an internal Server Error...");
    }
  }
  //if admin           /req.user is  decoded and found based on jwt verify
  if (req.user.userType.toLowerCase() == constants.userTypes.admin) {
    // is valid
    if (req.user.userStatus.toLowerCase() == "approved") {
      next();
    } else {
      return res
        .status(400)
        .send(
          "only Admin || Engineer Assigned || owner of ticket can make this request  "
        );
    }
  }
  // if it is engineers ticket
  else if (req.user.userType.toLowerCase() == constants.userTypes.engineer) {
    if (
      req.ticketIssued.assignee == req.user.userId || // req.ticketIssued we recieve from the ticketValidator
      req.ticketIssued.reporter == req.user.userId
    ) {
      next();
    } else {
      return res
        .status(400)
        .send(
          "only Admin || Engineer Assigned || owner of ticket can make this request "
        );
    }
  }
  // if you are the owner of ticket
  else {
    if (req.ticketIssued.reporter == req.user.userId) {
      next();
    } else {
      return res
        .status(400)
        .send(
          "only Admin || Engineer Assigned || owner of ticket can make this request "
        );
    }
  }
};
