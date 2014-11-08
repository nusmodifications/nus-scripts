// ***********************************************************
// REQUIRED CONSTANTS, DO NOT MODIFY
// ***********************************************************
var ASSIGNMENT_MARKING = 'Assignment Marking';
var COURSE_MATERIAL_PREPARATION = 'Course Material Preparation';
var TUTORIAL = 'Tutorial';
var CONSULTATION = 'Consultation with students';
var POST_URL = '/~tssclaim/tutor/teach_claim.php';
var END_REDIRECT_URL = '/~tssclaim/tutor/teach_claim.php?page=list';


// ***********************************************************
// READ THE FOLLOWING BEFORE STARTING
// ***********************************************************
// 1. **IMPORTANT STEP** Change the properties in the config object in the next section.

// 2. Login to the portal at: https://mysoc.nus.edu.sg/~tssclaim/. Fill in your bank account information if you haven't.

// 3. Access the page titled 'Student Claim Submission' (https://mysoc.nus.edu.sg/~tssclaim/tutor/teach_claim.php?page=1) and click on
//    the 'Claim' button under your module. You should see the interface for you to enter details of the teaching claim activity.

// 4. Open the JS console (Ctrl/Cmd + Shift/Option + J), paste all the code in this file in the JS console and press enter. You should
//    see the message 'Claim object successfully created. Run c.makeAllClaims() to start.'.

// 5. Run the function c.makeAllClaims() . Wait until the alert 'All claims made!' is shown, then press 'OK'.

// 6. You will be brought back to the previous page. Click on the button 'Claim' again and verify that you have the right number of hours.

// To delete all claims on the page, run the function c.deleteAllClaims()


// ***********************************************************
// CONFIGURE THE RELEVANT PROPERTIES IN THE CONFIG OBJECT
// ***********************************************************

var config = {
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY13/14 Sem 2, it's Monday, Jan 13
  first_day_of_sem: new Date(2014,7,11),
  // Your student ID
  student_id: 'a0099314',
  // Module you are claiming hours for
  module: 'CS1101S',
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Course Material Preparation': 'Prepared course materials',
    'Tutorial': 'Conducted tutorial',
    'Consultation with students': 'Had consultation with students'
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function() {
    var activities_list = [];

    // This is an example of how you can make weekly claims
    // Note that the week value does not support recess and reading weeks.
    //
    // 2h DG * 11 weeks = 22 hours
    // 2h preparation * 10 weeks = 20 hours
    // 2h grading * 14 weeks = 28 hours
    //
    // TOTAL: 70 hours
    for (var week = 1; week <= 14; week++) {
      activities_list.push({
        activity_type: ASSIGNMENT_MARKING,
        week: week,
        day: 'SATURDAY',
        start_time: '1300',
        end_time: '1500'
      });

      if (week === 1 || week === 7 || week === 9) {
        // there was no tutorial in week 1, 7 (recess) and 9 (PH)
      } else {
        activities_list.push({
          activity_type: TUTORIAL,
          week: week,
          day: 'TUESDAY',
          start_time: '1400',
          end_time: '1600'
        });
      }

      if (week <= 10) {
        activities_list.push({
          activity_type: COURSE_MATERIAL_PREPARATION,
          week: week,
          day: 'MONDAY',
          start_time: '1800',
          end_time: '2000'
        });
      }
    };

    return activities_list;
  }
}


// ***********************************************************
// DO NOT CHANGE THE BOTTOM UNLESS YOU KNOW WHAT YOU ARE DOING
// ***********************************************************

var ACTIVITY_DICT = {};
ACTIVITY_DICT[ASSIGNMENT_MARKING] = '003';
ACTIVITY_DICT[COURSE_MATERIAL_PREPARATION] = '006';
ACTIVITY_DICT[TUTORIAL] = 'T';
ACTIVITY_DICT[CONSULTATION] = 'C';

var DAY_DICT = { 'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3, 'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6 };

function Claim(config) {
  this.student_id = config.student_id.toLowerCase();
  this.module = config.module;
  this.remarks = config.duties;
  this.first_day_of_sem = config.first_day_of_sem;
  this.error = false;

  var that = this;

  // Ensure claiming for correct module!
  if ($('h3:contains("Module")').text().substr(8) !== config.module) {
    alert('Ensure that the module in config matches that of this page.');
    // Else you will have invisible claims taking up your time.
    throw new Error('Incorrect module in config.');
  }

  function createActivity(activity_type, week, day, start_time, end_time) {
    var day_upper = day.toUpperCase();
    try {
      if (ACTIVITY_DICT[activity_type] === undefined || typeof activity_type !== 'string') {
        throw 'Activity error: ' + activity_type + '. Activity type not supported.';
      }
      if (typeof week !== 'number' && week !== 'RECESS' || week <= 0) {
        throw 'Week error: ' + week + '. Week value has to be a positive number or RECESS.';
      }
      if (DAY_DICT[day_upper] === undefined || typeof day_upper !== 'string') {
        throw 'Day error: ' + day + '. Day value has to be a valid day string.';
      }

      function checkTime(time) {
        var start_time_hour = time.slice(0,2);
        var start_time_min = time.slice(2);
        if (typeof time !== 'string' ||
          time.length != 4 ||
          !(parseInt(start_time_hour) >= 0 && parseInt(start_time_hour) <= 23) ||
          !(start_time_min === '00' || start_time_min === '30')) {
          throw 'Time error: ' + time + '. Time has to be string in 24-hr format at half-hour intervals.';
        }
      }

      checkTime(start_time);
      checkTime(end_time);
      var start_time_hour = parseInt(start_time.slice(0,2));
      var end_time_hour = parseInt(end_time.slice(0,2));

      if (start_time_hour > end_time_hour || start_time === end_time) {
        throw 'Time error: end_time: ' + end_time + ' must be after start_time: ' + start_time + '.';
      } else if (end_time_hour - start_time_hour > 8) {
        throw 'Time error: ' + start_time + ' - ' + end_time + '. Activity cannot be more than 8 hours.';
      }
    } catch (err) {
      error = true;
      console.log(err);
    }

    return function() {
      that.makeClaim(activity_type, week, day, start_time, end_time);
    };
  }

  var activities = config.activities_list_fn();
  this.activities_list = [];
  for (var i = 0; i < activities.length; i++) {
    var a = activities[i];
    this.activities_list.push(createActivity(a.activity_type, a.week, a.day, a.start_time, a.end_time));
  }
  // sum up existing hours claimed
  var $existing_claims = $('#claim-info-div table tr');
  var existing_hours = 0;
  $existing_claims.each(function(){
    var row = $(this);
    if (row.find('input[name=action]').val() === 'DELETE') {
      var hours = parseFloat(row.find('td:eq(5)').text());
      if (!isNaN(hours)) {
        existing_hours += hours;
      }
    }
  })
  this.ajax_index = 0; // index to keep track of the current ajax call
  console.log('Current hours claimed: ' + existing_hours);
  console.log('Claim object successfully created. Run c.makeAllClaims() to start.');
}

Claim.prototype.makeClaim = function(activity_type, week, day, start_time, end_time) {
  var day_num = DAY_DICT[day];
  if (week === 'RECESS') {
    var number_of_days = 6*7 + day_num;
  } else {
    var number_of_days = (week < 7 ? week - 1 : week)*7 + day_num;
  }
  var activity_date = new Date();
  activity_date.setTime(this.first_day_of_sem.getTime() + (number_of_days * 24 * 60 * 60 * 1000));
  var claim_date_array = activity_date.toDateString().split(' ');
  var claim_date_str = [claim_date_array[2], claim_date_array[1], claim_date_array[3].slice(2)].join('-');

  var post_data = {
    mod_c: this.module,
    action: 'ADD',
    std_id: this.student_id,
    activity_c: ACTIVITY_DICT[activity_type],
    remarks: this.remarks[activity_type],
    claim_date: claim_date_str,
    start_time_hr: start_time.slice(0,2),
    start_time_min: start_time.slice(2),
    end_time_hr: end_time.slice(0,2),
    end_time_min: end_time.slice(2),
    submit: 'ADD + Save as Draft'
  }

  var that = this;
  $.post(POST_URL, post_data, function(data) {
    console.log('Successfully added ' + activity_type + ' for ' + claim_date_str);
    that.ajax_index += 1;
    if (that.ajax_index < that.activities_list.length) {
      that.activities_list[that.ajax_index]();
    } else {
      alert('All claims made! Press OK to continue.');
      // redirect to previous page because a refresh of the page would trigger the last ajax call
      window.location.href = window.location.protocol +'//'+ window.location.host + END_REDIRECT_URL;
    }
  });
};

Claim.prototype.deleteAllClaims = function() {
  var that = this;
  function deleteClaim(claim_id) {
    $.post(POST_URL, {
      mod_c: that.module,
      claim_id: claim_id,
      action: 'DELETE',
      std_id: that.student_id,
      submit: 'DELETE + Save as Draft'
    }, function(data) {
      console.log('Claim ' + claim_id + ' deleted');
      count += 1;
      if (count === $existing_claims.length) {
        alert('All claims deleted! Press OK to continue.');
        window.location.href = window.location.protocol + '//' + window.location.host + END_REDIRECT_URL;
      }
    });
  }

  var count = 0;
  var $existing_claims = $('#claim-info-div table [name="claim_id"]');
  $existing_claims.each(function() {
    deleteClaim(this.value);
  });
}

Claim.prototype.makeAllClaims = function() {
  if (!this.error) {
    this.activities_list[this.ajax_index]();
  }
}

var c = new Claim(config);
// c.makeAllClaims();
