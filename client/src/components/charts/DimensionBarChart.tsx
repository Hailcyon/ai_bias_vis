import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dimensions, models, getRadarDataByDate } from "@/data/mock";

interface DimensionBarChartProps {
  selectedDate: string;
}

// Cyan (chart-1) to Purple (chart-2) gradient based on score
// chart-1: hsl(196, 100%, 50%) → rgb(0, 191, 255)
// chart-2: hsl(265, 89%, 66%) → rgb(149, 97, 226)
const getScoreColor = (score: number, minScore: number, maxScore: number): string => {
  const range = maxScore - minScore || 1;
  const normalized = (score - minScore) / range;

  const r = Math.round(149 + (0 - 149) * normalized);
  const g = Math.round(97 + (191 - 97) * normalized);
  const b = Math.round(226 + (255 - 226) * normalized);

  return `rgb(${r}, ${g}, ${b})`;
};

export function DimensionBarChart({ selectedDate }: DimensionBarChartProps) {
  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]);
  const radarData = getRadarDataByDate(selectedDate);
  const dimData = radarData.find(d => d.subject === selectedDimension);

  const data = dimData
    ? models.map(m => ({
        name: m.name,
        score: dimData[m.name as keyof typeof dimData] as number,
      })).sort((a, b) => b.score - a.score)
    : [];

  const minScore = Math.min(...data.map(d => d.score));
  const maxScore = Math.max(...data.map(d => d.score));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-col space-y-3 pb-2">
        <div className="space-y-1">
          <CardTitle>Dimension Breakdown</CardTitle>
          <CardDescription>Compare performance on specific metrics</CardDescription>
        </div>
        <Select value={selectedDimension} onValueChange={setSelectedDimension}>
          <SelectTrigger>
            <SelectValue placeholder="Select dimension" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {dimensions.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} horizontal={false} />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                width={100}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-sm">
                        <p className="font-semibold mb-1 text-foreground">{data.name}</p>
                        <p className="text-muted-foreground text-xs mb-2">{selectedDimension}</p>
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
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
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
