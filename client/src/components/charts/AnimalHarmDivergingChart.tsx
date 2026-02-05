import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from 'recharts';
import { animalHarmBySpecies, animalHarmByModel } from "@/data/mock";

type ChartType = 'species' | 'model';

interface AnimalHarmDivergingChartProps {
  type: ChartType;
}

export function AnimalHarmDivergingChart({ type }: AnimalHarmDivergingChartProps) {
  const data = type === 'species' ? animalHarmBySpecies : animalHarmByModel;
  const title = type === 'species'
    ? 'Animal Harm Risk by Species'
    : 'Animal Harm Risk by AI Model';
  const description = type === 'species'
    ? 'Kanepajs et al. (2025): Scores show risk of harm in LLM responses. Positive scores indicate decreased risk, negative scores indicate increased risk.'
    : 'Kanepajs et al. (2025): Comparative performance across frontier LLMs. Higher scores indicate better animal welfare considerations.';

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const name = payload[0].payload.name;
      return (
        <div className="bg-card border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{name}</p>
          <p className={`text-sm ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Score: {value.toFixed(3)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {value >= 0 ? 'Decreased harm risk' : 'Increased harm risk'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={type === 'species' ? 900 : 450}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: type === 'species' ? 140 : 160, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
            <XAxis
              type="number"
              domain={[-0.2, 0.5]}
              stroke="hsl(var(--foreground))"
              fontSize={13}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--foreground))"
              fontSize={13}
              width={type === 'species' ? 130 : 150}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="var(--foreground)" strokeWidth={2} />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.score >= 0 ? 'var(--color-chart-3)' : 'var(--color-chart-5)'}
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-chart-3)', opacity: 0.8 }}></div>
            <span className="text-muted-foreground">Decreased Harm Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-chart-5)', opacity: 0.8 }}></div>
            <span className="text-muted-foreground">Increased Harm Risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
