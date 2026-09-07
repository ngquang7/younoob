export const formatSubcriberCount = (subcriber: string) => {
    const totalSubcriber: number = Number(subcriber);
    if (totalSubcriber < 1000) {
        return `${totalSubcriber}`;
    }
    if (totalSubcriber < 1000000) {
        const subcribers: number = totalSubcriber / 1000;
        return `${subcribers}K`;
    }
    if (totalSubcriber < 1000000000) {
        const subcribers: number = totalSubcriber / 1000000;
        return `${subcribers}M`;
    }
}