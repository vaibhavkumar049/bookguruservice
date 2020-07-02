
const Plan = require("../../../models/plan.js")

module.exports = {

  /**
   * Fetch all the Plans
   * @api {get} /plans 1.0 Fetch all the Plans
   * @apiName fetchPlans
   * @apiGroup SubscriptionPlan
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     plans: [{}]
   * }
   */
  async find(req, res) {
    try {
      const plans = await Plan.find({}).populate("_booksInPlan").exec()
      return res.json({ error: false, plans })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a Plan by _id
   * @api {get} /plan/:id 2.0 Find a Plan by _id
   * @apiName getPlan
   * @apiGroup Plan
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Plan to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     plan: {}
   * }
   */
  async get(req, res) {
    try {
      const plan = await Plan.findOne({ _id: req.params.id }).populate("_booksInPlan").exec()
      return res.json({ error: false, plan })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new Plan
   * @api {post} /plan 3.0 Create a new Plan
   * @apiName createPlan
   * @apiGroup Plan
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} title Plan title
   * @apiParam  {Number} cycleInDays Plan cycleInDays
   * @apiParam  {Object[]} maxNoOfBooksHeld Max no. of books subscriber can hold at a time
   * @apiParam  {Date} maxNoOfBooksHeld.start Start date of period for which this maxNoOfBooksHeld.qty applies
   * @apiParam  {Date} maxNoOfBooksHeld.end End date of period for which this maxNoOfBooksHeld.qty applies
   * @apiParam  {Number} maxNoOfBooksHeld.number Actual no. of books subscriber can hold at a time
   * @apiParam  {Number} totalNoOfBooks Total no. of books subscriber can borrow during the plan period
   * @apiParam  {Number} validity Plan validity in days
   * @apiParam  {Number} [price] Plan price
   * @apiParam  {Boolean} [isActive=true] Plan active or not
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     plan: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        title, price, cycleInDays, maxNoOfBooksHeld, totalNoOfBooks, validity, isActive
      } = req.body
      if (title === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'title'" })
      if (cycleInDays === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'cycleInDays'" })
      if (validity === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'validity'" })
      if (maxNoOfBooksHeld === undefined || !Array.isArray(maxNoOfBooksHeld)) return res.status(400).json({ error: true, reason: "Missing manadatory field 'maxNoOfBooksHeld' which must be an array!" })
      if (totalNoOfBooks === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'totalNoOfBooks'" })
      const plan = await Plan.create({
        title, price, cycleInDays, maxNoOfBooksHeld, totalNoOfBooks, validity, isActive
      })
      return res.json({ error: false, plan })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a Plan by _id
   * @api {put} /plan/:id 4.0 Edit a Plan by _id
   * @apiName editPlan
   * @apiGroup Plan
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Plan to edit
   * @apiParam  {String} [title] Plan title
   * @apiParam  {Number} [cycleInDays] Plan cycleInDays
   * @apiParam  {Object[]} [maxNoOfBooksHeld] Max no. of books subscriber can hold at a time. N.B.: Setting this entirely replaces the data in this array field in place, i.e. there is no push/append involved
   * @apiParam  {Date} maxNoOfBooksHeld.start Start date of period for which this maxNoOfBooksHeld.qty applies
   * @apiParam  {Date} maxNoOfBooksHeld.end End date of period for which this maxNoOfBooksHeld.qty applies
   * @apiParam  {Number} maxNoOfBooksHeld.number Actual no. of books subscriber can hold at a time   * @apiParam  {Number} [totalNoOfBooks] Total no. of books subscriber can borrow during the plan period
   * @apiParam  {Number} [validity] Plan validity in days
   * @apiParam  {Number} [price] Plan price
   * @apiParam  {Boolean} [isActive] Plan active or not
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     plan: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        title, price, cycleInDays, maxNoOfBooksHeld, totalNoOfBooks, validity, isActive
      } = req.body
      const plan = await Plan.findOne({ _id: req.params.id }).exec()
      if (plan === null) return res.status(400).json({ error: true, reason: "No such Plan!" })

      if (title !== undefined) plan.title = title
      if (price !== undefined) plan.price = price
      if (isActive !== undefined && typeof isActive === "boolean") plan.isActive = isActive
      if (cycleInDays !== undefined) plan.cycleInDays = cycleInDays
      if (maxNoOfBooksHeld !== undefined && Array.isArray(maxNoOfBooksHeld)) plan.maxNoOfBooksHeld = maxNoOfBooksHeld
      if (totalNoOfBooks !== undefined) plan.totalNoOfBooks = totalNoOfBooks
      if (validity !== undefined) plan.validity = validity
      plan.lastModifiedAt = Date.now()

      await plan.save()
      return res.json({ error: false, plan })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a Plan by _id
   * @api {delete} /plan/:id 4.0 Delete a Plan by _id
   * @apiName deletePlan
   * @apiGroup Plan
   * @apiPermission Public
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the Plan to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await Plan.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
