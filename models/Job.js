const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false, // Payment-only records may not need a title
  },
  description: {
    type: String,
    required: false,
  },
  budget: {
    type: Number,
    required: false,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 freelancerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
price: {
  type: Number,
  required: true,
},
isCompleted: {
  type: Boolean,
  default: false,
},
  isFilled: {
    type: Boolean,
    default: false,
  },
  applicants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      resume: String,
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Job", jobSchema);
