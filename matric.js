(function () {
  var calculateMatricNumber = function (id) {
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

  var imgs = document.getElementsByTagName('img');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    if (img.id && img.src === 'https://ivle.nus.edu.sg/images/nophoto.jpg') {
      var matricNumber = calculateMatricNumber(img.id);
      if (matricNumber) {
        img.src = 'https://mysoc.nus.edu.sg/mysoc/images/stdphoto.php?matric=' + matricNumber + '&type=U';
      }
    }
  }
})();