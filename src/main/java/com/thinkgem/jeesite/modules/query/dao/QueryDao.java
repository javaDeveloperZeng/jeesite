/**
 * Copyright &copy; 2012-2016 <a href="https://github.com/thinkgem/jeesite">JeeSite</a> All rights reserved.
 */
package com.thinkgem.jeesite.modules.query.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.thinkgem.jeesite.common.persistence.CrudDao;
import com.thinkgem.jeesite.common.persistence.annotation.MyBatisDao;
import com.thinkgem.jeesite.modules.test.entity.Test;

/**
 * 测试DAO接口
 * @author ThinkGem
 * @version 2013-10-17
 */
@MyBatisDao
public interface QueryDao extends CrudDao<Test> {
	List<LinkedHashMap<String,Object>>qeryList();
	List<LinkedHashMap<String,Object>>qeryList2();
	Map<String,Object>qeryConfiguration();
	Map<String,Object>queryLogById(@Param("webSiteId") String webSiteId);
}
