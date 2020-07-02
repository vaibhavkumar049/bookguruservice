const jwt = require("jsonwebtoken")

const User = require("../../../models/user")

const mail = require("../../../lib/mail")

module.exports = {
  /**
  * @api {POST} /login 1. Authenticate an user and get a JWT on success
  * @apiName Login
  * @apiGroup Auth
  * @apiVersion  1.0.0
  * @apiPermission Public
  *
  * @apiParam  {String} handle User email/mobile to login with
  * @apiParam  {String} password User password (plaintext)
  * @apiParam  {String} [expiry=720] Life of the JWT in hours
  *
  * @apiSuccessExample {JSON} Success-Response: 200 OK
  *    {
        error: false,
        isAdmin: false,
        handle: 'foo@bar.com',
        token: 'XXX.YYYYY.ZZZZZZZ'
      }
  */
  async post(req, res) {
    try {
      // const { type } = req.params
      const { handle, password } = req.body
      if (handle === undefined || password === undefined) {
        return res.status(400).json({ error: true, reason: "Fields `handle` and `password` are mandatory" })
      }
      const user = await User.findOne({
        $or: [{ email: handle.toLowerCase() }, { phone: handle }]
      }).exec()
      if (user === null) throw new Error("User Not Found")
      if (user.isActive === false) throw new Error("User Inactive")
      // check pass
      await user.comparePassword(password)
      // No error, send jwt
      const payload = {
        id: user._id,
        _id: user._id,
        fullName: user.name.full,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600 * 24 * 30 // 1 month
      })
      return res.json({
        error: false, isAdmin: user.isAdmin, handle, token
      })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   * Request to send forgotten password
   * @api {method} /path 2. Request to send forgotten password
   * @apiName requestForgottenPass
   * @apiGroup Auth
   * @apiPermission Public
   *
   * @apiParam  {String} email Email for which password is forgotten
   */
  async forgotPass(req, res) {
    try {
      const { email } = req.body
      if (email === undefined) {
        return res.status(400).json({ error: true, reason: "Field `email` is mandatory" })
      }
      const [admins, subscriber] = await Promise.all([
        User.find({ isAdmin: true }).select("email").lean().exec(),
        User.findOne({ email: email.toLowerCase() }).select("name email phone").exec()
      ])
      if (subscriber === null) throw new Error("Subscriber Not Found!")
      await mail("forgot-password-request", {
        to: admins.map(a => String(a.email)).join(","),
        subject: "Forgot Password Request",
        locals: {
          subscriber
        }
      })
      return res.status(200).json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
