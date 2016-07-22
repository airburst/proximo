import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {

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
  }

  public setIfEmpty(key: string, value: any) {
    if (!this.exists(this.get(key))) {
      this.set(key, value);
    }
  }

  public remove(key: string) {
    window.localStorage.removeItem(key);
  }

  public clear() {
    window.localStorage.clear();
  }

  exists(item: string): boolean {
    return ((item) && (item !== 'undefined') && (item !== undefined) && (item !== null));
  }
}

