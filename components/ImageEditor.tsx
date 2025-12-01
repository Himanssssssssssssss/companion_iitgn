import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Check, X } from 'lucide-react';

interface ImageEditorProps {
    imageSrc: string;
    onSave: (editedImage: string) => void;
    onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onCancel }) => {
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imgRef.current = img;
            drawCanvas();
        };
        img.src = imageSrc;
    }, [imageSrc]);

    useEffect(() => {
        drawCanvas();
    }, [rotation]);

    const drawCanvas = () => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imgRef.current;

        // Simple canvas sizing
        const maxSize = 800;
        canvas.width = Math.min(img.width, maxSize);
        canvas.height = Math.min(img.height, maxSize);

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (rotation === 0) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
            // Rotate
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            ctx.restore();
        }
    };

    const handleSave = () => {
        if (!canvasRef.current) return;
        const editedImage = canvasRef.current.toDataURL('image/png');
        onSave(editedImage);
    };

    const rotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-3xl w-full">
                <h3 className="text-lg font-bold text-white mb-4">Adjust ID Card</h3>

                {/* Canvas */}
                <div className="bg-slate-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center" style={{ height: '400px' }}>
                    <canvas ref={canvasRef} className="max-w-full max-h-full" />
                </div>

                {/* Rotate Button */}
                <div className="mb-6">
                    <button
                        onClick={rotate}
                        className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700"
                    >
                        <RotateCw size={18} />
                        <span>Rotate 90°</span>
                    </button>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
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
