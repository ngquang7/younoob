import { useState } from "react";
export default function ChannelBanner({ bannerUrl }: { bannerUrl?: string }) {
    if (!bannerUrl) return null;
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    return (
        <>
            <img
                src={bannerUrl}
                alt="Channel Banner"
                onClick={() => setPreviewImage(bannerUrl)}
                className="w-full h-45 object-cover rounded-2xl"

            />
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewImage(null)}
                >
                    <img
                        src={previewImage}
                        alt="Preview Large"
                        className="w-120 h-120 rounded-full object-cover shadow-lg border-4 border-gray-600"
                    />
                </div>
            )}
        </>
    );
}

