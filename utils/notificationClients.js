const serverConfig = require("../config/server.config");

const Client = require("node-rest-client").Client;
const client = new Client();

module.exports = (subject, content, reciepients, requester) => {
  const reqBody = {
    subject: subject,
    recipientsEmailId: reciepients,
    content: content,
    requester: requester,
  };
  const reqHeaders = {
    "Content-Type": "application/json",
  };
  const args = {
    data: reqBody,
    headers: reqHeaders,
  };
  try {
    client.post(serverConfig.clientUrl, args, (err, data) => {
      console.log("Request sent");
      console.log(data);
    });
  } catch (err) {
    console.log(err.message);
  }
};
