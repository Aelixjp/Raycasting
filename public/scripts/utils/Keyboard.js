export default class Keyboard{

    constructor(){
        this.keys = new Map();
    }

    setup()
    {
        this.keys.set(0x57, false);               //W
        this.keys.set(0x41, false);               //A
        this.keys.set(0x53, false);               //S
        this.keys.set(0x44, false);               //D

        this.addListeners();
    }

    addListeners(){
        window.addEventListener("keyup"  , this.release);
        window.addEventListener("keydown", this.keydown);
    }

    keydown = ev => this.keys.get(ev.keyCode) & this.keys.set(ev.keyCode, true);
    release = ev => this.keys.get(ev.keyCode) & this.keys.set(ev.keyCode, false);

}