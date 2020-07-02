const Score = require("../../../models/test-score")
const Book = require("../../../models/book")
const User = require("../../../models/user")
const LevelUp = require("../../../models/level-up")
const ReadingList = require("../../../models/reading-list")

const { nextLevel } = require("../../../lib")

module.exports = {

  /**
   * Add a Test/ Quiz Score for a Subscriber
   * @api {post} /score/:userid 5.0 Add a Test/ Quiz Score for a Subscriber
   * @apiName addScore
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} bookId _id of Book
   * @apiParam  {Number} score Score to add (obtained from external source)
   *
   * @apiSuccessExample {JSON} Success-Response: 200 OK
   *    { error: false, levelUp: true, userId: "abcd1234" }
   */
  async post(req, res) {
    try {
      const {
        bookId, score
      } = req.body
      if (bookId === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'bookId'" })
      if (score === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'score'" })
      const [book, user] = await Promise.all([
        Book.findOne({ _id: bookId }).select("readingLevel").lean().exec(),
        User.findOne({ _id: req.params.userid }).select("currentLevel").lean().exec()
      ])
      if (book === null) throw new Error("No such book!")
      if (user === null) throw new Error("No such user!")
      await Promise.all([
        Score.create({
          _user: req.params.userid,
          _book: bookId,
          level: book.readingLevel, // redundancy!
          score
        }),
        ReadingList.updateOne({ _user: req.params.userid, _book: bookId }, { score, lastModifiedAt: Date.now() }).exec()
      ])
      // Check if the kid got a star!
      if (score >= process.env.THRESHOLD_SCORE_FOR_STAR) {
        await User.updateOne({ _id: req.params.userid }, { $inc: { stars: 1 }, $set: { lastModifiedAt: Date.now() } }).exec()
      }
      // Now check if level up is needed:
      let levelUp = false
      const thresholdScore = process.env.THRESHOLD_SCORE_FOR_LEVEL_UP || 80
      const thresholdCnt = process.env.THRESHOLD_COUNT_FOR_LEVEL_UP || 3
      const cnt = await Score.count({
        _user: req.params.userid,
        level: user.currentLevel,
        score: { $gte: thresholdScore },
      }).exec()
      if (cnt >= thresholdCnt) { // level up!
        levelUp = true
        const previousLevel = user.currentLevel
        const currentLevel = nextLevel(previousLevel)
        await Promise.all([
          User.update({ _id: req.params.userid }, { currentLevel, lastModifiedAt: Date.now() }).exec(),
          LevelUp.create({ _user: req.params.userid, currentLevel, previousLevel }).exec()
        ])
      }
      return res.json({ error: false, levelUp, userId: req.params.userid })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
}
