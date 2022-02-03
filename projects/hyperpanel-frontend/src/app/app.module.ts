import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql/graphql.module';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NzIconModule.forRoot([]),
    GraphQLModule,
    AppRoutingModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
