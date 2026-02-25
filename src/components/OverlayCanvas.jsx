import { useEffect, useRef } from 'react';

// Fattore di conversione da mm a pixel (temporaneo, in futuro sarà legato allo zoom camera)
// 10px per millimetro è un fattore di zoom indicativo molto ravvicinato (ideale per setup arco)
const PIXELS_PER_MM = 10;

function OverlayCanvas({ settings }) {
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

            const centerX = w / 2;

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

            // Calcolo offset
            // Per avere il bordo della freccia perfettamente "fuori" dal filo della corda
            // disegniamo una linea che rappresenta la fine della freccia.
            // Esempio: corda è al centro (0). L'arciere RH deve far uscire la punta a sinistra.
            // Quindi il margine visivo su cui allineare la freccia è a -(Raggio + Extra)

            const arrowRadiusPx = (diameterMm / 2) * PIXELS_PER_MM;
            // Il margine desiderato per il centershot standard è mezza freccia sporgente a sx della corda.
            // Dunque l'asse della freccia si trova al centro, e la parte più esterna è = Raggio * 1.5 o simile.
            // Per semplicità disegneremo l'intero "tubo" della freccia

            const offsetDirection = settings.isRH ? -1 : 1;

            // Posizione Asse Freccia
            const arrowCenterX = centerX + (arrowRadiusPx * offsetDirection);

            // Disegno l'ingombro trasparente della freccia
            ctx.fillStyle = settings.isRH ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'; // Blu per RH, Rosso per LH
            ctx.fillRect(arrowCenterX - arrowRadiusPx, 0, arrowRadiusPx * 2, h);

            // Bordo Esterno Freccia
            ctx.beginPath();
            const outerEdgeX = arrowCenterX + (arrowRadiusPx * offsetDirection);
            ctx.moveTo(outerEdgeX, 0);
            ctx.lineTo(outerEdgeX, h);
            ctx.strokeStyle = settings.isRH ? '#3b82f6' : '#ef4444'; // Colori distinti (Blu/Rosso)
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Label
            ctx.fillStyle = settings.isRH ? '#3b82f6' : '#ef4444';
            ctx.font = '12px sans-serif';
            ctx.fillText(`Margine Freccia (${settings.diameter}${settings.unit})`, outerEdgeX + (settings.isRH ? -140 : 10), h / 2 - 20);

            ctx.fillStyle = '#eab308';
            ctx.fillText('Asse Corda', centerX + 10, h / 2);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Draw initial

        return () => window.removeEventListener('resize', resizeCanvas);
    }, [settings]); // Il canvas si ridisegna se cambiano le settings

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        />
    );
}

export default OverlayCanvas;
