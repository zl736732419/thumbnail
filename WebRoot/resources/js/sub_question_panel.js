/*小题面板*/
//如果是遍历小题集合，需要传递index
//如果是按钮点击添加，则不需要传递index,index=小题集合长度
function SubQuestionPanel(index) {
	var panel = this;
	panel.view = create_sub_question_panel(index);
	
	//添加panel事件
	panel.init_event = function() {
		//添加关闭按钮样式
		var closeBtn = $(panel.view).find('.close-btn');
		closeBtn[0].panel = panel;//缓存面板对象，便于获取
		var closebtn_defaulticon = getRootPath() + 'resources/images/close_default.png';
		var closebtn_focusicon = getRootPath() + 'resources/images/close_focus.png';
		btn_mouse_style($(closeBtn), closebtn_defaulticon, closebtn_focusicon);
		//添加关闭按钮点击事件
		$(closeBtn).click(function() {
			//得到面板
			var panelview = $(this)[0].panel.view;
			$(panelview).remove();
		});
		
		//添加分值onchange事件
		$(panel.view).find('input[name=subQuestionScore]').change(function() {
			init_sub_question_values($(panel.view));
		});
		
		//添加给分率onchange事件
		$(panel.view).find('select.subQuestionScoreRate').change(function() {
			init_sub_question_values($(panel.view));
		});
		
		$(panel.view).find('input[name=subQuestionScoreRateInterval]').change(function() {
			init_sub_question_values($(panel.view));
		});
	};
	
	//创建后初始化事件
	panel.init_event();
}

//赋值小题数据
function init_sub_question_values(panelview) {
	//得到用户输入的分值
	var scoreInput = $(panelview).find('input[name=subQuestionScore]');
	//得到要设置的分序列
	var scoreRateInput = $(panelview).find('input[name=subQuestionScoreRateVal]');
	//分值间隔
	var scoreIntervalInput = $(panelview).find('input[name=subQuestionScoreRateInterval]');
	var scoreRate = $(panelview).find('select.subQuestionScoreRate').val();
	//判断当前选中的是连续还是不连续
	if(!scoreRate) {//不连续
		$(scoreRateInput).removeAttr('readonly');
		$(scoreRateIntervalInput).css({display:'none'});
		$(scoreRateInput).val('');
	}else {
		$(scoreRateInput).attr({
			readonly : 'readonly'
		});
		$(scoreIntervalInput).css({display:'inline'});
		var score = $(scoreInput).val();
		var scoreInterval = $(scoreIntervalInput).val();
		var val = get_score_rate_val(Number(score), Number(scoreInterval));
		$(scoreRateInput).val(val);
	}
}

//根据rate值拼接字符串
function get_score_rate_val(score, interval) {
	var val = '';
	if(score != '' && !isNaN(score)) {
		var num = 0;
		while(num <= score) {
			val += num;
			if(num < score) {
				val += ',';
			}else if (num == score) {
				break;
			}
			
			num += interval;
		}
		
		if(num > score) {
			val += score;
		}
	}
	
	return val;
}

//面板内容布局
function create_sub_question_panel(index) {
	if(index == undefined) {
		index = selection.currentElement.questionData.subQuestionDatas.length;
	}
	var panel = $('#subQuestionPanel').clone();
	
	$(panel).attr('id', 'subpanel' + index);
	return panel;
}