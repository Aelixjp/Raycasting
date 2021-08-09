import Keyboard   from "./Keyboard.js";
import { Vector, degToRads } from "./utils.js";

export default class Player{

    constructor(ctx, x, y, r, color = "#fff"){
        this.r = r;
        this.pos = new Vector(x, y);
        this.ctx = ctx;
        this.color = color;
        this.cangle = 0x0;
        this.canvas = this.ctx.canvas;
        this.velocity = new Vector(0x2, 0x2);
        this.keyboard = new Keyboard();
        this.angleSpeed = 4;
    }

    setup(playerVel){
        this.keyboard.setup();

        if(playerVel){
            this.velocity = playerVel;
        }
    }

    draw(){
        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle   = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }

    move(){
        //W or S
        if(this.keyboard.keys.get(0x57) || this.keyboard.keys.get(0x53)){
            if(this.keyboard.keys.get(0x57)){
                this.pos.x += this.velocity.x * Math.cos(degToRads(this.cangle));
                this.pos.y -= this.velocity.y * Math.sin(degToRads(this.cangle));
            }else{
                this.pos.x -= this.velocity.x * Math.cos(degToRads(this.cangle));
                this.pos.y += this.velocity.y * Math.sin(degToRads(this.cangle));
            }
        }

        //A or D
        if(this.keyboard.keys.get(0x41) || this.keyboard.keys.get(0x44)){
            if(this.keyboard.keys.get(0x41)){
                this.cangle = (this.cangle + this.angleSpeed) % 0x168;
            }else{
                this.cangle = 
                    this.cangle <= 0 ? 
                        0x168 - (this.cangle + this.angleSpeed) : (this.cangle - this.angleSpeed) % 0x168;
            }
        }
    }

    proyect(){
        this.ctx.save();
        this.ctx.strokeStyle = "#fff";
        this.ctx.moveTo(this.pos.x, this.pos.y);
        this.ctx.lineTo(
            this.pos.x + Math.cos(degToRads(this.cangle)) * 35, 
            this.pos.y - Math.sin(degToRads(this.cangle)) * 35
        );
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawCameraAngle(){
        this.ctx.save();
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "50px serif";
        this.ctx.fillText(this.cangle, 50, 75);
        this.ctx.restore();
    }

}