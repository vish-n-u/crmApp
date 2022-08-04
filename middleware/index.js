const verifyAuth = require("./verifyAuth");
const verifyToken = require("./auth.jwt");
const verifyTicket = require("./ticket.middleware");

module.exports = {
  verifyAuth,
  verifyToken,
  verifyTicket,
};
