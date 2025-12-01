import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Check, X, Move } from 'lucide-react';

interface ImageEditorProps {
    imageSrc: string;
    onSave: (editedImage: string) => void;
    onCancel: () => void;
}

interface Corner {
    x: number;
    y: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onCancel }) => {
    const [rotation, setRotation] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Corner points for perspective crop (normalized 0-1)
    const [corners, setCorners] = useState<Corner[]>([
        { x: 0.1, y: 0.1 },   // Top-left
        { x: 0.9, y: 0.1 },   // Top-right
        { x: 0.9, y: 0.9 },   // Bottom-right
        { x: 0.1, y: 0.9 },   // Bottom-left
    ]);

    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            imgRef.current = img;
            drawPreview();
        };
    }, [imageSrc]);

    useEffect(() => {
        drawPreview();
    }, [rotation, corners]);

    const drawPreview = () => {
        if (!canvasRef.current || !imgRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = imgRef.current;

        // Set canvas size based on image
        canvas.width = Math.min(img.width, 800);
        canvas.height = (canvas.width / img.width) * img.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Rotate if needed
        if (rotation !== 0) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            ctx.restore();
        } else {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        // Draw corner points and lines
        ctx.strokeStyle = '#3B82F6';
        ctx.fillStyle = '#3B82F6';
        ctx.lineWidth = 2;

        // Draw lines connecting corners
        ctx.beginPath();
        corners.forEach((corner, index) => {
            const x = corner.x * canvas.width;
            const y = corner.y * canvas.height;
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.stroke();

        // Draw corner circles
        corners.forEach(corner => {
            const x = corner.x * canvas.width;
            const y = corner.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Find which corner is being clicked
        const clickRadius = 15 / rect.width; // 15px click radius
        const cornerIndex = corners.findIndex(corner =>
            Math.hypot(corner.x - x, corner.y - y) < clickRadius
        );

        if (cornerIndex !== -1) {
            setDraggingIndex(cornerIndex);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (draggingIndex === null || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        const newCorners = [...corners];
        newCorners[draggingIndex] = { x, y };
        setCorners(newCorners);
    };

    const handleMouseUp = () => {
        setDraggingIndex(null);
    };

    const handleSave = () => {
        if (!canvasRef.current || !previewCanvasRef.current || !imgRef.current) return;

        const outputCanvas = previewCanvasRef.current;
        const ctx = outputCanvas.getContext('2d');
        if (!ctx) return;

        // Set output size
        const outputWidth = 800;
        const outputHeight = 500;
        outputCanvas.width = outputWidth;
        outputCanvas.height = outputHeight;

        const img = imgRef.current;
        const srcCanvas = canvasRef.current;

        // Convert normalized corners to actual pixel coordinates
        const srcCorners = corners.map(c => ({
            x: c.x * srcCanvas.width,
            y: c.y * srcCanvas.height
        }));

        // Apply perspective transform (simplified - using canvas drawImage with perspective)
        // For a full perspective transform, we'd need a more advanced library
        // This is a simplified crop to the bounding box
        const minX = Math.min(...srcCorners.map(c => c.x));
        const maxX = Math.max(...srcCorners.map(c => c.x));
        const minY = Math.min(...srcCorners.map(c => c.y));
        const maxY = Math.max(...srcCorners.map(c => c.y));

        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;

        ctx.drawImage(
            srcCanvas,
            minX, minY, cropWidth, cropHeight,
            0, 0, outputWidth, outputHeight
        );

        const editedImage = outputCanvas.toDataURL('image/jpeg', 0.9);
        onSave(editedImage);
    };

    const rotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold text-white mb-4">Edit ID Card</h3>

                {/* Canvas with corner dragging */}
                <div ref={containerRef} className="bg-slate-900 rounded-xl overflow-hidden mb-4 flex items-center justify-center relative">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="max-w-full max-h-[500px] cursor-crosshair"
                    />
                </div>

                <p className="text-xs text-gray-400 mb-4 flex items-center">
                    <Move size={14} className="mr-1" />
                    Drag the blue corners to adjust the crop area
                </p>

                {/* Hidden canvas for final output */}
                <canvas ref={previewCanvasRef} className="hidden" />

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
                        <span>Save Crop</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
