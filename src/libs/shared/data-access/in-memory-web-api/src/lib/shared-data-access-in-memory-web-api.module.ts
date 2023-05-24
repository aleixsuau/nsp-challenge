import { environment } from './../../../../../../environments/environment.development';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryWebApiService } from './data-access/in-memory-web-api/in-memory-web-api.service';

@NgModule({
  imports: [
    CommonModule,
    environment.production ? 
      [] :
      HttpClientInMemoryWebApiModule.forRoot(InMemoryWebApiService, { delay: 100 })
  ],
})
export class SharedDataAccessInMemoryWebApiModule {}
