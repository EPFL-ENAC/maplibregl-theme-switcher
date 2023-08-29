import type { ControlPosition, IControl, Map } from 'maplibre-gl'

export type ThemeDefinition = {
  id: string
  label: string
}

export type ThemeSwitcherOptions = {
  defaultStyle?: string
  eventListeners?: ThemeSwitcherEvents
}

type ThemeSwitcherEvents = {
  onOpen?: (event: MouseEvent) => boolean
  onSelect?: (event: MouseEvent) => boolean
  onChange?: (event: MouseEvent, style: string | undefined) => boolean
}

export class ThemeSwitcherControl implements IControl {
  private static readonly DEFAULT_THEME = "light";
  private static readonly DEFAULT_THEMES: ThemeDefinition[] = [
    {
      "id": "classic",
      "label": "Classic"
    },
    {
      "id": "light",
      "label": "Light"
    },
    {
      "id": "dark",
      "label": "Dark"
    }
  ];

  private controlContainer: HTMLElement | undefined;
  private events?: ThemeSwitcherEvents;
  private map?: Map;
  private themeContainer: HTMLElement | undefined;
  private themeButton: HTMLButtonElement | undefined;
  private themes: ThemeDefinition[];
  private defaultStyle: string;

  constructor(themes?: ThemeDefinition[], options?: ThemeSwitcherOptions | string) {
    this.themes = themes ?? ThemeSwitcherControl.DEFAULT_THEMES;
    const defaultStyle = typeof(options) === "string" ? options : options ? options.defaultStyle : undefined;
    this.defaultStyle = defaultStyle || ThemeSwitcherControl.DEFAULT_THEME;
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.events = typeof(options) !== "string" && options ? options.eventListeners : undefined;
  }

  public getDefaultPosition(): ControlPosition {
    const defaultPosition = "top-right";
    return defaultPosition;
  }

  public onAdd(map: Map): HTMLElement {
    this.map = map;
    this.controlContainer = document.createElement("div");
    this.controlContainer.classList.add("maplibregl-ctrl");
    this.controlContainer.classList.add("maplibregl-ctrl-group");
    this.themeContainer = document.createElement("div");
    this.themeButton = document.createElement("button");
    this.themeButton.type = "button";
    this.themeContainer.classList.add("theme-list");
    for (const theme of this.themes) {
        const themeElement = document.createElement("button");
        themeElement.type = "button";
        themeElement.innerText = theme.label;
        themeElement.classList.add(theme.label.replace(/[^a-z0-9-]/gi, '_'));
        themeElement.dataset.id = theme.id;
        themeElement.addEventListener("click", event => {
          const srcElement = event.srcElement as HTMLButtonElement;
          this.closeModal();
          if (srcElement.classList.contains("active")) {
            return;
          }
          if (this.events && this.events.onOpen && this.events.onOpen(event)) {
            return;
          }
          const themeId = srcElement.dataset.id;
          if (this.map?.loaded()) {
            this.map?.getStyle().layers
              .filter((layer) => this.themes.map((theme) => theme.id).includes(layer.id))
              .forEach((layer) => {
                this.map?.setLayoutProperty(
                  layer.id,
                  'visibility',
                  layer.id === themeId ? 'visible' : 'none'
                )
              })
          }
          const elms = this.themeContainer!.getElementsByClassName("active");
          while (elms[0]) {
              elms[0].classList.remove("active");
          }
          srcElement.classList.add("active");
          if (this.events && this.events.onChange && this.events.onChange(event, themeId)) {
            return;
          }
        });
        if (theme.id === this.defaultStyle) {
          themeElement.classList.add("active");
        }
        this.themeContainer.appendChild(themeElement);
    }
    this.themeButton.classList.add("maplibregl-ctrl-icon");
    this.themeButton.classList.add("theme-switcher");
    this.themeButton.addEventListener("click", event => {
      if (this.events && this.events.onSelect && this.events.onSelect(event)) {
        return;
      }
      this.openModal();
    });

    document.addEventListener("click", this.onDocumentClick);

    this.controlContainer.appendChild(this.themeButton);
    this.controlContainer.appendChild(this.themeContainer);
    return this.controlContainer;
  }

  public onRemove(): void {
    if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.themeButton) {
      return;
    }
    this.themeButton.removeEventListener("click", this.onDocumentClick);
    this.controlContainer.parentNode.removeChild(this.controlContainer);
    document.removeEventListener("click", this.onDocumentClick);
    this.map = undefined;
  }

  private closeModal(): void {
    if (this.themeContainer && this.themeButton) {
      this.themeContainer.style.display = "none";
      this.themeButton.style.display = "block";
    }
  }

  private openModal(): void {
    if (this.themeContainer && this.themeButton) {
      this.themeContainer.style.display = "block";
      this.themeButton.style.display = "none";
    }
  }

  private onDocumentClick(event: MouseEvent): void {
    if (this.controlContainer && !this.controlContainer.contains(event.target as Element)) {
      this.closeModal();
    }
  }
}