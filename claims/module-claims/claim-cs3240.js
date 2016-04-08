var config = {
  // Your NUSSTU ID, such as a0012345
  student_id: prompt('Your NUSSTU ID, such as a0012345'),
  // Module you are claiming hours for, such as CS1101S
  module: 'CS3240',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY14/15 Sem 1, it's Monday, Aug 11
  first_day_of_sem: new Date(2015, 0, 12),
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Course Material Preparation': 'Prepared course materials',
    'Tutorial': 'Conducted labs',
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    var weeks = [3, 4, 5, 7, 9, 10];
    // This is an example of how you can make weekly claims
    // Note that recess week should be the string 'RECESS'
    // Reading week is counted as week 14
    for (var i = 0; i < weeks.length; i++) {
      activities_list.push({
        activity_type: Claim.TUTORIAL,
        week: weeks[i],
        day: 'FRIDAY',
        start_time: '0900',
        end_time: '1100'
      });
    }

    activities_list.push({
      activity_type: Claim.ASSIGNMENT_MARKING,
      week: 8,
      day: 'FRIDAY',
      start_time: '0900',
      end_time: '1400'
    });

    activities_list.push({
      activity_type: Claim.ASSIGNMENT_MARKING,
      week: 8,
      day: 'SATURDAY',
      start_time: '0900',
      end_time: '1400'
    });

    return activities_list;
  }
}

// ***********************************************************
// DO NOT CHANGE THE BOTTOM UNLESS YOU KNOW WHAT YOU ARE DOING
// ***********************************************************

var core_script = 'https://rawgit.com/nusmodifications/nus-soc-scripts/master/claims/claim.js';
var c = undefined;
$.getScript(core_script)
  .done(function () {
    c = new Claim(config);
  })
  .fail(function (jqxhr, settings, exception ) {
    console.warn('Error loading script');
    console.warn(jqxhr);
    console.warn(exception);
  });
