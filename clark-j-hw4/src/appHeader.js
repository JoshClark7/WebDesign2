const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
<header class="hero is-small is-info is-bold p-2">
<div class="hero-body">
    <div class="container">
        <h1 class="title"><slot name="my-title"></slot></h1>
        <h2 class="subtitle"><slot name="my-subtitle"></slot></h2>
    </div>
</div>
</header>
`;

class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('app-header', AppHeader);