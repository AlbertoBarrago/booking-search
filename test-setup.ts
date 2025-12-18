import {GlobalRegistrator} from "@happy-dom/global-registrator";
import {afterEach} from "bun:test";

GlobalRegistrator.register();

afterEach(() => {
    /**
     * This fix allows running the test together, avoiding a problem in the DOM of remain
     * trace of an old component with the same id or class name used in test for selection
     */
    if (document.body) {
        document.body.innerHTML = '';
    }
    const portals = document.querySelectorAll('[data-radix-portal]');
    portals.forEach(portal => portal.remove());
});
