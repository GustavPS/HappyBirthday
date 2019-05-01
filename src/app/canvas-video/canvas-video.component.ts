import { Component, OnInit } from '@angular/core';
import {TwitterPost} from '../twitter-post';

@Component({
  selector: 'app-canvas-video',
  templateUrl: './canvas-video.component.html',
  styleUrls: ['./canvas-video.component.css']
})
export class CanvasVideoComponent implements OnInit {
  private c: any;
  private ctx: any;
  private twitter: TwitterPost[];

  constructor() {
    this.twitter = [];
  }

  ngOnInit() {
    this.c = document.getElementById('canvas');
    this.ctx = this.c.getContext('2d');
    window.addEventListener('resize', this.resizeCanvas, false);
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.c.width = window.innerWidth;
    this.c.height = window.innerHeight;
  }

  play() {
    this.twitter.push(new TwitterPost(
      'https://bloggingwizard.com/wp-content/uploads/2018/05/okay-marketing-link-to-influencers-How-To-Get-More-Twitter-Followers-BW.jpg',
      this.c.width,
      0
    ));
    this.twitter.push(new TwitterPost(
      'https://bloggingwizard.com/wp-content/uploads/2018/05/okay-marketing-link-to-influencers-How-To-Get-More-Twitter-Followers-BW.jpg',
      this.c.width,
      500
    ));

    window.requestAnimationFrame(this.draw);
  }

  addPosts() {
    
  }

  draw = () => {
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    for (let post: TwitterPost of this.twitter) {
      post.render(this.ctx);
    }
    window.requestAnimationFrame(this.draw);
  }

}
