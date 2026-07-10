export const students = [
  {
    id: 1,
    name: "Emma Johnson",
    grade: "Grade 9",
    parent: "Michael Johnson",
    image: "https://i.pravatar.cc/100?img=47",
    subjects: [
      { name: "Mathematics", assigned: true },
      { name: "English", assigned: true },
    ],
  },
  {
    id: 2,
    name: "Liam Chen",
    grade: "Grade 11",
    parent: "Sarah Chen",
    image: "https://i.pravatar.cc/100?img=12",
    subjects: [
      { name: "Mathematics", assigned: false },
      { name: "Physics", assigned: true },
      { name: "Chemistry", assigned: false },
    ],
  },
  {
    id: 3,
    name: "Sophia Martinez",
    grade: "Grade 10",
    parent: "Carlos Martinez",
    image: "https://i.pravatar.cc/100?img=32",
    subjects: [
      { name: "Science", assigned: true },
      { name: "English", assigned: false },
    ],
  },
  {
    id: 4,
    name: "Ava Thompson",
    grade: "Grade 12",
    parent: "Robert Thompson",
    image: "https://i.pravatar.cc/100?img=5",
    subjects: [
      { name: "English", assigned: false },
      { name: "History", assigned: false },
    ],
  },
];

export const tutors = [
  {
    id: 1,
    name: "Dr. Rachel Kim",
    image: "https://i.pravatar.cc/100?img=47",
    subjects: ["Mathematics", "Physics"],
    availability: "Mon–Fri, 3–8 PM",
    sessions: 142,
  },
  {
    id: 2,
    name: "Marcus Thompson",
    image: "https://i.pravatar.cc/100?img=60",
    subjects: ["Mathematics", "Chemistry"],
    availability: "Mon–Fri, 4–9 PM",
    sessions: 76,
  },
  {
    id: 3,
    name: "James O'Brien",
    image: "https://i.pravatar.cc/100?img=12",
    subjects: ["English", "History"],
    availability: "Mon–Wed, Sat",
    sessions: 98,
  },
  {
    id: 4,
    name: "Priya Sharma",
    image: "https://i.pravatar.cc/100?img=32",
    subjects: ["Science", "Chemistry"],
    availability: "Tue–Sat, 2–7 PM",
    sessions: 215,
  },
];

export const initialAssignments = [
  {
    id: 1,
    student: "Emma Johnson",
    grade: "Grade 9",
    studentImage: "https://i.pravatar.cc/100?img=47",
    subject: "Mathematics",
    tutor: "Dr. Rachel Kim",
    tutorImage: "https://i.pravatar.cc/100?img=47",
    date: "Feb 1, 2024",
    status: "active",
  },
  {
    id: 2,
    student: "Emma Johnson",
    grade: "Grade 9",
    studentImage: "https://i.pravatar.cc/100?img=47",
    subject: "English",
    tutor: "James O'Brien",
    tutorImage: "https://i.pravatar.cc/100?img=12",
    date: "Feb 1, 2024",
    status: "active",
  },
  {
    id: 3,
    student: "Liam Chen",
    grade: "Grade 11",
    studentImage: "https://i.pravatar.cc/100?img=12",
    subject: "Physics",
    tutor: "Dr. Rachel Kim",
    tutorImage: "https://i.pravatar.cc/100?img=47",
    date: "Feb 10, 2024",
    status: "active",
  },
];
