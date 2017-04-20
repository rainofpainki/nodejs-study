$(()=>{
  var idCheck = (id)=>{
    $.post({
      url:'/confirm/idCheck',
      data: {'id':id}
    }).then( ()=>{
      alert('사용 가능한 id입니다.');
      return true;
    })
    .catch( (e)=>{
      switch(e.status) {
        case 500: alert('다시 시도해주세요.'); break;
        case 400: alert('이미 존재하는 아이디입니다.'); break;
        case 200: alert('다른 아이디로 시도해주세요.'); break;
        case 410: alert('아이디를 입력해주세요.'); break;
      }
      return false;
    });
  };

  $("#idCheck").click( ()=>{
      return idCheck($("#id").val());
    }
  );
});
