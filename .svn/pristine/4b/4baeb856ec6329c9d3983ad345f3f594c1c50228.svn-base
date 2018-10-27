/**
 * Copyright &copy; 2012-2016 <a href="https://github.com/thinkgem/jeesite">JeeSite</a> All rights reserved.
 */
package com.thinkgem.jeesite.modules.query.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.thinkgem.jeesite.common.web.BaseController;
import com.thinkgem.jeesite.modules.query.service.QueryService;
import com.thinkgem.jeesite.modules.test.entity.Test;

/**
 * 测试Controller
 * @author ThinkGem
 * @version 2013-10-17
 */
@Controller
public class QueryController extends BaseController {

	@Autowired
	private QueryService queryService;
	
	@Autowired
	private ReadXmlAndTelnetUtils readXmlAndTelnetUtils;
	
	
	//跳转到展示页面
	@RequestMapping("/")
	public String toQueryPage(HttpServletRequest request,ModelMap map){
		Map<String,Object> reslut=queryService.qeryConfiguration();
		map.put("reflash_date",reslut.get("reflash_date"));
		return "query/queryList";
	}
	
	/**
	 * 显示列表页 同步日志
	 * @param test
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = {"list1", ""})
	@ResponseBody
	public JSONObject list(@RequestParam int pageNum,@RequestParam int pageSize , HttpServletRequest request, HttpServletResponse response, Model model) {
		JSONObject json=new JSONObject();
		try {
	        //分页查询
	        PageHelper.startPage(pageNum, pageSize);
	        List<LinkedHashMap<String,Object>> reslut=queryService.qeryList();
	        PageInfo<LinkedHashMap<String,Object>> pageInfo=new PageInfo<LinkedHashMap<String,Object>>(reslut);
			json.put("data", pageInfo);
			json.put("code", "200");
			System.out.println("<--同步日志请求-->");
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code", "300");
		}
		return json;
	}
	/**
	 * 显示列表页 篡改日志
	 * @param test
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = {"list2", ""})
	@ResponseBody
	public JSONObject list2(@RequestParam int pageNum,@RequestParam int pageSize , HttpServletRequest request, HttpServletResponse response, Model model) {
		JSONObject json=new JSONObject();
		try {
			 //分页查询
	        PageHelper.startPage(pageNum, pageSize);
	        List<LinkedHashMap<String,Object>> reslut=queryService.qeryList2();
	        PageInfo<LinkedHashMap<String,Object>> pageInfo=new PageInfo<LinkedHashMap<String,Object>>(reslut);
			json.put("data", pageInfo);
			json.put("code", "200");
			System.out.println("<--篡改日志请求-->");
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code", "300");
		}
		return json;
	}
	/**
	 * 显示列表页 篡改日志
	 * @param test
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = {"qeryConfiguration", ""})
	@ResponseBody
	public JSONObject qeryConfiguration( HttpServletRequest request, HttpServletResponse response, Model model) {
		JSONObject json=new JSONObject();
		try {
			Map<String,Object> reslut=queryService.qeryConfiguration();
			json.put("code","200");
			json.put("reflash_date", reslut.get("reflash_date"));
			json.put("page_size", reslut.get("page_size"));
			System.out.println("<--配置文件请求-->");
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code","300");
		}
		return json;
	}
	/**
	 * 显示主机视图和网站视图
	 * @param test
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = {"webSiteAndHostGroup", ""})
	@ResponseBody
	public JSONObject webSiteAndHostGroup( HttpServletRequest request, HttpServletResponse response, Model model) {
		JSONObject json=new JSONObject();
		List<Map<String, Object>>  hostList=new ArrayList<Map<String,Object>>();
		List<Map<String, Object>>  websiteList=new ArrayList<Map<String,Object>>();
		List<Map<String, Object>>  groupHostList=new ArrayList<Map<String,Object>>();
		try {
			Map<String,Object> reslut=queryService.qeryConfiguration();
			String pathUrl=(String) reslut.get("xml_url");
			readXmlAndTelnetUtils.readXmlMethod(hostList,websiteList,groupHostList,pathUrl);
			readXmlAndTelnetUtils.setTelnetInfo(hostList);
			handlerWebSiteData(websiteList,groupHostList);
			json.put("code","200");
			json.put("monitorList",hostList);
			json.put("websiteList",websiteList);
			System.out.println("<--网站视图和主机视图请求-->");
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code","300");
		}
		return json;
	}
	/**
	 * 显示主机视图和网站视图（备用，分页时启用）
	 * @param test
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value = {"webSiteAndHostTable", ""})
	@ResponseBody
	public JSONObject webSiteAndHostTable( HttpServletRequest request, HttpServletResponse response, Model model) {
		JSONObject json=new JSONObject();
		List<Map<String, Object>>  hostList=new ArrayList<Map<String,Object>>();
		List<Map<String, Object>>  websiteList=new ArrayList<Map<String,Object>>();
		List<Map<String, Object>>  groupHostList=new ArrayList<Map<String,Object>>();
		try {
			Map<String,Object> reslut=queryService.qeryConfiguration();
			String pathUrl=(String) reslut.get("xml_url");
			readXmlAndTelnetUtils.readXmlMethod(hostList,websiteList,groupHostList,pathUrl);
			readXmlAndTelnetUtils.setTelnetInfo(hostList);
			handlerWebSiteData(websiteList,groupHostList);
			json.put("code","200");
			json.put("hostList",hostList);
			json.put("websiteList",websiteList);
		} catch (Exception e) {
			e.printStackTrace();
			json.put("code","300");
		}
		return json;
	}
	
    /**
     * 查询默认网址的同步主机和监控主机
     */
	public void handlerWebSiteData(List<Map<String, Object>>  websiteList,List<Map<String, Object>>  groupHostList){
		for(Map<String, Object> item:websiteList){
			queryXmlInfo(item,groupHostList);
			String webSiteId=(String) item.get("id");
			Map<String,Object> map=queryService.queryLogById(webSiteId);
			if(map!=null && map.containsKey("STATE")){
				item.put("state", map.get("STATE"));
			}else{
				item.put("state","2");
			}
		}
	}
	/**
	 * 查配置文件同步主机和监控主机
	 */
	public void queryXmlInfo(Map<String, Object> item,List<Map<String, Object>> groupHostList){
		String backuphostgroupid=(String) item.get("backuphostgroupid");
		String monitorhostgroupid=(String) item.get("monitorhostgroupid");
		for(Map<String, Object> hostItem:groupHostList){
			String groupId=(String)hostItem.get("id");
			if(backuphostgroupid.equals(groupId)){
				item.put("backupName", hostItem.get("hostgroupName"));
			}
			if(monitorhostgroupid.equals(groupId)){
				item.put("monitorName", hostItem.get("hostgroupName"));
			}
		}
	}
}
