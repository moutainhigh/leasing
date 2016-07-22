package com.pqsoft.insurebxbc.action;
/**
 *   保险补差收取查询
 */
import java.util.Map;

import com.pqsoft.insurebxbc.service.InsureBXBCReceiveListService;
import com.pqsoft.skyeye.VM;
import com.pqsoft.skyeye.api.Action;
import com.pqsoft.skyeye.api.Page;
import com.pqsoft.skyeye.api.Reply;
import com.pqsoft.skyeye.api.ReplyAjaxPage;
import com.pqsoft.skyeye.api.ReplyHtml;
import com.pqsoft.skyeye.dev.aDev;
import com.pqsoft.skyeye.rbac.api.aAuth;
import com.pqsoft.skyeye.rbac.api.aPermission;
import com.pqsoft.skyeye.rbac.api.aAuth.aAuthType;

public class InsureBXBCReceiveListAction extends Action{
	
	private String basePath = "insure_bxbc/"; 
	private InsureBXBCReceiveListService bxbcReceiveListService = new InsureBXBCReceiveListService();
	
	/**
	 *  显示主页面
	 */
	@Override
//	@aPermission(name = { "保险管理", "保险补差管理", "补差收取查询"})
//	@aAuth(type = aAuthType.USER)
//	@aDev(code = "6196", email = "hanxl@strongflc.com", name = "韩晓龙")
	public Reply execute() {
//		return new ReplyHtml(VM.html(basePath + "insureBXBCReceiveList.vm", null));
		return null;
	}
	
	/**
	 * 用于分页查询
	 */
	@aAuth(type = aAuth.aAuthType.LOGIN)
	@aDev(code = "6196", email = "hanxl@strongflc.com", name = "韩晓龙")
	public Reply pageData(){
		Map<String,Object> param = _getParameters();
		Page pagedata = bxbcReceiveListService.getPageData(param);
		return new ReplyAjaxPage(pagedata);
	}
	
}
