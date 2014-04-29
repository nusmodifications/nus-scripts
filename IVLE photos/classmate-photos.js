// This script shows you the photos of students in your Tutorial/Lab/Lecture group, 
// to be used in the Class Roster page.

// ***********************************************************
// READ THE FOLLOWING BEFORE STARTING
// ***********************************************************
// 1. On a module's page in IVLE, click on groups
// 2. Navigate to any of the tabs and select the correct group.
// 3. Fire up the JavaScript console of your browser and paste in the code below and press enter. 

// Credits: Camillus Cai for the full matric number function

(function () {
    var calculateNUSMatricNumber = function (id) {
        var matches = id.toUpperCase().match(/^A\d{7}|U\d{6,7}/);
        if (matches) {
            var match = matches[0];
     
            // Discard 3rd digit from U-prefixed NUSNET ID
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

    var PHOTO_URL = 'https://mysoc.nus.edu.sg/mysoc/images/stdphoto.php?matric=';
    var TYPES = ['U', 'P', 'X'];

    var swapImage = function (img) {
        if (!img.alt || img.alt.indexOf('Student Photograph') === -1) {
            return;
        }
        var id = img.id || img.parentNode.parentNode.nextSibling.innerHTML || img.parentNode.parentNode.parentNode.nextSibling.innerHTML;
        var matricNumber = calculateNUSMatricNumber(id);
        var originalSrc = img.src;
        var photoUrlPrefix = PHOTO_URL + matricNumber + '&type=';
        var typeIndex = 0;
        img.width = 170;
        img.height = 227;
        img.onerror = function () {
            img.src = typeIndex < 3 ? photoUrlPrefix + TYPES[typeIndex++] : originalSrc;
        };
        img.onerror.call();
    };

    var imgs = document.getElementsByTagName('img');
    for (var i = 0; i < imgs.length; i++) {
        swapImage(imgs[i]);
    }
})();
