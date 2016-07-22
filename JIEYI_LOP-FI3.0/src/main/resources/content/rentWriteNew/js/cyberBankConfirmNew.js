$(document).ready(function(){
	$('#uploadDialog').dialog({closed : true});
	
	$("#cyberBankPageTable").datagrid({
		pagination:true,//是否分页 true为是
		rownumbers:true,//左侧自动显示行数
		toolbar:'#pageForm',
		url:'rentWriteNew!cyberConfirm_PageAjax.action',
		columns:[[
		          	{field:'ID',checkbox:true,width:50},
		          	{field:'ID_CARD_NO',title:'客户身份证号',width:150},
		          	{field:'ACCOUNT_NAME',title:'开户名',width:100},
		          	{field:'BANK_NAME',title:'开户银行',width:100},
		          	{field:'BANK_ACCOUNT',title:'客户账号',width:100},
		          	{field:'BEGINNING_MONEY',title:'金额',width:100},
		          	{field:'PRO_CODE',title:'项目编号',width:100,formatter:function(value,rowData,rowIndex){
	                	  return "<a href='#'>"+rowData.PRO_CODE+"</a>";
	                  }},
	                  {field:'PAYLIST_CODE',title:'还款计划',width:150}, 
		          	{field:'BEGINNING_NUM',title:'期次',width:50},
		          	{field:'BEGINNING_RECEIVE_DATA',title:'计划收取日',width:150},
		          	{field:'BEGINNING_NAME',title:'类别',width:70},
		          	{field:'BEGINNING_STATUS',title:'状态',width:100},
		          	{field:'BEGINNING_FALSE_REASON',title:'失败原因',width:170},
		          	{field:'ITEM_FLAG',hidden:true},
		          	{field:'CUSTNAME',hidden:true},
		          	{field:'CUST_ID',hidden:true},
		          	{field:'CUST_NAME',hidden:true}
		         ]]
	});
});

function resultData(){
	top.addTab("回执查询结果",_basePath+"/rentWrite/rentWriteNew!cyberBank_Result_Manger.action?FILE_STATUS=0");
}

function emptyData(){
	$('#pageForm').form('clear');
	$(".paramData").each(function(){
		$(this).val("");
	});
}

function rollback(){
	var datagridList=$('#cyberBankPageTable').datagrid('getChecked');
	if(datagridList.length<=0)
	{
		alert("请先选择要数据在继续重置操作！");
		return false;
	}
	
	$.messager.confirm("提示","您确认要重置选中的数据？",function(flag){
		if(flag){
			var datagridList=$('#cyberBankPageTable').datagrid('getChecked');
			var IDS="";
			var selectData = [];
			for(var i = 0; i < datagridList.length; i++)
			{
				if(i==0)
				{
					IDS=datagridList[i].ID;
				}
				else
				{
					IDS=IDS+","+datagridList[i].ID;
				}
				
			}
			$("#IDS").val(IDS);
			$("#formRoll").submit();
		}
	});
	
}


//上传回执
function uploadExcel(){
	var datagridList=$('#cyberBankPageTable').datagrid('getRows');
	if(datagridList.length == 0)
	{
		$.messager.alert("提示","没有待确认数据!");
	}
	var url = "rentWriteNew!uploadExcel.action";

	var bank_type = "";
	var fromDate = "";
	var fileN="";
	
	var filename = $('#uploadFile').val();
	fileN=filename;
	$('#uploadDialog').dialog({
		title : '上传回执',
		width : 400,
		height : 170,
		closed : true,
		cache : false,
		modal : true,
		closed : false,
		buttons : 
			[{
				text : '上传',
				iconCls : 'icon-up',
				handler : function()
					{
							$('#fileUploadForm').form('submit',
								{
                                    onSubmit: function()
									{
										
										bank_type = $('#bankFlag').combobox("getValue");
										fromDate = $('#fromDate').datebox("getValue");
										if($('#uploadFile').val().indexOf('.xls') == -1 &&  (bank_type =="JSYHEXCEL" || bank_type =="TLTBZEXCEL" || bank_type =="KQDKEXCEL"))
										{
//											$.messager.alert('提示','建设银行请上传.xls结尾的文件!','');
//											$.messager.alert('提示','EXCEL请上传.xls结尾的文件!','');
											$.messager.alert('提示','请上传.xls结尾的文件!','');
											return false;
										}
										if($('#uploadFile').val().indexOf('.txt') == -1 &&  (bank_type =="MSYHTXT" || bank_type =="TLTBZTXT" || bank_type =="JSYHTXT" || bank_type =="GDYHDK"))
										{
//											$.messager.alert('提示','民生银行请上传.txt结尾的文件!','');
//											$.messager.alert('提示','TXT请上传.txt结尾的文件!','');
											$.messager.alert('提示','请上传.txt结尾的文件!','');
											return false;
										}
										  
                                    },
                                    url:url+"?bankFlag="+$('#bankFlag').combobox("getValue")+"&fromDate="+$('#fromDate').datebox("getValue")+"&fileN="+$('#uploadFile').val(),
                					success:function(data)
									{
                					 	var data = eval('(' + data + ')');
                						$.messager.alert('',data.msg,'');
										$('#uploadDialog').dialog('close');
                					}
                            });
                        
        			}
			},
			{
				text : '关闭',
				iconCls : 'icon-cancel',
				handler : function()
				{
					$('#uploadDialog').dialog('close');
				}
			}]
	});
}