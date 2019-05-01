import {Component, ViewChild} from '@angular/core';
import {CanvasVideoComponent} from './canvas-video/canvas-video.component';
declare var $ : any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(CanvasVideoComponent) canvas: CanvasVideoComponent;

  title = 'HappyBirthday';

  countdownDone() {
    $('#container').css('animation', 'zoom-effect 10s linear');
    setTimeout(() => {
      $('#container').css('display', 'none');
      this.canvas.play();
    }, 10000);
  }
}
