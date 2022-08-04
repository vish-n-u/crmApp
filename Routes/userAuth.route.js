const authController = require("../Controller/auth.controller");
const middleware = require("../middleware/index");
module.exports = (app) => {
  app.post(
    "/crm/app/v1/signup",
    [middleware.verifyAuth.registration],
    authController.registration
  );
  app.post(
    "/crm/app/v1/login",
    [middleware.verifyAuth.login],
    authController.login
  );
};
