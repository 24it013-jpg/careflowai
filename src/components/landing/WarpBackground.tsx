
import { useEffect, useRef } from 'react';

export function WarpBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        interface Star {
            x: number;
            y: number;
            z: number;
            prevZ: number;
        }

        const stars: Star[] = [];
        const numStars = 1000;
        const speed = 2; // Speed of the warp
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width,
                prevZ: Math.random() * width,
            });
        }

        const animate = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);

            stars.forEach((star) => {
                star.z -= speed;

                if (star.z <= 0) {
                    star.z = width;
                    star.prevZ = width;
                    star.x = (Math.random() - 0.5) * width;
                    star.y = (Math.random() - 0.5) * height;
                }

                const x = (star.x / star.z) * width + centerX;
                const y = (star.y / star.z) * height + centerY;

                const prevX = (star.x / star.prevZ) * width + centerX;
                const prevY = (star.y / star.prevZ) * height + centerY;

                star.prevZ = star.z;

                // Draw star trail
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - star.z / width})`;
                ctx.lineWidth = 1.5;
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
