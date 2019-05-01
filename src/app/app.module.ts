import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CountdownComponent } from './countdown/countdown.component';
import { FireworkComponent } from './firework/firework.component';
import { CanvasVideoComponent } from './canvas-video/canvas-video.component';

@NgModule({
  declarations: [
    AppComponent,
    CountdownComponent,
    FireworkComponent,
    CanvasVideoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
