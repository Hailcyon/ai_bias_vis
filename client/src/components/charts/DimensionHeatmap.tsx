import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { models, getHeatmapData } from "@/data/mock";

interface DimensionHeatmapProps {
  selectedDate: string;
}

// Get color based on score (green for 100, yellow for 0)
const getScoreColor = (score: number): string => {
  // Normalize score to 0-1 range
  const normalized = score / 100;

  // Interpolate between yellow (0) and green (100)
  // Yellow: rgb(234, 179, 8) - Tailwind yellow-500
  // Green: rgb(34, 197, 94) - Tailwind green-500
  const r = Math.round(234 + (34 - 234) * normalized);
  const g = Math.round(179 + (197 - 179) * normalized);
  const b = Math.round(8 + (94 - 8) * normalized);

  return `rgb(${r}, ${g}, ${b})`;
};

// Get text color based on background brightness
const getTextColor = (score: number): string => {
  return score > 50 ? "text-white" : "text-gray-800";
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
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Dimension Breakdown</CardTitle>
        <CardDescription>Performance heatmap across all dimensions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground sticky left-0 bg-card/90 backdrop-blur-sm min-w-[180px]">
                  Dimension
                </th>
                {models.map(model => (
                  <th key={model.id} className="py-3 px-2 font-medium text-muted-foreground text-center min-w-[80px]">
                    <span className="text-xs leading-tight block">{model.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Weighted score row */}
              <tr className="border-b-2 border-border/50 bg-muted/20">
                <td className="py-3 px-4 font-semibold sticky left-0 bg-muted/30 backdrop-blur-sm">
                  Weighted Score
                </td>
                {modelScores.map((model, idx) => (
                  <td key={idx} className="py-2 px-2 text-center">
                    <div
                      className={`mx-auto w-14 py-2 rounded font-bold text-sm ${getTextColor(model.score)}`}
                      style={{ backgroundColor: getScoreColor(model.score) }}
                    >
                      {model.score}%
                    </div>
                  </td>
                ))}
              </tr>

              {/* Dimension rows */}
              {data.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <td className="py-2 px-4 text-muted-foreground sticky left-0 bg-card/90 backdrop-blur-sm text-sm">
                    {row.subject}
                  </td>
                  {models.map((model, colIdx) => {
                    const score = row[model.name as keyof typeof row] as number;
                    return (
                      <td key={colIdx} className="py-2 px-2 text-center">
                        <div
                          className={`mx-auto w-14 py-1.5 rounded text-sm font-medium ${getTextColor(score)}`}
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
        </div>
      </CardContent>
    </Card>
  );
}
