const moment = require("moment")

const User = require("../../../models/user.js")
const LevelUp = require("../../../models/level-up")
const Plan = require("../../../models/plan")

const mailer = require("../../../lib/mail")


module.exports = {

  /**
   * Fetch all the Users
   * @api {get} /users 1.0 Fetch all the Users
   * @apiName fetchUsers
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {Number} [level] Optionally filter by user reading level
   * @apiParam {String} [plan] Optionally filter by current plan
   * @apiParam {String} [location] Optionally filter by user location
   * @apiParam {String} [school] Optionally filter by user school
   * @apiParam {String} [grade] Optionally filter by user grade
   * @apiParam {Boolean} [status] Optionally filter by active/inactive users
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     users: [{}]
   * }
   */
  async find(req, res) {
    try {
      const query = { isAdmin: { $ne: true } }
      if (req.body.level) query.level = req.body.level
      if (req.body.plan) query.plan = req.body.plan
      if (req.body.location) query.location = req.body.location
      if (req.body.school) query.school = req.body.school
      if (req.body.grade) query.grade = req.body.grade
      if (req.body.status && typeof req.body.status === "boolean") query.isActive = req.body.status
      const users = await User
        .find(query)
        .select("-password -forgotpassword")
        .populate("_readingList _levelUps _testScores _currentPlan")
        .exec()
      return res.json({ error: false, users })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Find a User by _id
   * @api {get} /user/:id 2.0 Find a User by _id
   * @apiName getUser
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to find
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     user: {}
   * }
   */
  async get(req, res) {
    try {
      const user = await User
        .findOne({ _id: req.params.id })
        .select("-password -forgotpassword")
        .populate("_readingList _levelUps _testScores _currentPlan")
        .exec()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Create a new User
   * @api {post} /user 3.0 Create a new User
   * @apiName createUser
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} email User email
   * @apiParam  {String} password User password
   * @apiParam  {String} currentPlanId _id of User current sbscription plan
   * @apiParam  {Date} currentPlanStartsOn User currentPlanStartsOn
   * @apiParam  {String} grade User grade
   * @apiParam  {Number} pickupDay Pick up day of week for this subscriber. `0 -> Sunday, 1 -> Monday, ...., 6 -> Saturday`
   * @apiParam  {Boolean} [isAdmin=false] User isAdmin
   * @apiParam  {String} [phone] User phone/mobile
   * @apiParam  {String} [whatsApp] User whatsApp no.
   * @apiParam  {String} [altPhone] User alternative phone no
   * @apiParam  {Boolean} [isActive=true] User isActive
   * @apiParam  {Object} [name] User name
   * @apiParam  {String} [name.first] User name.first
   * @apiParam  {String} [name.last] User name.last
   * @apiParam  {String} [gender] User gender `enum=["male", "female", "other"]`
   * @apiParam  {String} [dob] User dob
   * @apiParam  {String} [profilePicUrl] User profilePicUrl
   * @apiParam  {Object} [parentName] User parentName
   * @apiParam  {String} [parentName.first] User parentName.first
   * @apiParam  {String} [parentName.last] User parentName.last
   * @apiParam  {String} [school] User school
   * @apiParam  {String} [schoolCity] User school city
   * @apiParam  {Mixed} [location] User location
   * @apiParam  {String} [postalAddress] User postalAddress
   * @apiParam  {String} [city] User city
   * @apiParam  {String} [pin] User pin
   * @apiParam  {String} [state] User state
   * @apiParam  {String} [notes] User notes
   * @apiParam  {String} [firstLanguage] User firstLanguage
   * @apiParam  {Number} [currentLevel=1.0] User currentLevel
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     user: {}
   * }
   */
  async post(req, res) {
    try {
      const {
        email, isAdmin, phone, whatsApp, altPhone, password, isActive, name, gender, dob, profilePicUrl, parentName, school, schoolCity, grade, location, postalAddress, city, pin, state, firstLanguage, currentLevel, currentPlanId, currentPlanStartsOn, notes, pickupDay
      } = req.body
      if (email === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'email'" })
      if (password === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'password'" })
      if (grade === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'grade'" })
      if (pickupDay === undefined || Number.isNaN(pickupDay) || pickupDay > 6 || pickupDay < 0) {
        return res.status(400).json({ error: true, reason: "Missing manadatory field 'pickupDay' which must be a Number between 0 & 6" })
      }
      if (currentPlanId === undefined) return res.status(400).json({ error: true, reason: "Missing manadatory field 'currentPlanId'" })
      if (currentPlanStartsOn === undefined || !moment(currentPlanStartsOn).isValid()) return res.status(400).json({ error: true, reason: "Missing or invalid manadatory field 'currentPlanStartsOn'" })

      // compute plan end date
      const plan = await Plan.findOne({ _id: currentPlanId }).exec()
      if (plan === null || plan.isActive !== true) return res.status(400).json({ error: true, reason: "Invalid current plan chosen!" })
      const currentPlanExpiresOn = moment(currentPlanStartsOn).clone().add(plan.validity, "days").toDate()

      let user = await User.create({
        email, isAdmin, phone, whatsApp, altPhone, password, isActive, name, gender, dob, profilePicUrl, parentName, school, schoolCity, grade, location, postalAddress, city, pin, state, firstLanguage, currentLevel, _currentPlan: currentPlanId, currentPlanStartsOn, currentPlanExpiresOn, pickupDay, _createdBy: req.user._id, notes
      })
      user = user.toObject()
      delete user.forgotpassword
      delete user.password
      // Send welcome email, but NO WAITING!
      mailer("welcome", {
        to: email,
        subject: "Welcome!!!",
        locals: { email, password, name }
      })
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Edit a User by _id
   * @api {put} /user/:id 4.0 Edit a User by _id
   * @apiName editUser
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to edit

   * @apiParam  {Boolean} [isAdmin=false] User isAdmin
   * @apiParam  {String} [phone] User phone
   *  @apiParam  {String} [whatsApp] User whatsApp no.
   * @apiParam  {String} [altPhone] User alternative phone no
   * @apiParam  {Boolean} [isActive=true] User isActive
   * @apiParam  {Object} [name] User name
   * @apiParam  {String} [name.first] User name.first
   * @apiParam  {String} [name.last] User name.last
   * @apiParam  {String} [gender] User gender `enum=["male", "female", "other"]`
   * @apiParam  {String} [dob] User dob
   * @apiParam  {String} [profilePicUrl] User profilePicUrl
   * @apiParam  {Object} [parentName] User parentName
   * @apiParam  {String} [parentName.first] User parentName.first
   * @apiParam  {String} [parentName.last] User parentName.last
   * @apiParam  {String} [school] User school
   * @apiParam  {String} [schoolCity] User school city
   * @apiParam  {String} [grade] User grade
   * @apiParam  {Number} [pickupDay] Pick up day of week for this subscriber. `0 -> Sunday, 1 -> Monday, ...., 6 -> Saturday`
   * @apiParam  {Mixed} [location] User location
   * @apiParam  {String} [postalAddress] User postalAddress
   * @apiParam  {String} [city] User city
   * @apiParam  {String} [pin] User pin
   * @apiParam  {String} [state] User state
   * @apiParam  {String} [notes] User notes
   * @apiParam  {String} [firstLanguage] User firstLanguage
   * @apiParam  {String} [currentPlanId] _id of User current sbscription plan
   * @apiParam  {Date} [currentPlanStartsOn] User currentPlanStartsOn
   *
   * @apiSuccessExample {type} Success-Response: 200 OK
   * {
   *     error : false,
   *     user: {}
   * }
   */
  async put(req, res) {
    try {
      const {
        isAdmin, phone, whatsApp, altPhone, password, isActive, name, gender, dob, profilePicUrl, parentName, school, schoolCity, grade, location, postalAddress, city, pin, state, firstLanguage, currentPlanStartsOn, currentPlanId, notes, pickupDay
      } = req.body
      let user = await User.findOne({ _id: req.params.id }).exec()
      if (user === null) return res.status(400).json({ error: true, reason: "No such User!" })

      const now = Date.now()

      if (isAdmin !== undefined) user.isAdmin = isAdmin
      if (phone !== undefined) user.phone = phone
      if (whatsApp !== undefined) user.whatsApp = whatsApp
      if (altPhone !== undefined) user.altPhone = altPhone
      if (password !== undefined) user.password = password
      if (isActive !== undefined) user.isActive = isActive
      if (name !== undefined && name.first !== undefined) user.name.first = name.first
      if (name !== undefined && name.last !== undefined) user.name.last = name.last
      if (parentName !== undefined && parentName.first !== undefined) user.parentName.first = parentName.first
      if (parentName !== undefined && parentName.last !== undefined) user.parentName.last = name.last
      if (gender !== undefined) user.gender = gender
      if (dob !== undefined) user.dob = dob
      if (profilePicUrl !== undefined) user.profilePicUrl = profilePicUrl
      if (school !== undefined) user.school = school
      if (schoolCity !== undefined) user.schoolCity = schoolCity
      if (grade !== undefined) user.grade = grade
      if (pickupDay !== undefined && !Number.isNaN(pickupDay) && pickupDay <= 6 && pickupDay > 0) {
        user.pickupDay = pickupDay
      }
      if (location !== undefined) user.location = location
      if (postalAddress !== undefined) user.postalAddress = postalAddress
      if (city !== undefined) user.city = city
      if (pin !== undefined) user.pin = pin
      if (state !== undefined) user.state = state
      if (notes !== undefined) user.notes = notes
      if (firstLanguage !== undefined) user.firstLanguage = firstLanguage
      // if (currentLevel !== undefined) user.currentLevel = currentLevel
      if (currentPlanStartsOn !== undefined || currentPlanId !== undefined) {
        // update subscriptionHistory with old plan
        user.subscriptionHistory.push({
          _plan: user._currentPlan,
          start: user.currentPlanStartsOn,
          end: user.currentPlanExpiresOn
        })
        if (currentPlanId !== undefined) user._currentPlan = currentPlanId
        if (currentPlanStartsOn !== undefined) {
          user.currentPlanStartsOn = currentPlanStartsOn
          // compute plan end date
          const plan = await Plan.findOne({ _id: user._currentPlan }).exec()
          if (plan === null || plan.isActive !== true) return res.status(400).json({ error: true, reason: "Invalid current plan chosen!" })
          user.currentPlanExpiresOn = moment(currentPlanStartsOn).clone().add(plan.validity, "days").toDate()
        }
      }
      user.lastModifiedAt = now

      user = await user.save()
      user = user.toObject()
      delete user.password
      delete user.forgotpassword
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Delete a User by _id
   * @api {delete} /user/:id 4.0 Delete a User by _id
   * @apiName deleteUser
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to delete
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async delete(req, res) {
    try {
      await User.deleteOne({ _id: req.params.id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
  /**
   * Manually change Subscriber Level
   * @api {put} /userlevel/:id 5.0 Manually change Subscriber Level
   * @apiName deleteUser
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id `URL Param` The _id of the User to edit level
   * @apiParam {Number} level New level
   * @apiParam {String} [comment] Reason for manually editing level
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     error : false,
   * }
   */
  async level(req, res) {
    const { level, comment } = req.body
    if (level === undefined) return res.status(400).json({ error: false, reason: "Missing mandatory field 'level'" })
    try {
      const user = await User.findOne({ _id: req.params.id }).exec()
      const previousLevel = user.currentLevel
      const currentLevel = level
      user.currentLevel = level
      user.lastModifiedAt = Date.now()
      await Promise.all([
        user.save(),
        LevelUp.create({
          _user: user._id, isManual: true, previousLevel, currentLevel, comment
        })
      ])
      return res.json({ error: false, previousLevel, currentLevel })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }

}
