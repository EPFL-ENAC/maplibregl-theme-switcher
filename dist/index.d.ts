import type { ControlPosition, IControl, Map } from 'maplibre-gl';
export type ThemeDefinition = {
    id: string;
    label: string;
};
export type ThemeSwitcherOptions = {
    defaultStyle?: string;
    eventListeners?: ThemeSwitcherEvents;
};
type ThemeSwitcherEvents = {
    onOpen?: (event: MouseEvent) => boolean;
    onSelect?: (event: MouseEvent) => boolean;
    onChange?: (event: MouseEvent, style: string | undefined) => boolean;
};
export declare class ThemeSwitcherControl implements IControl {
    private static readonly DEFAULT_THEME;
    private static readonly DEFAULT_THEMES;
    private controlContainer;
    private events?;
    private map?;
    private themeContainer;
    private themeButton;
    private themes;
    private defaultStyle;
    constructor(themes?: ThemeDefinition[], options?: ThemeSwitcherOptions | string);
    getDefaultPosition(): ControlPosition;
    onAdd(map: Map): HTMLElement;
    onRemove(): void;
    private closeModal;
    private openModal;
    private onDocumentClick;
}
export {};
