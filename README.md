# ngx-planet
> An Angular 7+ Micro Frontend library.

## Installation
```
npm i @worktile/planet --save
```

## Usage

### 1. Loading the module in the app module
```
import { NgxPlanetModule } from '@worktile/planet';

@NgModule({
  imports: [
    CommonModule,
    NgxPlanetModule
  ]
})
class AppModule {}
```
### 2. Register Applications to planet User Planet Service
```
@Component({
    selector: 'app-portal-root',
    template: `
<nav>
    <a [routerLink]="['/app1']" routerLinkActive="active">应用1</a>
    <a [routerLink]="['/app2']" routerLinkActive="active">应用2</a>
</nav>
<router-outlet></router-outlet>
<div id="app-host-container"></div>
<div *ngIf="!loadingDone">加载中...</div>
    `
})
export class AppComponent implements OnInit {
    title = 'ngx-planet';

    get loadingDone() {
        return this.planet.loadingDone;
    }

    constructor(
        private planet: Planet,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher
    ) {}

    ngOnInit() {
        this.planet.setOptions({
            switchMode: SwitchModes.coexist,
            errorHandler: error => {
                this.thyNotify.error(`错误`, '加载资源失败');
            }
        });

        const appHostContainerSelector = '#app-host-container';
        const appHostContainerClass = 'thy-layout';

        this.planet.registerApps([
            {
                name: 'app1',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app1',
                selector: 'app1-root-container',
                scriptPathPrefix: 'app1/assets/',
                preload: true,
                // prettier-ignore
                scripts: [
                    'main.js'
                ]
            },
            {
                name: 'app2',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app2',
                selector: 'app2-root-container',
                // preload: true,
                // prettier-ignore
                scripts: [
                    'app2/assets/main.js'
                ]
            }
        ]);

        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.planet.resetRouting(event);
            }
        });

        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            // open a Detail
        });
    }
}
```

## Development

```
npm run serve:app1 // 3001
npm run serve:app2 // 3002
npm run serve:portal // 3000
```

open http://localhost:3000
