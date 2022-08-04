const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    minLength: 10,
    unique: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
  userType: {
    type: String,
    required: true,
    default: "customer",
  },
  userStatus: {
    type: String,
    required: true,
    default: "APPROVED",
  },
  ticketCreated: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "tickets",
  },
  ticketAssigned: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "tickets",
  },
});

const userModel = new mongoose.model("user", userSchema);
module.exports = userModel;
