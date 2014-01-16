(function($){


	$(function(){


		/* Custom Modernizr tests */
		Modernizr.addTest('ipad', function () {
			return !!navigator.userAgent.match(/iPad/i);
		});


		


		/*
		 * Nav positionning
		 */

		$(window).scroll(function(){
			var wPOs = $(window).scrollTop();
			var headerHeight = $("header").height();
			var navPos = $("#container .module").eq(1).offset();
			// We check if the window scroll is higher than the top offset of the second module (where the nav should be) 
			if(wPOs > (navPos.top - headerHeight)){
				$("header").addClass("scrolled");
			}else{
				$("header").removeClass("scrolled");
			}
		});



		/*
		 * MODULES initialization
		 */

		var intervals = {};
		var indexes ={};

		var modules = {

			// Loop
			modulesInit : function(){
				var moduleLength = this.definitions.length;
				for (var i = 0; i < moduleLength; i++) {
					var currentDef = this.definitions[i];

					if(currentDef !== undefined){
						var currentModule = $("#container").find("#"+currentDef.name);
						var currentDefMethod = currentDef["method"];
						var currentDefAuto = currentDef["auto"];

						if(currentDefMethod !== false && currentDefAuto === true){
							this.methods[currentDefMethod].init(currentModule);
						}	
					}
				};
			},

			// Definition
			definitions : [

				{
					name: "module_2",
					method: "diaporama",
					auto: true
				},

				{
					name: "module_3",
					method: "video",
					auto: true
				},

				{
					name: "module_4",
					method: "smallSlide"
				},

				{
					name: "module_5",
					method: "animation"
				},

				{
					name: "module_7",
					method: "photoGrid"
				},

				{
					name: "module_8",
					method: "diaporama",
					auto: true
				}
				
			],


			methods : {

				// Resize images containers, bind events & auto start diapo
				diaporama : {
					
					init: function(target){
						
						
						var items = target.find(".diaporama li");
						var itemsLength = items.length;
						var width = target.width();
						var _this = this;
						var autoPlay;
						var targetId = target[0].id;
						indexes[targetId] = 0
						// Resize
						items.width(width);

						// Bind events
						// Click arrows
						target.find(".arrows .arrow").on("click", function(){
							var isLeft = $(this).is(".left");
							var direction = -1;
							
							// Clicking left but first module
							if(isLeft && indexes[targetId] === 0){
								indexes[targetId] = itemsLength - 1;

							// Clicking left on any other module
							} else if(isLeft){
								indexes[targetId]--;

							// Clicking right and last module
							} else if(!isLeft && indexes[targetId] === itemsLength - 1){
								indexes[targetId] = 0;

							// Clicking right on any other module
							} else if(!isLeft){
								indexes[targetId]++;
							}

							var params = {
								target: target,
								index : indexes[targetId],
								direction : direction
							};
							_this.moveDiapo(params);

						});
						// Mouse entering diaporama
						target.on("mouseenter",function(){
							clearInterval(intervals[targetId]);
						});

						// Mouse leaving diaporama
						target.on("mouseleave",function(){
							launchInterval();
						});

						// Resize window
						$(window).resize(function(){
							var width = target.width();
							items.width(width);
						});

						// Auto play
						var launchInterval = function(){
							intervals[targetId] = setInterval(function(){
								target.find(".arrows .arrow.right").trigger("click");
							}, 5000);
						};

						launchInterval();


					},

					/* Params
					 *	target
						index
						direction
					 */
					moveDiapo : function(params){
						var decal = params.target.width();
						var diapo = params.target.find(".diaporama");
						var movement = (decal*params.index)*params.direction;
						var properties = {left: movement};

						// Check if there are any elements to fadeIn/fadeOut

						// Sometimes we need to create a parallax effect horizontally (but can't use scroll position)
						if(diapo.data("scroll-h")){

							var image;
							var allDiapos = diapo.find("li").length;
							// Get background y position
					        var bpy = diapo.css('backgroundPosition').split(' ')[1];
							properties.backgroundPosition = ((-1 * movement) + (movement/allDiapos))+'px '+bpy;
						}

						diapo.transition(properties, 500);
						
						params.target.find(".navigation li").removeClass("active");
						params.target.find(".navigation li").eq(params.index).addClass("active");
					}
				},


				video : {
					init: function(target){

						var video = target.find("video");
						var vWidth, vHeight;
						var _this = this;
						// Events
						video[0].addEventListener("loadedmetadata", function (e) {
						    vWidth = this.videoWidth;
        					vHeight = this.videoHeight;


							target.on("mouseenter",function(){
								video[0].play();
								video[0].controls = true;
								video.toggleClass("active");
							});

							target.on("mouseleave",function(){
								video[0].pause();
								video[0].controls = false;
								video.toggleClass("active");
							});

							$(window).resize(function(){
								_this.resizeVideo(target, video);
							});

							_this.resizeVideo(target, video);

						}, false );

					},

					resizeVideo : function(target, video){
						var vWidth = video[0].videoWidth;
        				var vHeight = video[0].videoHeight;
						var tWidth = target.width();
						var ratio = tWidth/vWidth;
						var newHeight = vHeight * ratio;
						video.height(newHeight);
					}
				},


				smallSlide : {
					init : function(target){
						var index = 0;
						var interval;
						var imgContainer = target.find(".highlight .imgContainer")
						var gallery = imgContainer.find(".gallery");
						var allImages = gallery.find("img");
						var decal = imgContainer.parent().width();
						
						// Will swap images every 3s
						var changeImage = function(){
							interval = setInterval(function(){
								if(index === (allImages.length - 1)){
									index = 0;
								}else{
									index++;
								}

								gallery.transition({
									left: -1 * decal * index
								},250);

							}, 3000);
						};


						// Bindings : start diapo on leave, stop on enter
						imgContainer.on("mouseenter", function(e){
							clearInterval(interval);
						});
						imgContainer.on("mouseleave", function(e){
							changeImage();
						});

						// Call swap
						changeImage();
					}
				},




				animation : {

					init : function(target){
						var _this = this;
						_this.target = target;
						var images = target.find(".productAnimation img");
						// Show logos
						target.find(".logo").addClass("show");
						
						_this.showHide(images.eq(0));
						
					},

					showHide : function(image){
						var _this = this;
						image.transition({opacity: 1},2000);
						if(image.is(':last-child')){
							_this.showInfos(_this.target);
						}else{
							setTimeout(function(){
								image.transition({opacity: 0},1500);
								_this.showHide(image.next());
							},1500);
							
						}
					},

					showInfos : function(){
						var _this = this;
						var bullets = _this.target.find(".bullets")
						var allBullets = bullets.find("li");

						var showBullet = function(bullet){
							setTimeout(function(){
								bullet.addClass("show");
								showBullet(bullet.next());
							},1000);
						};

						bullets.addClass("show");
						showBullet(allBullets.eq(0));

						

					}
				},


				photoGrid : {

					init : function(target){
						var _this = this;
						var lightBox = target.find(".lightBox");
						var imgContainer = lightBox.find(".imgContainer");
						_this.allBlocks = target.find(".modules .block");

						var blocksOrder = _this.shuffleArray(_this.allBlocks);
						for (var i = 0; i < blocksOrder.length; i++) {
							setTimeout(function (x) {
						        return function () {
						            $(blocksOrder[x]).addClass("show");	
						        };
						    }(i), 125 * i);
						};
						target.find("h2").addClass("show");

						// Events

						// Click on thumbnails
						_this.allBlocks.on("click", function(){
							var index = _this.allBlocks.index($(this));
							var params = {
								index : index,
								target : target,
								source : $(this)
							};
							_this.insertImage(params);
						});

						// Exit Lightbox
						lightBox.on("click", function(e){
							lightBox.removeClass("active");
						});

						//Arrows
						lightBox.find(".arrow").on("click", function(e){
							var allBlocksLength = _this.allBlocks.length;
							var currentImage = $(this).closest(".imgContainer").find("img");
							var currentImageSrc = currentImage.attr("src");
							var currentImageindex = currentImage.data("index");

							if($(this).is(".right")){
								if(currentImageindex === allBlocksLength - 1){
									currentImageindex = 0;
								}else{
									currentImageindex++;
								}
							}else{
								if(currentImageindex === 0){
									currentImageindex = allBlocksLength - 1;
								}else{
									currentImageindex--;
								}
							}

							var params = {
								index : currentImageindex,
								target : currentImage
							}
							_this.swapImage(params);
							e.stopPropagation();
						});

					},


					insertImage : function(params){
						var lightBox = params.target.find(".lightBox");
						var imgContainer = lightBox.find(".imgContainer");
						var paginationList = imgContainer.find(".centerNav .navigation li");

						// Remove existing images
						imgContainer.find("img").remove();
						var image = new Image();
						var srcImage = params.source.data("largeimg");

						lightBox.addClass("active");
						imgContainer.addClass("loading");
						
						$(image).one("load",function(e){
							imgContainer.removeClass("loading").append($(image));
							$(image).data("index", params.index);
							paginationList.removeClass();
							paginationList.eq(params.index).addClass("active");
						});
						image.src=srcImage;
					},


					swapImage : function(params){
						var _this = this;
						var target = params.target;
						var index = params.index;
						var image = new Image();
						var imgContainer = target.parent();
						var paginationList = imgContainer.find(".centerNav .navigation li");

						var imgSource = _this.allBlocks.eq(index).data("largeimg");
						imgContainer.addClass("loading");
						$(image).one("load",function(e){
							imgContainer.removeClass("loading");
							target.data("index", params.index);
							target.attr("src", imgSource);
							paginationList.removeClass();
							paginationList.eq(index).addClass("active");
						});
						image.src=imgSource;

					},


					shuffleArray : function(array) {
						var newArray = array.slice(0)
					    for (var i = newArray.length - 1; i > 0; i--) {
					        var j = Math.floor(Math.random() * (i + 1));
					        var temp = newArray[i];
					        newArray[i] = newArray[j];
					        newArray[j] = temp;
					    }
					    return newArray;
					}
				}

			}


		}; 

		modules.modulesInit();


		/* Waypoints */
		$("section").waypoint({

			offset : "50%",
			triggerOnce: true,
			handler: function() {
		  		var currentModule = $(this);
		  		var currentID = $(this).prop("id");
				
				for(var i = 0;i < modules.definitions.length; i++){
					var currentDef = modules.definitions[i];
					var currentModuleName = currentDef["name"];
					var currentDefAuto = currentDef["auto"];
					var currentDefMethod = currentDef["method"];

					// Launch module if not auto
					if(currentModuleName === currentID && currentDefAuto === undefined){
						modules.methods[currentDefMethod].init(currentModule);
						// quit loop
						break;
					}
				}
			}
		});


		if(!Modernizr.ipad){
			// Init parallax
			$.stellar({
				hideDistantElements: false,
				horizontalScrolling: false,
			    verticalOffset: 0,
			    horizontalOffset: 0
			});
		}
		

		// Fallback to animate if transition is not supported
		if (!$.support.transition) {
  			$.fn.transition = $.fn.animate;
		}





	});
	

})(jQuery);