import { Component, OnInit } from '@angular/core';
declare var $ : any;


@Component({
  selector: 'app-firework',
  templateUrl: './firework.component.html',
  styleUrls: ['./firework.component.css']
})
export class FireworkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    (<any>$('.fireworks')).fireworks();
  }

}
