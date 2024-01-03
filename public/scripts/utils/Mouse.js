import { abs, degToRads } from "./maths.js";
import { Vector } from "./utils.js";

export default class Mouse{

    constructor(canvas, relativeWidth = innerWidth)
    {
        this.pos             = new Vector(innerWidth / 2, innerHeight / 2);
        this.keys            = new Map();
        this.lastX           = this.pos.x;
        this.lastY           = this.pos.y;
        this.canvas          = canvas;
        this.offsetX         = 0;
        this.isMoving        = false;
        this.lastMovement    = 0;
        this.minimumTime     = 5;
        this.rotationSpeed   = 1;
        this.distanciaMinima = 1;
        this.sensibility     = 6;
        this.maxDistance     = 200;
        this.isInCorner      = false;
        this.relativeWidth   = relativeWidth;
        this.halfRelWidth    = this.relativeWidth / 2;
    }

    /**
     * Mouse Keymapping
     */
    setup(){
        this.keys.set(0x1 , false);               //Left click
        this.keys.set(0x2 , false);               //Mouse wheel pressed
        this.keys.set(0x3 , false);               //Right click

        this.addListeners();
    }

    get x()
    {
        return this.pos.x;
    }

    set x(x = 0)
    {
        this.pos.x = x;
    }

    get y()
    {
        return this.pos.y;
    }

    set y(y = 0)
    {
        this.pos.y = y;
    }
    
    addListeners()
    {
        window.addEventListener("mouseup"    , this.mouseup          );
        window.addEventListener("mousedown"  , this.mousedown        );
        //window.addEventListener("mousemove"  , this.mousemove        );
        window.addEventListener("contextmenu", this.cancelContextMenu);
    }

    cancelContextMenu = ev => 
    {
        ev.stopImmediatePropagation();
        ev.preventDefault();
    }

    listenMouseMove = () => 
    {
        if (document.pointerLockElement === this.canvas) 
        {
            console.log("The pointer lock status is now locked");
            document.addEventListener("mousemove", this.mousemove, false);
        } 
        else
        {
            console.log("The pointer lock status is now unlocked");
            document.removeEventListener("mousemove", this.mousemove, false);
        }
    }

    mousemove = ev => 
    {
        const deltaX = ev.movementX;

        this.offsetX += (deltaX / 2);
        this.offsetX = this.offsetX < 0 ? this.canvas.width - 1 : this.offsetX;
        this.offsetX %= this.canvas.width;

        const ahora = Date.now();

        if(this.x <= window.innerWidth * 0.2)
        {
            this.x = (innerWidth / 2) | 0;
            this.y = (innerHeight / 2) | 0;

            this.isMoving = false;
            this.rotationSpeed = -1;
            this.isInCorner = true;

            // Actualizar la posición anterior y la marca de tiempo del último movimiento
            this.lastX = this.x;
            this.lastY = this.y;

            return;
        }
        else if(this.x >= window.innerWidth * 0.8)
        {
            this.x = (innerWidth / 2) | 0;
            this.y = (innerHeight / 2) | 0;

            this.isMoving = false;
            this.rotationSpeed = 1;
            this.isInCorner = true;

            // Actualizar la posición anterior y la marca de tiempo del último movimiento
            this.lastX = this.x;
            this.lastY = this.y;

            return;
        }

        // Verificar si ha pasado suficiente tiempo desde el último movimiento
        if (ahora - this.lastMovement < this.minimumTime) {
            this.isMoving = false;
            this.rotationSpeed = 0;
            return;
        }
    
        this.x += ev.movementX;
        this.y += ev.movementY;
    
        // Si es el primer movimiento o la posición anterior es nula, actualizar la posición anterior
        if (this.lastX === null || this.lastY === null) {
            this.lastX = this.x;
            this.lastY = this.y;

            return;
        }
    
        // Calcular la distancia entre la posición actual y la posición anterior
        const distancia = (this.x - this.lastX) * this.sensibility;
    
        // Verificar si se ha movido lo suficiente
        if (abs(distancia) >= this.distanciaMinima) {
            this.isMoving = true;
            this.rotationSpeed = -degToRads(ev.movementX) * 2.2;
            //console.log("El usuario ha movido el cursor la distancia requerida: ", distancia);
        }
        else
        {
            this.isMoving = false;
        }
    
        // Actualizar la posición anterior y la marca de tiempo del último movimiento
        this.lastX = this.x;
        this.lastY = this.y;

        this.lastMovement = ahora;
    }

    mouseup   = ev => this.keys.get(ev.which) & this.keys.set(ev.which, false);
    mousedown = ev => this.keys.get(ev.which) & this.keys.set(ev.which, true );

}