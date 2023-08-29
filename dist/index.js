"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSwitcherControl = void 0;
class ThemeSwitcherControl {
    constructor(themes, options) {
        this.themes = themes !== null && themes !== void 0 ? themes : ThemeSwitcherControl.DEFAULT_THEMES;
        const defaultStyle = typeof (options) === "string" ? options : options ? options.defaultStyle : undefined;
        this.defaultStyle = defaultStyle || ThemeSwitcherControl.DEFAULT_THEME;
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.events = typeof (options) !== "string" && options ? options.eventListeners : undefined;
    }
    getDefaultPosition() {
        const defaultPosition = "top-right";
        return defaultPosition;
    }
    onAdd(map) {
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
                var _a, _b;
                const srcElement = event.srcElement;
                this.closeModal();
                if (srcElement.classList.contains("active")) {
                    return;
                }
                if (this.events && this.events.onOpen && this.events.onOpen(event)) {
                    return;
                }
                const themeId = srcElement.dataset.id;
                if ((_a = this.map) === null || _a === void 0 ? void 0 : _a.loaded()) {
                    (_b = this.map) === null || _b === void 0 ? void 0 : _b.getStyle().layers.filter((layer) => this.themes.map((theme) => theme.id).includes(layer.id)).forEach((layer) => {
                        var _a;
                        (_a = this.map) === null || _a === void 0 ? void 0 : _a.setLayoutProperty(layer.id, 'visibility', layer.id === themeId ? 'visible' : 'none');
                    });
                }
                const elms = this.themeContainer.getElementsByClassName("active");
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
    onRemove() {
        if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.themeButton) {
            return;
        }
        this.themeButton.removeEventListener("click", this.onDocumentClick);
        this.controlContainer.parentNode.removeChild(this.controlContainer);
        document.removeEventListener("click", this.onDocumentClick);
        this.map = undefined;
    }
    closeModal() {
        if (this.themeContainer && this.themeButton) {
            this.themeContainer.style.display = "none";
            this.themeButton.style.display = "block";
        }
    }
    openModal() {
        if (this.themeContainer && this.themeButton) {
            this.themeContainer.style.display = "block";
            this.themeButton.style.display = "none";
        }
    }
    onDocumentClick(event) {
        if (this.controlContainer && !this.controlContainer.contains(event.target)) {
            this.closeModal();
        }
    }
}
exports.ThemeSwitcherControl = ThemeSwitcherControl;
ThemeSwitcherControl.DEFAULT_THEME = "light";
ThemeSwitcherControl.DEFAULT_THEMES = [
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
//# sourceMappingURL=index.js.map