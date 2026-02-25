import { useState, useRef, useEffect } from 'react';

function VirtualCaliper({ onConfirm, settings }) {
    // Larghezza iniziale in pixel e offset dal centro
    const [widthPx, setWidthPx] = useState(100);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const initialPinchDist = useRef(null);
    const initialWidth = useRef(null);
    const lastTouch = useRef(null); // Per il drag

    // Gestione Touch (1 dito = Drag, 2 dita = Pinch)
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            initialPinchDist.current = null;
        } else if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialPinchDist.current = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialWidth.current = widthPx;
            lastTouch.current = null;
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 1 && lastTouch.current) {
            e.preventDefault(); // Previene scroll
            const clientX = e.touches[0].clientX;
            const clientY = e.touches[0].clientY;
            const dx = clientX - lastTouch.current.x;
            const dy = clientY - lastTouch.current.y;

            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            lastTouch.current = { x: clientX, y: clientY };

        } else if (e.touches.length === 2 && initialPinchDist.current) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDist = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            const scale = currentDist / initialPinchDist.current;
            const newWidth = Math.max(10, Math.min(initialWidth.current * scale, 800));
            setWidthPx(newWidth);
        }
    };

    const handleTouchEnd = () => {
        initialPinchDist.current = null;
        lastTouch.current = null;
    };

    // Supporto Drag con Mouse
    const handleMouseDown = (e) => {
        lastTouch.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (lastTouch.current && e.buttons === 1) {
            e.preventDefault(); // Previene selezioni
            const dx = e.clientX - lastTouch.current.x;
            const dy = e.clientY - lastTouch.current.y;
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            lastTouch.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        lastTouch.current = null;
    };


    // Conferma l'acquisizione calcolando il rapporto pixel/mm
    const handleConfirm = () => {
        let val = settings.diameter;
        if (settings.unit === 'in') {
            val = val * 25.4; // Internalizza in mm
        }

        const pixelsPerMm = widthPx / val;
        onConfirm(pixelsPerMm);
    };

    return (
        <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="flex-1 w-full flex flex-col items-center justify-center relative">

                {/* Mirino Ottico - Calibro (Ora posizionato con transform offset) */}
                <div
                    className="relative pb-32 flex justify-between items-stretch transition-none"
                    style={{
                        width: `${widthPx}px`,
                        height: '200px',
                        transform: `translate(${offset.x}px, ${offset.y}px)`
                    }}
                >
                    {/* Linea Sinistra */}
                    <div className="w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] h-full relative cursor-move">
                        <div className="absolute top-0 w-8 h-1 bg-red-500 -left-1"></div>
                        <div className="absolute bottom-0 w-8 h-1 bg-red-500 -left-1"></div>
                    </div>

                    {/* Crosshair centrale */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50 pointer-events-none">
                        <div className="w-8 h-[1px] bg-red-500 absolute"></div>
                        <div className="w-[1px] h-8 bg-red-500 absolute"></div>
                    </div>

                    {/* Linea Destra */}
                    <div className="w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] h-full relative cursor-move">
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
                        <p className="text-red-400 font-bold text-sm mb-1 uppercase tracking-wider">Passo 1: Scala</p>
                        <p className="text-white text-sm">
                            <span className="font-bold text-red-400">Trascina questo mirino</span> con 1 dito sopra la freccia fotografata.<br />
                            Usa <span className="font-bold text-red-400">2 dita o lo slider</span> per farlo combaciare col suo spessore.
                        </p>
                    </div>
                </div>

                {/* Slider Fallback per Desktop o touch difficile (Z-index alto per fermare il pan sotto di esso) */}
                <div
                    className="absolute bottom-32 w-full max-w-xs px-6 z-40"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
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
                <div className="absolute bottom-12 z-40">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleConfirm(); }}
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
