import { abs, cos, degToRads, floor, tan } from "./utils/maths.js";
import { Vector, Dimension } from "./utils/utils.js";

export default class Scene
{
    constructor(ctx, board, x, y, width = window.innerWidth, height = window.innerHeight)
    {
        this.ctx = ctx;
        this.board = board;
        this.pos = new Vector(x, y);
        this.size = new Dimension(width, height);
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

    get width()
    {
        return this.size.width;
    }

    set width(width = 0)
    {
        this.size.width = width;
    }

    get height()
    {
        return this.size.height;
    }

    set height(height = 0)
    {
        this.size.height = height;
    }

    get mapWidth()
    {
        return this.board.mapWidth;
    }

    get mapHeight()
    {
        return this.board.mapHeight;
    }

    get canvas()
    {
        return this.ctx.canvas;
    }

    get wmap()
    {
        return this.width / this.board.vmap[0].length;
    }

    get hmap()
    {
        return this.height / this.board.vmap.length;
    }

    setup()
    {
        this.x = 0//this.board.mapWidth;
    }

    clearBG()
    {
        this.ctx.save();
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
        this.ctx.restore();
    }

    drawBG(sky)
    {
        /*this.ctx.save();
        this.ctx.beginPath();
        //this.ctx.fillStyle = "#303030";
        this.ctx.fillStyle = "blueviolet";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.restore();*/

        const offsetX = this.board.player.mouse.offsetX;

        this.ctx.drawImage(sky, -offsetX, 0, this.canvas.width, this.canvas.height / 2);
        this.ctx.drawImage(sky, -offsetX + this.canvas.width, 0, this.canvas.width, this.canvas.height / 2);
    }

    drawSimpleSky(skyColor = "blueviolet")
    {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = skyColor;
        this.ctx.fillRect(this.x, this.y, this.width, this.height / 2);
        this.ctx.restore();
    }

    drawSimpleFloor(groundcolor = "#303030")
    {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = groundcolor;
        this.ctx.fillRect(this.x, this.y + this.height / 2, this.width, this.height / 2);
        this.ctx.restore();
    }

    renderWallsWithoutTexturing(maxLightRange, brightness, xoff, middleScreen, halfLine, xstep, lineH)
    {
        let [r, g, b] = [0, maxLightRange, 0];
        
        const newColor = maxLightRange - (brightness * maxLightRange | 0); g = newColor;

        this.ctx.save();
        this.ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.fillStyle   = `rgb(${r}, ${g}, ${b})`;

        this.ctx.beginPath();
        this.ctx.fillRect(xoff, middleScreen - halfLine, xstep, lineH);
        this.ctx.restore();
    }

    render(ray, i, isHorizontal)
    {
        const rays         = this.board.player.rays;
        const xstep        = (this.width / rays.length) | 0;   //Rectangle projection width acording screen width
        const xoff         = this.x + (xstep * i);
        const spriteSheet  = this.board.getTexture("wall_textures");
        const tileFactor   = spriteSheet.tileSize / this.board.hmap;
        const middleScreen = (this.height / 2);                 

        const maxLightRange = 0xff;                     //Max luminescence
        
        const playerAngle = this.board.player.angle;    //Angle of the player in degrees

        //Original point of collision of the ray according the map
        const ray2x = ray.p2.x;
        const ray2y = ray.p2.y;

        //Point of collision transformed in tiles of map
        const casillaX = parseInt(ray2x / this.board.wmap);
        const casillaY = parseInt(ray2y / this.board.hmap);
        
        //Texture of the collision (a number between 1 and 64 for example), represents the entire tile
        const casilla = this.board.vmap[casillaY][casillaX];

        //The specific origin point of the texture (a number between 1 and tileSize - 1)
        let tx = floor(((ray2x * tileFactor) | 0) % spriteSheet.tileSize);
        let ty = floor(((ray2y * tileFactor) | 0) % spriteSheet.tileSize);

            //Invertir los tiles para que concuerden con el sentido original en cualquier direccion
            tx = ray.direction.lookingBOTTOM ? spriteSheet.tileSize - tx - 1 : tx;
            ty = ray.direction.lookingLEFT   ? spriteSheet.tileSize - ty - 1 : ty;

        //Si la colision es horizontal usamos el calculo con la x, de lo contrario usamos la Y
        const texture = isHorizontal ? tx : ty;

        //Rangos de la textura a la que apunta el rayo
        const tileRanges = spriteSheet.getTile(casilla == 1 ? 19 : casilla);

        const firstX = tileRanges[0] + texture;     //El origen de la textura mas el pixel especifico
        const firstY = tileRanges[1];               //El origen vertical siempre sera el mismo

        const deltaAngle = this.board.player.normalizeAngle(playerAngle - ray.angle);
        const distance   = ray.distance * cos(degToRads(deltaAngle));

        let lineH = (this.mapWidth / distance) * this.wmap;
            lineH = lineH > this.height ? this.height : lineH;

        const halfLine = lineH / 2;

        //CORREGIR BRILLO
        const brightness = (distance / this.mapWidth);

        this.ctx.globalAlpha = 1;
        this.renderTexture2(spriteSheet, firstX, firstY, 1, spriteSheet.tileSize, xoff, (middleScreen - halfLine) | 0, xstep, lineH | 0);
        
        //Fast apply for brightness
        this.ctx.save();
        this.ctx.fillStyle = '#00000';
        this.ctx.globalAlpha = brightness;
        this.ctx.fillRect(xoff, (middleScreen - halfLine), xstep, lineH)
        this.ctx.restore();

        //this.renderWallsWithoutTexturing(maxLightRange, brightness, xoff, middleScreen, halfLine, xstep, lineH);
        
    }

    renderTexture(spriteSheet, tileX, tileY, width, height)
    {
        const img = spriteSheet.srcImg;
        const texture = spriteSheet.tiles[tileY - 1][tileX - 1];

        const sx = texture[0];
        const sy = texture[1];
        const sw = texture[2];
        const sh = texture[3];
 
        this.ctx.drawImage(img, sx, sy, sw, sh, this.x, this.y, width, height);
    }

    renderTexture2(spriteSheet, sx, sy, swidth, sheight, x, y, width, height)
    {
        const img = spriteSheet.srcImg;
 
        this.ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
    }

}