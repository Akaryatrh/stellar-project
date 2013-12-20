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

						if(currentDefMethod !== false){
							this.methods[currentDefMethod].init(currentModule);
						}	
					}
				};
			},

			// Definition
			definitions : [

				{
					name: "module_2",
					method: "diaporama"
				},

				{
					name: "module_3",
					method: "video"
				},

				{
					name: "module_7",
					method: "photoGrid"
				},

				{
					name: "module_8",
					method: "diaporama"
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
							//launchInterval();
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

						//launchInterval();


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

						// Sometimes we need to create a parallax effect vertically (but can't use scroll position)
						if(diapo.data("scroll-h")){
							var imageUrl = diapo.css('background-image');
							var imageWidth = 0;
							var image;

							// Remove url() or in case of Chrome url("")
							imageUrl = imageUrl.match(/^url\("?(.+?)"?\)$/);
						    imageUrl = imageUrl[1];
						    image = new Image();
						    image.src = imageUrl;

						    // just in case it is not already loaded
						    // TODO : FIX RATIO / MOVEMENT
						    $(image).bind("load",function () {
						        var ratio = image.width / diapo.width();
						        console.log(ratio);
						        var bpy = diapo.css('backgroundPosition').split(' ')[1];
								properties.backgroundPosition = (ratio * movement)+'px '+bpy;
						        diapo.transition(properties, 5000);
						    });
						}else{
							diapo.transition(properties, 5000);
						}

						
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


				photoGrid : {

					init : function(target){
						var lightBox = target.find(".lightBox");
						var _this = this;
						// Events
						// Click on thumbnails
						target.find(".block").on("click", function(){
							_this.insertImage(target, $(this));
							lightBox.addClass("active");
						});

						// Click on thumbnails
						lightBox.on("click", function(){
							lightBox.removeClass("active");
							imgContainer.empty();
						});

					},

					insertImage : function(target, source){
						var imgContainer = target.find(".lightBox .imgContainer");
						imgContainer.empty();
						var image = new Image();
						console.log(source.data());
						image.src=source.data("largeimg");
						imgContainer.append(image);
					}
				}

			}


		}; 
		
		modules.modulesInit();


		if(!Modernizr.ipad){
			// Init parallax
			$.stellar({
				hideDistantElements: false,
				horizontalScrolling: false,
			    verticalOffset: 0,
			    horizontalOffset: 0
			});
		}
		

		// Fallback to animate if transition is unsupported
		if (!$.support.transition) {
  			$.fn.transition = $.fn.animate;
		}





	});
	

})(jQuery);