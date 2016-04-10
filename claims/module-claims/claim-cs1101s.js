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

// Updated for: AY15/16 Sem 1

// ***********************************************************
// CONFIGURE THE RELEVANT PROPERTIES IN THE CONFIG OBJECT
// ***********************************************************

var config = {
  // Your NUSSTU ID, such as a0012345
  student_id: prompt('Your NUSSTU ID, such as a0012345'),
  // Module you are claiming hours for, such as CS1101S
  module: 'CS1101S',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY15/16 Sem 1, it's Monday, Aug 10
  first_day_of_sem: new Date(2015, 7, 10),
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Course Material Preparation': 'Prepared assignments',
    'Tutorial': 'Conducted tutorial',
    'Consultation with students': 'Consultation',
    'Midterm Marking': 'Graded midterm test',
    'Project Evaluation': 'Evaluated programming contest',
    'System Preparation/setup': 'Setup of online system'
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    // Assignment marking: 11 - 1 hr x 11 weeks
    // Consultation with students: 21 - 3 hrs x 7 weeks
    // Course material preparation: 6
    // Midterm marking: 3
    // Project evaluation: 2 (let's say this is the contests)
    // System preparation/setup: 5
    // Tutorial: 22 - 2 hrs x 11 weeks
    // TOTAL: 70 hours
    for (var week = 1; week <= 13; week++) {
      if (week < 12) {
        activities_list.push({
          activity_type: Claim.ASSIGNMENT_MARKING,
          week: week,
          day: 'SATURDAY',
          start_time: '1300',
          end_time: '1400'
        });
      }
      if (week % 2 == 0 || week == 13) {
        activities_list.push({
          activity_type: Claim.CONSULTATION,
          week: week,
          day: 'SATURDAY',
          start_time: '1400',
          end_time: '1700'
        });
      }

      if (week === 1 || week === 13) {
        // there was no tutorial in week 1 and 13
      } else {
        activities_list.push({
          activity_type: Claim.TUTORIAL,
          week: week,
          day: 'MONDAY',
          start_time: '1600',
          end_time: '1800'
        });
      }

      if (week <= 3) {
        activities_list.push({
          activity_type: Claim.COURSE_MATERIAL_PREPARATION,
          week: week,
          day: 'MONDAY',
          start_time: '1800',
          end_time: '2000'
        });
      }
    }

    activities_list.push({
      activity_type: Claim.MIDTERM_MARKING,
      week: 7,
      day: 'WEDNESDAY',
      start_time: '1700',
      end_time: '2000'
    });
    activities_list.push({
      activity_type: Claim.PROJECT,
      week: 8,
      day: 'WEDNESDAY',
      start_time: '1700',
      end_time: '1900'
    });
    activities_list.push({
      activity_type: Claim.SYSTEM_SETUP,
      week: 1,
      day: 'TUESDAY',
      start_time: '1600',
      end_time: '2100'
    });
    return activities_list;
  }
};

// ***********************************************************
// DO NOT CHANGE THE BOTTOM UNLESS YOU KNOW WHAT YOU ARE DOING
// ***********************************************************

var core_script = 'https://rawgit.com/nusmodifications/nus-scripts/master/claims/claim.js';
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
