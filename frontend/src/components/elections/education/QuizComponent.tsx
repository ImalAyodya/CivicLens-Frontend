import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

interface QuizComponentProps {
  question: QuizQuestion;
  onAnswerSelected: (isCorrect: boolean) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ 
  question, 
  onAnswerSelected 
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const handleOptionSelect = (index: number) => {
    setSelectedOptionIndex(index);
    setShowAnswer(true);
    
    const isCorrect = index === question.correctOptionIndex;
    onAnswerSelected(isCorrect);
  };
  
  const getOptionStyle = (index: number) => {
    if (!showAnswer || selectedOptionIndex !== index) {
      return selectedOptionIndex === index 
        ? 'bg-blue-100 border-blue-300' 
        : 'bg-gray-50 border-gray-200';
    }
    
    return index === question.correctOptionIndex
      ? 'bg-green-100 border-green-400'
      : 'bg-red-100 border-red-400';
  };
  
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="text-lg font-bold text-gray-800 mb-1">Test Your Knowledge</Text>
      <Text className="text-gray-600 mb-4">{question.question}</Text>
      
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleOptionSelect(index)}
          disabled={showAnswer}
          className={`border rounded-lg p-3 mb-3 flex-row items-center justify-between ${getOptionStyle(index)}`}
        >
          <Text className="text-gray-800">{option}</Text>
          
          {showAnswer && index === question.correctOptionIndex && (
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          )}
          
          {showAnswer && selectedOptionIndex === index && index !== question.correctOptionIndex && (
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          )}
        </TouchableOpacity>
      ))}
      
      {showAnswer && (
        <View className={`p-3 rounded-lg mt-2 ${selectedOptionIndex === question.correctOptionIndex ? 'bg-green-50' : 'bg-red-50'}`}>
          <Text className={`font-medium ${selectedOptionIndex === question.correctOptionIndex ? 'text-green-800' : 'text-red-800'}`}>
            {selectedOptionIndex === question.correctOptionIndex ? 'Correct!' : 'Incorrect!'}
          </Text>
          <Text className="text-gray-700 mt-1">
            {selectedOptionIndex === question.correctOptionIndex 
              ? 'Great job! You know your voting procedures.'
              : `The correct answer is: ${question.options[question.correctOptionIndex]}`
            }
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuizComponent;