/**
 * check 용 pattern obj
 * @type {Object}
 */
var patternObj = {
  symbol : {pattern:/[~!@\#$%^&*\()\-=+_']/gi, msg:"특수문자를 사용할 수 없습니다."},
  korean : {pattern:/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/gi, msg:"한글 문자는 사용할 수 없습니다."},
  blank : {pattern:/\s/gi, msg:"공백문자는 사용할 수 없습니다."},
  numeric : {pattern:/[0-9]/gi, msg:"숫자는 사용할 수 없습니다."},
  english : {pattern:/[a-zA-Z]/gi, msg:"영문자는 사용할 수 없습니다."},
};


/**
 * 정규식 패턴에 적합한지 검사한다.
 * @param  string pattern 정규식
 * @param  string id      element의 id
 * @param  string msg     적합하지 않을 시 메시지
 * @return bollean        적합한지 여부
 */
function patternCheck(element, msgBox, pattern, msg) {
  var text = $(element).val();
  if(pattern.test(text)) {
    $(msgBox).css('display', 'block');
    $(msgBox).text(msg);
    return false;
  } else {
    $(msgBox).css('display', 'none');
    $(msgBox).text('');
    return true;
   }
}

/**
 * 엘리멘트의 값이 길이에 맞는지 검사한다.
 * @param  string id   element id
 * @param  int min     최소 길이
 * @param  int max     최대 길이
 * @return bollean     길이가 맞는지 여부
 */
function lengthCheck(element, msgBox, min, max, msg = null) {
  if(msg === null) {
    msg = "최소 " + min + "자 이상, " + max + "자 이하여만 가능합니다."
  }
  var length = $(element).val().length;
  if(length >= min && length <=max)  {
    $(msgBox).css('display', 'none');
    $(msgBox).text('');
    return true;
  } else {
    $(msgBox).text(msg);
    $(msgBox).css('display', 'block');
    return false;
  }
}

// 비밀번호 유효성 검사
var pswd1Check = function() {
  if(!lengthCheck('#pswd1', '#pswd1Msg', 6, 16))   return false;
  if(!patternCheck('#pswd1', '#pswd1Msg', patternObj.korean.pattern, patternObj.korean.msg))
    return false;
  if(!patternCheck('#pswd1', '#pswd1Msg', patternObj.blank.pattern, patternObj.blank.msg))
    return false;

  return true;
};

// 비밀번호 확인 검사
var pswd2Check = function() {
  if($("#pswd2").val() != $("#pswd1").val()) {
    $("#pswd2Msg").text("비밀번호가 일치하지 않습니다.");
    $("#pswd2Msg").css('display', 'block');
    return false;
  } else {
    $("#pswd2Msg").css('display', 'none');
    $("#pswd2Msg").text("");
    return true;
  }
};

// 이름 유효성 검사
var nameCheck = function () {
  if(!lengthCheck("#name", "#nameMsg", 1, 20))   return false;
  if(!patternCheck("#name", "#nameMsg",patternObj.numeric.pattern, patternObj.numeric.msg))
      return false;
  if(!patternCheck("#name", "#nameMsg",patternObj.symbol.pattern, patternObj.symbol.msg))
          return false;
  if(!patternCheck("#name", "#nameMsg", patternObj.english.pattern, patternObj.english.msg))
      return false;

  return true;
};

// 생일 (년) 검사
var birthYearCheck = function () {
  if(!lengthCheck('#yy', '#birthMsg', 4, 4, '태어난 년도 4자리를 정확하게 입력하세요.'))
    return false;
  if(!patternCheck('#yy', '#birthMsg',patternObj.english.pattern, patternObj.english.msg))
    return false;
  if(!patternCheck('#yy', '#birthMsg', patternObj.korean.pattern, patternObj.korean.msg))
    return false;
  if(!patternCheck('#yy', '#birthMsg', patternObj.blank.pattern, patternObj.blank.msg))
    return false;

  return true;
};

// 생일 (월) 검사
var birthMonthCheck = function () {
  if($("#mm").val()=='') {
    $("#birthMsg").css('display', 'block');
    $("#birthMsg").text('태어난 월을 정확히 선택해주세요.');
    return false;
  } else {
    $("#birthMsg").css('display', 'none');
    $("#birthMsg").text('');
    return true;
  }
};

// 생일 (일) 검사
var birthDayCheck = function () {
  if(!lengthCheck('#dd', '#birthMsg', 2, 2, '태어난 일자 2자리를 정확하게 입력하세요.'))
    return false;
  if(!patternCheck('#dd', '#birthMsg',patternObj.english.pattern, patternObj.english.msg))
    return false;
  if(!patternCheck('#dd', '#birthMsg', patternObj.korean.pattern, patternObj.korean.msg))
    return false;
  if(!patternCheck('#dd', '#birthMsg', patternObj.blank.pattern, patternObj.blank.msg))
    return false;

  return true;
};

// 이메일 유효성 검사
var emailCheck = function () {
  if(!patternCheck('#email', '#emailMsg', patternObj.korean.pattern, patternObj.korean.msg))
    return false;
  if(!patternCheck('#email', '#emailMsg', patternObj.blank.pattern, patternObj.blank.msg))
    return false;

  return true;
};

// 휴대전화 유효성 검사
var mobileCheck = function () {
  if(!patternCheck('#mobile', '#mobileMsg', patternObj.korean.pattern, patternObj.korean.msg))
    return false;
  if(!patternCheck('#mobile', '#mobileMsg', patternObj.blank.pattern, patternObj.blank.msg))
    return false;
  if(!patternCheck('#mobile', '#mobileMsg', patternObj.english.pattern, patternObj.english.msg))
      return false;
  if(!patternCheck('#mobile', '#mobileMsg', patternObj.symbol.pattern, patternObj.symbol.msg))
      return false;

  return true;
};

// 비밀번호 유효성 검사
$(document).on("blur", "#pswd1", pswd1Check);
// 비밀번호 확인 유효성 검사
$(document).on("blur", "#pswd2", pswd2Check);
// 이름 유효성 검사
$(document).on("blur", "#name", nameCheck);
// 생일 (년) 유효성 검사
$(document).on("blur", "#yy", birthYearCheck);
// 생일 (월) 유효성 검사
$(document).on("blur", "#mm", birthMonthCheck);
// 생일 (일) 유효성 검사
$(document).on("blur", "#dd", birthDayCheck);
// 이메일 유효성 검사
$(document).on("blur", "#email", emailCheck);
// 휴대전화 유효성 검사
$(document).on("blur", "#mobile", mobileCheck);


$(document).on("click", "#modify", function() {
  if($("#modifyForm").valid()) {
    if(nameCheck()) {
      if($("#yy").val() != '' && !birthYearCheck()) {
        return false;
      }
      if($("#mm").val() != '' && !birthMonthCheck()) {
        return false;
      }
      if($("#dd").val() != '' && !birthDayCheck()) {
        return false;
      }
      if($("#email").val() != '' && !emailCheck()) {
        return false;
      }
      if($("#mobile").val() != '' && !mobileCheck()) {
        return false;
      }

      $("#modifyForm").submit();

    }
  }
  return false;
});
