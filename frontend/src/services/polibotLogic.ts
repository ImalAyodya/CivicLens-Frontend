// types.ts
export interface PoliticianProfile {
  name: string;
  party: string;
  position: string;
  stance: string[];
  achievements: string[];
  controversies: string[];
}

export interface PolicyArea {
  area: string;
  description: string;
  currentStatus: string;
  relatedPoliticians: string[];
}

interface PartyProfile {
  fullName: string;
  ideology: string;
  leader: string;
  keyPolicies: string[];
  history: string;
}

interface PoliticalKnowledge {
  politicians: { [key: string]: PoliticianProfile };
  parties: { [key: string]: PartyProfile };
  policyAreas: { [key: string]: PolicyArea };
}

export const politicalKnowledge: PoliticalKnowledge = {
  politicians: {
    'ranil wickremesinghe': {
      name: 'Ranil Wickremesinghe',
      party: 'UNP',
      position: 'President',
      stance: ['Economic liberalization', 'IMF cooperation', 'International diplomacy'],
      achievements: ['Debt restructuring', 'Stabilized inflation', 'IMF agreement'],
      controversies: ['Appointed without election', 'Fuel price increases']
    },
    'mahinda rajapaksa': {
      name: 'Mahinda Rajapaksa',
      party: 'SLPP',
      position: 'Former President/PM',
      stance: ['Nationalist policies', 'Infrastructure development', 'China relations'],
      achievements: ['Ended civil war', 'Infrastructure projects'],
      controversies: ['2022 economic crisis', 'Corruption allegations']
    },
    'sajith premadasa': {
      name: 'Sajith Premadasa',
      party: 'SJB',
      position: 'Opposition Leader',
      stance: ['Social welfare', 'Democratic reforms', 'Economic revival'],
      achievements: ['Housing programs', 'Opposition leadership'],
      controversies: []
    },
    'anura kumara dissanayake': {
      name: 'Anura Kumara Dissanayake',
      party: 'NPP/JVP',
      position: 'Party Leader',
      stance: ['Anti-corruption', 'System change', 'Socialist policies'],
      achievements: ['Growing youth support', 'Anti-corruption campaigns'],
      controversies: []
    }
  },

  parties: {
    'unp': {
      fullName: 'United National Party',
      ideology: 'Liberal conservatism, Economic liberalism',
      leader: 'Ranil Wickremesinghe',
      keyPolicies: ['Free market economy', 'International trade', 'Democratic governance'],
      history: 'One of the oldest parties, founded in 1946'
    },
    'slpp': {
      fullName: 'Sri Lanka Podujana Peramuna',
      ideology: 'Sinhala nationalism, Populism',
      leader: 'Mahinda Rajapaksa',
      keyPolicies: ['Self-sufficiency', 'Infrastructure', 'Nationalist agenda'],
      history: 'Founded in 2016, rose to power in 2019'
    },
    'sjb': {
      fullName: 'Samagi Jana Balawegaya',
      ideology: 'Social democracy, Centrism',
      leader: 'Sajith Premadasa',
      keyPolicies: ['Social welfare', 'Economic development', 'Anti-corruption'],
      history: 'Split from UNP in 2020'
    },
    'npp': {
      fullName: "National People's Power",
      ideology: 'Left-wing, Democratic socialism',
      leader: 'Anura Kumara Dissanayake',
      keyPolicies: ['System change', 'Anti-corruption', 'Socialist reforms'],
      history: 'Coalition led by JVP, founded in 2019'
    }
  },

  policyAreas: {
    economy: {
      area: 'Economic Policy',
      description: 'Current focus on IMF reforms, debt restructuring, and stabilization',
      currentStatus: 'Inflation down to 10.5%, GDP growth expected at 2-3%',
      relatedPoliticians: ['ranil wickremesinghe']
    },
    corruption: {
      area: 'Anti-Corruption',
      description: 'Public demand for accountability and transparency',
      currentStatus: 'Several investigations ongoing, public pressure increasing',
      relatedPoliticians: ['anura kumara dissanayake', 'sajith premadasa']
    },
    governance: {
      area: 'Democratic Governance',
      description: 'Debates on constitutional reforms and system change',
      currentStatus: 'Discussions ongoing about presidential vs parliamentary system',
      relatedPoliticians: ['sajith premadasa', 'anura kumara dissanayake']
    }
  }
};

type ExtractEntitiesResult = {
  politicians: string[];
  parties: string[];
  topics: string[];
};

export class PoliBot {
  private context: string[] = [];
  private maxContextLength = 5;

  private addToContext(message: string): void {
    this.context.push(message.toLowerCase());
    if (this.context.length > this.maxContextLength) {
      this.context.shift();
    }
  }

  private extractEntities(message: string): ExtractEntitiesResult {
    const lowerMessage = message.toLowerCase();
    const politicians: string[] = [];
    const parties: string[] = [];
    const topics: string[] = [];

    Object.keys(politicalKnowledge.politicians).forEach(key => {
      const politician = politicalKnowledge.politicians[key];
      if (
        lowerMessage.includes(key) ||
        lowerMessage.includes(politician.name.toLowerCase()) ||
        lowerMessage.includes(politician.name.split(' ')[0].toLowerCase())
      ) {
        politicians.push(key);
      }
    });

    Object.keys(politicalKnowledge.parties).forEach(key => {
      const party = politicalKnowledge.parties[key];
      if (
        lowerMessage.includes(key) ||
        lowerMessage.includes(party.fullName.toLowerCase())
      ) {
        parties.push(key);
      }
    });

    const topicKeywords: { [key: string]: string[] } = {
      economy: ['economy', 'economic', 'inflation', 'imf', 'debt', 'gdp', 'growth'],
      corruption: ['corruption', 'corrupt', 'accountability', 'transparency', 'scandal'],
      governance: ['governance', 'democracy', 'election', 'parliament', 'constitution'],
      performance: ['performance', 'doing', 'approval', 'rating', 'opinion'],
      comparison: ['compare', 'comparison', 'versus', 'vs', 'difference', 'between'],
      policy: ['policy', 'policies', 'stance', 'position', 'agenda']
    };

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    });

    return { politicians, parties, topics };
  }

  getResponse(message: string): string {
    this.addToContext(message);
    const lowerMessage = message.toLowerCase();
    const entities = this.extractEntities(message);

    if (lowerMessage.match(/\b(hello|hi|hey|greetings)\b/)) {
      return "Hello! I'm PoliBot, your Sri Lankan political assistant. I can help you with:\n\n• Information about politicians and parties\n• Political comparisons and analysis\n• Current economic and policy updates\n• Political history and context\n\nWhat would you like to know?";
    }

    if (lowerMessage.match(/\b(help|what can you|how do)\b/)) {
      return "I can assist you with:\n\n📊 Politician profiles and track records\n🏛️ Party ideologies and policies\n📈 Economic updates and reforms\n⚖️ Policy comparisons\n🗳️ Electoral information\n\nTry asking: 'Tell me about Ranil Wickremesinghe' or 'Compare UNP and SLPP policies'";
    }

    if (entities.politicians.length > 0) {
      return this.getPoliticianResponse(entities.politicians[0], entities.topics);
    }

    if (entities.parties.length > 0) {
      if (entities.parties.length === 2 || entities.topics.includes('comparison')) {
        return this.getPartyComparison(entities.parties);
      }
      return this.getPartyResponse(entities.parties[0]);
    }

    if (entities.topics.length > 0) {
      return this.getTopicResponse(entities.topics[0]);
    }

    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('knowledge')) {
      return "📝 Ready to test your political knowledge? Our quiz covers:\n\n• Constitutional law\n• Political history\n• Current affairs\n• Electoral systems\n\nComplete the quiz to see if you have what it takes to be a politician! Would you like to start?";
    }

    return "I'd be happy to help you understand Sri Lankan politics better! You can ask me about:\n\n• Specific politicians (e.g., 'Tell me about Sajith Premadasa')\n• Political parties (e.g., 'What is NPP's ideology?')\n• Current issues (e.g., 'What's the economic situation?')\n• Comparisons (e.g., 'Compare SLPP and UNP')\n\nWhat interests you?";
  }

  private getPoliticianResponse(politicianKey: string, topics: string[]): string {
    const politician = politicalKnowledge.politicians[politicianKey];
    if (!politician) return "I don't have information about that politician yet.";

    if (topics.includes('performance')) {
      const achievements = politician.achievements.length > 0
        ? `\n\n✅ Key achievements:\n${politician.achievements.map(a => `• ${a}`).join('\n')}`
        : '';
      const controversies = politician.controversies.length > 0
        ? `\n\n⚠️ Controversies:\n${politician.controversies.map(c => `• ${c}`).join('\n')}`
        : '';

      return `📊 **${politician.name}** (${politician.party})${achievements}${controversies}\n\nWould you like to know more about their policies or compare them with other politicians?`;
    }

    if (topics.includes('policy')) {
      return `🎯 **${politician.name}'s Political Stance:**\n\n${politician.stance.map(s => `• ${s}`).join('\n')}\n\n**Party:** ${politician.party}\n**Position:** ${politician.position}\n\nWant to compare with other politicians?`;
    }

    return `👤 **${politician.name}**\n\n**Party:** ${politician.party}\n**Position:** ${politician.position}\n\n**Key Stances:**\n${politician.stance.map(s => `• ${s}`).join('\n')}\n\n**Notable Achievements:**\n${politician.achievements.slice(0, 3).map(a => `• ${a}`).join('\n')}\n\nWhat else would you like to know?`;
  }

  private getPartyResponse(partyKey: string): string {
    const party = politicalKnowledge.parties[partyKey];
    if (!party) return "I don't have information about that party yet.";

    return `🏛️ **${party.fullName} (${partyKey.toUpperCase()})**\n\n**Leader:** ${party.leader}\n**Ideology:** ${party.ideology}\n\n**Key Policies:**\n${party.keyPolicies.map(p => `• ${p}`).join('\n')}\n\n**History:** ${party.history}\n\nWould you like to compare this party with another?`;
  }

  private getPartyComparison(partyKeys: string[]): string {
    const parties = partyKeys.slice(0, 2).map(key => politicalKnowledge.parties[key]).filter(Boolean);

    if (parties.length < 2) {
      return "Please specify two parties to compare (e.g., UNP and SLPP).";
    }

    return `⚖️ **Comparing ${parties[0].fullName} vs ${parties[1].fullName}**\n\n**${parties[0].fullName}:**\n• Ideology: ${parties[0].ideology}\n• Focus: ${parties[0].keyPolicies[0]}\n\n**${parties[1].fullName}:**\n• Ideology: ${parties[1].ideology}\n• Focus: ${parties[1].keyPolicies[0]}\n\nKey Difference: ${this.getKeyDifference(parties[0], parties[1])}\n\nWant more specific policy comparisons?`;
  }

  private getKeyDifference(party1: PartyProfile, party2: PartyProfile): string {
    if (party1.ideology.includes('Liberal') && party2.ideology.includes('nationalism')) {
      return "UNP favors economic liberalization and international cooperation, while SLPP promotes nationalist and self-sufficiency policies.";
    }
    return "These parties have distinct approaches to governance and economic policy.";
  }

  private getTopicResponse(topic: string): string {
    switch (topic) {
      case 'economy':
        return "💰 **Current Economic Situation:**\n\n• Inflation: Down to 10.5% from 70% peak\n• GDP Growth: Expected 2-3% in 2024\n• IMF Program: Active, $3 billion facility\n• Debt Restructuring: Ongoing negotiations\n\nPresident Wickremesinghe's administration is focused on stabilization. Want to know about specific economic policies?";
      case 'corruption':
        return "⚖️ **Anti-Corruption Landscape:**\n\nPublic demand for accountability is at an all-time high. Key voices:\n\n• **NPP/AKD:** Strong anti-corruption platform\n• **SJB:** Promises transparency reforms\n• **Current govt:** Facing pressure for investigations\n\nWould you like to know specific politicians' stances on corruption?";
      case 'governance':
        return "🏛️ **Governance & Democracy:**\n\nCurrent debates focus on:\n\n• System change movements\n• Constitutional reforms\n• Presidential vs Parliamentary system\n• Electoral reforms\n\nMultiple parties are proposing governance reforms. Want details on specific proposals?";
      default:
        return "That's an important political topic. Could you be more specific about what aspect you'd like to explore?";
    }
  }

  getSuggestions(lastResponse: string): string[] {
    if (lastResponse.includes('politician')) {
      return [
        "Compare with another politician",
        "What are their key policies?",
        "Tell me about their controversies"
      ];
    }
    if (lastResponse.includes('party')) {
      return [
        "Compare with another party",
        "Who are their key leaders?",
        "What's their election history?"
      ];
    }
    return [
      "Tell me about current political issues",
      "Who are the major political players?",
      "What's happening with the economy?",
      "Start the political knowledge quiz"
    ];
  }
}

export const poliBot = new PoliBot();

export const suggestedQueries = [
  "Tell me about Ranil Wickremesinghe's performance",
  "Compare UNP and NPP policies",
  "What's the current economic situation?",
  "Who is Anura Kumara Dissanayake?",
  "Explain the anti-corruption movement",
  "Start the political knowledge quiz"
];