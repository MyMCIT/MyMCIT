import { cacheLife } from "next/cache";

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

export function getRecentSemesters() {
  const currentYear = new Date().getFullYear();
  const validYears = [currentYear, currentYear - 1, currentYear - 2];
  return getSemesters()
    .filter((item) => validYears.includes(parseInt(item.split(" ")[1], 10)))
    .sort((a, b) => {
      const partsA = a.split(" ");
      const partsB = b.split(" ");
      const yearDifference = parseInt(partsB[1], 10) - parseInt(partsA[1], 10);
      if (yearDifference !== 0) return yearDifference;
      const order = { Spring: 1, Summer: 2, Fall: 3 };
      return (
        (order[partsB[0] as keyof typeof order] || 0) -
        (order[partsA[0] as keyof typeof order] || 0)
      );
    });
}

export async function getCachedSemesters() {
  "use cache";
  cacheLife({ revalidate: 86400 });
  return getSemesters();
}

export async function getCachedRecentSemesters() {
  "use cache";
  cacheLife({ revalidate: 86400 });
  return getRecentSemesters();
}
