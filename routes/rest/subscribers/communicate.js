/* eslint-disable */
const User = require("../../../models/user")

const mail = require("../../../lib/mail")
const push = require("../../../lib/onesignal").send

module.exports = {
  
  /**
   * Send Push Notif OR Email to one or more subscribers
   * @api {post} /communicate 6.0 Send Push Notif OR Email to one or more subscribers
   * @apiName notifySubscribers
   * @apiGroup Subscriber
   * @apiPermission Admin
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String[]} subscriberIds List of _id-s for subscribers to communicate with
   * @apiParam  {Number} type What type of communication to send `enum ["email", "push"]`
   * @apiParam  {Number} msg Message to send
   * @apiParam  {Number} subject Subject/ Title
   * @apiParam  {Boolean} [allUsers=false] For type==push only. If set to `true`, will send push notifications to all devices, irrespective of whether the corrs. user is logged in or not.
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
        subscriberIds, type, msg, subject, allusers
      } = req.body
      if (subscriberIds === undefined || subscriberIds.length === 0) {
        return res.status(400).json({ error: true, reason: "Field `subscriberIds` is mandatory!" })
      }
      if (type === undefined || msg === undefined || subject === undefined) {
        return res.status(400).json({ error: true, reason: "Fields `type`, `subject` & `msg` are mandatory!" })
      }

      const subscribers = await User.find({ _id : { $in: subscriberIds } }).exec()
      if (type === "email") {
        mail("communication", {
          to: subscribers.map(s => s.email),
          subject,
          locals: { msg }
        })
        return res.json({ error: false }) // no waiting!!
      } else if (type === "push") {
        const playerIds = (allUsers === true)
          ? [...new Set(subscribers.reduce((acc, cur) => [...acc, ...cur.devices.map(d => String(d.id))], []))]
          : [...new Set(subscribers.reduce((acc, cur) => [...acc, ...cur.activeDevices.map(d => String(d.id))], []))]
        push(playerIds, msg, subject)
        return res.json({ error: false }) // no waiting!!
      } else {
        return res.status(400).json({ error: false, reason: "`type` can be either 'email' or 'push'" })
      }
      return res.json({ error: false, plan })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
}