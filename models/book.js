const mongoose = require("mongoose")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const BookSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  readingLevel: {
    type: Number,
    required: true
  },

  authors: [String],

  synopsis: String,

  wordCount: Number,
  noOfPages: Number,

  bookType: String,

  frontCoverUrl: String,
  backCoverUrl: String,

  series: String,
  bookNo: Number,

  genres: [{
    type: String,
    enum: (process.env.AVAILABLE_GENRES !== undefined)
      ? process.env.AVAILABLE_GENRES.split(",").map(c => c.trim())
      : ["Poetry", "Drama", "Prose", "Nonfiction", "Media"]
  }],

  publishedOn: String,

  price: Number,

  isActive: {
    type: Boolean,
    default: true
  },

  renaissanceId: String,
  quizUrl: String, // external url to renaissance site

  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },

  userRatings: {
    rating: { type: Number, default: 0, min: 0 },
    noOfRatings: { type: Number, default: 0, min: 0 }
  },

  internationalRating: Number,

  barCode: String,

  ISBN: String,

  interestLevel: {
    type: Number,
    min: 1,
    required: true
  },

  inventoryLogs: [{
    date: { type: Date, default: Date.now },
    action: { type: String, enum: ["added", "retired", "lost", "sold"], default: "added" },
    person: { type: mongoose.Types.ObjectId, ref: "User" },
    qty: { type: Number, min: 1 }
  }]

})


BookSchema.virtual("_copiesInLibrary", {
  ref: "Library", // The model to use
  localField: "_id", // Find copies in library where `localField`
  foreignField: "_book", // is equal to `foreignField`
})

BookSchema.virtual("_readingHistory", {
  ref: "ReadingList", // The model to use
  localField: "_id",
  foreignField: "_book",
})

BookSchema.statics.updateUserRating = async function ({ id, ratingGiven }) {
  try {
    const book = this.findOne({ _id: id }).select("userRatings").exec()
    let { rating, noOfRatings } = book.userRatings
    noOfRatings += 1
    book.userRatings.noOfRatings = noOfRatings
    book.userRatings.rating = (rating + ratingGiven) / noOfRatings
    await book.save()
  } catch (e) {
    console.log("==> Failed to update book rating: ", e.message);
  }
}


BookSchema.set("toJSON", { virtuals: true })
BookSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("Book", BookSchema)
