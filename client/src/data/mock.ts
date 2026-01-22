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

export const speciesList = [
  "Dogs", "Cats", "Dolphins", "Monkeys", "Horses", "Pigs", 
  "Cows", "Chickens", "Fish", "Mice", "Shrimp", "Ant"
];

export const studies = [
  {
    year: "2022",
    title: "Hagendorff et al. (2022)",
    description: "Evaluated GPT-3, Delphi, and vision models on animal ethics and bias.",
    url: "https://arxiv.org/pdf/2202.10848"
  },
  {
    year: "2022",
    title: "Takeshita et al. (2022)",
    description: "Analyzed BERT-based models for speciesist sentiment and bias.",
    url: "https://arxiv.org/pdf/2203.05140"
  },
  {
    year: "2024",
    title: "Ghose et al. (2024) - AnimaLLM",
    description: "Benchmark testing ChatGPT-4 and Claude 2.1 on animal-related scenarios.",
    url: "https://arxiv.org/pdf/2403.01199"
  },
  {
    year: "2024",
    title: "Takeshita & Rzepka (2024)",
    description: "Longitudinal study of OpenAI GPT models on animal welfare reasoning.",
    url: "https://arxiv.org/pdf/2410.14194"
  },
  {
    year: "2025",
    title: "Kanepajs et al. (2025) - AnimalHarmBench",
    description: "Comprehensive evaluation across 13 dimensions for leading Frontier models.",
    url: "https://arxiv.org/pdf/2503.04804"
  },
  {
    year: "2025",
    title: "AnimalHarmBench 2.0 (2025)",
    description: "Updated benchmark for next-gen models including Grok-4 and Claude 4.5.",
    url: "https://forum.effectivealtruism.org/posts/nBnRKpQ8rzHgFSJz9/animalharmbench-2-0-evaluating-llms-on-reasoning-about"
  },
  {
    year: "2025",
    title: "Sheng et al. (2025)",
    description: "Visual speciesism analysis in image generation models like DALL-E 3.",
    url: "https://arxiv.org/pdf/2502.19771"
  },
  {
    year: "2024",
    title: "Greenblatt et al. (2024) - Alignment Faking",
    description: "Investigating whether models fake alignment in animal welfare scenarios.",
    url: "https://arxiv.org/pdf/2412.14093"
  }
];

export const getBenchmarkData = (benchmark: string) => {
  const seed = benchmark.length;
  return models.map((model, index) => ({
    name: model.name,
    score: Math.min(98, Math.max(40, 60 + (index * seed % 30) + (Math.random() * 10))),
    fill: model.color
  }));
};

// Available dates for selection
export const availableDates = [
  { label: "January 2026", value: "2026-01" },
  { label: "June 2025", value: "2025-06" },
  { label: "December 2024", value: "2024-12" },
];

// Generate consistent data based on date seed with high variability
const generateDateBasedData = (dateSeed: string) => {
  // Use date string to create a deterministic "random" offset
  const seedNum = dateSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Base scores that improve over time (2024 -> 2025 -> 2026)
  const yearMultiplier = dateSeed.startsWith('2026') ? 1.0 : dateSeed.startsWith('2025') ? 0.85 : 0.7;

  // Create varied base scores per dimension - some dimensions are harder than others
  const dimensionDifficulty = [0.95, 0.7, 1.0, 0.6, 0.8, 0.5, 0.75, 0.85, 0.65, 0.9, 0.55, 0.72, 0.88];

  return dimensions.map((dim, dimIndex) => {
    const difficulty = dimensionDifficulty[dimIndex % dimensionDifficulty.length];

    // More varied base scores with bigger gaps between models
    const baseScores = {
      "GPT-4o": 85 * difficulty + ((seedNum + dimIndex * 7) % 15),
      "Claude 3.5 Sonnet": 80 * difficulty + ((seedNum + dimIndex * 11) % 18),
      "Gemini 1.5 Pro": 70 * difficulty + ((seedNum + dimIndex * 13) % 20),
      "Llama 3 70B": 55 * difficulty + ((seedNum + dimIndex * 17) % 25),
      "Mistral Large": 40 * difficulty + ((seedNum + dimIndex * 19) % 30),
    };

    return {
      subject: dim,
      "GPT-4o": Math.min(100, Math.max(20, Math.floor(baseScores["GPT-4o"] * yearMultiplier))),
      "Claude 3.5 Sonnet": Math.min(100, Math.max(15, Math.floor(baseScores["Claude 3.5 Sonnet"] * yearMultiplier))),
      "Gemini 1.5 Pro": Math.min(100, Math.max(10, Math.floor(baseScores["Gemini 1.5 Pro"] * yearMultiplier))),
      "Llama 3 70B": Math.min(100, Math.max(5, Math.floor(baseScores["Llama 3 70B"] * yearMultiplier))),
      "Mistral Large": Math.min(100, Math.max(0, Math.floor(baseScores["Mistral Large"] * yearMultiplier))),
      fullMark: 100,
    };
  });
};

// Cache for date-based data
const dataCache: Record<string, ReturnType<typeof generateDateBasedData>> = {};

export const getRadarDataByDate = (dateValue: string) => {
  if (!dataCache[dateValue]) {
    dataCache[dateValue] = generateDateBasedData(dateValue);
  }
  return dataCache[dateValue];
};

// Default radar data (for backward compatibility)
export const radarData = getRadarDataByDate("2026-01");

export const getDimensionData = (dimension: string) => {
  const dimData = radarData.find(d => d.subject === dimension);
  if (!dimData) return [];

  return models.map(m => ({
    name: m.name,
    score: dimData[m.name as keyof typeof dimData] as number,
    fill: m.color
  }));
};

// Get heatmap data for a specific date
export const getHeatmapData = (dateValue: string) => {
  const dateData = getRadarDataByDate(dateValue);
  return dateData;
};

export const getSpeciesPerformance = (modelName: string) => {
  return speciesList.map((species, index) => {
    // Declining performance based on list order
    const base = 90 - (index * 6);
    const variance = Math.random() * 15 - 7.5;
    return {
      species,
      score: Math.min(100, Math.max(10, base + variance))
    };
  });
};

export const generateScatterData = () => {
  const data = [];
  const startDate = new Date('2023-01-01');
  const now = new Date();
  
  for (let i = 0; i < 150; i++) {
    const randomModel = models[Math.floor(Math.random() * models.length)];
    const randomBenchmark = benchmarks[Math.floor(Math.random() * benchmarks.length)];
    const randomTime = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));
    const timeFactor = (randomTime.getTime() - startDate.getTime()) / (now.getTime() - startDate.getTime());
    const baseScore = 50 + (timeFactor * 30); 
    const score = Math.min(100, Math.max(0, baseScore + (Math.random() * 20 - 10)));

    data.push({
      id: i,
      x: randomTime.getTime(),
      y: score,
      model: randomModel.name,
      benchmark: randomBenchmark,
      modelId: randomModel.id
    });
  }
  return data;
};
