import { useState } from 'react';
import { Settings } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import OverlayCanvas from './components/OverlayCanvas';
import SettingsPanel from './components/SettingsPanel';

function App() {
  const [cameraActive, setCameraActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Stato globale delle proporzioni arco
  const [settings, setSettings] = useState({
    isRH: true, // true = Destro, false = Mancino
    diameter: 5.5, // mm di default per freccia outdoor (es. X10 o ACE)
    unit: 'mm'
  });

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
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {cameraActive ? (
          <>
            <CameraFeed />
            <OverlayCanvas settings={settings} />
          </>
        ) : (
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
