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
  module: 'CS3281',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY15/16 Sem 2, it's Monday, Jan 11
  first_day_of_sem: new Date(2016, 0, 11),
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Project Evaluation': 'Graded students\' projects',
    'Consultation with students': 'Lecture Timeslot',
    'System Preparation/Setup': 'Set up and maintain module website',
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    // Assignment marking: 26 hours. 4 Grading checkpoints.
    for (var week = 3; week <= 13; week += 3) {
      activities_list.push({
        activity_type: Claim.ASSIGNMENT_MARKING,
          week: week,
          day: 'MONDAY',
          start_time: '1400',
          end_time: '2030'
      });
    }

    // Lectures: 52 hours. 2 hours a session, twice a week.
    for (var week = 1; week <= 13; week++) {
      activities_list.push({
        activity_type: Claim.CONSULTATION,
        week: week,
        day: 'MONDAY',
        start_time: '1200',
        end_time: '1400'
      });

      activities_list.push({
        activity_type: Claim.CONSULTATION,
        week: week,
        day: 'THURSDAY',
        start_time: '1200',
        end_time: '1400'
      });
    }

    // Exit interview: reading week.
    activities_list.push({
      activity_type: Claim.PROJECT,
      week: 14,
      day: 'TUESDAY',
      start_time: '1300',
      end_time: '1700'
    });
    activities_list.push({
      activity_type: Claim.PROJECT,
      week: 14,
      day: 'WEDNESDAY',
      start_time: '0900',
      end_time: '1700'
    });

    // Code sprint: used for setting up module website.
    // Shifted to week 5 because week 3 has a lot of grading.
    activities_list.push({
      activity_type: Claim.SYSTEM_SETUP,
      week: 1,
      day: 'SATURDAY',
      start_time: '1000',
      end_time: '1500'
    });
    activities_list.push({
      activity_type: Claim.SYSTEM_SETUP,
      week: 1,
      day: 'SUNDAY',
      start_time: '1000',
      end_time: '1500'
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
