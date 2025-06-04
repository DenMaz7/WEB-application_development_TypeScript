// router.ts - маршрутизація
export class Router {
  private routes: Map<string, () => void>;
  private currentRoute: string;

  constructor() {
    this.routes = new Map();
    this.currentRoute = "";
    this.bindEvents();
  }

  public addRoute(path: string, handler: () => void): void {
    this.routes.set(path, handler);
  }

  public navigate(path: string): void {
    if (this.routes.has(path)) {
      this.currentRoute = path;
      window.location.hash = `#${path}`;
      const handler = this.routes.get(path);
      if (handler) {
        handler();
      }
    } else {
      console.warn(`Route ${path} not found`);
      this.navigate("main-menu");
    }
  }

  public init(): void {
    // Перевіряємо поточний хеш в URL
    const hash = window.location.hash.slice(1);
    if (hash && this.routes.has(hash)) {
      this.navigate(hash);
    } else {
      this.navigate("main-menu");
    }
  }

  private bindEvents(): void {
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
      } else {
        this.navigate("main-menu");
      }
    });
  }

  public getCurrentRoute(): string {
    return this.currentRoute;
  }
}
