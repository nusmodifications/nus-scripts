SOC Claims Script
=================

A script for automating the Student Claim Submission process that will save SOC Tutors and Teaching Assistants a lot of time especially when there are weekly repetitive activities such as grading and/or tutorials.

Configuration
--

**IMPORTANT!!**: Take a look at the `config` variable in `claim.js`. You will have to modify the variables before you run the script.

##### Config Variable #####

- **first_day_of_sem**: A JavaScript `Date` object indicating the first day of the semester.
- **student_id**: Your NUSNET id, without the letter at the back.
- **module**: The module code of the module you are making claims for.
- **duties**: A object that maps the type of activity to the description of duties.
	- Assignment Marking
	- Course Material Preparation
	- Tutorial
- **activities_list_fn**: This function should return a list of **activity** objects that you want to claim. The properties of the activity object are found in the next section. Look at the code inside `claim.js` to get a better idea of how to use the function.

##### Activity Object #####

- **activity_type**: Use the pre-defined constants: **ASSIGNMENT_MARKING** | **COURSE_MATERIAL_PREPARATION** | **TUTORIAL**
- **week**: An integer, indicating the week number of the sem. This is to facilitate convenient calculation of the date of activity. The script only supports activities performed from week 1 onwards, excluding recess week and reading week. If your activity falls on recess/reading week, you will have to add them into the system yourself manually.
- **day**: A string, with one of these values: `"MONDAY"`, `"TUESDAY"`, `"WEDNESDAY"`, `"THURSDAY"`, `"FRIDAY"`, `"SATURDAY"`, `"SUNDAY"`.
- **start_time**: A 4-character string, representing the starting time of the activity in 24-hour format. The minute value has to be 00 or 30.
- **end_time**: Similar to `start_time`, but represents the ending time of the activity. 


Quickstart
--

1. ** **IMPORTANT STEP** **: Change the properties in the config object near the start of the `claim.js` file.
2. Login to the portal at: [https://mysoc.nus.edu.sg/~tssclaim/](https://mysoc.nus.edu.sg/~tssclaim/). Fill in your bank account information if you haven't done so.
3. Access the page titled **'Student Claim Submission'**, [https://mysoc.nus.edu.sg/~tssclaim/tutor/teach_claim.php?page=1](https://mysoc.nus.edu.sg/~tssclaim/tutor/teach_claim.php?page=1) and click on the **'Claim'** button under your module. You should see the interface for you to enter details of the teaching claim activity.
4. Open the JavaScript console of your browser by pressing **Ctrl/Cmd + Shift/Option + J**.
5. Paste all the code in `claim.js` in the console and press enter. You should see the following message:

    Claim object successfully created. Run c.makeAllClaims() to start.

6. Run the command:

    c.makeAllClaims();

7. Wait until the alert **'All claims made!'** is shown, then press 'OK'.
8. You will be brought back to the previous page. Click on the button **'Claim'** again and verify that you have 80 hours in total.


Documentation
--

### Claiming ###

To make the claims, run the function:
   
    c.makeAllClaims()

### Deletion ###

To delete all claims on the page, run the function 
    
    c.deleteAllClaims()