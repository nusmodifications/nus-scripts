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
  module: 'CS1010S',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY14/15 Sem 1, it's Monday, Aug 12
  first_day_of_sem: new Date(2015, 0, 12),
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Course Material Preparation': 'Prepared course materials',
    'Tutorial': 'Conducted tutorial'
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    // Course prep: 18 (+4) hours
    // 1 class tutors to remove this first loop
    for(var week = 1; week <= 4; week++) {
      activities_list.push({
        activity_type: Claim.COURSE_MATERIAL_PREPARATION,
        week: week,
        day: 'SATURDAY',
        start_time: '1600',
        end_time: '1700'
      })
    }
    for (var week = 1; week <= 12; week++) {
      activities_list.push({
        activity_type: Claim.COURSE_MATERIAL_PREPARATION,
        week: week,
        day: 'SATURDAY',
        start_time: '1730',
        end_time: '1800'
      });
    }
    for (var week = 1; week <= 12; week++) {
      activities_list.push({
        activity_type: Claim.COURSE_MATERIAL_PREPARATION,
        week: week,
        day: 'MONDAY',
        start_time: '1100',
        end_time: '1200'
      });
    }
    // 1-class tutors to reduce to 1hr
    for (var week = 1; week <= 12; week++) {
      activities_list.push({
        activity_type: Claim.ASSIGNMENT_MARKING,
        week: week,
        day: 'SATURDAY',
        start_time: '1600',
        end_time: '1800'
      });
    }

    // Weekly stuff (Fill in your tutorial timeslots)
    for (var week = 3; week <= 13; week++) {
      if(week === 7) { // no tutorial for week 7
        continue
      }
      activities_list.push({
        activity_type: Claim.TUTORIAL,
        week: week,
        day: 'MONDAY',
        start_time: '1600',
        end_time: '1700'
      });
      activities_list.push({
        activity_type: Claim.TUTORIAL,
        week: week,
        day: 'TUESDAY',
        start_time: '1700',
        end_time: '1800'
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
