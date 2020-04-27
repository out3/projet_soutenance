// Alerts

$(".alert-danger").fadeTo(4000, 500).slideUp(500, function(){
    this.slideUp(1000);
});

$(".alert-success").fadeTo(4000, 500).slideUp(500, function(){
    this.slideUp(1000);
});

// Application navs (show per category)
$('#pills-application-content').on('click', function(e){
    e.preventDefault()
    $(this).tab('show')
})