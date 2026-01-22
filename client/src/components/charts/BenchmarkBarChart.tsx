import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { benchmarks, getBenchmarkData } from "@/data/mock";

export function BenchmarkBarChart() {
  const [selectedBenchmark, setSelectedBenchmark] = useState(benchmarks[0]);
  const data = getBenchmarkData(selectedBenchmark);

  return (
    <Card className="w-full h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">Overall Performance</CardTitle>
          <CardDescription>Comparative scores across models</CardDescription>
        </div>
        <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
          <SelectTrigger className="w-[240px]">
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
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
