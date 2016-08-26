import { NgModule, provide } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { ContactsComponent } from './contacts/contacts.component';
import { InviteComponent } from './invite/invite.component';
import { JoinComponent } from './join/join.component';
import { NewuserComponent } from './newuser/newuser.component';
import { NogeoComponent } from './nogeo/nogeo.component';
import { routing } from './routes.component';
import { MdButtonModule } from '@angular2-material/button';
import { MdCardModule } from '@angular2-material/card';
import { MdCoreModule } from '@angular2-material/core';
import { MdIconModule } from '@angular2-material/icon';
import { MdInputModule } from '@angular2-material/input';
import { MdListModule } from '@angular2-material/list';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, ISettings, enhancers, rootReducer } from './store';
import { SettingsActions } from './actions';
const createLogger = require('redux-logger');

@NgModule({
    declarations: [
        AppComponent,
        MapComponent,
        ContactsComponent,
        InviteComponent,
        JoinComponent,
        NewuserComponent,
        NogeoComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
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
        NgRedux,
        DevToolsExtension,
        SettingsActions,
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
export class AppModule {
    constructor(
        private ngRedux: NgRedux<IAppState>,
        private devTool: DevToolsExtension
    ) {
        this.ngRedux.configureStore(
            rootReducer,
            {},
            [createLogger()],
            [...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f]);
    }
}
