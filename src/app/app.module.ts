import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTethysModule } from 'ngx-tethys';
import { AboutComponent } from './about/about.component';
import { HostContainerComponent } from './host-container/host-container.component';
import { NgxPlanetModule } from '../../packages/planet/src/public_api';
import { ThyDialogModule } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';
import { HelpComponent } from './help/help.component';

@NgModule({
    declarations: [AppComponent, AboutComponent, HelpComponent, HostContainerComponent, ADetailComponent],
    imports: [BrowserModule, NgxTethysModule, ThyDialogModule, AppRoutingModule, NgxPlanetModule],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [ADetailComponent]
})
export class AppModule {}
