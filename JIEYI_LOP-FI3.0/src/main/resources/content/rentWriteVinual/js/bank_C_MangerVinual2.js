$(document).ready(function(){
	 $('#bank_C_PageTable').datagrid({ 
         onLoadSuccess: function (data) {
		 	onChangeSelect();
         }
	 });
	 
	 $('#bank_C_PageTable').datagrid({ onClickRow:
         function () {
		 	onChangeSelect();
         }
     });
});


function dd(){
$("#bank_C_PageTable").datagrid({
		pagination:true,//是否分页 true为是
		rownumbers:true,//左侧自动显示行数
		fitColumns:true,
		fit:true,
		pageSize:50,
		pageList:[10,20,50,100,200,500,1000,1500],
		toolbar:'#pageForm',
		onClickCell:onClickCell,
		url:'rentWriteVinual!Bank_C_PageAjax.action',
		onSelect: function(rowIndex, rowData){
			if(!$("input[type='checkbox']")[rowIndex+1].disabled){
				changeOne(rowIndex, rowData);
			}
			onChangeSelect();
		},
		onUnselect: function(rowIndex, rowData){
			onChangeSelect();
		},
		onSelectAll: function(rowIndex, rowData){
			onChangeSelect();
		},
		onUnselectAll: function(rowIndex, rowData){
			onChangeSelect();
		},
		columns:[[
		          	{field:'ID',checkbox:true,width:100},
		          	{field:'LOCKNAME',title:'锁状态',width:10},
		          	{field:'LEASE_CODE',title:'合同编号',width:20},
	                {field:'CUSTNAME',title:'客户名称',width:20},
		          	{field:'COMPANY_NAME',title:'厂商',width:20},
		          	{field:'SUPPLIERS_NAME',title:'供应商',width:20},
		          	{field:'PRODUCT_NAME',title:'租赁物',width:15},
		          	{field:'PAYLIST_CODE',title:'还款计划',width:20},
		          	{field:'BEGINNING_NAME',title:'款项名称',width:10},
		          	{field:'BEGINNING_NUM',title:'期次',width:5},
		          	{field:'BEGINNING_RECEIVE_DATA',title:'计划收取日期',width:15},
		          	{field:'BEGINNING_MONEY',title:'本次应付金额',width:15},
		          	{field:'ITEM_FLAG',hidden:true},
		          	{field:'CUST_ID',hidden:true},
		          	{field:'SUP_ID',hidden:true},
		          	{field:'MONEY_FLAG',hidden:true}
		         ]]
	});

}





function onChangeSelect()
{
	var datagridList=$("#bank_C_PageTable").datagrid('getSelections');
	var pages=$(".pagination-num").val();
	var rowss=$(".pagination-page-list").val();
	
	var BEGINNING_MONEYAll=0;
	var PAID_MONEYAll=0;
	var NUM=0;
	
	for(var i = 0; i < datagridList.length; i++)
	{
		var jj=datagridList[i].ROWNO-(pages-1)*rowss;
		if(!$("input[type='checkbox']")[jj].disabled){
			var BEGINNING_MONEY=datagridList[i].BEGINNING_MONEY;
			BEGINNING_MONEYAll=fomatFloat(accAdd(BEGINNING_MONEYAll,BEGINNING_MONEY),2);
			NUM++;
		}
	}
	$("#FI_REALITY_MONEY").val(BEGINNING_MONEYAll);
	$("#FI_PROJECT_NUM").val(NUM);
	$("#FI_PAY_MONEY").val(BEGINNING_MONEYAll);
}

function onChangeSelectAll(rows){
	var BEGINNING_MONEYAll=0;
	var PAID_MONEYAll=0;
	var NUM=0;
	
	for(var i = 0; i < rows.length; i++)
	{
		if(!$("input[type='checkbox']")[i].disabled){
			var BEGINNING_MONEY=rows[i].BEGINNING_MONEY;
			BEGINNING_MONEYAll=fomatFloat(accAdd(BEGINNING_MONEYAll,BEGINNING_MONEY),2);
			NUM++;
		}
		else{
			$('#bank_C_PageTable').datagrid('unselectRow', i);
		}
	}
	$("#FI_REALITY_MONEY").val(BEGINNING_MONEYAll);
	$("#FI_PROJECT_NUM").val(NUM);
	$("#FI_PAY_MONEY").val(BEGINNING_MONEYAll);
}

function changeOne(rowIndex, rowData){
	var DataList=$('#bank_C_PageTable').datagrid('getRows');
	if(rowIndex==DataList.length-1){
		;
	}
	else{
		var PAYLIST_CODE=rowData.PAYLIST_CODE;
		var payList_code1=DataList[rowIndex+1].PAYLIST_CODE;
		if(PAYLIST_CODE==payList_code1){
			$("input[type='checkbox']")[rowIndex+2].disabled = false;
		}
	}
}

function changeNotOne(rowIndex, rowData){
	var DataList=$('#bank_C_PageTable').datagrid('getRows');
	if(rowIndex==DataList.length-1){
		;
	}
	else{
		var PAYLIST_CODE=rowData.PAYLIST_CODE;
		for(var num=rowIndex+1;num<DataList.length;num++){
			var payList_code1=DataList[num].PAYLIST_CODE;
			if(PAYLIST_CODE==payList_code1){
				
				$("input[type='checkbox']")[num+1].disabled = true;
				 $('#bank_C_PageTable').datagrid('unselectRow', num);
			}
		}
	}
}

var disNum=0;


/********************************************************以下为设置单元格可修改***齐江龙********************************************************************************/
$.extend($.fn.datagrid.methods, {
	editCell : function(jq, param) {
		if(disNum==1){
			disNum=0;
			return jq.each(function() {
					var opts = $(this).datagrid('options');
					var fields = $(this).datagrid('getColumnFields', true).concat($(this).datagrid('getColumnFields'));
					for ( var i = 0; i < fields.length; i++) {
						var col = $(this).datagrid('getColumnOption', fields[i]);
						col.editor1 = col.editor;
						if (fields[i] != param.field) {
							col.editor = null;
						}
					}
					$(this).datagrid('beginEdit', param.index);
					for ( var i = 0; i < fields.length; i++) {
						var col = $(this).datagrid('getColumnOption', fields[i]);
						col.editor = col.editor1;
					}
			});
		}
	}
});

var editIndex = undefined;

function onClickCell(index, field) {
	if(!$("input[type='checkbox']")[index+1].disabled){
		disNum=1;
		$('#bank_C_PageTable').datagrid('endEdit', index);
		$('#bank_C_PageTable').datagrid('editCell', {index : index,field : field});
		editIndex=index;
		onChangeSelect();
	}
	else{

		if(editIndex != undefined){
			$('#bank_C_PageTable').datagrid('endEdit', editIndex);
			editIndex=undefined;
		}
	}
}


function toRefer(){
	$.ajax({		
		url:_basePath+"/rentWrite/rentWriteNew!CreateJoinFundDate.action",
	    type:'post',
	    dataType:'json',
	    success:function(json){
		 if(json.flag == true){
			 $.messager.alert("提示","同步成功！！");	
			//页面刷新
		 }else{
			 $.messager.alert("提示","同步失败！！");			 
		 }
		
		}
	});
}

/********************************************************以上为设置单元格可修改***齐江龙********************************************************************************/


//非网银-创建结算单
function creatNotBankFund()
{
	var datagridList=$('#bank_C_PageTable').datagrid('getChecked');
	if(datagridList.length<=0)
	{
		alert("请先选择要数据在继续申请操作！");
		return false;
	}
	
	var IDS="";
	var IDS1="";
	var IDS2="";
	var IDS3="";
	var IDS4="";
	var IDS5="";
	var IDS6="";
	var hh=0;
	var aa=0;
	for(var i = 0; i < datagridList.length; i++){
		hh++;
		if(hh==1){
			if(aa==0){
				IDS=datagridList[i].ID;
			}
			else if(aa==1){
				IDS1=datagridList[i].ID;
			}
			else if(aa==2){
				IDS2=datagridList[i].ID;
			}
			else if(aa==3){
				IDS3=datagridList[i].ID;
			}
			else if(aa==4){
				IDS4=datagridList[i].ID;
			}
			else if(aa==5){
				IDS5=datagridList[i].ID;
			}
			else if(aa==6){
				IDS6=datagridList[i].ID;
			}
		}
		else{
			if(aa==0){
				IDS=IDS+","+datagridList[i].ID;
			}
			else if(aa==1){
				IDS1=IDS1+","+datagridList[i].ID;
			}
			else if(aa==2){
				IDS2=IDS2+","+datagridList[i].ID;
			}
			else if(aa==3){
				IDS3=IDS3+","+datagridList[i].ID;
			}
			else if(aa==4){
				IDS4=IDS4+","+datagridList[i].ID;
			}
			else if(aa==5){
				IDS5=IDS5+","+datagridList[i].ID;
			}
			else if(aa==6){
				IDS6=IDS6+","+datagridList[i].ID;
			}
		}
		if(hh==300){
			aa++;
			hh=0;
		}
	}
	
	$.ajax({
		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS,
	    type:'post',
	    dataType:'json',
	    success:function(json){
		    if(json.data == '2'){
		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
		    }
		    else if(json.data == '3'){
		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
		    }
		    else{
		    	if(IDS1.length>0){
		    		$.ajax({
			    		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS1,
			    	    type:'post',
			    	    dataType:'json',
			    	    success:function(json){
			    		    if(json.data == '2'){
			    		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
			    		    }
			    		    else if(json.data == '3'){
			    		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
			    		    }
			    		    else{
			    		    	if(IDS2.length>0){
			    		    		$.ajax({
			    			    		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS2,
			    			    	    type:'post',
			    			    	    dataType:'json',
			    			    	    success:function(json){
			    			    		    if(json.data == '2'){
			    			    		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
			    			    		    }
			    			    		    else if(json.data == '3'){
			    			    		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
			    			    		    }
			    			    		    else{
			    			    		    	if(IDS3.length>0){
			    			    		    		$.ajax({
			    			    			    		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS3,
			    			    			    	    type:'post',
			    			    			    	    dataType:'json',
			    			    			    	    success:function(json){
			    			    			    		    if(json.data == '2'){
			    			    			    		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
			    			    			    		    }
			    			    			    		    else if(json.data == '3'){
			    			    			    		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
			    			    			    		    }
			    			    			    		    else{
			    			    			    		    	if(IDS4.length>0){
			    			    			    		    		$.ajax({
			    			    			    			    		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS4,
			    			    			    			    	    type:'post',
			    			    			    			    	    dataType:'json',
			    			    			    			    	    success:function(json){
			    			    			    			    		    if(json.data == '2'){
			    			    			    			    		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
			    			    			    			    		    }
			    			    			    			    		    else if(json.data == '3'){
			    			    			    			    		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
			    			    			    			    		    }
			    			    			    			    		    else{
			    			    			    			    		    	if(IDS5.length>0){
			    			    			    			    		    		$.ajax({
			    			    			    			    			    		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS5,
			    			    			    			    			    	    type:'post',
			    			    			    			    			    	    dataType:'json',
			    			    			    			    			    	    success:function(json){
			    			    			    			    			    		    if(json.data == '2'){
			    			    			    			    			    		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
			    			    			    			    			    		    }
			    			    			    			    			    		    else if(json.data == '3'){
			    			    			    			    			    		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
			    			    			    			    			    		    }
			    			    			    			    			    		    else{
			    			    			    			    			    		    	if(IDS6.length>0){
			    			    			    			    			    		    		$.ajax({
			    			    			    			    			    			    		url:_basePath+"/rentWrite/rentWriteNew!LockTypeIsF.action?IDS="+IDS6,
			    			    			    			    			    			    	    type:'post',
			    			    			    			    			    			    	    dataType:'json',
			    			    			    			    			    			    	    success:function(json){
			    			    			    			    			    			    		    if(json.data == '2'){
			    			    			    			    			    			    		    	return $.messager.alert("锁定提示","数据已锁定，请等待解锁后在操作！");
			    			    			    			    			    			    		    }
			    			    			    			    			    			    		    else if(json.data == '3'){
			    			    			    			    			    			    		    	return $.messager.alert("锁定提示","您所选择的数据已经被操作过,请刷新页面在操作！");
			    			    			    			    			    			    		    }
			    			    			    			    			    			    		    else{
			    			    			    			    			    			    		    	method();
			    			    			    			    			    			    		    }
			    			    			    			    			    			    	    }
			    			    			    			    			    			    	});
			    			    			    			    			    		    	}
			    			    			    			    			    		    	else{
			    			    			    			    			    		    		method();
			    			    			    			    			    		    	}
			    			    			    			    			    		    	
			    			    			    			    			    		    }
			    			    			    			    			    	    }
			    			    			    			    			    	});
			    			    			    			    		    	}
			    			    			    			    		    	else{
			    			    			    			    		    		method();
			    			    			    			    		    	}
			    			    			    			    		    	
			    			    			    			    		    }
			    			    			    			    	    }
			    			    			    			    	});
			    			    			    		    	}
			    			    			    		    	else{
			    			    			    		    		method();
			    			    			    		    	}
			    			    			    		    	
			    			    			    		    }
			    			    			    	    }
			    			    			    	});
			    			    		    	}
			    			    		    	else{
			    			    		    		method();
			    			    		    	}
			    			    		    	
			    			    		    }
			    			    	    }
			    			    	});
			    		    	}
			    		    	else{
			    		    		method();
			    		    	}
			    		    	
			    		    }
			    	    }
			    	});
		    	}
		    	else{
		    		method();
		    	}
		    	
		    	
		    }
	    }
	})
	
}

function method(){
	var datagridList=$('#bank_C_PageTable').datagrid('getChecked');
	
	var FI_PAY_DATE=$("input[name='FI_PAY_DATE']").val();
	if(FI_PAY_DATE==null || FI_PAY_DATE==undefined || FI_PAY_DATE.length<=0){
		return $.messager.alert('警告','请填写付款日期');
	}
	
	var FI_FAG=$("select[name='FI_FAG']").val();
	
	if(FI_FAG=='16')
	{
		var BANK_NAME = $("input[name='BANK_NAME']").val();
		var BANK_ACCOUNT = $("input[name='BANK_ACCOUNT']").val();
		 if(BANK_NAME == "" || BANK_NAME == undefined || BANK_NAME.length<=0){
			 alert("请输入持卡人！");
			 return false;
		 }
		 
		 if(BANK_ACCOUNT == "" || BANK_ACCOUNT == undefined || BANK_ACCOUNT.length<=0){
			 alert("输入持卡账号！");
			 return false;
		 }
	}
	var selectData = [];
	for(var i = 0; i < datagridList.length; i++)
	{
		var temp={};
		temp.PAYLIST_CODE=datagridList[i].PAYLIST_CODE;
		temp.BEGINNING_NUM=datagridList[i].BEGINNING_NUM;
		temp.ITEM_FLAG=datagridList[i].ITEM_FLAG;
		temp.PAID_MONEY=datagridList[i].BEGINNING_MONEY;
		selectData.push(temp);
	}
	$("#seachBut").linkbutton("disable");
	$("#emptyBut").linkbutton("disable");
	$("#submitBut").linkbutton("disable");
	$("#historyBut").linkbutton("disable");
	var dataJson ={selectData:selectData};
	$("#selectDateHidden").val(JSON.stringify(dataJson));
	$("#formSerach").submit();
}

/**
 * 加法
 * @param arg1
 * @param arg2
 * @return
 */
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
    try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

function fomatFloat(src,pos){       
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);       
} 
