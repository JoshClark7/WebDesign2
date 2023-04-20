class MyFooter extends HTMLElement {

    constructor() {
        super();
        this.name = "Ace Coder";
        this.year = 2001;
    }

    static get observedAttributes() {
        return ["data-name", "data-year"];
    }

    // a component lifecycle event - called when the component is inserted into the DOM
    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        console.log(attributeName, oldValue, newValue);
        if (oldValue == newValue) return;
        if (attributeName == "data-name") {
            this.name = newValue;
        }
        if (attributeName == "data-year") {
            this.year = newValue;
        }
        this.render;
    }

    render() {
        this.textContent = `${this.year} ${this.name}`;
    }
}

customElements.define('my-footer', MyFooter);