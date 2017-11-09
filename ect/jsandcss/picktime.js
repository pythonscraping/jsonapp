var $fromdate = $('.datepicker').pickadate()
var $todate = $('.datepicker2').pickadate()


$( "#sendtime" ).submit(function( event ) {
  event.preventDefault();
  from = $fromdate.pickadate('picker').get('select').obj;
  todate = $todate.pickadate('picker').get('select').obj;

  $.post( "picktime", { from: from, todate: todate } , function(response){
                        window.location.href = "home";
                    });
});