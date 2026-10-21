import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAppStore } from '../store';
import {
  fetchDoctorAvailabilityThunk,
  fetchDoctorByIdThunk
} from '../store/slices/doctorSlice';
import * as api from '../services/api';

describe('Caching and Duplicate Request Optimization Verification', () => {
  let store;

  beforeEach(() => {
    store = createAppStore();
    vi.clearAllMocks();
  });

  it('serves availability from cache on repeated requests and prevents CACHE MISS', async () => {
    const mockAvailabilityData = {
      success: true,
      doctorId: 101,
      date: '2026-10-25',
      availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM']
    };

    const apiSpy = vi.spyOn(api, 'fetchDoctorAvailabilityApi').mockResolvedValue(mockAvailabilityData);

    // 1st request: Cache miss -> calls API
    const result1 = await store.dispatch(
      fetchDoctorAvailabilityThunk({ doctorId: 101, date: '2026-10-25' })
    );

    expect(result1.payload.cached).toBe(false);
    expect(result1.payload.data).toEqual(['09:00 AM', '10:00 AM', '11:00 AM']);
    expect(apiSpy).toHaveBeenCalledTimes(1);

    // Verify state stored cacheKey
    const state = store.getState().doctors;
    expect(state.availabilityCache['101_2026-10-25']).toEqual(['09:00 AM', '10:00 AM', '11:00 AM']);

    // 2nd request: Condition check sees cache exists and prevents duplicate API call!
    const result2 = await store.dispatch(
      fetchDoctorAvailabilityThunk({ doctorId: 101, date: '2026-10-25' })
    );

    // Condition cancelled the action because it is already cached
    expect(result2.meta.requestStatus).toBe('rejected');
    expect(result2.meta.condition).toBe(true);
    expect(apiSpy).toHaveBeenCalledTimes(1); // Still exactly 1 call!
  });

  it('deduplicates concurrent in-flight availability requests for the same doctor and date', async () => {
    let resolveApi;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });

    const apiSpy = vi.spyOn(api, 'fetchDoctorAvailabilityApi').mockReturnValue(apiPromise);

    // Fire two requests concurrently before the first resolves
    const req1 = store.dispatch(fetchDoctorAvailabilityThunk({ doctorId: 102, date: '2026-10-26' }));
    const req2 = store.dispatch(fetchDoctorAvailabilityThunk({ doctorId: 102, date: '2026-10-26' }));

    // Resolve the single API call
    resolveApi({
      success: true,
      doctorId: 102,
      date: '2026-10-26',
      availableSlots: ['10:00 AM', '02:00 PM']
    });

    await Promise.all([req1, req2]);

    // Exactly 1 network request made, 2nd request was deduplicated by condition
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });

  it('serves doctor details from cache on repeated requests and prevents duplicate network calls', async () => {
    const mockDoctor = {
      id: 101,
      name: 'Dr. Rajeshwar Sharma',
      specialty: 'Cardiology'
    };

    const apiSpy = vi.spyOn(api, 'fetchDoctorByIdApi').mockResolvedValue({
      success: true,
      data: mockDoctor
    });

    // 1st request
    const res1 = await store.dispatch(fetchDoctorByIdThunk(101));
    expect(res1.payload.cached).toBe(false);
    expect(apiSpy).toHaveBeenCalledTimes(1);

    // 2nd request: Should be skipped via condition
    const res2 = await store.dispatch(fetchDoctorByIdThunk(101));
    expect(res2.meta.requestStatus).toBe('rejected');
    expect(res2.meta.condition).toBe(true);
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
});
