export class Logger {
    static log(message: string): void {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    static error(message: string, error?: any): void {
        console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error || '');
    }
} 