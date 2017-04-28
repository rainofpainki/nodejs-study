$("#attd-input-text").keypress((event)=> {
  if (event.which == 13) {
    event.preventDefault();
    $("#attd-form").attr("method", "post");
    $("#attd-form").submit();
  }
});


$("#searchBtn").click(()=>{
  $("#search-form").attr("method", "get");
  $("#search-form").submit();
});
