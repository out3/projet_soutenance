// Alerts
$(".alert-danger").fadeTo(4000, 500).slideUp(500, function(){
  this.slideUp(1000);
});

$(".alert-success").fadeTo(4000, 500).slideUp(500, function(){
  this.slideUp(1000);
});

// Applications sidebar
$("#button-filter-state").click( () =>{
  $("#pills-applications-tab").slideToggle("fast", "linear")
})

$("#pills-applications-tab").children("li").children("a").click( () => {
  if($(window).width() < 992) {
    $("#pills-applications-tab").slideUp("fast","linear")
  }
})