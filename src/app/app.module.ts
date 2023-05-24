import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { SharedDataAccessInMemoryWebApiModule } from '@nsp/shared/data-access/in-memory-web-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    SharedDataAccessInMemoryWebApiModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }