export default class Keyboard{

    constructor(){
        this.keys = new Map();
    }

    setup(){
        this.keys.set(0x57, false);               //W
        this.keys.set(0x41, false);               //A
        this.keys.set(0x53, false);               //S
        this.keys.set(0x44, false);               //D

        this.addListeners();
    }

    addListeners(){
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup"  , this.release);
    }

    keydown = ev => {
        if(this.keys.get(ev.keyCode) != undefined) this.keys.set(ev.keyCode, true);
    }

    release = ev =>{
        if(this.keys.get(ev.keyCode) != undefined) this.keys.set(ev.keyCode, false);
    }

}