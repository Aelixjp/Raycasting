import Player from "./Player.js";
import { degToRads, cos, tan } from "./utils/maths.js";
import { Dimension, Vector } from "./utils/utils.js";

export default class Board
{
    #vmap;
    #scene;
    #rayColor;
    #gridColor;
    #showGrid = false;
    #wallColor = "#000";
    #screenColor = "grey";
    #precision = 1 - cos(degToRads(1));

    constructor(ctx, timer, loader, width, height)
    {
        this.ctx    = ctx;
        this.timer  = timer;
        this.loader = loader;

        this.size    = new Dimension(window.innerWidth, window.innerHeight);
        this.mapSize = new Dimension(width, height);
        this.player  = new Player(this, this.ctx, this.halfWidth, this.halfHeight);
    }

    get canvas()
    {
        return this.ctx.canvas;
    }

    get width()
    {
        return this.size.width;
    }

    get height()
    {
        return this.size.height;
    }

    get scene()
    {
        return this.#scene;
    }

    set scene(scene)
    {
        this.#scene = scene;
    }

    set width(width)
    {
        this.size.width = width;
        this.canvas.width = width;
    }

    set height(height)
    {
        this.size.height = height;
        this.canvas.height = height;
    }

    get mapWidth()
    {
        return this.mapSize.width;
    }

    set mapWidth(width = 0)
    {
        this.mapSize.width = width;
    }
    
    get mapHeight()
    {
        return this.mapSize.height;
    }

    set mapHeight(height = 0)
    {
        this.mapSize.height = height;
    }

    get vmap()
    {
        return this.#vmap;
    }

    get wmap(){
        return this.mapWidth / this.#vmap[0].length;
    }

    get hmap(){
        return this.mapHeight / this.#vmap.length;
    }

    get halfWidth()
    {
        return this.mapWidth / 2;
    }

    get halfHeight()
    {
        return this.mapHeight / 2;
    }

    get gridColor()
    {
        return this.#gridColor;
    }

    set gridColor(color)
    {
        this.#gridColor = color;
    }

    get rayColor()
    {
        return this.#rayColor;
    }

    set rayColor(color = "grey")
    {
        this.#rayColor = color;
    }

    get screenColor()
    {
        return this.#screenColor;
    }

    set screenColor(screenColor)
    {
        this.#screenColor = screenColor;
    }

    get wallColor()
    {
        return this.#wallColor;
    }

    set wallColor(wallColor = "#000")
    {
        this.#wallColor = wallColor;
    }

    get currentSector()
    {
        return this.player.currentSector;
    }

    get resources()
    {
        return this.loader.resources;
    }

    get showGrid()
    {
        return this.#showGrid;
    }

    set showGrid(showGrid = false)
    {
        this.#showGrid = showGrid;
    }

    get playerAngle()
    {
        return this.player.angle;
    }

    get precision()
    {
        return this.#precision;
    }

    set precision(precision)
    {
        this.#precision = precision;
    }

    setup()
    {
        this.width = this.size.width;
        this.height = this.size.height;

        this.#vmap = this.resources.get("map");
    }

    setupScene(scene)
    {
        this.scene = scene;
    }

    setupPlayer(playerRadius = 5, playerVel)
    {
        this.player.setup(playerVel, playerRadius);
        this.player.rayColor = this.rayColor;
    }

    setupPlayerRays()
    {
        this.player.setupRays(this.mapWidth, this.mapHeight);
    }

    setupRaycolor(color = "blue")
    {
        this.player.rayColor = color;
    }

    getTexture(textureName)
    {
        return this.loader.resources.get(textureName);
    }

    clearBG()
    {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    drawBG(){
        this.ctx.save();
        this.ctx.fillStyle = this.screenColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    drawGrid(woffset, hoffset, i, j){
        this.ctx.save();
        this.ctx.strokeStyle = this.gridColor;
        this.ctx.strokeRect(woffset * j, hoffset * i, woffset, hoffset);
        this.ctx.restore();
    }

    drawCameraAngle()
    {
        this.player.drawCameraAngle();
    }

    drawFPS(fontSize = 50){
        this.ctx.save();
        this.ctx.fillStyle = "#fff";
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillText(`FPS: ${this.timer.currentFPS}`, this.width - 220, 75);
        this.ctx.restore();
    }

    drawCurrentSector(fontSize = 25){
        this.ctx.save();
        this.ctx.fillStyle = "#fff";
        this.ctx.font = `${fontSize}px serif`;

        this.ctx.fillText(`Current sector: ${this.currentSector.x}, ${this.currentSector.y}`, 60, this.height - 50);
        this.ctx.restore();
    }

    renderPlayer()
    {
        this.player.draw();
        this.player.proyect();
    }

    updatePlayer()
    {
        
        this.player.move();
        this.player.updateCurrentSector(this.wmap, this.hmap);
    }

    renderMap(){
        this.ctx.save();
        this.ctx.fillStyle = this.wallColor;

        this.#vmap.forEach((rows, i) => {
            rows.forEach((el, j) =>{
                if(el != "_")
                {
                    this.ctx.fillStyle = this.wallColor;
                    this.ctx.fillRect(this.wmap * j, this.hmap * i, this.wmap, this.hmap);
                }
                else
                {
                    this.ctx.fillStyle = this.screenColor;
                    this.ctx.fillRect(this.wmap * j, this.hmap * i, this.wmap, this.hmap);
                }

                if(this.showGrid)
                {
                    this.ctx.fillStyle = this.wallColor;
                    this.drawGrid(this.wmap, this.hmap, i, j);
                }
            });
        });

        this.ctx.restore();
    }

    drawDebugTriangleLines(x, y, rx, ry, {colora = "orange", colorb = "aqua", colorc = "red"} = {})
    {
        this.ctx.save();
            
        this.ctx.beginPath();
        this.ctx.strokeStyle = colora;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + rx, y + ry);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = colorb;
        this.ctx.moveTo(x + rx, y + ry);
        this.ctx.lineTo(x + rx, y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = colorc;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + rx, y);
        this.ctx.stroke();

        this.ctx.restore();
    }

    getNearestRaypoint()
    {
        const MAX_INTEGER = 99999;

        this.player.rays.forEach((ray, i) => {
            let collision = false;
            let collisionV = false;
            let isHorizontal = false;
            
            const x = this.player.x;
            const y = this.player.y;
            const angle = ray.angle;
            const rangle = degToRads(angle);
            const top = ray.direction.lookingTOP;
            const left = ray.direction.lookingLEFT;
            
            const xoff  = left ? (x % this.wmap) : this.wmap - (x % this.wmap);
            const yoff  = top  ? (y % this.hmap) : this.hmap - (y % this.hmap);

            let nx = 0;
            let ny = 0;

            let dxH = 0;
            let dyH = 0;
            let dxV = 0;
            let dyV = 0;

            let xstep = 0;
            let ystep = 0;

            /******************************** COLISION HORIZONTAL **************************/
            if(angle === 0 || angle === 180)
            {
                dxH = MAX_INTEGER;
                dyH = MAX_INTEGER;
            }
            else
            {
                nx = (x + xoff);
                ny = (y + yoff);
                
                dyH = ny - y;
                dxH = dyH / tan(rangle);

                dxH = (left && dxH > 0 || !left && dxH < 0) ? -dxH : dxH;
                dyH = (top  && dyH > 0 || !top  && dyH < 0) ? -dyH : dyH;

                dxH = left ? dxH - this.precision : dxH;
                dyH = top  ? dyH - this.precision : dyH;

                ystep = top ? -this.hmap : this.hmap;
                xstep = this.wmap / tan(rangle);
                xstep = (left && xstep > 0 || !left && xstep < 0) ? -xstep : xstep;

                dxH = x + dxH;
                dyH = y + dyH;

                while(!collision && dxH > 0 && dxH <= this.mapWidth && dyH > 0 && dyH <= this.mapHeight)
                {
                    if(this.player.checkCollision(dxH, dyH))
                    {
                        collision = true;
                    }
                    else
                    {
                        dxH += xstep;
                        dyH += ystep;
                    }
                }
            }
            /***************************** FIN COLISION HORIZONTAL *************************/


            /********************************* COLISION VERTICAL ***************************/
            if(angle === 90 || angle === 270)
            {
                dxV = MAX_INTEGER;
                dyV = MAX_INTEGER;
            }
            else
            {
                nx = (x + xoff);
                ny = (y + yoff);

                dxV = nx - x;
                dyV = dxV * tan(rangle);

                dxV = (left && dxV > 0 || !left && dxV < 0) ? -dxV : dxV;
                dyV = (top  && dyV > 0 || !top  && dyV < 0) ? -dyV : dyV;

                dxV = left ? dxV - this.precision : dxV;
                dyV = top  ? dyV - this.precision : dyV;

                xstep = left ? -this.wmap : this.wmap;
                ystep = this.hmap * tan(rangle);
                ystep = (top && ystep > 0 || !top && ystep < 0) ? -ystep : ystep;

                dxV = x + dxV;
                dyV = y + dyV;

                while(!collisionV && dxV > 0 && dxV <= this.mapWidth && dyV > 0 && dyV <= this.mapHeight)
                {
                    if(this.player.checkCollision(dxV, dyV))
                    {
                        collisionV = true;
                    }
                    else
                    {
                        dxV += xstep;
                        dyV += ystep;
                    }
                }
            }
            /****************************** FIN COLISION VERTICAL **************************/
            
            const distH = Vector.distance(x, y, dxH, dyH);
            const distV = Vector.distance(x, y, dxV, dyV);

            if(distH < distV)
            {
                ray.p2.x = dxH;
                ray.p2.y = dyH;

                isHorizontal = true;
            }
            else
            {
                ray.p2.x = dxV;
                ray.p2.y = dyV;

                isHorizontal = false;
            }

            this.scene.render(ray, i, isHorizontal);
        });
    }

}