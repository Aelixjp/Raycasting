export default class Spritesheet
{
    #tiles = [];

    constructor(loader, name, { maxRows = 0, maxCols = 0, tileSize = 0, padding = 0 } = {})
    {
        this.name = name;
        this.srcImg = null;
        this.loader = loader;
        this.padding = padding;
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.tileSize = tileSize;
    }

    get tiles()
    {
        return this.#tiles;
    }

    set tiles(tiles)
    {
        this.#tiles = tiles;
    }

    load(src)
    {
        return new Promise(async(res, rej) => {
            const spriteSheetBlob = (await this.loader.load(this.name, src)).data;

            this.srcImg = new Image();

            this.srcImg.onload = () => 
            {
                this.loader.resources.set(this.name, this);
                this.loadTiles();

                res(this.srcImg);
            };
            
            this.srcImg.onerror = rej;
            this.srcImg.src = URL.createObjectURL(spriteSheetBlob);
        });
    }

    getTile(tile)
    {
        --tile;

        const row = (tile / this.maxRows) | 0;
        const col = (tile % this.maxCols) | 0;

        return this.tiles[row][col];
    }

    loadTiles()
    {
        const maxRows = this.maxRows;
        const maxCols = this.maxCols;
        const padding  = this.padding;
        const tileSize = this.tileSize;

        this.tiles = new Array(maxRows).fill(0).map(() => new Array(maxCols));

        for(let y = 0; y < this.tiles.length; y++)
        {
            for(let x = 0; x < this.tiles[y].length; x++)
            {
                this.tiles[y][x] = [
                    (x * tileSize) + (padding * (x + 1)), 
                    (y * tileSize) + (padding * (y + 1)), 
                    tileSize, 
                    tileSize
                ];
            }
        }
    }

}