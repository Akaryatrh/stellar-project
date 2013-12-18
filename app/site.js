(function($){


	$(function(){


		/* Custom Modernizr tests */
		Modernizr.addTest('ipad', function () {
			return !!navigator.userAgent.match(/iPad/i);
		});


		/*
		 * MODULES initialization
		 */


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

		var modules = {

			// Loop
			modulesInit : function(){
				var moduleLength = $("#container .module").length;
				for (var i = 0; i < moduleLength; i++) {
					var currentModule = $("#container .module").eq(i);
					var currentDef = this.definitions[i];
					if(currentDef !== undefined){
						var currentDefinition = currentDef["method"];
						if(currentDefinition !== false){
							this.methods[currentDefinition].init(currentModule);
						}	
					}
				};
			},

			// Definition
			definitions : [
				{
					name: "module_1",
					method: false
				},

				{
					name: "module_2",
					method: "diaporama"
				},

				{
					name: "module_3",
					method: "video"
				},

				{
					name: "module_4",
					method: false
				}
				
			],


			methods : {

				// Resize images containers, bind events & auto start diapo
				diaporama : {

					indexDiapo: 0,
					
					init: function(target){
						
						
						var items = target.find(".diaporama li");
						var itemsLength = items.length;
						var width = target.width();
						var _this = this;
						var autoPlay;
						// Resize
						items.width(width);

						// Bind events
						// Click arrows
						target.find(".arrows .arrow").on("click", function(){
							var isLeft = $(this).is(".left");
							var direction = -1;
							
							// Clicking left but first module
							if(isLeft && _this.indexDiapo === 0){
								_this.indexDiapo = itemsLength - 1;

							// Clicking left on any other module
							} else if(isLeft){
								_this.indexDiapo--;

							// Clicking right and last module
							} else if(!isLeft && _this.indexDiapo === itemsLength - 1){
								_this.indexDiapo = 0;

							// Clicking right on any other module
							} else if(!isLeft){
								_this.indexDiapo++;
							}

							var params = {
								target: target,
								index : _this.indexDiapo,
								direction : direction
							};
							_this.moveDiapo(params);

						});
						// Mouse entering diaporama
						target.on("mouseenter",function(){
							clearInterval(autoPlay)
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
							autoPlay = setInterval(function(){
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
						params.target.find(".diaporama").transition({left: (decal*params.index)*params.direction});
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
						console.log()
					}
				}

			}


		}; 
		
		modules.modulesInit();


		if(!Modernizr.ipad){
			// Init parallax
			$.stellar({
				hideDistantElements: false,
				horizontalScrolling: false
			});
		}
		

		// Fallback to animate if transition is unsupported
		if (!$.support.transition) {
  			$.fn.transition = $.fn.animate;
		}
		var dWidth = $(document).width();
		var dHeight = $(document).height();
		console.log(dWidth, dHeight);





	});
	

})(jQuery);