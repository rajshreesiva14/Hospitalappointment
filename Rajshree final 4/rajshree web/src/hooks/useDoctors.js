import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDoctorsThunk,
  fetchDoctorByIdThunk,
  setSearchQuery,
  setSelectedSpecialty,
  setSelectedDay,
  setMaxFee,
  setMinRating,
  setSortBy,
  resetFilters,
  setSelectedDoctor
} from '../store/slices/doctorSlice';

export const useDoctors = () => {
  const dispatch = useDispatch();
  const {
    doctors,
    selectedDoctor,
    searchQuery,
    selectedSpecialty,
    selectedDay,
    maxFee,
    minRating,
    sortBy,
    doctorDetailsCache,
    loading: isLoading,
    error
  } = useSelector((state) => state.doctors);

  // Fetch doctors on mount via REST API (Experiment 1 a)
  useEffect(() => {
    dispatch(fetchDoctorsThunk());
  }, [dispatch]);

  // Compute filtered doctors matching search criteria and filters
  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doctor) => {
        // Query match
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          doctor.name.toLowerCase().includes(query) ||
          doctor.specialty.toLowerCase().includes(query) ||
          doctor.qualification.toLowerCase().includes(query) ||
          doctor.department.toLowerCase().includes(query) ||
          (doctor.portfolio?.clinicalExpertise &&
            doctor.portfolio.clinicalExpertise.some((exp) => exp.toLowerCase().includes(query)));

        // Specialty filter
        const matchesSpecialty =
          selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;

        // Available days filter
        const matchesDay =
          selectedDay === 'All Days' || (doctor.availableDays && doctor.availableDays.includes(selectedDay));

        // Fee filter
        const matchesFee = doctor.consultationFee <= maxFee;

        // Rating filter
        const matchesRating = doctor.rating >= minRating;

        return matchesSearch && matchesSpecialty && matchesDay && matchesFee && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating-high') return b.rating - a.rating;
        if (sortBy === 'fee-low') return a.consultationFee - b.consultationFee;
        if (sortBy === 'fee-high') return b.consultationFee - a.consultationFee;
        if (sortBy === 'experience-high') return b.experience - a.experience;
        return 0;
      });
  }, [doctors, searchQuery, selectedSpecialty, selectedDay, maxFee, minRating, sortBy]);

  // Available count
  const availableDoctorsCount = useMemo(() => filteredDoctors.length, [filteredDoctors]);

  // Retrieve doctor by ID with dynamic async REST API fallback (Experiment 1 d)
  const getDoctorById = useCallback(
    (id) => {
      const numericId = parseInt(id, 10);
      if (doctorDetailsCache[numericId]) {
        return doctorDetailsCache[numericId];
      }
      const existing = doctors.find((doc) => doc.id === numericId);
      if (existing) return existing;

      // Dispatch dynamic fetch
      dispatch(fetchDoctorByIdThunk(numericId));
      return null;
    },
    [doctors, doctorDetailsCache, dispatch]
  );

  const handleSetSearchQuery = useCallback(
    (query) => dispatch(setSearchQuery(query)),
    [dispatch]
  );

  const handleSetSelectedSpecialty = useCallback(
    (spec) => dispatch(setSelectedSpecialty(spec)),
    [dispatch]
  );

  const handleSetSelectedDay = useCallback(
    (day) => dispatch(setSelectedDay(day)),
    [dispatch]
  );

  const handleSetMaxFee = useCallback(
    (fee) => dispatch(setMaxFee(fee)),
    [dispatch]
  );

  const handleSetMinRating = useCallback(
    (rating) => dispatch(setMinRating(rating)),
    [dispatch]
  );

  const handleSetSortBy = useCallback(
    (sort) => dispatch(setSortBy(sort)),
    [dispatch]
  );

  const handleResetFilters = useCallback(
    () => dispatch(resetFilters()),
    [dispatch]
  );

  const handleSelectDoctor = useCallback(
    (doc) => dispatch(setSelectedDoctor(doc)),
    [dispatch]
  );

  return {
    doctors,
    filteredDoctors,
    selectedDoctor,
    availableDoctorsCount,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty: handleSetSelectedSpecialty,
    selectedDay,
    setSelectedDay: handleSetSelectedDay,
    maxFee,
    setMaxFee: handleSetMaxFee,
    minRating,
    setMinRating: handleSetMinRating,
    sortBy,
    setSortBy: handleSetSortBy,
    resetFilters: handleResetFilters,
    selectDoctor: handleSelectDoctor,
    getDoctorById,
    isLoading,
    error
  };
};
