const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
<div class="footer has-background-info has-text-centered has-text-light p-1">&copy; <slot name="year-data"></slot> <slot name="holder-name"></slot></div>
`;

class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('app-footer', AppFooter);