/**
 * Copyright &copy; 2012-2016 <a href="https://github.com/thinkgem/jeesite">JeeSite</a> All rights reserved.
 */
package com.thinkgem.jeesite.modules.query.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thinkgem.jeesite.common.service.BaseService;
import com.thinkgem.jeesite.common.service.CrudService;
import com.thinkgem.jeesite.modules.test.entity.Test;
import com.thinkgem.jeesite.modules.query.dao.QueryDao;
import com.thinkgem.jeesite.modules.test.dao.TestDao;

/**
 * 测试Service
 * @author ThinkGem
 * @version 2013-10-17
 */
@Service
@Transactional(readOnly = true)
public class QueryService extends BaseService{
	@Autowired
	QueryDao queryDao;
	public List<LinkedHashMap<String,Object>> qeryList(){
		return queryDao.qeryList();
	};
	public List<LinkedHashMap<String,Object>> qeryList2(){
		return queryDao.qeryList2();
	};
	public Map<String,Object> qeryConfiguration(){
		Map<String,Object> map=new HashMap<String,Object>();
		try {
			 map=queryDao.qeryConfiguration();
		} catch (Exception e) {
			System.err.println("数据库中缺少 查询配置表（正在使用默认10s刷新一次，一页显示10条记录）->table_configuration ");
			map.put("reflash_date","10000");
		}
		return map;
	};
	
	public Map<String,Object> queryLogById(String webSiteId){
		 return queryDao.queryLogById(webSiteId);
	}
}
