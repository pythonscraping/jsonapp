var el = document.getElementById('columns');
var sortable = Sortable.create(el,{
	group: "name"});

var il = document.getElementById('throwout');
var sortable = Sortable.create(il,{
	group: "name"});




window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
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

