import { motion } from "framer-motion";
import { getKnowledgeGraphData } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Tag } from "lucide-react";

export function KnowledgeGraph() {
  const { nodes, links } = getKnowledgeGraphData();

  return (
    <div className="w-full h-[800px] border border-border/50 bg-card/30 backdrop-blur-md rounded-xl relative overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 800 800">
        {/* Draw Links */}
        {links.map((link, idx) => (
          <motion.line
            key={`link-${idx}`}
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            stroke="hsl(var(--chart-1))"
            strokeWidth="1"
            strokeOpacity="0.2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        ))}

        {/* Draw Nodes */}
        {nodes.map((node) => (
          <TooltipProvider key={node.id} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill="hsl(var(--chart-1))"
                    className="drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
                  />
                  <text
                    x={node.x}
                    y={node.y + 25}
                    textAnchor="middle"
                    className="text-[10px] fill-muted-foreground font-mono uppercase tracking-tight"
                  >
                    {node.year}
                  </text>
                </motion.g>
              </TooltipTrigger>
              <TooltipContent side="right" className="p-0 border-none bg-transparent shadow-none w-80">
                <Card className="border-chart-1/50 bg-popover/95 backdrop-blur-xl border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-chart-1 px-1.5 py-0.5 rounded bg-chart-1/10">
                        {node.id.toUpperCase()}
                      </span>
                      <a href={node.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} className="text-muted-foreground hover:text-chart-1 transition-colors" />
                      </a>
                    </div>
                    <h4 className="font-display font-bold text-sm leading-tight">{node.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {node.tags.map((tag: string) => (
                        <div key={tag} className="flex items-center gap-1 text-[9px] text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded-full">
                          <Tag size={8} />
                          {tag}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </svg>
      
      <div className="absolute top-6 left-6 pointer-events-none">
        <h3 className="text-lg font-display font-medium text-foreground">Interactive Taxonomy</h3>
        <p className="text-xs text-muted-foreground mt-1">Hover nodes to explore connections and study details</p>
      </div>
    </div>
  );
}
