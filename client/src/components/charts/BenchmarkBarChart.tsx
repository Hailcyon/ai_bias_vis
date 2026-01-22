import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { benchmarks, getBenchmarkData } from "@/data/mock";

// Purple (chart-2) to Pink (chart-4) gradient based on score
// chart-2: hsl(265, 89%, 66%) → rgb(149, 97, 226)
// chart-4: hsl(330, 85%, 60%) → rgb(230, 57, 127)
const getScoreColor = (score: number, minScore: number, maxScore: number): string => {
  const range = maxScore - minScore || 1;
  const normalized = (score - minScore) / range;

  const r = Math.round(230 + (149 - 230) * normalized);
  const g = Math.round(57 + (97 - 57) * normalized);
  const b = Math.round(127 + (226 - 127) * normalized);

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
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--popover-foreground))'
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
