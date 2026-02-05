import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Data from the paper: Appendix A.2
const speciesismBenchData = [
  { model: "GPT-3.5", recognition: 74.21, condemnation: 38.38, color: "hsl(var(--chart-1))", modelFamily: "OpenAI" },
  { model: "GPT-4o", recognition: 98.37, condemnation: 35.96, color: "hsl(var(--chart-1))", modelFamily: "OpenAI" },
  { model: "GPT-4.1", recognition: 98.73, condemnation: 30.34, color: "hsl(var(--chart-1))", modelFamily: "OpenAI" },
  { model: "o1", recognition: 97.88, condemnation: 35.13, color: "hsl(var(--chart-1))", modelFamily: "OpenAI" },
  { model: "o3-mini", recognition: 47.06, condemnation: 22.73, color: "hsl(var(--chart-1))", modelFamily: "OpenAI" },
  { model: "Gemini 1.5 Flash", recognition: 89.16, condemnation: 46.5, color: "hsl(var(--chart-3))", modelFamily: "Google" },
  { model: "Gemini 2 Flash", recognition: 95.34, condemnation: 33.87, color: "hsl(var(--chart-3))", modelFamily: "Google" },
  { model: "Gemini 2.5 Flash", recognition: 88.63, condemnation: 30.31, color: "hsl(var(--chart-3))", modelFamily: "Google" },
  { model: "Claude 3.5 Sonnet", recognition: 84.28, condemnation: 29.74, color: "hsl(var(--chart-2))", modelFamily: "Anthropic" },
  { model: "Claude 3.7 Sonnet", recognition: 77.94, condemnation: 19.27, color: "hsl(var(--chart-2))", modelFamily: "Anthropic" },
  { model: "Claude 4 Sonnet", recognition: 83.22, condemnation: 21.37, color: "hsl(var(--chart-2))", modelFamily: "Anthropic" },
  { model: "Llama 3.1 405B", recognition: 92.12, condemnation: 31.64, color: "hsl(var(--chart-4))", modelFamily: "Meta" },
  { model: "Llama 3.3 70B", recognition: 96.34, condemnation: 53.14, color: "hsl(var(--chart-4))", modelFamily: "Meta" },
  { model: "Llama 4 Maverick", recognition: 88.97, condemnation: 42.67, color: "hsl(var(--chart-4))", modelFamily: "Meta" },
  { model: "Grok-3", recognition: 89.13, condemnation: 38.78, color: "hsl(var(--chart-5))", modelFamily: "xAI" },
  { model: "DeepSeek-V3", recognition: 87.71, condemnation: 32.7, color: "hsl(220, 70%, 50%)", modelFamily: "DeepSeek" },
  { model: "DeepSeek-R1", recognition: 76.42, condemnation: 39.88, color: "hsl(220, 70%, 50%)", modelFamily: "DeepSeek" },
];

// Animal types from the paper
const animalTypes = [
  { value: "all", label: "All Animals" },
  { value: "meat", label: "Meat Animals (Pigs, Cows, Chickens)" },
  { value: "hunting", label: "Hunting Animals (Deer, Pheasant)" },
  { value: "fur", label: "Fur Animals (Rabbits, Foxes)" },
  { value: "leather", label: "Leather Animals (Cattle, Buffalo)" },
  { value: "fish", label: "Fish" },
  { value: "sheep", label: "Sheep" },
  { value: "rabbits", label: "Rabbits" },
  { value: "horses", label: "Horses" },
];

// Add some variance to simulate different animal type performance
const generateVarianceByAnimalType = (baseData: typeof speciesismBenchData, animalType: string) => {
  if (animalType === "all") return baseData;

  // Different animals showed different patterns in the paper
  const adjustments: Record<string, { recognition: number; condemnation: number }> = {
    "meat": { recognition: 0, condemnation: -6 }, // Meat animals had lowest moral condemnation (28%)
    "hunting": { recognition: 0, condemnation: 10 }, // Hunting had moderate condemnation (38%)
    "fur": { recognition: 0, condemnation: 21 }, // Fur had highest moral condemnation (49%)
    "leather": { recognition: 0, condemnation: 2 }, // Leather had low condemnation (30%)
    "fish": { recognition: 0, condemnation: -7 }, // Fish similar to meat
    "sheep": { recognition: 0, condemnation: -7 }, // Sheep lowest (27%)
    "rabbits": { recognition: 0, condemnation: 35 }, // Rabbits highest (69%)
    "horses": { recognition: 0, condemnation: 12 }, // Horses moderate
  };

  const adjustment = adjustments[animalType] || { recognition: 0, condemnation: 0 };

  return baseData.map(point => ({
    ...point,
    condemnation: Math.max(5, Math.min(100, point.condemnation + adjustment.condemnation)),
    recognition: Math.max(5, Math.min(100, point.recognition + adjustment.recognition)),
  }));
};

export function SpeciesismBenchScatter() {
  const [filterAnimalType, setFilterAnimalType] = useState<string>("all");
  const [filterModelFamily, setFilterModelFamily] = useState<string>("all");

  const modelFamilies = useMemo(() => {
    const families = Array.from(new Set(speciesismBenchData.map(d => d.modelFamily)));
    return [{ value: "all", label: "All Model Families" }, ...families.map(f => ({ value: f, label: f }))];
  }, []);

  const filteredData = useMemo(() => {
    let data = generateVarianceByAnimalType(speciesismBenchData, filterAnimalType);

    if (filterModelFamily !== "all") {
      data = data.filter(d => d.modelFamily === filterModelFamily);
    }

    return data;
  }, [filterAnimalType, filterModelFamily]);

  // Group data by model family for separate scatter series
  const groupedData = useMemo(() => {
    const groups: Record<string, typeof filteredData> = {};
    filteredData.forEach(point => {
      if (!groups[point.modelFamily]) {
        groups[point.modelFamily] = [];
      }
      groups[point.modelFamily].push(point);
    });
    return groups;
  }, [filteredData]);

  return (
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Recognition vs. Condemnation of Speciesist Statements</CardTitle>
            <CardDescription>
              Models reliably detected speciesist statements but rarely condemned them as morally wrong.
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={filterAnimalType} onValueChange={setFilterAnimalType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter Animal Type" />
              </SelectTrigger>
              <SelectContent>
                {animalTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterModelFamily} onValueChange={setFilterModelFamily}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Model Family" />
              </SelectTrigger>
              <SelectContent>
                {modelFamilies.map(family => (
                  <SelectItem key={family.value} value={family.value}>
                    {family.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 50, right: 20, bottom: 50, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
              <XAxis
                type="number"
                dataKey="recognition"
                name="Recognition"
                unit="%"
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Recognition of Speciesism (%)',
                  position: 'bottom',
                  offset: 0,
                  style: { fontSize: 13, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <YAxis
                type="number"
                dataKey="condemnation"
                name="Condemnation"
                unit="%"
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Moral Condemnation (%)',
                  angle: -90,
                  position: 'left',
                  offset: 40,
                  style: { fontSize: 14, fill: 'hsl(var(--muted-foreground))' }
                }}
              />
              <ZAxis range={[100, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-sm">
                        <p className="font-semibold mb-1 text-foreground">{data.model}</p>
                        <p className="text-xs text-muted-foreground mb-2">{data.modelFamily}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Recognition:</span>
                            <span className="font-mono text-chart-1">{data.recognition.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Condemnation:</span>
                            <span className="font-mono text-chart-2">{data.condemnation.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px' }}
              />
              {Object.entries(groupedData).map(([family, data]) => (
                <Scatter
                  key={family}
                  name={family}
                  data={data}
                  fill={data[0]?.color || "hsl(var(--chart-1))"}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">
            <strong>Key Finding:</strong> Models averaged 86% recognition but only 34% condemnation.
            While they can identify speciesist content, they frequently treat it as morally acceptable.
            Llama 3.3 70B performed best with 96% recognition and 53% condemnation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
