var selection = null;
$(function() {
	// 设置html中图片控件不可拖动
	$(document.images).each(function() {
		$(this)[0].ondragstart = prevent_drag;
	});

	var target = '.image-content';

	selection = new Selection(target);
	selection.init();

	add_btn_style();

	init_event();// 初始化事件

	make_element_data_panel_draggable();// 元素数据面板可拖动
});

function make_element_data_panel_draggable() {
	var dragui = '.panel-heading';
	var target = '.control-content';
	$(dragui).mouseover(function() {
		$(this).css({
			cursor : 'move'
		});
	});
	$(dragui).mouseout(function() {
		$(this).css({
			cursor : 'default'
		});
	});
	
	$(dragui).mousedown(function(e) {
		prevent_event(e);
		$(this).css({
			cursor : 'move'
		});
		
		var draggable = true;
		var startX = e.pageX;
		var startY = e.pageY;
		$(document).mousemove(function(e) {
			prevent_event(e);
			if(draggable) {//可以进行拖动操作
				var currentX = e.pageX;
				var currentY = e.pageY;

				var distanceX = currentX - startX;
				var distanceY = currentY - startY;

				console.info(distanceX);
				
				var left = $(target)[0].offsetLeft;
				var top = $(target)[0].offsetTop;

				$(target).css({
					left : (left + distanceX) + 'px',
					top : (top + distanceY) + 'px'
				});

				startX = currentX;
				startY = currentY;
			}
		});

		$(document).mouseup(function() {
			prevent_event(e);

			draggable = false;

			$(this).css({
				cursor : 'move'
			});
			$(document).unbind('mousemove');
			$(document).unbind('mouseup');
		});

	});
}

// 初始化页面控件事件
function init_event() {
	// 点击添加小题按钮触发事件
	$('.add-btn').click(function() {
		var element = selection.currentElement;
		element.show_data(true);
	});
	
	//面板关闭按钮
	$('.panel-heading .close-btn').click(function() {
		$('.control-content').css({
			display : 'none'
		});
	});
	
}

// 添加小题定义
function add_sub_question(index) {
	var panel = new SubQuestionPanel(index);
	$('.sub-question-container').append($(panel.view));
	return panel;
}

// 添加按钮样式
function add_btn_style() {
	// 添加右侧小题定义样式
	var addbtn_defaulticon = getRootPath() + 'resources/images/add_default.png';
	var addbtn_focusicon = getRootPath() + 'resources/images/add_focus.png';
	btn_mouse_style($('.add-btn'), addbtn_defaulticon, addbtn_focusicon);
}

// 添加按钮获得和失去焦点样式
function btn_mouse_style(btn, defaulticon, focusicon) {
	$(btn).mouseover(function() {
		$(this).css({
			backgroundImage : 'url(' + focusicon + ')',
			cursor : 'pointer'
		});
	});
	$(btn).mouseout(function() {
		$(this).css({
			backgroundImage : 'url(' + defaulticon + ')',
			cursor : 'default'
		});
	});
}

// 阻止事件冒泡
function prevent_event(event) {
	if (event.stopPropagation) {
		event.stopPropagation();
	} else {
		event.cancelBubble = true;
	}
}

/* 禁止点击图片拖动 */
function prevent_drag() {
	return false;
}