import { useEffect, useRef, useState } from 'react';

function CameraFeed() {
    const videoRef = useRef(null);
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

    return (
        <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
            {error ? (
                <div className="text-red-500 bg-red-950/50 p-4 rounded text-center border border-red-800">
                    <p>{error}</p>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
}

export default CameraFeed;
