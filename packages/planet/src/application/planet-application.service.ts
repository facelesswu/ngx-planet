import { PlanetApplication } from '../planet.class';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, map } from 'rxjs/operators';
import { coerceArray } from '../helpers';
import { Observable } from 'rxjs';

interface InternalPlanetApplication extends PlanetApplication {
    loaded?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class PlanetApplicationService {
    private apps: InternalPlanetApplication[] = [];

    private appsMap: { [key: string]: InternalPlanetApplication } = {};

    private currentApps: InternalPlanetApplication[] = [];

    constructor(private http: HttpClient) {}

    register<TExtra>(appOrApps: PlanetApplication<TExtra> | PlanetApplication<TExtra>[]) {
        const apps = coerceArray(appOrApps);
        apps.forEach(app => {
            if (this.appsMap[app.name]) {
                throw new Error(`${app.name} has be registered.`);
            }
            this.apps.push(app);
            this.appsMap[app.name] = app;
        });
    }

    registerByUrl(url: string): Observable<void> {
        return this.http.get(`${url}`).pipe(
            map(apps => {
                if (apps && Array.isArray(apps)) {
                    this.register(apps);
                }
            })
        );
    }

    unregister(name: string) {
        if (this.appsMap[name]) {
            delete this.appsMap[name];
            this.apps = this.apps.filter(app => {
                return app.name !== name;
            });
        }
    }

    getAppsByMatchedUrl<TExtra>(url: string): PlanetApplication<TExtra>[] {
        return this.apps.filter(app => {
            if (app.routerPathPrefix instanceof RegExp) {
                return app.routerPathPrefix.test(url);
            } else {
                return url.includes(app.routerPathPrefix);
            }
        });
    }

    getAppByMatchedUrl<TExtra>(url: string): PlanetApplication<TExtra> {
        return this.apps.find(app => {
            if (app.routerPathPrefix instanceof RegExp) {
                return app.routerPathPrefix.test(url);
            } else {
                return url.includes(app.routerPathPrefix);
            }
        });
    }

    getAppsToPreload(excludeAppNames?: string[]) {
        return this.apps.filter(app => {
            if (excludeAppNames) {
                return app.preload && !excludeAppNames.includes(app.name);
            } else {
                return app.preload;
            }
        });
    }
}
