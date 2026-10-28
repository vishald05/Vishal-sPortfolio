export const LEETCODE_USERNAME = "Vishal0528";
export const LEETCODE_PROFILE_URL = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;

const CACHE_KEY = "vishal-portfolio-leetcode-cache";
const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(Number(value));
}

export function formatDateTime(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toDisplayNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }

  return Number(value);
}

function normalizePreference(weight) {
  if (weight <= 0) return 0;
  return Math.min(4, Math.ceil((weight / 4) * 4));
}

export function buildHeatmapData(submissionCalendarValue) {
  if (!submissionCalendarValue) {
    return { days: [], maxCount: 0 };
  }

  let parsedCalendar = submissionCalendarValue;
  if (typeof submissionCalendarValue === "string") {
    try {
      parsedCalendar = JSON.parse(submissionCalendarValue);
    } catch {
      return { days: [], maxCount: 0 };
    }
  }

  if (!parsedCalendar || typeof parsedCalendar !== "object") {
    return { days: [], maxCount: 0 };
  }

  const calendarMap = {};
  Object.entries(parsedCalendar).forEach(([timestamp, rawCount]) => {
    const date = new Date(Number(timestamp) * 1000);
    if (Number.isNaN(date.getTime())) {
      return;
    }

    const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10);
    const count = Number(rawCount) || 0;
    calendarMap[dayKey] = count;
  });

  const endOfRange = new Date();
  endOfRange.setHours(0, 0, 0, 0);

  const startOfRange = new Date(endOfRange);
  startOfRange.setDate(startOfRange.getDate() - 364);

  const days = [];
  for (let cursor = new Date(startOfRange); cursor <= endOfRange; cursor.setDate(cursor.getDate() + 1)) {
    const key = cursor.toISOString().slice(0, 10);
    const count = calendarMap[key] ?? 0;
    days.push({
      date: key,
      count,
      isMissing: !(key in calendarMap),
    });
  }

  const maxCount = days.reduce((highest, day) => Math.max(highest, day.count), 0);

  return {
    days,
    maxCount,
  };
}

export function normalizeLeetCodeData(payload) {
  const data = payload?.data ?? {};
  const matchedUser = data.matchedUser ?? {};
  const userContestRanking = data.userContestRanking ?? {};
  const acSubmissionNum = Array.isArray(matchedUser.submitStatsGlobal?.acSubmissionNum)
    ? matchedUser.submitStatsGlobal.acSubmissionNum
    : [];

  const difficultyMap = Object.fromEntries(
    acSubmissionNum.map((entry) => [entry?.difficulty, entry])
  );

  const totalSolved = toDisplayNumber(difficultyMap.All?.count);
  const easySolved = toDisplayNumber(difficultyMap.Easy?.count);
  const mediumSolved = toDisplayNumber(difficultyMap.Medium?.count);
  const hardSolved = toDisplayNumber(difficultyMap.Hard?.count);

  const contestRating = toDisplayNumber(userContestRanking.rating);
  const globalRanking = toDisplayNumber(userContestRanking.globalRanking);

  const calendarData = buildHeatmapData(matchedUser.userCalendar?.submissionCalendar);

  return {
    username: matchedUser.username ?? LEETCODE_USERNAME,
    profileUrl: LEETCODE_PROFILE_URL,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    contestRating,
    globalRanking,
    submissionCalendar: calendarData,
    source: "LeetCode GraphQL",
    lastUpdated: new Date().toISOString(),
    heatmapIntensity: {
      values: [0, 1, 2, 3, 4],
      normalizePreference,
    },
  };
}

export async function fetchLeetCodeData(signal) {
  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        query userLeetCodeStats($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              realName
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            userCalendar {
              activeYears
              totalActiveDays
              streak
              submissionCalendar
            }
          }
          userContestRanking(username: $username) {
            globalRanking
            rating
          }
        }
      `,
      variables: { username: LEETCODE_USERNAME },
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`LeetCode request failed with status ${response.status}`);
  }

  const json = await response.json();

  if (json.errors?.length) {
    const message = json.errors.map((error) => error.message).join("; ");
    throw new Error(message);
  }

  const normalized = normalizeLeetCodeData(json);

  if (typeof window !== "undefined") {
    localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function getCachedLeetCodeData() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
