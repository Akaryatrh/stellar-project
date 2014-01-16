#PARALLAX DEMO
  
Project compiles with the help of [Brunch][1]. Brunch requires [Node.js][2]  
Build dependencies are managed with brunch via [npm][3] (comes with Node.js) -> see `package.json`  
Project dependencies are managed with [Bower][4] -> see `bower.json`  

  [1]: http://brunch.io/
  [2]: http://nodejs.org/
  [3]: https://npmjs.org/
  [4]: http://bower.io/
  

Current configuration takes all `javaScript` & `coffeeScript` files in `/app`, and output them in `/public/javascripts/app.js`. It takes too all `javaScript` & `coffeeScript` files in `/vendor` and `/bower_components` and outputs them in `/public/javascripts/vendor.js`. Current conf ouputs too associated `.map` files (production mode does not).  
All `css` and `stylus` files are compiled/copied in `/public/stylesheets/app.css` (with its associated `.map` file, excpet in prod mode).
All files from `/app/assets` are copied in `/public` (as fonts and images).  
  
Please see `config.coffee` for details  
  
  
Build process :  
---------------
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




Technical choices :
------------------
  - `jQuery` is mandatory
  - Parallax effect is made with [StellarJS][5]
  - Waypoints method calls made with [jQuery Waypoints][6]
  - Slide movement are made with [jQuery Transit][7] or `$.animate()` if css transitions are not supported
  - Diaporama needs image resizing, i tried several methods (pure css resizing, jQuery resizing). In a performance purpose, I chose background images (with `background-size : cover` ). In production, the real solution would be to use img tags with `object-fit` CSS3 property, and using a [jQuery fallback][8] for cross-browsers compatibility.
  - Added [60fps scroll trick][9]

  [5]: http://markdalgleish.com/projects/stellar.js/
  [6]: http://imakewebthings.com/jquery-waypoints/
  [7]: http://ricostacruz.com/jquery.transit/
  [8]: https://github.com/steveworkman/jquery-object-fit
  [9]: https://github.com/ryanseddon/60fps-scroll