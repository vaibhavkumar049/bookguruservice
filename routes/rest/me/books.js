const Book = require("../../../models/book.js")
const User = require("../../../models/user.js")

const { nextLevel } = require("../../../lib/index")
const { gradeToInterestLevel } = require("../../../lib/interestLevel")

module.exports = {

  /**
   * Search for a book to read
   * @api {post} /me/findbooks 1.0 Search for a book to read
   * @apiName findBooksToRead
   * @apiGroup MyBooks
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} [title] Optionally filter results by book title
   * @apiParam  {String[]} [authors] Optionally filter results by book authors
   * @apiParam  {String[]} [genres] Optionally filter results by book genres
   * @apiParam  {Boolean} [showChallengeLevel=false] Whether to include challenge level books in search results
   */
  async search(req, res) {
    const {
      title, authors, genres, showChallengeLevel
    } = req.body
    try {
      const me = await User.findOne({ _id: req.user.id }).populate("_currentPlan").exec()
      let query = {}
      if (typeof showChallengeLevel === "boolean" && showChallengeLevel === true) {
        query = { readingLevel: { $in: [me.currentLevel, nextLevel(me.currentLevel)] } }
      } else {
        query = { readingLevel: me.currentLevel }
      }
      if (title !== undefined) query.title = new RegExp(title, "i")
      // if (author !== undefined) query.authors = { $regex: new RegExp(author, "i") }
      if (authors !== undefined && Array.isArray(authors)) query.authors = { $in: authors.map(a => new RegExp(a, "i")) }
      if (genres !== undefined && Array.isArray(genres)) query.genres = { $in: genres }
      query.interestLevel = gradeToInterestLevel(me.grade)

      let books = await Book.find(query).populate("_copiesInLibrary _readingHistory").exec()
      books = books
        .map(b => b.toObject())
        .map(b => ({
          ...b,
          noOfCopiesAvailable: b._copiesInLibrary.filter(c => c.status === "available").length
        }))
      const booksInLevel = books.filter(b => b.readingLevel === me.currentLevel)
      if (showChallengeLevel) {
        const booksInChallengeLevel = books.filter(b => b.readingLevel === nextLevel(me.currentLevel))
        return res.json({ error: false, booksInLevel, booksInChallengeLevel })
      }
      return res.json({ error: false, booksInLevel })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

}
