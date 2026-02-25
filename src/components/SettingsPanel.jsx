import { useState } from 'react';
import { X, Ruler } from 'lucide-react';

function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                        <Ruler className="w-5 h-5 text-yellow-500" />
                        Impostazioni Setup
                    </h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Mano Arciere */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Mano (Arciere)</label>
                        <div className="flex bg-zinc-800 rounded-lg p-1">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${settings.isRH ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                                onClick={() => onSettingsChange({ ...settings, isRH: true })}
                            >
                                Destro (RH)
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${!settings.isRH ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                                onClick={() => onSettingsChange({ ...settings, isRH: false })}
                            >
                                Mancino (LH)
                            </button>
                        </div>
                    </div>

                    {/* Unità di misura */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Unità di Misura</label>
                        <div className="flex bg-zinc-800 rounded-lg p-1">
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${settings.unit === 'mm' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                                onClick={() => onSettingsChange({ ...settings, unit: 'mm' })}
                            >
                                Millimetri (mm)
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${settings.unit === 'in' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                                onClick={() => onSettingsChange({ ...settings, unit: 'in' })}
                            >
                                Pollici (in)
                            </button>
                        </div>
                    </div>

                    {/* Calibro Freccia */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Diametro Freccia</label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.01"
                                min="0.1"
                                className="w-full bg-zinc-800 border-none rounded-lg py-3 px-4 text-white text-lg focus:ring-2 focus:ring-yellow-500 placeholder-zinc-500"
                                value={settings.diameter}
                                onChange={(e) => onSettingsChange({ ...settings, diameter: parseFloat(e.target.value) || 0 })}
                                placeholder={settings.unit === 'mm' ? "es. 5.5" : "es. 0.216"}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
                                {settings.unit}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                            L'app calcolerà in automatico lo scostamento perfetto affinché la punta sporga correttamente rispetto alla corda.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg shadow-lg mt-4 transition-colors"
                    >
                        Salva e Applica
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;
