
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Pencil, RotateCcw, Download, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeleWhiteboardProps {
    className?: string;
}

export default function TeleWhiteboard({ className }: TeleWhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
    const [color] = useState("#0891b2");

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas resolution
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);

        if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 20;
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
        }

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        let clientX, clientY;
        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = "medical-illustration.png";
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className={cn("flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl", className)}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <PencilLine className="h-4 w-4 text-cyan-500" />
                    Clinical Whiteboard
                </h3>
                <div className="flex items-center gap-2">
                    <Button
                        variant={tool === "pencil" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTool("pencil")}
                        className="h-9 w-9 p-0 rounded-full"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={tool === "eraser" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTool("eraser")}
                        className="h-9 w-9 p-0 rounded-full"
                    >
                        <Eraser className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCanvas}
                        className="h-9 w-9 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadImage}
                        className="h-9 w-9 p-0 rounded-full hover:bg-blue-50 hover:text-blue-500"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="relative flex-1 bg-slate-50/50 cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        </div>
    );
}
