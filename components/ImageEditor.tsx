import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Check, X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageEditorProps {
    imageSrc: string;
    onSave: (editedImage: string) => void;
    onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onCancel }) => {
    const [rotation, setRotation] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
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
    }, [rotation, scale, position]);

    const drawCanvas = () => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imgRef.current;

        // Set canvas size
        const maxWidth = 800;
        const maxHeight = 600;
        const aspectRatio = img.width / img.height;

        let canvasWidth = maxWidth;
        let canvasHeight = maxWidth / aspectRatio;

        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Clear canvas
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Save context
        ctx.save();

        // Translate to center
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply scale and position
        ctx.translate(position.x, position.y);
        ctx.scale(scale, scale);

        // Draw image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

        // Restore context
        ctx.restore();

        // Draw crop overlay (centered rectangle)
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 3;
        const cropWidth = canvas.width * 0.8;
        const cropHeight = canvas.height * 0.8;
        const cropX = (canvas.width - cropWidth) / 2;
        const cropY = (canvas.height - cropHeight) / 2;
        ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

        // Draw corner handles
        const handleSize = 20;
        const corners = [
            [cropX, cropY],
            [cropX + cropWidth, cropY],
            [cropX + cropWidth, cropY + cropHeight],
            [cropX, cropY + cropHeight]
        ];

        ctx.fillStyle = '#3B82F6';
        corners.forEach(([x, y]) => {
            ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSave = () => {
        if (!canvasRef.current || !outputCanvasRef.current || !imgRef.current) return;

        const outputCanvas = outputCanvasRef.current;
        const ctx = outputCanvas.getContext('2d');
        if (!ctx) return;

        const img = imgRef.current;

        // Output at original image resolution (no quality loss)
        const outputWidth = img.width;
        const outputHeight = img.height;
        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;

        // Clear
        ctx.clearRect(0, 0, outputWidth, outputHeight);

        // Save context
        ctx.save();

        // Translate to center
        ctx.translate(outputWidth / 2, outputHeight / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply scale and normalized position
        const normalizedX = position.x * (outputWidth / (canvasRef.current?.width || 1));
        const normalizedY = position.y * (outputHeight / (canvasRef.current?.height || 1));
        ctx.translate(normalizedX, normalizedY);
        ctx.scale(scale, scale);

        // Draw image at full resolution
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

        // Restore
        ctx.restore();

        // Save as PNG (lossless) or high-quality JPEG
        const editedImage = outputCanvas.toDataURL('image/png'); // PNG for no compression
        onSave(editedImage);
    };

    const rotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(prev + 0.1, 3));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.5));
    };

    const resetView = () => {
        setRotation(0);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-5xl w-full max-h-[95vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-4">Crop & Adjust ID Card</h3>

                {/* Canvas Container */}
                <div
                    ref={containerRef}
                    className="bg-slate-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center relative cursor-move"
                    style={{ minHeight: '500px' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-[600px]"
                    />
                </div>

                <p className="text-sm text-gray-400 mb-6">
                    💡 <strong>Drag</strong> to move • <strong>Zoom</strong> to adjust size • <strong>Rotate</strong> as needed
                </p>

                {/* Hidden output canvas */}
                <canvas ref={outputCanvasRef} className="hidden" />

                {/* Controls */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button
                        onClick={rotate}
                        className="flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition"
                    >
                        <RotateCw size={18} />
                        <span>Rotate</span>
                    </button>

                    <button
                        onClick={zoomIn}
                        className="flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition"
                    >
                        <ZoomIn size={18} />
                        <span>Zoom In</span>
                    </button>

                    <button
                        onClick={zoomOut}
                        className="flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition"
                    >
                        <ZoomOut size={18} />
                        <span>Zoom Out</span>
                    </button>

                    <button
                        onClick={resetView}
                        className="flex items-center justify-center space-x-2 bg-slate-700 text-white px-4 py-3 rounded-lg hover:bg-slate-600 transition"
                    >
                        <span>Reset</span>
                    </button>
                </div>

                {/* Scale Display */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Zoom Level</span>
                        <span className="text-sm text-primary-400 font-mono">{Math.round(scale * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 text-white px-6 py-4 rounded-lg hover:bg-slate-600 transition font-semibold"
                    >
                        <X size={20} />
                        <span>Cancel</span>
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                        <Check size={20} />
                        <span>Save (No Compression)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
