import { useState } from 'react';
import { Settings } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import OverlayCanvas from './components/OverlayCanvas';
import SettingsPanel from './components/SettingsPanel';
import VirtualCaliper from './components/VirtualCaliper';

function App() {
  const [cameraActive, setCameraActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Stato globale delle proporzioni arco
  const [settings, setSettings] = useState({
    isRH: true, // true = Destro, false = Mancino
    diameter: 5.5, // mm di default per freccia outdoor (es. X10 o ACE)
    unit: 'mm',
    offsetRatio: 0.5 // 0.5 = Mezza freccia sporgente
  });

  // Stati per la Calibrazione e Rendering
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [pixelsPerMm, setPixelsPerMm] = useState(null);
  const [gridOffset, setGridOffset] = useState(0);       // Offset Linea Gialla dalla fotocamera
  const [arrowOffset, setArrowOffset] = useState(-50);   // Offset Linea Rossa dal centro schermo (inizializzata a lato per visibilità)

  // Variabili per il Dragging del Reticolo e della Freccia
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState(null); // 'grid' o 'arrow'
  const [startX, setStartX] = useState(0);

  const handleDragStart = (e) => {
    if (isCalibrating || !capturedPhoto) return;

    setIsDragging(true);
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const screenCenter = window.innerWidth / 2;

    const distToGrid = Math.abs(clientX - (screenCenter + gridOffset));
    const distToArrow = Math.abs(clientX - (screenCenter + arrowOffset));

    // Selettore intelligente dell'elemento da trascinare in base a dove l'utente poggia il dito
    if (distToArrow < 50 && distToArrow < distToGrid) {
      setDragTarget('arrow');
      setStartX(clientX - arrowOffset);
    } else {
      setDragTarget('grid');
      setStartX(clientX - gridOffset);
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging || isCalibrating || !capturedPhoto) return;
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;

    if (dragTarget === 'arrow') {
      setArrowOffset(clientX - startX);
    } else {
      setGridOffset(clientX - startX);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setIsCalibrating(true);
    setGridOffset(0);
    setArrowOffset(-50);
  };

  // -------------------------------------------------------------------------------- //
  //  CALCOLATORE GIRI BOTTONE (Basato su Filetto Standard Ottico 5/16"-24)
  // -------------------------------------------------------------------------------- //
  let tuningDiagnostics = null;
  if (capturedPhoto && !isCalibrating && pixelsPerMm) {
    // 1. Convertiamo in millimetri reali il tuning che ci aspettavamo (Linea Verde Ideale)
    let diameterMm = settings.diameter;
    if (settings.unit === 'in') diameterMm *= 25.4;

    const offsetDirection = settings.isRH ? -1 : 1;
    const outerEdgeDistMm = diameterMm * settings.offsetRatio;
    const arrowCenterDistMm = outerEdgeDistMm - (diameterMm / 2);
    const idealOffsetMm = arrowCenterDistMm * offsetDirection; // Posizione ideale rispetto alla corda in mm

    // 2. Misuriamo la Linea Rossa rispetto alla Linea Gialla in pixel e convertiamola
    const actualOffsetMm = (arrowOffset - gridOffset) / pixelsPerMm;

    // 3. Calcoliamo l'Errore
    const diffMm = actualOffsetMm - idealOffsetMm;
    const turns = Math.abs(diffMm / 1.058).toFixed(1); // 1.058mm a Giro

    if (Math.abs(diffMm) < 0.2) {
      tuningDiagnostics = <span className="text-green-500 font-bold border border-green-500/50 bg-green-500/10 px-3 py-1 rounded-md">Centershot Perfetto! 🎯</span>;
    } else {
      let action = "";
      if (settings.isRH) {
        action = diffMm > 0 ? "Avvita" : "Svita";
      } else {
        action = diffMm > 0 ? "Svita" : "Avvita";
      }
      tuningDiagnostics = (
        <span>
          <span className="text-red-400 font-bold uppercase tracking-widest block text-xs mb-1">TUNING CONIGLIATO:</span>
          <span className="text-white font-bold">{action} il bottone di {turns} giri</span>
          <span className="text-zinc-400 text-xs ml-2">({Math.abs(diffMm).toFixed(2)} mm)</span>
        </span>
      );
    }
  }
  // -------------------------------------------------------------------------------- //

  return (
    <div className="relative h-full w-full bg-black flex flex-col font-sans">
      {/* Header / Top Bar */}
      <header className="absolute top-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
        <h1 className="text-yellow-500 font-bold text-xl tracking-wider">CENTER<span className="text-white">SHOT</span></h1>

        <div className="flex gap-3 items-center">
          <button
            className="p-2 bg-zinc-800/80 backdrop-blur text-white rounded-full border border-zinc-700 hover:bg-zinc-700 transition"
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Impostazioni"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            className={`backdrop-blur px-4 py-2 rounded-full text-sm font-medium border transition ${cameraActive
              ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30'
              : 'bg-zinc-800/80 text-white border-zinc-700 hover:bg-zinc-700'
              }`}
            onClick={() => setCameraActive(!cameraActive)}
          >
            {cameraActive ? 'Ferma Video' : 'Avvia Video'}
          </button>
        </div>
      </header>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Main Content Area */}
      <main
        className="flex-1 relative w-full h-full overflow-hidden touch-none"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {cameraActive ? (
          <>
            {!capturedPhoto ? (
              <CameraFeed onCapture={setCapturedPhoto} />
            ) : (
              // Contenitore Foto Statica
              <div className="absolute inset-0 w-full h-full bg-black">
                <img src={capturedPhoto} alt="Riferimento" className="w-full h-full object-cover" />
              </div>
            )}

            {(capturedPhoto && isCalibrating) && (
              <VirtualCaliper
                settings={settings}
                onConfirm={(pxPerMm) => {
                  setPixelsPerMm(pxPerMm);
                  setIsCalibrating(false);
                }}
              />
            )}

            {(capturedPhoto && !isCalibrating) && (
              <>
                <OverlayCanvas
                  settings={settings}
                  pixelsPerMm={pixelsPerMm}
                  gridOffset={gridOffset}
                  arrowOffset={arrowOffset}
                />

                {/* Istruzioni in Overlay - Fase 3 Target Statica */}
                <div className="absolute top-20 left-4 right-4 z-20 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-4 shadow-xl">
                    <p className="text-yellow-500 font-bold text-sm mb-1 uppercase tracking-wider">Step 1: Corda</p>
                    <p className="text-zinc-300 text-sm mb-3">Allinea la <span className="font-bold text-yellow-500">Linea Gialla</span> a quella dell'arco.</p>

                    <p className="text-red-400 font-bold text-sm mb-1 uppercase tracking-wider">Step 2: Freccia</p>
                    <p className="text-zinc-300 text-sm mb-3">Sposta la <span className="font-bold text-red-500">Linea Rossa</span> al centro della tua freccia.</p>

                    <div className="mt-3 pt-3 border-t border-zinc-700/50 text-center">
                      {tuningDiagnostics}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Comandi Floating su foto statica */}
            {capturedPhoto && (
              <div className="absolute bottom-12 w-full flex justify-center gap-4 z-20 pointer-events-auto px-4">
                {!isCalibrating && (
                  <button
                    onClick={() => { setIsCalibrating(true); setGridOffset(0); }}
                    className="flex-1 bg-zinc-800/80 backdrop-blur hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-full border border-zinc-600 shadow-lg text-sm transition-all"
                  >
                    Ricalibra Scala
                  </button>
                )}
                <button
                  onClick={retakePhoto}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-full shadow-lg text-sm transition-all"
                >
                  Nuova Foto 📸
                </button>
              </div>
            )}

          </>) : (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center text-zinc-400">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <p className="max-w-xs">Tocca "Start Camera" per iniziare il setup del centershot.</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
