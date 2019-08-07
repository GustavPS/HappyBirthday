import { Component, OnInit } from '@angular/core';
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
  private AllowedExtensions;

  constructor(private socket: Socket) { }

  ngOnInit() {
    this.AllowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'mp4', 'avi', 'flv'];
    this.socket.fromEvent<any>('moreData').subscribe(data => {
      this.UpdateBar(data['Percent']);
      let Place = data['Place'] * 524288; // The next blocks starting position
      // TODO: Needs to be checked for browser-compability. Probably need to do special cases for old chrome/firefox
      // Tested on: latest chrome, latest firefox
      let NewFile = this.SelectedFile.slice(Place, Place + Math.min(524288, (this.SelectedFile.size-Place)));
      this.id = data['id'];
      this.FReader.readAsBinaryString(NewFile);
    });
    this.socket.fromEvent<any>('done').subscribe(() => {
      this.UpdateBar(100);
      document.getElementById('back').style.display = 'block';
      document.getElementById('thankyou').style.display = 'block';
      document.getElementById('warning').style.display = 'none';
    });

    this.socket.fromEvent<any>('accepted').subscribe(() => {
      document.getElementById('submitform').style.display = 'none';
      document.getElementById('back').style.display = 'none';
      document.getElementById('close').style.display = 'none';
      document.getElementById('thankyou').style.display = 'none';
      document.getElementById('warning').style.display = 'block';
      document.getElementById('progress').style.display = 'block';
    });

    this.socket.fromEvent<any>('FileNotAllowed').subscribe(error => {
      if (error == 'extension') {
        this.showFileError('Filetype not allowed.');
      } else if(error == 'size') {
        this.showFileError("File can't be larger then 150MB");
      }
    });

    this.ready();
  }

  showFileError(error) {
    document.getElementById('fileError').innerHTML = error;
  }
  clearFileError() {
    document.getElementById('fileError').innerHTML = "";
  }

  ready() { 
    document.getElementById('close').addEventListener('click', this.Close);
    document.getElementById('submit').addEventListener('click', this.StartUpload);  
    if(window.File && window.FileReader){ //These are the relevant HTML5 objects that we are going to use 
        document.getElementById('image').addEventListener('change', this.FileChosen);
    }
    else
    {
      this.showFileError("Your browser doesn't support our file uploading system, please update your browser to send a video/image. You can still send in a text message.");
      document.getElementById('image').remove();
    }
  }


  StartUpload = () => {
    let message   = (<HTMLInputElement>document.getElementById('message')).value;
    let twitter   = (<HTMLInputElement>document.getElementById('twitter')).value;
    let instagram = (<HTMLInputElement>document.getElementById('instagram')).value;
    let tumblr    = (<HTMLInputElement>document.getElementById('tumblr')).value;
    this.clearFileError();

    // Check if the form input is valid
    if (!document.forms['submitform'].reportValidity()) {
      // Check what extension the file have (this check is also done on the server)
      if (this.SelectedFile != undefined && !this.AllowedExtensions.includes(this.SelectedFile.name.split('.').pop())) {
        this.showFileError('Filetype not allowed.');
      }
      return false;
    }

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

  Close = () => {
    this.UpdateBar(0);
    document.getElementById('submitform').style.display = 'inline-grid';
    document.getElementById('progress').style.display = 'none';
    document.getElementById('containerComponent').style.display = "none";
  }

  Open() {
    document.getElementById('close').style.display = 'block';
    document.getElementById('containerComponent').style.display = "block";
    document.getElementById('thankyou').style.display = 'none';
  }
}
