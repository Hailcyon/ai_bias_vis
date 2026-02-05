import { useState, useMemo, useEffect, useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateScatterData, models, benchmarks } from "@/data/mock";
import { format } from "date-fns";

export function TimelineScatterPlot() {
  const [filterModel, setFilterModel] = useState<string>("all");
  const [filterBenchmark, setFilterBenchmark] = useState<string>("all");

  const rawData = useMemo(() => generateScatterData(), []);

  // Calculate stable domain from all data to prevent grid flickering
  const xDomain = useMemo(() => {
    if (rawData.length === 0) return [0, Date.now()];
    const xValues = rawData.map(d => d.x);
    return [Math.min(...xValues), Math.max(...xValues)];
  }, [rawData]);

  const actualFilteredData = useMemo(() => {
    return rawData.filter(item => {
      if (filterModel !== "all" && item.model !== filterModel) return false;
      if (filterBenchmark !== "all" && item.benchmark !== filterBenchmark) return false;
      return true;
    });
  }, [filterModel, filterBenchmark, rawData]);

  const [displayData, setDisplayData] = useState(actualFilteredData);
  const prevFilterRef = useRef(`${filterModel}-${filterBenchmark}`);

  useEffect(() => {
    const currentFilter = `${filterModel}-${filterBenchmark}`;

    // Only animate if the filter actually changed (not on initial mount)
    if (prevFilterRef.current !== currentFilter) {
      // Set to empty data first to trigger animation
      setDisplayData([]);

      // Then animate to actual values after a brief delay
      const timer = setTimeout(() => {
        setDisplayData(actualFilteredData);
      }, 50);

      prevFilterRef.current = currentFilter;
      return () => clearTimeout(timer);
    }
  }, [filterModel, filterBenchmark, actualFilteredData]);

  return (
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>Historical Performance</CardTitle>
            <CardDescription>Benchmark runs over time (Normalized Scores 0-100)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={filterModel} onValueChange={setFilterModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {models.map(m => (
                  <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterBenchmark} onValueChange={setFilterBenchmark}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Benchmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Benchmarks</SelectItem>
                {benchmarks.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.1} />
              <XAxis
                type="number"
                dataKey="x"
                name="Date"
                domain={xDomain}
                tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM yyyy')}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Score" 
                unit="" 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-3 rounded-lg shadow-lg text-sm">
                        <p className="font-semibold mb-1 text-foreground">{data.model}</p>
                        <p className="text-muted-foreground">{data.benchmark}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-mono">{data.y.toFixed(1)}</span>
                          <span className="text-muted-foreground text-xs">
                            {format(new Date(data.x), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* If no filters, show generic scatter points, but better to group by model color if possible */}
              {models.map((model) => (
                <Scatter
                  key={model.id}
                  name={model.name}
                  data={displayData.filter(d => d.model === model.name)}
                  fill={model.color}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
