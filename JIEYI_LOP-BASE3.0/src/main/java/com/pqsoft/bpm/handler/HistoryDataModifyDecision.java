package com.pqsoft.bpm.handler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jbpm.api.jpdl.DecisionHandler;
import org.jbpm.api.model.OpenExecution;

import com.pqsoft.skyeye.api.Dao;

/**
 * 历史数据修改判断
 * @author Donzell 2013-11-02
 */
public class HistoryDataModifyDecision implements DecisionHandler {
	private String namespace = "bpm.handler.";
	private static final long serialVersionUID = 1L;

	@Override
	public String decide(OpenExecution arg0) {
		String file_no = arg0.getVariable("FILE_NO")+"";
		Map<String,Object> param=new HashMap<String,Object>();
		param.put("FILE_NO", file_no);
		Map<String, Object> map = Dao.selectOne(namespace + "queryHisDataModRelDepartments", param);
		String departments = (String) map.get("REL_DEPART");
		String[] deps = departments.split(",");
		String dep = "";
		
		//财务部  (财务部,租金科,债权部,法务部,IT管理部,档案科,信审部,建机企划部,商用车企划部)
		if("exclusive5".equals(arg0.getActivity().getName())){
			
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("财务部".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive4".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("租金科".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive2".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("债权部".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive3".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("IT管理部".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive6".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("档案科".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive7".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("信审部".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive1".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("法务部".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive8".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("建机企划部".equals(dep)){
					return "相关";
				}
			}
		}else if("exclusive9".equals(arg0.getActivity().getName())){
			for(int i=0;i<deps.length;i++){
				dep = deps[i].toString();
				System.out.println("dep="+dep);
				if("商用车企划部".equals(dep)){
					return "相关";
				}
			}
		}
		return "未相关";
	}
	
}
