
class ToolsManager {

    constructor() {
        this.ToolPanel = document.getElementById("tool-panel");
        this.app = null;
        this.initialized = false;   
    }

    getTool(title = "",cssClasses = [],onClick = () => {}){
        let tool = document.createElement("button");
        tool.type = "button";
        tool.title = title;
        tool.classList.add("tool");
        
        let toolIcon = document.createElement("i");
        toolIcon.classList.add(...cssClasses);
        
        toolIcon.style.fontSize = "30px";
        
        tool.appendChild(toolIcon);
        
        tool.addEventListener('click', () => {
           onClick(); 
        });
        
        return tool;
    }

    getImageTool(title = "", src = "", onClick = () => {}) {
        const tool = document.createElement("button");
        tool.type = "button";
        tool.title = title;
        tool.classList.add("tool", "image-tool");
        tool.setAttribute("aria-label", title);

        const image = document.createElement("img");
        image.src = src;
        image.alt = "";
        tool.appendChild(image);

        tool.addEventListener("click", onClick);
        return tool;
    }

    getTextTool(title = "", preview = "", onClick = () => {}) {
        const tool = document.createElement("button");
        tool.type = "button";
        tool.title = title;
        tool.setAttribute("aria-label", title);
        tool.classList.add("tool", "text-tool");
        tool.textContent = preview;
        tool.addEventListener("click", onClick);
        return tool;
    }

    getCheckboxTool(title, label) {
        const control = document.createElement("label");
        control.classList.add("checkbox-tool");
        control.title = title;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("aria-label", title);

        const labelText = document.createElement("span");
        labelText.textContent = label;

        control.append(checkbox, labelText);
        return control;
    }
    
    getColorPicker(title, palette = null, initialColor = "#ffffff") {
        if (palette) {
            return this.#getPalettePicker(title, palette, initialColor);
        }

        const colorPicker = document.createElement("input");

        colorPicker.type = "color";
        colorPicker.title = title;
        colorPicker.classList.add("tool");
        colorPicker.value = "#ffffff";
        colorPicker.style.width = "100%";
        
        colorPicker.getDecimal = function() {
            const cleanHex = colorPicker.value.replace('#', '');
            return parseInt(cleanHex, 16);
        };
        
        return colorPicker;
    }

    getImagePicker(title, images) {
        const picker = document.createElement("div");
        picker.classList.add("image-picker");

        const button = document.createElement("button");
        button.type = "button";
        button.title = title;
        button.classList.add("tool", "image-picker-button");
        button.setAttribute("aria-label", title);
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");

        const preview = document.createElement("img");
        preview.classList.add("image-picker-preview");
        preview.alt = "";
        button.appendChild(preview);

        const popup = document.createElement("div");
        popup.classList.add("image-picker-popup");
        popup.setAttribute("role", "group");
        popup.setAttribute("aria-label", title);

        const options = [{ id: "", name: "Default", src: "" }, ...images];
        const buttons = [];
        for (const image of options) {
            const option = document.createElement("button");
            option.type = "button";
            option.classList.add("image-picker-option");
            option.title = image.name;
            option.setAttribute("aria-label", image.name);
            option.setAttribute("aria-pressed", "false");

            if (image.src) {
                const thumbnail = document.createElement("img");
                thumbnail.src = image.src;
                thumbnail.alt = "";
                option.appendChild(thumbnail);
            } else {
                option.classList.add("image-picker-default");
                option.textContent = "Default";
            }

            buttons.push({ element: option, id: image.id });
            option.addEventListener("click", () => {
                picker.value = image.id;
                popup.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
                picker.dispatchEvent(new Event("change"));
            });
            popup.appendChild(option);
        }

        Object.defineProperty(picker, "value", {
            get: () => picker._value,
            set: (value) => {
                const selected = options.find((image) => image.id === value);
                if (!selected) {
                    throw new RangeError(`Background ${value} is not available.`);
                }

                picker._value = value;
                picker.selection = selected.id
                    ? images.find((image) => image.id === selected.id)
                    : null;
                preview.src = selected.src;
                preview.hidden = !selected.src;
                button.title = `${title}: ${selected.name}`;

                for (const option of buttons) {
                    option.element.setAttribute(
                        "aria-pressed",
                        String(option.id === value)
                    );
                }
            }
        });
        picker.value = "";

        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = popup.classList.toggle("open");
            button.setAttribute("aria-expanded", String(isOpen));
        });

        popup.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            popup.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        });

        picker.append(button, popup);
        return picker;
    }

    #getPalettePicker(title, palette, initialColor) {
        const picker = document.createElement("div");
        picker.classList.add("palette-picker");

        const button = document.createElement("button");
        button.type = "button";
        button.title = title;
        button.classList.add("tool", "palette-picker-button");
        button.setAttribute("aria-label", title);
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "false");

        const currentColor = document.createElement("span");
        currentColor.classList.add("palette-current-color");
        button.appendChild(currentColor);

        const popup = document.createElement("div");
        popup.classList.add("palette-popup");
        popup.setAttribute("role", "group");
        popup.setAttribute("aria-label", title);

        const rainbowButton = document.createElement("button");
        rainbowButton.type = "button";
        rainbowButton.classList.add("palette-rainbow");
        rainbowButton.setAttribute("aria-label", "Rainbow colors");
        rainbowButton.setAttribute("aria-pressed", "false");
        const rainbowColorNames = [
            "Red 1",
            "Orange 1",
            "Yellow 1",
            "Green 2",
            "Blue 1",
            "Purple 1"
        ];
        const rainbowColors = rainbowColorNames.map(
            (name) => palette.find((color) => color.name === name).value
        );
        rainbowButton.style.backgroundImage =
            `linear-gradient(to right, ${rainbowColors.join(", ")})`;
        rainbowButton.addEventListener("click", () => {
            popup.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
            picker.dispatchEvent(new Event("rainbow"));
        });
        picker.setRainbowEnabled = (enabled) => {
            rainbowButton.setAttribute("aria-pressed", String(enabled));
        };

        const allowedColors = new Set(palette.map(({ value }) => value));
        const swatches = [];
        for (const { name, value } of palette) {
            const swatch = document.createElement("button");
            swatch.type = "button";
            swatch.classList.add("palette-swatch");
            swatch.title = name;
            swatch.setAttribute("aria-label", name);
            swatch.setAttribute("aria-pressed", "false");
            swatch.style.backgroundColor = value;
            swatches.push({ element: swatch, value });
            swatch.addEventListener("click", () => {
                picker.value = value;
                popup.classList.remove("open");
                button.setAttribute("aria-expanded", "false");
                picker.dispatchEvent(new Event("change"));
            });
            popup.appendChild(swatch);
        }
        popup.appendChild(rainbowButton);

        Object.defineProperty(picker, "value", {
            get: () => picker._value,
            set: (value) => {
                if (!allowedColors.has(value)) {
                    throw new RangeError(`Color ${value} is not in the palette.`);
                }

                picker._value = value;
                currentColor.style.backgroundColor = value;
                button.title = `${title}: ${value}`;
                for (const swatch of swatches) {
                    swatch.element.setAttribute(
                        "aria-pressed",
                        String(swatch.value === value)
                    );
                }
            }
        });
        picker.value = initialColor;

        button.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = popup.classList.toggle("open");
            button.setAttribute("aria-expanded", String(isOpen));
        });

        popup.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        document.addEventListener("click", () => {
            popup.classList.remove("open");
            button.setAttribute("aria-expanded", "false");
        });

        picker.append(button, popup);
        return picker;
    }
    
    addTool(tool){
        this.ToolPanel.appendChild(tool);
    }
    
    addToolGroup(title,cssClasses = [], tools = []) {

        const group = document.createElement("div");
        group.classList.add("tool-group");

        const button = document.createElement("button");
        button.type = "button";
        button.title = title;
        button.classList.add("tool", "tool-group-button");

        const icon = document.createElement("i");
        icon.classList.add(...cssClasses);

        icon.style.fontSize = "22px";

        button.appendChild(icon);

        const popup = document.createElement("div");
        popup.classList.add("tool-group-popup");

        for (const tool of tools) {
            tool.addEventListener('click', () => {
               closePopup(); 
            });
            
            popup.appendChild(tool);
        }

        group.appendChild(button);
        group.appendChild(popup);


        const closePopup = () => {
            popup.classList.remove("open");
        };


        button.addEventListener("click", (event) => {
            event.stopPropagation();

            popup.classList.toggle("open");
        });


        popup.addEventListener("click", (event) => {
            event.stopPropagation();

            if (event.target.closest(".tool-placeholder")) {
                closePopup();
            }
        });


        document.addEventListener("click", () => {
            closePopup();
        });

        this.ToolPanel.appendChild(group);

        //return group;
    }

}

export default new ToolsManager();