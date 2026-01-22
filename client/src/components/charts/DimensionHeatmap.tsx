import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { models, getHeatmapData } from "@/data/mock";

interface DimensionHeatmapProps {
  selectedDate: string;
}

// Get color based on score using chart-3 (green) for high and chart-5 (yellow) for low
// chart-3: hsl(155, 85%, 55%) → rgb(33, 222, 134)
// chart-5: hsl(45, 90%, 60%) → rgb(245, 199, 51)
const getScoreColor = (score: number): string => {
  // Normalize score to 0-1 range
  const normalized = score / 100;

  // Interpolate between yellow (0) and green (100)
  const r = Math.round(245 + (33 - 245) * normalized);
  const g = Math.round(199 + (222 - 199) * normalized);
  const b = Math.round(51 + (134 - 51) * normalized);

  return `rgb(${r}, ${g}, ${b})`;
};

// Get text color based on background brightness
const getTextColor = (score: number): string => {
  return "text-gray-900 font-semibold";
};

export function DimensionHeatmap({ selectedDate }: DimensionHeatmapProps) {
  const data = getHeatmapData(selectedDate);

  // Calculate weighted scores for each model (simple average for now)
  const modelScores = models.map(model => {
    const scores = data.map(d => d[model.name as keyof typeof d] as number);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    return { name: model.name, score: avg };
  });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden w-fit">
      <CardHeader className="pb-2">
        <CardTitle>Dimension Breakdown</CardTitle>
        <CardDescription>Performance heatmap across all dimensions</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pb-2">
        <table className="text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-1.5 px-2 font-medium text-muted-foreground text-xs">
                Dimension
              </th>
              {models.map(model => (
                <th key={model.id} className="py-1.5 px-0.5 font-medium text-muted-foreground text-center">
                  <span className="text-[10px] leading-tight block w-11">{model.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Weighted score row */}
            <tr className="border-b-2 border-border/50 bg-muted/20">
              <td className="py-1.5 px-2 font-semibold text-xs">
                Weighted Score
              </td>
              {modelScores.map((model, idx) => (
                <td key={idx} className="py-0.5 px-0.5 text-center">
                  <div
                    className={`w-11 py-1 rounded text-[10px] ${getTextColor(model.score)}`}
                    style={{ backgroundColor: getScoreColor(model.score) }}
                  >
                    {model.score}%
                  </div>
                </td>
              ))}
            </tr>

            {/* Dimension rows */}
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-border/10 hover:bg-muted/10 transition-colors">
                <td className="py-0.5 px-2 text-muted-foreground text-[11px] max-w-[140px] truncate">
                  {row.subject}
                </td>
                {models.map((model, colIdx) => {
                  const score = row[model.name as keyof typeof row] as number;
                  return (
                    <td key={colIdx} className="py-0.5 px-0.5 text-center">
                      <div
                        className={`w-11 py-0.5 rounded text-[10px] ${getTextColor(score)}`}
                        style={{ backgroundColor: getScoreColor(score) }}
                      >
                        {score}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
