function formatPrice(price) {
	return price;
}
function booleanToString(value) {
	if(value === true) { return 'Available'; }
	else { return 'Not Available'; }
}

var facilityUnit = function(id, count, width, length, height, regularPrice, discountedPrice, isClimateControlled, hasAlarm, hasPowerOutlet, hasDriveUpAccess, promotion, active) {
	facUnits = {};
	facUnits.id = id;
	facUnits.count = count;
	facUnits.width = width;
	facUnits.length = length;
	facUnits.height = height;
	facUnits.regularPrice = regularPrice;
	facUnits.discountedPrice = discountedPrice;
	facUnits.hasAlarm = hasAlarm;
	facUnits.hasPowerOutlet = hasPowerOutlet;
	facUnits.hasDriveUpAccess = hasDriveUpAccess;
	facUnits.promotion = promotion;
	facUnits.active = active;
	
	facUnits.title = function() {
		if(this.width && this.length) {
			return this.width + "' x " + this.length + "' Unit";
		}
		else {
			return 'unknown';
		}
	}
	
	facUnits.imgSource = function() {
		var baseURL = 'content/images/facilities/units/unitType_';
		
		if(this.width && this.length) {
			return baseURL + this.width + 'x' + this.length + '.png';
		}
		else {
			return 'unknown';
		}
	}
	
	return facUnits;
}

/* we only have one facility so im gonna not pass in the parameters and initialize it on startup */
/* id, name, phoneNumber, streetAddress, city, state, zipCode, active */
var facility = function(id, name, phoneNumber, streetAddress, city, state, zipCode, active) {
	fac = {};
	fac.id = id;
	fac.name = name;
	fac.phoneNumber = phoneNumber;
	fac.streetAddress = streetAddress;
	fac.city = city;
	fac.state = state;
	fac.zipCode = zipCode;
	fac.active = active;
	fac.units = [];
	
	fac.phoneNumberFormatted = function() {
		if(fac.phoneNumber && fac.phoneNumber.length === 10) {
			/* US Number */
			var formattedPhoneNumber = '(areacode) firstThree-lastFour';
			var areaCode, firstThree, lastFour = '';
			
			for (var i = 0, len = fac.phoneNumber.length; i < len; i++) {
				if(i < 3){
					areaCode += fac.phoneNumber[i];
				}
				else if (i < 6) {
					firstThree += fac.phoneNumber[i];
				}
				else if (i < 10) {
					lastFour += fac.phoneNumber[i];
				}
			}
			
			formattedPhoneNumber = formattedPhoneNumber.replace('areaCode', areaCode);
			formattedPhoneNumber = formattedPhoneNumber.replace('firstThree', firstThree)
			formattedPhoneNumber = formattedPhoneNumber.replace('lastFour', lastFour)
			
			return formattedPhoneNumber;
		}
		else if (fac.phoneNumber && fac.phoneNumber.length !== 10) {
			/* Handle other international numbers, this case not valid */
			return 'international';
		}
		
		return 'unknown';
	}
	
	function init() {
		/* we are just going to initialize the units here */
		var unitType1 = facilityUnit(1, 10, 10, 10, 10, 80.00, 65.00, false, false, false, '10% Off First Month *See store for details', 1, true)
		var unitType2 = facilityUnit(2, 10, 10, 10, 10, 99.00, 85.00, false, true, true, '', 1, true)
		var unitType3 = facilityUnit(3, 5, 10, 20, 10, 150.00, 125.00, true, false, true, 'Pay a year up front get 2 free months *See store for details', 1, false)
		
		fac.units.push(unitType1);
		fac.units.push(unitType2);
		fac.units.push(unitType3);
	}
	
	init();
	return fac;
}

var renderUnitHTML = function(template, unit) {
	unitHTML = {};
	unitHTML.template = template;
	unitHTML.unit = unit;
	
	function init() {
		var thisUnit = unitHTML.template.clone();
		
		if (unitHTML.unit.imgSource() && unitHTML.unit.imgSource().length > 0) {
			thisUnit.find('#unitTypeImg').attr('src', unitHTML.unit.imgSource());
		}
		thisUnit.find('#unitTypeImg').attr('alt', unitHTML.unit.title());
		thisUnit.find('#unitTypeImg').attr('id', 'unitTypeImg' + unitHTML.unit.id);
		
		thisUnit.find('#unitTitle').html(unitHTML.unit.title());
		thisUnit.find('#unitTitle').attr('id', 'unitTitle' + unitHTML.unit.id);	
		
		/* I can write this better using key/value pairs for the properties */	
		thisUnit.find('#unitPropertiesList').append('<ul>Height: ' + unitHTML.unit.height + '</ul>');
		thisUnit.find('#unitPropertiesList').append('<ul>Regular Price: ' + formatPrice(unitHTML.unit.regularPrice) + '</ul>');
		thisUnit.find('#unitPropertiesList').append('<ul>Discounted Price: ' + formatPrice(unitHTML.unit.discountedPrice) + '</ul>');
		thisUnit.find('#unitPropertiesList').append('<ul>Alarm: ' + booleanToString(unitHTML.unit.hasAlarm) + '</ul>');
		thisUnit.find('#unitPropertiesList').append('<ul>Power Outlet: ' + booleanToString(unitHTML.unit.hasPowerOutlet) + '</ul>');
		thisUnit.find('#unitPropertiesList').append('<ul>Drive Up Access: ' + booleanToString(unitHTML.unit.hasDriveUpAccess) + '</ul>');
		thisUnit.find('#unitPropertiesList').append('<ul>Promotion: ' + unitHTML.unit.promotion + '</ul>');
		thisUnit.find('#unitPropertiesList').attr('id', 'unitPropertiesList' + unitHTML.unit.id);
				
		if(unitHTML.unit.active) {
			$('#activateContainer').attr('disabled', 'disabled');
		}
		else {
			$('#deActivateContainer').attr('disabled', 'disabled');
		}
		thisUnit.find('#editButton').attr('id', 'editButton' + unitHTML.unit.id);
		thisUnit.find('#activateButton').attr('id', 'activateButton' + unitHTML.unit.id);
		thisUnit.find('#deActivateButton').attr('id', 'deActivateButton' + unitHTML.unit.id);
		
		$('#unitsPlaceHolder').append(thisUnit.html());
	}
	
	init();
	return unitHTML;
}