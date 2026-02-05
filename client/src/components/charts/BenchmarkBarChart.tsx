import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { benchmarks, getBenchmarkData } from "@/data/mock";

// Ruby (chart-4) to Amethyst (chart-2) gradient based on score - Jewel Tones
// Low scores: Ruby #E74C3C → rgb(231, 76, 60)
// High scores: Amethyst #9B59B6 → rgb(155, 89, 182)
const getScoreColor = (score: number, minScore: number, maxScore: number): string => {
  const range = maxScore - minScore || 1;
  const normalized = (score - minScore) / range;

  const r = Math.round(231 + (155 - 231) * normalized);
  const g = Math.round(76 + (89 - 76) * normalized);
  const b = Math.round(60 + (182 - 60) * normalized);

  return `rgb(${r}, ${g}, ${b})`;
};

export function BenchmarkBarChart() {
  const [selectedBenchmark, setSelectedBenchmark] = useState(benchmarks[0]);
  const rawData = getBenchmarkData(selectedBenchmark);

  // Sort by score descending and memoize
  const data = useMemo(() => {
    return [...rawData].sort((a, b) => b.score - a.score);
  }, [rawData]);

  const minScore = Math.min(...data.map(d => d.score));
  const maxScore = Math.max(...data.map(d => d.score));

  return (
    <Card className="w-full h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">Overall Performance</CardTitle>
          <CardDescription>Comparative scores across models</CardDescription>
        </div>
        <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select benchmark" />
          </SelectTrigger>
          <SelectContent>
            {benchmarks.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} vertical={false} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-sm">
                        <p className="font-semibold mb-1 text-foreground">{data.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-mono">{data.score.toFixed(1)}</span>
                          <span className="text-muted-foreground text-xs">score</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={50}>
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
