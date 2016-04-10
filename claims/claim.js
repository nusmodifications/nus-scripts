var Claim = function () {
  // ***********************************************************
  // REQUIRED CONSTANTS, DO NOT MODIFY
  // ***********************************************************
  var ASSIGNMENT_MARKING = 'Assignment Marking';
  var COURSE_MATERIAL_PREPARATION = 'Course Material Preparation';
  var TUTORIAL = 'Tutorial';
  var CONSULTATION = 'Consultation with students';
  var MIDTERM_MARKING = 'Midterm Marking';
  var PROJECT = 'Project Evaluation';
  var SYSTEM_SETUP = 'System Preparation/setup';

  var POST_URL = '/~tssclaim/tutor/teach_claim.php';
  var END_REDIRECT_URL = '/~tssclaim/tutor/teach_claim.php?page=list';

  // ***********************************************************
  // DO NOT CHANGE THE BOTTOM UNLESS YOU KNOW WHAT YOU ARE DOING
  // ***********************************************************

  var ACTIVITY_DICT = {};
  // IMPORTANT: Not all categories may be availale for your module!!
  ACTIVITY_DICT[ASSIGNMENT_MARKING] = '003';
  ACTIVITY_DICT[MIDTERM_MARKING] = '004';
  ACTIVITY_DICT[PROJECT] = '005';
  ACTIVITY_DICT[COURSE_MATERIAL_PREPARATION] = '006';
  ACTIVITY_DICT[SYSTEM_SETUP] = '007';
  ACTIVITY_DICT[TUTORIAL] = 'T';
  ACTIVITY_DICT[CONSULTATION] = 'C';

  var DAY_DICT = { 'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3, 'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6 };

  function Claim (config) {
    this.student_id = config.student_id.toLowerCase();
    this.module = config.module;
    this.remarks = config.duties;
    this.first_day_of_sem = config.first_day_of_sem;
    this.error = false;
    this.proposed_hours = 0;
    this.existing_hours = 0;

    var that = this;

    // Ensure claiming for correct module!
    if ($('h3:contains("Module:")').text().substr(8) !== config.module) {
      alert('Ensure that the module in config matches that of this page.');
      // Else you will have invisible claims taking up your time.
      throw new Error('Incorrect module in config.');
    }

    function createActivity (activity_type, week, day, start_time, end_time) {
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

        function checkTime (time) {
          var time_hour = time.slice(0, 2);
          var time_min = time.slice(2);
          if (typeof time !== 'string' ||
            time.length != 4 ||
            !(parseInt(time_hour) >= 0 && parseInt(time_hour) <= 23) ||
            !(time_min === '00' || time_min === '30')) {
            throw 'Time error: ' + time + '. Time has to be string in 24-hr format at half-hour intervals.';
          }
        }

        checkTime(start_time);
        checkTime(end_time);
        var start_time_hour = parseInt(start_time.slice(0, 2));
        var end_time_hour = parseInt(end_time.slice(0, 2));
        var start_time_min = parseInt(start_time.slice(2));
        var end_time_min = parseInt(end_time.slice(2));

        if (start_time_hour > end_time_hour || start_time === end_time) {
          throw 'Time error: end_time: ' + end_time + ' must be after start_time: ' + start_time + '.';
        } else if (end_time_hour - start_time_hour > 8) {
          throw 'Time error: ' + start_time + ' - ' + end_time + '. Activity cannot be more than 8 hours.';
        }

        that.proposed_hours += end_time_hour - start_time_hour + (end_time_min - start_time_min)/60;
      } catch (err) {
        error = true;
        console.warn(err);
      }

      return function () {
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
    $existing_claims.each(function () {
      var $row = $(this);
      if ($row.find('input[name=action]').val() === 'DELETE') {
        var hours = parseFloat($row.find('td:eq(5)').text());
        if (!isNaN(hours)) {
          that.existing_hours += hours;
        }
      }
    });

    this.ajax_index = 0; // index to keep track of the current ajax call
    console.debug('Current hours claimed: ' + this.existing_hours);
    console.debug('Proposed hours: ' + this.proposed_hours);
    console.debug('Claim object successfully created. Run c.makeAllClaims() to start.');
  }

  Claim.ASSIGNMENT_MARKING = ASSIGNMENT_MARKING;
  Claim.COURSE_MATERIAL_PREPARATION = COURSE_MATERIAL_PREPARATION;
  Claim.TUTORIAL = TUTORIAL;
  Claim.MIDTERM_MARKING = MIDTERM_MARKING;
  Claim.PROJECT = PROJECT;
  Claim.SYSTEM_SETUP = SYSTEM_SETUP;
  Claim.CONSULTATION = CONSULTATION;

  Claim.prototype.makeClaim = function (activity_type, week, day, start_time, end_time) {
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
    $.post(POST_URL, post_data, function (data) {
      console.debug('Successfully added ' + activity_type + ' for ' + claim_date_str);
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

  Claim.prototype.deleteAllClaims = function () {
    var that = this;
    function deleteClaim (claim_id) {
      $.post(POST_URL, {
        mod_c: that.module,
        claim_id: claim_id,
        action: 'DELETE',
        std_id: that.student_id,
        submit: 'DELETE + Save as Draft'
      }, function (data) {
        console.debug('Claim ' + claim_id + ' deleted');
        count += 1;
        if (count === $existing_claims.length) {
          alert('All claims deleted! Press OK to continue.');
          window.location.href = window.location.protocol + '//' + window.location.host + END_REDIRECT_URL;
        }
      });
    }

    var count = 0;
    var $existing_claims = $('#claim-info-div table [name="claim_id"]');
    $existing_claims.each(function () {
      deleteClaim(this.value);
    });
  }

  Claim.prototype.makeAllClaims = function () {
    if (!this.error && confirm('NUSSTU ID: ' + this.student_id + '\n' +
            'Module: ' + this.module + '\n' +
            'Existing Claims: ' + this.existing_hours + ' hours\n' +
            'Proposed Claims: ' + this.proposed_hours + ' hours\n\n' +
            'You are about to claim an additional ' + this.proposed_hours +
            ' hours,\nPress OK to confirm.')) {
      this.activities_list[this.ajax_index]();
    }
  }

  return Claim;
}();

// var c = new Claim(config);
// c.makeAllClaims();
