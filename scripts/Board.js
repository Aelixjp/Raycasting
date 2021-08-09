import { Dimension } from "./utils.js";
import Player from "./Player.js";

export default class Board{

    constructor(ctx, width, height, color = "#000"){
        this.ctx = ctx;
        this.size = new Dimension(width, height);
        this.color = color;
        this.canvas = this.ctx.canvas;
        this.player = new Player(this.ctx, this.size.width / 2, this.size.height / 2, 5);
    }

    setup(playerVel){
        this.canvas.width  = this.size.width;
        this.canvas.height = this.size.height;

        this.player.setup(playerVel);
    }

    drawBG(){
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.clearRect(0, 0, this.size.width, this.size.height);
        this.ctx.fillRect(0, 0, this.size.width, this.size.height);
        this.ctx.restore();
    }

}