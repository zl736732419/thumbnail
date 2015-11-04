function Element() {
	var element = this;

	element.view = create_element_view();
	element.questionData = create_question_data();
	
	// 为元素添加事件
	element.make_element_editable = function() {
		element.make_draggable();
		element.make_resizable();
	};

	// 让元素可以拖动
	element.make_draggable = function() {
		// 可拖拽
		$(element.view).draggable(true);

		element.change_drag_style();
		
		$(element.view).draggable({
			onStartDrag : function(e) {
				if($(element.view).width() >= 1) {
					//改变当前处理元素值
					selection.record_current_element(element);
					//选中当前元素，其余元素都取消选中,隐藏助托点
					selection.select_element(element);
					
					element.show_data();
				}
			},
			onDrag : function(e) {
				element.element_drag_restrain(e);
				//显示选区当前宽高tip
				selection.show_size();
				//改变宽高tip中的值
				selection.change_size_tip();
				//显示位置信息
				selection.show_msg(selection.currentElement);
			}
		});
	};
	
	//设置拖动时鼠标样式
	element.change_drag_style = function() {
		// 设置当前指针为拖拽样式
		$(element.view).mouseover(function(e) {
			$(element.view).css({
				cursor : 'move'
			});
		});
		
		$(element.view).mouseout(function(e) {
			$(element.view).css({
				cursor : 'default'
			});
		});
		
		$(element.view).mousedown(function(e) {
			$(element.view).css({
				cursor : 'move'
			});
			
			$(document).mousemove(function(e) {
				$(element.view).css({
					cursor : 'move'
				});
			});
			
			$(document).mouseup(function(e) {
				$(element.view).css({
					cursor : 'move'
				});
				
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			});
		});
	};
	
	//拖动过程中限制元素的位置
	element.element_drag_restrain = function(e) {
		var d = e.data;
		if (d.left < 0) {
			d.left = 0;
		}
		if (d.top < 0) {
			d.top = 0;
		}
		var img = $(selection.target).find('img');
		if (d.left + $(d.target).outerWidth() > $(img)[0].scrollWidth) {
			d.left = $(img)[0].scrollWidth - $(d.target).outerWidth();
		}
		if (d.top + $(d.target).outerHeight() > $(img)[0].scrollHeight) {
			d.top = $(img)[0].scrollHeight - $(d.target).outerHeight();
		}
	};

	// 让元素可以拖动
	element.make_resizable = function() {
		// 可改变大小
		var points = $(element.view).find('.point');
		if(points.length != 0) {
			//显示这八个助托点
			$(points).each(function() {
				$(this).css({
					display : 'inline-block'
				});
			});
			
			return;
		}
		
		//创建八个点并加入到当前要操作的元素中
		var leftUp = document.createElement('div');
		$(leftUp).addClass('point leftUp');
		
		var up = document.createElement('div');
		$(up).addClass('point up');
		
		var rightUp = document.createElement('div');
		$(rightUp).addClass('point rightUp');
		
		var left = document.createElement('div');
		$(left).addClass('point left');
		
		var right = document.createElement('div');
		$(right).addClass('point right');
		
		var leftDown = document.createElement('div');
		$(leftDown).addClass('point leftDown');
		
		var down = document.createElement('div');
		$(down).addClass('point down');
		
		var rightDown = document.createElement('div');
		$(rightDown).addClass('point rightDown');
		
		$(element.view).append($(up))
			.append($(left))
			.append($(right))
			.append($(down))
			.append($(rightUp))
			.append($(leftDown))
			.append($(leftUp))
			.append($(rightDown));
		
		var resize = new Resize(element)
			.left(left)
			.right(right)
			.up(up)
			.down(down)
			.leftUp(leftUp)
			.rightUp(rightUp)
			.leftDown(leftDown)
			.rightDown(rightDown);
		
		//设置中间的4个助托点居中
		resize.position_middle_point();
	};
	
	//显示当前选中元素的数据值
	//这里涉及到将前一个选中元素的数据保存到其数据域中
	element.show_data = function(isForce) {
		//判断之前是否处理过元素，如果处理了，就需要把设置的数据保存到元素中
		element.save_preview_element_data(isForce);
		element.show_with_element_data();
	};
	
	//保存设置的数据到元素数据域中
	//只有点击添加按钮时是强制将数据保存到当前选中元素下
	//其他情况都是将数据保存到上一个选中元素中
	element.save_preview_element_data = function(isForce) {
		var el = null;
		if(isForce) {
			el = selection.currentElement;
		}else {
			if(selection.previousElement == null) {
				return;
			}
			el = selection.previousElement;
		}
		
		//获取设置的数据信息，填入到element数据域中
		var questionPanel = $('.control-content');
		
		var questionName = $(questionPanel).find('#questionName').val();
		var fullScore = $(questionPanel).find('#fullScore').val();
		
		el.questionData.questionName = questionName;
		el.questionData.fullScore = fullScore;
		
		//获取小题信息
		var subQuestionPanels = $(questionPanel).find('.subQuestionPanel');
		
		//如果是添加按钮并且是初次添加一个小题，上面获取小题信息为空,所以需要手动创建一个小题对象
		if(isForce && subQuestionPanels.length == 0) {
			var subQuestionData = create_sub_question_data();
			el.questionData.subQuestionDatas.push(subQuestionData);
			return;
		}
		
		el.questionData.subQuestionDatas.length = 0;
		//重新填入小题信息
		var subQuestionPanel = null;
		for(var i = 0; i < subQuestionPanels.length; i++) {
			//如果是删除操作会存在空对象，需要排除
			subQuestionPanel = subQuestionPanels[i];
			var subQuestionName = $(subQuestionPanel).find('input[name=subQuestionNum]').val();
			var subQuestionScore = $(subQuestionPanel).find('input[name=subQuestionScore]').val();
			var subQuestionScoreRate = $(subQuestionPanel).find('select').val();
			var subQuestionScoreInterval = $(subQuestionPanel).find('input[name=subQuestionScoreInterval]').val();
			var subQuestionScoreRateVal = $(subQuestionPanel).find('input[name=subQuestionScoreRateVal]').val();
			
			var subQuestionData = create_sub_question_data(subQuestionName, subQuestionScore, 
					subQuestionScoreRate, subQuestionScoreInterval, subQuestionScoreRateVal);
			el.questionData.subQuestionDatas.push(subQuestionData);
		}
		
		//如果是按钮添加，则还需要创建一个新的数据对象
		if(isForce) {
			var subQuestionData = create_sub_question_data();
			el.questionData.subQuestionDatas.push(subQuestionData);
		}
	};
	
	//根据当前选择的元素在右侧显示其数据信息
	element.show_with_element_data = function() {
		//1显示右侧数据表单
		var display = $('.control-content').css('display');
		
		//获取当前元素的相对位置
		var x = selection.currentElement.view.offsetLeft;
		var width = $(selection.currentElement.view).width();
		var y = selection.currentElement.view.offsetTop;
		
		if(display == 'none') {
			$('.control-content').css({
				display:'block',
				left : (x+width) + 'px',
				top : y + 'px'
			});
		}
		
		//2清空小题信息，重新加载
		$('.sub-question-container').empty();
		
		//3根据当前元素值初始化数据控件
		$('#questionName').val(element.questionData.questionName);
		$('#fullScore').val(element.questionData.fullScore);
		var panel = null;
		var subQuestionDatas = element.questionData.subQuestionDatas;
		var subQuestionData = null;
		for(var i = 0; i <subQuestionDatas.length; i++) {
			panel = add_sub_question(i);
			subQuestionData = subQuestionDatas[i];
			//赋值
			$(panel.view).find('input[name=subQuestionNum]').val(subQuestionData.subQuestionNum);
			$(panel.view).find('input[name=subQuestionScore]').val(subQuestionData.subQuestionScore);
			$(panel.view).find('select').val(subQuestionData.subQuestionScoreRate);
			$(panel.view).find('input[name=subQuestionScoreRateInterval]').val(subQuestionData.subQuestionScoreInterval);
			$(panel.view).find('input[name=subQuestionScoreRateVal]').val(subQuestionData.subQuestionScoreRateVal);
		}
	};
}

// 创建元素内容布局
function create_element_view() {
	var div = document.createElement('div');
	$(div).addClass('element');

	$(div)[0].ondragstart = prevent_drag;

	return div;
}

//创建选中元素的题目数据
function create_question_data() {
	var data = {};
	
	data.questionName = '1';//题号
	data.fullScore = 10;//满分值
	
	data.x = 0; //相对图片的x轴坐标
	data.y = 0; //相对图片的y轴坐标
	data.width = 0; //所选区域的宽度
	data.height = 0; //所选区域的高度
	
	data.subQuestionDatas = [];//小题定义
	return data;
}

//创建选中元素的小题数据

//@param subQuestionNum 小题号
//@param subQuestionScore 分值
//@param subQuestionScoreRate 给分率 1:连续 0:不连续
//@param subQuestionScoreInterval 分值间隔
//@param subQuestionScoreRateVal 给分率所计算的值
function create_sub_question_data(subQuestionNum, subQuestionScore, subQuestionScoreRate, subQuestionScoreInterval, subQuestionScoreRateVal) {
	var data = {};
	data.subQuestionNum = subQuestionNum == undefined ? '' : subQuestionNum;//小题号
	data.subQuestionScore = subQuestionScore == undefined ? 10 : subQuestionScore;//小题分值
	data.subQuestionScoreRate = subQuestionScoreRate == undefined ? 1 : subQuestionScoreRate;//默认为连续
	data.subQuestionScoreInterval = subQuestionScoreInterval == undefined ? 1 : subQuestionScoreInterval;//默认从1开始
	data.subQuestionScoreRateVal = subQuestionScoreRateVal == undefined ? '0,1,2,3,4,5,6,7,8,9,10' : subQuestionScoreRateVal;//给分率 所对应的分率取值
	return data;
}