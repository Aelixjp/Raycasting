import { Dimension } from "./utils.js";
import Player from "./Player.js";
import Loader from "./Loader.js";

export default class Board{

    constructor(ctx, width, height, color = "grey"){
        this.ctx = ctx;
        this.size = new Dimension(width, height);
        this.color = color;
        this.canvas = this.ctx.canvas;
        this.player = new Player(this.ctx, this.size.width / 2, this.size.height / 2, 5);
        this.loader = new Loader();
    }

    setup(playerVel){
        this.canvas.width  = this.size.width;
        this.canvas.height = this.size.height;

        this.player.setup(playerVel);
        return this.loader.loadSources();
    }

    drawBG(){
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.clearRect(0, 0, this.size.width, this.size.height);
        this.ctx.fillRect(0, 0, this.size.width, this.size.height);
        this.ctx.restore();
    }

    renderMap(){
        const vmap = this.loader.resources.get("map");
        const wmap = this.size.width / vmap[0].length;
        const hmap = this.size.height / vmap.length;

        this.ctx.save();
        this.ctx.fillStyle = "#000";

        vmap.forEach((rows, i) => {
            rows.forEach((el, j) =>{
                if(el != 0){
                    this.ctx.fillRect(wmap * j, hmap * i, wmap, hmap);
                }
            });
        });

        this.ctx.restore();
    }

}