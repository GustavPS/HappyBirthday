import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CountdownComponent } from './countdown/countdown.component';
import { FireworkComponent } from './firework/firework.component';
import { CanvasVideoComponent } from './canvas-video/canvas-video.component';
import { ContributeComponent } from './contribute/contribute.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//const config: SocketIoConfig = { url: 'http://localhost:5001', options: {} };
const config: SocketIoConfig = { url: 'https://vmi288666.contaboserver.net:5001', options: {rejectUnauthorized: false} };

@NgModule({
  declarations: [
    AppComponent,
    CountdownComponent,
    FireworkComponent,
    CanvasVideoComponent,
    ContributeComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [{ provide: 'Window',  useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule { }
