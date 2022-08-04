const Ticket = require("../Model/ticket.model");
const User = require("../Model/user.model");
const constants = require("../utils/constants");
const notificationSender = require("../utils/notificationClients");
exports.createTicket = async (req, res) => {
  // read from the req.body and create a new obj
  const newTicketObj = {
    title: req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
    ticketStatus: req.body.ticketStatus,
    reporter: req.user.userId, // i got it from when jwt was decoded
  };
  // find if an engineer is available
  let authorizedEngineers;
  try {
    authorizedEngineers = await User.find({
      userType: constants.userTypes.engineer,
      userStatus: "Approved",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("There is some internal server issue please try again later");
  }
  console.log(
    authorizedEngineers,
    constants.userTypes.engineer,
    constants.userStatus.approved
  );
  if (authorizedEngineers.length >= 1) {
    // gets the index of engineer with least no. of tickets
    let engineerWithLeastTickets =
      constants.engineerWithLeastTicket(authorizedEngineers);
    let assignableEngineer = await authorizedEngineers[
      engineerWithLeastTickets
    ];
    console.log(assignableEngineer);

    newTicketObj.assignee = assignableEngineer.userId;

    try {
      const newTicket = await Ticket.create(newTicketObj);
      await req.user.ticketCreated.push(newTicket._id);
      await req.user.save();
      await assignableEngineer.ticketAssigned.push(newTicket._id);
      await assignableEngineer.save();
      const newTicketDetail = {
        userId: req.user.userId,
        ticketID: newTicket._id,
        ticketStatus: newTicket.ticketStatus,
        ticketTitle: newTicket.title,
        ticketDescription: newTicket.description,
        createdAt: newTicket.createdAt,
        updatedAt: newTicket.updatedAt,
      };
      notificationSender(
        newTicketDetail.ticketTitle,
        newTicketDetail.ticketDescription,
        "vishnuna26@gmail.com",
        "CRM APP"
      );

      return res.status(200).send(newTicketDetail);
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send("There is some internal server issue please try again later");
    }
  } else {
    res
      .status(500)
      .send(
        "Due to Covid restrictions we have not been able to assign this issue to an engineer please wait and then retry. Sorry for the inconvinence"
      );
  }
  return;
};

exports.getAllTickets = async (req, res) => {
  let allTickets;
  try {
    allTickets = await Ticket.find();
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("There is some internal server issue please try again later");
  }
  res.status(200).send(allTickets);
};

exports.getTicketforCustomer = async (req, res) => {
  let tickets = {};
  let currentTicketUser = await User.findOne({ userId: req.params.id });
  console.log(currentTicketUser);
  if (!currentTicketUser) {
    return res.status(500).send("Server error please try again later");
  }
  let allTickets = currentTicketUser.ticketCreated;
  console.log(allTickets.length);
  if (allTickets.length > 0) {
    try {
      tickets["_id"] = { $in: allTickets };
      let response = await Ticket.find(tickets);
      if (!response) {
        return res.status(200).send("you have not created any tickets  :-) .");
      }
      return res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error please try again later");
    }
  } else {
    return res.status(200).send("you have not created any tickets  :-) .");
  }
};

exports.getTicketsAssignedToEngineer = async (req, res) => {
  let tickets = {};
  let currentUser = await User.findOne({ userId: req.currUserId }); // its the userId we get from ticket.middleware.isValidEngineerOrAdmin
  let allTickets = currentUser.ticketAssigned;
  if (allTickets.length > 0) {
    try {
      tickets["_id"] = { $in: allTickets };
      console.log(tickets, "+++", tickets.id);
      let response = await Ticket.find(tickets);
      if (!response) {
        return res
          .status(200)
          .send("you have not been assigned any new tickets yet  :-( .");
      }

      return res.status(200).send(response);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error please try again later");
    }
  } else {
    return res
      .status(200)
      .send("you have not been assigned any new tickets yet  :-( .");
  }
};

exports.updateTicket = async (req, res) => {
  req.ticketIssued.ticketStatus = req.body.ticketStatus
    ? req.body.ticketStatus
    : req.ticketIssued.ticketStatus;
  req.ticketIssued.ticketDescription = req.body.ticketDescription
    ? req.body.ticketDescription
    : req.ticketIssued.ticketDescription;
  req.ticketIssued.title = req.body.title
    ? req.body.title
    : req.ticketIssued.title;
  req.ticketIssued.ticketPriority = req.body.ticketPriority
    ? req.body.ticketPriority
    : req.ticketIssued.ticketPriority;
  req.ticketIssued.assignee = req.body.assignee
    ? req.body.assignee
    : req.ticketIssued.assignee;

  try {
    await req.ticketIssued.save();
    notificationSender(
      newTicketDetail.ticketTitle,
      newTicketDetail.ticketDescription,
      "vishnuna26@gmail.com",
      "CRM APP"
    );
    return res.status(200).send(req.ticketIssued);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("There was an internal server error, please try again later");
  }
};
