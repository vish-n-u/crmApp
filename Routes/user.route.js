const userController = require("../Controller/user.controller");
const userAuthentication = require("../middleware/index");
module.exports = (app) => {
  app.get(
    "/crm/api/v1/users",
    [
      userAuthentication.verifyToken.verifyJWT,
      userAuthentication.verifyToken.isAdmin,
    ],
    userController.findAll
  );
  app.get(
    "/crm/api/v1/users/:id",
    [
      userAuthentication.verifyToken.verifyJWT,
      userAuthentication.verifyToken.isValidUserId,
      userAuthentication.verifyToken.isOwnerOrAdmin,
    ],
    userController.findOneWithId
  );
  app.put(
    "/crm/api/v1/users/update/:id",
    [
      userAuthentication.verifyToken.verifyJWT,
      userAuthentication.verifyToken.isValidUserId,
      userAuthentication.verifyToken.updateOwnerOrAdmin,
    ],
    userController.Update
  );
};
