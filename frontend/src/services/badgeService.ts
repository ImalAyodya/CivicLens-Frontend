export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  color: string; // color scheme
  minScore: number; // minimum performance score needed
  category?: string; // optional category like "performance", "promises", etc.
}

// Performance score badges
export const performanceBadges: Badge[] = [
  {
    id: 'novice',
    name: 'Novice Politician',
    description: 'Just getting started in politics',
    icon: '🌱',
    color: '#d1d5db', // gray-300
    minScore: 0,
  },
  {
    id: 'emerging',
    name: 'Emerging Leader',
    description: 'Starting to fulfill campaign promises',
    icon: '📈',
    color: '#93c5fd', // blue-300
    minScore: 30,
  },
  {
    id: 'established',
    name: 'Established Politician',
    description: 'Demonstrating consistent performance',
    icon: '🏛️',
    color: '#60a5fa', // blue-400
    minScore: 50,
  },
  {
    id: 'respected',
    name: 'Respected Leader',
    description: 'Highly regarded for promise fulfillment',
    icon: '⭐',
    color: '#3b82f6', // blue-500
    minScore: 70,
  },
  {
    id: 'exceptional',
    name: 'Exceptional Statesperson',
    description: 'Outstanding performance and promise keeping',
    icon: '🏆',
    color: '#1d4ed8', // blue-700
    minScore: 85,
  },
  {
    id: 'legendary',
    name: 'Legendary Leader',
    description: 'A truly remarkable political legacy',
    icon: '👑',
    color: '#fbbf24', // amber-400
    minScore: 95,
  },
];

// Promise fulfillment badges
export const promiseBadges: Badge[] = [
  {
    id: 'promise-starter',
    name: 'Promise Starter',
    description: 'Beginning to fulfill promises',
    icon: '📝',
    color: '#d1d5db',
    minScore: 0,
    category: 'promises',
  },
  {
    id: 'promise-keeper',
    name: 'Promise Keeper',
    description: 'Consistently delivers on promises',
    icon: '🤝',
    color: '#34d399', // green-400
    minScore: 50,
    category: 'promises',
  },
  {
    id: 'promise-master',
    name: 'Promise Master',
    description: 'Exceptional record of kept promises',
    icon: '✅',
    color: '#10b981', // green-500
    minScore: 80,
    category: 'promises',
  },
];

// Public approval badges
export const approvalBadges: Badge[] = [
  {
    id: 'public-voice',
    name: 'Public Voice',
    description: 'Building public support',
    icon: '🗣️',
    color: '#d1d5db',
    minScore: 0,
    category: 'approval',
  },
  {
    id: 'public-advocate',
    name: 'Public Advocate',
    description: 'Strong public approval ratings',
    icon: '👥',
    color: '#a78bfa', // violet-400
    minScore: 50,
    category: 'approval',
  },
  {
    id: 'public-champion',
    name: 'Public Champion',
    description: 'Overwhelming public support',
    icon: '💯',
    color: '#8b5cf6', // violet-500
    minScore: 80,
    category: 'approval',
  },
];

// Helper function to get badges based on scores
export const getEarnedBadges = (
  performanceScore: number,
  promiseScore: number,
  approvalScore: number
): Badge[] => {
  const earned: Badge[] = [];

  // Get highest level performance badge earned
  const performanceBadge = [...performanceBadges]
    .reverse()
    .find(badge => performanceScore >= badge.minScore);
  
  // Get highest level promise badge earned
  const promiseBadge = [...promiseBadges]
    .reverse()
    .find(badge => promiseScore >= badge.minScore);
  
  // Get highest level approval badge earned
  const approvalBadge = [...approvalBadges]
    .reverse()
    .find(badge => approvalScore >= badge.minScore);

  if (performanceBadge) earned.push(performanceBadge);
  if (promiseBadge) earned.push(promiseBadge);
  if (approvalBadge) earned.push(approvalBadge);

  return earned;
};

// Get all possible badges
export const getAllBadges = (): Badge[] => {
  return [...performanceBadges, ...promiseBadges, ...approvalBadges];
};