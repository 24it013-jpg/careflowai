import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from 'next-themes';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';


interface InteractionGraphProps {
    medications: Array<{ id: string; name: string }>;
    interactions: Array<{
        drug1: string;
        drug2: string;
        severity: 'minor' | 'moderate' | 'severe';
        description?: string;
    }>;
    onNodeClick?: (node: any) => void;
}

export function InteractionGraph({ medications, interactions, onNodeClick }: InteractionGraphProps) {
    const graphRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: isFullscreen ? window.innerHeight - 100 : 400
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, [isFullscreen]);

    // Graph Data Preparation
    const nodes = medications.map(med => ({
        id: med.name,
        name: med.name,
        val: 1 // Size base
    }));

    const links = interactions.map(interaction => ({
        source: interaction.drug1,
        target: interaction.drug2,
        severity: interaction.severity,
        description: interaction.description
    }));

    // Highlighting logic
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());


    const handleNodeHover = (node: any) => {

        const newHighlightNodes = new Set();
        const newHighlightLinks = new Set();

        if (node) {
            newHighlightNodes.add(node.id);
            links.forEach((link: any) => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                if (sourceId === node.id || targetId === node.id) {
                    newHighlightLinks.add(link);
                    newHighlightNodes.add(sourceId === node.id ? targetId : sourceId);
                }
            });
        }


        setHighlightNodes(newHighlightNodes);
        setHighlightLinks(newHighlightLinks);
    };

    const getNodeColor = (node: any) => {
        if (highlightNodes.has(node.id)) return theme === 'dark' ? '#2dd4bf' : '#0d9488'; // Teal
        return theme === 'dark' ? '#94a3b8' : '#64748b'; // Slate
    };

    const getLinkColor = (link: any) => {
        if (highlightLinks.has(link)) {
            switch (link.severity) {
                case 'severe': return '#ef4444';
                case 'moderate': return '#f59e0b';
                case 'minor': return '#eab308';
                default: return '#cbd5e1';
            }
        }
        return theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.2)';
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        // Timeout to allow container to resize before graph updates
        setTimeout(() => {
            if (graphRef.current) {
                graphRef.current.zoomToFit(400);
            }
        }, 100);
    };

    const handleZoomIn = () => {
        if (graphRef.current) {
            graphRef.current.zoom(graphRef.current.zoom() * 1.2, 400);
        }
    };

    const handleZoomOut = () => {
        if (graphRef.current) {
            graphRef.current.zoom(graphRef.current.zoom() / 1.2, 400);
        }
    };

    const handleReset = () => {
        if (graphRef.current) {
            graphRef.current.zoomToFit(400);
        }
    };

    return (
        <Card className={`relative overflow-hidden bg-slate-50 border-slate-200 ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : ''}`} ref={containerRef}>
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Button variant="outline" size="icon" onClick={toggleFullscreen} className="bg-white hover:bg-slate-100 shadow-sm">
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn} className="bg-white hover:bg-slate-100 shadow-sm">
                    <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut} className="bg-white hover:bg-slate-100 shadow-sm">
                    <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleReset} className="bg-white hover:bg-slate-100 shadow-sm">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-2">
                <div className="font-semibold text-slate-700 mb-1">Interaction Severity</div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-600">Severe</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-slate-600">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-600">Minor</span>
                </div>
            </div>

            <ForceGraph2D
                ref={graphRef}
                width={dimensions.width}
                height={dimensions.height}
                graphData={{ nodes, links }}
                nodeLabel="name"
                nodeColor={getNodeColor}
                nodeRelSize={6}
                linkColor={getLinkColor}
                linkWidth={(link: any) => highlightLinks.has(link) ? 3 : 1}
                linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 4 : 0}
                linkDirectionalParticleWidth={2}
                onNodeHover={handleNodeHover}
                onNodeClick={onNodeClick}
                enableNodeDrag={false}
                backgroundColor={theme === 'dark' ? '#0f172a' : '#f8fafc'} // slate-900 : slate-50
            />

            {isFullscreen && (
                <div className="absolute inset-0 -z-10 bg-slate-900/50 backdrop-blur-sm" />
            )}
        </Card>
    );
}
