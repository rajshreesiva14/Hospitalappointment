// Helper to generate crisp, responsive, offline-ready vector doctor avatars
export const createDoctorAvatar = (initials, bgStart = '%230f766e', bgEnd = '%230e7490') => {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><linearGradient id='g_${initials}' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='${bgStart}'/><stop offset='100%25' stop-color='${bgEnd}'/></linearGradient></defs><rect width='120' height='120' rx='28' fill='url(%23g_${initials})'/><circle cx='60' cy='46' r='22' fill='%23ffffff' opacity='0.92'/><path d='M30 98 C30 72, 90 72, 90 98 Z' fill='%23ffffff' opacity='0.92'/><text x='60' y='53' font-family='Arial, sans-serif' font-size='16' font-weight='800' fill='${bgStart}' text-anchor='middle'>${initials}</text></svg>`;
};

// Initial comprehensive mock doctors data for Rajshree Multispeciality Hospital
export const INITIAL_DOCTORS = [
  {
    id: 101,
    name: "Dr. Rajeshwar Sharma",
    specialty: "Cardiology",
    department: "Institute of Cardiac Sciences",
    qualification: "MBBS, MD (Medicine), DM (Cardiology), FACC (USA)",
    experience: 18,
    rating: 4.9,
    reviewsCount: 320,
    consultationFee: 1200,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
      "11:30 AM", "02:00 PM", "02:30 PM", "03:30 PM"
    ],
    room: "Cardio Wing, OPD 301",
    languages: ["English", "Hindi", "Punjabi"],
    image: createDoctorAvatar("RS", "%230f766e", "%230284c7"),
    about: "Dr. Rajeshwar Sharma is a senior interventional cardiologist with over 18 years of excellence in treating complex coronary artery diseases, heart failures, and cardiac rhythm disorders. Having performed over 6,500 successful angioplasties, he spearheads the preventive cardiology initiative at Rajshree Hospital.",
    portfolio: {
      bio: "Chief Interventional Cardiologist & Director of Cardiac Catheterization Lab at Rajshree Hospital. Trained at AIIMS New Delhi and Mount Sinai, New York.",
      clinicalExpertise: [
        "Complex Coronary Interventions (Angioplasty & Stenting)",
        "Transcatheter Aortic Valve Replacement (TAVR)",
        "Pacemaker & ICD Implantation",
        "Preventive Cardiology & Lipidology",
        "Echocardiography & Cardiac Stress Diagnostics"
      ],
      education: [
        "DM Cardiology - All India Institute of Medical Sciences (AIIMS)",
        "MD Internal Medicine - King George's Medical University",
        "Fellowship in Interventional Cardiology - Mount Sinai Hospital, USA"
      ],
      awards: [
        "National Healthcare Excellence Award (2022)",
        "Best Clinical Researcher - Indian Heart Journal (2020)",
        "Distinguished Medical Leadership Fellowship (2018)"
      ],
      memberships: [
        "Fellow, American College of Cardiology (FACC)",
        "Cardiological Society of India (CSI)",
        "European Society of Cardiology (ESC)"
      ]
    }
  },
  {
    id: 102,
    name: "Dr. Ananya Sengupta",
    specialty: "Psychology & Behavioral Health",
    department: "Department of Mental Health & Neuro-Psychology",
    qualification: "M.Sc. Clinical Psychology, M.Phil, Ph.D. (NIMHANS), licensed RCI",
    experience: 12,
    rating: 4.95,
    reviewsCount: 284,
    consultationFee: 950,
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "10:00 AM", "11:00 AM", "12:00 PM", "02:30 PM", "04:00 PM", "05:00 PM"
    ],
    room: "Mind Care Suites, Floor 4, Room 408",
    languages: ["English", "Hindi", "Bengali"],
    image: createDoctorAvatar("AS", "%234f46e5", "%237c3aed"),
    about: "Dr. Ananya Sengupta is a compassionate, evidence-based Clinical Psychologist specializing in Cognitive Behavioral Therapy (CBT), adult neuro-psychology, anxiety and depressive spectrum disorders, and relationship therapy. She works closely with patients to cultivate resilient coping frameworks.",
    portfolio: {
      bio: "Senior Consultant Clinical Psychologist and Mental Wellness Mentor. Renowned speaker on neuro-diversity, stress biology, and work-life balance resilience.",
      clinicalExpertise: [
        "Cognitive Behavioral Therapy (CBT) & Dialectical Behavior Therapy (DBT)",
        "Anxiety, Panic Disorders & Social Phobias",
        "Clinical Depression & Bipolar Support",
        "Trauma Recovery & PTSD Management",
        "Adolescent & Young Adult Psychological Counselling"
      ],
      education: [
        "Ph.D. in Clinical Neuro-Psychology - NIMHANS Bangalore",
        "M.Phil Clinical Psychology - Central Institute of Psychiatry",
        "Certified Cognitive Behaviour Therapist - Beck Institute, Philadelphia"
      ],
      awards: [
        "RCI Best Clinical Psychologist Gold Medal (2021)",
        "Mental Health Advocate Award by WHO India Chapter (2023)"
      ],
      memberships: [
        "Rehabilitation Council of India (RCI)",
        "Indian Association of Clinical Psychologists (IACP)",
        "American Psychological Association (APA International Affiliate)"
      ]
    }
  },
  {
    id: 103,
    name: "Dr. Siddharth Verma",
    specialty: "Orthopedics & Joint Replacement",
    department: "Center for Orthopedics & Sports Medicine",
    qualification: "MBBS, MS (Orthopedics), M.Ch (Ortho - UK), Fellowship in Robotic Joint Surgery",
    experience: 15,
    rating: 4.88,
    reviewsCount: 410,
    consultationFee: 1100,
    availableDays: ["Tuesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "09:30 AM", "10:30 AM", "11:30 AM", "03:00 PM", "04:00 PM", "05:30 PM"
    ],
    room: "Ortho Pavilion, OPD 105",
    languages: ["English", "Hindi", "Marathi"],
    image: createDoctorAvatar("SV", "%23b45309", "%23d97706"),
    about: "Dr. Siddharth Verma is a pioneer in minimally invasive robotic knee and hip replacements. He provides comprehensive joint preservation solutions and elite sports injury rehabilitation.",
    portfolio: {
      bio: "Senior Joint Replacement & Arthroscopy Specialist with over 4,000 successful joint replacements and tendon repairs.",
      clinicalExpertise: [
        "Robotic Total & Partial Knee Replacement",
        "Direct Anterior Hip Replacement",
        "Arthroscopic Shoulder & ACL Reconstruction",
        "Complex Geriatric Fracture Management",
        "Cartilage Restoration & PRP Therapy"
      ],
      education: [
        "MS Orthopedics - Maulana Azad Medical College",
        "M.Ch Orthopedics - University of Dundee, Scotland",
        "Fellowship in Joint Reconstruction - Asan Medical Center, Seoul"
      ],
      awards: [
        "Distinguished Orthopedic Surgeon Award (2024)",
        "Asia-Pacific Joint Replacement Innovator Prize (2021)"
      ],
      memberships: [
        "Indian Orthopaedic Association (IOA)",
        "International Congress for Joint Reconstruction (ICJR)",
        "ISAKOS Member"
      ]
    }
  },
  {
    id: 104,
    name: "Dr. Sneha Kulkarni",
    specialty: "Dermatology & Cosmetology",
    department: "Dermatology & Advanced Skin Care",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy), DNB, Fellowship in Aesthetic Lasers",
    experience: 10,
    rating: 4.92,
    reviewsCount: 390,
    consultationFee: 850,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    availableTimeSlots: [
      "10:00 AM", "11:00 AM", "11:30 AM", "01:30 PM", "02:30 PM", "04:30 PM"
    ],
    room: "Skin & Laser Center, OPD 202",
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    image: createDoctorAvatar("SK", "%23be185d", "%23e11d48"),
    about: "Dr. Sneha Kulkarni is a renowned dermatologist recognized for evidence-based management of chronic dermatological conditions like psoriasis, eczema, acne vulgaris, and cutting-edge aesthetic dermatology.",
    portfolio: {
      bio: "Lead Consultant Dermatologist and Aesthetician at Rajshree Hospital. Passionate about holistic skin wellness and modern laser treatments.",
      clinicalExpertise: [
        "Clinical Dermatology: Psoriasis, Eczema, Vitiligo",
        "Medical Acne Management & Scar Revision",
        "Advanced Laser Hair Reduction & Pigmentation Therapy",
        "Anti-Aging Treatments & Chemical Peels",
        "Trichology & Hair Restoration Therapies"
      ],
      education: [
        "MD Dermatology - Grant Medical College & JJ Hospital, Mumbai",
        "Fellowship in Advanced Laser Surgery - Bangkok Institute of Dermatology",
        "DNB Dermatology - National Board of Examinations"
      ],
      awards: [
        "Young Dermatologist Research Award (2020)",
        "IADVL National Paper Presentation Laureate"
      ],
      memberships: [
        "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
        "Cosmetic Dermatology Society of India (CDSI)"
      ]
    }
  },
  {
    id: 105,
    name: "Dr. Vikramaditya Patel",
    specialty: "Neurology",
    department: "Institute of Neurosciences",
    qualification: "MBBS, MD (Internal Med), DM (Neurology), FINR (Switzerland)",
    experience: 16,
    rating: 4.89,
    reviewsCount: 245,
    consultationFee: 1300,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
    availableTimeSlots: [
      "09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:30 PM"
    ],
    room: "Neuro Sciences Tower, Room 512",
    languages: ["English", "Hindi", "Gujarati"],
    image: createDoctorAvatar("VP", "%230369a1", "%230284c7"),
    about: "Dr. Vikramaditya Patel is an acclaimed neurologist specializing in acute stroke intervention, Parkinson's disease, epilepsy management, migraine therapeutics, and autoimmune neuromuscular disorders.",
    portfolio: {
      bio: "Senior Consultant Neurologist and Neuro-electrophysiology Director. Trained in neuro-interventional stroke care in Zurich, Switzerland.",
      clinicalExpertise: [
        "Hyperacute Stroke Thrombolysis & Management",
        "Epilepsy & Video EEG Monitoring",
        "Movement Disorders & Parkinson's Clinic",
        "Chronic Migraine & Cluster Headaches",
        "Multiple Sclerosis & Neuro-Immunology"
      ],
      education: [
        "DM Neurology - National Institute of Mental Health & Neurosciences",
        "MD Internal Medicine - Post Graduate Institute (PGIMER), Chandigarh",
        "Observership in Stroke Care - University Hospital of Zurich"
      ],
      awards: [
        "National Stroke Champion Award (2023)",
        "Indian Academy of Neurology Excellence Medal"
      ],
      memberships: [
        "Indian Academy of Neurology (IAN)",
        "World Stroke Organization (WSO)",
        "American Academy of Neurology (AAN)"
      ]
    }
  },
  {
    id: 106,
    name: "Dr. Priya Ramachandran",
    specialty: "Pediatrics & Child Care",
    department: "Department of Pediatrics & Neonatology",
    qualification: "MBBS, MD (Pediatrics), DCH, Fellowship in Pediatric Intensive Care",
    experience: 14,
    rating: 4.96,
    reviewsCount: 520,
    consultationFee: 750,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "03:30 PM", "04:30 PM", "05:30 PM"
    ],
    room: "Child Health Care Pavilion, OPD 110",
    languages: ["English", "Hindi", "Tamil", "Malayalam"],
    image: createDoctorAvatar("PR", "%23059669", "%2310b981"),
    about: "Dr. Priya Ramachandran is a gentle and dedicated pediatrician with extensive experience in newborn care, childhood immunizations, developmental assessment, asthma, and pediatric infections.",
    portfolio: {
      bio: "Chief Pediatrician and Child Health Advocate. Committed to holistic child wellness, nutritional guidance, and pediatric preventive health.",
      clinicalExpertise: [
        "Neonatal & Infant Health Checkups",
        "Comprehensive Childhood Immunization",
        "Childhood Asthma & Allergy Clinic",
        "Growth & Developmental Milestone Screening",
        "Pediatric Nutritional Guidance & Infectious Diseases"
      ],
      education: [
        "MD Pediatrics - Madras Medical College",
        "Fellowship in Pediatric Critical Care - Royal Children's Hospital, Melbourne",
        "MBBS - Christian Medical College (CMC), Vellore"
      ],
      awards: [
        "Best Child Healthcare Specialist (2023)",
        "IAP Community Pediatrician Honour (2021)"
      ],
      memberships: [
        "Indian Academy of Pediatrics (IAP)",
        "National Neonatology Forum (NNF)",
        "Royal College of Paediatrics and Child Health (RCPCH Associate)"
      ]
    }
  },
  {
    id: 107,
    name: "Dr. Meera Nambiar",
    specialty: "Gynecology & Obstetrics",
    department: "Institute of Women's Health & Fertility",
    qualification: "MBBS, MS (Obstetrics & Gynecology), DNB, Fellowship in Minimally Invasive Gynaec Surgery",
    experience: 17,
    rating: 4.94,
    reviewsCount: 460,
    consultationFee: 900,
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:00 PM", "04:00 PM"
    ],
    room: "Women's Health Center, OPD 215",
    languages: ["English", "Hindi", "Malayalam", "Kannada"],
    image: createDoctorAvatar("MN", "%237e22ce", "%239333ea"),
    about: "Dr. Meera Nambiar is a seasoned obstetrician and gynecologist specializing in high-risk pregnancies, laparoscopic gynecological surgeries, PCOS management, and adolescent reproductive health.",
    portfolio: {
      bio: "Senior Gynecologist & Laparoscopic Surgeon dedicated to empowering women's health through every stage of life with compassionate, modern care.",
      clinicalExpertise: [
        "High-Risk Pregnancy & Antenatal Care",
        "Laparoscopic Hysterectomy & Myomectomy",
        "Polycystic Ovarian Syndrome (PCOS) Protocols",
        "Infertility Workup & Reproductive Endocrinology",
        "Menopause Management & Cervical Cancer Screening"
      ],
      education: [
        "MS Obstetrics & Gynecology - Lady Hardinge Medical College, Delhi",
        "Fellowship in Laparoscopic Gynec Surgery - World Laparoscopy Hospital",
        "FICOG (Fellow of Indian College of Obstetricians & Gynaecologists)"
      ],
      awards: [
        "Mother & Child Healthcare Luminary (2022)",
        "FOGSI Outstanding Service Award"
      ],
      memberships: [
        "Federation of Obstetric and Gynaecological Societies of India (FOGSI)",
        "Indian Menopause Society (IMS)",
        "American Association of Gynecologic Laparoscopists (AAGL)"
      ]
    }
  },
  {
    id: 108,
    name: "Dr. Amitav Ghosh",
    specialty: "General Medicine & Diabetology",
    department: "Department of Internal Medicine",
    qualification: "MBBS, MD (General Medicine), PG Diploma in Diabetology (Boston Univ.)",
    experience: 20,
    rating: 4.87,
    reviewsCount: 610,
    consultationFee: 700,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTimeSlots: [
      "08:30 AM", "09:30 AM", "10:30 AM", "11:30 AM", "01:30 PM", "03:00 PM", "04:00 PM"
    ],
    room: "Internal Medicine Wing, OPD 101",
    languages: ["English", "Hindi", "Bengali"],
    image: createDoctorAvatar("AG", "%230f766e", "%2314b8a6"),
    about: "Dr. Amitav Ghosh brings over two decades of comprehensive clinical experience in diagnosing complex multisystem ailments, diabetes mellitus management, hypertension, infectious diseases, and geriatrics.",
    portfolio: {
      bio: "Senior Consultant Internist & Chief Medical Advisor at Rajshree Hospital. Champion of evidence-based primary care and chronic disease management.",
      clinicalExpertise: [
        "Type 1 & Type 2 Diabetes Management",
        "Hypertension, Dyslipidemia & Metabolic Syndrome",
        "Infectious Diseases: Dengue, Malaria, Typhoid, Viral Fevers",
        "Respiratory Infections & Geriatric Health",
        "Preventive Health Checkups & Lifestyle Medicine"
      ],
      education: [
        "MD General Medicine - Calcutta Medical College",
        "Postgraduate Diploma in Diabetology - Boston University School of Medicine",
        "MBBS - University of Calcutta"
      ],
      awards: [
        "Physician of the Year - National Health Forum (2021)",
        "Lifetime Dedication to Primary Care Award (2024)"
      ],
      memberships: [
        "Association of Physicians of India (API)",
        "Research Society for the Study of Diabetes in India (RSSDI)",
        "Indian Medical Association (IMA)"
      ]
    }
  }
];

export const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Psychology & Behavioral Health",
  "Orthopedics & Joint Replacement",
  "Dermatology & Cosmetology",
  "Neurology",
  "Pediatrics & Child Care",
  "Gynecology & Obstetrics",
  "General Medicine & Diabetology"
];
