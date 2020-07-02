const mongoose = require("mongoose")
const cuid = require("cuid")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const LibrarySchema = new mongoose.Schema({

  _book: {
    type: mongoose.Types.ObjectId,
    ref: "Book",
    required: true
  },

  code: {
    type: String,
    default: cuid.slug,
    unique: true
  },

  status: {
    type: String,
    enum: ["available", "borrowed", "retired", "lost", "sold"],
    default: "available"
  },

  _boughtBy: { // only for status == "sold"
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  _addedBy: { // an admin
    type: mongoose.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  removedOn: { // status changed to retired/lost/sold
    type: Date,
    default: null,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

})

LibrarySchema.virtual("_readingHistory", {
  ref: "ReadingList", // The model to use
  localField: "_id",
  foreignField: "_copyInLibary",
})

LibrarySchema.set("toJSON", { virtuals: true })
LibrarySchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Library", LibrarySchema)
