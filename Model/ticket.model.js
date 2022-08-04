const mongoose = require("mongoose");
const { ticketStatus: constants } = require("../utils/constants");

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ticketPriority: {
    type: Number,
    required: true,
    default: 4,
  },
  description: {
    type: String,
    required: true,
  },
  ticketStatus: {
    type: String,
    enum: [constants.open, constants.closed, constants.blocked],
    required: true,
    default: constants.open,
  },
  reporter: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => {
      return Date.Now;
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.Now;
    },
  },
});

module.exports = mongoose.model("tickets", ticketSchema);
