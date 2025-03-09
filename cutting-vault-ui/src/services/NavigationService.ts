// NavigationService.ts
let navigateFunction: (path: string) => void;

export const setNavigateFunction = (navigate: (path: string) => void) => {
    navigateFunction = navigate;
};

export const navigateTo = (path: string) => {
    if (!navigateFunction) {
        throw new Error('Navigation function has not been set yet.');
    }
    navigateFunction(path);
};
