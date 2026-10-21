// Comprehensive form validation helpers for Patient Information, Login, Appointments, and Payment

export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email address is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Please enter a valid email address (e.g. name@example.com).";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character.";
  return "";
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return "Phone number is required.";
  const cleanPhone = phone.replace(/[\s\-()]/g, "");
  if (!/^\d{10}$/.test(cleanPhone)) return "Phone number must be a valid 10-digit number.";
  return "";
};

export const validatePatientId = (patientId) => {
  if (!patientId || !patientId.trim()) return "Patient ID is required.";
  if (!/^PT-\d{3,6}$/i.test(patientId.trim()) && patientId.trim().length < 4) {
    return "Patient ID should be formatted like PT-1001 or at least 4 alphanumeric characters.";
  }
  return "";
};

export const validateAppointmentDate = (dateString, doctorAvailableDays = []) => {
  if (!dateString) return "Appointment date is required.";
  const selectedDate = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) return "Please select a valid date.";
  if (selectedDate < today) return "Appointment date cannot be in the past.";

  // Check 90 days limit
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  if (selectedDate > maxDate) return "Appointments can only be booked up to 90 days in advance.";

  // Check day of week against doctor's available days
  if (doctorAvailableDays && doctorAvailableDays.length > 0) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[selectedDate.getDay()];
    if (!doctorAvailableDays.includes(dayName)) {
      return `This doctor is not available on ${dayName}s. Available days: ${doctorAvailableDays.join(", ")}`;
    }
  }

  return "";
};

export const validateTimeSlot = (slot) => {
  if (!slot || !slot.trim()) return "Please select a time slot.";
  return "";
};

export const validateDoctorSelection = (doctorId) => {
  if (!doctorId) return "Please choose a doctor for your appointment.";
  return "";
};

export const validateCardNumber = (num) => {
  const clean = (num || "").replace(/\s/g, "");
  if (!clean) return "Card number is required.";
  if (!/^\d{16}$/.test(clean)) return "Card number must be 16 digits.";
  return "";
};

export const validateCardExpiry = (expiry) => {
  if (!expiry || !expiry.trim()) return "Expiration date is required (MM/YY).";
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return "Expiry must be in MM/YY format.";
  
  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has already expired.";
  }
  return "";
};

export const validateCardCvv = (cvv) => {
  if (!cvv || !cvv.trim()) return "CVV is required.";
  if (!/^\d{3,4}$/.test(cvv.trim())) return "CVV must be 3 or 4 digits.";
  return "";
};

export const validateCardholderName = (name) => {
  if (!name || !name.trim()) return "Cardholder name is required.";
  if (name.trim().length < 3) return "Name must be at least 3 characters.";
  return "";
};
