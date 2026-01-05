/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { f1Service } from '../f1Service';

describe('f1Service caching behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns cached drivers when fetch fails', async () => {
    const year = '2025';
    const cachedDrivers = [{ Driver: { driverId: 'test', givenName: 'T', familyName: 'Tester' }, points: '12', wins: '0', position: '3', Constructors: [{ name: 'Test Team', constructorId: 'test'}], Driver: { givenName: 'Test', familyName: 'Driver', driverId: 'td', permanentNumber: '99', dateOfBirth: '1990-01-01', nationality: 'Testland' } }];

    localStorage.setItem('f1_cache_v1_drivers_2025', JSON.stringify(cachedDrivers));

    global.fetch = vi.fn(() => Promise.reject(new Error('Network failure')));

    const drivers = await f1Service.getDriverStandings(year);
    expect(drivers).toEqual(cachedDrivers);
  });

  it('stores fetched drivers to localStorage on success', async () => {
    const year = '2026';
    const apiResponse = {
      MRData: {
        StandingsTable: {
          StandingsLists: [ { DriverStandings: [{ Driver: { driverId: 'a' }, points: '10' }] } ]
        }
      }
    };

    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(apiResponse) } as any));

    const drivers = await f1Service.getDriverStandings(year);
    expect(drivers).toEqual(apiResponse.MRData.StandingsTable.StandingsLists[0].DriverStandings);

    const cached = JSON.parse(localStorage.getItem('f1_cache_v1_drivers_2026') || 'null');
    expect(cached).toEqual(drivers);
  });
});
