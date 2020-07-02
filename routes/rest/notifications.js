const Subscriber = require("../../models/user")

module.exports = {

  /**
   *  Add a unique device id to the current Subscriber. For usage with OneSignal push notifications
   * @api {post} /device 1. Add a unique device id to the current Subscriber. For usage with OneSignal push notifications
   * @apiName addDevice
   * @apiGroup PushNotifications
   * @apiPermission Subscriber
   *
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam  {String} deviceId Device Id to add
   *
   * @apiSuccessExample {type} Success-Response:
{ error: false, devices: [] }
   */
  async addDevice(req, res) {
    try {
      const user = await Subscriber.findOne({ _id: req.user.id }).select("devices").exec()
      if (user === null) throw new Error("Invalid User!!!")
      let existingDevices = user.devices || []
      if (existingDevices.map(d => String(d.id)).includes(req.body.deviceId)) {
        existingDevices = existingDevices.filter(d => String(d.id) !== req.body.deviceId) // prune if duplicate
      }
      user.devices = [...existingDevices, { id: req.body.deviceId, isActive: true }]
      await user.save()
      return res.json({ error: false, devices: user.devices })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
     *  Remove a device id from the current Subscriber. For usage with OneSignal push notifications
     * @api {delete} /device/:id 2. Remove a device id from the current Subscriber. For usage with OneSignal push notifications
     * @apiName removeDevice
     * @apiGroup PushNotifications
     * @apiPermission Subscriber
     *
     * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
     *
     * @apiParam  {String} id Device Id to remove [URL Parameter]
     *
     * @apiSuccessExample {type} Success-Response:
  { error: false, devices: [] }
     */
  async removeDevice(req, res) {
    try {
      const user = await Subscriber.findOne({ _id: req.user.id }).select("devices").exec()
      if (user === null) throw new Error("Invalid User!!!")
      const existingDevices = user.devices || []
      // user.devices = existingDevices.filter(d => String(d) !== String(req.params.id))
      user.devices = existingDevices.map((device) => {
        if (String(device.id) !== String(req.params.id)) return device
        return {
          id: device.id,
          isActive: false
        }
      })
      await user.save()
      return res.json({ error: false, devices: user.devices })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },
}
