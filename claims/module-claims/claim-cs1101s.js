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

// Updated for: AY18/19 Sem 1

// ***********************************************************
// CONFIGURE THE RELEVANT PROPERTIES IN THE CONFIG OBJECT
// ***********************************************************

function split_hours(hours, weeks) {
  let division = Array(weeks);
  let avg = Math.ceil(hours / weeks);
  for (let i = 0; i < weeks; i++) {
    if (hours < avg) {
      division[i] = hours;
      hours = 0;
    } else {
      hours = hours - avg;
      division[i] = avg;
    }
  }
  if (hours > 0) {
    division[weeks - 1] += hours;
  }
  return division;
}

function promptAndParse(msg) {
  let res = prompt(msg);
  let parsed = parseInt(res);
  if (isNaN(parsed)) {
    console.log(`Assuming 0 for non-integer response ${res} for ${msg}`);
    return 0;
  }
  return parsed;
}

function studio_slot(code) {
  let index = parseInt(code.match(/[0-9]+/)[0]) - 1;
  let times = ["0800", "1000", "1200", "1400", "1600", "1800"];
  let result = {
    day: index < 5 ? "MONDAY" : "TUESDAY",
    start_time: times[index % 5],
    end_time: times[1 + (index % 5)]
  };
  console.log(`Detected studio slot ${index + 1}`);
  console.log(result);
  return result;
}

var studio_number = prompt("What is your Studio Code? (e.g. 01E)");
var studio_time = studio_slot(studio_number);

var config = {
  // Your NUSSTU ID, such as a0012345
  student_id: prompt('Your NUSSTU ID, such as e0012345'),
  // Module you are claiming hours for, such as CS1101S
  module: 'CS1101S',
  // Format: YYYY/MM/DD
  // Note: Month is from 0-11, Date is from 1-31
  // This should be the semester's week 1. For AY15/16 Sem 1, it's Monday, Aug 10
  first_day_of_sem: new Date(2018, 07, 13),
  // In case you want to customize the duties field for each activity
  // Do not modify the keys
  duties: {
    'Assignment Marking': 'Graded students\' assignments',
    'Course Material Preparation': 'Prepared for studios and assignments',
    'Tutorial': 'Conducted Tutorial ' + studio_number,
    'Consultation with students': 'Consultation',
    // 'Midterm Marking': 'Graded midterm test',
    // 'Project Evaluation': 'Evaluated programming contest',
    'System Preparation/setup': 'Setup of online system'
  },

  // The following function should return a list of claim objects that you want to make
  activities_list_fn: function () {
    var activities_list = [];

    // ===Baseline Amount===
    // Assignment marking: 
    //  8h all runes missions and sidequests
    //  3h environment model mission
    // Consultation with students: 12 = 1 hrs x 12 weeks
    // Studio preparation: 12 = 1hrs x 12 weeks
    // Studio: 24 = 2 x 12 weeks
    // Baseline: 11 + 12 + 12 = 59

    // === Variable Amount===
    //  + additional variable grading
    var grading_hours = 8 + 3 + promptAndParse(
      ["How many ADDITIONAL hours of marking do you have, on top of the following which will be added automatically: ",
        "8h for the Runes missions/sidequests",
        "3h for the Env Model missions",
        "If you did only the bare minimum for marking, enter 0."
      ].join("\n")
    );
    // Mission authoring
    var mission_hours = 12 + promptAndParse("How many hours did you spend preparing missions?");
    // Consultation
    var consultation_hours = 12 + promptAndParse("How many hours of consultation did you give? ")

    var grading_hours_division = split_hours(grading_hours, 12);
    var mission_hours_division = split_hours(mission_hours, 13);
    var consultation_hours_division = split_hours(consultation_hours, 12);

    for (var week = 1; week <= 13; week++) {
      if (mission_hours_division[week - 1] > 0) {
        activities_list.push({
          activity_type: Claim.COURSE_MATERIAL_PREPARATION,
          week: week,
          day: 'SUNDAY',
          start_time: '1000',
          end_time: `1${mission_hours_division[week - 1]}00`,
        });
      }

      if (week > 1) {
        // Only have grading and consultations for 12 weeks
        if (grading_hours_division[week - 2] > 0) {
          activities_list.push({
            activity_type: Claim.ASSIGNMENT_MARKING,
            week: week,
            day: 'SATURDAY',
            start_time: '1000',
            end_time: `1${grading_hours_division[week - 2]}00`,
          });
        }
        if (consultation_hours_division[week - 2] > 0) {
          activities_list.push({
            activity_type: Claim.CONSULTATION,
            week: week,
            day: 'WEDNESDAY',
            start_time: '1000',
            end_time: `1${consultation_hours_division[week - 2]}00`,
          });
        }
        activities_list.push({
          ...studio_time,
          activity_type: Claim.TUTORIAL,
          week: week,
        });
      }

    }

    // activities_list.push({
    //   activity_type: Claim.MIDTERM_MARKING,
    //   week: 7,
    //   day: 'WEDNESDAY',
    //   start_time: '1700',
    //   end_time: '2000'
    // });
    // activities_list.push({
    //   activity_type: Claim.PROJECT,
    //   week: 8,
    //   day: 'WEDNESDAY',
    //   start_time: '1700',
    //   end_time: '1900'
    // });
    // activities_list.push({
    //   activity_type: Claim.SYSTEM_SETUP,
    //   week: 1,
    //   day: 'TUESDAY',
    //   start_time: '1600',
    //   end_time: '2100'
    // });
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