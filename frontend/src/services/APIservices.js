export const fetchRandomQuestions = async (count = 15) => {
  try {
    const response = await fetch(`http://localhost:5000/api/questions/random?count=${count}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return [];
  }
};