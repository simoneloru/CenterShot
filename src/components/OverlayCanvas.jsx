import { useEffect, useRef } from 'react';

function OverlayCanvas({ settings, pixelsPerMm, gridOffset }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Assicura che il canvas combaci con la risoluzione dello schermo reale anche sui display retina
        const resizeCanvas = () => {
            // Imposta le vere dimensioni fisiche
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;

            // Mantiene la dimensione CSS a 100%
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            // Resetta la scala del contesto
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            drawOverlay(ctx, window.innerWidth, window.innerHeight);
        };

        const drawOverlay = (ctx, w, h) => {
            ctx.clearRect(0, 0, w, h);

            const centerX = w / 2 + gridOffset; // L'intera griglia può essere 'trascinata'

            // 1. Linea Asse Centrale (Corda)
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, h);
            ctx.strokeStyle = '#eab308'; // Giallo 500 (Tailwind)
            ctx.lineWidth = 2;
            ctx.stroke();

            // Conversione diametro freccia da pollici a mm (se necessario)
            let diameterMm = settings.diameter;
            if (settings.unit === 'in') {
                diameterMm = settings.diameter * 25.4;
            }

            const offsetDirection = settings.isRH ? -1 : 1; // -1 = Sinistra, 1 = Destra

            // Calcolo posizioni matematiche in base alla calibrazione e all'offsetRatio
            // offsetRatio 0.5 = asse freccia sulla corda (mezza fuori)
            // offsetRatio 0.0 = filo corda (bordo esterno freccia allineato alla corda)
            const arrowRadiusPx = (diameterMm / 2) * pixelsPerMm;

            const outerEdgeDistMm = diameterMm * settings.offsetRatio;
            const arrowCenterDistMm = outerEdgeDistMm - (diameterMm / 2);

            const arrowCenterDistPx = arrowCenterDistMm * pixelsPerMm;
            const arrowCenterX = centerX + (arrowCenterDistPx * offsetDirection);

            // Disegno l'ingombro trasparente della freccia
            ctx.fillStyle = 'rgba(34, 197, 94, 0.3)'; // Verde (Tailwind green-500)
            ctx.fillRect(arrowCenterX - arrowRadiusPx, 0, arrowRadiusPx * 2, h);

            // Bordo Esterno Freccia
            ctx.beginPath();
            const outerEdgeX = arrowCenterX + (arrowRadiusPx * offsetDirection);
            ctx.moveTo(outerEdgeX, 0);
            ctx.lineTo(outerEdgeX, h);
            ctx.strokeStyle = '#22c55e'; // Verde
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Label
            ctx.fillStyle = '#22c55e';
            ctx.font = '12px sans-serif';
            ctx.fillText(`Target Freccia`, outerEdgeX + (settings.isRH ? -85 : 10), h / 2 - 20);

            ctx.fillStyle = '#eab308';
            ctx.fillText('Corda', centerX + 10, h / 2);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Draw initial

        return () => window.removeEventListener('resize', resizeCanvas);
    }, [settings, pixelsPerMm, gridOffset]); // Ridisegna se cambiano impostazioni, scala o drag offset

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
    );
}

export default OverlayCanvas;
