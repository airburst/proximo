import { Injectable } from '@angular/core';

@Injectable()
export class GeolocationService {

  private timeout: number;
  private maxAge: number;
  private options: any;
  private watchId: number;
  private hasWatch: boolean = false;

  constructor() {
    this.timeout = 10;
    this.maxAge = 5;
    this.options = {
      timeout: this.timeout * 1000,
      maximumAge: this.maxAge * 60 * 1000,
    };
  }

  public isSupported() {
    return ("geolocation" in navigator)
  }

  public getLocation(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      navigator.geolocation.getCurrentPosition((p) => {
        resolve(p.coords);
      }, reject, this.options);
    });
  }

  private geoError(error: any) {
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
    return { error: error.code };
  };

  // TODO: use callback or observable    
  public watch(callback: Function): void {
    if (!this.hasWatch) {
      this.watchId = navigator.geolocation.watchPosition(position => {
        callback({ lat: position.coords.latitude, lon: position.coords.longitude });
      });
      this.hasWatch = true;
    }
  }

  public clearWatch(): void {
    if (this.hasWatch) { navigator.geolocation.clearWatch(this.watchId); }
  }

}
