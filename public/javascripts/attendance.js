$("#attd-input-text").keypress((event)=> {
  if (event.which == 13) {
    event.preventDefault();
    $("#attdForm").attr("method", "post");
    $("#attdForm").submit();
  }
});


$("#searchBtn").click(()=>{
  $("#searchForm").attr("method", "get");
  $("#searchForm").submit();
});


$("#searchInput").keypress((event)=>{
  if (event.which == 13) {
    event.preventDefault();
    $("#searchForm").attr("method", "get");
    $("#searchForm").submit();
  }
});
