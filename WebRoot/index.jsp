<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<base href="<%=basePath%>" />
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- css link-->

<link type="text/css" rel="stylesheet"
	href="resources/plugins/css/bootstrap.min.css">
<link type="text/css" rel="stylesheet" href="resources/css/common.css">
<link type="text/css" rel="stylesheet" href="resources/css/resize.css">

<!-- css link end -->


<!--js script -->
<script type="text/javascript"
	src="resources/plugins/js/jquery-1.9.1.js"></script>
<script type="text/javascript"
	src="resources/plugins/js/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="resources/plugins/js/bootstrap.min.js"></script>

<script type="text/javascript" src="resources/js/common.js"></script>
<script type="text/javascript" src="resources/js/selection.js"></script>
<script type="text/javascript" src="resources/js/element.js"></script>
<script type="text/javascript" src="resources/js/resize.js"></script>
<script type="text/javascript" src="resources/js/sub_question_panel.js"></script>
<script type="text/javascript" src="resources/js/util.js"></script>

<!--js script end-->
<title></title>
</head>
<body>
	<div class="image-container">
		<!-- 再添加一层div防止绝对布局选框随滚动条拖动而拖动 -->
		<div class="image-content">
		<!-- 记录所选区域的宽高 -->
			<div class="size">
				<span id="width-tip" class="tip">30</span> <span class="tip">&nbsp;x&nbsp;</span>
				<span id="height-tip" class="tip">20</span>
			</div>
			<img src="resources/images/bg.jpg">
		</div>
	</div>
	
	<div class="control-content" style="display:none;">
			<div class="panel panel-info">
				<div class="panel-heading" style="position:relative;">
					<span>题目信息</span>
					<span class="span-btn close-btn"></span>
				</div>
				<div class="panel-body" style="width:100%;height:400px;overflow:auto;">
					<table class="table no-border">
						<tr>
							<td>题号</td>
							<td><input type="text" id="questionName" name="questionName"
								class="form-control"></td>
						</tr>
						<tr>
							<td>满分值</td>
							<td><input id="fullScore" type="text" name="fullScore"
								class="form-control"></td>
						</tr>
						<tr>
							<td>X坐标(px)</td>
							<td><span id="x" class="label label-success"></span></td>
						</tr>
						<tr>
							<td>Y坐标(px)</td>
							<td><span id="y" class="label label-success"></span></td>
						</tr>
						<tr>
							<td>宽度(px)</td>
							<td><span id="width" class="label label-info"></span></td>
						</tr>
						<tr>
							<td>高度(px)</td>
							<td><span id="height" class="label label-info"></span></td>
						</tr>
						<tr>
							<td>小题定义</td>
							<td><span class="span-btn add-btn"></span></td>
						</tr>
						<tr>
							<td colspan="2" class="sub-question-container"></td>
						</tr>
					</table>
				</div>
			</div>
		</div>

	<div style="display: none;">
		<div id="subQuestionPanel" class="panel panel-success subQuestionPanel">
			<div class="panel-heading">
				<span>小题信息</span> <span class="span-btn close-btn"></span>
			</div>
			<div class="panel-body">
				<div class="sub-question">
					<table class="table no-border">
						<tr>
							<td>小题号</td>
							<td><input type="text" name="subQuestionNum"
								class="form-control"></td>
						</tr>
						<tr>
							<td>分值</td>
							<td><input type="text" name="subQuestionScore" class="form-control"></td>
						</tr>
						<tr>
							<td>给分率</td>
							<td>
								<select name="subQuestionScoreRate" class="subQuestionScoreRate form-control">
									<option value="1">连续</option>
									<option value="0">不连续</option>
								</select> <br/>
								<!-- 间隔 -->
								<input name="subQuestionScoreRateInterval" type="text" class="form-control" value="" placeholder="输入分值间隔">
								<input name="subQuestionScoreRateVal" readonly="readonly" type="text" class="form-control" value="">
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</body>
</html>