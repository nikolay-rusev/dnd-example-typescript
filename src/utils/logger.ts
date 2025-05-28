// extend window interface
declare global {
    interface Window {
        activateSystemLogs: boolean
    }
}

export default function configureLogging(initialValue: boolean = true): void {
    window.activateSystemLogs = initialValue;
}

const shouldLog = (): boolean => {
    return window.activateSystemLogs ?? window.activateSystemLogs === undefined;
};

export const SystemLogs = {
    log: function (...args: any[]): void {
        if (shouldLog()) {
            console.log(...args);
        }
    },
    warn: function (...args: any[]): void {
        if (shouldLog()) {
            console.warn(...args);
        }
    },
    error: function (...args: any[]): void {
        if (shouldLog()) {
            console.error(...args);
        }
    }
};
