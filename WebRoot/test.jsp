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
<script type="text/javascript" src="resources/js/util.js"></script>
	

<!--js script end-->
<title></title>
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-md-10">
				<form class="form-horizontal">
					<div class="form-group">
						<label for="inputEmail3" class="col-sm-2 control-label">Email</label>
						<div class="col-sm-10">
							<input type="email" class="form-control" id="inputEmail3"
								placeholder="Email">
						</div>
					</div>
					<div class="form-group">
						<label for="inputPassword3" class="col-sm-2 control-label">Password</label>
						<div class="col-sm-10">
							<input type="password" class="form-control" id="inputPassword3"
								placeholder="Password">
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<div class="checkbox">
								<label> <input type="checkbox"> Remember me
								</label>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button type="submit" class="btn btn-default">Sign in</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</body>
</html>