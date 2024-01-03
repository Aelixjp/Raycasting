CanvasRenderingContext2D.prototype.drawImageWithBrightness = 
function(img, brightness = 1, xoff = 0, yoff = 0, ws, wy, x = 0, y = 0, w, h) 
{
    if(brightness > 1 || brightness < 0)
    {
        throw new Error("Ranges for brightness may vary from 0 to 1");
    }
    else
    {
        w ??= ws;
        h ??= wy;

        this.drawImage(img, xoff, yoff, ws, wy, x, y, w, h);
        
        const imageData = this.getImageData(x, y, w, h);
        const data = imageData.data;

        for(let i = 0; i < data.length; i += 4) {
            data[i    ] = (data[i    ]  * brightness) | 0; // red
            data[i + 1] = (data[i + 1]  * brightness) | 0; // green
            data[i + 2] = (data[i + 2]  * brightness) | 0; // blue
        }

        this.clearRect(x, y, w, h);
        this.putImageData(imageData, x, y);

        return imageData;
    }
}