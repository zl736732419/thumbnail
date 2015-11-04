//选区组件
function Selection(target) {
	var selection = this;
	selection.startX = 0;//记录当前鼠标点击的位置，便于计算所选区域的宽高
	selection.startY = 0;//记录当前鼠标点击的位置，便于计算所选区域的宽高
	selection.showSize = false;//是否显示提示框
	selection.currentElement = null;//当前操作的元素
	selection.previousElement = null///前一个被选中的元素， 用于保存数据
	
	selection.elements = [];//已经添加到内容中的元素
	
	//目标控件
	selection.target = target;
	//初始化控件事件
	selection.init = function() {
		//为图片内容div添加事件
		$(selection.target).mousedown(function(e) {
			selection.showSize = true;
			var position = selection.get_current_position(e);
			selection.startX = position.x;///相对于屏幕的位置
			selection.startY = position.y;
			
			//鼠标拖动元素时触发，这时就不再是新建元素，而是拖动元素
			if(selection.intersect(selection.startX, selection.startY)) {
				return;
			}
			
			//添加一个元素到内容中
			selection.add_element();
			
			//改变鼠标指针形状
			$(this).css({
				cursor : 'crosshair'
			});
			
			$(document).mousemove(function(e) {
				//通过showSize控制鼠标事件是否对页面影响，鼠标按下时开启鼠标事件、鼠标弹起时取消鼠标事件
				if(!selection.showSize) {
					return;
				}
				
				//设置要显示的当前选区宽高
				var position = selection.get_current_position(e);
				var currentX = position.x;///相对于屏幕的位置
				var currentY = position.y;
				
				//这里需要判断是否是拖动时点击触发
				var cursor = $(selection.target).css('cursor');
				//元素在创建过程中，完成元素创建之后才可以再设置元素大小
				if(selection.intersect(currentX, currentY) && cursor != 'crosshair') {
					return;
				}
				
				//初始化宽高提示框大小
				selection.init_size(currentX, currentY);
				
				//初始化刚创建的元素大小
				selection.init_element_size(currentX, currentY);
				
				selection.select_element(selection.currentElement);
			});
			
			//完成选区
			$(document).mouseup(function(e) {
				selection.showSize = false;
				//设置要显示的当前选区宽高
				var position = selection.get_current_position(e);
				var currentX = position.x;///相对于屏幕的位置，包括滚动条
				var currentY = position.y;
				
				// 如果用户直接点击鼠标没有拖动，在鼠标按下时就创建了该元素，但是该元素此时宽度为0，
				// 在鼠标移动过程中才对该元素宽高进行控制，所以，需要将该无效元素去掉
				if($(selection.currentElement.view).width() == 0) {
					selection.elements.remove(selection.currentElement);
					//恢复鼠标形状
					$(target).css({
						cursor : 'default'
					});
					return;
				}
				
				//这里需要判断是否恢复鼠标形状，如果是拖拽触发就不恢复
				var cursor = $(target).css('cursor');
				if(selection.intersect(currentX, currentY) && cursor != 'crosshair') {
					return;
				}
				//这里需要判断是否是拖动时点击触发
				if(cursor != 'move') {//新建元素
					//恢复鼠标形状
					$(target).css({
						cursor : 'default'
					});
					//为当前元素添加事件
					selection.currentElement.make_element_editable();
				}
				
				//显示当前设置的元素的数据
				selection.currentElement.show_data();
				
				
				//清理当前类的mousemove mouseup事件
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			});
		});
	};
	
	//判断当前操作是否是拖动
	selection.intersect = function(x, y) {
		var element = null;
		var left = 0;
		var top = 0;
		var width = 0;
		var height = 0;
		var intersect = false;//是否相交
		for(var i = 0; i < selection.elements.length; i++) {
			element = selection.elements[i];
			left = selection.getOffsetLeft(element.view);
			top = selection.getOffsetTop(element.view);
			width = $(element.view).width();
			height = $(element.view).height();
			if((x > left) 
					&& (x < left + width)
					&& (y > top)
					&& (y < top + height)) {
				intersect = true;
				break;
			}
		}
		
		return intersect;
	};
	
	//获取当前鼠标位置
	selection.get_current_position = function(e) {
		var x = e.clientX + selection.getScrollLeft($(selection.target));
		var y = e.clientY + selection.getScrollTop($(selection.target));

		var position = {
			x : x,
			y : y
		};
		return position;
	};
	
	//选中某一个元素，取消其他元素的选中效果(取消助托点)
	selection.select_element = function(element) {
		selection.show_resize_points(selection.currentElement);
		selection.show_msg(selection.currentElement);
	};
	
	//显示八个助托点，方便改变元素大小
	selection.show_resize_points = function(element) {
		//显示当前元素的助托点
		var points = $(element.view).find('.point');
		$(points).each(function() {
			$(this).css({
				display : 'inline-block'
			});
		});
		
		var els = $(element.view).siblings('.element');
		$(els).each(function() {
			var ps = $(this).find('.point');
			$(ps).each(function() {
				$(this).css({
					display : 'none'
				});
			});
		});
	}
	
	selection.show_msg = function(element) {
		var view = element.view;
		var x = view.offsetLeft;
		var y = view.offsetTop;
		var width = $(view).width();
		var height = $(view).height();
		
		element.questionData.x = x;
		element.questionData.y = y;
		element.questionData.width = width;
		element.questionData.height = height;
		
		$('#x').text(x);
		$('#y').text(y);
		$('#width').text(width);
		$('#height').text(height);
		
	};
	
	//添加一个元素到内容区中
	selection.add_element = function() {
		
		var element = new Element();
		
		$(selection.target).append($(element.view));
		
		selection.record_current_element(element);
		
		selection.elements.push(selection.currentElement);
		
		selection.select_element(element);
	}
	
	//记录当前正在处理的元素
	//同时保存上一个处理的元素，便于后面保存数据
	selection.record_current_element = function(element) {
		//如果选中的是同一个元素就不做处理，避免元素数据多余的增删操作
		if(selection.currentElement == element) {
			return;
		}
		selection.previousElement = selection.currentElement;
		selection.currentElement = element;
	};
	
	//显示提示框位置
	selection.show_size = function() {
		if(!selection.showSize) {
			return;
		}
		
		var x = selection.getOffsetLeft(selection.currentElement.view) - selection.getOffsetLeft(selection.target);
		var y = selection.getOffsetTop(selection.currentElement.view) - selection.getOffsetTop(selection.target)-20;//20为提示框高度
		var display = $('.size').css('display');
		if(display != 'block') {
			$('.size').css({
				display : 'block'
			});
		}
		
		$('.size').css({
			left : x,
			top : y
		});
	}
	
	//改变加入元素的大小
	selection.init_element_size = function(currentX, currentY) {
		//先计算得到width,height
		var width = Math.abs(currentX - selection.startX);
		var height = Math.abs(currentY - selection.startY);
		
		//最小宽高为1x1
		width = width == 0 ? 1 : width;
		height = height == 0 ? 1 : height;
		
		var left = 0;
		var top = 0;
		//如果当前鼠标移动是往左和上两个方向移动，这时需要改变提示框的位置
		if(currentX < selection.startX) {
			left = currentX;
		}else {
			left = selection.startX;
		}
		
		if(currentY < selection.startY) {
			top = currentY;
		}else {
			top = selection.startY;
		}
		
		selection.position_element(left, top, width, height);
		
	}
	
	//设置元素的位置和宽高
	selection.position_element = function(left, top, width, height) {
		//设置位置还需要考虑到父元素的位置
		if(!selection.showSize) {
			return;
		}
		
		var img = $(selection.target).find('img');
		
		var parentLeft = selection.getOffsetLeft(img);
		var parentTop = selection.getOffsetTop(img);
		var parentWidth = $(img)[0].scrollWidth;
		var parentHeight = $(img)[0].scrollHeight;
		
		//这里需要做一个容错处理，放置绘制剪切区域时超出图片区域
		//x轴容错
		if(left + width > parentLeft + parentWidth) {
			width = parentLeft + parentWidth - left;
		}
		if(left < parentLeft) {
			left = parentLeft;
			width = selection.startX - parentLeft;
		}
		
		//y轴容错
		if(top + height > parentTop + parentHeight) {
			height = parentTop + parentHeight - top;
		}
		if(top < parentTop) {
			top = parentTop;
			height = selection.startY - parentTop;
		}
		
		var x = left - parentLeft;
		var y = top - parentTop;
		
		$(selection.currentElement.view).css({
			left : x,
			top : y,
			width : width,
			height : height
		});
		
		//显示选区当前宽高
		selection.show_size();
		//显示宽高提示框
		selection.change_size_tip();
		
	}
	
	//改变宽高提示框的值
	selection.change_size_tip = function() {
		if(!selection.showSize) {
			return;
		}
		
		var width = $(selection.currentElement.view).width();
		var height = $(selection.currentElement.view).height();
		
		//调整提示框宽度而创建的一个尺子，用于测量文本宽度
		var ruler = null;
		ruler = $('.ruler');
		if(ruler.length == 0) {
			ruler = document.createElement('span');
			$(ruler).addClass('ruler');
			$('body').append(ruler);
			$(ruler).css({
				'font-size' : '8pt',
				display : 'none'
			});
		}else {
			ruler = $(ruler)[0];
		}
		
		ruler.innerHTML = width + ' x ' + height;
		var w = $(ruler).width() + 50;
		
		$('.size').css({
			width : w + 'px'
		});
		
		$('#width-tip').text(width);
		$('#height-tip').text(height);
	}
	
	//改变宽高提示框的大小
	selection.init_size = function(currentX, currentY) {
		//如果当前鼠标移动是往左和上两个方向移动，这时需要改变提示框的位置
		if(currentX < selection.startX && currentY >= selection.startY) {
			selection.show_size(currentX, selection.startY);
		}else if(currentY < selection.startY && currentX >= selection.startX) {
			selection.show_size(selection.startX, currentY);
		}else if(currentX < selection.startX && currentY < selection.startY) {
			selection.show_size(currentX, currentY);
		}
	};
	
	//获取元素离屏幕的scrollleft
	//这里已经对html元素scrollLeft进行了计算
	selection.getScrollLeft = function(target) {
		target = $(target)[0];
		var left = target.scrollLeft;
		var parent = $(target).parent()[0];
		while (parent != null && parent != undefined) {
			if (parent.scrollLeft == undefined) {
				break;
			}
			left += parent.scrollLeft;
			parent = $(parent).parent()[0];
		}
		
		return left;
	};
	
	//获取元素离屏幕的垂直位置
	//这里已经对html元素scrollTop进行了计算
	selection.getScrollTop = function(target) {
		target = $(target)[0];
		var top = target.scrollTop;
		var parent = $(target).parent()[0];
		while (parent != null && parent != undefined) {
			if (parent.scrollTop == undefined) {
				break;
			}
			top += parent.scrollTop;
			parent = $(parent).parent()[0];
		}
		return top;
	};
	
	//获取元素离屏幕的水平位置
	selection.getOffsetLeft = function(target) {
		target = $(target)[0];
		var left = target.offsetLeft;
		var parent = $(target).parent()[0];
		while (parent != null && parent != undefined) {
			if (parent.offsetLeft == undefined) {
				break;
			}
			left += parent.offsetLeft;
			parent = $(parent).parent()[0];
		}
		
		return left;
	};
	
	//获取元素离屏幕的垂直位置
	selection.getOffsetTop = function(target) {
		target = $(target)[0];
		var top = target.offsetTop;
		var parent = $(target).parent()[0];
		while (parent != null && parent != undefined) {
			if (parent.offsetTop == undefined) {
				break;
			}
			top += parent.offsetTop;
			parent = $(parent).parent()[0];
		}
		
		return top;
	};
	
}