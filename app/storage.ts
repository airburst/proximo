export class LocalStorage {

    constructor() {
        if (!this.isSupported) { console.error('Local storage is not supported in this browser.'); }
    }

    public isSupported() {
        return ('localStorage' in window);
    }

    public get(key: string): any {
        return window.localStorage.getItem(key);
    }
    
    public set(key: string, value: any) {
        window.localStorage.setItem(key, value);
        console.log('setting store', key, value);   //
    }

    public setIfEmpty(key: string, value: any) {
        let item = this.get(key);
        if ((!item) || (item === 'undefined') || (item === null)) {
            this.set(key, value);
        }
    }

    public remove(key: string) {
        window.localStorage.removeItem(key);
    }

    public clear() {
        window.localStorage.clear();
    }
}