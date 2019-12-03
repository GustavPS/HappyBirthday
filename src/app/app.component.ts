import {Inject,Component, ViewChild} from '@angular/core';
import {CanvasVideoComponent} from './canvas-video/canvas-video.component';
import {ContributeComponent} from './contribute/contribute.component';
declare var $ : any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(CanvasVideoComponent) canvas: CanvasVideoComponent;
  @ViewChild(ContributeComponent) contribute: ContributeComponent;


  title = 'HappyBirthday';

  open() {
    this.contribute.Open();
  }

  countdownDone() {
    $('#container').css('animation', 'zoom-effect 10s linear');
    setTimeout(() => {
      $('#container').css('display', 'none');
      this.canvas.play();
    }, 1); // 10 000
  }
}
