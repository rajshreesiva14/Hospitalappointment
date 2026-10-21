import { INITIAL_DOCTORS } from '../data/doctorsData';

// Local storage database keys
const DB_DOCTORS_KEY = 'rajshree_hospital_db_doctors';
const DB_APPOINTMENTS_KEY = 'rajshree_hospital_db_appointments';
const DB_USERS_KEY = 'rajshree_hospital_db_users';

// Pre-seeded initial demo appointments
const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-2026-1001',
    doctorId: 101,
    doctorName: 'Dr. Rajeshwar Sharma',
    doctorSpecialty: 'Cardiology',
    doctorImage: '',
    room: 'Cardio Wing, OPD 301',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '10:30 AM',
    duration: '30 mins',
    consultationFee: 1200,
    patientName: 'Sampath Kumar',
    patientEmail: 'rajshree.patient@health.org',
    patientPhone: '9876543210',
    patientAge: 32,
    patientGender: 'Male',
    symptoms: 'Periodic chest tightness during light jog, need ECG review',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-982341'
  },
  {
    id: 'APT-2026-1002',
    doctorId: 102,
    doctorName: 'Dr. Ananya Sengupta',
    doctorSpecialty: 'Psychology & Behavioral Health',
    doctorImage: '',
    room: 'Mind Care Suites, Floor 4, Room 408',
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    timeSlot: '11:00 AM',
    duration: '45 mins',
    consultationFee: 950,
    patientName: 'Sampath Kumar',
    patientEmail: 'rajshree.patient@health.org',
    patientPhone: '9876543210',
    patientAge: 32,
    patientGender: 'Male',
    symptoms: 'Work anxiety and sleep cycle assessment',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'TXN-761203'
  },
  {
    id: 'APT-2026-1003',
    doctorId: 104,
    doctorName: 'Dr. Sneha Kulkarni',
    doctorSpecialty: 'Dermatology & Cosmetology',
    doctorImage: '',
    room: 'Skin & Laser Center, OPD 202',
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    timeSlot: '02:30 PM',
    duration: '25 mins',
    consultationFee: 850,
    patientName: 'Sampath Kumar',
    patientEmail: 'rajshree.patient@health.org',
    patientPhone: '9876543210',
    patientAge: 32,
    patientGender: 'Male',
    symptoms: 'Routine seasonal allergy consultation',
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    paymentStatus: 'Paid',
    paymentMethod: 'Debit Card',
    transactionId: 'TXN-541298'
  }
];

// Helper to access and persist Database in localStorage
const getDb = () => {
  let doctors;
  let appointments;
  let users;

  try {
    const rawDocs = localStorage.getItem(DB_DOCTORS_KEY);
    doctors = rawDocs ? JSON.parse(rawDocs) : INITIAL_DOCTORS;
  } catch {
    doctors = INITIAL_DOCTORS;
  }

  try {
    const rawApts = localStorage.getItem(DB_APPOINTMENTS_KEY);
    const legacyApts = localStorage.getItem('rajshree_hospital_appointments');
    const a1 = rawApts ? JSON.parse(rawApts) : null;
    const a2 = legacyApts ? JSON.parse(legacyApts) : null;
    if (a1 && Array.isArray(a1) && a1.length > 0) {
      appointments = a1;
    } else if (a2 && Array.isArray(a2) && a2.length > 0) {
      appointments = a2;
    } else {
      appointments = INITIAL_APPOINTMENTS;
    }
  } catch {
    appointments = INITIAL_APPOINTMENTS;
  }

  try {
    const rawUsers = localStorage.getItem(DB_USERS_KEY);
    const legacyUsers = localStorage.getItem('rajshree_hospital_registered_users');
    const u1 = rawUsers ? JSON.parse(rawUsers) : [];
    const u2 = legacyUsers ? JSON.parse(legacyUsers) : [];
    const mergedMap = new Map();
    [...u1, ...u2].forEach((u) => {
      if (u && (u.email || u.patientId)) {
        mergedMap.set((u.email || u.patientId).toLowerCase(), u);
      }
    });
    users = Array.from(mergedMap.values());
  } catch {
    users = [];
  }

  return { doctors, appointments, users };
};

const saveDb = ({ doctors, appointments, users }) => {
  try {
    if (doctors) localStorage.setItem(DB_DOCTORS_KEY, JSON.stringify(doctors));
    if (appointments) {
      localStorage.setItem(DB_APPOINTMENTS_KEY, JSON.stringify(appointments));
      localStorage.setItem('rajshree_hospital_appointments', JSON.stringify(appointments));
    }
    if (users) {
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
      localStorage.setItem('rajshree_hospital_registered_users', JSON.stringify(users));
    }
  } catch (err) {
    console.error('Failed to sync DB to localStorage:', err);
  }
};

// Simulated delay helper
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// Safe base64 encode supporting Unicode characters
export const safeBtoa = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    try {
      return btoa(str);
    } catch {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
  }
};

// Safe base64 decode supporting Unicode characters
export const safeAtob = (str) => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    try {
      return atob(str);
    } catch {
      return Buffer.from(str, 'base64').toString('utf-8');
    }
  }
};

// Helper to extract and verify Bearer token
export const verifyAuthToken = (headers = {}) => {
  if (!headers) return null;
  let authHeader = null;
  if (typeof headers.get === 'function') {
    authHeader = headers.get('Authorization') || headers.get('authorization');
  }
  if (!authHeader) {
    authHeader = headers['Authorization'] || headers['authorization'] || headers['AUTHORIZATION'];
  }
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const token = parts[1];
    if (token === 'expired_token') {
      return { expired: true };
    }
    try {
      // Decode simulated token
      const rawDecoded = safeAtob(token.replace('jwt_', ''));
      const decoded = JSON.parse(rawDecoded);
      return { valid: true, user: decoded };
    } catch {
      // If token is a plain string token (e.g. mock token)
      return { valid: true, user: { email: 'rajshree.patient@health.org', role: 'patient' } };
    }
  }
  return null;
};

// Generate JWT-like token
export const generateToken = (payload) => {
  const jsonStr = JSON.stringify({ ...payload, exp: Date.now() + 24 * 3600 * 1000 });
  return `jwt_${safeBtoa(jsonStr)}`;
};

/**
 * Handle incoming REST API request simulation
 * Supporting GET, POST, PUT, PATCH, DELETE
 */
export async function handleMockApiRequest({ method, url, data, headers = {}, params = {} }) {
  await delay(80); // Small realistic async network delay

  // Clean URL path
  const parsedUrl = new URL(url, 'http://localhost');
  const pathname = parsedUrl.pathname.replace(/^\/api/, '');
  const searchParams = parsedUrl.searchParams;

  // Merge query parameters
  const query = {
    ...Object.fromEntries(searchParams.entries()),
    ...params
  };

  const db = getDb();

  // -------------------------------------------------------------
  // AUTH REST APIs (Experiment 4)
  // -------------------------------------------------------------

  // POST /api/auth/login
  if (pathname === '/auth/login' && method.toUpperCase() === 'POST') {
    const { email, password, loginIdentifier, patientId, role = 'patient', adminPin, name } = data || {};
    const identifier = (loginIdentifier || email || patientId || '').toLowerCase().trim();

    // Admin authentication
    if (role === 'admin' || identifier.includes('admin')) {
      if (password === 'Admin@123' || adminPin === '4197' || !password) {
        const user = {
          id: 'ADM-901',
          name: name || 'Hospital Medical Superintendent',
          email: identifier.includes('@') ? identifier : 'admin@rajshree.org',
          role: 'admin',
          department: 'Executive Medical Board'
        };
        const token = generateToken(user);
        return { status: 200, data: { success: true, message: 'Admin authenticated successfully', token, user } };
      }
      return { status: 401, data: { success: false, message: 'Invalid Admin credentials or PIN' } };
    }

    // Patient authentication
    // Check against registered users in DB
    const existingUser = db.users.find(
      (u) => (u.email && u.email.toLowerCase() === identifier) || (u.patientId && u.patientId.toLowerCase() === identifier)
    );

    if (existingUser) {
      if (!password || existingUser.password === password || password === 'Patient@123') {
        const { password: _, ...userSafe } = existingUser;
        const token = generateToken(userSafe);
        return { status: 200, data: { success: true, message: 'Login successful', token, user: userSafe } };
      }
    }

    // Dynamic / Demo patient fallback
    if (
      identifier === 'rajshree.patient@health.org' ||
      identifier === 'pt-1001' ||
      password === 'Patient@123' ||
      name ||
      identifier
    ) {
      const user = {
        id: data?.id || data?.patientId || (identifier.startsWith('pt-') ? identifier.toUpperCase() : `PT-${Math.floor(1000 + Math.random() * 9000)}`),
        patientId: data?.patientId || (identifier.startsWith('pt-') ? identifier.toUpperCase() : `PT-1001`),
        name: name || data?.name || (identifier.includes('@') ? identifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Sampath Kumar'),
        email: identifier.includes('@') ? identifier : 'rajshree.patient@health.org',
        phone: data?.phone || '9876543210',
        age: Number(data?.age) || 32,
        gender: data?.gender || 'Male',
        bloodGroup: data?.bloodGroup || 'O+',
        role: 'patient'
      };
      // Save user to users store if new
      if (!existingUser) {
        db.users.push(user);
        saveDb({ users: db.users });
      }
      const token = generateToken(user);
      return { status: 200, data: { success: true, message: 'Login successful', token, user } };
    }

    return { status: 401, data: { success: false, message: 'Invalid patient email or password' } };
  }

  // POST /api/auth/register
  if (pathname === '/auth/register' && method.toUpperCase() === 'POST') {
    const { name, email, phone, password, age, gender, bloodGroup } = data || {};
    if (!name || !email || !password) {
      return { status: 400, data: { success: false, message: 'Name, email, and password are required' } };
    }

    const patientId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUser = {
      id: patientId,
      patientId,
      name,
      email,
      phone: phone || '',
      password,
      age: age || '30',
      gender: gender || 'Other',
      bloodGroup: bloodGroup || 'B+',
      role: 'patient',
      registeredAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDb({ users: db.users });

    const { password: _, ...userSafe } = newUser;
    const token = generateToken(userSafe);

    return {
      status: 201,
      data: { success: true, message: 'Patient account created successfully', token, user: userSafe }
    };
  }

  // GET /api/auth/verify
  if (pathname === '/auth/verify' && method.toUpperCase() === 'GET') {
    const auth = verifyAuthToken(headers);
    if (!auth) {
      return { status: 401, data: { success: false, message: 'Authorization header missing' } };
    }
    if (auth.expired) {
      return { status: 401, data: { success: false, message: 'Session token has expired. Please log in again.' } };
    }
    return { status: 200, data: { success: true, user: auth.user } };
  }

  // -------------------------------------------------------------
  // DOCTOR REST APIs (Experiment 1)
  // -------------------------------------------------------------

  // GET /api/doctors
  if (pathname === '/doctors' && method.toUpperCase() === 'GET') {
    let result = [...db.doctors];
    const { search, specialty, day, maxFee, minRating, sortBy } = query;

    if (search) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.department.toLowerCase().includes(q) ||
          doc.qualification.toLowerCase().includes(q) ||
          (doc.portfolio?.clinicalExpertise &&
            doc.portfolio.clinicalExpertise.some((e) => e.toLowerCase().includes(q)))
      );
    }

    if (specialty && specialty !== 'All Specialties') {
      result = result.filter((doc) => doc.specialty === specialty);
    }

    if (day && day !== 'All Days') {
      result = result.filter((doc) => doc.availableDays && doc.availableDays.includes(day));
    }

    if (maxFee) {
      result = result.filter((doc) => doc.consultationFee <= Number(maxFee));
    }

    if (minRating) {
      result = result.filter((doc) => doc.rating >= Number(minRating));
    }

    if (sortBy === 'rating-high') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'fee-low') {
      result.sort((a, b) => a.consultationFee - b.consultationFee);
    } else if (sortBy === 'fee-high') {
      result.sort((a, b) => b.consultationFee - a.consultationFee);
    } else if (sortBy === 'experience-high') {
      result.sort((a, b) => b.experience - a.experience);
    }

    return {
      status: 200,
      data: { success: true, data: result, total: result.length }
    };
  }

  // GET /api/doctors/:id/availability
  const availMatch = pathname.match(/^\/doctors\/([^/]+)\/availability$/);
  if (availMatch && method.toUpperCase() === 'GET') {
    const docId = Number(availMatch[1]);
    const doctor = db.doctors.find((d) => d.id === docId);
    if (!doctor) {
      return { status: 404, data: { success: false, message: `Doctor #${docId} not found` } };
    }

    const date = query.date;
    const booked = db.appointments
      .filter((a) => a.doctorId === docId && a.date === date && (a.status === 'Confirmed' || a.status === 'Rescheduled'))
      .map((a) => a.timeSlot);

    const availableSlots = (doctor.availableTimeSlots || []).filter((slot) => !booked.includes(slot));

    return {
      status: 200,
      data: {
        success: true,
        doctorId: docId,
        date,
        allSlots: doctor.availableTimeSlots || [],
        bookedSlots: booked,
        availableSlots
      }
    };
  }

  // GET /api/doctors/:id (dynamic doctor detail retrieval)
  const docMatch = pathname.match(/^\/doctors\/([^/]+)$/);
  if (docMatch && method.toUpperCase() === 'GET') {
    const docId = Number(docMatch[1]);
    const doctor = db.doctors.find((d) => d.id === docId);
    if (!doctor) {
      return { status: 404, data: { success: false, message: `Doctor #${docId} not found` } };
    }
    return { status: 200, data: { success: true, data: doctor } };
  }

  // -------------------------------------------------------------
  // APPOINTMENT CRUD REST APIs (Experiment 3 & 4 protected)
  // -------------------------------------------------------------

  // Token authentication check for all /appointments routes
  if (pathname.startsWith('/appointments')) {
    const auth = verifyAuthToken(headers);
    if (auth && auth.expired) {
      return {
        status: 401,
        data: {
          success: false,
          error: 'TokenExpired',
          message: 'Session has expired. Please sign in again.'
        }
      };
    }
    if (!auth) {
      // Allow booking if valid appointment patient payload is present
      const isBookingPost =
        pathname === '/appointments' &&
        method.toUpperCase() === 'POST' &&
        data &&
        data.patientName &&
        data.date;

      // Allow viewing digital OPD consultation pass slip by appointment ID
      const isSingleSlipGet =
        method.toUpperCase() === 'GET' &&
        pathname.match(/^\/appointments\/[^/]+$/) &&
        pathname !== '/appointments/history';

      if (!isBookingPost && !isSingleSlipGet) {
        return {
          status: 401,
          data: {
            success: false,
            error: 'Unauthorized',
            message: 'Access denied: Valid Bearer authentication token is required to access appointment services.'
          }
        };
      }
    }
  }

  // GET /api/appointments/history
  if (pathname === '/appointments/history' && method.toUpperCase() === 'GET') {
    const today = new Date().toISOString().split('T')[0];
    const history = db.appointments.filter(
      (a) => a.date < today || a.status === 'Completed' || a.status === 'Cancelled'
    );
    return { status: 200, data: { success: true, data: history, total: history.length } };
  }

  // GET /api/appointments/:id (single appointment retrieval)
  const singleAptMatch = pathname.match(/^\/appointments\/([^/]+)$/);
  if (singleAptMatch && method.toUpperCase() === 'GET' && singleAptMatch[1] !== 'history') {
    const targetId = singleAptMatch[1].trim().toLowerCase();
    const found = db.appointments.find((a) => a.id?.trim().toLowerCase() === targetId);
    if (!found) {
      return {
        status: 404,
        data: { success: false, message: `Appointment ${singleAptMatch[1]} not found` }
      };
    }
    return {
      status: 200,
      data: { success: true, data: found }
    };
  }

  // GET /api/appointments (read appointments)
  if (pathname === '/appointments' && method.toUpperCase() === 'GET') {
    return { status: 200, data: { success: true, data: db.appointments, total: db.appointments.length } };
  }

  // POST /api/appointments (create appointment)
  if (pathname === '/appointments' && method.toUpperCase() === 'POST') {
    const payload = data || {};
    if (!payload.doctorId || !payload.date || !payload.timeSlot || !payload.patientName) {
      return {
        status: 400,
        data: {
          success: false,
          message: 'Missing mandatory appointment parameters: doctorId, date, timeSlot, patientName'
        }
      };
    }

    const newId = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment = {
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      duration: '30 mins',
      paymentStatus: 'Paid',
      paymentMethod: payload.paymentMethod || 'Credit Card',
      transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      ...payload
    };

    db.appointments.unshift(newAppointment);
    saveDb({ appointments: db.appointments });

    // Issue patient token if booking session
    const token = generateToken({
      name: payload.patientName,
      email: payload.patientEmail || 'rajshree.patient@health.org',
      role: 'patient'
    });

    return {
      status: 201,
      data: {
        success: true,
        message: 'Appointment booked successfully',
        token,
        data: newAppointment
      }
    };
  }

  // PATCH /api/appointments/:id/reschedule OR PUT /api/appointments/:id
  const rescheduleMatch = pathname.match(/^\/appointments\/([^/]+)(\/reschedule)?$/);
  if (
    rescheduleMatch &&
    (method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')
  ) {
    const rawId = rescheduleMatch[1];
    const targetId = rawId.trim().toLowerCase();
    const index = db.appointments.findIndex((a) => a.id?.trim().toLowerCase() === targetId);
    if (index === -1) {
      return { status: 404, data: { success: false, message: `Appointment ${rawId} not found` } };
    }

    const { date, timeSlot } = data || {};
    db.appointments[index] = {
      ...db.appointments[index],
      date: date || db.appointments[index].date,
      timeSlot: timeSlot || db.appointments[index].timeSlot,
      status: 'Rescheduled',
      rescheduledAt: new Date().toISOString()
    };

    saveDb({ appointments: db.appointments });

    return {
      status: 200,
      data: {
        success: true,
        message: 'Appointment rescheduled successfully',
        data: db.appointments[index]
      }
    };
  }

  // DELETE /api/appointments/:id (cancel appointment)
  const cancelMatch = pathname.match(/^\/appointments\/([^/]+)$/);
  if (cancelMatch && method.toUpperCase() === 'DELETE') {
    const rawId = cancelMatch[1];
    const targetId = rawId.trim().toLowerCase();
    const index = db.appointments.findIndex((a) => a.id?.trim().toLowerCase() === targetId);
    if (index === -1) {
      return { status: 404, data: { success: false, message: `Appointment ${rawId} not found` } };
    }

    const reason = (data && data.reason) || query.reason || 'Cancelled by patient';
    db.appointments[index] = {
      ...db.appointments[index],
      status: 'Cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    };

    saveDb({ appointments: db.appointments });

    return {
      status: 200,
      data: {
        success: true,
        message: 'Appointment cancelled successfully',
        data: db.appointments[index]
      }
    };
  }

  // Fallback 404 for unknown API route
  return {
    status: 404,
    data: { success: false, message: `API endpoint ${method} /api${pathname} not found` }
  };
}
