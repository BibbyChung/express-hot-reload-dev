declare global {
    interface String {
        toFolder(): string;
    }
}
export declare const hotReload: (watchFolder: any, isDebug?: boolean) => (routerPath: any) => (req: any, res: any, next: any) => void;
