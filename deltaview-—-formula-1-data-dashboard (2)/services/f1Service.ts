
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const f1Service = {
  getDriverStandings: async (year: string = 'current') => {
    try {
      const response = await fetch(`${BASE_URL}/${year}/driverStandings.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
      console.error("Driver standings fetch failed:", error);
      return [];
    }
  },

  getConstructorStandings: async (year: string = 'current') => {
    try {
      const response = await fetch(`${BASE_URL}/${year}/constructorStandings.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    } catch (error) {
      console.error("Constructor standings fetch failed:", error);
      return [];
    }
  },

  getSeasonSchedule: async (year: string = 'current') => {
    try {
      const response = await fetch(`${BASE_URL}/${year}.json`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      return data.MRData.RaceTable.Races || [];
    } catch (error) {
      console.error("Schedule fetch failed:", error);
      return [];
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
  }
};
