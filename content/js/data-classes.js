var facilityUnit = function(id, count, width, length, height, regularPrice, discountedPrice, isClimateControlled, hasAlarm, hasPowerOutlet, hasDriveUpAccess, promotion, active) {
	facUnits = {};
	fac.id = id;
	fac.count = count;
	fac.width = width;
	fac.length = length;
	fac.height = height;
	fac.regularPrice = regularPrice;
	fac.discountedPrice = discountedPrice;
	fac.hasAlarm = hasAlarm;
	fac.hasPowerOutlet = hasPowerOutlet;
	fac.hasDriveUpAccess = hasDriveUpAccess;
	fac.promotion = promotion;
	fac.active = active;
	
	facUnits.editFacilityUnit = function(obj) {
		
	}
}

var facility = function() {
	fac = {};
	fac.units
}