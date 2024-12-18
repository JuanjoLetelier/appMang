import { ApplicationConfig, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient){
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json')

}


//===== Firebase ======
import{AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';

@NgModule({
  declarations: [AppComponent],
  imports: [
      BrowserModule,
      IonicModule.forRoot({ rippleEffect: false,
                            mode: 'md'}),
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      HttpClientModule
    ],
  providers: [{ provide: RouteReuseStrategy,
                useClass: IonicRouteStrategy,
              
               }],
  
               bootstrap: [AppComponent ],
})
export class AppModule {}

export const appConfig: ApplicationConfig = {
  providers: [
              
  ]
}


