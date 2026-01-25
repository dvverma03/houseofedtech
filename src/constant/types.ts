/**
 * Type definition for homepage section data
 */
export interface VideoStream {
    id: number;
    name: string;
    url: string;
}

export interface HomepageDataItem {
    id: number;
    title: string;
    sliderText: string;
    sectionImage: string;
    successMessage?: string;
    onSlideAction: () => void | Promise<void>;
}
