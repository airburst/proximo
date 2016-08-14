import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { routing } from './routes.component';
import { provideStore } from '@ngrx/store';
import { settingsReducer } from './reducers/settings';
import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdCoreModule } from '@angular2-material/core';
import { MdIconModule } from '@angular2-material/icon';
import { MdInputModule } from '@angular2-material/input';
import { MdListModule } from '@angular2-material/list';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,  
        FormsModule,
        routing,
        MdCoreModule, 
        MdButtonModule, 
        MdToolbarModule, 
        MdCardModule, 
        MdInputModule,
        MdListModule,
        MdToolbarModule,
        MdIconModule
    ],
    providers: [
        provideStore({ settings: settingsReducer }),
        FIREBASE_PROVIDERS,
        defaultFirebase({
            apiKey: "AIzaSyDGe_FmSZBr74_Eo9rbe-Ld9r264Ay47hE",
            authDomain: "proximo-55720.firebaseapp.com",
            databaseURL: "https://proximo-55720.firebaseio.com",
            storageBucket: "",
        })
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
