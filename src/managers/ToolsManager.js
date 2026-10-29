
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
        
        const expandIcon = document.createElement("i");
        expandIcon.classList.add(
            "fa-solid",
            "fa-caret-down",
            "tool-group-expand"
        );

        button.appendChild(icon);
        button.appendChild(expandIcon);

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