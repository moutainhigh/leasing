package com.pqsoft.paymentReport.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import net.sf.json.JSONObject;

import org.apache.velocity.VelocityContext;

import com.pqsoft.dataDictionary.service.DataDictionaryMemcached;
import com.pqsoft.paymentReport.service.PaymentReportTableService;
import com.pqsoft.skyeye.VM;
import com.pqsoft.skyeye.api.Action;
import com.pqsoft.skyeye.api.Reply;
import com.pqsoft.skyeye.api.ReplyAjax;
import com.pqsoft.skyeye.api.ReplyAjaxPage;
import com.pqsoft.skyeye.api.ReplyHtml;
import com.pqsoft.skyeye.dev.aDev;
import com.pqsoft.skyeye.rbac.api.Security;
import com.pqsoft.skyeye.rbac.api.aAuth;
import com.pqsoft.skyeye.rbac.api.aPermission;
import com.pqsoft.skyeye.rbac.api.aAuth.aAuthType;
import com.pqsoft.util.DateUtil;
import com.pqsoft.util.POIExcelUtil;
import com.pqsoft.util.UtilChart;

public class PaymentReportTableAction  extends Action{

	private final String _PATH = "PaymentReportTable/";
	// **实现类服务
	PaymentReportTableService service = new PaymentReportTableService();

	//页面自定义显示列的下拉列表所需，同时也是sql所需
	private String[] titlesName = new String[] {  "客户名称", "支付表号", "设备款", };
	private String[] sqlsName = new String[] { "CUST_NAME","PAYLIST_CODE", "LEASE_TOPRIC"};
	
	//报表工具调用
	UtilChart utilChart=new UtilChart();

	@Override
	@aAuth(type = aAuth.aAuthType.USER)
	@aPermission(name = {"报表管理", "应实付统计","应付未付统计"})
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	public Reply execute() {
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付统计-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		Map<String,Object> param=_getParameters();
		param.put("TYPE", 2);
		context.put("param", param);
		context.put("chartReport", utilChart.to_chartPie( param, "报表-应实付-统计类型", "应实付统计", "paymentReport.showGroupClientType","1"));
		
		
		return new ReplyHtml(VM.html(_PATH+"graphTJClientChartPayment.vm", context));
	}
	@aAuth(type = aAuth.aAuthType.USER)
	@aPermission(name = { "报表管理", "应实付统计","应付统计"})
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	public Reply execute2() {
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付统计-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		Map<String,Object> param=_getParameters();
		param.put("TYPE", 1);
		context.put("param", param);
		context.put("chartReport", utilChart.to_chartPie( param, "报表-应实付-统计类型", "应实付统计", "paymentReport.showGroupClientType","1"));
		return new ReplyHtml(VM.html(_PATH+"graphTJClientChartPayment.vm", context));
	}
	@aAuth(type = aAuth.aAuthType.USER)
	@aPermission(name = { "报表管理", "应实付统计","实付统计"})
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	public Reply execute3() {
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付统计-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		Map<String,Object> param=_getParameters();
		param.put("TYPE", 3);
		context.put("param", param);
		context.put("chartReport", utilChart.to_chartPie( param, "报表-应实付-统计类型", "应实付统计", "paymentReport.showGroupClientType","1"));
		return new ReplyHtml(VM.html(_PATH+"graphTJClientChartPayment.vm", context));
	}
	@aAuth(type = aAuth.aAuthType.USER)
	@aPermission(name = { "报表管理", "应实付统计","应付未付分析"})
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	public Reply execute4() {
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付分析-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		Map<String,Object> param=_getParameters();
		param.put("TYPE", 2);
		param.put("REPORT_DATE", 4);
		context.put("chartReport", utilChart.to_chartLine(param, "报表-应实付-分析-统计类型", "应实付分析", "paymentReport.REPORT_X_MONTH,paymentReport.PROJECT_REPORT_TYPE,paymentReport.showGroupProjectFX","1"));
		context.put("param", param);
		return new ReplyHtml(VM.html(_PATH+"graphZXClientChartPayment.vm", context));
	}
	@aAuth(type = aAuth.aAuthType.USER)
	@aPermission(name = { "报表管理", "应实付报表", "应实付统计","实付分析"})
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	public Reply execute5() {
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付分析-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		Map<String,Object> param=_getParameters();
		param.put("TYPE", 3);
		param.put("REPORT_DATE", 4);
		context.put("chartReport", utilChart.to_chartLine(param, "报表-应实付-分析-统计类型", "应实付分析", "paymentReport.REPORT_X_MONTH,paymentReport.PROJECT_REPORT_TYPE,paymentReport.showGroupProjectFX","1"));
		context.put("param", param);
		return new ReplyHtml(VM.html(_PATH+"graphZXClientChartPayment.vm", context));
	}
	/**
	 * 进入应实付图形报表页面
	 * 
	 * @return
	 * @author xgm 2014年8月4日
	 */
	@aAuth(type = aAuthType.LOGIN)
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	@aPermission(name = { "数据统计", "应实付报表", "应实付统计1" })
	@SuppressWarnings("unchecked")
	public Reply toChartNewProject() {
		Map<String,Object> param=_getParameters();
		System.out.println(param+"+===========");
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付统计-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		/********************************控制自定义显示列********************/
		context.put("columnInit", utilChart.parseColumnInit("应实付统计", titlesName, sqlsName));
		/********************************************************************/
		context.put("param", param);
		return new ReplyHtml(VM.html(_PATH + "graphTJPayment.vm", context));
	}

	@aAuth(type = aAuthType.LOGIN)
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	@aPermission(name = { "数据统计", "应实付报表", "应实付统计查询1" })
	public Reply doTableShow() {
		Map<String, Object> param = _getParameters();
		param.put("USER_CODE", Security.getUser().getCode());
		JSONObject json = JSONObject.fromObject(param.get("searchParams"));
		param.putAll(json);
		System.out.println(param+"=======");
		//判断是否定制显示字段 如果配置则保存配置并使用 否则查询配置历史
		if(param.get("COLUMN_NAMES") != null){
			utilChart.delReportColumnByReportAndUser("应实付统计", Security.getUser().getCode());
			utilChart.insertReportColumnByReportAndUser("应实付统计", Security.getUser().getCode(),param.get("COLUMN_NAMES"));
		}
		param.put("SQL_COLUMN", utilChart.getColumns(param.get("COLUMN_NAMES")+""));
		return new ReplyAjaxPage(service.queryPage(param));
	}

	/**
	 * 查询应实付统计图表
	 * 
	 * @return
	 * @author xgm 2014年8月4日
	 */
	@aAuth(type = aAuthType.LOGIN)
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	@aPermission(name = { "数据统计", "应实付报表", "应实付统计查询2" })
	public Reply doChartProject() {
		String chart = null;
		Map<String, Object> param = _getParameters();
		JSONObject json=JSONObject.fromObject(param.get("param"));
		System.out.println(param+"==============");
		if("2".equals(json.get("REPORT_QZTX"))){
			//折线图
			//判断时间节点为全部还是时间段
			//如果为全部将其实日期和当前日期查出来
			//如果为时间段，判断系统中有输入起始日期和终止日期
			if(json!=null && json.get("REPORT_DATE")!=null && !json.get("REPORT_DATE").equals("") && json.get("REPORT_DATE").equals("1")){
				param.putAll(service.queryDateByProject());
			}
			else if(json!=null && json.get("REPORT_DATE")!=null && !json.get("REPORT_DATE").equals("") && json.get("REPORT_DATE").equals("6")){
				Map dateMap=service.queryDateByProject();
				if(json.get("START_TIME")==null || json.get("START_TIME").equals("")){
					json.put("START_TIME", dateMap.get("START_TIME"));
				}
				
				if(json.get("END_TIME")==null || json.get("END_TIME").equals("")){
					json.put("END_TIME", dateMap.get("END_TIME"));
				}
			}
			
			 chart=new UtilChart().to_chartLine(json, "报表-应实付-分析-统计类型", "应实付分析", "paymentReport.REPORT_X_MONTH,paymentReport.PROJECT_REPORT_TYPE,paymentReport.showGroupProjectFX","1");
			
		}else{
			//饼状图
			chart=utilChart.to_chartPie(JSONObject.fromObject( _getParameters().get("param")), "报表-应实付-统计类型", "应实付统计", "paymentReport.showGroupClientType","1");
		}
		return new ReplyAjax(true, chart,null);
	}

	/**
	 * 进入新增客户图形报表页面
	 * 
	 * @return
	 * @author King 2014年8月1日
	 */
	@aAuth(type = aAuthType.LOGIN)
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	@aPermission(name = { "数据统计", "项目报表", "应实付分析" })
	@SuppressWarnings("unchecked")
	public Reply toChartFXProject() {
		Map<String, Object> param = _getParameters();
		VelocityContext context = new VelocityContext();
		List<Object> REPORT_DATE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付分析-时间-区间");
		context.put("REPORT_DATE_list", REPORT_DATE_list);
		List<Object> REPORT_TYPE_list = (List<Object>) new DataDictionaryMemcached().get("报表-应实付-分析-统计类型");
		context.put("REPORT_TYPE_list", REPORT_TYPE_list);
		Map json=new HashMap();
		json.putAll(param);
		json.put("REPORT_DATE", "4");//默认为本年
		json.put("REPORT_TYPE", "5");//默认为新增项目
		List list=service.getm(json);
		System.out.println(json+"=============");
		context.put("chartReport",new UtilChart().to_chartLine(json, "报表-应实付-分析-统计类型", "应实付分析", "paymentReport.REPORT_X_MONTH,paymentReport.PROJECT_REPORT_TYPE,paymentReport.showGroupProjectFX","1"));
		/********************************控制自定义显示列********************/
		context.put("columnInit", utilChart.parseColumnInit("应实付统计", titlesName, sqlsName));
		/********************************************************************/
		context.put("param",param);
		return new ReplyHtml(VM.html(_PATH + "graphFXProject.vm", context));
	}
	
	@SuppressWarnings("unchecked")
	@aAuth(type = aAuth.aAuthType.LOGIN)
	@aPermission(name = { "数据统计", "项目报表", "列表导出" })
	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
	public ReplyAjax exportExcel(){
		Map<String,Object> m = _getParameters();
		JSONObject json = JSONObject.fromObject(m.get("searchParams"));
		m.remove("searchParams");
		m.putAll(json);
		//查询导出字段
		String[] titleName = null;
		String[] sql_columns = null;
		
		m.put("USER_CODE", Security.getUser().getCode());
		//判断是否全部导出
		m.put("SQL_COLUMN",utilChart.getColumns(m.get("SQL_COLUMN")+""));
		
		if(m.get("SQL_COLUMN") == null || m.get("SQL_COLUMN") == ""|| m.get("SQL_COLUMN") == "*"){
			titleName = titlesName;
			sql_columns=sqlsName;
		}else{
			String[] arr = m.get("SQL_COLUMN").toString().split(",");
			titleName = new String[arr.length];
			sql_columns=arr;
			//数据排序
			for (int i = 0; i < arr.length; i++) {
				for(int j=0;j<sqlsName.length;j++){
					System.out.println("aaaa="+arr[i]);
					if(arr[i]==sqlsName[j]){
						//titleName匹配
						titleName[i]=titlesName[j];
					}
				}
			}
		}
		new POIExcelUtil().expExcel_2007(m,"项目统计"+"_"+DateUtil.getSysDate()+"_"+Math.abs(new Random(100).nextInt())+".xlsx", "项目统计", titleName,sql_columns, service.projectList(m));
	
		return null;
	}
	
	/**
	 * 查询应实付数据统计
	 * 
	 * @return
	 * @author King 2014年8月1日
	 */
	@aAuth(type = aAuthType.LOGIN)
	@aDev(code = "XQ0013", email = "xugm@pqsoft.cn", name = "徐广明")
	@aPermission(name = { "数据统计", "项目报表", "应实付分析" })
	@SuppressWarnings("unchecked")
	public Reply doChartClientData() {
		String chart = null;
		Map<String, Object> param = _getParameters();
		JSONObject json=JSONObject.fromObject(param.get("param"));
		if("2".equals(json.get("REPORT_QZTX"))){
			//折线图
			//判断时间节点为全部还是时间段
			//如果为全部将其实日期和当前日期查出来
			//如果为时间段，判断系统中有输入起始日期和终止日期
			if(json!=null && json.get("REPORT_DATE")!=null && !json.get("REPORT_DATE").equals("") && json.get("REPORT_DATE").equals("1")){
				param.putAll(service.queryDateByProject());
			}
			else if(json!=null && json.get("REPORT_DATE")!=null && !json.get("REPORT_DATE").equals("") && json.get("REPORT_DATE").equals("6")){
				Map dateMap=service.queryDateByProject();
				if(json.get("START_TIME")==null || json.get("START_TIME").equals("")){
					json.put("START_TIME", dateMap.get("START_TIME"));
				}
				
				if(json.get("END_TIME")==null || json.get("END_TIME").equals("")){
					json.put("END_TIME", dateMap.get("END_TIME"));
				}
			}
			chart=new UtilChart().to_chartLine(json, "报表-应实付-分析-统计类型", "应实付分析", "paymentReport.REPORT_X_MONTH,paymentReport.CUST_REPORT_TYPE,paymentReport.showGroupClientFX","2");
			
		}else{
			//饼状图
			chart=utilChart.to_chartPie(JSONObject.fromObject( _getParameters().get("param")), "报表-应实付-统计类型", "应实付统计", "paymentReport.showGroupClientType","2");
		}
		return new ReplyAjax(true, chart,null);
	}

}
