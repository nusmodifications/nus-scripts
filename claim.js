// ***********************************************************
// READ THE FOLLOWING BEFORE STARTING
// ***********************************************************
// 1. Change the config variables at the top of the file. **IMPORTANT STEP**
// 2. Login to the portal at: https://mysoc.nus.edu.sg/~tssclaim/. Fill in your bank account information if you haven't.
// 3. Access the page titled 'Student Claim Submission' (https://mysoc.nus.edu.sg/~tssclaim/tutor/teach_claim.php?page=1) and click on the 'Claim' button under the module CS1010S. You should see the interface for you to enter details of the teaching claim activity.
// 4. Open the JS console (Ctrl/Cmd + Shift/Option + J), paste all the code in this file in the JS console and press enter.
// 5. Run the function makeAllClaims() . Wait until the alert 'All claims made!' is shown, then press 'OK'.
// 6. You will be brought back to the previous page. Click on the button 'Claim' again and verify that you have 80 hours in total.
// To delete all claims on the page, run the function deleteAllClaims()


// ***********************************************************
// CONFIGURE THE FOLLOWING PARAMETERS
// ***********************************************************

var STUDENT_ID = 'a0073063'; // the id you used to log in to the portal

var TUTORIAL_SLOT1_DAY = 'MONDAY';
var TUTORIAL_SLOT1_START_TIME = '1600';
var TUTORIAL_SLOT1_END_TIME = '1700';

var TUTORIAL_SLOT2_DAY = 'TUESDAY';
var TUTORIAL_SLOT2_START_TIME = '1400';
var TUTORIAL_SLOT2_END_TIME = '1500';

var MODULE = 'CS1010S';

var REMARKS_DICT = {};
REMARKS_DICT[ASSIGNMENT_MARKING] = 'Graded students\' missions';
REMARKS_DICT[COURSE_MATERIAL_PREPARATION] = 'Prepared tutorials, lectures and missions';
REMARKS_DICT[TUTORIAL] = 'Conducted tutorial';


// ***********************************************************
// DO NOT CHANGE THE BOTTOM UNLESS YOU KNOW WHAT YOU ARE DOING
// ***********************************************************

// Format: YYYY/MM/DD
// Note: Month is from 0-11, Date is from 1-31
// This should be the semester's week 1 Monday, Aug 12
var FIRST_DAY_OF_SCHOOL = new Date(2013,07,12); 

// CONSTANTS
var ASSIGNMENT_MARKING = 'Assignment Marking';
var COURSE_MATERIAL_PREPARATION = 'Course Material Preparation';
var TUTORIAL = 'Tutorial';
var POST_URL = '/~tssclaim/tutor/teach_claim.php';
var END_REDIRECT_URL = '/~tssclaim/tutor/teach_claim.php?page=list';

var ACTIVITY_DICT = {};
ACTIVITY_DICT[ASSIGNMENT_MARKING] = '003';
ACTIVITY_DICT[COURSE_MATERIAL_PREPARATION] = '006';
ACTIVITY_DICT[TUTORIAL] = 'T';

var DAY_DICT = { 'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3, 'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6 };

// index to keep track of the current ajax call
var ajax_index = 0;
var error = false;

function addClaim(activity_type, week, day, start_time, end_time) {
	var day_num = DAY_DICT[day];
	var number_of_days = (week < 7 ? week - 1 : week)*7 + day_num;
	var activity_date = new Date();
	activity_date.setTime(FIRST_DAY_OF_SCHOOL.getTime() + (number_of_days * 24 * 60 * 60 * 1000));
	var claim_date_array = activity_date.toDateString().split(' ');
	var claim_date_str = [claim_date_array[2], claim_date_array[1], claim_date_array[3].slice(2)].join('-');

	var post_data = {
		mod_c: MODULE,
		action: 'ADD',
		std_id: STUDENT_ID,
		activity_c: ACTIVITY_DICT[activity_type],
		remarks: REMARKS_DICT[activity_type],
		claim_date: claim_date_str,
		start_time_hr: start_time.slice(0,2),
		start_time_min: start_time.slice(2),
		end_time_hr: end_time.slice(0,2),
		end_time_min: end_time.slice(2),
		submit: 'ADD + Save as Draft'
	}

	
	console.log('Successfully added ' + activity_type + ' for ' + claim_date_str);
	ajax_index += 1;
	if (ajax_index < claims_list.length) {
		claims_list[ajax_index]();
	} else {
		alert('All claims made! Press OK to continue.');
		// redirect to previous page because a refresh of the page would trigger the last ajax call
		window.location.href = window.location.protocol +'//'+ window.location.host + END_REDIRECT_URL;
	}

	// $.post(POST_URL, post_data, function(data) {
	// 	console.log('Successfully added ' + activity_type + ' for ' + claim_date_str);
	// 	ajax_index += 1;
	// 	if (ajax_index < ajax_functions.length) {
	// 		claims_list[ajax_index]();
	// 	} else {
	// 		alert('All claims made! Press OK to continue.');
	// 		// redirect to previous page because a refresh of the page would trigger the last ajax call
	// 		window.location.href = window.location.protocol +'//'+ window.location.host + END_REDIRECT_URL;
	// 	}
	// });
};

function deleteClaim(claim_id) {
	$.post(POST_URL, { 
		mod_c: MODULE,
		claim_id: claim_id,
		action: 'DELETE',
		std_id: STUDENT_ID,
		submit: 'DELETE + Save as Draft'
	}, function(data) {
		console.log('Claim ' + claim_id + ' deleted');
	});
}

function deleteAllClaims() {
	$('#claim-info-div table [name="claim_id"]').each(function() {
		deleteClaim(this.value);
	});
}

function createClaim(activity_type, week, day, start_time, end_time) {
	// obj has the properties: 
	var day_upper = day.toUpperCase();
	try {
		if (ACTIVITY_DICT[activity_type] == undefined || typeof activity_type != "string") {
			throw "Activity error: " + activity_type + ". Activity type not supported.";
		}
		if (typeof week != "number" || week <= 0) {
			throw "Week error: " + week + ". Week value has to be a positive number.";
		}
		if (DAY_DICT[day_upper] == undefined || typeof day_upper != "string") {
			throw "Day error: " + day + ". Day value has to be a valid day string.";
		}
		function checkTime(time) {
			var start_time_hour = time.slice(0,2);
			var start_time_min = time.slice(2);
			if (typeof time != "string" || 
				time.length != 4 ||
				!(parseInt(start_time_hour) >= 0 && parseInt(start_time_hour) <= 23) ||
				!(start_time_min == "00" || start_time_min == "30")) {
				throw "Time error: " + time + ". Time has to be string in 24-hr format at half-hour intervals.";
			}
		}
		checkTime(start_time);
		checkTime(end_time);
		var start_time_hour = parseInt(start_time.slice(0,2));
		var end_time_hour = parseInt(end_time.slice(0,2));
		if (start_time_hour > end_time_hour || start_time === end_time) {
			throw "Time error: end_time: " + end_time + " must be after start_time: " + start_time + ".";
		} else if (end_time_hour - start_time_hour > 8) {
			throw "Time error: " + start_time + " - " + end_time + ". Activity cannot be more than 8 hours.";
		}	
	} catch (err) {
		error = true;
		console.log(err);
	}
	return function() { 
		addClaim(activity_type, week, day, start_time, end_time);
	};
}

function makeAllClaims() {
	claims_list[ajax_index]();
}


// ***********************************************************
// CREATE A CLAIMS OBJECTS AND ADD INTO CLAIMS LIST
// ***********************************************************

var claims_list = [];
claims_list.push(createClaim(COURSE_MATERIAL_PREPARATION, 1, "MONDAY", '1200', '1700'));
claims_list.push(createClaim(COURSE_MATERIAL_PREPARATION, 1, "TUESDAY", '1200', '1700'));
claims_list.push(createClaim(COURSE_MATERIAL_PREPARATION, 2, "MONDAY", '1200', '1700'));
claims_list.push(createClaim(COURSE_MATERIAL_PREPARATION, 2, "TUESDAY", '1200', '1700'));

// Weekly stuff (Tutorials and Assignments Marking - 20 + 40)
for (var week = 3; week <= 13; week++) {
	if (week === 7) { // there was no tutorial in week 7
		continue;
	}
	claims_list.push(createClaim(TUTORIAL, week, TUTORIAL_SLOT1_DAY, TUTORIAL_SLOT1_START_TIME, TUTORIAL_SLOT1_END_TIME));
	claims_list.push(createClaim(TUTORIAL, week, TUTORIAL_SLOT2_DAY, TUTORIAL_SLOT2_START_TIME, TUTORIAL_SLOT2_END_TIME));
	claims_list.push(createClaim(ASSIGNMENT_MARKING, week, "SATURDAY", '1200', '1600'));
};

if (!error) {
	makeAllClaims();
}