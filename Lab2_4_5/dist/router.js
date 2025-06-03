// router.ts - маршрутизація
export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = "";
        this.bindEvents();
    }
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }
    navigate(path) {
        if (this.routes.has(path)) {
            this.currentRoute = path;
            window.location.hash = `#${path}`;
            const handler = this.routes.get(path);
            if (handler) {
                handler();
            }
        }
        else {
            console.warn(`Route ${path} not found`);
            this.navigate("main-menu");
        }
    }
    init() {
        // Перевіряємо поточний хеш в URL
        const hash = window.location.hash.slice(1);
        if (hash && this.routes.has(hash)) {
            this.navigate(hash);
        }
        else {
            this.navigate("main-menu");
        }
    }
    bindEvents() {
        // Слухаємо зміни хешу в URL
        window.addEventListener("hashchange", () => {
            const hash = window.location.hash.slice(1);
            if (hash && this.routes.has(hash) && hash !== this.currentRoute) {
                this.navigate(hash);
            }
        });
        // Обробляємо кнопку "Назад" браузера
        window.addEventListener("popstate", () => {
            const hash = window.location.hash.slice(1);
            if (hash && this.routes.has(hash)) {
                this.navigate(hash);
            }
            else {
                this.navigate("main-menu");
            }
        });
    }
    getCurrentRoute() {
        return this.currentRoute;
    }
}
//# sourceMappingURL=router.js.map