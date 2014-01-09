(function () {
  var calculateCheckDigit = function (matricNumber) {
    var matches = matricNumber.match(/^(?:U|A\d)(\d{6})[YXWURNMLJHEAB]?$/i);
    if (matches) {
      var weights = {
        U: [0, -12, -10, -12, -11, -6],
        A: [1, 1, 1, 1, 1, 1]
      }[matricNumber[0].toUpperCase()];

      var sum = 0;
      for (var i = 0; i < 6; i++) {
        sum += weights[i] * matches[1][i];
      }

      // JS modulo operator returns negative remainder for negative dividend.
      // Fix to return positive remainder regardless of dividend sign.
      return 'YXWURNMLJHEAB'[((sum % 13) + 13) % 13];
    }
  };

  var nusnetIdToMatricNumber = function (nusnetId) {
    nusnetId = nusnetId.toUpperCase();
    if (nusnetId[0] === 'U') {
      nusnetId = nusnetId.slice(0, 3) + nusnetId.slice(4);
    }
    var checkDigit = calculateCheckDigit(nusnetId);
    if (checkDigit) {
      return nusnetId + checkDigit;
    }
  };

  var imgs = document.getElementsByTagName('img');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    if (img.id && img.src === 'https://ivle.nus.edu.sg/images/nophoto.jpg') {
      var matricNumber = nusnetIdToMatricNumber(img.id);
      if (matricNumber) {
        img.src = 'https://mysoc.nus.edu.sg/mysoc/images/stdphoto.php?matric=' + matricNumber + '&type=U';
      }
    }
  }
})();