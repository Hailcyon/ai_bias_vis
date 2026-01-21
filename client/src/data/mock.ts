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
    id: "hagendorff2022",
    year: "2022",
    title: "Hagendorff et al. (2022)",
    description: "Evaluated GPT-3, Delphi, and vision models on animal ethics and bias.",
    url: "https://arxiv.org/pdf/2202.10848",
    tags: ["NLP", "Bias", "Foundational"],
    connections: ["takeshita2022"]
  },
  {
    id: "takeshita2022",
    year: "2022",
    title: "Takeshita et al. (2022)",
    description: "Analyzed BERT-based models for speciesist sentiment and bias.",
    url: "https://arxiv.org/pdf/2203.05140",
    tags: ["NLP", "BERT", "Sentiment Analysis"],
    connections: ["hagendorff2022", "takeshita2024"]
  },
  {
    id: "ghose2024",
    year: "2024",
    title: "Ghose et al. (2024) - AnimaLLM",
    description: "Benchmark testing ChatGPT-4 and Claude 2.1 on animal-related scenarios.",
    url: "https://arxiv.org/pdf/2403.01199",
    tags: ["Benchmark", "LLM", "Evaluation"],
    connections: ["kanepajs2025"]
  },
  {
    id: "takeshita2024",
    year: "2024",
    title: "Takeshita & Rzepka (2024)",
    description: "Longitudinal study of OpenAI GPT models on animal welfare reasoning.",
    url: "https://arxiv.org/pdf/2410.14194",
    tags: ["GPT", "Reasoning", "Longitudinal"],
    connections: ["takeshita2022", "animalharm2"]
  },
  {
    id: "kanepajs2025",
    year: "2025",
    title: "Kanepajs et al. (2025) - AnimalHarmBench",
    description: "Comprehensive evaluation across 13 dimensions for leading Frontier models.",
    url: "https://arxiv.org/pdf/2503.04804",
    tags: ["Benchmark", "Frontier Models", "Evaluation"],
    connections: ["ghose2024", "animalharm2"]
  },
  {
    id: "animalharm2",
    year: "2025",
    title: "AnimalHarmBench 2.0 (2025)",
    description: "Updated benchmark for next-gen models including Grok-4 and Claude 4.5.",
    url: "https://forum.effectivealtruism.org/posts/nBnRKpQ8rzHgFSJz9/animalharmbench-2-0-evaluating-llms-on-reasoning-about",
    tags: ["Benchmark", "Grok", "Claude"],
    connections: ["kanepajs2025", "takeshita2024"]
  },
  {
    id: "sheng2025",
    year: "2025",
    title: "Sheng et al. (2025)",
    description: "Visual speciesism analysis in image generation models like DALL-E 3.",
    url: "https://arxiv.org/pdf/2502.19771",
    tags: ["Visual", "Image Gen", "DALL-E"],
    connections: ["hagendorff2022"]
  },
  {
    id: "greenblatt2024",
    year: "2024",
    title: "Greenblatt et al. (2024) - Alignment Faking",
    description: "Investigating whether models fake alignment in animal welfare scenarios.",
    url: "https://arxiv.org/pdf/2412.14093",
    tags: ["Safety", "Alignment", "Honesty"],
    connections: ["ghose2024"]
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

export const getDimensionData = (dimension: string) => {
  const dimData = radarData.find(d => d.subject === dimension);
  if (!dimData) return [];
  
  return models.map(m => ({
    name: m.name,
    score: dimData[m.name as keyof typeof dimData] as number,
    fill: m.color
  }));
};

export const getSpeciesPerformance = (modelName: string) => {
  return speciesList.map((species, index) => {
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

// Knowledge Graph Data Helper
export const getKnowledgeGraphData = () => {
  const nodeMap = new Map();
  
  // Create nodes with positions
  studies.forEach((study, idx) => {
    // Simple circular layout for the prototype
    const angle = (idx / studies.length) * 2 * Math.PI;
    const radius = 250;
    nodeMap.set(study.id, {
      ...study,
      x: 400 + radius * Math.cos(angle),
      y: 400 + radius * Math.sin(angle)
    });
  });

  const links: any[] = [];
  studies.forEach(study => {
    study.connections?.forEach(targetId => {
      if (nodeMap.has(targetId)) {
        links.push({
          source: nodeMap.get(study.id),
          target: nodeMap.get(targetId)
        });
      }
    });
  });

  return { nodes: Array.from(nodeMap.values()), links };
};
