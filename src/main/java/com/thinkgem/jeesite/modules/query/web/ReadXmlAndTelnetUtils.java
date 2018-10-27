/**  
* @Title: TestTelnet.java  
* @Package com.inspur.service  
* @Description: TODO(用一句话描述该文件做什么)  
* @author zenglingsheng 
* @date 2018年10月22日 下午4:31:00
* @version V1.0  
*/
package com.thinkgem.jeesite.modules.query.web;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.net.telnet.TelnetClient;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thinkgem.jeesite.modules.query.service.QueryService;

/**  
 * 读取xml和telnet 端口的工具类
* @ClassName: TestTelnet  
* @Description: TODO(这里用一句话描述这个类的作用)  
* @author zenglingsheng  
* @date 2018年10月22日 下午4:31:00  
*    
*/
@Component
public class ReadXmlAndTelnetUtils {

	
	public static void main(String[] args) {
		try {
			String pathUrl="C:/CVICSE/InforGuard/InforGuardMC/var/inforguard/managerConsole.xml";
			List<Map<String, Object>>  hostList=new ArrayList<Map<String,Object>>();
			List<Map<String, Object>>  websiteList=new ArrayList<Map<String,Object>>();
			List<Map<String, Object>>  groupHostList=new ArrayList<Map<String,Object>>();
			readXmlMethod(hostList,websiteList,groupHostList,pathUrl);
		} catch (Exception e) {
			e.printStackTrace();
		}
	
	}
	public static void readXmlMethod(List<Map<String,Object>> hostList,
			List<Map<String,Object>> websiteList,List<Map<String,Object>> hostgroupList, String pathUrl) throws DocumentException{
		 SAXReader reader = new SAXReader();
	      Document document = reader.read(new File(pathUrl));
	      //获取文档根节点
	      Element root = document.getRootElement();
	      putValueFromXml(root,"monitorhostgroups",hostList,hostgroupList);
	      putValueFromXml(root,"backuphostgroups",hostList,hostgroupList);
	      getWebSiteValue(root,"websites",websiteList);
	      handlerWebSiteData(websiteList,hostgroupList);
	  }
	/**
     * 查询默认网址的同步主机和监控主机
     */
	public static void handlerWebSiteData(List<Map<String, Object>>  hostList,List<Map<String, Object>>  groupHostList){
		for(Map<String, Object> item:hostList){
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
	/**
	 * 获取weisite节点
	 */
	public static void getWebSiteValue(Element root,String nodeId,List<Map<String,Object>> websiteList){
		List<Element> contactElems =root.elements(nodeId);
		for(Element contactElem:contactElems){
			 List<Element> contactList = contactElem.elements();
		     for (Element e:contactList){
		    	 Map map=new HashMap();
		    	 map.put("name", e.attributeValue("name"));
		    	 map.put("id", e.attributeValue("id"));
		    	 map.put("backuphostgroupid", e.attributeValue("backuphostgroupid"));
		    	 map.put("monitorhostgroupid", e.attributeValue("monitorhostgroupid"));
		    	 websiteList.add(map); 
		     }	
		}
	    
	}
	/**
	 * 获取值放入到Map
	* @Title: putValueFromXml  
	* @author zenglingsheng  
	* @date 2018年10月22日 下午5:53:26 
	* @Description: TODO(这里用一句话描述这个方法的作用)  
	* @throws
	 */
	public static void putValueFromXml(Element root,String nodeId,List<Map<String,Object>> hostList,List<Map<String,Object>> hostgroupList){
		 //获得指定节点下面的子节点
		List<Element> contactElems = root.elements(nodeId);//首先要知道自己要操作的节点。 
		 for(Element contactElem:contactElems){
			 List<Element> contactList = contactElem.elements();
		      for (Element e:contactList){
		    	  Map hostGroupMap=new HashMap();
		    	  hostGroupMap.put("hostgroupName", e.attributeValue("name"));
		    	  hostGroupMap.put("id", e.attributeValue("id"));
		    	  hostgroupList.add(hostGroupMap);
		          List<Element> monitorhostgroupList=e.elements();
		          for(Element monitorhostgroup : monitorhostgroupList){
		        	  Map monitorMap=new HashMap();
		        	  Map<String,Object> map=new HashMap<String,Object>();
		        	  String  name=monitorhostgroup.attributeValue("name");
		        	  String  ip=monitorhostgroup.attributeValue("ip");
		        	  String  port=monitorhostgroup.attributeValue("port");
		        	  monitorMap.put("name", name);
		        	  monitorMap.put("port", port);
		        	  monitorMap.put("ip", ip);
		        	  hostList.add(monitorMap);
		          }
		      } 
		 }
	      
	} 
	//显示图片信息
	public void setTelnetInfo(List<Map<String, Object>>  monitorList){
		for(Map<String, Object> item:monitorList){
			String ip=(String) item.get("ip");
			int port=Integer.valueOf((String) item.get("port"));
			String flag=telnetMethod(ip,port);
			item.put("flag", flag);
		}
	}
	/**
	 * telnet ip 和端口
	* @Title: telnetMethod
	* @Description: TODO
	* @param @param ip
	* @throws
	 */
	public String telnetMethod(String ip,int port){
		String flag="true";
		TelnetClient telnet;  
		telnet = new TelnetClient();  
		try  
		{  
		    telnet.connect(ip, port);
		    System.out.println(ip+":"+port+"端口已开通");
		}  
		catch (IOException e)  
		{   flag="false";
			System.out.println(ip+":"+port+"端口未开通");
		}  
		  
		try  
		{  
		    telnet.disconnect();  
		}  
		catch (IOException e)  
		{  
			System.out.println(ip+":"+port+"关闭失败");
		}
		return flag;
	}
}
