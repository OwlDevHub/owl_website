const API_URL =
  "https://api.github.com/repos/OwlDevHub/OWL_APP/releases/latest";

const CACHE_KEY = "newVersionCache";
const CACHE_DURATION = 60 * 60 * 1000; // 1h

export const getCachedVersion = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < CACHE_DURATION) {
      return data.version;
    }
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
};

export const setCachedVersion = (version) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ version, timestamp: Date.now() }),
  );
};

export async function getNewAppVersion() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Failed to get new release version",
      );
    }

    const data = await response.json();
    return data?.tag_name;
  } catch (error) {
    throw error;
  }
}
