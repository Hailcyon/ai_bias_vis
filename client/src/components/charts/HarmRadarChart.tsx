import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { models, getRadarDataByDate } from "@/data/mock";
import { useState, useEffect, useRef, useMemo } from "react";

interface HarmRadarChartProps {
  selectedDate: string;
}

export function HarmRadarChart({ selectedDate }: HarmRadarChartProps) {
  const actualData = useMemo(() => getRadarDataByDate(selectedDate), [selectedDate]);
  const [displayData, setDisplayData] = useState(actualData);
  const prevDateRef = useRef(selectedDate);

  useEffect(() => {
    // Only animate if the date actually changed (not on initial mount)
    if (prevDateRef.current !== selectedDate) {
      // Create zeroed data with same structure
      const zeroedData = actualData.map(item => {
        const zeroed: Record<string, string | number> = { subject: item.subject };
        models.forEach(model => {
          zeroed[model.name] = 0;
        });
        return zeroed;
      });

      // Set to zero first
      setDisplayData(zeroedData);

      // Then animate to actual values after a brief delay
      const timer = setTimeout(() => {
        setDisplayData(actualData);
      }, 50);

      prevDateRef.current = selectedDate;
      return () => clearTimeout(timer);
    }
  }, [selectedDate, actualData]);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-0">
        <CardTitle>Multidimensional Analysis</CardTitle>
        <CardDescription>Animal Harm Benchmark 2.0 Dimensions</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 pt-0">
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="48%" outerRadius="75%" data={displayData}>
              <PolarGrid stroke="hsl(var(--muted-foreground))" opacity={0.2} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

              {models.map((model) => (
                <Radar
                  key={model.name}
                  name={model.name}
                  dataKey={model.name}
                  stroke={model.color}
                  fill={model.color}
                  fillOpacity={0.1}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              ))}
              
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
