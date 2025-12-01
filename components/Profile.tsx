import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AppSettings, WidgetType } from '../types';
import { Camera, Upload, LogOut, ArrowUp, ArrowDown, Loader2, Eye, EyeOff, QrCode } from 'lucide-react';
import { supabase, updateProfileImages } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import imageCompression from 'browser-image-compression';
import jsQR from 'jsqr';

interface ProfileProps {
    user: UserProfile;
    settings: AppSettings;
    onUpdateUser: (user: UserProfile) => void;
    onUpdateSettings: (settings: AppSettings) => void;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, settings, onUpdateUser, onUpdateSettings, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'ID' | 'SETTINGS'>('ID');
    const [uploading, setUploading] = useState(false);
    const [uploadingQR, setUploadingQR] = useState(false);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);

    const idImageInputRef = useRef<HTMLInputElement>(null);
    const qrImageInputRef = useRef<HTMLInputElement>(null);

    // Load QR code data on mount
    useEffect(() => {
        const loadQRCode = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('qr_code_url')
                    .eq('id', authUser.id)
                    .single();

                if (profile?.qr_code_url) {
                    setQrCodeData(profile.qr_code_url); // This is now QR data, not URL
                }
            }
        };
        loadQRCode();
    }, []);

    const compressImage = async (file: File, maxSizeKB: number = 200): Promise<File> => {
        const options = {
            maxSizeMB: maxSizeKB / 1024, // Convert KB to MB
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            fileType: 'image/jpeg'
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error('Compression error:', error);
            return file;
        }
    };

    const extractQRCode = async (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        resolve(null);
                        return;
                    }

                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        resolve(code.data);
                    } else {
                        resolve(null);
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleIdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                alert('Please sign in to upload your ID card');
                setUploading(false);
                return;
            }

            // Compress image to under 200KB
            const compressedFile = await compressImage(file, 200);
            console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB, Compressed: ${(compressedFile.size / 1024).toFixed(2)}KB`);

            // Upload to Supabase Storage
            const fileExt = 'jpg'; // Always use JPG after compression
            const fileName = `${authUser.id}/id-card.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('id-cards')
                .upload(fileName, compressedFile, {
                    upsert: true,
                    cacheControl: '3600',
                    contentType: 'image/jpeg'
                });

            if (uploadError) {
                alert('Failed to upload ID card. Please try again.');
                console.error(uploadError);
                setUploading(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('id-cards')
                .getPublicUrl(fileName);

            // Update profile in database
            await updateProfileImages(authUser.id, publicUrl, undefined);

            // Update local state
            onUpdateUser({ ...user, photoUrl: publicUrl });
            alert('ID card uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading ID card');
        } finally {
            setUploading(false);
        }
    };

    const handleQRCodeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingQR(true);
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                alert('Please sign in to upload your QR code');
                setUploadingQR(false);
                return;
            }

            // Extract QR code data from image
            const qrData = await extractQRCode(file);

            if (!qrData) {
                alert('Could not read QR code from image. Please try a clearer photo.');
                setUploadingQR(false);
                return;
            }

            console.log('Extracted QR data:', qrData);

            // Save QR data (not image) to database
            const { error } = await supabase
                .from('profiles')
                .update({ qr_code_url: qrData }) // Store the QR data itself
                .eq('id', authUser.id);

            if (error) {
                alert('Failed to save QR code. Please try again.');
                console.error(error);
                setUploadingQR(false);
                return;
            }

            // Update local state
            setQrCodeData(qrData);
            alert('QR code extracted and saved successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error processing QR code');
        } finally {
            setUploadingQR(false);
        }
    };

    const moveWidget = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...settings.homeWidgetsOrder];
        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }
        onUpdateSettings({ ...settings, homeWidgetsOrder: newOrder });
    };

    const getWidgetLabel = (type: WidgetType) => {
        switch (type) {
            case 'ID_CARD': return 'Digital ID Card';
            case 'NEXT_MEAL': return 'Next Meal Info';
            case 'CHECKLIST': return 'My Checklist';
            default: return type;
        }
    };

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">{user.name}</h1>
                    <p className="text-gray-400 text-sm">{user.id}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-800/50 p-1 rounded-xl flex relative">
                {['ID', 'SETTINGS'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        {tab === 'ID' ? 'ID CARD' : tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'ID' && (
                    <div className="space-y-4">
                        {/* ID Card Upload */}
                        <div className="glass p-4 rounded-2xl">
                            <h3 className="text-sm font-bold text-white mb-3">Physical ID Card</h3>
                            <div className="border border-white/10 rounded-2xl aspect-[1.586/1] relative group overflow-hidden flex items-center justify-center bg-black/40">
                                {user.photoUrl ? (
                                    <img src={user.photoUrl} alt="ID Card" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Upload className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-400 text-sm">Upload your physical ID card</p>
                                        <p className="text-gray-500 text-xs mt-2">Max 200KB, auto-compressed</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => idImageInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                >
                                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                                </button>
                                <input type="file" ref={idImageInputRef} className="hidden" accept="image/*" onChange={handleIdImageUpload} />
                            </div>
                        </div>

                        {/* QR Code Upload */}
                        <div className="glass p-4 rounded-2xl">
                            <h3 className="text-sm font-bold text-white mb-3">Mess QR Code</h3>
                            <div className="border border-white/10 rounded-2xl aspect-square relative group overflow-hidden flex items-center justify-center bg-white p-4">
                                {qrCodeData ? (
                                    <QRCodeSVG value={qrCodeData} size={200} level="H" />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <QrCode className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-400 text-sm">Upload your mess QR code</p>
                                        <p className="text-gray-500 text-xs mt-2">We'll extract and save the QR data</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => qrImageInputRef.current?.click()}
                                    disabled={uploadingQR}
                                    className="absolute bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                >
                                    {uploadingQR ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                                </button>
                                <input type="file" ref={qrImageInputRef} className="hidden" accept="image/*" onChange={handleQRCodeUpload} />
                            </div>
                        </div>

                        <div className="glass p-4 rounded-xl flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">Show ID on Home Screen</span>
                            <button
                                onClick={() => onUpdateSettings({ ...settings, showIdOnHome: !settings.showIdOnHome })}
                                className={`p-2 rounded-lg transition-colors ${settings.showIdOnHome ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-gray-500'}`}
                            >
                                {settings.showIdOnHome ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">ID compressed to \u003c200KB. QR data extracted and saved.</p>
                    </div>
                )}

                {activeTab === 'SETTINGS' && (
                    <div className="space-y-6">
                        <div className="glass p-5 rounded-2xl">
                            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Reorder Home Widgets</h2>
                            <div className="space-y-2">
                                {settings.homeWidgetsOrder.map((widget, index) => (
                                    <div key={widget} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                                        <span className="text-sm font-medium text-gray-200">{getWidgetLabel(widget)}</span>
                                        <div className="flex space-x-1">
                                            <button
                                                disabled={index === 0}
                                                onClick={() => moveWidget(index, 'up')}
                                                className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-30 text-gray-400"
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                disabled={index === settings.homeWidgetsOrder.length - 1}
                                                onClick={() => moveWidget(index, 'down')}
                                                className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-30 text-gray-400"
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass p-1 rounded-2xl overflow-hidden">
                            <button onClick={onLogout} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold transition-colors flex items-center justify-center">
                                <LogOut size={16} className="mr-2" />
                                Log Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
