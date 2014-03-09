// This script shows you the photos of students in your Tutorial/Lab/Lecture group, 
// to be used in the Class Roster page.

// ***********************************************************
// READ THE FOLLOWING BEFORE STARTING
// ***********************************************************
// 1. On a module's page in IVLE, click on groups
// 2. Navigate to any of the tabs and select the correct group.
// 3. Fire up the JavaScript console of your browser and paste in the code below and press enter. 

// Credits: Camillus Cai for the full matric number function

(function(d) {
  
  var addStudentPhotos = function() {
    var getFullMatricNum = function(matric) {
      matric = matric.toUpperCase();
      if (matric[0] === 'A') {
        if (matric.length < 8 || matric.length > 9) {
          return null;
        }
        if (matric.length == 8) {
          var sum = 0;
          for (var i = 1; i < matric.length; i++) {
            sum += parseInt(matric[i]);
          }
          var mod_13 = sum % 13;
          var checksum = 'YXWURNMLJHEAB'[mod_13];
          matric += checksum;
        }
        return matric;
      } else if (matric[0] === 'U') {
        return null;
      } else {
        return null;
      }
    };

    var tableRows = $('table.dataGridCtrl tr[class^="dataGridCtrl-"]');
    $(tableRows).each(function() {
      var td = $(this).find('td');
      if (td.length > 0) {
        var $img = $(td['0']).find('img');
        var fullMatric = getFullMatricNum($(td['1'])['0'].innerHTML);
        if (fullMatric) {
          $img.attr('src', 'https://mysoc.nus.edu.sg/mysoc/images/stdphoto.php?matric=' + fullMatric + '&type=U');
          $img.attr('height', 227);
          $img.attr('width', 170);
          console.log('Image loaded for ' + fullMatric);
        }
      }
    });
  };

  var script = d.createElement('script');
  script.type = 'text/javascript';
  script.async = false;
  script.onload = addStudentPhotos
  script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
  
  d.getElementsByTagName('head')[0].appendChild(script);
}(document));
