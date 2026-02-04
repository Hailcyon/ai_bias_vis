import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { models, getSpeciesPerformance } from "@/data/mock";

// Topaz (chart-5) to Emerald (chart-1) gradient based on score - Jewel Tones
// Low scores: Topaz/Amber #F39C12 → rgb(243, 156, 18)
// High scores: Emerald #1ABC9C → rgb(26, 188, 156)
const getScoreColor = (score: number, minScore: number, maxScore: number): string => {
  const range = maxScore - minScore || 1;
  const normalized = (score - minScore) / range;

  const r = Math.round(243 + (26 - 243) * normalized);
  const g = Math.round(156 + (188 - 156) * normalized);
  const b = Math.round(18 + (156 - 18) * normalized);

  return `rgb(${r}, ${g}, ${b})`;
};

export function SpeciesPerformanceChart() {
  const [selectedModel, setSelectedModel] = useState(models[0].name);
  const rawData = getSpeciesPerformance(selectedModel);

  // Sort by score descending
  const data = useMemo(() => {
    return [...rawData].sort((a, b) => b.score - a.score);
  }, [rawData]);

  const minScore = Math.min(...data.map(d => d.score));
  const maxScore = Math.max(...data.map(d => d.score));

  return (
    <Card className="w-full h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">Species Breakdown</CardTitle>
          <CardDescription>Performance variance by species</CardDescription>
        </div>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.name}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                dataKey="species" 
                type="category" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                width={80}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score, minScore, maxScore)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
