const mongoose = require("mongoose")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const LevelUpSchema = new mongoose.Schema({

  _user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },

  previousLevel: Number,

  currentLevel: Number,

  isManual: {
    type: Boolean,
    default: false
  },
  comment: String,

  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

})

LevelUpSchema.set("toJSON", { virtuals: true })
LevelUpSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("LevelUp", LevelUpSchema)
