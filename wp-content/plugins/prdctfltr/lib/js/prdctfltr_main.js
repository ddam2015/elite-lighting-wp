(function($){
"use strict";

	var pf_singlesc = false;
	if ( $('.prdctfltr_sc_products.prdctfltr_ajax').length == 1 ) {
		$('body').addClass('prdctfltr-ajax');
		pf_singlesc = 1;
	}

	function prdctfltr_sort_classes() {
		if ( prdctfltr.ajax_class == '' ) {
			prdctfltr.ajax_class = '.products';
		}
		if ( prdctfltr.ajax_category_class == '' ) {
			prdctfltr.ajax_category_class = '.product-category';
		}
		if ( prdctfltr.ajax_product_class == '' ) {
			prdctfltr.ajax_product_class = '.type-product';
		}
		if ( prdctfltr.ajax_pagination_class == '' ) {
			prdctfltr.ajax_pagination_class = '.woocommerce-pagination';
		}
		if ( prdctfltr.ajax_count_class == '' ) {
			prdctfltr.ajax_count_class = '.woocommerce-result-count';
		}
		if ( prdctfltr.ajax_orderby_class == '' ) {
			prdctfltr.ajax_orderby_class = '.woocommerce-ordering';
		}
	}
	prdctfltr_sort_classes();

	var archiveAjax = false;
	if ( $('body').hasClass('prdctfltr-ajax') ) {
		archiveAjax = true;
	}

	if ( archiveAjax === true ) {
		var pageFilters = {};

		$('.prdctfltr_wc').each( function() {
			pageFilters[$(this).attr('data-id')] = $("<div />").append($(this).clone()).html();
		});

		if ( prdctfltr.rangefilters ) {
			pageFilters['ranges'] = prdctfltr.rangefilters;
		}

		if ( $('body').hasClass('prdctfltr-ajax') ) {
			pageFilters['products'] = $("<div />").append($(prdctfltr.ajax_class).clone()).html();
			pageFilters['pagination'] = $("<div />").append($(prdctfltr.ajax_pagination_class).clone()).html();
			pageFilters['count'] = $("<div />").append($(prdctfltr.ajax_count_class).clone()).html();
			pageFilters['orderby'] = $("<div />").append($(prdctfltr.ajax_orderby_class).clone()).html();
		}

		History.replaceState({filters:pageFilters}, document.title, '');
	}

	var curr_data = {};
	var ajaxActive = false;
	var priceRatio = prdctfltr.priceratio;

	$('.prdctfltr_subonly').each( function() {
		prdctfltr_show_sub_cats($(this).closest('.prdctfltr_wc'));
	});

	$.expr[':'].Contains = function(a,i,m){
		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};

	String.prototype.getValueByKey = function (k) {
		var p = new RegExp('\\b' + k + '\\b', 'gi');
		return this.search(p) != -1 ? decodeURIComponent(this.substr(this.search(p) + k.length + 1).substr(0, this.substr(this.search(p) + k.length + 1).search(/(&|;|$)/))) : "";
	};

	function init_ranges() {
		$.each( prdctfltr.rangefilters, function(i, obj3) {
			obj3.onFinish = function (data) {
				if ( $('#'+i).hasClass('pf_rng_price') ) {
					if ( data.min == data.from && data.max == data.to ) {$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_min_"]:first').val( '' );$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_max_"]:first').val( '' ).trigger('change');}else {$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_min_"]:first').val( ( data.from_value == null ? parseInt(data.from)*priceRatio : parseInt($(data.from_value).text())*priceRatio ) );$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_max_"]:first').val( ( data.to_value == null ? parseInt(data.to)*priceRatio : parseInt($(data.to_value).text())*priceRatio ) ).trigger('change');}
				}
				else {
					if ( data.min == data.from && data.max == data.to ) {$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_min_"]:first').val( '' );$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_max_"]:first').val( '' ).trigger('change');} else {$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_min_"]:first').val( ( data.from_value == null ? data.from : $(data.from_value).text() ) );$('#'+i).closest('.prdctfltr_filter').find('input[name^="rng_max_"]:first').val( ( data.to_value == null ? data.to : $(data.to_value).text() ) ).trigger('change');}
				}
			}
			$('#'+i).ionRangeSlider(obj3);
		});
	}
	init_ranges();

	function reorder_adoptive(curr) {

		curr = ( curr == null ? $('.prdctfltr_wc') : curr );

		curr.each( function() {

			var currEl = $(this);

			currEl.find('.prdctfltr_adoptive').each( function() {
				var filter = $(this);
				var checkboxes = filter.find('.prdctfltr_checkboxes');
				filter.find('.pf_adoptive_hide').each( function() {
					var addThis = $(this);
					$(this).remove();
					checkboxes.append(addThis);
				});
			});
		});

	}
	reorder_adoptive();

	$(document).on('click', '.pf_more:not(.pf_activated)', function() {
		var filter = $(this).closest('.prdctfltr_attributes');
		var checkboxes = filter.find('.prdctfltr_checkboxes');

		var displayType = checkboxes.find('> label:first').css('display');

		checkboxes.find('> label').attr('style', 'display:'+displayType+' !important');
		checkboxes.find('.pf_more').html('<span>'+prdctfltr.localization.show_less+'</span>');
		checkboxes.find('.pf_more').addClass('pf_activated');

		if ( filter.closest('.prdctfltr_wc').hasClass('pf_mod_masonry') ) {
			filter.closest('.prdctfltr_filter_inner').isotope('layout');
		}
	});

	$(document).on('click', '.pf_more.pf_activated', function() {
		var filter = $(this).closest('.prdctfltr_attributes');
		var checkboxes = filter.find('.prdctfltr_checkboxes');
		checkboxes.each(function(){
			var max = parseInt(filter.attr('data-limit'));
			if (max != 0 && $(this).find('> label').length > max+1) {

				$(this).find('> label:gt('+max+')').attr('style', 'display:none !important');
				$(this).find('.pf_more').html('<span>'+prdctfltr.localization.show_more+'</span>').removeClass('pf_activated');

				if ( filter.closest('.prdctfltr_wc').hasClass('pf_mod_masonry') ) {
					filter.closest('.prdctfltr_filter_inner').isotope('layout');
				}
			}
		});
	});

	function set_select_index(curr) {

		curr = ( curr == null ? $('.prdctfltr_woocommerce') : curr );

		curr.each( function() {

			var curr_el = $(this);

			var selects = curr_el.find('.pf_select .prdctfltr_filter');
			if ( selects.length > 0 ) {
				var zIndex = selects.length;
				selects.each( function() {
					$(this).css({'z-index':zIndex});
					zIndex--;
				});
			}
		});

	}
	set_select_index();

	function init_search(curr) {

		var curr = $('.prdctfltr_wc');

		curr.each( function() {

			var curr_el = $(this);

			curr_el.find('input.pf_search').each( function() {
				if ( curr_el.hasClass('prdctfltr_click_filter') ) {
					$(this).keyup( function () {
						if ($(this).next().is(':hidden')) {
							$(this).next().show();
						}
						if ($(this).val()==''){
							$(this).next().hide();
						}
					});
				}
			});
		});
	}
	init_search();


	$(document).on( 'keydown', '.pf_search', function() {
		if(event.which==13) {
			$(this).next().trigger('click');
			return false;
		}
	});

	$(document).on( 'click', '.pf_search_trigger', function() {
		var wc = $(this).closest('.prdctfltr_wc');

		if ( !wc.hasClass('prdctfltr_click_filter') ) {
			wc.find('.prdctfltr_woocommerce_filter_submit').trigger('click');
		}
		else {
			var obj = wc.find('.prdctfltr_woocommerce_ordering');
			prdctfltr_respond_550(obj);
		}

		return false;
	});

	function prdctfltr_filter_terms_init(curr) {
		curr = ( curr == null ? $('.prdctfltr_woocommerce') : curr );

		curr.each( function() {
			var curr_el = $(this);
			if ( curr_el.hasClass('prdctfltr_search_fields') ) {
				curr_el.find('.prdctfltr_filter.prdctfltr_attributes .prdctfltr_checkboxes').each( function() {
					var curr_list = $(this);
					prdctfltr_filter_terms(curr_list)
				});
			}
		});

	}
	prdctfltr_filter_terms_init();

	function is_touch_device() {
		return 'ontouchstart' in window || navigator.maxTouchPoints;
	};


	function prdctfltr_init_tooltips(curr) {
		if (is_touch_device()!==true) {
			curr = ( curr == null ? $('.prdctfltr_woocommerce') : curr );

			curr.each( function() {
				var curr_el = $(this);

				var $pf_tooltips = curr_el.find('.prdctfltr_filter.pf_attr_img label, .prdctfltr_terms_customized:not(.prdctfltr_terms_customized_select) label');

				$pf_tooltips
				.on('mouseover', function()
				{
					var $this = $(this);

					if ($this.prop('hoverTimeout'))
					{
						$this.prop('hoverTimeout', clearTimeout($this.prop('hoverTimeout')));
					}

					$this.prop('hoverIntent', setTimeout(function()
					{
						$this.addClass('prdctfltr_hover');
					}, 250));
					})
				.on('mouseleave', function()
					{
					var $this = $(this);

					if ($this.prop('hoverIntent'))
					{
						$this.prop('hoverIntent', clearTimeout($this.prop('hoverIntent')));
					}

					$this.prop('hoverTimeout', setTimeout(function()
					{
						$this.removeClass('prdctfltr_hover');
					}, 250));
				});
			});
		}
	}
	prdctfltr_init_tooltips();

	function reorder_limit(curr) {

		curr = ( typeof curr == 'undefined' ? $('.prdctfltr_wc') : curr );

		curr.each( function() {

			var curr_el = $(this);

			curr_el.find('.prdctfltr_attributes').each( function() {
				var filter = $(this);
				var checkboxes = filter.find('.prdctfltr_checkboxes');
				checkboxes.each(function(){
					var max = parseInt(filter.attr('data-limit'));
					if (max != 0 && $(this).find('> label:not(.pf_adoptive_hide)').length > max+1) {
						$(this).find('> label:gt('+max+')').attr('style', 'display:none !important').end().append($('<div class="pf_more"><span>'+prdctfltr.localization.show_more+'</span></div>'));
					}
				});
			});
		});

	}
	reorder_limit();

	function prdctfltr_show_opened_widgets() {

		if ( $('.prdctfltr-widget').length > 0 && $('.prdctfltr-widget .prdctfltr_error').length !== 1 ) {
			$('.prdctfltr-widget .prdctfltr_filter').each( function() {

				var curr = $(this);

				if ( curr.find('input[type="checkbox"]:checked').length > 0 ) {

					curr.find('.prdctfltr_widget_title .prdctfltr-down').removeClass('prdctfltr-down').addClass('prdctfltr-up');
					curr.find('.prdctfltr_checkboxes').addClass('prdctfltr_down').css({'display':'block'});

				}
			});
		}

	}
	prdctfltr_show_opened_widgets();

	function prdctfltr_init_scroll(curr) {

		curr = ( curr == null ? $('.prdctfltr_wc') : curr );

		if ( curr.hasClass('prdctfltr_scroll_active') && curr.hasClass('prdctfltr_maxheight') ) {

			curr.find('.prdctfltr_filter:not(.prdctfltr_range) .prdctfltr_checkboxes').mCustomScrollbar({
				axis:'y',
				scrollInertia:550,
				autoExpandScrollbar:true,
				advanced:{
					updateOnBrowserResize:true,
					updateOnContentResize:true
				}
			});

			if ( curr.hasClass('pf_mod_row') && ( curr.find('.prdctfltr_checkboxes').length > $('.prdctfltr_filter_wrapper:first').attr('data-columns') ) ) {
				if ( $('.prdctfltr-widget').length == 0 || $('.prdctfltr-widget').length == 1 && $('.prdctfltr-widget .prdctfltr_error').length == 1 ) {

					if ( curr.hasClass('prdctfltr_slide') ) {
						curr.find('.prdctfltr_woocommerce_ordering').show();
					}

					var curr_scroll_column = curr.find('.prdctfltr_filter:first').width();
					var curr_columns = curr.find('.prdctfltr_filter').length;

					curr.find('.prdctfltr_filter_inner').css('width', curr_columns*curr_scroll_column);
					curr.find('.prdctfltr_filter').css('width', curr_scroll_column);
					
					curr.find('.prdctfltr_filter_wrapper').mCustomScrollbar({
						axis:'x',
						scrollInertia:550,
						scrollbarPosition:'outside',
						autoExpandScrollbar:true,
						advanced:{
							updateOnBrowserResize:true,
							updateOnContentResize:false
						}
					});

					if ( curr.hasClass('prdctfltr_slide') ) {
						curr.find('.prdctfltr_woocommerce_ordering').hide();
					}
				}
			}

			if ( $('.prdctfltr-widget').length == 0 || $('.prdctfltr-widget .prdctfltr_error').length == 1 ) {
				curr.find('.prdctfltr_slide .prdctfltr_woocommerce_ordering').hide();
			}

		}
	}

	function prdctfltr_show_sub_cats(curr) {

		curr = ( curr == null ? $('.prdctfltr_woocommerce') : curr );

		curr.find('.prdctfltr_subonly label.prdctfltr_active').each( function() {
			var subParent = $(this).closest('.prdctfltr_sub');

			if ( subParent.length > 0 ) {
				var subParentCon = subParent.html();
			}
			else {
				subParent = $(this).next();
				var subParentCon = subParent.html();
			}

			var checkboxesWrap = $(this).closest('.prdctfltr_checkboxes');
			checkboxesWrap.find('label:not(.prdctfltr_ft_none), .prdctfltr_sub').remove();
			if ( checkboxesWrap.find('.mCSB_container').length > 0 ) {
				checkboxesWrap.find('.mCSB_container').append(subParentCon);
			}
			else {
				checkboxesWrap.append(subParentCon);
			}
		});

	}

	function prdctfltr_show_opened_cats(curr) {

		curr = ( curr == null ? $('.prdctfltr_woocommerce') : curr );

		curr.find('label.prdctfltr_active').each( function() {
			$(this).next().show();
			$(this).parents('.prdctfltr_sub').each( function() {
				$(this).show();
				if ( !$(this).prev().hasClass('prdctfltr_clicked') ) {
					$(this).prev().addClass('prdctfltr_clicked');
				}
			});
		});

	}

	function prdctfltr_all_cats(curr) {

		curr = ( curr == null ? $('.prdctfltr_wc') : curr );

		curr.find('.prdctfltr_filter.prdctfltr_attributes.prdctfltr_expand_parents .prdctfltr_sub').each( function() {
			var curr = $(this);
			if ( !curr.is(':visible') ) {
				curr.show();
				if ( !curr.prev().hasClass('prdctfltr_clicked') ) {
					curr.prev().addClass('prdctfltr_clicked');
				}
			}
		});

	}

	function prdctfltr_make_clears(curr) {

		curr = ( curr == null ? $('.prdctfltr_wc') : curr );

		curr.each( function() {
			var currEl = $(this);
			if ( !currEl.hasClass('pf_remove_clearall') ) {

				var currElLength = currEl.find('label.prdctfltr_active').length;

				var rangeEl = currEl.find('input[name^="rng_m"]').filter(function() { return this.value !== ''; });
				var rangeElLength = rangeEl.length;

				var currOrder = currEl.find('.prdctfltr_orderby label.prdctfltr_active').closest('.prdctfltr_filter').find('input[name="orderby"]');

				if ( currElLength>0 || rangeElLength>0 ) {
					if ( currElLength == 1 && currOrder.length > 0 && currOrder.val() == prdctfltr.orderby && rangeElLength == 0 ) {
						
					}
					else {
						currEl.find('.prdctfltr_buttons').append('<span class="prdctfltr_reset"><label><input name="reset_filter" type="checkbox" /><span>'+prdctfltr.localization.clearall+'</span></label></span>');
					}
				}
			}
		});

	}
	prdctfltr_make_clears();

	function prdctfltr_submit_form(curr_filter) {

		if ( curr_filter.hasClass('prdctfltr_click_filter') || curr_filter.find('input[name="reset_filter"]:checked').length > 0 ) {

			prdctfltr_respond_550(curr_filter.find('form'));

		}

	}

	$('.prdctfltr_wc').each( function() {

		var curr = $(this);

		prdctfltr_init_scroll(curr);

		if ( curr.find('.prdctfltr_filter.prdctfltr_attributes.prdctfltr_expand_parents').length > 0 ) {
			prdctfltr_all_cats(curr);
		}
		else {
			prdctfltr_show_opened_cats(curr);
		}

		if ( curr.hasClass('pf_mod_masonry') ) {
			curr.find('.prdctfltr_filter_inner').isotope({
				resizable: false,
				masonry: { }
			});
			if ( !curr.hasClass('prdctfltr_always_visible') ) {
				curr.find('.prdctfltr_woocommerce_ordering').hide();
			}
		}

		if ( curr.attr('class').indexOf('pf_sidebar_css') > 0 ) {
			if ( curr.hasClass('pf_sidebar_css_right') ) {
				$('body').css('right', '0px');
			}
			else {
				$('body').css('left', '0px');
			}
			if ( !$('body').hasClass('wc-prdctfltr-active-overlay') ) {
				$('body').addClass('wc-prdctfltr-active-overlay');
			}
		}

		pf_preload_image(prdctfltr.url+'lib/images/svg-loaders/'+$(this).attr('data-loader')+'.svg');

	});

	function pf_preload_image(url) {
		var img = new Image();
		img.src = url;
	}

	$(document).on( 'change', 'input[name^="rng_"]', function() {
		var curr = $(this).closest('.prdctfltr_woocommerce');

		if ( curr.hasClass('prdctfltr_click_filter') ) {
			prdctfltr_respond_550(curr.find('.prdctfltr_woocommerce_ordering'));
		}
	});

	var stopAjax = false;
	$(document).on('click', '.prdctfltr_woocommerce_filter_submit', function() {

		if ( $(this).hasClass('pf_stopajax') ) {
			stopAjax = true;
		}

		var curr = $(this).closest('.prdctfltr_woocommerce_ordering');

		prdctfltr_respond_550(curr);

		return false;

	});

	$(document).on('click', '.prdctfltr_woocommerce_filter', function() {

		var curr_filter = $(this).closest('.prdctfltr_woocommerce');

		if (curr_filter.hasClass('pf_mod_masonry') && curr_filter.find('.prdctfltr_woocommerce_ordering:hidden').length > 0 ) {
			if (curr_filter.hasClass('prdctfltr_active')===false) {
				var curr_check = curr_filter.find('.prdctfltr_woocommerce_ordering');
				curr_check.show().find('.prdctfltr_filter_inner').isotope('layout');
				curr_check.hide();
			}
		}

		if ( !curr_filter.hasClass('prdctfltr_always_visible') ) {
			var curr = $(this).closest('.prdctfltr_woocommerce').find('.prdctfltr_woocommerce_ordering');

			if( $(this).hasClass('prdctfltr_active') ) {
				if ( curr_filter.attr('class').indexOf( 'pf_sidebar' ) == -1 ) {
					if ( curr_filter.hasClass( 'pf_fullscreen' ) ) {
						curr.stop(true,true).fadeOut(200, function() {
							curr.find('.prdctfltr_close_sidebar').remove();
						});
					}
					else {
						curr.stop(true,true).slideUp(200);
					}
				}
				else {
					curr.stop(true,true).fadeOut(200, function() {
						curr.find('.prdctfltr_close_sidebar').remove();
					});
					if ( curr_filter.attr('class').indexOf( 'pf_sidebar_css' ) > 0 ) {
						if ( curr_filter.hasClass('pf_sidebar_css_right') ) {
							$('body').css({'right':'0px','bottom':'auto','top':'auto','left':'auto'});
						}
						else {
							$('body').css({'right':'auto','bottom':'auto','top':'auto','left':'0px'});
						}
						$('.prdctfltr_overlay').remove();
					}
				}
				$(this).removeClass('prdctfltr_active');
				$('body').removeClass('wc-prdctfltr-active');
			}
			else {
				$(this).addClass('prdctfltr_active')
				if ( curr_filter.attr('class').indexOf( 'pf_sidebar' ) == -1 ) {
					$('body').addClass('wc-prdctfltr-active');
					if ( curr_filter.hasClass( 'pf_fullscreen' ) ) {
						curr.prepend('<div class="prdctfltr_close_sidebar"><i class="prdctfltr-delete"></i> '+prdctfltr.localization.close_filter+'</div>');
						curr.stop(true,true).fadeIn(200);

						var curr_height = $(window).height() - curr.find('.prdctfltr_filter_inner').outerHeight() - curr.find('.prdctfltr_close_sidebar').outerHeight() - curr.find('.prdctfltr_buttons').outerHeight();

						if ( curr_height > 128 ) {
							var curr_diff = curr_height/2;
							curr_height = curr.outerHeight();
							curr.css({'padding-top':curr_diff+'px'});
						}
						else {
							curr_height = $(window).height() - curr.find('.prdctfltr_close_sidebar').outerHeight() - curr.find('.prdctfltr_buttons').outerHeight() -128;
						}
						curr_filter.find('.prdctfltr_filter_wrapper').css({'max-height':curr_height});
					}
					else {
						curr.stop(true,true).slideDown(200);
					}
				}
				else {
					curr.prepend('<div class="prdctfltr_close_sidebar"><i class="prdctfltr-delete"></i> '+prdctfltr.localization.close_filter+'</div>');
					curr.stop(true,true).fadeIn(200);
					if ( curr_filter.attr('class').indexOf( 'pf_sidebar_css' ) > 0 ) {
						$('body').append('<div class="prdctfltr_overlay"></div>');
						if ( curr_filter.hasClass('pf_sidebar_css_right') ) {
							$('body').css({'right':'160px','bottom':'auto','top':'auto','left':'auto'});
							$('.prdctfltr_overlay').css({'right':'310px'}).delay(200).animate({'opacity':.33},200,'linear');
						}
						else {
							$('body').css({'right':'auto','bottom':'auto','top':'auto','left':'160px'});
							$('.prdctfltr_overlay').css({'left':'310px'}).delay(200).animate({'opacity':.33},200,'linear');
						}
					}
					$('body').addClass('wc-prdctfltr-active');
				}

			}
		}

		return false;
	});

	$(document).on('click', '.prdctfltr_overlay, .prdctfltr_close_sidebar', function() {

		if ( $(this).closest('.prdctfltr_woocommerce').length > 0 ) {
			$(this).closest('.prdctfltr_woocommerce').find('.prdctfltr_woocommerce_filter.prdctfltr_active').trigger('click');
		}
		else {
			$('.prdctfltr_woocommerce_filter.prdctfltr_active:first').trigger('click');
		}

	});

	$(document).on('click', '.pf_default_select .prdctfltr_widget_title', function() {

		var curr = $(this).closest('.prdctfltr_filter').find('.prdctfltr_checkboxes');

		if ( !curr.hasClass('prdctfltr_down') ) {
			curr.prev().find('.prdctfltr-down').attr('class', 'prdctfltr-up');
			curr.addClass('prdctfltr_down');
			curr.slideDown(100);
		}
		else {
			curr.slideUp(100);
			curr.removeClass('prdctfltr_down');
			curr.prev().find('.prdctfltr-up').attr('class', 'prdctfltr-down');
		}

	});

	var pf_select_opened = false;
	$(document).on('click', '.pf_select .prdctfltr_filter > span, .prdctfltr_terms_customized_select.prdctfltr_filter > span', function() {
		pf_select_opened = true;
		var curr = $(this).closest('.prdctfltr_filter').find('.prdctfltr_checkboxes');

		if ( !curr.hasClass('prdctfltr_down') ) {
			curr.prev().find('.prdctfltr-down').attr('class', 'prdctfltr-up');
			curr.addClass('prdctfltr_down');
			curr.slideDown(100, function() {
				pf_select_opened = false;
			});

			if ( !$('body').hasClass('wc-prdctfltr-select') ) {
				$('body').addClass('wc-prdctfltr-select');
			}
		}
		else {
			curr.slideUp(100, function() {
				pf_select_opened = false;

			});
			curr.removeClass('prdctfltr_down');
			curr.prev().find('.prdctfltr-up').attr('class', 'prdctfltr-down');
			if ( curr.closest('.prdctfltr_woocommerce').find('.prdctfltr_down').length == 0 ) {
				$('body').removeClass('wc-prdctfltr-select');
			}
		}

	});

	$(document).on( 'click', 'body.wc-prdctfltr-select', function(e) {

		var curr_target = $(e.target);

		if ( $('.prdctfltr_woocommerce').find('.prdctfltr_down').length > 0 && pf_select_opened === false && !curr_target.is('span, input, i') ) {
			$('.prdctfltr_woocommerce').find('.prdctfltr_down').each( function() {
				var curr = $(this);
				if ( curr.is(':visible') ) {
					curr.slideUp(100);
					curr.removeClass('prdctfltr_down');
					curr.prev().find('.prdctfltr-up').attr('class', 'prdctfltr-down');
				}
			});
			$('body').removeClass('wc-prdctfltr-select');
		}
	});

	$(document).on('click', 'span.prdctfltr_reset label', function() {

		var curr_filter = $(this).closest('.prdctfltr_wc');

		$(this).addClass('prdctfltr_active');

		$(this).find('input').prop('checked', true).attr('checked', true);

		prdctfltr_submit_form(curr_filter);

	});

	$(document).on('click', 'span.prdctfltr_sale label, span.prdctfltr_instock label', function() {

		var field = $(this).children('input:first');

		var curr_name = field.attr('name');
		var curr_filter = $(this).closest('.prdctfltr_wc');

		var ourObj = prdctfltr_get_obj_580(curr_filter);
		var pf_length = prdctfltr_count_obj_580(ourObj);

		$.each( ourObj, function(i, obj) {

			obj = $(obj);

			var curr_obj = obj.find('.prdctfltr_buttons input[name="'+curr_name+'"]');

			if ( !curr_obj.parent().hasClass('prdctfltr_active') ) {
				curr_obj.prop('checked', true).attr('checked', true).parent().addClass('prdctfltr_active');
			}
			else {
				curr_obj.prop('checked', false).attr('checked', false).parent().removeClass('prdctfltr_active');
			}

			if ( !--pf_length ) {
				prdctfltr_submit_form(curr_filter);
			}

		});

		//return false;

	});

	$(document).on('click', '.prdctfltr_byprice label', function() {

		var curr_chckbx = $(this).find('input[type="checkbox"]');
		var curr = curr_chckbx.closest('.prdctfltr_filter');
		var curr_var = curr_chckbx.val().split('-');
		var curr_filter = curr_chckbx.closest('.prdctfltr_wc');

		var ourObj = prdctfltr_get_obj_580(curr_filter);
		var pf_length = prdctfltr_count_obj_580(ourObj);

		if ( curr_var[0] == '' && curr_var[1] == '' || curr_chckbx.closest('label').hasClass('prdctfltr_active') ) {

			$.each( ourObj, function(i, obj) {
				var pfObj = $(obj).find('.prdctfltr_filter.prdctfltr_byprice');
				pfObj.find('.prdctfltr_active input[type="checkbox"]').prop('checked',false).attr('checked',false).closest('label').removeClass('prdctfltr_active');
				pfObj.find('input[name="min_price"]').val('');
				pfObj.find('input[name="max_price"]').val('');
				if ( !--pf_length ) {
					prdctfltr_submit_form(curr_filter);
				}
			});

		}
		else {

			$.each( ourObj, function(i, obj) {
				var pfObj = $(obj).find('.prdctfltr_filter.prdctfltr_byprice');
				pfObj.find('.prdctfltr_active input[type="checkbox"]').prop('checked',false).attr('checked',false).change().closest('label').removeClass('prdctfltr_active');
				pfObj.find('input[name="min_price"]').val(curr_var[0]);
				pfObj.find('input[name="max_price"]').val(curr_var[1]);
				pfObj.find('input[value="'+curr_var[0]+'-'+curr_var[1]+'"][type="checkbox"]').prop('checked',true).attr('checked',true).change().closest('label').addClass('prdctfltr_active');
				if ( !--pf_length ) {
					prdctfltr_submit_form(curr_filter);
				}
			});

		}

		return false;

	});

	$(document).on('click', '.prdctfltr_filter:not(.prdctfltr_byprice) label', function() {

		var curr_chckbx = $(this).find('input[type="checkbox"]');
		var curr = curr_chckbx.closest('.prdctfltr_filter');
		var curr_var = curr_chckbx.attr('value');
		var curr_filter = curr.closest('.prdctfltr_wc');

		if ( curr_filter.hasClass('pf_adptv_unclick') ) {
			if ( curr_chckbx.parent().hasClass( 'pf_adoptive_hide' ) ) {
				return false;
			}
		}

		prdctfltr_check_580(curr, curr_chckbx, curr_var, curr_filter);

		return false;

	});

	function prdctfltr_get_obj_580(curr_filter) {
		var ourObj = {};
		if ( curr_filter.parent().hasClass('prdctfltr_sc_products') && $('.prdctfltr_wc_widget').lenght == 0 && $('.prdctfltr_sc_filter').lenght == 0 ) {
			ourObj[curr_filter.attr('data-id')] = curr_filter;
		}
		else {
			if ( curr_filter.hasClass('prdctfltr_step_filter') ) {
				ourObj[curr_filter.attr('data-id')] = curr_filter;
			}
			else {
				$('.prdctfltr_wc:not([data-id="'+curr_filter.attr('data-id')+'"])').each( function() {
					ourObj[$(this).attr('data-id')] = $(this);
				});
				ourObj[curr_filter.attr('data-id')] = $('.prdctfltr_wc[data-id="'+curr_filter.attr('data-id')+'"]');
			}
		}
		return ourObj;
	}

	function prdctfltr_count_obj_580(ourObj) {
		var pf_length = 0;
		var i;
		for (i in ourObj) {
			if (ourObj.hasOwnProperty(i)) {
				pf_length++;
			}
		}
		return pf_length;
	}

	function prdctfltr_check_580(curr, curr_chckbx, curr_var, curr_filter) {

		var ourObj = prdctfltr_get_obj_580(curr_filter);
		var pf_length = prdctfltr_count_obj_580(ourObj);

		var field = curr.children('input[type="hidden"]:first');

		var curr_name = field.attr('name');
		var curr_val = field.attr('value');

		if ( !curr.hasClass('prdctfltr_multi') ) {

			if ( curr_var == '' || curr_chckbx.closest('label').hasClass('prdctfltr_active') ) {

				$.each( ourObj, function(i, obj) {
					var pfObj = $(obj).find('.prdctfltr_filter[data-filter="'+curr_name+'"]');
					pfObj.find('.prdctfltr_active input[type="checkbox"]').prop('checked',false).attr('checked',false).change().closest('label').removeClass('prdctfltr_active');
					pfObj.find('input[name="'+curr_name+'"]').val('');
					if ( !--pf_length ) {
						prdctfltr_submit_form(curr_filter);
					}
				});

			}
			else {

				$.each( ourObj, function(i, obj) {
					var pfObj = $(obj).find('.prdctfltr_filter[data-filter="'+curr_name+'"]');
					pfObj.find('.prdctfltr_active input[type="checkbox"]').prop('checked',false).attr('checked',false).change().closest('label').removeClass('prdctfltr_active');
					pfObj.find('input[name="'+curr_name+'"]').val(curr_var);
					pfObj.find('input[value="'+curr_var+'"][type="checkbox"]').prop('checked',true).attr('checked',true).change().closest('label').addClass('prdctfltr_active');
					if ( !--pf_length ) {
						prdctfltr_submit_form(curr_filter);
					}
				});

			}

		}
		else {

			if ( curr_chckbx.val() !== '' ) {

				if ( curr_chckbx.closest('label').hasClass('prdctfltr_active') ) {

					if ( curr.hasClass('prdctfltr_merge_terms') ) {
						var curr_settings = ( curr_val.indexOf('+') > 0 ? curr_val.replace('+' + curr_var, '').replace(curr_var + '+', '') : '' );
					}
					else {
						var curr_settings = ( curr_val.indexOf(',') > 0 ? curr_val.replace(',' + curr_var, '').replace(curr_var + ',', '') : '' );
					}

					$.each( ourObj, function(i, obj) {
						var pfObj = $(obj).find('.prdctfltr_filter[data-filter="'+curr_name+'"]');
						pfObj.find('input[name="'+curr_name+'"]').val(curr_settings);
						pfObj.find('input[value="'+curr_var+'"][type="checkbox"]').prop('checked',false).attr('checked',false).change().closest('label').removeClass('prdctfltr_active');
						if ( !--pf_length ) {
							prdctfltr_submit_form(curr_filter);
						}
					});

				}
				else {

					if ( curr.hasClass('prdctfltr_merge_terms') ) {
						var curr_settings = ( curr_val == '' ? curr_var : curr_val + '+' + curr_var );
					}
					else {
						var curr_settings = ( curr_val == '' ? curr_var : curr_val + ',' + curr_var );
					}

					$.each( ourObj, function(i, obj) {
						var pfObj = $(obj).find('.prdctfltr_filter[data-filter="'+curr_name+'"]');
						pfObj.find('input[name="'+curr_name+'"]').val(curr_settings);
						pfObj.find('input[value="'+curr_var+'"][type="checkbox"]').prop('checked',true).attr('checked',true).change().closest('label').addClass('prdctfltr_active');
						if ( !--pf_length ) {
							prdctfltr_submit_form(curr_filter);
						}
					});

				}
			}
			else {

				$.each( ourObj, function(i, obj) {
					var pfObj = $(obj).find('.prdctfltr_filter[data-filter="'+curr_name+'"]');
					pfObj.find('input[name="'+curr_name+'"]').val('');
					pfObj.find('input[type="checkbox"]').prop('checked',false).attr('checked',false).change().closest('label').removeClass('prdctfltr_active');
					if ( !--pf_length ) {
						prdctfltr_submit_form(curr_filter);
					}
				});

			}

		}

	}

	$(document).on('click', '.prdctfltr_filter_title a.prdctfltr_title_remove, .prdctfltr_regular_title a, .prdctfltr_widget_title a', function() {

		var curr_deep = false;
		if ( !$(this).hasClass('prdctfltr_title_remove') ) {
			var curr_deep = true;
			var curr = $(this).closest('.prdctfltr_filter');
		}

		var curr_key = $(this).attr('data-key');

		var curr_filter = $(this).closest('.prdctfltr_wc');

		var shortcodeAjax = false;

		if ( archiveAjax === false ) {

			var checkShortcode = $('.prdctfltr_sc_products');
			var checkWidget = $('.prdctfltr_wc_widget');

			if ( checkShortcode.length > 0 ) {
				if ( checkWidget.length > 0 ) {
					checkShortcode = $('.prdctfltr_sc_products:first');
					shortcodeAjax = true;
					var multiAjax = true;
				}
				else {
					checkShortcode = checkShortcode;
					shortcodeAjax = true;
				}

			}
		}

		if ( archiveAjax===true ) {
			var ourObj = $('.prdctfltr_wc');
		}
		else if ( shortcodeAjax===true ) {
			if ( typeof multiAjax == 'undefined' ) {
				var ourObj = $(this).closest('.prdctfltr_wc');
			}
			else {
				var ourObj = $('.prdctfltr_wc');
			}
		}
		else {
			var ourObj = $(this).closest('.prdctfltr_wc');
		}

		var pf_length = ourObj.length;

		ourObj.each( function(i, obj) {

			obj = $(obj);

			if ( curr_key == 's' ) {
				obj.find('.prdctfltr_search input.pf_search, .prdctfltr_add_inputs input[name="s"]').val('').attr('value','');
			}
			else if ( curr_key == 'byprice' ) {
				obj.find('.prdctfltr_byprice input[type="hidden"], .prdctfltr_price input[type="hidden"]').each(function() {
					$(this).remove();
				});
			}
			else if ( curr_key == 'products_per_page' ) {
				obj.find('.prdctfltr_per_page input[type="hidden"]').each(function() {
					$(this).remove();
				});
			}
			else if ( curr_key == 'instock_products' ) {
				obj.find('.prdctfltr_filter.prdctfltr_instock input[type="hidden"], span.prdctfltr_instock input[type="checkbox"]').each(function() {
					$(this).remove();
				});
			}
			else if ( curr_key == 'sale_products' ) {
				obj.find('span.prdctfltr_sale input[type="checkbox"]').each(function() {
					$(this).remove();
				});
			}
			else if ( curr_key.substr(0,4) == 'rng_' ) {
				obj.find('.prdctfltr_range input[type="hidden"][name$="'+curr_key.substr(4, curr_key.length)+'"]').each(function() {
					$(this).remove();
				});
			}
			else if ( curr_key == 'product_cat' ) {

				var curr_els = obj.find('.prdctfltr_attributes[data-filter="'+curr_key+'"] > input[type="hidden"], .prdctfltr_add_inputs input[name="'+curr_key+'"]');

				if ( curr_deep === true && curr_els.length > 1 ) {

					var cur_vals = obj.find('input[type="checkbox"]:checked');
					cur_vals.each( function() {

						var curr_value = $(this).val();

						curr_els.each( function() {

							var curr_chckd = $(this);
							var curr_chckdval = $(this).val();

							if ( curr_chckdval.indexOf( ',' ) > 0 ) {
								curr_chckd.val(curr_chckdval.replace(',' + curr_value, '').replace(curr_value + ',', ''));
							}
							else if ( curr_chckdval.indexOf( '+' ) > 0 ) {
								curr_chckd.val(curr_chckdval.replace('+' + curr_value, '').replace(curr_value + '+', ''));
							}
							else {
								curr_chckd.val(curr_chckdval.replace(curr_value, '').replace(curr_value, ''));
							}

						});

					});

				}
				else {

					obj.find('.prdctfltr_attributes[data-filter="'+curr_key+'"] > input[type="hidden"], .prdctfltr_add_inputs input[name="'+curr_key+'"]').each(function() {
						$(this).remove();
					});

				}
			}
			else if ( curr_key == 'product_tag' ) {
				var curr_els = obj.find('.prdctfltr_attributes[data-filter="'+curr_key+'"] > input[type="hidden"]');

				if ( curr_deep === true && curr_els.length > 1 ) {

					var cur_vals = obj.find('input[type="checkbox"]:checked');
					cur_vals.each( function() {

						var curr_value = $(this).val();

						curr_els.each( function() {

							var curr_chckd = $(this);
							var curr_chckdval = $(this).val();

							if ( curr_chckdval.indexOf( ',' ) > 0 ) {
								curr_chckd.val(curr_chckdval.replace(',' + curr_value, '').replace(curr_value + ',', ''));
							}
							else if ( curr_chckdval.indexOf( '+' ) > 0 ) {
								curr_chckd.val(curr_chckdval.replace('+' + curr_value, '').replace(curr_value + '+', ''));
							}
							else {
								curr_chckd.val(curr_chckdval.replace(curr_value, '').replace(curr_value, ''));
							}

						});

					});

				}
				else {
					obj.find('.prdctfltr_attributes[data-filter="'+curr_key+'"] > input[type="hidden"]').each(function() {
						$(this).remove();
					});
				}
			}
			else {
				var curr_els = obj.find('.prdctfltr_'+curr_key+' > input[type="hidden"], .prdctfltr_attributes[data-filter="'+curr_key+'"] > input[type="hidden"]');

				if ( curr_deep === true && curr_els.length > 1 ) {

					var cur_vals = obj.find('input[type="checkbox"]:checked');
					cur_vals.each( function() {

						var curr_value = $(this).val();

						curr_els.each( function() {

							var curr_chckd = $(this);
							var curr_chckdval = $(this).val();

							if ( curr_chckdval.indexOf( ',' ) > 0 ) {
								curr_chckd.val(curr_chckdval.replace(',' + curr_value, '').replace(curr_value + ',', ''));
							}
							else if ( curr_chckdval.indexOf( '+' ) > 0 ) {
								curr_chckd.val(curr_chckdval.replace('+' + curr_value, '').replace(curr_value + '+', ''));
							}
							else {
								curr_chckd.val(curr_chckdval.replace(curr_value, '').replace(curr_value, ''));
							}

						});

					});

				}
				else {
					obj.find('.prdctfltr_'+curr_key+' > input[type="hidden"], .prdctfltr_attributes[data-filter="'+curr_key+'"] > input[type="hidden"]').each(function() {
						$(this).remove();
					});
				}
			}
		});

		prdctfltr_respond_550(curr_filter.find('form'));

		return false;
	});

	$(document).on('click', '.prdctfltr_checkboxes label > i', function() {

		var curr = $(this).parent().next();

		$(this).parent().toggleClass('prdctfltr_clicked');

		if ( curr.hasClass('prdctfltr_sub') ) {
			curr.slideToggle(100, function() {
				if ( curr.closest('.prdctfltr_woocommerce').hasClass('pf_mod_masonry') ) {
					curr.closest('.prdctfltr_woocommerce').find('.prdctfltr_filter_inner').isotope('layout');
				}
			});

		}

		return false;

	});

	function prdctfltr_get_loader(curr) {
		var curr_loader = curr.closest('.prdctfltr_wc').attr('data-loader');
		if ( curr.closest('.prdctfltr_wc').find('.prdctfltr_woocommerce_filter i').length > 0 && curr.closest('.prdctfltr_wc').find('.prdctfltr_woocommerce_filter img').length == 0 ) {
			curr.closest('.prdctfltr_wc').find('.prdctfltr_woocommerce_filter').addClass('pf_ajax_loading');
			curr.closest('.prdctfltr_wc').find('.prdctfltr_woocommerce_filter i').replaceWith('<img src="'+prdctfltr.url+'lib/images/svg-loaders/'+curr_loader+'.svg" class="prdctfltr_reset_this prdctfltr_loader" />');
		}
		else {
			if ( curr.closest('.prdctfltr_wc').hasClass('prdctfltr_wc_widget') || curr.closest('.prdctfltr_wc').hasClass('prdctfltr_step_filter') ) {
				curr.closest('.prdctfltr_wc').prepend('<img src="'+prdctfltr.url+'lib/images/svg-loaders/'+curr_loader+'.svg" class="prdctfltr_reset_this prdctfltr_loader" />');
			}
		}
	}

	function prdctfltr_reset_filters_550(obj) {

		if ( obj.closest('.prdctfltr_sc_products').length == 0 && prdctfltr.clearall == 'all' ) {
			var lookAt = 'input[type="hidden"]:not([name="post_type"])';
		}
		else {
			var lookAt = '.prdctfltr_filter input[type="hidden"]';
		}

		obj.find(lookAt).each( function() {
			if ( $(lookAt+'[name="'+this.name+'"]').length>0 ) {
				$(lookAt+'[name="'+this.name+'"]').remove();
			}
			else {
				$(this).remove();
			}
		});


		obj.find('.prdctfltr_filter input.pf_search').val('').prop('disabled',true).attr('disabled','true');

		if ( $('.prdctfltr_wc .prdctfltr_buttons input[name="sale_products"]').length>0 ) {
			$('.prdctfltr_wc .prdctfltr_buttons input[name="sale_products"]').remove();
		}
		if ( $('.prdctfltr_wc .prdctfltr_buttons input[name="instock_products"]').length>0 ) {
			$('.prdctfltr_wc .prdctfltr_buttons input[name="instock_products"]').remove();
		}
		if ( $('.prdctfltr_wc .prdctfltr_add_inputs input[name="orderby"]').length>0 ) {
			$('.prdctfltr_wc .prdctfltr_add_inputs input[name="orderby"]').remove();
		}

		obj.find('input[name="reset_filter"]').remove();
	}

	function prdctfltr_remove_empty_inputs_550(obj) {

		obj.find('.prdctfltr_filter input[type="hidden"], .prdctfltr_filter input.pf_search, .prdctfltr_add_inputs input[type="hidden"]').each(function() { //, .prdctfltr_add_inputs input[type="hidden"]:not([name="post_type"])

			var curr_val = $(this).val();

			if ( curr_val == '' ) {
				if ( $(this).is(':visible') ) {
					$(this).prop('disabled',true).attr('disabled','true');
				}
				else {
					$(this).remove();
				}
			}

		});

	}

	function prdctfltr_remove_ranges_550(obj) {
		obj.find('.prdctfltr_filter.prdctfltr_range').each( function() {
			var curr_rng = $(this);
			if ( curr_rng.find('[name^="rng_min_"]').val() == undefined || curr_rng.find('[name^="rng_max_"]').val() == undefined ) {
				curr_rng.find('input').remove();
			}
		});
	}

	function prdctfltr_check_display_550(obj) {

		if ( $('body').hasClass('wc-prdctfltr-active') ) {

			if ( obj.attr('class').indexOf( 'pf_sidebar' ) == -1 ) {
				if ( obj.hasClass( 'pf_fullscreen' ) ) {
					obj.find('form').stop(true,true).fadeOut(200, function() {
						obj.find('.prdctfltr_close_sidebar').remove();
					});
				}
				else {
					if ( !obj.hasClass('prdctfltr_wc_widget') ) {
						obj.find('form').stop(true,true).slideUp(200);
					}
				}
			}
			else {
				obj.find('form').fadeOut(200);

				if ( obj.attr('class').indexOf( 'pf_sidebar_css' ) > 0 ) {
					if ( obj.hasClass('pf_sidebar_css_right') ) {
						$('body').css({'right':'0px','bottom':'auto','top':'auto','left':'auto'});
					}
					else {
						$('body').css({'right':'auto','bottom':'auto','top':'auto','left':'0px'});
					}
					$('.prdctfltr_overlay').remove();
				}
				obj.find('form').removeClass('prdctfltr_active');
				$('body').removeClass('wc-prdctfltr-active');

			}

		}

	}

	function prdctfltr_get_fields_550(obj) {

		var curr_fields = {};
		var lookAt = ( pf_restrict == 'pagination' ? '.prdctfltr_filter input[type="hidden"], .prdctfltr_filter input.pf_search, .prdctfltr_add_inputs input[name="orderby"], .prdctfltr_add_inputs input[name="s"], .prdctfltr_add_inputs input.pf_added_input' : '.prdctfltr_filter input[type="hidden"], .prdctfltr_filter input.pf_search, .prdctfltr_add_inputs input[name="orderby"], .prdctfltr_add_inputs input[name="s"]' );

		obj.find(lookAt).each( function() {
			if ( $(this).attr('value') !== '' ) {
				curr_fields[$(this).attr('name')] = $(this).attr('value');
			}
		});

		if ( obj.find('.prdctfltr_buttons input[name="sale_products"]:checked').length > 0 ) {
			curr_fields['sale_products'] = 'on';
		}
		if ( obj.find('.prdctfltr_buttons input[name="instock_products"]:checked').length > 0 ) {
			curr_fields['instock_products'] = 'in';
		}

		if ( prdctfltr.analytics == 'yes' ) {

			var analyticsData = {
				action: 'prdctfltr_analytics',
				pf_filters: curr_fields,
				pf_nonce: obj.attr('data-nonce')
				
			}

			$.post(prdctfltr.ajax, analyticsData, function(response) {

			});

		}

		return curr_fields;

	}

	function after_ajax(curr_next) {

		if ( curr_next.find('.prdctfltr_filter.prdctfltr_attributes.prdctfltr_expand_parents').length > 0 ) {
			prdctfltr_all_cats(curr_next);
		}
		else {
			prdctfltr_show_opened_cats(curr_next);
		}
		$('.prdctfltr_subonly').each( function() {
			prdctfltr_show_sub_cats($(this).closest('.prdctfltr_wc'));
		});
		prdctfltr_init_scroll(curr_next);
		prdctfltr_filter_terms_init(curr_next);
		prdctfltr_init_tooltips(curr_next);
		prdctfltr_show_opened_widgets();
		reorder_adoptive(curr_next);
		set_select_index(curr_next);
		init_search(curr_next);
		init_ranges();
		prdctfltr_make_clears(curr_next);
		do_zindexes(curr_next);
		reorder_limit(curr_next);

		if ( curr_next !== undefined ) {
			if ( curr_next.hasClass('pf_mod_masonry') ) {

				curr_next.find('.prdctfltr_woocommerce_ordering').show();
				curr_next.find('.prdctfltr_filter_inner').isotope({
					resizable: false,
					masonry: { }
				});
				if ( !curr_next.hasClass('prdctfltr_always_visible') ) {
					curr_next.find('.prdctfltr_woocommerce_ordering').hide();
				}
			}
			if ( curr_next.hasClass('prdctfltr_step_filter') ) {
				curr_next.find('.prdctfltr_buttons').prepend('<a class="button prdctfltr_woocommerce_filter_submit pf_stopajax" href="#">'+prdctfltr.localization.getproducts+'</a>');
			}

		}

		if ( $(prdctfltr.ajax_orderby_class).length<1 ) {
			$('.prdctfltr_add_inputs input[name="orderby"]').remove();
		}

	}

	var pf_paged = 1;
	var pf_offset = 0;
	var pf_restrict = '';

	$(document).on('click', '.prdctfltr_sc_products.prdctfltr_ajax '+prdctfltr.ajax_pagination_class+' a, body.prdctfltr-ajax.prdctfltr-shop '+prdctfltr.ajax_pagination_class+' a, .prdctfltr-pagination-default a, .prdctfltr-pagination-load-more a', function() {

		if (ajaxActive===true) {
			return false;
		}

		ajaxActive = true;

		var loadMore = ( $(this).closest('.prdctfltr-pagination-load-more').length > 0 ? true : false );
		var curr_link = $(this);

		var shortcodeAjax = false;
		var checkShortcode = curr_link.closest('.prdctfltr_sc_products');
		if ( archiveAjax===false && checkShortcode.length > 0 && checkShortcode.hasClass('prdctfltr_ajax') ) {
			shortcodeAjax = true;
			var obj = checkShortcode.find('form');
		}
		else {
			var obj = $('.prdctfltr_wc:first form');
		}

		var curr_href = curr_link.attr('href');

		if ( loadMore === true ) {
			if ( shortcodeAjax===false ) {
				pf_offset = parseInt( $(prdctfltr.ajax_class).find(prdctfltr.ajax_product_class).length, 10 );
			}
			else {
				pf_offset = parseInt( checkShortcode.find(prdctfltr.ajax_product_class).length, 10 );
			}
		}
		else {
			if ( curr_href.indexOf('paged=') >= 0 ) {
				pf_paged = parseInt( curr_href.getValueByKey('paged'), 10 );
			}
			else {
				var arrUrl = curr_href.split('/');
				pf_paged = arrUrl[arrUrl.indexOf('page') + 1];
			}
		}

		pf_restrict = 'pagination';

		ajaxActive = false;
		prdctfltr_respond_550(obj);

		return false;

	});

	function prdctfltr_respond_550(curr) {

		if (ajaxActive===true) {
			return false;
		}
		ajaxActive = true;

		prdctfltr_get_loader(curr);

		if ( archiveAjax === true ) {
			$(prdctfltr.ajax_class).fadeTo(200,.5).addClass('prdctfltr_faded');
		}

		var shortcodeAjax = false;

		if ( archiveAjax === false ) {

			var checkShortcode = $('.prdctfltr_sc_products.prdctfltr_ajax');
			var checkWidget = $('.prdctfltr_wc_widget');

			if ( checkShortcode.length > 0 ) {
				if ( checkWidget.length > 0 ) {
					checkShortcode = $('.prdctfltr_sc_products.prdctfltr_ajax:first');
					shortcodeAjax = true;
					var multiAjax = true;
				}
				else {
					checkShortcode = curr.closest('.prdctfltr_sc_products.prdctfltr_ajax');
					shortcodeAjax = true;
					if ( stopAjax === true ) {
						shortcodeAjax = false;
						stopAjax = false;
					}
				}
				checkShortcode.find(prdctfltr.ajax_class).fadeTo(200,.5).addClass('prdctfltr_faded');
			}
		}

		var curr_filter = curr.closest('.prdctfltr_wc');

		var ourObj = prdctfltr_get_obj_580(curr_filter);
		var pf_length = prdctfltr_count_obj_580(ourObj);

		var curr_fields = {};
		var requested_filters = {};


		$.each( ourObj, function(i, obj) {

			obj=$(obj);

			var pf_id = obj.attr('data-id');

			var wasReset = false;
			if ( obj.find('input[name="reset_filter"]:checked').length > 0 ) {
				wasReset = true;
				prdctfltr_reset_filters_550(obj);
			}
			else {
				prdctfltr_remove_empty_inputs_550(obj);
			}

			prdctfltr_remove_ranges_550(obj);

			prdctfltr_check_display_550(obj);

			requested_filters[pf_id] = pf_id;

			curr_fields[pf_id] = prdctfltr_get_fields_550(obj);

			if ( !--pf_length ) {

				if (archiveAjax===true||shortcodeAjax===true) {

					var pf_set = 'archive';
					if ( archiveAjax===true && !$('body').hasClass('prdctfltr-shop') ) {
						pf_set = 'shortcode';
					}
					else {
						pf_set = ( archiveAjax === true ? 'archive' : 'shortcode' );
					}

					var data = {
						action: 'prdctfltr_respond_550',
						pf_request: prdctfltr.js_filters,
						pf_requested: requested_filters,

						pf_query: prdctfltr.js_filters[pf_id]['args'],
						pf_shortcode: prdctfltr.js_filters[pf_id]['atts'],
						pf_atts: prdctfltr.js_filters[pf_id]['atts_sc'],
						pf_adds: prdctfltr.js_filters[pf_id]['adds'],

						pf_filters: curr_fields,
						pf_mode: 'archive',
						pf_set: pf_set,
						pf_id: pf_id,
						pf_paged: pf_paged,
						pf_pagefilters: prdctfltr.pagefilters,
						pf_restrict: pf_restrict
					}

					if ( wasReset===true ) {

						if ( prdctfltr.clearall == 'all' ) {
							data.pf_adds = [];
							$.each( data.pf_request, function(n2,obj10) {
								data.pf_request[n2].adds = []
							});
						}

						data.pf_filters = [];

					}

					if ( $('.prdctfltr_wc_widget').length > 0 ) {

						var widget = $('.prdctfltr_wc_widget:first');

						var rpl = $('<div></div>').append(widget.find('.prdctfltr_filter:first').children(':not(input):first').clone()).html().toString().replace(/\t/g, '');
						var rpl_off = $('<div></div>').append(widget.find('.prdctfltr_filter:first').children(':not(input):first').find('.prdctfltr_widget_title').clone()).html().toString().replace(/\t/g, '');
						
						rpl = rpl.replace(rpl_off, '%%%');

						data.pf_widget_title = $.trim(rpl);

					}

					if ( obj.attr('data-lang') !== undefined ) {
						data.lang = obj.attr('data-lang');
					}

					if ( pf_offset>0 ) {
						data.pf_offset = pf_offset;
					}

					if ( $(prdctfltr.ajax_orderby_class).length>0 ) {
						data.pf_orderby_template = 'set';
					}

					if ( $(prdctfltr.ajax_count_class).length>0 ) {
						data.pf_count_template = 'set';
					}

					if ( pf_singlesc==1 ) {
						data.pf_singlesc = 1;
					}

					$.post(prdctfltr.ajax, data, function(response) {
						if (response) {
							var getElement = shortcodeAjax === true ? checkShortcode : false;
							prdctfltr_handle_response_580(response, archiveAjax, shortcodeAjax, getElement);
						}
					});

				}
				else {

					obj.find('input[type="hidden"]').each(function () {
						obj.find('input[name="'+this.name+'"]:gt(0)').remove();
					});

					if ( $('.prdctfltr_wc input[name="orderby"][value="'+prdctfltr.orderby+'"]').length > 0 ) {
						$('.prdctfltr_wc input[name="orderby"][value="'+prdctfltr.orderby+'"]').remove();
					}

					obj.find('.prdctfltr_woocommerce_ordering').submit();

				}

			}

		});

	}

	function prdctfltr_handle_response_580(response, archiveAjax, shortcodeAjax, getElement) {

		var ajax_length = prdctfltr_count_obj_580(response);
		var ajaxRefresh = {};
		var query = '';

		$.each(response, function(n,obj2) {

			if ( n == 'products' ) {
				obj2 = ( $(obj2).find(prdctfltr.ajax_class).length > 0 ? $(obj2).find(prdctfltr.ajax_class) : $(obj2) );

				if (archiveAjax===true) {
					var products =$(prdctfltr.ajax_class);
				}
				else if ( shortcodeAjax===true ) {
					var products = getElement.find(prdctfltr.ajax_class);
				}
				else {
					
				}

				if ( obj2.length<1 ) {
					products.empty();
				}
				else {
					if (pf_offset<1) {
						if ( obj2.find(prdctfltr.ajax_product_class).length > 0 ) {
							if ( pf_restrict == 'pagination' ) {
								pf_get_scroll(products, 0);
							}
							pf_animate_products( products, obj2, 'replace' );
						}
						else {
							products.replaceWith(obj2);
						}
					}
					else {
						if ( obj2.find(prdctfltr.ajax_product_class).length > 0 ) {
							pf_animate_products( products, obj2, 'append' );
							$('.prdctfltr_faded').fadeTo(200,1).removeClass('prdctfltr_faded');
							if ( pf_restrict == 'pagination' ) {
								pf_get_scroll(products, pf_offset);
							}
						}
						else {
							$('.prdctfltr_faded').fadeTo(200,1).removeClass('prdctfltr_faded');
						}
					}
				}
			}
			else if ( n == 'pagination' ) {
				obj2 = $(obj2);

				if (archiveAjax===true&&$('body').hasClass('prdctfltr-shop')) {
					var pagination = ( prdctfltr.ajax_pagination_type=='default' ? $(prdctfltr.ajax_pagination_class) : $('.'+prdctfltr.ajax_pagination_type) );
				}
				else if ( shortcodeAjax===true ) {
					var pagination = getElement.find(prdctfltr.ajax_pagination_class);
					if ( pagination.length < 1 ) {
						var pagination = getElement.find('.prdctfltr-pagination-default');
					}
					if ( pagination.length < 1 ) {
						var pagination = getElement.find('.prdctfltr-pagination-load-more');
					}
				}
				else if ( shortcodeAjax===false ) {
					var pagination = $(prdctfltr.ajax_pagination_class);
					if ( pagination.length < 1 ) {
						var pagination = $('.prdctfltr-pagination-default');
					}
					if ( pagination.length < 1 ) {
						var pagination = $('.prdctfltr-pagination-load-more');
					}
				}

				if ( obj2.length<1 ) {
					pagination.empty();
				}
				else {
					pagination.replaceWith(obj2);
				}

			}
			else if ( n == 'ranges' ) {
				obj2 = $(obj2);
				prdctfltr.rangefilters = obj2[0];
			}
			else if ( n == 'orderby' ) {
				obj2 = $(obj2);
				$(prdctfltr.ajax_orderby_class).replaceWith(obj2);
				$('body.prdctfltr-ajax '+prdctfltr.ajax_orderby_class+' select').on( 'change', function() {

					var orderVal = this.value;

					var checkFilter = $('.prdctfltr_filter input[value="'+orderVal+'"]');

					if ( checkFilter.length>0 ) {
						checkFilter.trigger('click');
						prdctfltr_respond_550(checkFilter.closest('form'));
					}
					else {
						$('.prdctfltr_wc:first .prdctfltr_add_inputs').append('<input name="orderby" value="'+orderVal+'" />');
						prdctfltr_respond_550($('.prdctfltr_wc:first form'));
					}

				});
			}
			else if ( n == 'count' ) {
				obj2 = $(obj2);
				if ( obj2.length<1 ) {
					$(prdctfltr.ajax_count_class).html(prdctfltr.localization.noproducts);
				}
				else {
					$(prdctfltr.ajax_count_class).replaceWith(obj2);
				}
			}
			else if ( n == 'query' ) {
				query = ( obj2 == '' ? location.protocol + '//' + location.host + location.pathname : obj2 );
			}
			else if ( n.substring(0, 9) == 'prdctfltr' ){
				obj2 = $(obj2);

				if ( obj2.hasClass('prdctfltr_wc') ) {
					if ( pf_offset>0&&$(response['products']).find(prdctfltr.ajax_product_class).length>0 || pf_offset==0 ) {
						if ( $('.prdctfltr_wc[data-id="'+n+'"]').length > 0 ) {
							$('.prdctfltr_wc[data-id="'+n+'"]').replaceWith(obj2);
							ajaxRefresh[n] = n;
						}
					}
					else {
						$('.prdctfltr_wc[data-id="'+n+'"]').find('.prdctfltr_woocommerce_filter').replaceWith(obj2.find('.prdctfltr_woocommerce_filter'));
					}
				}
				else if ( obj2.hasClass('prdctfltr-widget') ) {
					if ( $('.prdctfltr_wc[data-id="'+n+'"]').length > 0 ) {
						$('.prdctfltr_wc[data-id="'+n+'"]').closest('.prdctfltr-widget').replaceWith(obj2);
						ajaxRefresh[n] = n;
					}
				}

			}

			if ( !--ajax_length ) {

				if ( !$.isEmptyObject( ajaxRefresh ) ) {
					$.each(ajaxRefresh, function(m,obj4) {
						after_ajax($('.prdctfltr_wc[data-id="'+m+'"]'));
					});
				}

				$(document.body).trigger( 'post-load' );
				if ( prdctfltr.js !== '' ) {
					eval(prdctfltr.js);
				}

				if ( archiveAjax === true && pf_offset == 0 ) {
					History.pushState({response:response, archiveAjax:archiveAjax, shortcodeAjax:shortcodeAjax}, document.title, query);
				}

				ajaxActive = false;
				pf_paged = 1;
				pf_offset = 0;
				pf_restrict = '';

			}

		});
	}

	if ( archiveAjax === true ) {
		var initChange = true;

		History.Adapter.bind(window,'statechange',function(){
			if ( initChange === false ) {
				var state = History.getState();
				if ( typeof state.data.response !== 'undefined' ) {
					prdctfltr_handle_response_580(state.data.response, state.data.archiveAjax, state.data.shortcodeAjax, false);
				}
				else if ( typeof state.data.filters !== 'undefined' ) {
					prdctfltr_handle_response_580(state.data.filters, ( $('body').hasClass('prdctfltr-ajax') ? true : false ), false, false);
				}
			}
			initChange = false;
		});
	}


	$(window).load( function() {
		$('.pf_mod_masonry .prdctfltr_filter_inner').each( function() {
			$(this).isotope('layout');
		});
	});

	if ( $('.prdctfltr-widget').length == 0 || $('.prdctfltr-widget .prdctfltr_error').length == 1 ) {

		$(window).on('resize', function() {

			$('.prdctfltr_woocommerce').each( function() {

				var curr = $(this);
		
				if ( curr.hasClass('pf_mod_row') ) {

					if ( window.matchMedia('(max-width: 768px)').matches ) {
						curr.find('.prdctfltr_filter_inner').css('width', 'auto');
					}
					else {
						var curr_columns = curr.find('.prdctfltr_filter_wrapper:first').attr('data-columns');

						var curr_scroll_column = curr.find('.prdctfltr_woocommerce_ordering').width();
						var curr_columns_length = curr.find('.prdctfltr_filter').length;

						curr.find('.prdctfltr_filter_inner').css('width', curr_columns_length*curr_scroll_column/curr_columns);
						curr.find('.prdctfltr_filter').css('width', curr_scroll_column/curr_columns);
					}
				}
			});
		});
	}

	if ((/Trident\/7\./).test(navigator.userAgent)) {
		$(document).on('click', '.prdctfltr_checkboxes label img', function() {
			$(this).parents('label').children('input:first').change().click();
		});
	}

	if ((/Trident\/4\./).test(navigator.userAgent)) {
		$(document).on('click', '.prdctfltr_checkboxes label > span > img, .prdctfltr_checkboxes label > span', function() {
			$(this).parents('label').children('input:first').change().click();
		});
	}

	function prdctfltr_filter_terms(list) {

		var curr_filter = list.closest('.prdctfltr_wc');
		var form = $("<div>").attr({"class":"prdctfltr_search_terms","action":"#"}),
		input = $("<input>").attr({"class":"prdctfltr_search_terms_input prdctfltr_reset_this","type":"text","placeholder":prdctfltr.localization.filter_terms});
		

		if ( curr_filter.hasClass('pf_select') || curr_filter.hasClass('pf_default_select') || list.closest('.prdctfltr_filter').hasClass('prdctfltr_terms_customized_select') ) {
			$(form).append("<i class='prdctfltr-search'></i>").append(input).prependTo(list);
		}
		else{
			$(form).append("<i class='prdctfltr-search'></i>").append(input).insertBefore(list);
		}

		$(input)
		.change( function () {
			var filter = $(this).val();
			if(filter) {
				var curr = $(this).closest('.prdctfltr_filter');
				if ( curr.find('div.prdctfltr_sub').length > 0 ) {
					$(list).find(".prdctfltr_sub:not(:visible)").css({'margin-left':0}).show().prev().addClass('prdctfltr_clicked');
					if ( curr.hasClass('prdctfltr_searching') === false ) {
						curr.addClass('prdctfltr_searching');
					}
				}
				$(list).find("label > span:not(:Contains(" + filter + "))").closest('label').hide();
				$(list).find("label > span:Contains(" + filter + ")").closest('label').show();
				curr.find('.pf_more').hide();
			}
			else {
				var curr = $(this).closest('.prdctfltr_filter');
				if ( curr.find('div.prdctfltr_sub').length > 0 ) {
					$(list).find(".prdctfltr_sub:visible").css({'margin-left':'22px'}).hide().prev().removeClass('prdctfltr_clicked');
				}
				curr.removeClass('prdctfltr_searching');
				$(list).find("label > span").closest('label').show();

				var checkboxes = curr.find('.prdctfltr_checkboxes');

				checkboxes.each(function(){
					var max = parseInt(curr.attr('data-limit'));
					if (max != 0 && $(this).find("label").length > max+1) {
						$(this).find('label:gt('+max+')').attr('style', 'display:none !important');
						$(this).find(".pf_more").html('<span>'+prdctfltr.localization.show_more+'</span>').removeClass('pf_activated');
					}
				});
				curr.find('.pf_more').show();
			}

			if ( curr_filter.hasClass('pf_mod_masonry') ) {
				curr_filter.find('.prdctfltr_filter_inner').isotope('layout');
			}

			return false;
		})
		.keyup( function () {
			$(this).change();
		});

	}

	$(document).on('click', '.prdctfltr_sc_products.prdctfltr_ajax '+prdctfltr.ajax_class+' '+prdctfltr.ajax_category_class+' a, .prdctfltr-shop.prdctfltr-ajax '+prdctfltr.ajax_class+' '+prdctfltr.ajax_category_class+' a', function() {

		var curr = $(this).closest(prdctfltr.ajax_category_class);

		var curr_sc = ( curr.closest('.prdctfltr_sc_products').length > 0 ? curr.closest('.prdctfltr_sc_products') : $('.prdctfltr_sc_products:first').length > 0 ? $('.prdctfltr_sc_products:first') : $('.prdctfltr_woocommerce:first').length > 0 ? $('.prdctfltr_woocommerce:first') : 'none' );

		if ( curr_sc == 'none' ) {
			return;
		}

		if ( curr_sc.hasClass('prdctfltr_sc_products') ) {
			var curr_filter = ( curr_sc.find('.prdctfltr_woocommerce').length > 0 ? curr_sc.find('.prdctfltr_woocommerce') : $('.prdctfltr-widget').find('.prdctfltr_woocommerce') );
		}
		else if ( $('.prdctfltr_sc_products').length == 0 ) {
			var curr_filter = curr_sc;
		}
		else {
			return;
		}

		var cat = curr.find('.prdctfltr_cat_support').data('slug');

		var hasFilter = curr_filter.find('.prdctfltr_filter[data-filter="product_cat"] input[value="'+cat+'"]:first');

		if ( hasFilter.length > 0 ) {
			hasFilter.trigger('click');
			if ( !curr_filter.hasClass('prdctfltr_click_filter') ) {
				curr_filter.find('.prdctfltr_woocommerce_filter_submit').trigger('click');
			}
		}
		else {
			var hasField = curr_filter.find('.prdctfltr_filter[data-filter="product_cat"]');

			if ( hasField.length > 0 ) {
				hasField.find('input[name="product_cat"]').val(cat);
			}
			else {
				var append = $('<input name="product_cat" type="hidden" value="'+cat+'" />');
				curr_filter.find('.prdctfltr_add_inputs').append(append);
			}

			if ( !curr_filter.hasClass('prdctfltr_click_filter') ) {
				curr_filter.find('.prdctfltr_woocommerce_filter_submit').trigger('click');
			}
			else {
				prdctfltr_respond_550(curr_filter.find('form'));
			}
		}

		return false;

	});

	if ( $('body').hasClass('prdctfltr-ajax') ) {
		if ( $('body.prdctfltr-ajax '+prdctfltr.ajax_orderby_class).length>0 ) {

			$(document).on('submit', 'body.prdctfltr-ajax '+prdctfltr.ajax_orderby_class, function() {
				return false;
			});

			$('body.prdctfltr-ajax '+prdctfltr.ajax_orderby_class+' select').on( 'change', function() {

				var orderVal = this.value;

				var checkFilter = $('.prdctfltr_filter input[value="'+orderVal+'"]');

				if ( checkFilter.length>0 ) {
					checkFilter.trigger('click');
					prdctfltr_respond_550(checkFilter.closest('form'));
				}
				else {
					$('.prdctfltr_wc:first .prdctfltr_add_inputs').append('<input name="orderby" value="'+orderVal+'" />');
					prdctfltr_respond_550($('.prdctfltr_wc:first form'));
				}

			});

		}

	}

	function pf_get_scroll( products, offset ) {

		if ( prdctfltr.ajax_scroll == 'products' ) {
			if ( offset>0 ) {
				var objOffset = products.find(prdctfltr.ajax_product_class+':gt('+offset+')').offset().top;
			}
			else {
				if ( products.closest('.prdctfltr_sc_products') > 0 ) {
					var objOffset = products.offset().top;
				}
				else {
					var objOffset = $('.prdctfltr_wc.prdctfltr_wc_widget').length > 0 ? $('.prdctfltr_wc_widget:first').offset().top : $('.prdctfltr_wc:first').offset().top;
					if ( objOffset > 500 ) {
						objOffset = 500;
					}
				}
			}

			$('html, body').animate({
				scrollTop: objOffset-100
			}, 500);
		}
		else if ( prdctfltr.ajax_scroll == 'top' ) {
			$('html, body').animate({
				scrollTop: 0
			}, 500);
		}

	}

	function pf_animate_products( products, obj2, type ) {
		if ( type=='append' ) {
			if ( prdctfltr.ajax_animation == 'none' ) {
				products.append(obj2.contents().unwrap());
			}
			else if ( prdctfltr.ajax_animation == 'slide' ) {

				var beforeLength = products.find(prdctfltr.ajax_product_class).length;

				products.append(obj2.contents().unwrap());
				var curr_products = products.find(prdctfltr.ajax_product_class+':gt('+beforeLength+')');

				curr_products.hide();
				if ( typeof curr_products !== 'undefined' ) {
					curr_products.each(function(i) {
						$(this).delay((i++) * 100).slideDown({duration: 200,easing: 'linear'});
					});
				}

			}
			else if ( prdctfltr.ajax_animation == 'random' ) {

				var beforeLength = products.find(prdctfltr.ajax_product_class).length;

				products.append(obj2.contents().unwrap());
				var curr_products = products.find(prdctfltr.ajax_product_class+':gt('+beforeLength+')');

				curr_products.css('visibility', 'hidden');
				if ( typeof curr_products !== 'undefined' ) {
					curr_products.css('visibility', 'hidden');

					var interval = setInterval(function () {
					var $ds = curr_products.not('.pf_faded');
					$ds.eq(Math.floor(Math.random() * $ds.length)).css('visibility','visible').hide().fadeTo(100, 1).addClass('pf_faded');
						if ($ds.length == 1) {
							clearInterval(interval);
						}
					}, 50);
				}

			}
			else {

				var beforeLength = products.find(prdctfltr.ajax_product_class).length;

				products.append(obj2.contents().unwrap());
				var curr_products = products.find(prdctfltr.ajax_product_class+':gt('+beforeLength+')');

				curr_products.hide();
				if ( typeof curr_products !== 'undefined' ) {
					curr_products.each(function(i) {
						$(this).delay((i++) * 100).fadeTo(100, 1);
					});
				}
			}
			
		}
		else {

			if ( prdctfltr.ajax_animation == 'none' ) {
				products.replaceWith(obj2);
			}
			else if ( prdctfltr.ajax_animation == 'slide' ) {
				products.replaceWith(obj2);
				var curr_products = obj2.find(prdctfltr.ajax_product_class);

				curr_products.hide();
				if ( typeof curr_products !== 'undefined' ) {
					curr_products.each(function(i) {
						$(this).delay((i++) * 100).slideDown({duration: 200,easing: 'linear'});
					});
				}
			}
			else if ( prdctfltr.ajax_animation == 'random' ) {
				products.replaceWith(obj2);
				var curr_products = obj2.find(prdctfltr.ajax_product_class);

				curr_products.css('visibility', 'hidden');
				if ( typeof curr_products !== 'undefined' ) {
					curr_products.css('visibility', 'hidden');

					var interval = setInterval(function () {
					var $ds = curr_products.not('.pf_faded');
					$ds.eq(Math.floor(Math.random() * $ds.length)).css('visibility','visible').hide().fadeTo(100, 1).addClass('pf_faded');
						if ($ds.length == 1) {
							clearInterval(interval);
						}
					}, 50);
				}
			}
			else {
				products.replaceWith(obj2);
				var curr_products = obj2.find(prdctfltr.ajax_product_class);

				curr_products.hide();
				if ( typeof curr_products !== 'undefined' ) {
					curr_products.each(function(i) {
						$(this).delay((i++) * 100).fadeTo(100, 1);
					});
				}
			}
		}
	}

	if ( $(prdctfltr.ajax_orderby_class).length<1 ) {
		$('.prdctfltr_add_inputs input[name="orderby"]').remove();
	}

	function do_zindexes(curr) {
		curr = ( curr == null ? $('.prdctfltr_wc') : curr );

		curr.each( function() {
			if ( $(this).hasClass('pf_select')) {
				var objCount = $(this).find('.prdctfltr_filter');
			}
			else {
				var objCount = $(this).find('.prdctfltr_terms_customized_select');
			}
			

			var c = objCount.length;
			objCount.css('z-index', function(i) {
				return c - i + 10;
			});

		});
	}
	do_zindexes();

})(jQuery);