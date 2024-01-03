import { round } from "../utils/maths.js";

export default class Timer
{

    constructor(FPS = 1000){
        this.FPS = (1 / FPS);
        this.realFPS = FPS;
        this.currentFPS = FPS;
        this.totTime = 0;
        this.lastTime = 0;
        this.lastTick = 0;
    }

    updateProxy = time => {
        this.totTime += (time - this.lastTime) / 1000;
        
        while(this.totTime > this.FPS){
            this.update();
            this.updateFPS();
            this.lastTick = performance.now();
            this.totTime -= this.FPS;
        }
        
        this.lastTime = time;
        this.enqueue();
    }

    updateFPS(){
        const deltaTime = performance.now() - this.lastTick;
        const deltaMS = deltaTime / 1000;

        this.currentFPS = round(this.FPS / deltaMS) * this.realFPS;
        this.currentFPS === Infinity ? this.realFPS : this.currentFPS;
    }

    enqueue(){
        requestAnimationFrame(this.updateProxy);
    }

    dequeue(){
        cancelAnimationFrame(this.updateProxy);
    }

    start(callback){
        this.update = callback;
        this.enqueue();
    }

    stop(){
        this.dequeue();
    }

}