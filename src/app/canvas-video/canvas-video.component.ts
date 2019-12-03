import { Component, OnInit } from '@angular/core';
import {TwitterPost} from '../twitter-post';
import { Socket } from 'ngx-socket-io';
import { post } from 'selenium-webdriver/http';
declare var Masonry : any;

@Component({
  selector: 'app-canvas-video',
  templateUrl: './canvas-video.component.html',
  styleUrls: ['./canvas-video.component.css']
})

export class CanvasVideoComponent implements OnInit {
  //private c: any;
  //private ctx: any;
  //private twitter: TwitterPost[];
  private posts = [];


  constructor(private socket: Socket) {
    //this.twitter = [];
  }

  ngOnInit() {
    document.getElementById('postContainer').style.display = 'none'; // Kanske funkar, idk?
    //this.c = document.getElementById('canvas');
    //this.ctx = this.c.getContext('2d');
    //window.addEventListener('resize', this.resizeCanvas, false);
    //this.resizeCanvas();

    var elem = document.querySelector('.grid');
    var container = document.querySelector('#container');

    var msnry = new Masonry( elem, {
      columnWidth: 200,
      itemSelector: '.grid-item',
      fitwidth: true
    });
    
    this.socket.fromEvent<any>('getPosts').subscribe(posts => {
      for(var i = 0; i < posts.length; i++) {
        posts[i].instagram = posts[i].instagram.replace(/ /g,'');
        posts[i].twitter   = posts[i].twitter.replace(/ /g,'');
        posts[i].tumblr    = posts[i].tumblr.replace(/ /g,'')
      }
      this.posts = posts;
      console.log(posts);
    });

  }

  resizeCanvas() {
    //this.ctx.canvas.width  = window.innerWidth;
    //this.ctx.canvas.height = window.innerHeight;
  }

  play() {
    this.socket.emit('getPosts');
    document.getElementById('postContainer').style.display = 'block';
  }

  addPosts() {
    
  }

  draw = () => {
    /*
    this.ctx.canvas.width  = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    for ( let post of this.twitter) {
      post.render(this.ctx);
    }
    window.requestAnimationFrame(this.draw);
    */
  }

}
