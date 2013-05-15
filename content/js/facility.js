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
		var unitType1 = facilityUnit(1, 10, 10, 10, 10, 80.00, 65.00, false, false, false, true, '10% Off First Month *See store for details', true)
		var unitType2 = facilityUnit(2, 10, 10, 10, 10, 99.00, 85.00, false, true, true, false, '', true)
		var unitType3 = facilityUnit(3, 5, 10, 20, 10, 150.00, 125.00, true, false, true, true, 'Pay a year up front get 2 free months *See store for details', false)
		
		fac.units.push(unitType1);
		fac.units.push(unitType2);
		fac.units.push(unitType3);
	}
	
	init();
	return fac;
}

var renderuV = function(template, formTemplate, unit) {
	uV = {};
	uV.template = template;
	uV.formTemplate = formTemplate;
	uV.unit = unit;
	
	function init() {				
		uV.buildUnitConsole();
		uV.buildUnitEditForm();
		$(uV.template.find('.unitFormPlaceHolder')[0]).append(uV.formTemplate.html());
		uV.attachUnitConsoleButtonEvents();
		uV.attachUnitEditFormButtonEvents();
		$('#unitsPlaceHolder').append(uV.template.html());
	}

	uV.buildUnitConsole = function () {
		uV.template.find('#unitTitle').html(uV.unit.title());
		
		if (uV.unit.imgSource() && uV.unit.imgSource().length > 0) {
			uV.template.find('#unitTypeImg').attr('src', uV.unit.imgSource());
		}
		uV.template.find('#unitTypeImg').attr('alt', uV.unit.title());
		
		/* I can write this better using key/value pairs for the properties */
		uV.template.find('#unitPropertiesList').append('<ul>Number of Units: ' + uV.unit.count + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Height: ' + uV.unit.height + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Regular Price: ' + formatPrice(uV.unit.regularPrice) + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Discounted Price: ' + formatPrice(uV.unit.discountedPrice) + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Climate Controlled: ' + booleanToString(uV.unit.isClimateControlled) + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Alarm: ' + booleanToString(uV.unit.hasAlarm) + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Power Outlet: ' + booleanToString(uV.unit.hasPowerOutlet) + '</ul>');
		uV.template.find('#unitPropertiesList').append('<ul>Drive Up Access: ' + booleanToString(uV.unit.hasDriveUpAccess) + '</ul>');
		if(uV.unit.promotion && uV.unit.promotion !== '') {
			uV.template.find('#unitPropertiesList').append('<ul>Promotion: ' + uV.unit.promotion + '</ul>');
		}
				
		if(uV.unit.active === true) {
			uV.template.find('#activateButton').attr('disabled', 'disabled');
		}
		else {
			uV.template.find('#deActivateButton').attr('disabled', 'disabled');
		}
		uV.fixUnitConsoleIds();
	}

	uV.attachUnitConsoleButtonEvents = function() {
		/* right now we only have 1 */
		$(document.body).on('click', '.editButton', function() {
			var unitNumber = this.id.replace('editButton', '');
			$('.unit').each(function() {
				/* if we want to show the current units console uncomment below */
				/*var currentUnitNumber = this.id.replace('unit', '');

				if(currentUnitNumber !== unitNumber) {
					$(this).hide();
				}*/

				/* im just going to hide everything */
				$(this).hide();
			});

		    var editFormId = 'unitEditForm' + unitNumber;
		  	$('#' + editFormId).show();
		});
	}

	uV.fixUnitConsoleIds = function() {
		uV.template.find('#unit').attr('id', 'unit' + uV.unit.id);
		uV.template.find('#unitTitle').attr('id', 'unitTitle' + uV.unit.id);
		uV.template.find('#unitTypeImg').attr('id', 'unitTypeImg' + uV.unit.id);
		uV.template.find('#unitPropertiesList').attr('id', 'unitPropertiesList' + uV.unit.id);
		uV.template.find('#activateContainer').attr('id', 'activateContainer' + uV.unit.id);
		uV.template.find('#deActivateContainer').attr('id', 'deActivateContainer' + uV.unit.id);
		uV.template.find('#editButton').attr('id', 'editButton' + uV.unit.id);
		uV.template.find('#activateButton').attr('id', 'activateButton' + uV.unit.id);
		uV.template.find('#deActivateButton').attr('id', 'deActivateButton' + uV.unit.id);
	}

	uV.buildUnitEditForm = function () {
		/* Let's hide our form bc this is an edit form */
		uV.formTemplate.find('#unitForm').hide();
		uV.formTemplate.find('#legend').html('Edit:' + uV.unit.title());
		uV.formTemplate.find('#numberOfUnits').attr('value', uV.unit.count);
		uV.formTemplate.find('#width').attr('value', uV.unit.width);
		uV.formTemplate.find('#length').attr('value', uV.unit.length);
		uV.formTemplate.find('#height').attr('value', uV.unit.height);
		uV.formTemplate.find('#regularPrice').attr('value', uV.unit.regularPrice);
		uV.formTemplate.find('#discountPrice').attr('value', uV.unit.discountPrice);

		if(uV.unit.hasAlarm === true) {
			uV.formTemplate.find('#hasAlarmYes').attr('checked', 'checked');
		}
		else {
			uV.formTemplate.find('#hasAlarmNo').attr('checked', 'checked');
		}

		if(uV.unit.hasPowerOutlet === true) {
			uV.formTemplate.find('#hashasPowerOutletYes').attr('checked', 'checked');
		}
		else {
			uV.formTemplate.find('#hashasPowerOutletNo').attr('checked', 'checked');
		}

		if(uV.unit.hasDriveUpAccess === true) {
			uV.formTemplate.find('#hasDriveUpAccessYes').attr('checked', 'checked');
		}
		else {
			uV.formTemplate.find('#hasDriveUpAccessNo').attr('checked', 'checked');
		}

		uV.formTemplate.find('#promotion').attr('text', uV.unit.promotion);

		uV.fixUnitEditFormIds();

	}

	uV.attachUnitEditFormButtonEvents = function() {
		$(document.body).on('click', '.editUnitCancelButton', function() {
			$('.unit').each(function() {
				$(this).show();
			});

		    var editFormId = 'unitEditForm' + this.id.replace('editUnitCancelButton', '');
		  	$('#' + editFormId).hide();
		});

		$(document.body).on('click', '.editUnitSaveButton', function() {
			$('.unit').each(function() {
				$(this).show();
			});

		    var editFormId = 'unitEditForm' + this.id.replace('editUnitSaveButton', '');
		  	$('#' + editFormId).hide();
		});
	}

	uV.fixUnitEditFormIds = function() {		
		uV.formTemplate.find('#unitForm').attr('id', 'unitEditForm' + uV.unit.id); /* bc this is an edit form we add the Edit */
		uV.formTemplate.find('#legend').attr('id', 'legend' + uV.unit.id);
		uV.formTemplate.find('#numberOfUnits').attr('id', 'numberOfUnits' + uV.unit.id);
		uV.formTemplate.find('#width').attr('id', 'width' + uV.unit.id);
		uV.formTemplate.find('#length').attr('id', 'length' + uV.unit.id);
		uV.formTemplate.find('#height').attr('id', 'height' + uV.unit.id);
		uV.formTemplate.find('#regularPrice').attr('id', 'regularPrice' + uV.unit.id);
		uV.formTemplate.find('#discountPrice').attr('id', 'discountPrice' + uV.unit.id);
		uV.formTemplate.find('#hasAlarmYes').attr('id', 'hasAlarmYes' + uV.unit.id);
		uV.formTemplate.find('#hasAlarmNo').attr('id', 'hasAlarmNo' + uV.unit.id);
		uV.formTemplate.find('#hashasPowerOutletYes').attr('id', 'hashasPowerOutletYes' + uV.unit.id);
		uV.formTemplate.find('#hashasPowerOutletNo').attr('id', 'hashasPowerOutletNo' + uV.unit.id);
		uV.formTemplate.find('#hasDriveUpAccessYes').attr('id', 'hasDriveUpAccessYes' + uV.unit.id);
		uV.formTemplate.find('#hasDriveUpAccessNo').attr('id', 'hasDriveUpAccessNo' + uV.unit.id);
		uV.formTemplate.find('#promotion').attr('id', 'promotion' + uV.unit.id);
		uV.formTemplate.find('#editUnitCancelButton').attr('id', 'editUnitCancelButton' + uV.unit.id);
		uV.formTemplate.find('#editUnitSaveButton').attr('id', 'editUnitSaveButton' + uV.unit.id);
	}
	
	init();
	return uV;
}

var renderUnits = function(units) {
	rU = {};
	rU.unitTemplate = $('#unitTemplate');
	rU.unitFormTemplate = $('#unitFormTemplate');
	rU.unitsPlaceHolder = $('#unitsPlaceHolder');
	rU.units = units;

	function init() {
		for (var i = 0, len = rU.units.length; i < len; i++) {
			renderuV(rU.unitTemplate.clone(), rU.unitFormTemplate.clone(), rU.units[i]);
		}
	}

	init();
	return rU;
}