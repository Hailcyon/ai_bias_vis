import { BenchmarkBarChart } from "@/components/charts/BenchmarkBarChart";
import { HarmRadarChart } from "@/components/charts/HarmRadarChart";
import { DimensionBarChart } from "@/components/charts/DimensionBarChart";
import { TimelineScatterPlot } from "@/components/charts/TimelineScatterPlot";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <header className="mb-10 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-chart-1 animate-pulse"></div>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Live Monitoring</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground/50">
            AI Speciesism Monitor
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
            Tracking and visualizing bias against non-human entities across leading artificial intelligence models.
          </p>
        </header>

        {/* Section 1: Main Benchmark Comparison */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-medium">Model Comparison</h2>
          </div>
          <div className="h-[450px]">
            <BenchmarkBarChart />
          </div>
        </section>

        {/* Section 2: Deep Dive (Radar + Horizontal Bar) */}
        <section className="space-y-6 pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-medium">Animal Harm Benchmark 2.0</h2>
              <p className="text-muted-foreground">Deep dive into the 13 evaluation dimensions</p>
            </div>
            
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground mr-2">Historical View:</span>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-[240px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
            <HarmRadarChart />
            <DimensionBarChart />
          </div>
        </section>

        {/* Section 3: Scatter Plot */}
        <section className="space-y-4 pt-8">
          <h2 className="text-2xl font-display font-medium">Longitudinal Analysis</h2>
          <TimelineScatterPlot />
        </section>

        <footer className="pt-12 pb-6 text-center text-sm text-muted-foreground border-t border-border/40 mt-12">
          <p>© 2026 AI Ethics Research Group. Data simulated for prototyping purposes.</p>
        </footer>
      </div>
    </div>
  );
}
