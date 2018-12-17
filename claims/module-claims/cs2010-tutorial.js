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

// 6. You will be brought back to the previous page. Click on the button 'Claim' again and verify that you have 17 * NUMBER OF SLOTS hours in total.

// To delete all claims on the page, run the function c.deleteAllClaims()


// ***********************************************************
// CONFIGURE THE RELEVANT PROPERTIES IN THE CONFIG OBJECT
// ***********************************************************

var config = {
  // Your NUSSTU ID, such as a0012345
  student_id: prompt('Your NUSSTU ID, such as a0012345'),
  // Module you are claiming hours for, such as CS1101S
  module: 'CS2010',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY14/15 Sem 1, it's Monday, Aug 12
  first_day_of_sem: new Date(2018, 0, 15),
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Tutorial': 'Conducted Tutorial Sessions',
    'Consultation with students': 'Conducted Consultation sessions before written quizzes.'
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    // Weekly tutorial session 1 
    for (var week = 3; week <= 13; week++) {
      activities_list.push({
        activity_type: Claim.TUTORIAL,
        week: week,
        day: 'WEDNESDAY',
        start_time: '1200',
        end_time: '1300'
      });
    }

    // Weekly tutorial session 2 
    for (var week = 3; week <= 13; week++) {
      activities_list.push({
        activity_type: Claim.TUTORIAL,
        week: week,
        day: 'WEDNESDAY',
        start_time: '1300',
        end_time: '1400'
      });
    }

    // 6 hours consultation per tutorial slot
    
    // Consultation 1
    activities_list.push({
      activity_type: Claim.CONSULTATION,
      week: 5,
      day: 'TUESDAY',
      start_time: '1200',
      end_time: '1400'
    });
    
    // Consultation 2
    activities_list.push({
      activity_type: Claim.CONSULTATION,
      week: 9,
      day: 'SUNDAY',
      start_time: '1400',
      end_time: '1800'
    });
    
    // Consultation 3
    activities_list.push({
      activity_type: Claim.CONSULTATION,
      week: 11,
      day: 'THURSDAY',
      start_time: '1400',
      end_time: '1700'
    });
    
    // Consultation 4
    activities_list.push({
      activity_type: Claim.CONSULTATION,
      week: 10,
      day: 'MONDAY',
      start_time: '1200',
      end_time: '1500'
    });
    

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
