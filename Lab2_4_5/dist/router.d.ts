export declare class Router {
    private routes;
    private currentRoute;
    constructor();
    addRoute(path: string, handler: () => void): void;
    navigate(path: string): void;
    init(): void;
    private bindEvents;
    getCurrentRoute(): string;
}
//# sourceMappingURL=router.d.ts.map