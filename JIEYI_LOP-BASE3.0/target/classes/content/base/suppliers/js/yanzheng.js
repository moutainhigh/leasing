//验证身份证号码
function isCardNo(ele,id_card_type){ 		
	var card = $("#"+ele).val();
	if(id_card_type=="1"){//驗證是否是居民身份證//若果是居民身份證則驗證身份證是否填寫正確
		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
	    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
	    if(reg.test(card) === false){  
	        alert("身份证输入不合法");  
	        $("#"+ele).val("");
	        return  false;  
	    }else{
	    	var bornDate = cardNo2bornDate(card);
	    	if(ele=='ID_CARD_NO' &&bornDate!=null&&bornDate!='') {
				$('#BIRTHDAY').datebox('setValue',bornDate);
	    	} else if(ele=='SPOUDT_ID_CARD_NO' &&bornDate!=null&&bornDate!=''){
	    		$('#SPOUST_BIRTHDAY').datebox('setValue',bornDate);
	    	}
	    	return true;
	    } 
	}else {
		alert("证件类号为港澳台通行证或护照");
		return true;
	}  
}

function validForm(formId) {
	var flag = false;
	$("#"+formId+" :text").each(function(){
		if($(this).val()) {
			flag = true;
			return false;
		}
	});
	if(!flag) alert("请填写相关信息");
	return flag;
}

function clearForm(formId) {
	$("#"+formId+" :text,textarea").val("");
}

function isCardNoRight(cardNo) {
	// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
    if(reg.test(cardNo) === false){  
        return  false;  
    }else{
    	return true;
    } 
}

function cardNo2bornDate(cardNo) {
	if(cardNo.length==18){
		var str1 = cardNo.substr(6,8);
		var year = str1.substr(0,4);
		var month = str1.substr(4,2);
		var day = str1.substr(6);
		return year + '-' + month + '-' + day;
	}else if(cardNo.length==15){
		var str1 = cardNo.substr(6,6);
		var year = str1.substr(0,2);
		var month = str1.substr(2,2);
		var day = str1.substr(4);
		
		var today = new Date();
		var myDate=new Date();
		myDate.setFullYear("20"+year,month,day);
		if(myDate>today){
			year="19"+year;
		}else{
			year="20"+year;
		}
		return year + '-' + month + '-' + day;
	}else
		return '';
}

//Email验证
function isValidMail(val){
	var reMail = /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/i;
	if(!reMail.test(value))
	{
		alert("输入的Email有误"); 
        return false; 
	}
	return true;
}

/**
 * 手机号码验证 [不带空格]
 * @param ele: 节点id名称
 * @author yx
 * @date 2013-11-29
 **/
 function isMobilephone(ele){
	 var tel = $("#"+ele).val();
	 var reg = /(^0?[1][358][0-9]{9}$)/;
	 if(reg.test(tel) == false){
		 alert("请输入有效的手机号码！");  
		 $("#"+ele).val("");
		 return false; 
	 }else{
		 return true;
	 }
 }
 
 /**
  * 有效的电话号码验证[不带空格]
  * @param ele: 节点id名称
  * @return
  * @author yx
  * @date 2013-11-29
  */
 function isPhoneNo(ele){
	 var tel = $("#"+ele).val();
	 var reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)/;
	 if(reg.test(tel) == false){
		 alert(" 请输入有效的电话号码,如:010-29292929.");  
		 $("#"+ele).val("");
		 return false; 
	 }else{
		 return true;
	 }
 }
 
 /**
  * 有效的邮编验证[不带空格]
  * @param ele: 节点id名称
  * @return
  * @author yx
  * @date 2013-11-29
  */
 function isZipcode(ele){
	 var code = $("#"+ele).val();
	 var reg = /^[0-9]\d{5}$/;
	 if(reg.test(code) == false){
		 alert("请输入有效的邮政编码.");  
		 $("#"+ele).val("");
		 return false; 
	 }else{
		 return true;
	 }
 }
  
 /**
  * 有效的传真验证[不带空格]
  * @param ele: 节点id名称
  * @return
  * @author yx
  * @date 2013-11-29
  */
function isFax(ele){
	var fax = $("#"+ele).val();
	var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
	 if(reg.test(fax) == false){
		 alert("请输入有效的传真号码,如:010-29292929.");  
		 $("#"+ele).val("");
		 return false; 
	}else{
		 return true;
	}
}
  
  
/**
 * 有效的组织机构代码证验证[不带空格]
 * @param ele: 节点id名称
 * @return
 * @author yx
 * @date 2013-11-29
 */
function isOragnizationCode(ele){
	var OragnizationCode = $("#"+ele).val();
	var reg = /^([0-9]{8}\-)?([0-9]{1})$/;
	 if(reg.test(OragnizationCode) == false){
		 alert("请输入有效组织机构代码证号.");  
		 $("#"+ele).val("");
		 return false; 
	}else{
		 return true;
	}  
}

/**
 * 有效的数字验证,可以带小数[不带空格]
 * @param ele: 节点id名称
 * @return
 * @author yx
 * @date 2013-11-29
 */
function zpyNumber(ele){
	var number = $("#"+ele).val();
	var reg = /^[0-9]{1}[0-9\,\.]*?$/;
	 if(reg.test(number) == false){
		 alert("请输入数字.");  
		 $("#"+ele).val("");
		 return false; 
	}else{
		 return true;
	}
}

/**
 * 有效的数字验证[不带空格]
 * @param ele: 节点id名称
 * @return
 * @author yx
 * @date 2013-11-29
 */
function zpyIntNumber(ele){
	var IntNumber = $("#"+ele).val();
	var reg = /^[0-9]{1}[0-9]*?$/;
	if(reg.test(IntNumber) == false){
		 alert("请输入整数.");  
		 $("#"+ele).val("");
		 return false; 
	}else{
		 return true;
	}
}
 
 