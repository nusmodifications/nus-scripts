![Logo](extension/icon128.png)

IVLE Photos
=================

**EDIT**: As of 31/10/2014, IVLE does not render the matric number of students in its HTML anymore. Hence this chrome extension no longer works. On one hand, I'm sad that the extension is broken, but on the other hand, applause for IVLE for finally stepping up security. - Yang Shun

This script allows you to know your classmates by showing their faces in IVLE. The 4 ways to use it:

1. Install the **"Know Your Classmates"** Chrome extension:
  - Grab it here [https://chrome.google.com/webstore/detail/know-my-classmates/efalkfbaajfiggdnknfdbcpcdigfmceg]
2. Add the chrome extension from source
  - Navigate to chrome://extensions in your browser.
  - Check the **Developer mode** checkbox.
  - Click on **Load unpacked extension** and select the `extension` folder.
  - Go to any IVLE **Class Roster** or **Groups** page and you will see your classmates' photos!
3. Via Developer Console
  - Open up the developer console of your browser.
  - Copy the contents inside `photo.js` and run it.
  - You will have to execute the code for every new page you navigate to.
5. Via Bookmarklet
  - Open up `bookmarklet.html` and drag the button into your bookmarks bar.
  - Click on the bookmarklet for every new page you navigate to.
