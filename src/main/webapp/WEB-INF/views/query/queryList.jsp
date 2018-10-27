<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/WEB-INF/views/include/taglib.jsp"%>
<%
    String path = request.getContextPath();
    // 获得本项目的地址(例如: http://localhost:8080/MyApp/)赋值给basePath变量 
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()+path+"/";
    // 将 "项目路径basePath" 放入pageContext中，待以后用EL表达式读出。 
    pageContext.setAttribute("basePath", basePath);
%>
<!--去除缓存  -->
<%  
response.setHeader("Pragma","No-cache");  
response.setHeader("Cache-Control","no-cache");  
response.setDateHeader("Expires", 0);  
%>  
<head>
	<title>报警管理</title>
	<meta name="decorator" content="default"/>
</head>
<link href="${ctxStatic}/bootstrap-3.3.7-dist/css/bootstrap.min.css" type="text/css" rel="stylesheet" />
<link href="${ctxStatic}/bootstrap-3.3.7-dist/css/query.css?temp=<%=Math.random()%>" type="text/css" rel="stylesheet" />
<script src="${ctxStatic}/jquery/jquery-1.9.1.js" type="text/javascript"></script>
<script src="${ctxStatic}/bootstrap-3.3.7-dist/js/bootstrap.min.js" type="text/javascript"></script>
<script src="${ctxStatic}/bootstrap-3.3.7-dist/js/bootstrap-paginator.js" type="text/javascript"></script>
<script src="${ctxStatic}/bootstrap-3.3.7-dist/js/query.js?temp=<%=Math.random()%>" type="text/javascript"></script>
<style>
/*修改背景  */
body{
    /*  background-color:blue; */
	background-image: url('${ctxStatic}/bootstrap-3.3.7-dist/css/bg.png');
	background-repeat:repeat-y;
	background-size: 100%;
}
/*视图类型，网站视图，主机视图，日志信息（可以根据屏幕高度单独设置四个容器的高度）  */
#viewTypeId,#webSiteId,
#hostSiteId,#logInfoId{
	float:left;
	width:100%
}
/*表格-表头颜色  */
th{
	background: #1b61c2
}
/*表格间隔换色--奇数列  */
.table-striped>tbody>tr:nth-of-type(odd) {
    background-color: #377cda !important;
} 
/*表格间隔换色--偶数列  */
.table-striped>tbody>tr:nth-of-type(even) {
    background-color: #7aa2df !important;
} 
/*修改字体-start*/
/*表格-字体*/
th ,td{
  color: white;
  text-align: center;
  font-size: 18px;
}
/*日志下拉菜单和视图类型字体*/
.titleDiv{
	color: white;
	text-align: left;
	font-size:18px;
	height:4%;
}
/*每个模块的标题字体*/
legend{
	padding:.5em;
	border:0;
	width:auto;
	margin-bottom:10px;
	color: white;
	text-align: left;
	font-size: 24px
}
/*修改字体-end*/
</style>
<script type="text/javascript">
/*同步日志起始页，刷新时记录当前页码  */
var list1Page=1;
/*篡改日志起始页，刷新时记录当前页码  */
var list2Page=1;
/*篡改日志，同步日志起始分页  */
var pageSize=1;
/*篡改日志，同步日志刷新频率 */
var reflshTime=${reflash_date};
/*定时刷新对象  */
var time;
/*视图类型 1图形 2列表  ，默认图形 */
var queryType='1';
/* 请求时根路径 */
var basePath="${basePath}";
/*网站视图中 被篡改未处理   图片  */
var webSiteRed="${ctxStatic}/bootstrap-3.3.7-dist/css/alertRed.png";
/*网站视图中 被篡改已处理   图片  */
var webSiteGreen="${ctxStatic}/bootstrap-3.3.7-dist/css/alertGreen.png";
/*主机视图中 ip+端口不通   图片  */
var hostSiteRed="${ctxStatic}/bootstrap-3.3.7-dist/css/red.png";
/*主机视图中 ip+端口连通   图片  */
var hostSiteblue="${ctxStatic}/bootstrap-3.3.7-dist/css/blue.png";
/*视图列类为列表时，绿灯    图片  */
var greenlight="${ctxStatic}/bootstrap-3.3.7-dist/css/greenlight.png";
/*视图列类为列表时，红灯    图片  */
var redlight="${ctxStatic}/bootstrap-3.3.7-dist/css/redlight.png";
$(function(){
	 /*请求配置  */
	 qeryConfiguration();
	 /*请求网站视图和主机视图  */
	 queryWebSiteAndHostGroup(queryType);
	 /*请求日志信息  */
	 queryList2(list2Page);
	 /*为视图类型绑定点击事件  */
	 viewClik();
})
</script>
<body>
	<!--视图模式容器  -->
	<div class='col-md-12 titleDiv' id="viewTypeId">
		<span>视图类型：</span>
		<input type="radio" name="viewType" value="1" checked="checked"/> 图形
		<input type="radio" name="viewType" value="2"/> 列表
	</div>
	<!--网站视图容器  -->
	<div class='col-md-12' id="webSiteId">
		<fieldset>
			<legend>网站视图</legend>
			<table id="webSite"  cellpadding="10" class="viewTable" ></table>
			<table id="webSiteTable" class="table table-bordered table-striped" style="display: none"> </table>
		</fieldset>
	</div>
	<!--主机视图容器  -->
	<div class='col-md-12' id="hostSiteId">
		<fieldset>
			<legend>主机视图</legend>
			<table id="hostGroup" class="viewTable" ></table>
			<table id="hostGroupTable" class="table table-bordered table-striped" style="display: none"> </table>
		</fieldset>
	</div>
	<!--日志信息容器  -->
	<div class="col-md-12" id="logInfoId">
		<fieldset>
			<legend>日志信息</legend>
			<div class="titleDiv">
			 日志类型： <select style="color:black" onchange="logChange(this);">
						<option value ="1" selected="selected">篡改日志</option>
						<option value ="2">同步日志</option>
					</select>
			</div>
			<table  id="list2" class="table table-bordered table-striped"> </table>
			<div  style="text-align: right">    
			<ul id='bp-2-element-test'></ul>
			</div>
		</fieldset>
	</div>
</body>
</html>