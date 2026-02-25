import { useEffect, useRef, useState } from 'react';

function CameraFeed({ onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let stream = null;

        async function startCamera() {
            try {
                // Richiedi preferibilmente la fotocamera posteriore
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Errore accesso fotocamera:", err);
                setError("Impossibile accedere alla fotocamera. Assicurati di aver concesso i permessi.");
            }
        }

        startCamera();

        // Cleanup: spegni la fotocamera quando il componente viene smontato
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            // Impostiamo la risoluzione nativa del video sul canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Esportiamo la foto in base64 ad alta qualità
            const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            onCapture(photoDataUrl);
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
            {error ? (
                <div className="text-red-500 bg-red-950/50 p-4 rounded text-center border border-red-800">
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />

                    {/* Canvas Nascosto per la cattura immagine */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Linea Gialla di Allineamento (Mirino Pre-scatto) */}
                    <div className="absolute pointer-events-none inset-y-0 w-0.5 bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.8)] left-1/2 -translate-x-1/2"></div>

                    {/* Istruzioni e Pulsante di Scatto */}
                    <div className="absolute top-20 left-4 right-4 text-center pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-sm border border-yellow-900/50 rounded-xl p-4 shadow-xl inline-block max-w-[90%]">
                            <p className="text-yellow-400 font-bold text-sm mb-1 uppercase tracking-wider">Allineamento Corda</p>
                            <p className="text-white text-sm">
                                Fai combaciare la <span className="font-bold text-yellow-500">Linea Gialla</span> con la corda del tuo arco.
                                Tieniti ben fermo e scatta la foto.
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-12 w-full flex justify-center pb-4">
                        <button
                            onClick={takePhoto}
                            className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-4 border-white/50 hover:bg-white/30 transition-all active:scale-90"
                        >
                            <div className="w-14 h-14 bg-white rounded-full shadow-lg"></div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CameraFeed;
