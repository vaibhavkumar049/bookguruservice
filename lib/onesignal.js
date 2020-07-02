const axios = require("axios")
// const config = require("../config")[process.env.NODE_ENV || "development"]

const {
  ONESIGNAL_NOTIFICATION_URL, ONESIGNAL_APPID, ONESIGNAL_REST_API_KEY
} = process.env

module.exports = {
  send(playerIds, msg, heading, data = {}, subtitle = "") {
    if (playerIds.length === 0) {
      return "NO DEVICES"
    }
    axios.post(ONESIGNAL_NOTIFICATION_URL, {
      app_id: ONESIGNAL_APPID,
      contents: { en: msg },
      headings: { en: heading },
      subtitle: { en: subtitle },
      include_player_ids: playerIds,
      data // additional payload, if any
    }, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`
      }
    })
      .then((response) => {
        console.log("OneSignal Success: ", response.data)
      })
      .catch((error) => {
        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
          console.log("OneSignal Error: ", error.response.data)
        // reject(error.response.status);
        // reject(error.response.headers);
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
          console.log("OneSignal Error: ", error.request)
        } else {
        // Something happened in setting up the request that triggered an Error
          console.log("OneSignal Error: ", new Error(error.message))
        }
        console.log("OneSignal Error: ", error.config)
      })
    return "OK" // no waiting!
  }
}
