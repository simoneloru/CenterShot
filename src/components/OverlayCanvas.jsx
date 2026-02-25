import { useEffect, useRef } from 'react';

function OverlayCanvas({ settings, pixelsPerMm, gridOffset, arrowOffset }) {
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

            // 1. Linea Asse Centrale (Corda) - Gialla
            ctx.beginPath();
            ctx.moveTo(centerX, 0);
            ctx.lineTo(centerX, h);
            ctx.strokeStyle = '#eab308'; // Giallo 500
            ctx.lineWidth = 2;
            ctx.stroke();

            // Conversione diametro freccia in mm
            let diameterMm = settings.diameter;
            if (settings.unit === 'in') {
                diameterMm = settings.diameter * 25.4;
            }

            const offsetDirection = settings.isRH ? -1 : 1;

            // Calcolo posizione ideale del CENTRO della freccia (Linea Verde)
            const outerEdgeDistMm = diameterMm * settings.offsetRatio;
            const arrowCenterDistMm = outerEdgeDistMm - (diameterMm / 2);
            const arrowCenterDistPx = arrowCenterDistMm * pixelsPerMm;

            const idealCenterX = centerX + (arrowCenterDistPx * offsetDirection);

            // 2. Linea Ideale Centershot - Verde
            ctx.beginPath();
            ctx.moveTo(idealCenterX, 0);
            ctx.lineTo(idealCenterX, h);
            ctx.strokeStyle = '#22c55e'; // Verde
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]); // Tratteggiata per indicare il "dovrebbe essere qui"
            ctx.stroke();
            ctx.setLineDash([]);

            // 3. Linea Reale Freccia (Draggabile dall'utente) - Rossa
            const actualArrowX = w / 2 + arrowOffset;
            ctx.beginPath();
            ctx.moveTo(actualArrowX, 0);
            ctx.lineTo(actualArrowX, h);
            ctx.strokeStyle = '#ef4444'; // Rosso
            ctx.lineWidth = 2;
            ctx.stroke();

            // Labels
            ctx.fillStyle = '#eab308';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText('Corda', centerX + 8, h / 2 - 40);

            ctx.fillStyle = '#22c55e';
            ctx.fillText('Ideale', idealCenterX + (settings.isRH ? -45 : 8), h / 2 - 20);

            ctx.fillStyle = '#ef4444';
            ctx.fillText('Freccia', actualArrowX + 8, h / 2);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener('resize', resizeCanvas);
    }, [settings, pixelsPerMm, gridOffset, arrowOffset]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
    );
}

export default OverlayCanvas;
