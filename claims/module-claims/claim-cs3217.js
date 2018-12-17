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

// 6. You will be brought back to the previous page. Click on the button 'Claim' again and verify that you have 80 hours in total.

// To delete all claims on the page, run the function c.deleteAllClaims()


// ***********************************************************
// CONFIGURE THE RELEVANT PROPERTIES IN THE CONFIG OBJECT
// ***********************************************************

var config = {
  // Your NUSSTU ID, such as a0012345
  student_id: prompt('Your NUSSTU ID, such as a0012345'),
  // Module you are claiming hours for, such as CS1101S
  module: 'CS3217',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY15/16 Sem 2, it's Monday, Jan 11
  first_day_of_sem: new Date(2018, 0, 15),
  // in case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Course Material Preparation': 'Prepared problem sets'
  },

  // the following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    const prep_weeks = [1, 3, 5, 7, 9];
    const ps_weeks = [2, 4, 6, 8, 10];
    const ps_rates = [1, 1, 1.5, 1.5, 2];   // Hrs per submission

    // ATTENTION: FILL THIS IN
    const ps_students = [0, 0, 0, 0, 0];    // No. of students per PS

    // Great big hack that might just happen to work without importing a time library
    function make_time(hrs) {
      return { start_time: String(1200),
               end_time: String(1200 + Math.floor(hrs) * 100 + hrs % 1 * 60) };
    }

    // Preparation claims (2h * 5 = 10h)
    for (var week of prep_weeks) {
      activities_list.push({
        activity_type: Claim.ASSIGNMENT_MARKING,  // Waikay didn't approve "course material preparation"
        week: week,
        day: 'SUNDAY',
        start_time: '1200',
        end_time: '1400'
      });  
    }    

    // Grading claims
    for (var ps = 0; ps < 5; ps++) {
      var ps_hours = ps_students[ps] * ps_rates[ps];
      var times = make_time(ps_hours);

      activities_list.push({
        activity_type: Claim.ASSIGNMENT_MARKING,
        week: ps_weeks[ps],
        day: 'SUNDAY',
        start_time: times['start_time'],
        end_time: times['end_time']
      });
    }

    return activities_list;
  }
};

// ***********************************************************
// DO NOT CHANGE THE BOTTOM UNLESS YOU KNOW WHAT YOU ARE DOING
// ***********************************************************

var core_script = 'https://nusmodifications.github.io/nus-scripts/claims/claim.js';
var c = undefined;
$.getScript(core_script)
  .done(function () {
    c = new Claim(config);
  })
  .fail(function (jqxhr, settings, exception) {
    console.warn('Error loading script');
    console.warn(jqxhr);
    console.warn(exception);
  });
// c.makeAllClaims();
