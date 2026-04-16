// Mock data for the Harbor Review Center app

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  cognitiveLevel: 'lower' | 'higher'; // lower = 3 points, higher = 9 points
  domain: string;
}

export interface UserProgress {
  reviewHoursUsed: number;
  reviewHoursTotal: number;
  mockExamAttempts: number;
  mockExamAttemptsTotal: number;
  subscriptionEndDate: string;
  hasPassedMockExam: boolean;
  mockExamScores: number[];
}

export interface Module {
  id: string;
  title: string;
  domain: string;
  cognitiveLevel: 'lower' | 'higher';
  questionCount: number;
  estimatedTime: number; // in minutes
  icon: string;
  lessonContent: LessonContent;
}

export interface LessonContent {
  sections: LessonSection[];
  totalReadingTime: number; // in minutes
}

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  readingTime: number; // in minutes
}

// Sample questions for demo
export const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the primary function of a ships bilge system?',
    options: [
      'To remove water that accumulates in the bilge',
      'To provide drinking water',
      'To cool the engine',
      'To supply fire suppression systems'
    ],
    correctAnswer: 0,
    cognitiveLevel: 'lower',
    domain: 'Ship Systems'
  },
  {
    id: '2',
    text: 'During heavy weather, you notice the vessel is listing to port. What immediate actions should you take to ensure vessel stability?',
    options: [
      'Increase speed to stabilize the vessel',
      'Shift ballast or cargo to starboard, reduce speed, and adjust course',
      'Continue current course and speed',
      'Drop anchor immediately'
    ],
    correctAnswer: 1,
    cognitiveLevel: 'higher',
    domain: 'Vessel Stability'
  },
  {
    id: '3',
    text: 'Define the term "freeboard" in maritime terminology.',
    options: [
      'The distance from the waterline to the main deck',
      'The width of the ship',
      'The depth of the cargo hold',
      'The distance between two ships'
    ],
    correctAnswer: 0,
    cognitiveLevel: 'lower',
    domain: 'Maritime Terminology'
  },
  {
    id: '4',
    text: 'You are navigating through a congested harbor and notice a vessel displaying three red lights vertically. According to COLREGS, what does this indicate and what action should you take?',
    options: [
      'Vessel at anchor; maintain distance',
      'Vessel not under command; keep clear and alter course',
      'Vessel engaged in fishing; proceed with caution',
      'Vessel towing; reduce speed'
    ],
    correctAnswer: 1,
    cognitiveLevel: 'higher',
    domain: 'Navigation Rules'
  },
];

// Sample modules
export const modules: Module[] = [
  {
    id: 'nav-rules',
    title: 'Navigation Rules & COLREGS',
    domain: 'Navigation',
    cognitiveLevel: 'higher',
    questionCount: 120,
    estimatedTime: 180,
    icon: 'Compass',
    lessonContent: {
      sections: [
        {
          id: 'section1',
          title: 'Introduction to Navigation Rules',
          content: 'Navigation Rules, also known as the International Regulations for Preventing Collisions at Sea (COLREGS), are a set of rules designed to prevent collisions between vessels at sea. These rules apply to all vessels, regardless of size or type, and are enforced by maritime authorities worldwide.',
          readingTime: 10
        },
        {
          id: 'section2',
          title: 'Rule 7: Risk of Collision',
          content: 'Rule 7 of COLREGS outlines the responsibilities of the lookout and the officer of the watch to maintain a proper lookout and to determine if there is a risk of collision. This rule emphasizes the importance of using all available means to detect other vessels and to assess the risk of collision.',
          readingTime: 15
        },
        {
          id: 'section3',
          title: 'Rule 8: Action to Avoid Collision',
          content: 'Rule 8 of COLREGS provides guidelines for the actions to be taken to avoid collision. This rule includes the concept of "early action" and "substantial alteration of course and speed" to ensure that vessels can avoid a collision if a risk is detected.',
          readingTime: 10
        }
      ],
      totalReadingTime: 35
    }
  },
  {
    id: 'vessel-stability',
    title: 'Vessel Stability',
    domain: 'Vessel Operations',
    cognitiveLevel: 'higher',
    questionCount: 95,
    estimatedTime: 142,
    icon: 'Ship',
    lessonContent: {
      sections: [
        {
          id: 'vs-1',
          title: 'Principles of Floatation',
          content: 'Understanding the principles of floatation is fundamental to vessel stability. This section covers Archimedes\' principle, buoyancy, and the relationship between weight and displacement.',
          readingTime: 12
        },
        {
          id: 'vs-2',
          title: 'Initial Stability and GM',
          content: 'Initial stability refers to the vessel\'s ability to return to its original upright position when inclined by an external force. Key concepts include the Metacenter (M), Center of Gravity (G), and Metacentric Height (GM).',
          readingTime: 20
        }
      ],
      totalReadingTime: 32
    }
  },
  {
    id: 'ship-systems',
    title: 'Ship Systems',
    domain: 'Engineering',
    cognitiveLevel: 'lower',
    questionCount: 150,
    estimatedTime: 150,
    icon: 'Settings',
    lessonContent: {
      sections: [
        {
          id: 'ss-1',
          title: 'Main Propulsion Systems',
          content: 'Overview of various marine propulsion systems including diesel engines, steam turbines, and gas turbines. Understanding power transmission from the engine to the propeller.',
          readingTime: 15
        },
        {
          id: 'ss-2',
          title: 'Auxiliary Machinery',
          content: 'Detailed look at pumps, compressors, heat exchangers, and other essential equipment that supports the main engine and vessel operations.',
          readingTime: 12
        }
      ],
      totalReadingTime: 27
    }
  },
  {
    id: 'safety-procedures',
    title: 'Safety & Emergency Procedures',
    domain: 'Safety',
    cognitiveLevel: 'higher',
    questionCount: 110,
    estimatedTime: 165,
    icon: 'AlertTriangle',
    lessonContent: {
      sections: [
        {
          id: 'sep-1',
          title: 'Emergency Response Planning',
          content: 'Critical protocols for responding to emergencies such as fire, flooding, or man-overboard situations. Importance of regular drills and clear communication.',
          readingTime: 18
        },
        {
          id: 'sep-2',
          title: 'Life-Saving Appliances (LSA)',
          content: 'Operating procedures and maintenance requirements for lifeboats, life rafts, lifebuoys, and personal flotation devices.',
          readingTime: 15
        }
      ],
      totalReadingTime: 33
    }
  },
  {
    id: 'maritime-law',
    title: 'Maritime Law & Regulations',
    domain: 'Legal',
    cognitiveLevel: 'lower',
    questionCount: 85,
    estimatedTime: 85,
    icon: 'Scale',
    lessonContent: {
      sections: [
        {
          id: 'ml-1',
          title: 'UNCLOS Overview',
          content: 'The United Nations Convention on the Law of the Sea (UNCLOS) establishes the legal framework for all marine and maritime activities.',
          readingTime: 10
        },
        {
          id: 'ml-2',
          title: 'MARPOL Regulations',
          content: 'The International Convention for the Prevention of Pollution from Ships (MARPOL) is the main international convention covering prevention of pollution of the marine environment.',
          readingTime: 12
        }
      ],
      totalReadingTime: 22
    }
  },
  {
    id: 'cargo-operations',
    title: 'Cargo Operations',
    domain: 'Operations',
    cognitiveLevel: 'higher',
    questionCount: 100,
    estimatedTime: 150,
    icon: 'Package',
    lessonContent: {
      sections: [
        {
          id: 'co-1',
          title: 'Cargo Handling Equipment',
          content: 'Introduction to cranes, derricks, winches, and specialized handling gear used for various types of maritime cargo.',
          readingTime: 14
        },
        {
          id: 'co-2',
          title: 'Stowage and Securing',
          content: 'Principles of efficient cargo stowage to maximize space utilization while ensuring vessel stability and preventing cargo damage.',
          readingTime: 18
        }
      ],
      totalReadingTime: 32
    }
  },
  {
    id: 'meteorology',
    title: 'Meteorology & Weather',
    domain: 'Navigation',
    cognitiveLevel: 'lower',
    questionCount: 70,
    estimatedTime: 70,
    icon: 'Cloud',
    lessonContent: {
      sections: [
        {
          id: 'mw-1',
          title: 'Atmospheric Pressure and Wind',
          content: 'How pressure gradients drive wind patterns and the use of barometers in weather forecasting at sea.',
          readingTime: 10
        },
        {
          id: 'mw-2',
          title: 'Frontal Systems and Storms',
          content: 'Identifying different types of weather fronts and understanding the formation and movement of tropical cyclones.',
          readingTime: 15
        }
      ],
      totalReadingTime: 25
    }
  },
  {
    id: 'chart-navigation',
    title: 'Chart Navigation',
    domain: 'Navigation',
    cognitiveLevel: 'higher',
    questionCount: 130,
    estimatedTime: 195,
    icon: 'Map',
    lessonContent: {
      sections: [
        {
          id: 'cn-1',
          title: 'Nautical Chart Symbols',
          content: 'Interpreting the various symbols and abbreviations used on paper and electronic nautical charts.',
          readingTime: 12
        },
        {
          id: 'cn-2',
          title: 'Position Fixing Techniques',
          content: 'Methods for determining a vessel\'s position using visual bearings, radar ranges, and electronic navigation systems.',
          readingTime: 18
        }
      ],
      totalReadingTime: 30
    }
  },
];

// Mock user progress
export const mockUserProgress: UserProgress = {
  reviewHoursUsed: 45.5,
  reviewHoursTotal: 300,
  mockExamAttempts: 0,
  mockExamAttemptsTotal: 3,
  subscriptionEndDate: '2026-09-30',
  hasPassedMockExam: false,
  mockExamScores: []
};