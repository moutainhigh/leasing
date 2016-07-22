//package com.pqsoft.T4Report.action;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.apache.velocity.VelocityContext;
//
//import net.sf.json.JSONObject;
//
//import com.pqsoft.dataDictionary.service.DataDictionaryMemcached;
//import com.pqsoft.superTable.service.ReportBaseService;
//import com.pqsoft.skyeye.VM;
//import com.pqsoft.skyeye.api.Action;
//import com.pqsoft.skyeye.api.Reply;
//import com.pqsoft.skyeye.api.ReplyAjax;
//import com.pqsoft.skyeye.api.ReplyAjaxPage;
//import com.pqsoft.skyeye.api.ReplyHtml;
//import com.pqsoft.skyeye.dev.aDev;
//import com.pqsoft.skyeye.rbac.api.Security;
//import com.pqsoft.skyeye.rbac.api.aAuth;
//import com.pqsoft.skyeye.rbac.api.aPermission;
//import com.pqsoft.util.POIExcelUtil;
//
//
///**
// * <p>
// * Title: 融资租赁信息系统平台 数据统计  T404厂商台量统计
// * </p>
// * <p>
// * Description: T1租金查询
// * </p>
// * <p>
// * Company: 平强软件
// * </p>
// * 
// * @author 吴剑东 wujd@pqsoft.cn
// * @version 1.0
// */
//public class T404ReportAction extends Action {
//	private ReportBaseService service = new ReportBaseService();
//	Map<String,Object> m = null;
//	
//	String[] titlesName = new String[]{"编号",	"厂商名称",	"当前在租总台量",	"当前留购总台量",	"当前回购总台量",	"查看系列统计 "};
//	
//	
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "列表页面" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	@Override
//	@SuppressWarnings("unchecked")
//	public Reply execute() {
//		m = _getParameters();
//		VelocityContext context = new VelocityContext();
//		m.put("USER_CODE", Security.getUser().getCode());
//		m.put("REPORT_NAME", "T404Report");
//		context.put("COLUMN_NAMES",service.queryReportColumnByReportAndUser(m));
//		
//		List<Map<String, Object>> productTypeList = new DataDictionaryMemcached().get("产品类型");
//		context.put("productTypeList",productTypeList);
//		List<Map<String, Object>> repayTypeList = new DataDictionaryMemcached().get("还款政策");
//		context.put("repayTypeList",repayTypeList);
//		List<Map<String, Object>> projectTypeList = new SysDictionaryMemcached().get("项目状态位");
//		context.put("projectTypeList",projectTypeList);
//		
//		List<Map<String, Object>> columnList = new ArrayList<Map<String,Object>>();
//		for (int i = 0; i < titlesName.length; i++) {
//			Map<String,Object> colMap = new HashMap<String, Object>();
//			colMap.put("FLAG",titlesName[i]);
//			columnList.add(colMap);
//		}
//		context.put("columnList",columnList);
//		
//		return new ReplyHtml(VM.html("T4Report/T404Report.vm", context));
//	}
//	
//	
//	@SuppressWarnings("unchecked")
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "列表数据" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	public Reply doTableShow(){
//		m = _getParameters();
//		m.put("USER_CODE", Security.getUser().getCode());
//		
//		JSONObject json = JSONObject.fromObject(m.get("searchParams"));
//		m.remove("searchParams");
//		m.putAll(json);
//		
//		m.put("REPORT_NAME", "T404Report");
//		//判断是否定制显示字段 如果配置则保存配置并使用 否则查询配置历史
//		if(m.get("COLUMN_NAMES") != null){
//			service.delReportColumnByReportAndUser(m);
//			service.insertReportColumnByReportAndUser(m);
//		}
//		m.put("COLUMN_NAMES",service.queryReportColumnByReportAndUser(m));
//		if(m.get("COLUMN_NAMES") == null || m.get("COLUMN_NAMES") == ""){
//			m.put("COLUMN_NAMES","*");
//		}else{
//			m.put("COLUMN_NAMES",m.get("COLUMN_NAMES").toString()+",ID");
//		}
//
//		m.put("V_NAME", "V_REPORT_T404");
//		return new ReplyAjaxPage(service.getTableData(m));
//	}
//	@SuppressWarnings("unchecked")
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "列表导出" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	public void exportExcel(){
//		m = _getParameters();
//		JSONObject json = JSONObject.fromObject(m.get("searchParams"));
//		m.remove("searchParams");
//		
//		m.putAll(json);
//		//查询导出字段
//		String[] titleName = null;
//		int[] titleIndex = null;
//		
//		m.put("USER_CODE", Security.getUser().getCode());
//		m.put("REPORT_NAME", "T404Report");
//		m.put("COLUMN_NAMES",service.queryReportColumnByReportAndUser(m));
//		//判断是否全部导出
//		if(m.get("COLUMN_NAMES") == null || m.get("COLUMN_NAMES") == ""){
//			m.put("COLUMN_NAMES","*");
//			titleName = titlesName;
//			titleIndex = new int[titlesName.length];
//			for (int i = 0; i < titlesName.length; i++) {
//				titleIndex[i] = i+1;
//			}
//		}else{
//			String[] arr = m.get("COLUMN_NAMES").toString().split(",");
//			titleName = new String[arr.length];
//			titleIndex = new int[arr.length];
//			for (int i = 0; i < arr.length; i++) {
//				int j = Integer.parseInt(arr[i].replace("COLUMN", ""));
//				titleName[i] = titlesName[j-1];
//				titleIndex[i] = j;
//			}
//		}
//
//		m.put("V_NAME", "V_REPORT_T404");
//		
//		new POIExcelUtil().expExcel2007(m,"T404厂商台量统计.xlsx", "T404厂商台量统计", titleName , titleIndex, service.getTableDataForExp(m));
//	}
//	
//	
//	
//	/*   *********************          子页面             **************************   */
//	String[] titlesNameSon = new String[]{};
//	
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "动态列" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	@SuppressWarnings("unchecked")
//	public String editTitles(){
//		String sqlStr = " MAX(XM.AREA_NAME) COLUMN1, MAX(XM.SUP_SHORTNAME) COLUMN2 ";
//		List<Map<String, Object>> catentNameList = service.getCatentNameByComId(m);
//		String[] titlesNameNew = new String[catentNameList.size()+3];
//		titlesNameNew[0]="区域";
//		titlesNameNew[1]="供应商";
//		for (int i = 0; i < catentNameList.size(); i++) {
//			Map<String,Object> colMap = catentNameList.get(i);
//			String CATENA_NAME = colMap.get("CATENA_NAME").toString();
//			sqlStr += " , SUM(CASE  WHEN XL.CATENA_NAME = '"+CATENA_NAME+"' THEN SB.AMOUNT ELSE 0 END) COLUMN"+(i+3);
//			titlesNameNew[i+2]=CATENA_NAME;
//		}
//		sqlStr += " , NVL(SUM(SB.AMOUNT),0) COLUMN"+(3+catentNameList.size());
//		titlesNameNew[2+catentNameList.size()]="合计";
//		titlesNameSon = titlesNameNew;
//		return sqlStr;
//	}
//	
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "列表页面" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	@SuppressWarnings("unchecked")
//	public Reply executeSon() {
//		m = _getParameters();
//		VelocityContext context = new VelocityContext();
//		m.put("USER_CODE", Security.getUser().getCode());
//		m.put("REPORT_NAME", "T404Report");
//		this.editTitles();
//		
//		List<Map<String, Object>> productTypeList = new DataDictionaryMemcached().get("产品类型");
//		context.put("productTypeList",productTypeList);
//		List<Map<String, Object>> repayTypeList = new DataDictionaryMemcached().get("还款政策");
//		context.put("repayTypeList",repayTypeList);
//		List<Map<String, Object>> projectTypeList = new SysDictionaryMemcached().get("项目状态位");
//		context.put("projectTypeList",projectTypeList);
//		
//		List<Map<String, Object>> columnList = new ArrayList<Map<String,Object>>();
//		for (int i = 0; i < titlesNameSon.length; i++) {
//			Map<String,Object> colMap = new HashMap<String, Object>();
//			colMap.put("FLAG",titlesNameSon[i]);
//			columnList.add(colMap);
//		}
//		context.put("columnList",columnList);
//		
//		return new ReplyHtml(VM.html("T4Report/T404ReportSon.vm", context));
//	}
//	
//	
//	@SuppressWarnings("unchecked")
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "列表数据" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	public Reply doTableShowSon(){
//		m = _getParameters();
//		m.put("USER_CODE", Security.getUser().getCode());
//		JSONObject json = JSONObject.fromObject(m.get("searchParams"));
//		m.remove("searchParams");
//		m.putAll(json);
//		
//		m.put("REPORT_NAME", "T404Report");
//
//		
//		m.put("COLUMN_NAMES",this.editTitles());
//		
//		return new ReplyAjaxPage(service.getT404SONTableData(m));
//	}
//	@SuppressWarnings("unchecked")
//	@aAuth(type = aAuth.aAuthType.USER)
//	@aPermission(name = { "数据统计", "T404厂商台量统计", "列表导出" })
//	@aDev(code = "170062", email = "wujd@pqsoft.cn", name = "吴剑东")
//	public ReplyAjax exportExcelSon() {
//		m = _getParameters();
//		this.editTitles();
//		JSONObject json = JSONObject.fromObject(m.get("searchParams"));
//		m.remove("searchParams");
//		m.putAll(json);
//		// 查询导出字段
//		String[] titleName = null;
//		int[] titleIndex = null;
//
//		m.put("USER_CODE", Security.getUser().getCode());
//		m.put("REPORT_NAME", "T404Report");
//
//		m.put("COLUMN_NAMES", this.editTitles());
//		titleName = titlesNameSon;
//		titleIndex = new int[titlesNameSon.length];
//		for (int i = 0; i < titlesNameSon.length; i++) {
//			titleIndex[i] = i + 1;
//		}
//
//		m.put("V_NAME", "V_REPORT_T404");
//
//		new POIExcelUtil().expExcel2007(m, "T404厂商台量统计.xlsx", "T404厂商台量统计",
//				titleName, titleIndex, service.getT404SONTableDataForExp(m));
//
//		return null;
//	}
//	
//	
//
//}
