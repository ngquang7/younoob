export const formatView = (view: string | number) => {
    if(!view) return '0';
    const totalView: number = Number(view);
    if(totalView < 1000) return `${view}`;
    if(totalView < 1000000) return `${Math.floor(totalView/1000)}K`; //  K views
    if(totalView < 1000000000) return `${Math.floor(totalView/1000000)}M`; // M views
    if(totalView < 1000000000000) return `${Math.floor(totalView/1000000000)}B`; // B views
    }