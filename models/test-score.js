const mongoose = require("mongoose")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const TestScoreSchema = new mongoose.Schema({

  _user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },

  _book: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
    required: true
  },

  level: Number, // redundancy!

  score: { // percentage, obtained from external sources
    type: Number,
    required: true,
    min: 0,
    max: 100
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
TestScoreSchema.pre("validate", async function (next) {
  if (this.isNew) {
    const { _user, _book, level } = this
    const cnt = await this.model("TestScore").count({ _user, _book, level }).exec()
    if (cnt !== 0) throw new Error("Already entered score for this user, book & reading level!")
  }
  return next()
})

TestScoreSchema.set("toJSON", { virtuals: true })
TestScoreSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("TestScore", TestScoreSchema)
