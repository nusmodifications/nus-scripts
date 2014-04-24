// This script shows you the photos of students in your Tutorial/Lab/Lecture group, 
// to be used in the Class Roster page.

// ***********************************************************
// READ THE FOLLOWING BEFORE STARTING
// ***********************************************************
// 1. On a module's page in IVLE, click on groups
// 2. Navigate to any of the tabs and select the correct group.
// 3. Fire up the JavaScript console of your browser and paste in the code below and press enter. 

// Credits: Camillus Cai for the full matric number function

var normalize = function (id) {
  var matches = id.toUpperCase().match(/^A\d{7}|U\d{6,7}/);
  if (matches) {
    var match = matches[0];
    if (match[0] === 'U' && match.length === 8) {
      match = match.slice(0, 3) + match.slice(4);
    }
    var weights = {
      U: [0, 1, 3, 1, 2, 7],
      A: [1, 1, 1, 1, 1, 1]
    }[match[0]];
    for (var i = 0, sum = 0, digits = match.slice(-6); i < 6; i++) {
      sum += weights[i] * digits[i];
    }
    return match + 'YXWURNMLJHEAB'[sum % 13];
  }
};

var nopics = document.evaluate('//img[@src="/images/nophoto.jpg" and @id]', document, null, 6, null);
for (var i = 0; i < nopics.snapshotLength; i++) {
  var fullMatric = normalize(nopics.snapshotItem(i).id);
  if (fullMatric) {
    var img = nopics.snapshotItem(i);
    img.onerror = function () {
      var next = {'U':'P', 'P':'X', 'X':null}[this.src.slice(-1)];
      if (next) {
        this.src = this.src.slice(0, -1) + next;
      }
    };
    img.src = 'https://mysoc.nus.edu.sg/mysoc/images/stdphoto.php?matric=' + fullMatric + '&type=U';
  }
}
