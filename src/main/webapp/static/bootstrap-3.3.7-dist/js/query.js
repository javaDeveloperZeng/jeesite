
/**
 * 视图点击事件
 */
 function viewClik(){
	$("input[name=viewType]").click(function(){
		var valStr=$("input[name=viewType]:checked").val();
		queryType=valStr;
		queryWebSiteAndHostGroup(queryType);
	});
}

/**
 * 设置请求时间
 */
 function setList1QueryTime(){
	clearInterval(time);
	time = setInterval(function(){
		 qeryConfiguration();
		 queryList1(list1Page);
		 queryWebSiteAndHostGroup(queryType);
    },reflshTime); 
}
/**
 * 设置请求时间
 */
 function setList2QueryTime(){
	 clearInterval(time);
	time = setInterval(function(){
		 qeryConfiguration();
		 queryList2(list2Page);
		 queryWebSiteAndHostGroup(queryType);
    },reflshTime); 
}
/*请求配置信息  */    
 function qeryConfiguration(){       
	$.ajax({
		type : "POST",
		url : basePath+"qeryConfiguration",
		dataType : "json",
		async:false, 
		success : function(data) {
			if(data.code=='200'){
				 pageSize=data.page_size;
				var reflshTimeInt=data.reflash_date;
				 if(reflshTimeInt!=reflshTime){
					 reflshTime= reflshTimeInt;
					 window.location.reload();
				 }
			}
		}
	});
	}
/*篡改日志请求  */    
 function queryList2(pageNum){
	$.ajax({
		async: false,
		type : "POST",
		data: {pageNum:pageNum, pageSize : pageSize },
		url : basePath+"list2",
		dataType : "json",
		success : function(data) {
			if(data.code=='200'){
				var htmlList= [];
				var result=data.data.list;
				if(typeof(result)!='undefined')
				{	list2Page=data.data.pageNum;
					var options = configPage(data,"queryList2");
					creatTableHead(htmlList,"1");
					createTable(data,htmlList);
					$('#bp-2-element-test').bootstrapPaginator(options);
					$('#bp-2-element-test').append(createPageTotal(data));
				}else{
					htmlList.push("<tr>");
					htmlList.push("<td colspan='8'>暂无数据！</td>");
					htmlList.push("</tr>");
				}
				$("#list2").html(htmlList.join(""));
				setList2QueryTime();
			}else{
				alert("篡改日志请求失败！");
			}
		}
	});
	}
/*同步日志请求  */
  function queryList1(pageNum){
	$.ajax({
		type : "POST",
		url : basePath+"list1",
		dataType : "json",
		data: {pageNum:pageNum, pageSize : pageSize },
		success : function(data) {
			if(data.code=='200'){
				var result=data.data.list;
				var htmlList= [];
				if(typeof(result)!='undefined')
				{
					list1Page=data.data.pageNum;
				   var options = configPage(data,"queryList1");
					creatTableHead(htmlList,"2");
					createTable(data,htmlList);
				    $('#bp-2-element-test').bootstrapPaginator(options);
					$('#bp-2-element-test').append(createPageTotal(data));
				}else{
					htmlList.push("<tr>");
					htmlList.push("<td colspan='8'>暂无数据！</td>");
					htmlList.push("</tr>");
				}
				$("#list2").html(htmlList.join(""));
				setList1QueryTime();
			}else{
				alert("同步日志请求失败！");
			}
		}
	});
}
/*
 * 分页总结 
 */
function createPageTotal(data){
	return "<li><a href=\"javascript:#\" title=\"\">共"+data.data.total+" 条</a></li>";
}
 
/**
 * 拼接表格数据
 */
function createTable(data,htmlList){
	htmlList.push("<tbody>");
	var result=data.data.list;
	if(typeof(result)!='undefined'){
		$.each(result,function(i,item){
			htmlList.push("<tr>");
			var no=caculateNo(pageSize,data.data.pageNum,i);
			htmlList.push("<td>"+no+"</td>");
			$.each(item,function(j,value){
				if(j=='NUMBER'){
					value=value+"(次)"
				}
				htmlList.push("<td>"+value+"</td>");
			})
			htmlList.push("</tr>");
		})
	}else{
		htmlList.push("<tr>");
		htmlList.push("<td colspan='8'>暂无数据！</td>");
		htmlList.push("</tr>");
	}
	htmlList.push("</tbody>");
}
/*配置分页*/
function configPage(data,queryType){
	  var options = {
				bootstrapMajorVersion :3,
	　　　　　　　　　　currentPage: data.data.pageNum,//当前页数
	　　　　　　　　　　totalPages: data.data.pages,//总页数 注意不是总条数
	　　　　　　　　　　pageUrl: function(type, page, current){
	                    if (page==current) {
	                        return "javascript:void(0)";
	                    } else {
	                        return "javascript:"+queryType+"("+page+")";
	                    }
	                }
	          };
	  return options;
}
/*计算表的编号*/
function caculateNo(pageSize,pageNumber,index){
	return pageSize * (pageNumber - 1) + index + 1;
}
/**
 * 请求网站视图和主机视图
 */
 function queryWebSiteAndHostGroup(queryType){
	 $.ajax({
			type : "POST",
			url : basePath+"webSiteAndHostGroup",
			dataType : "json",
			success : function(data) {
				if(data.code=='200'){
					if(queryType=='1'){
						creatWebsiteInfo(data);
						creatMonitorInfo(data);
					}else if(queryType=='2'){
						creatWebsiteInfoTable(data);
						creatMonitorInfoTable(data);
					}
				}else{
					alert("请求网站视图和主机视图失败！");
				}
			}
		});
}
/**
 * 判断状态隐藏表格
 */
 function showOrHidden(queryType){
	  
}
/**
 * 拼接网站视图--图片方式
 */
 function creatWebsiteInfo(data){
		$("#webSite").css("display","");
		$("#webSiteTable").css("display","none");
	 var webSite=data.websiteList;
	 var webSiteHtml=[];
	 webSiteHtml.push(" <tr>");
	 $.each(webSite,function(i,item){
		 webSiteHtml.push("<td>");
		 if(item.state=='1'){
		  webSiteHtml.push(" <img style='float:left;width:100%' alt=\"\" src="+webSiteRed+">");
		 }else if(item.state=='2'){
		  webSiteHtml.push(" <img style='float:left;width:100%' alt=\"\" src="+webSiteGreen+">");
		 }
		 webSiteHtml.push(" <span style='float:left;width:100%' >"+item.name+"</span>");
		 webSiteHtml.push("</td>");
		 webSiteHtml.push("<td style='width:5%'></td>");
	 })
	 webSiteHtml.push(" </tr>");
	 $("#webSite").html(webSiteHtml.join(""));
}
/**
 * 拼接网站视图--表格方式
 */
 function creatWebsiteInfoTable(data){
		$("#webSite").css("display","none");
		$("#webSiteTable").css("display","");
	 var webSite=data.websiteList;
	 var webSiteHtml=[];
	 creatTableWebSiteHead(webSiteHtml);
	
	 $.each(webSite,function(i,item){
		 var no=i+1;
		 var stateStr="";
		 webSiteHtml.push(" <tr>");
		 webSiteHtml.push("<td>"+no+"</td>");
		 if(item.state=='2'){
			 stateStr="<img  alt=\"\" src="+greenlight+">";  
		 }else if(item.state=='1'){
			 stateStr="<img  alt=\"\" src="+redlight+">";  
		 }
		 webSiteHtml.push("<td>"+stateStr+"</td>");
		 webSiteHtml.push("<td>"+item.name+"</td>");
		 webSiteHtml.push("<td>"+item.monitorName+"</td>");
		 webSiteHtml.push("<td>"+item.backupName+"</td>");
		 webSiteHtml.push(" </tr>");
	 })
	 $("#webSiteTable").html(webSiteHtml.join(""));
}
 /**
  * 拼接主机视图--图片方式
  */
  function creatMonitorInfo(data){
	  $("#hostGroup").css("display","");
	  $("#hostGroupTable").css("display","none");
 	 var monitor=data.monitorList;
 	 var monitorHtml=[];
 	 monitorHtml.push(" <tr>");
 	 $.each(monitor,function(i,item){
 		monitorHtml.push("<td>");
 		if(item.flag=="true"){
 			monitorHtml.push(" <img style='float:left;width:100%' alt=\"\" src="+hostSiteblue+">");	
 		}else if(item.flag=='false'){
 			monitorHtml.push(" <img style='float:left;width:100%' alt=\"\" src="+hostSitered+">");
 		}
 		monitorHtml.push(" <span style='float:left;width:100%'>"+item.name+"</span>");
 		monitorHtml.push("</td>");
 		monitorHtml.push("<td style='width:5%'></td>");
 	 })
 	 monitorHtml.push(" </tr>");
 	 $("#hostGroup").html(monitorHtml.join(""));
 }
 /**
  * 拼接主机视图--图片方式
  */
  function creatMonitorInfoTable(data){
	 $("#hostGroup").css("display","none");
	 $("#hostGroupTable").css("display","");
 	 var monitor=data.monitorList;
 	 var monitorHtml=[];
 	  creatTablehostGroupHead(monitorHtml);
 	 $.each(monitor,function(i,item){
 	    var no=i+1;
 	    var flagStr="";
 	    monitorHtml.push(" <tr>");
 	    monitorHtml.push("<td>"+no+"</td>");
 	    if(item.flag=='true'){
 	    	flagStr="<img  alt=\"\" src="+greenlight+">";
 	    }else if(item.flag=='false'){
 	    	flagStr="<img  alt=\"\" src="+redlight+">";
 	    }
 		monitorHtml.push("<td>"+flagStr+"</td>");
 		monitorHtml.push("<td>"+item.name+"</td>");
 		monitorHtml.push("<td>"+item.ip+"</td>");
 		monitorHtml.push("<td>"+item.port+"</td>");
 	    monitorHtml.push(" </tr>");
 	 })
 	 $("#hostGroupTable").html(monitorHtml.join(""));
 }
 /**
 *日志切换方法
 */
 function logChange(obj){
	 var valStr=$(obj).val();
	 if(valStr=='1'){
		 queryList2(list2Page);
	 }else if(valStr=='2'){
		 queryList1(list1Page);
	 }
 }
 /**
 *表头拼接
 */
 function creatTableHead(htmlList,status){
		 htmlList.push("<thead>");
		 htmlList.push("<tr>");
		 htmlList.push("<th>编号</th>");
		 htmlList.push("<th>发现时间</th>");
		 if(status=='1'){
			 htmlList.push("<th>篡改时间</th>");
		 }else if(status=='2'){
			 htmlList.push("<th>发布时间</th>");
		 }
		 htmlList.push("<th>事件类型</th>");
		 htmlList.push("<th>主机地址</th>");
		 htmlList.push("<th>网站名称</th>");
		 htmlList.push("<th>处理时间</th>");
		 htmlList.push("<th>处理次数</th>");
		 htmlList.push("<th>处理结果</th>");
		 htmlList.push("<th>内容</th>");
		 htmlList.push("</tr>");
		 htmlList.push("</thead>");
 }
 /**
 *网站表格-表头
 */
 function creatTableWebSiteHead(htmlList){
	 htmlList.push("<thead>");
	 htmlList.push("<tr>");
	 htmlList.push("<th>编号</th>");
	 htmlList.push("<th>网站状态</th>");
	 htmlList.push("<th>网站名称</th>");
	 htmlList.push("<th>监控主机组</th>");
	 htmlList.push("<th>备份主机组</th>");
	 htmlList.push("</tr>");
	 htmlList.push("</thead>");
 }
 /**
 *主机表格-表头
 */
 function creatTablehostGroupHead(htmlList){
	 htmlList.push("<thead>");
	 htmlList.push("<tr>");
	 htmlList.push("<th>编号</th>");
	 htmlList.push("<th>主机状态</th>");
	 htmlList.push("<th>主机名称</th>");
	 htmlList.push("<th>主机地址</th>");
	 htmlList.push("<th>主机端口</th>");
	 htmlList.push("</tr>");
	 htmlList.push("</thead>"); 
 }