import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Check, X } from 'lucide-react';

interface ImageEditorProps {
    imageSrc: string;
    onSave: (editedImage: string) => void;
    onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onCancel }) => {
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imgRef.current = img;
            drawImage();
        };
    }, [imageSrc]);

    useEffect(() => {
        drawImage();
    }, [rotation, zoom]);

    const drawImage = () => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imgRef.current;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Move to center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply zoom
        const scaledWidth = img.width * zoom;
        const scaledHeight = img.height * zoom;

        // Draw image centered
        ctx.drawImage(img, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

        // Restore context
        ctx.restore();
    };

    const handleSave = () => {
        if (!canvasRef.current) return;
        const editedImage = canvasRef.current.toDataURL('image/jpeg', 0.9);
        onSave(editedImage);
    };

    const rotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-bold text-white mb-4">Edit ID Card</h3>

                {/* Canvas */}
                <div className="bg-slate-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center" style={{ height: '400px' }}>
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="max-w-full max-h-full"
                    />
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    {/* Rotation */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Rotate</span>
                        <button
                            onClick={rotate}
                            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                        >
                            <RotateCw size={16} />
                            <span>90°</span>
                        </button>
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Zoom</span>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-48"
                        />
                        <span className="text-sm text-gray-400">{Math.round(zoom * 100)}%</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600"
                    >
                        <X size={18} />
                        <span>Cancel</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700"
                    >
                        <Check size={18} />
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
