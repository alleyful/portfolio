$(function(){
	var npos = $(window).scrollTop();
	var SW	=	$(window).width();
	var SH	=	$(window).height();
	m_flag = set_ui();
	$('.main_01_slide li').height(SH);
	mainInit();

	
	
	
	var mainSlider = $('.main_01_slide').bxSlider({
		mode:'fade',
		controls:false,
		easing:'easeInOutQuart',
		pause:4000,
		speed:1500,
		//auto:true,
		pager:false
	});


	
	



	// 차트를 그리기
    function activateScene2 () {

        var $content = $('.skills_list'),
            $charts = $content.find('.chart');

        

        // 원형 차트 당 처리
        $charts.each(function(){
            var $chart = $(this),
                // "마스크"를 저장하고 각도 0으로 지정
                $circleLeft = $chart.find('.left .circle-mask-inner')
                    .css({ transform: 'rotate(0)' }),
                $circleRight = $chart.find('.right .circle-mask-inner')
                    .css({ transform: 'rotate(0)' }),
                // 백분율 값을 취득
                $percentNumber = $chart.find('.percent-number'),
                percentData = $percentNumber.text();

            // 백분율 표시를 일단 0
            $percentNumber.text(0);

            // 각도 애니메이션
            $({ percent: 0 }).delay(1000).animate({ percent: percentData }, {
                duration: 1500, 
                progress: function () {
                    var now = this.percent,
                        deg = now * 360 / 100,
                        degRight = Math.min(Math.max(deg, 0), 180),
                        degLeft  = Math.min(Math.max(deg - 180, 0), 180);
                    $circleRight.css({ transform: 'rotate(' + degRight + 'deg)' });
                    $circleLeft.css({ transform: 'rotate(' + degLeft + 'deg)' });
                    $percentNumber.text(Math.floor(now));
                }
            });
        });
    }



	$('#gallery').each(function () {

        var $container = $(this),
            $loadMoreButton = $('#load-more'), // 추가 버튼
            $filter = $('#gallery-filter'),    // 필터링 양식
            addItemCount = 6,                 // 한 번에 표시 할 항목 수
            addedd = 0,                        // 표시 된 항목 수
            allData = [],                      // 모든 JSON 데이터
            filteredData = [];                 // 필터링 된 JSON

        $container.masonry({
            columnWidth: 346,
            gutter: 30,
            itemSelector: '.gallery-item'
        });

        // JSON을 검색하고 initGallery 함수를 실행
        $.getJSON('data/content.json', initGallery);

        //갤러리 초기화
        function initGallery (data) {
			
            // 취득한 JSON 데이터를 저장
            allData = data;

            // 초기 상태에서는 필터링하지 않고 그대로 전체 데이터를 전달
            filteredData = allData;

            // 첫 번째 항목을 표시
            addItems();

            // 추가 버튼을 클릭하면 추가로 표시
            $loadMoreButton.on('click', addItems);

            // 필터 라디오 버튼이 변경되면 필터링을 수행
            $filter.on('change', 'input[type="radio"]', filterItems);



            // 항목 링크에 호버 효과 처리 등록
            $container.on('mouseenter mouseleave', '.gallery-item a', hoverDirection);

        }

        // 항목을 생성하고 문서에 삽입
        function addItems (filter) {

            var elements = [],
                // 추가 데이터의 배열
                slicedData = filteredData.slice(addedd, addedd + addItemCount);

            // slicedData의 요소마다 DOM 요소를 생성
            $.each(slicedData, function (i, item) {				
				
                var itemHTML =  
						'<li class="gallery-item is-loading">' +
							'<a href="" class=""'+
							'data-mnum="' + item.mnum + '"'+
							'data-titlename="' + item.titlename + '"' +
							'data-des="' + item.des + '">' +
								'<img src="' + item.thumb + '" alt="' + item.titlename + '">' +
								'<span class="caption">' +
									'<span class="inner">' +
										'<span class="title"><img src="' + item.logoImage + '" alt="" /> <b>'+ item.titlename +'</b></span>' +
										'<span class="btn_more">More</span>' +
										'<p><span class="category_icon">' + item.category.web+ '</span> <span class="category_icon">' + item.category.mobile+ '</span> <span class="category_icon">' + item.category.operate+ '</span> </p>' +
									'</span>' +
								'</span>' +
							'</a>' +
						'</li>';
                elements.push($(itemHTML).get(0));
            });

            // DOM 요소의 배열을 컨테이너에 넣고 Masonry 레이아웃을 실행
            $container
                .append(elements)
                .imagesLoaded(function () {
                    $(elements).removeClass('is-loading');
                    $container.masonry('appended', elements);

                    // 필터링시 재배치
                    if (filter) {
                        $container.masonry();
                    }
                });

            // 링크에 Colorbox 설정
           // $container.find('a').colorbox({
            //    maxWidth: '970px',
            //    maxHeight: '95%',
            //    title: function () {
           //         return $(this).find('.inner').html();
           //     }
          //  });

            // 추가 된 항목 수량 갱신
            addedd += slicedData.length;

            // JSON 데이터가 추가 된 후에 있으면 추가 버튼을 지운다
            if (addedd < filteredData.length) {
                $loadMoreButton.show();
            } else {
                $loadMoreButton.hide();
            }
        }

        // 항목을 필터링한다.
        function filterItems () {
            var key = $(this).val(), // 체크 된 라디오 버튼의 value

                // 추가 된 Masonry 아이템
                masonryItems = $container.masonry('getItemElements');

            // Masonry 항목을 삭제
            $container.masonry('remove', masonryItems);

            // 필터링 된 항목의 데이터를 재설정과
            // 추가 된 항목 수를 재설정
            filteredData = [];
            addedd = 0;

            if (key === 'all') {
                // all이 클릭 된 경우 모든 JSON 데이터를 저장
                filteredData = allData;
            } else {
                // all 이외의 경우, 키와 일치하는 데이터를 추출
                filteredData = $.grep(allData, function (item) {
					var keys = Object.keys(item.category);
					var result=0;
					for (var i=0;i<keys.length ;i++ )
					{
						if(keys[i]===key){result++;}
					}	
					//console.log(result);
                    return result>0;
                });
            }

            // 항목을 추가
            addItems(true);
        }

		// 호버 효과
        function hoverDirection (event) {
            var $overlay = $(this).find('.caption'),
                side = getMouseDirection(event),
                animateTo,
                positionIn = {
                    top:  '0%',
                    left: '0%'
                },
                positionOut = (function () {
                    switch (side) {
                        // case 0: top, case 1: right, case 2: bottom, default: left
                        case 0:  return { top: '-100%', left:    '0%' }; break; // top
                        case 1:  return { top:    '0%', left:  '100%' }; break; // right
                        case 2:  return { top:  '100%', left:    '0%' }; break; // bottom
                        default: return { top:    '0%', left: '-100%' }; break; // left
                    }
                })();
            if (event.type === 'mouseenter') {
                animateTo = positionIn;
                $overlay.css(positionOut);
            } else {
                animateTo = positionOut;
            }
            $overlay.stop(true).animate(animateTo, 250, 'easeOutExpo');
        }

        // 마우스의 방향을 감지하는 함수
        // http://stackoverflow.com/a/3647634
        function getMouseDirection (event) {
            var $el = $(event.currentTarget),
                offset = $el.offset(),
                w = $el.outerWidth(),
                h = $el.outerHeight(),
                x = (event.pageX - offset.left - w / 2) * ((w > h)? h / w: 1),
                y = (event.pageY - offset.top - h / 2) * ((h > w)? w / h: 1),
                direction = Math.round((Math.atan2(y, x) * (180 / Math.PI) + 180) / 90  + 3) % 4;
            return direction;
        }
    });



function set_ui(){
	var UserAgent = navigator.userAgent;
	var UserFlag	=	true;
	if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null)
	{
		//mobile!!
		UserFlag = false;
	}
	return UserFlag
};//end set_ui

function mainInit(){

	var Actions,Event,total;
	var cur				=	0;						
	var ncur			=	0;						
	var nTarget			=	$('#main_nav');
	var cTarget			=	$('section.main_con');
	var hTarget			=	$('#header');
	var item			=	[];
	var l_data	=	[];


	Init = {
		_start:function(){
			$('#typeit_text').typeIt({
									cursor:false,
									startDelay:0
								});	
			TweenMax.from(".arrow img", 0.5, { y: 10,
								yoyo: !0,
								repeat: -1,
								ease: Power3.easeOut});
			$('#main_nav ul').css('margin-top',($('#main_nav ul').height()/2)*-1);
			/*************
			/	variable Add
			*************/
			total	=	cTarget.find('#content > section').length;
			
			/*************
			/	Event Add
			*************/
			nTarget.find('ul > li').on('click',function(event){
				event.preventDefault();
				var _y	=	cTarget.find('#content > section:eq('+($(this).index())+')').position().top;
				Actions._pageMove(_y);
			});
			nTarget.find('ul').mouseleave(function(){
				Event._navHandler(ncur);
			});		
			hTarget.find('ul > li').on('click',function(event){
				event.preventDefault();
				var curIdx;				
				if($(this).index()==0){
					curIdx=0;
				}else if($(this).index()==1){
					curIdx=1;
				}else if($(this).index()==2){
					curIdx=2;
				}else if($(this).index()==3){
					curIdx=3;
				}else if($(this).index()==4){
					curIdx=4;
				}else if($(this).index()==5){
					curIdx=5;
				}
				var _y	=	cTarget.find('#content > section:eq('+curIdx+')').position().top;				
				Actions._pageMove(_y);
			});

			/*************
			/	Item Add
			*************/
			var _i = 0;
			cTarget.find('#content > section').each(function($index){
				var _t	=	$(this);				
				item[$index] = {
					_data:_i,
					_target:_t,
					_moveFlag:true,
					_play:function(_posY){
						var target	=	this._target;
						var f_t	=	target.position().top;
						var f_b	=	f_t+600;
						var p_y	=	_posY - f_t;
						var d_y;
						var target_w = target.width();
						var target_h = target.height();
						
						if(this._data == 0){
							if(item[cur]._moveFlag){		
								/*
								$('#typeit_text').typeIt({
									cursor:false,
									startDelay:100
								});	
								*/
							};							
						}else if(this._data == 1){
							/*
							if(item[cur]._moveFlag){
								target.find('.img_group p').each(function(){
									TweenMax.to($(this),2,{y:0,delay:0.5,ease:Back.easeOut});

								});
							};
							*/
						}else if(this._data == 2){
							/*
							if(item[cur]._moveFlag){
								target.find('.img_group p').each(function(){
									if($(this).index() == 0){
									
										TweenMax.to($(this),1.8,{y:0,delay:0.3,ease:Quad.easeOut,onComplete:function(){
											TweenMax.to(this.target,1.8,{alpha:0,delay:1,ease:Quad.easeOut});
										}});
									}else{
										TweenMax.to($(this),1.6,{y:0,delay:1,ease:Quad.easeOut});
									}
								});
							};
							*/
						}else if(this._data == 3){
							/*
							if(item[cur]._moveFlag){
								target.find('.img_group p').each(function(){									
									if($(this).index() == 1){
										TweenMax.to($(this),2,{y:target_h/5.2,delay:2.3,ease:Quad.easeBack,onComplete:function(){
											if(SW < 460){
												TweenMax.to(this.target,2,{y:target_h/2.45,delay:0.5,ease:Quad.easeOut});
											}else{
												TweenMax.to(this.target,2,{y:target_h/2,delay:0.5,ease:Quad.easeOut});
											}
											
										}});
									}									
								});
								TweenMax.to(target.find('.img_group'),2,{y:0,delay:0.3,ease:Quad.easeOut});								
									
							};
							*/
						}else if(this._data == 4){
							
							if(item[cur]._moveFlag){
								activateScene2();
								/*
								target.find('.img_group p').each(function(){	
									var _dt_01;
									var _dt_02;
									if(SW < 460){
										_dt_01 = 7.5;
										_dt_02 = 4;
									}else if(SW < 360){

									}else if(SW <= 320){

									}else{
										_dt_01 = 4.7;
										_dt_02 = 2.2;
									}

									if($(this).index()==0){
										TweenMax.to($(this),1.9,{y:0,delay:0.6,ease:Quad.easeOut});
									}else if($(this).index() == 1){
										TweenMax.to($(this),1.9,{y:$(this).position().top/_dt_01*-1,delay:0.6,ease:Quad.easeOut});
									}else{
										TweenMax.to($(this),1.9,{y:$(this).position().top/_dt_02*-1,delay:0.6,ease:Quad.easeOut});
									}

								});
								*/
							};
							
						}else if(this._data == 5){
							/*
							if(item[cur]._moveFlag){
								target.find('.img_group .case_obj').each(function(){
									if($(this).index() == 0){
										TweenMax.to($(this),2,{y:0,delay:0.5,ease:Quad.easeOut});
										TweenMax.to($(this).find('.loopEffect'),2,{alpha:1,delay:2.5});
									}else{
										TweenMax.to($(this),2,{y:0,delay:0.8,ease:Quad.easeOut});
										TweenMax.to($(this).find('.line01'),2,{y:0,delay:2.8});
										TweenMax.to($(this).find('.line02'),2,{alpha:1,delay:4.8});
									}
									

								});
							};
							*/
						}else if(this._data == 6){
							/*
							if(item[cur]._moveFlag){
								target.find('.img_group p').each(function(){
									TweenMax.to($(this),2,{y:0,delay:0.5,ease:Quad.easeOut});

								});
							};
							*/
						}
						
						this._moveFlag = false;
					},
					_reset:function(){
						var target	=	this._target;
						var target_w = target.width();
						var target_h = target.height();
						this._moveFlag = true
							TweenMax.killAll();

						/*
						if(this._data == 0){
						}else if(this._data == 1){
							target.find('.img_group p').each(function(){
								TweenMax.set($(this),{y:target_h*-1});
							});
						}else if(this._data == 2){
							target.find('.img_group p').each(function(){
								TweenMax.set($(this),{y:target_h,alpha:1});
							});
						}else if(this._data == 3){

							target.find('.img_group p').each(function(){
								if($(this).index() == 1){
									if(SW < 460){
										TweenMax.set($(this),{y:target_h/2.45});
									}else{
										TweenMax.set($(this),{y:target_h/2});
									}
								}
									
							});
							TweenMax.set(target.find('.img_group'),{y:target_h});
						}else if(this._data == 4){
							target.find('.img_group p').each(function(){
								TweenMax.set($(this),{y:0});								
							});
						}else if(this._data == 5){
							target.find('.img_group .case_obj').each(function(){	
								if($(this).index() == 0){
									TweenMax.set($(this),{y:target_h*-1});
									TweenMax.set($(this).find('.loopEffect'),{alpha:0});
								}else{
									TweenMax.set($(this),{y:$(this).height()*1.5});
									TweenMax.set($(this).find('.line01'),{y:$(this).find('.line01').height()});
									TweenMax.set($(this).find('.line02'),{alpha:0});
								}
							});
						}else if(this._data == 6){
							target.find('.img_group p').each(function(){
								TweenMax.set($(this),{y:target_h});
							});
						}else if(this._data == 7){
							
						}else if(this._data == 8){
							target.find('.txt_group p').each(function(){
								TweenMax.set($(this),{alpha:0});
							});

							target.find('.img_group p').each(function(){
								var _setx = target.find('.img_group').width();
								if($(this).index() == 0){
								TweenMax.set($(this),{css:{'left':_setx/2-$(this).width()}});
								}else{
								TweenMax.set($(this),{css:{'right':_setx/2-$(this).width()}});
								}
							});
						}else if(this._data == 9){
														TweenMax.set([target.find('p.case_default'),target.find('div.big_thumb')],{y:target_h});
							
						}else if(this._data == 10){
							target.find('.img_group p').each(function(){
								var _setx = target.find('.img_group').width();
								if($(this).index() == 0){
								TweenMax.set($(this),{x:_setx*-1});
								}else{
								TweenMax.set($(this),{x:_setx});
								}
							});

						}else if(this._data == 11){
							target.find('.img_group p').each(function(){
								TweenMax.set($(this),{alpha:0,x:-50});
							});
						}else if(this._data == 12){
							
						}
						*/
					}
				}
				item[$index]._reset();
				_i++
			});
			
			item[cur]._play(npos);						
		}
	}//init End

	Actions = {
		_pageMove:function(targetY){
			$('html,body').stop().animate({scrollTop:targetY},1200)
		},
		_pageHandler:function(_posY){
			item[cur]._play(_posY);
			if(_posY == 0){
				$('section.main_con').find('#content > section').each(function($index){
					item[$index]._reset();
				});
				item[cur]._play(_posY);
			}							
		},
		_pageResize:function(){
			$('section.main_con').find('#content > section').each(function($index){
				item[$index]._reset();
			});
		}
	}//Actions End

	Event = {
		_navHandler:function(_n){
			var _t		=	nTarget.find('ul > li:eq('+(_n)+')');
			var _top		=	hTarget.find('ul > li:eq('+(_n)+')');
			_t.addClass('actived').siblings().removeClass('actived');
			_top.addClass('actived').siblings().removeClass('actived');
		},
		_activeHandler:function(index){
			var _mb = SH/2

			cTarget.find('#content > section').each(function(){		
				if($(this).index() != total-1){
					if(index >= $(this).position().top-_mb && index <= $(this).next().position().top-_mb){
						cur = $(this).index();
					}
					if(index >= $(this).position().top && index <= $(this).next().position().top){
						ncur = $(this).index();
					}
				}else{
					if(index >= $(this).position().top-_mb){
						cur = $(this).index();
					}
					if(index >= $(this).position().top){
						ncur = $(this).index();
					}
				}				
			});
			Event._navHandler(ncur);			
		}
	}//Event End

	$(window).scroll(function() {	
		npos = $(window).scrollTop();
		SW	=	$(window).width();
		SH	=	$(window).height();
		Event._activeHandler(npos);
		Actions._pageHandler(npos);
		headerAlign();		
	});//end scroll

	$(window).resize(function(){
		SW	=	$(window).width();
		SH	=	$(window).height();
		$('#main_nav ul').css('margin-top',($('#main_nav ul').height()/2)*-1);
		Actions._pageResize();
		headerAlign();
	});//end resize
	Init._start();
	Event._activeHandler(npos);
	Actions._pageHandler(npos);
	headerAlign();
	

	
	// next btn
	/*
	$('p.btn_next a').click(function(){		
		var _y	=	cTarget.find('#content >eq('+($(this).parents('section').index()+1)+')').position().top;
		Actions._pageMove(_y);
	});
	
	if(!m_flag)hTarget.addClass('fix');
	list_target = getParameter("num")
	
	if(list_target != ""){
		var _n = Number(list_target)
		var _y	=	cTarget.find('#content > section:eq('+_n+')').offset().top;
		Actions._pageMove(_y);;
	}
	*/

	//percent function
	/*
	function getPer(_Amin,_Amax,_Bmin,_Bmax,_index){
		var value = (_index/(_Bmax-_Bmin))*(_Amax-_Amin)+_Amin
		return value
	}
	*/

	function headerAlign(){
		if(m_flag){
			var _cx = cTarget.find('#content > section:eq(0)').height();
			
			if(npos >= _cx - hTarget.height()){
				hTarget.removeClass('default').addClass('fix');
				hTarget.css({'top':0});
			}else{
				hTarget.removeClass('fix').addClass('default');
				hTarget.css({'top':_cx - hTarget.height()});
			}
		}
	}
}//aboutInit End

})