module.exports = {

  /**
   * Compute next level
   * @param {Number} level
   * @return {Number} The next level
   */
  nextLevel(level) {
    return +level + (+process.env.LEVEL_UP_STEP || 0.1)
  },

  // Ref: https://stackoverflow.com/a/39614998/1823866
  comingDayOfWeek(dayINeed = 0) {
    // eslint-disable-next-line global-require
    const moment = require("moment")
    const today = moment().day()
    // if we haven't yet passed the day of the week that I need:
    if (today <= dayINeed) {
      // then just give me this week's instance of that day
      return moment().day(dayINeed).toDate()
    }
    // otherwise, give me *next week's* instance of that same day
    return moment().add(1, "weeks").day(dayINeed).toDate()
  }
}
