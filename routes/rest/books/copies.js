const Library = require("../../../models/library.js")
const Book = require("../../../models/book")

module.exports = {

  /**
   * Fetch all copies of a Book in the library
   * @api {get} /bookcopies/:bookid 1.0 Fetch all copies of a Book in the library
   * @apiName fetchBookCopies
   * @apiGroup Inventory-Library
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   * @apiParam  {String} bookid `URL Param` _id of the book
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     books: [{}]
   * }
   */
  async find(req, res) {
    try {
      const books = await Library.find({ _book: req.params.bookid }).populate("_readingHistory _boughtBy _addedBy").exec()
      return res.json({ error: false, books })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a BookCopy by its unique code or _id
   * @api {post} /getbookcopy 2.0 Find a BookCopy by its unique code or _id
   * @apiName getBookCopy
   * @apiGroup Inventory-Library
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} [bookCopyId] The _id of the BookCopy to find (Exactly one of these is mandatory!)
   * @apiParam {String} [code] The code of the BookCopy to find (Exactly one of these is mandatory!)
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     book: {}
   * }
   */
  async get(req, res) {
    const { bookCopyId, code } = req.body
    if (bookCopyId === undefined && code === undefined) return res.status(400).json({ error: true, reason: "Exactly one of fields `bookCopyId` or `code` is mandatory!" })
    const query = (bookCopyId !== undefined)
      ? { _id: bookCopyId }
      : { code }
    try {
      const book = await Library
        .findOne(query)
        .populate("_readingHistory _boughtBy _addedBy")
        .exec()
      return res.json({ error: false, book })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Add one or more new copy of a book
   * @api {post} /bookcopy 3.0 Add one or more new copy of a book
   * @apiName createBookCopy
   * @apiGroup Inventory-Library
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
  * @apiParam {String} bookId The _id of the Book to add (Exactly one of these is mandatory!)
   * @apiParam  {Number} [noOfCopies=1] No. of copies of this Book to add to the library
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     book: {}
   * }
   */
  async post(req, res) {
    try {
      let { bookId, noOfCopies } = req.body
      if (bookId === undefined) return res.status(400).json({ error: true, reason: "Field `bookId` is mandatory!" })
      if (noOfCopies === undefined) noOfCopies = 1
      if (Number.isNaN(noOfCopies)) return res.status(400).json({ error: true, reason: "Field 'noOfCopies' must be a Number!" })

      const copies = await Promise.all([
        Library.create(Array(noOfCopies).fill({
          _book: bookId,
          _addedBy: req.user._id
        })),
        Book.updateOne({ _id: bookId }, {
          $push: {
            inventoryLogs: {
              date: Date.now(),
              action: "added",
              person: req.user._id,
              qty: noOfCopies
            }
          }
        }).exec()
      ])

      return res.json({ error: false, copies })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Mark a BookCopy as bought / retired/ lost (remove it from library)
   * @api {put} /bookcopy/:id? 3.0 Mark a BookCopy as bought / retired / lost (remove it from library)
   * @apiName removeBookCopy
   * @apiGroup Inventory-Library
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} [id] `URL Param` The _id of the BookCopy to remove. If none is mentioned, an available copy will be randomly selected.
   * @apiParam {String} [bookId] _id of the book to remove. Mandatory if `id` is not supplied as url param.
   * @apiParam {String} status The changed status `enum: ["retired", "lost", "sold"]`
   * @apiParam {String} [boughtBy] _id of the subscriber who bought the book copy. MANDATORY when `status` above is `sold`
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async put(req, res) {
    if (req.body.status === undefined) return res.status(400).json({ error: true, reason: "Field `status` is mandatory!" })
    if (!["retired", "lost", "sold"].includes(req.body.status)) return res.status(400).json({ error: true, reason: "Field `status` can only be one of 'retired', 'lost', or 'sold'!" })
    if (req.body.status === "sold" && req.body.boughtBy === undefined) return res.status(400).json({ error: true, reason: "'boughtBy' is mandatory when 'status' is 'sold'!" })
    try {
      const query = { status: "available" }
      if (req.params.id !== undefined) {
        query._id = req.params.id
      } else {
        if (req.body.bookId === undefined) return res.status(400).json({ error: true, reason: "BookId is mandatory since id is not supplied!" })
        query._book = req.body.bookId
      }
      const copy = await Library.findOne(query)
      if (copy === null) return res.status(400).json({ error: true, reason: "No such available Copy of Book to remove!" })
      copy.status = req.body.status
      if (req.body.status === "sold") copy._boughtBy = req.body.boughtBy
      copy.removedOn = Date.now()
      copy.lastModifiedAt = copy.removedOn
      await Promise.all([
        copy.save(),
        Book.updateOne({ _id: req.body.bookId }, {
          $push: {
            inventoryLogs: {
              date: Date.now(),
              action: req.body.status,
              person: req.user._id,
              qty: 1
            }
          }
        }).exec()
      ])
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
