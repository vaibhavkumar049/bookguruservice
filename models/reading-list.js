const mongoose = require("mongoose")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const ReadingListSchema = new mongoose.Schema({

  _copyInLibrary: {
    type: mongoose.Types.ObjectId,
    ref: "Library",
    required: true
  },

  _book: { // redundancy!
    type: mongoose.Types.ObjectId,
    ref: "Book"
  },
  genres: [String], // redundnacy!

  _user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },

  readingLevel: Number, // redundancy!

  status: {
    type: String,
    enum: ["borrowed", "returned-read", "requested-to-cancel", "requested-to-buy", "reported-lost", "cancelled", "bought", "penalty-paid"],
    default: "borrowed" // currently borrowed
  },

  isReissued: {
    type: Boolean,
    default: false // when true, status must be borrowed
  },
  reissuedAt: {
    type: Date,
    default: null
  },

  // _quizScore: { // Usually, if status === returned-read; entered by admin
  //   type: mongoose.Types.ObjectId,
  //   ref: "QuizScore",
  // },
  returnedAt: Date, // if status === returned-read; set by admin

  feedback: {}, // if status === requested-to-cancel; entered by user

  cancelRequestApproved: Boolean, // if status === requested-to-cancel; set by admin. NOT REQUIRED!!

  buyRemarks: String,
  buyRequestApproved: Boolean, // if status === requested-to-buy; set by admin. NOT REQUIRED!!

  penaltyAmount: Number, // if status === penalty-paid; set by admin

  bookedAt: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  dueDate: { // due date of return
    type: Date
  },

  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

  rating: Number,
  score: Number,

})

ReadingListSchema.set("toJSON", { virtuals: true })
ReadingListSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("ReadingList", ReadingListSchema)
