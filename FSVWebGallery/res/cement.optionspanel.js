// Cement jAlbum Skin Rel. 1.3.5 (c) Pierre M. 2013-2015
//
$(document).ready(function() {

$('.checkdone').change(function () {
	if (this.id == "resetCookie") {
		$.removeCookie(cementOptions.cookieName);
		// reset values to defaults
		cementOptions = $.extend({}, cementDefaults);
		// saveCookie();
		alert("Cookie reset. Please reload page.");
		return false;
	}
	cementOptions[this.id] = $(this).prop('checked');
    $("."+this.id).toggle(cementOptions[this.id]);
	if(this.id.substring(0,5) == "thumb") {	// relayout to accomodate divs
		$('.thumbText').css("margin-bottom",
			((cementOptions.thumbTitle||cementOptions.thumbComment||cementOptions.thumbExif) ? "10px" : "0px") );
		reLayout();
	} else if (this.id == "rainbow") {		// restart it.
		if (cementOptions.rainbow) setTimeout(rainbowColors, 5000);
	} else if (this.id == "sortAscending") {
		$('#container').isotope({
			sortBy : cementOptions.sortCriteria,
		    sortAscending : cementOptions.sortAscending
		});
	}
	saveCookie();
	return false;
});
	
$('.radiodone').change(function () {
	switchStyle(this.id);
	saveCookie();	
	return false;
});

$('#sortType').change(function(){
	cementOptions.sortCriteria = $(this).val();
	$('#container').isotope({
		sortBy : cementOptions.sortCriteria,
	    sortAscending : cementOptions.sortAscending
	});
	saveCookie();	
	return false;
});

$('#arrangeType').change(function(){
	cementOptions.isotopelayout = $(this).val();
	$('#container').isotope({
		layoutMode: cementOptions.isotopelayout
	});
	saveCookie();	
	return false;
});

$('.filterdone').change(function(){
	cementOptions.isotopefilter = $(this).val();
	$('#container').isotope({
		filter: cementOptions.isotopefilter
	});
	saveCookie();	
	return false;
});

});
