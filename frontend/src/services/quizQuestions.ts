export interface QuizQuestion {
  id: number;
  title: string;
  type: 'multiple' | 'essay' | 'ranking';
  options?: string[];
  correctOption?: number;
  hint?: string;
}

export const hardcodedQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "Who is the current President of Sri Lanka as of 2025?",
    type: "multiple",
    options: [
      "Ranil Wickremesinghe",
      "Maithripala Sirisena",
      "Gotabaya Rajapaksa",
      "Chandrika Kumaratunga"
    ],
    correctOption: 0,
    hint: "He succeeded Gotabaya Rajapaksa."
  },
  {
    id: 2,
    title: "Which party is symbolized by the elephant?",
    type: "multiple",
    options: [
      "Sri Lanka Freedom Party (SLFP)",
      "United National Party (UNP)",
      "Janatha Vimukthi Peramuna (JVP)",
      "Sri Lanka Podujana Peramuna (SLPP)"
    ],
    correctOption: 1,
    hint: "This party is one of the oldest in Sri Lanka."
  },
  {
    id: 3,
    title: "Who was the first Executive President of Sri Lanka?",
    type: "multiple",
    options: [
      "J.R. Jayewardene",
      "Ranasinghe Premadasa",
      "Sirimavo Bandaranaike",
      "Maithripala Sirisena"
    ],
    correctOption: 0,
    hint: "He introduced the executive presidency in 1978."
  },
  {
    id: 4,
    title: "Which constitutional amendment established Provincial Councils in Sri Lanka?",
    type: "multiple",
    options: [
      "16th Amendment",
      "13th Amendment",
      "19th Amendment",
      "8th Amendment"
    ],
    correctOption: 1,
    hint: "It was a result of the Indo-Lanka Accord."
  },
  {
    id: 5,
    title: "Which of the following have served as Prime Minister of Sri Lanka?",
    type: "multiple",
    options: [
      "Sirimavo Bandaranaike",
      "D. S. Senanayake",
      "Mahinda Rajapaksa",
      "Sarath Fonseka"
    ],
    correctOption: 0,
    hint: "She was the world's first female Prime Minister."
  },
  {
    id: 6,
    title: "Sri Lanka became a republic in 1972.",
    type: "multiple",
    options: [
      "True",
      "False"
    ],
    correctOption: 0,
    hint: "It was previously known as Ceylon."
  },
  {
    id: 7,
    title: "Name the first female Prime Minister in the world, who was from Sri Lanka.",
    type: "essay",
    hint: "She was the mother of Chandrika Kumaratunga."
  },
  {
    id: 8,
    title: "Which party did Ranasinghe Premadasa represent when he became President?",
    type: "multiple",
    options: [
      "Sri Lanka Freedom Party (SLFP)",
      "United National Party (UNP)",
      "Sri Lanka Podujana Peramuna (SLPP)",
      "Janatha Vimukthi Peramuna (JVP)"
    ],
    correctOption: 1,
    hint: "He was a long-time member of the UNP."
  },
  {
    id: 9,
    title: "Rank these Sri Lankan leaders by the length of their tenure as President (longest to shortest):",
    type: "ranking",
    options: [
      "Mahinda Rajapaksa",
      "J.R. Jayewardene",
      "Chandrika Kumaratunga",
      "Maithripala Sirisena"
    ],
    hint: "Consider the years each served as President."
  },
  {
    id: 10,
    title: "Who is the current Prime Minister of Sri Lanka as of 2025?",
    type: "multiple",
    options: [
      "Dinesh Gunawardena",
      "Ranil Wickremesinghe",
      "Mahinda Rajapaksa",
      "Sajith Premadasa"
    ],
    correctOption: 0,
    hint: "He was appointed in 2022."
  },
  {
    id: 11,
    title: "What is the main function of the Election Commission of Sri Lanka?",
    type: "essay",
    hint: "Discuss its role in conducting free and fair elections."
  },
  {
    id: 12,
    title: "Which of these is NOT a recognized national language in Sri Lanka?",
    type: "multiple",
    options: [
      "Sinhala",
      "Tamil",
      "English",
      "Malay"
    ],
    correctOption: 3,
    hint: "Only two languages have official status."
  },
  {
    id: 13,
    title: "What year did Sri Lanka gain independence from British rule?",
    type: "multiple",
    options: [
      "1948",
      "1956",
      "1972",
      "1931"
    ],
    correctOption: 0,
    hint: "It was after World War II."
  },
  {
    id: 14,
    title: "Explain the significance of the 19th Amendment to the Sri Lankan Constitution.",
    type: "essay",
    hint: "Focus on changes to presidential powers and independent commissions."
  },
  {
    id: 15,
    title: "Which party is associated with the betel leaf symbol?",
    type: "multiple",
    options: [
      "Sri Lanka Freedom Party (SLFP)",
      "Sri Lanka Podujana Peramuna (SLPP)",
      "United National Party (UNP)",
      "Janatha Vimukthi Peramuna (JVP)"
    ],
    correctOption: 1,
    hint: "This party was formed in 2016."
  },
  {
    id: 16,
    title: "What is the minimum age required to vote in Sri Lankan elections?",
    type: "multiple",
    options: [
      "16",
      "18",
      "21",
      "25"
    ],
    correctOption: 1,
    hint: "It is the same as in many other democracies."
  },
  {
    id: 17,
    title: "Describe the role of the Speaker in the Sri Lankan Parliament.",
    type: "essay",
    hint: "Consider responsibilities in maintaining order and representing Parliament."
  },
  {
    id: 18,
    title: "Who is the leader of the Samagi Jana Balawegaya (SJB)?",
    type: "multiple",
    options: [
      "Sajith Premadasa",
      "Ranil Wickremesinghe",
      "Anura Kumara Dissanayake",
      "Mahinda Rajapaksa"
    ],
    correctOption: 0,
    hint: "He is the son of a former President."
  },
  {
    id: 19,
    title: "Which Sri Lankan leader is known for ending the civil war in 2009?",
    type: "multiple",
    options: [
      "Chandrika Kumaratunga",
      "Mahinda Rajapaksa",
      "Ranil Wickremesinghe",
      "S.W.R.D. Bandaranaike"
    ],
    correctOption: 1,
    hint: "He was President from 2005 to 2015."
  },
  {
    id: 20,
    title: "What is the highest court in Sri Lanka?",
    type: "multiple",
    options: [
      "Court of Appeal",
      "Supreme Court",
      "High Court",
      "District Court"
    ],
    correctOption: 1,
    hint: "It is the final appellate court."
  }
];

// Map backend questions to frontend format
export function mapApiQuestions(apiQuestions: any[]): QuizQuestion[] {
  return apiQuestions.map((q: any, idx: number) => {
    let type: QuizQuestion['type'] = 'multiple';
    if (q.type === 'TYPING') type = 'essay';
    if (q.type === 'RANKING') type = 'ranking';

    let options: string[] | undefined = undefined;
    if (q.options && Array.isArray(q.options)) {
      options = q.options.map((opt: any) => opt.text);
    }

    let correctOption: number | undefined = undefined;
    if (q.options && Array.isArray(q.options)) {
      const idx = q.options.findIndex((opt: any) => opt.isCorrect);
      correctOption = idx >= 0 ? idx : undefined;
    }

    return {
      id: 1000 + idx, // avoid id clash with hardcoded
      title: q.prompt || q.title || '',
      type,
      options,
      correctOption,
      hint: q.meta?.topic || q.hint || ''
    };
  });
}

// Shuffle utility
export function shuffle<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}