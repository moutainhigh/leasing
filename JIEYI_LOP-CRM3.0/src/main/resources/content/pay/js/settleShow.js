//点击测算
//function calculate() {
//	var flag_ = check_();
//	if (!flag_)
//		return false;//调用验证方法
//	var data_ = $("#changePay").serialize();
//	if (getUrl_().code == 8) {//如果是不等额的需要添加些参数
//		var editData = getEditRows();
//		if (!editData) {//如果确认框选择了false则不让往下走
//			return false;
//		}
//		data_ = data_ + "&EditRows=" + JSON.stringify(editData);
//	}
//	jQuery.ajax( {
//		type : "POST",
//		dataType : "json",
//		url : _basePath + "/pay/PayTask!calculateTest.action",
//		data : data_,
//		success : function(msg) {
//			var data = msg.data.ln;
//			//把变更后的年利率赋值给input
//			//var END_YEAR_INTEREST = $("#END_YEAR_INTEREST").val(formatNumber(msg.data.END_YEAR_INTEREST * 100, '0.00'));
//			var END_YEAR_INTEREST = $("#END_YEAR_INTEREST").val(
//				formatNumber(msg.data.END_YEAR_INTEREST, '0.0000'));
//			//点击测算后下一步按钮可用
//			$('#nex_').linkbutton('enable');
//			var footer_ = [ {
//				PAY_DATE : "合计：",
//				PMTzj : totalColumn($(data), "PMTzj"),
//				zj : totalColumn($(data), "zj"),
//				bj : totalColumn($(data), "bj"),
//				lx : totalColumn($(data), "lx")
//			} ];
//			var data = {
//				flag : msg.flag,
//				total : data.length,
//				rows : data,
//				footer : footer_
//			};
//			//alert( "Data Saved: ");
//			$('#pageTable').datagrid("loadData", data);
//			$('#pageTable').datagrid( {
//				onClickRow : function(rowIndex, rowData) {
//					if (getUrl_().code == 8)
//						onClickRow_(rowIndex, rowData);
//				}
//			});
//		}
//	})
//}

//function checkRentDate() {
//	var rd = $("#RENT_DATE_ID").datebox('getValue') ;
//	if (rd !== "" && rd != null)
//		return 1 ;
//	return 0;
//}

//点击下一步（保存测试结果）
function nex_() {

	if(checkRentDate()==0){
		alert("结算日期不允许为空!") ;
		return ;
	}

	if (getUrl_().status == 6) {
		var editData = getEditRows();
		if (!editData) {//如果确认框选择了false则不让往下走
			return false;
		}
	}
	var myData = $('#pageTable').datagrid('getRows');
	var settleInfo = getFormParamFormat("changePay");
	var data_ = "myData=" + JSON.stringify(myData) + "&otherInsure="
		+ $("#otherInsure").val() + "&otherAssure="
		+ $("#otherAssure").val() + "&otherPoundage="
		+ $("#otherPoundage").val() + "&END_YEAR_INTEREST="
		+ $("#END_YEAR_INTEREST").val() + "&PAYLIST_CODE="
		+ $("#PAYLIST_CODE").val() + "&code_=" + $("#code_").val()
		+ "&status_=" + $("#status_").val() + "&settleInfo="
		+ JSON.stringify(settleInfo);
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		async : false,
		url : _basePath + "/pay/PayTask!settleSave.action",
		data : data_,
		success : function(json) {
			$.messager.alert("提示","发起流程成功！",'info',function(){
				$.messager.alert("提示",json.msg+json.data,"info",function(){
					//点击保存后下一步和测算按钮不可用
					$('#nex_').linkbutton('disable');
					$('#calculate_').linkbutton('disable');
					window.location.href = _basePath
						+ "/pay/PayTask!earlySettlementManage.action";
				});
			});
		}
	});
}

//不等额修改行
var editIndex = undefined;
function onClickRow_(index, rowData) {
	var grid_data = $('#pageTable').datagrid('getData');
	//如果是前三行或者后三行都不让修改(status!='6'提前结清的话所有期次都可以改)
	//if((index<3||index>grid_data.rows.length-4)&&getUrl_().status!='6') return false;
	//status!='6'正常结清结清的话所有期次都不能改
	if (getUrl_().status == 3)
		return false;
	if (editIndex != index) {
		if (endEditing()) {
			$('#pageTable').datagrid('selectRow', index).datagrid('beginEdit',
				index);
			editIndex = index;
		} else {
			$('#pageTable').datagrid('selectRow', editIndex);
		}
	}

}
function endEditing() {
	if (editIndex == undefined) {
		return true
	}
	if ($('#pageTable').datagrid('validateRow', editIndex)) {
		$('#pageTable').datagrid('endEdit', editIndex);
		/*手动修改了本金和利息之后自动改变相应的租金值*/
		var data_ = $('#pageTable').datagrid('getRows');
		var rows_ = data_[editIndex];
		//var rows_last =data_[editIndex-1];
		if ($.trim(rows_.bj).length <= 0) {
			rows_.bj = 0;
		}
		if ($.trim(rows_.lx).length <= 0) {
			rows_.lx = 0;
		}
		rows_.zj = formatNumber(parseFloat(rows_.bj) + parseFloat(rows_.lx),
			'0.00');
		rows_.PMTzj = formatNumber(parseFloat(rows_.bj) + parseFloat(rows_.lx),
			'0.00');
		//rows_.sybj = formatNumber(parseFloat(rows_last.sybj) - parseFloat(rows_.bj),'0.00');
		$('#pageTable').datagrid('updateRow', {
			index : editIndex,
			row : rows_
		});

		editIndex = undefined;
		return true;
	} else {
		return false;
	}
}

//不等额的时候修改了的行数
function getEditRows() {
	//var rows = $('#pageTable').datagrid('getChanges');
	var resultData = new Array();
	var rows2 = $('#pageTable').datagrid('getChanges');
	var allData = $('#pageTable').datagrid("getRows");
	$(allData).each(function() {
		var flag = false;
		if (this.lock == "yes") {
			for ( var i = 0; i < rows2.length; i++) {
				if (this.qc == rows2[i].qc) {
					flag = true;
				}
			}
			if (!flag) {
				resultData.push(this);
			}
		}
	})
	$(rows2).each(function() {
		resultData.push(this);
	})
	//console.info(resultData);
	//	if(!confirm("您共修改了"+resultData.length+"期租金,确认往下执行吗?")){
	//		return false;
	//	}
	//alert(rows2.length+' rows are changed!');
	return resultData;
}
//测算的时候验证操作
function check_() {
	if (!$("#changePay").form('validate')) {
		$.messager.show( {
			title : '操作错误提示',
			msg : '请填写带*必填项',
			showType : 'show'
		});
		return false;
	}
	if ($("#changeIssue").val().length <= 0) {
		$.messager.show( {
			title : '操作错误提示',
			msg : '请选择"开始变更期次"',
			showType : 'show'
		});
		return false;
	}
	return true;
}

function PERIODChange(obj){
	var period=$(obj).val();
	if (period == "" || period == null || period == undefined) {
		var PENALTY_RECE_CURR=$("input[name='PENALTY_RECE_CURR']").val();
		$("input[name='NO_RENT_MEONY']").val(0);
		$("input[name='NOT_INTEREST']").val(0);
		$("input[name='PENALTY_MONEYED']").val(0);
		$("input[name='BENJIN_AFTER']").val(0);
		$("input[name='PENALTY_RECE_YS']").val(PENALTY_RECE_CURR);
		$("input[name='PENALTY_RECE_JM']").val(0);
		$("input[name='PENALTY_RECE']").val(PENALTY_RECE_CURR);
		TOTALMONEY();
	}
	else{
//		var PENALTY_RECE_CURR=$("input[name='PENALTY_RECE_CURR']").val();
		var PAYLIST_CODE=$("input[name='PAYLIST_CODE']").val();
		$.ajax({
			url:_basePath+"/pay/PayTask!queryInfoByPeriod.action?PAYLIST_CODE="+PAYLIST_CODE+"&PERIOD="+period,
			type:"post",
			dataType:"json",
			success:function (data){
				$("input[name='NO_RENT_MEONY']").val(data[0].NO_RENT_MEONY);
				$("input[name='NOT_INTEREST']").val(data[0].NOT_INTEREST);
				$("input[name='RENT_DATE']").val(data[0].RENT_DATE);
				$("input[name='BENJIN_AFTER']").val(data[0].BENJIN_AFTER);
				var DUNMONEY=parseFloat(data[0].DUNMONEY);
				$("input[name='PENALTY_RECE_YS']").val(DUNMONEY);
				var JM=$("input[name='PENALTY_RECE_JM']").val();
				if(DUNMONEY >= JM){
					$("input[name='PENALTY_RECE']").val(DUNMONEY-JM);
				}
				else{
					$("input[name='PENALTY_RECE_JM']").val(0);
					$("input[name='PENALTY_RECE']").val(DUNMONEY);
				}
				exemptMoney();
			}
		});
	}
}

function TOTALMONEY(){
	var NO_RENT_MEONY = parseFloat($("input[name='NO_RENT_MEONY']").val());//(1+)结清前未收租金
	var PENALTY_RECE = parseFloat($("input[name='PENALTY_RECE']").val());//(2+)罚息金额
	var OTHER_MONEY = parseFloat($("input[name='OTHER_MONEY']").val());//(3+)其他费用
	var taxes = parseFloat($("input[name='taxes']").val());//(4+)税金
	var PENALTY_MONEYED = parseFloat($("input[name='PENALTY_MONEYED']").val());//(5+)减免后金额
	var DEPOSIT = $("input[name='DEPOSIT']").val();//(6-)保证金抵扣金额
	if (DEPOSIT == "" || DEPOSIT == null || DEPOSIT == undefined || DEPOSIT == "NaN") {
		DEPOSIT = parseFloat(0);
	}else{
		DEPOSIT = parseFloat($("input[name='DEPOSIT']").val());
	}

	var LGJ = $("input[name='LGJ']").val();//(7+)留购价
	var BENJIN_AFTER = parseFloat($("input[name='BENJIN_AFTER']").val());//(+结清后本金)
	if (LGJ == "" || LGJ == null || LGJ == undefined || LGJ == "NaN") {
		LGJ = parseFloat(0);
	}
//	alert("NO_RENT_MEONY="+NO_RENT_MEONY+"---PENALTY_RECE="+PENALTY_RECE+"---OTHER_MONEY="+OTHER_MONEY+"---taxes="+taxes+"---PENALTY_MONEYED="+PENALTY_MONEYED+"---DEPOSIT="+DEPOSIT+"---LGJ="+LGJ);
	var TOTAL_MONEY = parseFloat(NO_RENT_MEONY + PENALTY_RECE + OTHER_MONEY + taxes + PENALTY_MONEYED - DEPOSIT + LGJ + BENJIN_AFTER).toFixed(2);
	$("input[name='TOTAL_MONEY']").val(TOTAL_MONEY);
}

function DKCHANGE(){
	var STATUS = $("select[name='STATUS']").val();
	if(STATUS == 0){
		$("input[name='DEPOSIT']").removeAttr("readonly");
		var DEPOSIT_CUST = $("input[name='DEPOSIT_CUST']").val();
		if (DEPOSIT_CUST == "" || DEPOSIT_CUST == null || DEPOSIT_CUST == undefined) {
			DEPOSIT_CUST = 0;
		}
		$("input[name='DEPOSIT']").val(DEPOSIT_CUST);
	}
	else{
		$("input[name='DEPOSIT']").val(0);
		$("input[name='DEPOSIT']").attr("readonly","readonly");
	}
	TOTALMONEY();
}

function changeMoney(obj){
	var DEPOSIT=$(obj).attr("DEPOSIT");
	if (DEPOSIT == "" || DEPOSIT == null || DEPOSIT == undefined) {
		DEPOSIT=0;
	}

	var DEPOSIT_CH=$(obj).val();
	if (DEPOSIT_CH == "" || DEPOSIT_CH == null || DEPOSIT_CH == undefined) {
		$(obj).val(0);
		DEPOSIT_CH=0;
	}

	if(parseFloat(DEPOSIT_CH)>parseFloat(DEPOSIT)){
		$(obj).val(DEPOSIT);
	}

	if(parseFloat(DEPOSIT_CH)<0){
		$(obj).val(0);
	}

	TOTALMONEY();
}

function changeDunMoney(obj){
	var JM=parseFloat($(obj).val());
	var YS=parseFloat($("input[name='PENALTY_RECE_YS']").val());
	if(JM>YS){
		$(obj).val(0);
		$("input[name='PENALTY_RECE']").val(YS);
	}
	else{
		$("input[name='PENALTY_RECE']").val(YS-JM);
	}
	TOTALMONEY();
}

function exemptMoney(){
	var exemptInterest=$("input[name='exemptInterest']").val();
	if (exemptInterest == "" || exemptInterest == null || exemptInterest == undefined) {
		exemptInterest=0;
		$("input[name='exemptInterest']").val(0);
	}

	if(exemptInterest>100){
		exemptInterest=100;
		$("input[name='exemptInterest']").val(100);
	}

	if(exemptInterest<0){
		exemptInterest=0;
		$("input[name='exemptInterest']").val(0);
	}

	var NOT_INTEREST=$("input[name='NOT_INTEREST']").val();
	if (NOT_INTEREST == "" || NOT_INTEREST == null || NOT_INTEREST == undefined) {
		NOT_INTEREST=0;
	}

	var PENALTY_MONEYED = parseFloat(NOT_INTEREST)*(100- parseFloat(exemptInterest))/100;
	$("input[name='PENALTY_MONEYED']").val(PENALTY_MONEYED.toFixed(2));
	TOTALMONEY();
}


//点击下一步（保存测试结果）
function nex_New() {

	var JQ_PERIOD = $("select[name='JQ_PERIOD']").val();
	if (JQ_PERIOD == "" || JQ_PERIOD == null || JQ_PERIOD == undefined) {
		alert("请选择结清期次!") ;
		return ;
	}

	var TOTAL_MONEY = $("input[name='TOTAL_MONEY']").val();
	if(parseFloat(TOTAL_MONEY) < 0){
		alert("请修改保证金抵扣金额，合计不能小于零!") ;
	}
	if (getUrl_().status == 6) {
		var editData = getEditRows();
		if (!editData) {//如果确认框选择了false则不让往下走
			return false;
		}
	}
	var myData = $('#pageTable').datagrid('getRows');
	var settleInfo = getFormParamFormat("changePay");
	var data_ = "myData=" + JSON.stringify(myData)+ "&OTHER_MONEY="
		+ $("input[name='OTHER_MONEY']").val()+ "&taxes="
		+ $("input[name='taxes']").val()  + "&PAYLIST_CODE="
		+ $("#PAYLIST_CODE").val() + "&code_=" + $("#code_").val()
		+ "&status_=" + $("#status_").val() + "&settleInfo="
		+ JSON.stringify(settleInfo);
	jQuery.ajax( {
		type : "POST",
		dataType : "json",
		async : false,
		url : _basePath + "/pay/PayTask!settleSave.action",
		data : data_,
		success : function(resp) {
			if(resp.flag){
				$.messager.alert("提示","发起流程成功！",'info',function(){
					$.messager.alert("提示",resp.msg + resp.data,"info",function(){
						//点击保存后下一步和测算按钮不可用
						$('#nex_').linkbutton('disable');
						//$('#calculate_').linkbutton('disable');
						window.location.href = _basePath + "/pay/PayTask!earlySettlementManage.action";
					});
				});
			}else{
				$.messager.alert("提示", resp.msg);
			}
		}
	});
}
