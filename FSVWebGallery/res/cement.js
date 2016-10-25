// Cement jAlbum Skin Rel. 1.3.5 (c) Pierre M. 2013-2015
//
//	Rainbow frame helper
//
function rainbowColors() {
	var oldColorT = cementOptions.frameColor;
	cementOptions.frameColor++;
	$('.switch-rainbow-border').removeClass('border-color' + oldColorT % cementOptions.rainbowColors)
								.addClass('border-color' + cementOptions.frameColor % cementOptions.rainbowColors);
	$('a.original').removeClass('color' + oldColorT % cementOptions.rainbowColors)
								.addClass('color' + cementOptions.frameColor % cementOptions.rainbowColors);
	$('.anchorfolder').removeClass('color' + oldColorT % cementOptions.rainbowColors)
								.addClass('color' + cementOptions.frameColor % cementOptions.rainbowColors);
	if(cementOptions.rainbow)
		setTimeout(rainbowColors, cementOptions.rainbowTimer);
};
//
//
//	Functions for dealing with option storage, restoration, and changes.
//
function saveCookie() {
	$.cookie.json = true;
	$.cookie(cementOptions.cookieName, cementOptions, {path: '/'});
	//console.log("cookie saved: " + JSON.stringify(cementOptions));
	displayCookie();
}

function displayCookie() {
	$.cookie.json = true;
	var temp = $.cookie(cementOptions.cookieName)['undefined'];
/*	if (temp != undefined)
		console.log("cookie loaded: " + JSON.stringify(temp));
	else
		console.log("no cookie (undefined).");*/
}

function resetCookie() {
	$.removeCookie(cementOptions.cookieName);
	//window.location.reload();
}

function restoreCookie() {
	$.cookie.json = true;
	temp = $.cookie(cementOptions.cookieName)['undefined'];
		
	if (temp != undefined) {
		//console.log("cookie loaded: " + JSON.stringify(temp));
		if (temp.version != undefined) {
			//console.log("cookie version: " + temp.version);
			if (temp.version == cementOptions.version) {
				//console.log("cookie is " + temp);
				oldsize = cementOptions.maxThumbWidth;
				cementOptions = temp;
				cementOptions.maxThumbWidth = oldsize;
			} else {
				//console.log("cookie has wrong version, reset");
				$.removeCookie(cementOptions.cookieName);
				saveCookie();
			}
		} else {
			//console.log("cookie has no version? wrong cookie?");	
			$.removeCookie(cementOptions.cookieName);
			saveCookie();
		}
	} else {
		//console.log("new cookie");	
		saveCookie();
	}
	restoreOptions();
}

function switchStyle(s) {
	function swattr(a, sty) {
		if (a.indexOf(sty) != -1)
			return a; // image already of requested style. No switch.
		if (a.indexOf("-light.png") == -1) {
			oldstr = "-dark.png";
			newstr = "-light.png";
		} else {
			oldstr = "-light.png";
			newstr = "-dark.png";
		}
		return a.replace(RegExp(oldstr), newstr);
	};

/* This check sometimes cause problem, when bgcolor is ok, but
   images haven't been switched. So remove it while I do not understand.

	var curstyle = $('body').css('color');
	if ( (s == 'dark'  && curstyle == 'rgb(238, 238, 238)')
	  || (s == 'light' && curstyle == 'rgb(17, 17, 17)') )
		return false; // already in current style
*/
	var bgcolor  = (s == 'light') ? '#eeeeee' : '#000';
	var fgcolor  = (s == 'light') ? '#111111' : '#eeeeee';
	var bg2color = (s == 'light') ? 'rgba( 240, 240, 240, 0.7 )' : 'rgba( 0, 0, 0, 0.7 )';
	//from style.css
	$('body').css('background', bgcolor);
	$('body').css('color', fgcolor);
	$('a').css('color', fgcolor);
	$('a:hover').css('color', 'red');
	$('.forkit-curtain').css('background', bg2color);
	//text overlay has color same as background color
	$('.textoverlay').css('color', bgcolor);
	//icons and overlay images
	// $('.switchstyle').each(function() {
	// 	$(this).attr('src', swattr($(this).attr('src'), s));
	// });
	cementOptions.styleName = s;
	return false;
};

function showHideText() {
	// text under thumbnails
	$('#thumbTitle').prop("checked", cementOptions.thumbTitle);
	$('.thumbTitle').toggle(cementOptions.thumbTitle);
	$('#thumbComment').prop("checked", cementOptions.thumbComment);
	$('.thumbComment').toggle(cementOptions.thumbComment);
	$('#thumbExif').prop("checked", cementOptions.thumbExif);
	$('.thumbExif').toggle(cementOptions.thumbExif);
	$('.thumbText').css("margin-bottom",
		((cementOptions.thumbTitle||cementOptions.thumbComment||cementOptions.thumbExif) ? "10px" : "0px") );
	//$('.thumbText').toggle(cementOptions.thumbTitle||cementOptions.thumbComment||cementOptions.thumbExif);

	// text under fancybox images
	$('#imageNumber').prop("checked", cementOptions.imageNumber);
	$('#imageTitle').prop("checked", cementOptions.imageTitle);
	$('#imageComment').prop("checked", cementOptions.imageComment);
	$('#imageExif').prop("checked", cementOptions.imageExif);
}

function restoreOptions() {
	//console.log('restoring...');	
	// style
	$('input').filter(':checkbox[name=styleName]').prop('checked',false);
	$('#'+cementOptions.styleName).prop('checked',true);
	switchStyle(cementOptions.styleName);

	// options
	$('#rainbow').prop("checked", cementOptions.rainbow);
	rainbowColors();	// if checked: will start rainbow frames;
						// if not check: will install a color depending on frameColor index.
	$('#galleryComments').prop("checked", cementOptions.galleryComments);
	$('.galleryComments').toggle(cementOptions.galleryComments);
	
	// separate function beacuse called from elsewhere
	showHideText();

	// special isotope options
	// Note: restoreOptions() is called BEFORE initiating isotope
	// so options are restored before init
	//console.log('trying isotope ...');
	if(cementOptions.layoutlibrary == "isotope") {
		//console.log('... doing isotope ...');
		$('#sortAscending').prop("checked", cementOptions.sortAscending);
		$(function() {
    		$("#sortType").val(cementOptions.sortCriteria);
			$("#arrangeType").val(cementOptions.isotopelayout);
		});
		//console.log('restore filter: ' + cementOptions.isotopefilter);
		$("[name=filter]").val([cementOptions.isotopefilter]);
		//$('input').filter(':checkbox[name=filter]').prop('checked',false);
		//$('input').filter(':checkbox[data-filter="'+cementOptions.isotopefilter+'"]').prop('checked',true);
		//console.log('... done isotope ...');
	}
	//console.log('done restoring.');
}
//
//
//	Functions for Playful layout adjustments
//
old_width  = 0;
old_height = 0;
function computeWidth() {
	var containerWidth = $('#container').width();
	//console.log("container is " + containerWidth);
	var ef = (cementOptions.maxThumbWidth != 0) ? Math.floor(containerWidth/cementOptions.maxThumbWidth) : 1;
	if (ef < 1) ef = 1;
	cementOptions.enlargeFactor = ef;
	//console.log("enlarge factor is " + cementOptions.enlargeFactor);
}

function resizeImage(imgtag, resize_mode) {
	function isThumb() {
		var a = imgtag.attr('src');
		return (a.indexOf("thumbs") != -1);//change if thumbs folder name does not containt "thumbs"!!
	}
	function switchSrc() {
		var oldsrc = imgtag.attr('src');
		var newsrc = imgtag.attr('data-cement-altsrc');
		imgtag.attr('src', newsrc);
		imgtag.attr('data-cement-altsrc', oldsrc);
	}
	function saveSize() {
		old_width  = imgtag.width();
		old_height = imgtag.height();
	}
	function resetSrc() {
		if( ! isThumb() ) {
			switchSrc();
			saveSize();
			imgtag.width(imgtag.attr('data-cement-width'));
			imgtag.height(imgtag.attr('data-cement-height'));
		}
	}
	function resizeParent() { // enlarge/reduce parent to image + whatever the parent had in addition to img.
		var iw = imgtag.width();
		var ih = imgtag.height();
		var pow = old_width; //imgtag.parent().width();
		var poh = old_height; //imgtag.parent().height();
		//console.log('old image: '+old_width+'x'+old_height+', div: '+pow+'x'+poh+'.')
		pnw = (pow - old_width)  + iw;
		pnh = (poh - old_height) + ih;
		imgtag.parent().width(pnw);
		imgtag.parent().height(pnh);
		//console.log('new image: '+iw+'x'+ih+', div: '+pnw+'x'+pnh+'.');
	}
	function enlargeSrc() {
		if( isThumb() )
			switchSrc();
		saveSize();
		across = imgtag.attr('data-cement-across');
		newwidth = Math.floor(cementOptions.enlargeFactor * imgtag.attr('data-cement-width')  / across);
		maxwidth = imgtag.attr('data-cement-maxwidth');
		if(newwidth > maxwidth) {
			newwidth = maxwidth;
			newheight = imgtag.attr('data-cement-maxheight');
		} else {
			newheight = Math.floor(cementOptions.enlargeFactor * imgtag.attr('data-cement-height') / across);
		}
		imgtag.width( newwidth);
		imgtag.height(newheight);
	}
	
	if (resize_mode) {
		if (! isThumb()) {
			//console.log("doing ... " + imgtag.attr('src'))
			enlargeSrc(); //else, isThumb, do nothing
		}
	} else {
		if (isThumb())
			enlargeSrc();
		else
			resetSrc();
	}
	resizeParent();
}