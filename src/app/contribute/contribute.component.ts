import { Inject, Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

declare let window: any;

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.css']
})
export class ContributeComponent implements OnInit {
  private FReader: FileReader;
  private Name: string;
  private id: string;
  public SelectedFile: File;

  constructor(private socket: Socket) { }

  ngOnInit() {
    this.socket.fromEvent<any>('moreData').subscribe(data => {
      this.UpdateBar(data['Percent']);
      let Place = data['Place'] * 524288; // The next blocks starting position
      // Needs to be checked for browser-compability. Probably need to do special cases for old chrome/firefox
      let NewFile = this.SelectedFile.slice(Place, Place + Math.min(524288, (this.SelectedFile.size-Place)));
      this.id = data['id'];
      this.FReader.readAsBinaryString(NewFile);
    });
    this.socket.fromEvent<any>('done').subscribe(() => {
      this.UpdateBar(100);
      document.getElementById('back').style.display = 'block';
    });

    this.ready();
  }

  ready() { 
    if(window.File && window.FileReader){ //These are the relevant HTML5 objects that we are going to use 
        document.getElementById('submit').addEventListener('click', this.StartUpload);  
        document.getElementById('image').addEventListener('change', this.FileChosen);
    }
    else
    {
        //document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
    }
  }


  StartUpload = () => {
    let message   = document.getElementById('message').textContent;
    let twitter   = document.getElementById('twitter').textContent;
    let instagram = document.getElementById('instagram').textContent;
    let tumblr    = document.getElementById('tumblr').textContent;
    document.getElementById('submitform').style.display = 'none';
    document.getElementById('progress').style.display = 'block';

    if (this.SelectedFile != null && this.SelectedFile != undefined) {
      this.FReader = new FileReader();
      this.FReader.onload = (event: any) => {
        this.socket.emit('upload', { 'id': this.id, Data: event.target.result });
      }
      this.socket.emit('start', {
        'Size': this.SelectedFile.size,
        'SendFile': true,
        'Extension': this.SelectedFile.name.split('.').pop(),
        'Message': message,
        'Tumblr': tumblr,
        'Twitter': twitter,
        'Instagram': instagram
      });

    } else {
      this.socket.emit('start', {
        'SendFile': false,
        'Message': message,
        'Tumblr': tumblr,
        'Twitter': twitter,
        'Instagram': instagram
      });
    }
  }

  FileChosen = (event) => {
    this.SelectedFile = event.target.files[0];
  }

  UpdateBar(percent) {
    // Update progressbar
    document.getElementById('innerProgressBar').style.width = percent + '%';
    document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
  }

}
