const moment = require("moment")

const Book = require("../../../models/book.js")
const Library = require("../../../models/library.js")

module.exports = {

  /**
   * Fetch all the Books
   * @api {post} /books 1.0 Fetch all the Books
   * @apiName fetchBooks
   * @apiGroup Book
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} [level] Optionally filter by reading level
   * @apiParam  {String[]} [authors] Optionally filter results by book authors
   * @apiParam  {String[]} [genres] Optionally filter results by book genres
   */
  async find(req, res) {
    const {
      title,
      level,
      authors,
      genres
    } = req.body
    try {
      const query = {}
      if (level !== undefined) query.readingLevel = level
      if (title !== undefined) query.title = new RegExp(title, "i")
      if (authors !== undefined && Array.isArray(authors)) query.authors = { $in: authors.map(a => new RegExp(a, "i")) }
      if (genres !== undefined && Array.isArray(genres)) query.genres = { $in: genres }
      const books = await Book.find(query).populate("_copiesInLibrary _readingHistory").exec()
      return res.json({ error: false, books })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  // async find(req, res) {
  //   const { level, authors, genres } = req.body
  //   try {
  //     const query = {}
  //     if (level !== undefined) query.readingLevel = level
  //     if (authors !== undefined && Array.isArray(authors)) query.authors = { $in: authors.map(a => new RegExp(a, "i")) }
  //     if (genres !== undefined && Array.isArray(genres)) query.genres = { $in: genres }
  //     const books = await Book.find(query).populate("_copiesInLibrary _readingHistory").exec()
  //     return res.json({ error: false, books })
  //   } catch (err) {
  //     return res.status(500).json({ error: true, reason: err.message })
  //   }
  // },

  /**
   * Find a Book by _id
   * @api {get} /book/:id 2.0 Find a Book by _id
   * @apiName getBook
   * @apiGroup Book
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Book to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     book: {}
   * }
   */
  async get(req, res) {
    try {
      const book = await Book.findOne({ _id: req.params.id }).populate("_copiesInLibrary _readingHistory inventoryLogs.person").exec()
      return res.json({ error: false, book })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Book
   * @api {post} /book 3.0 Create a new Book
   * @apiName createBook
   * @apiGroup Book
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} title Book title
   * @apiParam  {Number} readingLevel Book readingLevel
   * @apiParam  {Number} noOfCopies No. of copies of this Book to add to the library
   * @apiParam  {Number} interestLevel Book interest level
   * @apiParam  {String[]} [authors] Book authors
   * @apiParam  {String[]} [genres] Book genres
   * @apiParam  {String} [publishedOn] Book publishedOn
   * @apiParam  {String} [synopsis] Book synopsis
   * @apiParam  {Number} [wordCount] Book wordCount
   * @apiParam  {Number} [noOfPages] Book noOfPages
   * @apiParam  {String} [bookType] Book bookType
   * @apiParam  {String} [frontCoverUrl] Book frontCoverUrl
   * @apiParam  {String} [backCoverUrl] Book backCoverUrl
   * @apiParam  {String} [series] Book series
   * @apiParam  {Number} [bookNo] Book bookNo
   * @apiParam  {Number} [price] Book price
   * @apiParam  {String} [quizUrl] Book quizUrl
   * @apiParam  {String} [renaissanceId] Book renaissanceId
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     book: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        title, readingLevel, interestLevel, authors, synopsis, wordCount, noOfPages, bookType, frontCoverUrl, backCoverUrl, series, bookNo, genres, publishedOn, price, quizUrl, noOfCopies, renaissanceId
      } = req.body
      if (title === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'title'" })
      if (readingLevel === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'readingLevel'" })
      if (interestLevel === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'interestLevel'" })
      if (noOfCopies === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'noOfCopies'" })
      if (Number.isNaN(noOfCopies)) return res.status(400).json({ error: true, reason: "Field 'noOfCopies' must be a Number!" })

      const createdAt = Date.now()
      const inventoryLogs = [{
        date: createdAt,
        action: "added",
        person: req.user._id,
        qty: noOfCopies
      }]
      const book = await Book.create({
        title, readingLevel, interestLevel, authors, synopsis, wordCount, noOfPages, bookType, frontCoverUrl, backCoverUrl, series, bookNo, genres, publishedOn, price, quizUrl, renaissanceId, inventoryLogs, createdAt
      })
      await Library.create(Array(noOfCopies).fill({
        _book: book.id
      }))
      return res.json({ error: false, book })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a Book by _id
   * @api {put} /book/:id 4.0 Edit a Book by _id
   * @apiName editBook
   * @apiGroup Book
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Book to edit

   * @apiParam  {String[]} [authors] Book authors
   * @apiParam  {String[]} [genres] Book genres
   * @apiParam  {String} [publishedOn] Book publishedOn
   * @apiParam  {String} [title] Book title
   * @apiParam  {String} [readingLevel] Book readingLevel
   * @apiParam  {String} [interestLevel] Book interestLevel
   * @apiParam  {String} [synopsis] Book synopsis
   * @apiParam  {Number} [wordCount] Book wordCount
   * @apiParam  {Number} [noOfPages] Book noOfPages
   * @apiParam  {String} [bookType] Book bookType
   * @apiParam  {String} [frontCoverUrl] Book frontCoverUrl
   * @apiParam  {String} [backCoverUrl] Book backCoverUrl
   * @apiParam  {String} [series] Book series
   * @apiParam  {Number} [bookNo] Book bookNo
   * @apiParam  {Number} [price] Book price
   * @apiParam  {String} [quizUrl] Book quizUrl
   * @apiParam  {String} [renaissanceId] Book renaissanceId
   * @apiParam  {Boolean} [isActive] Book isActive
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     book: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        title, readingLevel, interestLevel, authors, synopsis, wordCount, noOfPages, bookType, frontCoverUrl, backCoverUrl, series, bookNo, genres, publishedOn, price, quizUrl, renaissanceId, isActive
      } = req.body
      const book = await Book.findOne({ _id: req.params.id }).exec()
      if (book === null) return res.status(400).json({ error: true, reason: "No such Book!" })

      if (isActive !== undefined && typeof isActive === "boolean") book.isActive = isActive
      if (title !== undefined) book.title = title
      if (readingLevel !== undefined) book.readingLevel = readingLevel
      if (interestLevel !== undefined) book.interestLevel = interestLevel
      if (authors !== undefined) book.authors = authors
      if (genres !== undefined) book.genres = genres
      if (publishedOn !== undefined) book.publishedOn = publishedOn
      if (synopsis !== undefined) book.synopsis = synopsis
      if (wordCount !== undefined) book.wordCount = wordCount
      if (noOfPages !== undefined) book.noOfPages = noOfPages
      if (bookType !== undefined) book.bookType = bookType
      if (frontCoverUrl !== undefined) book.frontCoverUrl = frontCoverUrl
      if (backCoverUrl !== undefined) book.backCoverUrl = backCoverUrl
      if (series !== undefined) book.series = series
      if (bookNo !== undefined) book.bookNo = bookNo
      if (price !== undefined) book.price = price
      if (quizUrl !== undefined) book.quizUrl = quizUrl
      if (renaissanceId !== undefined) book.renaissanceId = renaissanceId
      book.lastModifiedAt = Date.now()

      await book.save()
      return res.json({ error: false, book })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Book by _id
   * @api {delete} /book/:id 4.0 Delete a Book by _id
   * @apiName deleteBook
   * @apiGroup Book
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Book to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await Book.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
