export const LEETCODE_USERNAME = "Vishal0528";
export const LEETCODE_PROFILE_URL = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;
export const LEETCARD_COLORS = "F7F4FA,F0EBF6,49365E,766A83,8B78B8,C9B9DF,E9E1F2,FFFFFF";

const LEETCARD_BASE_URL = "https://leetcard.jacoblin.cool";

export function buildLeetCardUrl(type = "stats") {
  const params = new URLSearchParams({
    colors: LEETCARD_COLORS,
    hide_border: "true",
    border: "0",
    radius: "18",
    theme: "light",
  });

  const baseUrl = `${LEETCARD_BASE_URL}/${LEETCODE_USERNAME}`;

  if (type === "heatmap") {
    params.set("ext", "heatmap");
    params.set("hide_title", "true");
    return `${baseUrl}?${params.toString()}`;
  }

  if (type === "contest") {
    params.set("ext", "contest");
    params.set("hide_title", "true");
    params.set("hide", "ranking,total-solved,total-solved-text,solved,easy-solved,medium-solved,hard-solved");
    return `${baseUrl}?${params.toString()}`;
  }

  params.set("hide", "ranking");
  return `${baseUrl}?${params.toString()}`;
}
