const moment = require("moment")

const ReadingList = require("../../../models/reading-list.js")
const Book = require("../../../models/book.js")
const Copy = require("../../../models/library.js")
const User = require("../../../models/user.js")

const { comingDayOfWeek } = require("../../../lib")


module.exports = {

  /**
   * Fetch your currently borrowed books
   * @api {get} /me/currentlist 0. Fetch your currently borrowed books (includes _pending_ requests for buying/cancelling & reported lost too)
   * @apiName getCurrentList
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     readingLists: [{}]
   * }
   */
  async getCurrentList(req, res) {
    try {
      const currentList = await ReadingList
        .find({ _user: req.user._id, status: { $in: ["borrowed", "requested-to-cancel", "requested-to-buy", "reported-lost"] } })
        .populate("_copyInLibrary _book")
        .exec()
      return res.json({ error: false, currentList })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Fetch all your ReadingLists (including historical)
   * @api {post} /me/readinglists 1.0 Fetch all entries in your ReadingList (including historical)
   * @apiName fetchReadingLists
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
  * @apiParam  {Number} [level] Optionally filter by level
  * @apiParam  {String[]} [genres] Optionally filter by genres
  * @apiParam  {Number} [score] Optionally filter by quiz score
  * @apiParam  {Number} [rating] Optionally filter by rating given
  * @apiParam  {Date} [startDate] Optionally filter by start date (in standard date forma)
  * @apiParam  {Date} [endDate] Optionally filter by end date (in standard date forma). Mandatory if startDate is specified.
   *r
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     readingListEntries: [{}]
   * }
   */
  async find(req, res) {
    const {
      level, genres, score, rating, startDate, endDate
    } = req.body
    if (startDate !== undefined) {
      if (!moment(startDate).isValid()) return res.status(400).json({ error: true, reason: "Invalid format for 'startDate'" })
      if (endDate === undefined) return res.status(400).json({ error: true, reason: "'endDate' is mandatory if 'startDate' is specified!" })
      if (!moment(endDate).isValid()) return res.status(400).json({ error: true, reason: "Invalid format for 'endDate'" })
    }
    try {
      const query = { _user: req.user._id }
      if (level !== undefined) query.readingLevel = level
      if (genres !== undefined && Array.isArray(genres)) query.genres = { $in: genres }
      if (score !== undefined) query.score = score
      if (rating !== undefined) query.rating = rating
      if (startDate !== undefined) {
        query.borrwedAt = {
          $gte: startDate,
          $lte: endDate
        }
      }
      const readingListEntries = await ReadingList
        .find(query)
        .populate("_copyInLibrary _book")
        .exec()
      return res.json({ error: false, readingListEntries })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a ReadingList entry by _id
   * @api {get} /me/readingList/:id 2.0 Find a ReadingList entry by _id
   * @apiName getReadingList
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of your ReadingList to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     readingListEntry: {}
   * }
   */
  async get(req, res) {
    try {
      const readingListEntry = await ReadingList
        .findOne({ _id: req.params.id, _user: req.user._id })
        .populate("_copyInLibrary _book")
        .exec()
      return res.json({ error: false, readingListEntry })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Borrow a book
   * @api {post} /me/readinglist 3.0 Borrow a book
   * @apiName borrowBook
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} bookId _id of the book to borrow
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     readingListEntry: {}
   * }
   */
  async post(req, res) {
    const { bookId } = req.body
    if (bookId === undefined) return res.status(400).json({ error: true, reason: "Field 'bookId' is mandatory!" })
    try {
      const now = Date.now()
      const me = await User
        .findOne({ _id: req.user.id })
        .populate("_currentPlan")
        .populate({
          path: "_readingList",
          // match: {
          //   status: { $in: ["borrowed", "requested-to-cancel", "requested-to-buy", "reported-lost"] }
          // }
        })
        .exec()
      // Validations:
      const maxAllowedBookAsOfToday = me._currentPlan.maxNoOfBooksHeld.find(obj => moment().isBetween(obj.start, obj.end, "days", "[]"))
      const hasLostButNotPaidPenaltyYet = me._readingList.find(e => e.status === "reported-lost") !== undefined
      if (hasLostButNotPaidPenaltyYet) throw new Error("You have lost a Book but not paid penalty yet!")
      const currentlyHeldBooks = me._readingList.filter(e => ["borrowed", "requested-to-cancel", "requested-to-buy", "reported-lost"].includes(e.status))
      const allTheBooksBorrowed = me._readingList.filter(e => moment(e.borrowedAt).isBetween(me.currentPlanStartsOn, me.currentPlanExpiresOn, "day", "[]"))
      if (maxAllowedBookAsOfToday !== undefined && currentlyHeldBooks.length >= maxAllowedBookAsOfToday.qty) throw new Error(`You are currently holding the maximum no. of books (${maxAllowedBookAsOfToday.qty}) as of today allowed in your current plan!`)
      if (allTheBooksBorrowed.length >= me._currentPlan.totalNoOfBooks) throw new Error(`You have already borrowed the total no. of books (${me._currentPlan.totalNoOfBooks}) as allowed in your current plan!`)
      // const myPlanStartMoment = moment(me._currentPlan.createdAt)
      // const myPlanEndMoment = moment(myPlanStartMoment).add(me._currentPlan.validity, "days")
      // if (myPlanEndMoment.isBefore(now, "hours")) throw new Error("Your subscription plan has expired!")
      if (moment(me.currentPlanExpiresOn).isBefore(now, "hours")) throw new Error("Your subscription plan has expired!")

      // Compute borrow date:
      const borrowDate = comingDayOfWeek(me.pickupDay)

      const [book, copy] = await Promise.all([
        Book.findOne({ _id: bookId, readingLevel: me.currentLevel }).exec(),
        Copy.findOne({ _book: bookId, status: "available" }).exec()
      ])
      if (book === null) throw new Error("No such book in your current reading level!")
      if (copy === null) throw new Error("No copy of the book is currently available!")
      const promises = []
      copy.status = "borrowed"
      copy.lastModifiedAt = now
      promises.push(copy.save())
      promises.push(ReadingList.create({
        _book: bookId,
        genres: book.genres, // redundancy to facilitate filtering while searching
        _copyInLibary: copy._id,
        _user: req.user._id,
        readingLevel: me.currentLevel, // redundancy to facilitate filtering while searching
        status: "borrowed",
        borrowDate,
        dueDate: moment(borrowDate).add(me._currentPlan.cycleInDays, "days").toDate()
      }))

      const [_, readingListEntry] = await Promise.all(promises)
      return res.json({ error: false, readingListEntry })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Return a Book in your Reading List after reading it
   * @api {put} /me/readinglist/return/:id 4.0 Return a Book in your Reading List after reading it
   * @apiName returnBook
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of your ReadingList entry to return
   * @apiParam {String} [rating] Your Rating
   */
  async returnBook(req, res) {
    try {
      const readingListEntry = await ReadingList.findOne({ _id: req.params.id }).exec()
      if (readingListEntry === null) return res.status(400).json({ error: true, reason: "No such ReadingList Entry!" })
      if (readingListEntry.status !== "borrowed") throw new Error("You can only return a book which you've currently borrowed!")

      const now = Date.now()
      const promises = []
      readingListEntry.status = "returned-read"
      readingListEntry.lastModifiedAt = now
      readingListEntry.returnedAt = readingListEntry.lastModifiedAt
      if (req.body.rating !== undefined) {
        readingListEntry.rating = req.body.rating
        promises.push(Book.updateUserRating({ id: readingListEntry._book, ratingGiven: req.body.rating }))
      }
      promises.push(readingListEntry.save())
      // Now set the corrs. book copy as available again
      promises.push(Copy.updateOne({ _id: readingListEntry._copyInLibrary }, { status: "available", lastModifiedAt: now }).exec())

      await Promise.all(promises)
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  /**
   * Reissue a Book in your Reading List because you did'nt finish reading it
   * @api {put} /me/readinglist/reissue/:id 5.0 Reissue a Book in your Reading List because you did'nt finish reading it
   * @apiName reissueBook
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of your ReadingList entry to reissue
   */
  async reissueBook(req, res) {
    try {
      const readingListEntry = await ReadingList.findOne({ _id: req.params.id }).exec()
      if (readingListEntry === null) return res.status(400).json({ error: true, reason: "No such ReadingList Entry!" })
      if (readingListEntry.status !== "borrowed") throw new Error("You can only reissue a book which you've currently borrowed!")

      const me = await User.findOne({ _id: req.user.id }).populate("_currentPlan").exec()
      const now = Date.now()

      readingListEntry.status = "borrowed"
      readingListEntry.lastModifiedAt = now
      readingListEntry.isReissued = true
      readingListEntry.reissuedAt = now
      readingListEntry.dueDate = moment(now).add(me._currentPlan.cycleInDays, "days").toDate()

      await readingListEntry.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  /**
   * Request to Cancel a Book in your Reading List because you did'nt like reading it
   * @api {put} /me/readinglist/cancel/:id 6.0 Request to Cancel a Book in your Reading List because you did'nt like reading it
   * @apiName cancelBook
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of your ReadingList entry to cancel
   * @apiParam {Mixed} feedback Your Feedback (reason to cancel)
   */
  async cancelBook(req, res) {
    try {
      const readingListEntry = await ReadingList.findOne({ _id: req.params.id }).exec()
      if (readingListEntry === null) return res.status(400).json({ error: true, reason: "No such ReadingList Entry!" })
      if (readingListEntry.status !== "borrowed") throw new Error("You can only request to cancel a book which you've currently borrowed!")

      const now = Date.now()

      readingListEntry.status = "requested-to-cancel"
      readingListEntry.lastModifiedAt = now
      readingListEntry.feedback = req.body.feedback
      readingListEntry.cancelRequestApproved = false

      await readingListEntry.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  /**
   * Request to Buy a Book in your Reading List
   * @api {put} /me/readinglist/buy/:id 7.0 Request to Buy a Book in your Reading List
   * @apiName buyBook
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of your ReadingList entry to buy
   * @apiParam {String} [buyRemarks] Your remark as to how you have paid
   */
  async buyBook(req, res) {
    try {
      const readingListEntry = await ReadingList.findOne({ _id: req.params.id }).exec()
      if (readingListEntry === null) return res.status(400).json({ error: true, reason: "No such ReadingList Entry!" })
      if (readingListEntry.status !== "borrowed") throw new Error("You can only request to buy a book which you've currently borrowed!")

      const now = Date.now()

      readingListEntry.status = "requested-to-buy"
      readingListEntry.lastModifiedAt = now
      readingListEntry.buyRequestApproved = false
      if (req.body.buyRemarks !== undefined) readingListEntry.buyRemarks = req.body.buyRemarks

      await readingListEntry.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  /**
   * Report a Book as Lost in your Reading List
   * @api {put} /me/readinglist/lost/:id 8.0 Report a Book in your Reading List as Lost
   * @apiName lostBook
   * @apiGroup MyReadingList
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of your ReadingList entry to report lost
   */
  async reportLost(req, res) {
    try {
      const readingListEntry = await ReadingList.findOne({ _id: req.params.id }).exec()
      if (readingListEntry === null) return res.status(400).json({ error: true, reason: "No such ReadingList Entry!" })
      if (readingListEntry.status !== "borrowed") throw new Error("You can only report as lost a book which you've currently borrowed!")

      const now = Date.now()

      readingListEntry.status = "reported-lost"
      readingListEntry.lastModifiedAt = now

      await readingListEntry.save()
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

}
