$('document').ready(function () {
	requirejs([
		'antergos/masonry',
		'antergos/imagesLoaded',
	], function (Masonry, imagesLoaded) {
		var fixed = localStorage.getItem('fixed') || 0,
			masonry;

		function doMasonry() {
			if ($('.categories').length) {

				$('.parent-cat').each(function (index) {
					var $pcat = $(this);
					var pcatId = 'pcat_' + index;
					var pcatClass = '.pcat_' + index;
					$pcat.addClass(pcatId);
					var $ccats = $pcat.find('.category-item');

					if (!$pcat.find('.new-row').length) {
						$ccats.each(function (index) {
							if ((index + 1) % 3 == 0) {
								$('<div class="clearfix visible-lg visible-md new-row"></div>').insertAfter($(this));
							}
						});
					}


				});
				var containers = document.querySelectorAll('.parent-cat');

				for (var i = 0, len = containers.length; i < len; i++) {
					var container = containers[i];

					initMasonry(container);


				}

				function initMasonry(container) {
					setTimeout(function () {
						imagesLoaded(container, function () {
							new Masonry(container, {
								itemSelector: '.category-item',
								columnWidth: '.category-item:not(.col-lg-12)',
								transitionDuration: '0'
							});
						});
					}, 300);
				}

			}
		}

		function resize(fixed) {
			fixed = parseInt(fixed, 10);

			var container = fixed ? $('.container-fluid') : $('.container');
			container.toggleClass('container-fluid', fixed !== 1).toggleClass('container', fixed === 1);
			localStorage.setItem('fixed', fixed);
		}

		//resize(fixed);

		$(window).on('action:ajaxify.end', function (ev, data) {
			var url = data.url;

			if (!/^admin\//.test(data.url) && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				doMasonry();
				if ($('.categories').length) {
					$('.category-header .badge i').tooltip();
				}
			}
		});

		if (!$('.admin').length) {
			setupResizer();
		}

		$(window).on('action:posts.loaded', function () {
			doMasonry();
		});

		function setupResizer() {
			var div = $('<div class="overlay-container"><div class="panel resizer pointer"><div class="panel-body"><i class="fa fa-arrows-h fa-2x"></i></div></div></div>');

			div.css({
				position: 'fixed',
				bottom: '20px',
				right: '20px'
			}).hide().appendTo(document.body);

			$(window).on('mousemove', function (ev) {
				if (ev.clientX > $(window).width() - 150 && ev.clientY > $(window).height() - 150) {
					div.fadeIn();
				} else {
					div.stop(true, true).fadeOut();
				}
			});

			div.find('.resizer').on('click', function () {
				fixed = parseInt(fixed, 10) === 1 ? 0 : 1;
				//resize(fixed);
				doMasonry();
			});
		}

		function checkMasonry(checks) {
			var $allCats = $('.category-item').last(),
				$footer = $('footer').offset();
			if ($allCats.length) {
				$allCats = $allCats.offset();
				if ($allCats['top'] > $footer['top']) {
					if (checks <= 10) {
						//console.log('Check ' + checks + ': Grid items are outside of the container. Resetting the layout..');
						doMasonry();
						checks++;
						setTimeout(checkMasonry(checks), 1000);
					}
				} else {
					//console.log('No grid items were found outside of the container. Check ' + checks + ' passed!');
					if (checks <= 10) {
						//console.log('Check will run again in 1 second.');
						checks++;
						setTimeout(checkMasonry(checks), 1000);
					} else {
						//console.log('All checks passed! The grid is displayed properly!');
					}

				}
			}
		}

		$(window).load(function () {
			setTimeout(function () {
				checkMasonry(0);
			}, 1000);
		});
		$(window).on('action:ajaxify.end', function (ev, data) {
			setTimeout(function () {
				checkMasonry(0);
			}, 1000);
		});

	});

	(function () {
		// loading animation
		var refreshTitle = app.refreshTitle,
			loadingBar = $('.loading-bar');

		$(window).on('action:ajaxify.start', function (data) {
			loadingBar.fadeIn(0).removeClass('reset');
		});

		$(window).on('action:ajaxify.loadingTemplates', function () {
			loadingBar.css('width', '90%');
		});

		app.refreshTitle = function (url) {
			loadingBar.css('width', '100%');
			setTimeout(function () {
				loadingBar.fadeOut(250);

				setTimeout(function () {
					loadingBar.addClass('reset').css('width', '0%');
				}, 250);
			}, 750);

			return refreshTitle(url);
		};
	}());
	(function () {
		function doSlick() {
			if ($('.subcategories').length && !$('.slick-initialized').length) {

				$('.subcategories').slick({
					dots: true,
					infinite: true,
					speed: 300,
					slidesToShow: 4,
					slidesToScroll: 4
				});
			}
		}


		$(document).ready(function () {
			doSlick();
			var passwdNotice = localStorage.getItem('passwdNotice'),
				isLoggedIn = $('#isLoggedIn').val();


			if (passwdNotice !== 'True' && isLoggedIn !== 'true' && isLoggedIn !== true) {
				app.alert({
					title: 'Attention Existing Users:',
					message: 'All user accounts were imported from the old forum. For security reasons, passwords were' +
					' not imported. In order to activate your account on the new forum, you must reset your password' +
					' Click this message to <strong>reset your password now</strong>.',
					location: 'right-top',
					type: 'info',
					image: '//antergos.org/info.png',
					closefn: function passwdNoticeClosed() {
						localStorage.setItem('passwdNotice', 'True');
					},
					clickfn: function passwdNoticeClicked() {
						localStorage.setItem('passwdNotice', 'True');
						window.location = '/reset';
					}
				});
			}
		});
		$(window).on('action:ajaxify.end', function (ev, data) {
			doSlick();
		});

	}());
});