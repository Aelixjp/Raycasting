import Keyboard   from "./Keyboard.js";
import Ray from "./Ray.js";
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
        this.rays = [];
        this.fov = 60;
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
                this.updateRays(0x41);
            }else{
                this.cangle = 
                    this.cangle - this.angleSpeed <= 0 ? 
                        0x168 + (this.cangle - this.angleSpeed)  : (this.cangle - this.angleSpeed) % 0x168;
                this.updateRays(0);
            }
        }
    }

    updateRays(key){
        this.rays.forEach(ray =>{
            if(key === 0x41){
                ray.angle = (ray.angle + this.angleSpeed) % 0x168;
            }else{
                ray.angle = 
                    ray.angle - this.angleSpeed <= 0 ? 
                        0x168 + (ray.angle - this.angleSpeed) : (ray.angle - this.angleSpeed) % 0x168;
            }
        });
    }

    normalizeAngle(angle){
        return angle >= 0 ? angle % 0x168 : 0x168 + angle;
    }

    setupRays(numberOfRays = 300){
        const max = Math.ceil(numberOfRays / 2);
        const min = numberOfRays - max; 
        const pass = this.fov / numberOfRays;
        const isP = numberOfRays % 2 == 0;
        
        for(let i = -min; i < max; i++){
            this.rays.push(
                new Ray(
                    this.normalizeAngle(!isP ? pass * i : (pass * (i + 1)) - pass / 2), 
                    this.pos.x, 
                    this.pos.y
                )
            );
        }
    }

    proyect(){
        this.rays.forEach(ray =>{
            this.ctx.save();
            this.ctx.strokeStyle = "#fff";
            this.ctx.moveTo(this.pos.x, this.pos.y);
            this.ctx.lineTo(
                ray.p1.x + Math.cos(degToRads(ray.angle)) * ray.p2.x, 
                ray.p1.y - Math.sin(degToRads(ray.angle)) * ray.p2.y
            );
            this.ctx.stroke();
            this.ctx.restore();
        });
    }

    drawCameraAngle(){
        this.ctx.save();
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "50px serif";
        this.ctx.fillText(this.cangle, 50, 75);
        this.ctx.restore();
    }

}