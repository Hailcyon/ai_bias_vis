import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { models, getRadarDataByDate } from "@/data/mock";

interface HarmRadarChartProps {
  selectedDate: string;
}

export function HarmRadarChart({ selectedDate }: HarmRadarChartProps) {
  const radarData = getRadarDataByDate(selectedDate);

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Multidimensional Analysis</CardTitle>
        <CardDescription>Animal Harm Benchmark 2.0 Dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
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
