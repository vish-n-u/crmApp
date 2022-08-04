module.exports = {
  userTypes: {
    customer: "customer",
    admin: "admin",
    engineer: "engineer",
  },
  updatableUserInfo: ["name", "userType", "userStatus"],
  ticketStatus: {
    open: "open",
    closed: "closed",
    blocked: "blocked",
  },
  userStatus: {
    approved: "APPROVED",
    pending: "PENDING",
  },
  engineerWithLeastTicket: (authorizedEngineers) => {
    {
      let engineerWithLeastTickets = 0; // engineer with least number of tickets
      for (let x = 1; x < authorizedEngineers.length; x++) {
        if (
          authorizedEngineers[x].ticketAssigned.length <
          authorizedEngineers[engineerWithLeastTickets].ticketAssigned.length
        ) {
          engineerWithLeastTickets = x;
        }
      }
      return engineerWithLeastTickets;
    }
  },
};
