const middleware = require("../middleware/index");
const ticketController = require("../Controller/ticket.controller");

module.exports = (app) => {
  app.post(
    "/crm/api/v1/users/ticket",
    [middleware.verifyToken.verifyJWT],
    ticketController.createTicket
  );
  app.get(
    "/crm/api/v1/users/ticket/findall",
    [middleware.verifyToken.verifyJWT, middleware.verifyToken.isAdmin],
    ticketController.getAllTickets
  );
  app.get(
    "/crm/api/v1/users/ticket/:id",
    [
      middleware.verifyToken.verifyJWT,
      middleware.verifyToken.isValidUserId,
      middleware.verifyToken.isOwnerOrAdmin,
    ],
    ticketController.getTicketforCustomer
  );
  app.post(
    "/crm/api/v1/users/engineertickets/assigned",
    [
      middleware.verifyToken.verifyJWT,
      middleware.verifyTicket.isValidEngineerOrAdmin,
    ],
    ticketController.getTicketsAssignedToEngineer
  );
  app.put(
    "/crm/api/v1/users/ticketStatus/:id",
    [
      middleware.verifyToken.verifyJWT,
      middleware.verifyTicket.ticketvalidator,
      middleware.verifyTicket.validateTicketAndUserDetail,
    ],
    ticketController.updateTicket
  );
};
