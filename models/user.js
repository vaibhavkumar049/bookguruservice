const mongoose = require("mongoose")
const moment = require("moment")
const bcrypt = require("bcrypt-nodejs")

require("./reading-list")
require("./level-up")
require("./test-score")

// const config = require('../config')[process.env.NODE_ENV || 'development'];

const UserSchema = new mongoose.Schema({

  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },

  isAdmin: {
    type: Boolean,
    default: false
  },

  phone: {
    type: String
  },
  whatsApp: {
    type: String
  },
  altPhone: {
    type: String
  },

  password: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  name: {
    first: {
      type: String,
    },
    last: {
      type: String
    },
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  dob: {
    type: String,
    validate: {
      validator(v) {
        return moment(v, "DD-MM-YYYY").isValid()
      },
      message: () => "dob (date of birth) must be a valid date in format 'DD-MM-YYYY'!"
    },
  },

  profilePicUrl: String,

  parentName: {
    first: {
      type: String,
    },
    last: {
      type: String
    },
  },

  school: String,
  schoolCity: String,

  grade: {
    type: String,
    required() {
      return !this.isAdmin
    }
  },

  location: {},

  postalAddress: String,
  city: String,
  pin: String,
  state: String,

  firstLanguage: String,

  community: String,

  currentLevel: {
    type: Number,
    default: 1.0,
    min: 1.0
  },

  pickupDay: { // day of week (0->Sunday)
    type: Number,
    min: 0,
    max: 6,
    required() {
      return !this.isAdmin
    }
  },

  notes: String,

  stars: {
    type: Number,
    min: 0,
    default: 0
  },

  _currentPlan: {
    type: mongoose.Types.ObjectId,
    ref: "Plan",
    required() {
      return !this.isAdmin
    }
  },
  currentPlanStartsOn: {
    type: Date,
    required() {
      return !this.isAdmin
    }
  },
  currentPlanExpiresOn: {
    type: Date,
    required() {
      return !this.isAdmin
    }
  },

  subscriptionHistory: [{ // put stuff inside this only when currentPlanId or currentPlanStartsOn is changed
    _plan: { type: mongoose.Types.ObjectId, ref: "Plan" },
    start: Date,
    end: Date
  }],

  paymentHistory: [{
    when: Date,
    amount: Number,
    note: String
  }],

  forgotpassword: {
    requestedAt: { type: Date, default: null },
    token: { type: String, default: null },
    expiresAt: { type: Date, default: null }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
  _createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  devices: [{
    id: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }] // OneSignal unique Player/Device Id-s

})

// eslint-disable-next-line prefer-arrow-callback
UserSchema.virtual("activeDevices").get(function () {
  return this.devices.filter(d => d.isActive === true)
})

// Save user's hashed password
UserSchema.pre("save", function (next) {
  const user = this
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        next(err)
        return
      }
      bcrypt.hash(user.password, salt, null, (err1, hash) => {
        if (err1) {
          return next(err)
        }
        // saving actual password as hash
        user.password = hash
        return next()
      })
    })
  } else {
    next()
  }
})

// compare two passwords

UserSchema.methods.comparePassword = function (pw) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      if (isMatch === false) return reject(new Error("Credential Mismatch!"))
      return resolve("OK")
    })
  })
}

UserSchema.virtual("name.full").get(function () {
  const first = (this.name.first === undefined || this.name.first === null)
    ? ""
    : this.name.first
  const last = (this.name.last === undefined || this.name.last === null)
    ? ""
    : ` ${this.name.last}`
  return `${first}${last}`
})
UserSchema.virtual("name.full").set(function (v) {
  this.name.first = v.substr(0, v.indexOf(" "))
  this.name.last = v.substr(v.indexOf(" ") + 1)
})

UserSchema.virtual("_readingList", {
  ref: "ReadingList", // The model to use
  localField: "_id",
  foreignField: "_user",
})
UserSchema.virtual("_testScores", {
  ref: "TestScore", // The model to use
  localField: "_id",
  foreignField: "_user",
})
UserSchema.virtual("_levelUps", {
  ref: "LevelUp", // The model to use
  localField: "_id",
  foreignField: "_user",
})

UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })


module.exports = mongoose.model("User", UserSchema)
