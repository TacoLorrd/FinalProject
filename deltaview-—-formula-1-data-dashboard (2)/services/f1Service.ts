
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

const STORAGE_PREFIX = 'f1_cache_v1';

const tryParse = (v: string | null) => {
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
};

export const f1Service = {
  getDriverStandings: async (year: string = 'current') => {
    const key = `${STORAGE_PREFIX}_drivers_${year}`;
    try {
      const response = await fetch(`${BASE_URL}/${year}/driverStandings.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const parsed = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
      try { localStorage.setItem(key, JSON.stringify(parsed)); } catch {}
      return parsed;
    } catch (error) {
      console.error("Driver standings fetch failed:", error);
      const cached = tryParse(localStorage.getItem(key));
      return cached || [];
    }
  },

  getConstructorStandings: async (year: string = 'current') => {
    const key = `${STORAGE_PREFIX}_constructors_${year}`;
    try {
      const response = await fetch(`${BASE_URL}/${year}/constructorStandings.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const parsed = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
      try { localStorage.setItem(key, JSON.stringify(parsed)); } catch {}
      return parsed;
    } catch (error) {
      console.error("Constructor standings fetch failed:", error);
      const cached = tryParse(localStorage.getItem(key));
      return cached || [];
    }
  },

  getSeasonSchedule: async (year: string = 'current') => {
    const key = `${STORAGE_PREFIX}_schedule_${year}`;
    try {
      const response = await fetch(`${BASE_URL}/${year}.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      const parsed = data.MRData.RaceTable.Races || [];
      try { localStorage.setItem(key, JSON.stringify(parsed)); } catch {}
      return parsed;
    } catch (error) {
      console.error("Schedule fetch failed:", error);
      const cached = tryParse(localStorage.getItem(key));
      return cached || [];
    }
  },

  getRaceResults: async (year: string, round: string) => {
    try {
      const response = await fetch(`${BASE_URL}/${year}/${round}/results.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      return data.MRData.RaceTable.Races[0] || null;
    } catch (error) {
      console.error("Race results fetch failed:", error);
      return null;
    }
  },

  getCachedSnapshot: (year: string = 'current') => {
    try {
      const drivers = tryParse(localStorage.getItem(`${STORAGE_PREFIX}_drivers_${year}`)) || null;
      const constructors = tryParse(localStorage.getItem(`${STORAGE_PREFIX}_constructors_${year}`)) || null;
      const schedule = tryParse(localStorage.getItem(`${STORAGE_PREFIX}_schedule_${year}`)) || null;
      if (drivers || constructors || schedule) return { drivers, constructors, schedule };
      return null;
    } catch (e) {
      return null;
    }
  }
};
