import { useState, useRef, useEffect } from 'react';

function VirtualCaliper({ onConfirm, settings }) {
    // Larghezza iniziale in pixel (un valore ragionevole di partenza)
    const [widthPx, setWidthPx] = useState(100);
    const initialPinchDist = useRef(null);
    const initialWidth = useRef(null);

    // Gestione Pinch-to-Zoom
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialPinchDist.current = dist;
            initialWidth.current = widthPx;
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && initialPinchDist.current) {
            e.preventDefault(); // Previene lo scroll della pagina
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDist = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            const scale = currentDist / initialPinchDist.current;
            // Limita la larghezza per evitare che scompaia o diventi gigantesca
            const newWidth = Math.max(10, Math.min(initialWidth.current * scale, 800));
            setWidthPx(newWidth);
        }
    };

    const handleTouchEnd = () => {
        initialPinchDist.current = null;
    };

    // Conferma l'acquisizione calcolando il rapporto pixel/mm
    const handleConfirm = () => {
        // Se l'utente ha il calibro in pollici, lo convertiamo idealmente in mm o lavoriamo direttamente. 
        // Diametro di riferimento per la scala.
        let val = settings.diameter;
        if (settings.unit === 'in') {
            val = val * 25.4; // Lavoriamo internamente in millimetri per la logica
        }

        // Calcoliamo quanti pixel equivale a 1 millimetro in questa specifica inquadratura
        const pixelsPerMm = widthPx / val;
        onConfirm(pixelsPerMm);
    };

    return (
        <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex-1 w-full flex flex-col items-center justify-center relative">

                {/* Mirino Ottico - Calibro */}
                <div
                    className="relative pb-32 flex justify-between items-stretch"
                    style={{ width: `${widthPx}px`, height: '200px' }}
                >
                    {/* Linea Sinistra */}
                    <div className="w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] h-full relative">
                        <div className="absolute top-0 w-8 h-1 bg-red-500 -left-1"></div>
                        <div className="absolute bottom-0 w-8 h-1 bg-red-500 -left-1"></div>
                    </div>

                    {/* Crosshair centrale */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50">
                        <div className="w-8 h-[1px] bg-red-500 absolute"></div>
                        <div className="w-[1px] h-8 bg-red-500 absolute"></div>
                    </div>

                    {/* Linea Destra */}
                    <div className="w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] h-full relative">
                        <div className="absolute top-0 w-8 h-1 bg-red-500 -right-1"></div>
                        <div className="absolute bottom-0 w-8 h-1 bg-red-500 -right-1"></div>
                    </div>

                    {/* Valore testuale */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-red-500 font-mono font-bold whitespace-nowrap bg-black/50 px-2 py-1 rounded">
                        {settings.diameter} {settings.unit}
                    </div>
                </div>

                {/* Istruzioni in Hover */}
                <div className="absolute top-24 left-4 right-4 text-center pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-sm border border-red-900/50 rounded-xl p-4 shadow-xl inline-block max-w-[90%]">
                        <p className="text-red-400 font-bold text-sm mb-1 uppercase tracking-wider">Fase 1: Calibrazione Scala</p>
                        <p className="text-white text-sm">
                            Usa due dita per <span className="text-red-400 font-bold">allargare/restringere il mirino</span> finché non abbraccia perfettamente
                            lo spessore dell'asta della freccia <span className="underline decoration-red-500">nei pressi della punta</span>.
                        </p>
                    </div>
                </div>

                {/* Slider Fallback per Desktop o touch difficile */}
                <div className="absolute bottom-32 w-full max-w-xs px-6">
                    <input
                        type="range"
                        min="10"
                        max="800"
                        value={widthPx}
                        onChange={(e) => setWidthPx(Number(e.target.value))}
                        className="w-full accent-red-500"
                    />
                </div>

                {/* Tasto Conferma */}
                <div className="absolute bottom-12">
                    <button
                        onClick={handleConfirm}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg border-2 border-red-400/50 uppercase tracking-widest text-sm transition-all active:scale-95"
                    >
                        Imposta Scala
                    </button>
                </div>

            </div>
        </div>
    );
}

export default VirtualCaliper;
