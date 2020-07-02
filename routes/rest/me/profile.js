const User = require("../../../models/user")

const mail = require("../../../lib/mail")

module.exports = {
  /**
  * Fetch my profile
  * @api {get} /me 1.0 Fetch my profile
  * @apiName getMyProfile
  * @apiGroup MyProfile
  * @apiPermission Subscriber
  *
  * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
  */
  async get(req, res) {
    try {
      const user = await User
        .findOne({ _id: req.user._id })
        .select("-password -forgotpassword")
        .populate("_currentPlan _readingList _testScores _levelUps")
        .populate("subscriptionHistory._plan")
        .exec()
      return res.json({
        error: false,
        user
      })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Request admin to edit profile details
   * @api {put} /me Request admin to edit profile details
   * @apiName requestProfileEdit
   * @apiGroup MyProfile
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"

   * @apiParam  {String[]} fieldsToChange Array of fields to edit and their new values
   * @apiParam  {String} fieldsToChange.fieldName Name of field to edit
   * @apiParam  {Mixed} fieldsToChange.value New value for said field name
   */
  async put(req, res) {
    try {
      const { fieldsToChange } = req.body
      if (!Array.isArray(fieldsToChange) || fieldsToChange.length === 0) return res.json({ error: true, reason: "Nothing to change!" })
      const [admins, subscriber] = await Promise.all([
        User.find({ isAdmin: true }).select("email").lean().exec(),
        User.findOne({ _id: req.user._id }).select("name email phone").exec()
      ])
      await mail("profile-change-request", {
        to: admins.map(a => String(a.email)).join(","),
        subject: "Profile Change Request from Subscriber",
        locals: {
          subscriber,
          fieldsToChange
        }
      })
      return res.status(200).json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
  * Send help query to admins
  * @api {post} /me/help Send help query to admins
  * @apiName helpQuerySend
  * @apiGroup MyProfile
  * @apiPermission Subscriber
  *
  * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"

  * @apiParam  {String} subject Help query subject
  * @apiParam  {String} msg Help query message
  */
  async post(req, res) {
    try {
      if (req.body.msg === undefined || req.body.subject === undefined) return res.status(400).json({ error: true, reason: "Both 'msg' & 'subject' are mandatory!" })
      const [admins, subscriber] = await Promise.all([
        User.find({ isAdmin: true }).select("email").lean().exec(),
        User.findOne({ _id: req.user._id }).select("name email phone").exec()
      ])
      await mail("help-query", {
        to: admins.map(a => String(a.email)).join(","),
        subject: `[HELP] ${req.body.subject}`,
        locals: {
          subscriber,
          subject: req.body.subject,
          msg: req.body.msg
        }
      })
      return res.status(200).json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
