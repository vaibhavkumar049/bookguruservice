const ReadingList = require("../../../models/reading-list.js")
const Copy = require("../../../models/library.js")
const Book = require("../../../models/book")
const Subscriber = require("../../../models/user")

module.exports = {

  /**
   * Fetch all pending Reading List requests
   * @api {get} /listrequests 0. Fetch all pending Reading List requests
   * @apiName getListRequests
   * @apiGroup ReadingListRequests
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   */
  async get(req, res) {
    try {
      const currentList = await ReadingList
        .find({ status: { $in: ["requested-to-cancel", "requested-to-buy", "reported-lost"] } })
        .populate("_copyInLibrary _book _user")
        .exec()
      return res.json({ error: false, currentList })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Mark a lost book request as penalty paid to free up a slot
   * @api {put} /listrequest/penaltypaid/:id 1.1 Mark a lost book request as penalty paid to free up a slot
   * @apiName penaltyPaid
   * @apiGroup ReadingListRequests
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   * @apiParam  {String} id `URL Param` list request _id to approve
   * @apiParam  {Number} [penaltyAmount] Amount paid as penalty
   *
   */
  async penaltyPaid(req, res) {
    try {
      const listEntry = await ReadingList.findOne({ _id: req.params.id, status: "reported-lost" }).exec()
      if (listEntry === null) throw new Error("No such Reading List Entry with status 'reported-lost'")
      const now = Date.now()
      listEntry.lastModifiedAt = now
      listEntry.status = "penalty-paid"
      if (req.body.penaltyAmount) listEntry.penaltyAmount = req.body.penaltyAmount
      await Promise.all([
        listEntry.save(),
        Copy.updateOne({ _id: listEntry._copyInLibrary }, { status: "lost", lastModifiedAt: now }).exec(),
        Book.updateOne({ _id: listEntry._book }, {
          $push: {
            inventoryLogs: {
              date: now,
              action: "lost",
              person: listEntry._user, // lostBy
              qty: 1
            }
          }
        }).exec(),
        Subscriber.updateOne({ _id: listEntry._user }, {
          $push: {
            paymentHistory: { when: now, amount: req.body.penaltyAmount, note: "Penalty Paid" }
          }
        }).exec()
      ])
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Approve a pending Reading List requests
   * @api {put} /listrequest/:id 1.2 Approve a pending (cancel or buy) Reading List request
   * @apiName approveListRequests
   * @apiGroup ReadingListRequests
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   * @apiParam  {String} id `URL Param` list request _id to approve
   *
   */
  async put(req, res) {
    try {
      const listEntry = await ReadingList.findOne({ _id: req.params.id, status: { $in: ["requested-to-cancel", "requested-to-buy"] } }).exec()
      if (listEntry === null) throw new Error("No such Reading List Entry with pending status")
      const promises = []
      const now = Date.now()
      if (listEntry.cancelRequestApproved === false) {
        listEntry.cancelRequestApproved = true
        listEntry.status = "cancelled"
        promises.push(Copy.updateOne({ _id: listEntry._copyInLibrary }, { status: "available", lastModifiedAt: now }).exec())
      } else if (listEntry.buyRequestApproved === false) {
        listEntry.buyRequestApproved = true
        listEntry.status = "bought"
        promises.push(Copy.updateOne({ _id: listEntry._copyInLibrary }, { status: "sold", lastModifiedAt: now }).exec())
        promises.push(Book.updateOne({ _id: req.body.bookId }, {
          $push: {
            inventoryLogs: {
              date: now,
              action: "sold",
              person: listEntry._user, // purchaser
              qty: 1
            }
          }
        }).exec())
      }
      listEntry.lastModifiedAt = now
      promises.push(listEntry.save())
      await Promise.all(promises)
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

}
