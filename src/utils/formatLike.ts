export const formatLike = (like: string) => {
    const totalLike: number = Number(like);
    if (isNaN(totalLike)) return '0';
    if (totalLike < 1000) return `${like}`;
    if (totalLike < 1000000) return `${Math.floor(totalLike / 1000)}K`;
    if (totalLike < 1000000000) return `${Math.floor(totalLike / 1000000)}M`;
    return `${Math.floor(totalLike / 1000000000)}B`;
  };