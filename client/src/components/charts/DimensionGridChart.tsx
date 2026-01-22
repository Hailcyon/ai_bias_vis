import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getGridData, models } from "@/data/mock";
import { cn } from "@/lib/utils";

export function DimensionGridChart() {
  const data = useMemo(() => getGridData(), []);

  const getHeatmapColor = (score: number) => {
    if (score >= 80) return "bg-emerald-900/40 text-emerald-400";
    if (score >= 60) return "bg-blue-900/40 text-blue-400";
    if (score >= 40) return "bg-purple-900/40 text-purple-400";
    if (score >= 20) return "bg-orange-900/40 text-orange-400";
    return "bg-rose-900/40 text-rose-400";
  };

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Dimension Heatmap</CardTitle>
        <CardDescription>Performance density across all evaluation axes</CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 overflow-auto">
        <table className="w-full text-xs sm:text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-foreground font-medium">Dimension</th>
              {models.map(m => (
                <th key={m.id} className="p-2 text-center text-muted-foreground font-medium whitespace-nowrap">
                  {m.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t border-border/20">
                <td className="p-2 text-foreground font-medium">{row.dimension}</td>
                {models.map(m => {
                  const score = row[m.name];
                  return (
                    <td key={m.id} className="p-1">
                      <div className={cn(
                        "w-full h-10 flex items-center justify-center rounded-md font-mono font-bold",
                        getHeatmapColor(score)
                      )}>
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
