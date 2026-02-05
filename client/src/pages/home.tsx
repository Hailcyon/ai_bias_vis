import { BenchmarkBarChart } from "@/components/charts/BenchmarkBarChart";
import { SpeciesPerformanceChart } from "@/components/charts/SpeciesPerformanceChart";
import { HarmRadarChart } from "@/components/charts/HarmRadarChart";
import { DimensionBarChart } from "@/components/charts/DimensionBarChart";
import { DimensionHeatmap } from "@/components/charts/DimensionHeatmap";
import { SpeciesismBenchScatter } from "@/components/charts/SpeciesismBenchScatter";
import { AnimalHarmDivergingChart } from "@/components/charts/AnimalHarmDivergingChart";
import { TimelineScatterPlot } from "@/components/charts/TimelineScatterPlot";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
import { studies, availableDates } from "@/data/mock";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(availableDates[0].value);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <header className="mb-10 border-b border-border/40 pb-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground/50 pb-1">
            AI Speciesism Monitor
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Tracking and visualizing bias against non-human entities across leading artificial intelligence models.
          </p>
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-card/50 border border-border/50 mb-8 p-1">
            <TabsTrigger value="dashboard" className="px-8">Dashboard</TabsTrigger>
            <TabsTrigger value="studies" className="px-8">Empirical Studies</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Section 1: Top Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[450px]">
              <BenchmarkBarChart />
              <SpeciesPerformanceChart />
            </div>

            {/* Section 2: Deep Dive */}
            <section className="space-y-6 pt-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-display font-medium">Animal Harm Benchmark 2.0</h2>
                  <p className="text-muted-foreground">Deep dive into the 13 evaluation dimensions</p>
                </div>
                
                <div className="flex items-center gap-2">
                   <span className="text-sm text-muted-foreground mr-2">Historical View:</span>
                   <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="w-[180px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left column: Radar + Bar Chart stacked */}
                <div className="flex flex-col gap-6 lg:w-1/2 shrink-0">
                  <HarmRadarChart selectedDate={selectedDate} />
                  <DimensionBarChart selectedDate={selectedDate} />
                </div>
                {/* Right column: Heatmap - half page width */}
                <div className="lg:w-1/2">
                  <DimensionHeatmap selectedDate={selectedDate} />
                </div>
              </div>
            </section>

            {/* Section 3: SpeciesismBench Scatter Plot */}
            <section className="space-y-4 pt-8">
              <h2 className="text-2xl font-display font-medium">SpeciesismBench</h2>
              <SpeciesismBenchScatter />
            </section>

            {/* Section 4: AnimalHarmBench Diverging Charts */}
            <section className="space-y-6 pt-8">
              <div>
                <h2 className="text-2xl font-display font-medium">AnimalHarmBench 1.0</h2>
                <p className="text-muted-foreground">Risk of animal harm in LLM-generated text across species and models</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimalHarmDivergingChart type="species" />
                <AnimalHarmDivergingChart type="model" />
              </div>
            </section>

            {/* Section 5: Timeline Scatter Plot */}
            <section className="space-y-4 pt-8">
              <h2 className="text-2xl font-display font-medium">Longitudinal Analysis</h2>
              <TimelineScatterPlot />
            </section>
          </TabsContent>

          <TabsContent value="studies" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studies.map((study, idx) => (
                <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-chart-1/50 transition-colors group">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono text-chart-1 bg-chart-1/10 px-2 py-1 rounded">{study.year}</span>
                      <a href={study.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-chart-1 transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-chart-1 transition-colors">{study.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{study.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="link" className="p-0 text-chart-1 hover:text-chart-1/80" asChild>
                      <a href={study.url} target="_blank" rel="noopener noreferrer">View Full Study</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <footer className="pt-12 pb-6 text-center text-sm text-muted-foreground border-t border-border/40 mt-12">
          <p>Data simulated for prototyping purposes.</p>
        </footer>
      </div>
    </div>
  );
}
