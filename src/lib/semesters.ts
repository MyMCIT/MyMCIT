export function getSemesters() {
  const startYear = 2019;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const seasons = ["Spring", "Summer", "Fall"];
  const semesters = [];

  for (let y = startYear; y <= currentYear; y++) {
    for (let s = 0; s < seasons.length; s++) {
      if (y === currentYear) {
        if (
          (s === 0 && currentMonth >= 0) || // Include Spring semester if we are in Jan-May
          (s === 1 && currentMonth >= 4) || // Include Summer semester if we are in May-August
          (s === 2 && currentMonth >= 7)
        ) {
          // Include Fall semester if we are in Aug-Dec
          semesters.push(`${seasons[s]} ${y}`);
        }
      } else {
        semesters.push(`${seasons[s]} ${y}`); // For past years, add all semesters
      }
    }
  }

  return semesters;
}
