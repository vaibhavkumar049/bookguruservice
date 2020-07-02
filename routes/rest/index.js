const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")

// const config = require("../../config")[process.env.NODE_ENV || "development"]

const checkJwt = expressJwt({ secret: process.env.SECRET }) // the JWT auth check middleware

const { onlyAdmin } = require("../../middlewares")

const login = require("./auth")
// const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
/** Admin route defs */
const users = require("./subscribers/users")
const plans = require("./subscribers/plans")
const scores = require("./subscribers/test-scores")
const notifications = require("./notifications")
const communicate = require("./subscribers/communicate")
const books = require("./books")
const copies = require("./books/copies")
const listRequests = require("./books/readingLists")
/** Subscriber route defs */
const profile = require("./me/profile")
const readingList = require("./me/readingLists")
const mybooks = require("./me/books")

router.post("/login", login.post) // UNAUTHENTICATED
router.post("/forgotpass", login.forgotPass) // UNAUTHENTICATED
// router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX
router.post("/books", books.find)

router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

/** Admin Routes */
router.get("/plans", onlyAdmin, plans.find)
router.get("/plan/:id", onlyAdmin, plans.get)
router.post("/plan", onlyAdmin, plans.post)
router.put("/plan/:id", onlyAdmin, plans.put)
router.delete("/plan/:id", onlyAdmin, plans.delete)

router.get("/users", onlyAdmin, users.find)
router.get("/user/:id", onlyAdmin, users.get)
router.post("/user", onlyAdmin, users.post)
router.put("/user/:id", onlyAdmin, users.put)
router.put("/userlevel/:id", onlyAdmin, users.level)
router.delete("/user/:id", onlyAdmin, users.delete)

router.post("/score/:userid", onlyAdmin, scores.post)

router.post("/device", notifications.addDevice)
router.delete("/device/:id", notifications.removeDevice)
router.post("/communicate", onlyAdmin, communicate.post)

router.get("/book/:id", onlyAdmin, books.get)
router.post("/book", onlyAdmin, books.post)
router.put("/book/:id", onlyAdmin, books.put)
router.delete("/book/:id", onlyAdmin, books.delete)

router.get("/bookcopies/:bookid", onlyAdmin, copies.find)
router.post("/getbookcopy", onlyAdmin, copies.get)
router.post("/bookcopy", onlyAdmin, copies.post)
router.put("/bookcopy/:id?", onlyAdmin, copies.put)

router.get("/listrequests", onlyAdmin, listRequests.get)
router.put("/listrequest/penaltypaid/:id", onlyAdmin, listRequests.penaltyPaid)
router.put("/listrequest/:id", onlyAdmin, listRequests.put)

/** Subscriber Routes (all prefixed with /me) */
router.get("/me", profile.get)
router.put("/me", profile.put)
router.post("/me/help", profile.post)

router.post("/me/findbooks", mybooks.search)

router.get("/me/currentlist", readingList.getCurrentList)
router.post("/me/readinglists", readingList.find)
router.get("/me/readinglist/:id", readingList.get)
router.post("/me/readinglist", readingList.post)
router.put("/me/readinglist/return/:id", readingList.returnBook)
router.put("/me/readinglist/reissue/:id", readingList.reissueBook)
router.put("/me/readinglist/cancel/:id", readingList.cancelBook)
router.put("/me/readinglist/buy/:id", readingList.buyBook)
router.put("/me/readinglist/lost/:id", readingList.reportLost)


module.exports = router
