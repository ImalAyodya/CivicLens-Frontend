export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Dashboard: undefined;
  Comparison: undefined;
  ComparisonResult: {
    politician1: any;
    politician2: any;
  };
  PoliticalQuiz: undefined;
  QuizQuestion: {
    questionId: number;
    totalQuestions: number;
    score: number;
  };
  QuizResult: {
    score: number;
    totalQuestions: number;
  };
  PoliBot: undefined;
  PoliBotChat: undefined;
};