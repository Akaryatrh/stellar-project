PARALLAX DEMO

Project compiles with the help of Brunch (http://brunch.io/). Brunch requires nodeJS (http://nodejs.org/)  
Build dependencies are managed with brunch via NPM (comes with nodeJS) > see package.json  
Project dependencies are managed with Bower (http://bower.io/) > see bower.json  

Current configuration takes all js/coffee files in app, and output them in /public/javascripts/app.js. It takes too all js/coffee files in /vendor and /bower_components and outputs them in /public/javascripts/vendor.js. Current conf ouputs too associated .map files (production mode does not).  
All css and stylus files are compiled/copied in /public/stylesheets/app.css (with its associated .map file, excpet in prod mode).  
All files from /app/assets are copied in /public (as fonts and images).  
  
Please see config.coffee for details  




    // Go to project
    $user: cd project_path
    // Get build dependencies
    $user: npm install
    // Get project dependencies
    $user: bower install
    // Build project
    $user: brunch b
    // Start a server on port 3333 (default port) that watches for live changes
    $user: brunch -w -s

    // Project is now accessible from http://localhost:3333




#TECHNICAL CHOICES
- jQuery is mandatory
- Parallax effect is made with StellarJS (http://markdalgleish.com/projects/stellar.js/)
- Waypoints method calls made with jQuery Waypoints (http://imakewebthings.com/jquery-waypoints/)
- Slide movement are made with jquery transition or $.animate() if transition are unsupported
- Diaporama needs image resizing, i tried several methods (pure css resizing, jQuery resizing). In a performance purpose, I chose background images (with background-size : cover). In production, the real solution would be to use img tags with object-fit CSS3 property, and using a jQuery fallback (https://github.com/steveworkman/jquery-object-fit) for cross-browsers compatibility.
- Added 60fps scroll trick : https://github.com/ryanseddon/60fps-scroll