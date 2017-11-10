var el = document.getElementById('columns');
var sortable = Sortable.create(el,{
	group: "name"});

var il = document.getElementById('throwout');
var sortable = Sortable.create(il,{
	group: "name"});



/*
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

*/


var elem = document.getElementById("columns");

var defaultPrevent=function(e){e.preventDefault();}
elem.addEventListener("touchstart", defaultPrevent);
elem.addEventListener("touchmove" , defaultPrevent);




$('#sorted').click(function(){
	var favorites = [];
	$('#columns > .column').each(function(){ 
	favorites.push($(this).attr("id"));

		  
	});

	$.post( "favorites", { favorites: favorites} , function(response){
                        window.location.href = "home";
                    });
});

