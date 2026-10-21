import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHospital } from '../context/AppointmentContext';
import { DoctorProfile } from '../components/doctor/DoctorProfile';
import { ChevronLeft, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { fetchDoctorByIdThunk } from '../store/slices/doctorSlice';

export const DoctorDetailPage = () => {
  // Experiment 1 d: Fetch individual doctor details dynamically using REST API
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectDoctor } = useHospital();

  const numId = Number(id);
  const { doctors, doctorDetailsCache } = useSelector((state) => state.doctors);

  const existingDoctor = doctorDetailsCache[numId] || doctors.find((d) => d.id === numId) || null;
  const [doctor, setDoctor] = useState(existingDoctor);
  const [isLoading, setIsLoading] = useState(!existingDoctor);
  const [error, setError] = useState(null);

  const loadDoctor = () => {
    const cached = doctorDetailsCache[numId] || doctors.find((d) => d.id === numId);
    if (cached) {
      setDoctor(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Fetch dynamically via Redux thunk (with built-in deduplication & caching)
    dispatch(fetchDoctorByIdThunk(numId))
      .unwrap()
      .then((res) => {
        if (res?.data) {
          setDoctor(res.data);
        } else {
          setError(`Doctor #${id} not found in hospital directory.`);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(typeof err === 'string' ? err : err?.message || `Failed to fetch doctor #${id}`);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadDoctor();
  }, [numId, doctorDetailsCache, doctors]);

  // Experiment 1 f: Display loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <Loading message={`Fetching doctor profile #${id} from Hospital REST API...`} size="lg" />
      </div>
    );
  }

  // Experiment 1 f: Display error state
  if (error || !doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {error || `We could not find any registered doctor with ID #${id}. The doctor may have been relocated or the link is invalid.`}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={loadDoctor}
            icon={RefreshCw}
          >
            Retry Fetch
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/doctors')}
            icon={ArrowLeft}
          >
            Back to Doctors Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-teal-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link to="/doctors" className="hover:text-teal-600 transition">
          Doctors
        </Link>
        <span>/</span>
        <span className="text-teal-700">{doctor.name}</span>
      </nav>

      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>

      {/* Detailed Profile and Portfolio Component */}
      <DoctorProfile doctor={doctor} onSelectDoctor={selectDoctor} />
    </div>
  );
};
