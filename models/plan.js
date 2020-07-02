const mongoose = require("mongoose")
const moment = require("moment")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const PlanSchema = new mongoose.Schema({

  title: { type: String, required: true },

  isActive: {
    type: Boolean,
    default: true
  },

  price: Number,

  cycleInDays: { type: Number, required: true }, // used to compute dueDate from borrowDate

  maxNoOfBooksHeld: [{ // max books held at a time
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    qty: { type: Number, required: true }
  }],

  totalNoOfBooks: { type: Number, required: true },

  validity: { // plan subcription period: used to validate borrows
    type: Number, // no of DAYS;
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

})

// eslint-disable-next-line prefer-arrow-callback
PlanSchema.pre("save", function (next) {
  try {
    if (this.maxNoOfBooksHeld.length === 0) throw new Error("Field `maxNoOfBooksHeld` must be a non-empty Array!")
    const startLaterThanEnd = this.maxNoOfBooksHeld.find(o => moment(o.start).isSameOrAfter(o.end))
    if (startLaterThanEnd !== undefined) throw new Error("All entries in array `maxNoOfBooksHeld` must have end date later than start date")
    return next()
  } catch (error) {
    return next(error)
  }
})

PlanSchema.set("toJSON", { virtuals: true })
PlanSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Plan", PlanSchema)
