/** HARCODED!!!!!!! */
module.exports = {
  interestLevelToGrades(level) {
    switch (level) {
      case 1:
        return [1, 2, 3, 4]
      case 2:
        return [5, 6, 7, 8]
      case 3:
        return [9, 10, 11, 12]
      default:
        return null
    }
  },

  gradeToInterestLevel(grade) {
    if ([1, 2, 3, 4].includes(Number(grade))) return 1
    if ([5, 6, 7, 8].includes(Number(grade))) return 2
    if ([9, 10, 11, 12].includes(Number(grade))) return 3
    return null
  }
}
