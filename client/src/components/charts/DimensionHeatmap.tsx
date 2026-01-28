import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { models, getHeatmapData } from "@/data/mock";

interface DimensionHeatmapProps {
  selectedDate: string;
}

// Get color based on score: red (0-30%) → yellow (50%) → green (100%)
const getScoreColor = (score: number): string => {
  // Define color stops
  const red = { r: 153, g: 27, b: 27 };     // Darker red at 0%
  const yellow = { r: 234, g: 179, b: 8 };  // Yellow at 50%
  const green = { r: 22, g: 163, b: 74 };   // Green at 100%

  let r, g, b;

  if (score <= 30) {
    // Stay mostly red from 0-30%
    const t = score / 30;
    // Only slight transition toward yellow
    r = Math.round(red.r + (red.r + 30 - red.r) * t);
    g = Math.round(red.g + (red.g + 40 - red.g) * t);
    b = Math.round(red.b);
  } else if (score <= 50) {
    // Transition from red to yellow (30-50%)
    const t = (score - 30) / 20;
    r = Math.round(183 + (yellow.r - 183) * t);
    g = Math.round(67 + (yellow.g - 67) * t);
    b = Math.round(27 + (yellow.b - 27) * t);
  } else {
    // Interpolate from yellow to green (50-100%)
    const t = (score - 50) / 50;
    r = Math.round(yellow.r + (green.r - yellow.r) * t);
    g = Math.round(yellow.g + (green.g - yellow.g) * t);
    b = Math.round(yellow.b + (green.b - yellow.b) * t);
  }

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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Dimension Breakdown</CardTitle>
        <CardDescription>Performance heatmap across all dimensions</CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <table className="w-full text-sm border-collapse table-fixed">
          <colgroup>
            <col className="w-[35%]" />
            {models.map(model => (
              <col key={model.id} className="w-[13%]" />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 px-2 font-medium text-muted-foreground text-xs">
                Dimension
              </th>
              {models.map(model => (
                <th key={model.id} className="py-2 px-1 font-medium text-muted-foreground text-center">
                  <span className="text-[11px] leading-tight block">{model.name}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Weighted score row - highlighted */}
            <tr className="border-b-2 border-chart-1/30 bg-gradient-to-r from-muted/30 to-muted/10">
              <td className="py-3 px-2 font-bold text-sm text-foreground">
                Weighted Score
              </td>
              {modelScores.map((model, idx) => (
                <td key={idx} className="py-2 px-1.5 text-center">
                  <div
                    className={`py-2.5 rounded-md text-sm shadow-sm border border-black/10 ${getTextColor(model.score)}`}
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
                <td className="py-1.5 px-2 text-muted-foreground text-xs">
                  {row.subject}
                </td>
                {models.map((model, colIdx) => {
                  const score = row[model.name as keyof typeof row] as number;
                  return (
                    <td key={colIdx} className="py-1.5 px-1.5 text-center">
                      <div
                        className={`py-1.5 rounded text-xs ${getTextColor(score)}`}
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
