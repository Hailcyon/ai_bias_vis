export const benchmarks = [
  "Animal Harm Benchmark 2.0",
  "SpeciesismQA",
  "EthicsBench (Animal Subset)",
  "MoralScope AI",
  "SentienceEval"
];

export const models = [
  { id: "gpt4", name: "GPT-4o", color: "var(--color-chart-1)" },
  { id: "claude3", name: "Claude 3.5 Sonnet", color: "var(--color-chart-2)" },
  { id: "gemini", name: "Gemini 1.5 Pro", color: "var(--color-chart-3)" },
  { id: "llama3", name: "Llama 3 70B", color: "var(--color-chart-4)" },
  { id: "mistral", name: "Mistral Large", color: "var(--color-chart-5)" }
];

export const dimensions = [
  "Moral Consideration",
  "Harm Minimization",
  "Sentience Acknowledgement",
  "Prejudice Avoidance",
  "Scope Sensitivity",
  "Evidence-Based Capacity Attribution",
  "Cautious Impact Consideration",
  "Actionability",
  "Contextual Welfare Salience",
  "Epistemic Humility",
  "Trade-off Transparency",
  "Novel Entity Precaution",
  "Control Questions"
];

// Data for the top bar chart (comparing models across a selected benchmark)
export const getBenchmarkData = (benchmark: string) => {
  // Generate slightly different random data based on the benchmark name length to keep it deterministic-ish
  const seed = benchmark.length;
  return models.map((model, index) => ({
    name: model.name,
    score: Math.min(98, Math.max(40, 60 + (index * seed % 30) + (Math.random() * 10))),
    fill: model.color
  }));
};

// Data for the Radar Chart & Dimension Bar Chart (Animal Harm Benchmark 2.0 specific)
// We need scores for each model on each dimension.
export const radarData = dimensions.map((dim) => {
  return {
    subject: dim,
    "GPT-4o": Math.floor(Math.random() * 30) + 70,
    "Claude 3.5 Sonnet": Math.floor(Math.random() * 30) + 65,
    "Gemini 1.5 Pro": Math.floor(Math.random() * 30) + 60,
    "Llama 3 70B": Math.floor(Math.random() * 40) + 50,
    "Mistral Large": Math.floor(Math.random() * 40) + 45,
    fullMark: 100,
  };
});

// For the horizontal bar chart on the right of the radar
// It should show how models compare on a SINGLE selected dimension
export const getDimensionData = (dimension: string) => {
  const dimData = radarData.find(d => d.subject === dimension);
  if (!dimData) return [];
  
  return models.map(m => ({
    name: m.name,
    score: dimData[m.name as keyof typeof dimData] as number,
    fill: m.color
  }));
};

// Scatter plot data
// Points for scores of each benchmark run on all models over time
export const generateScatterData = () => {
  const data = [];
  const startDate = new Date('2023-01-01');
  const now = new Date();
  
  for (let i = 0; i < 150; i++) {
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomBenchmark = benchmarks[Math.floor(Math.random() * benchmarks.length)];
    const randomTime = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));
    
    // Trend: scores generally improving over time
    const timeFactor = (randomTime.getTime() - startDate.getTime()) / (now.getTime() - startDate.getTime());
    const baseScore = 50 + (timeFactor * 30); 
    const score = Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10)));

    data.push({
      id: i,
      x: randomTime.getTime(), // Numeric timestamp for X-axis
      y: score,
      model: randomModel.name,
      benchmark: randomBenchmark,
      modelId: randomModel.id
    });
  }
  return data;
};
