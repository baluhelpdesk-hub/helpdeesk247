interface UserQaInput {
  question: string;
  userGoal: string;
  trainingExp: string;
}

export function buildUserQaPrompt(data: UserQaInput): string {
  return `You are a knowledgeable, friendly personal fitness coach. A user has a question for you.

User goal: ${data.userGoal}
Training experience: ${data.trainingExp}
Question: ${data.question}

Answer in 2-4 sentences. Be practical and specific.
If the question is about injury or medical conditions, recommend consulting a doctor.
Do not use markdown. Keep under 80 words.`;
}
