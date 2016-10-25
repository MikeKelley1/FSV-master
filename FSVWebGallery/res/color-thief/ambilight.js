/* 
 * getGradientPalette
 *
 *    Returns dominant color for top and bottom borders.
 */
ColorThief.prototype.getGradientPalette = function(sourceImage, quality, borderSize) {
	var image = new CanvasImage(sourceImage);
    var imageData  = image.getImageData();
    var pixels     = imageData.data;
	var borderThickness = 0;

	function getPaletteArea(px, py, pw, ph) {
	    var pixelCount = 0;
	    var pixelArray = [];
		for (var i = 0; i < pw; i++)
			for (var j = 0; j < ph; j++)
				if((++pixelCount % quality) == 0) {
			        offset = ( (px + i + (py + j)*image.width) ) * 4;
			        r = pixels[offset + 0];
			        g = pixels[offset + 1];
			        b = pixels[offset + 2];
			        a = pixels[offset + 3];
			        // If pixel is mostly opaque and not white
			        if (a >= 125) {
			            if (!(r > 250 && g > 250 && b > 250)) {
			                pixelArray.push([r, g, b]);
			            }
			        }
				}
		var palette;
		if(pixelArray.length != 0) {
		    var cmap    = MMCQ.quantize(pixelArray, 5);
		    palette = cmap.palette();
		} else { // mostly white... since we return one value one, we return white.
	    	palette = [[255,255,255]];
		}
		return palette[0];
	};

    if (typeof quality === 'undefined') quality = 10;
    if (typeof borderSize === 'undefined') borderSize = 0.1;
	borderThickness = (borderSize < 1) ? Math.floor(image.height * borderSize) :
 							( ( borderSize > (image.height/2) ) ? Math.floor(image.height/2) : borderSize );
	if(borderThickness < 1) borderThickness = 1;
	
	gradientPalette = [];	
	gradientPalette.push(getPaletteArea(0,0,image.width,borderThickness));
	gradientPalette.push(getPaletteArea(0,image.height-borderThickness,image.width,borderThickness));
    image.removeCanvas();
	return gradientPalette;
}