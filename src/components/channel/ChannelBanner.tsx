export default function ChannelBanner({ bannerUrl }: { bannerUrl?: string }) {
    if (!bannerUrl) return null;
    return (
        <img
            src={bannerUrl}
            alt="Channel Banner"
            className="w-full h-45 object-cover rounded-2xl"
        />
    );
}

