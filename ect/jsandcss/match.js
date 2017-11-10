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




var elem = document.getElementById("columns");


*/

var elems = document.getElementsByClassName("column");

for(var i = 0; i < elems.length; i++)
{
	var defaultPrevent=function(e){e.preventDefault();}
	elems.item(i).addEventListener("touchstart", defaultPrevent);
	elems.item(i).addEventListener("touchmove" , defaultPrevent);
}


$('#sorted').click(function(){
	var favorites = [];
	$('#columns > .column').each(function(){ 
	favorites.push($(this).attr("id"));

		  
	});

	$.post( "favorites", { favorites: favorites} , function(response){
                        window.location.href = "home";
                    });
});

