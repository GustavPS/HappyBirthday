export class TwitterPost {
  private readonly image: any;
  private x: number;
  private y: number;

  constructor(img: string, x: number, y: number) {
    this.image = new Image();
    this.image.src = img;
    this.x = x;
    this.y = y;
  }

  render(ctx) {
    ctx.drawImage(this.image, this.x, this.y);
    this.x--;
  }
}
