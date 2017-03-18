'use strict';
function update_stats(ev, dropped_classification) {
    ev.preventDefault();
	
	//Dragged object
    var dragged_id = ev.dataTransfer.getData("text");
	var dragged = document.getElementById(dragged_id);
	var ids = dragged_id.split('-');
	var player_number = ids[1];
	var alien_number = ids[3];
	var dragged_terrain = game.players[player_number].aliens[alien_number].terrain;
	var dragged_classifications = Object.keys(game.players[player_number].aliens[alien_number].classifications);
	
	//Dropped into object
	var dropped = ev.target;
	var dropped_class = dropped.className;
	var dropped_id = dropped.id;
	var dropped_terrain = dropped_id.split("-")[1];
	
	//Alien can affect the stat if it matches either type or terrain
	var allowable_types = {
		"diplomacy" 	: 1,
		"science"		: 1,
		"exploration"	: 1
	};
	
	//Current player location:
	var row = game.players[player_number]["x"];
	var col = game.players[player_number]["y"];
	var current_id = "tile-" + row + "-" + col;
	var current = document.getElementById(current_id);
	var current_terrain = current.className.split(" ")[1];
	
	var match = 0;
	
	if(dropped_terrain == dragged_terrain) {
		match = 1;
	}
	else {
		for(var key in dragged_classifications) {
			if(dragged_classifications[key] == dropped_classification) {
				match = 1;
			}
		}
	}
	
	if(game.board.getTile(row, col).isMarked) {
		//Terrain needs to be unmarked
		match = 0;
	}
	
	if(dropped_terrain != current_terrain){
		//You have to be currently on the color to remove a number
		match = 0;
	}
	
	if(game.stats["new-" + dropped_terrain] <= 0) {
		//The stats are already at 0
		match = 0;
	}
	
	if(!match) {
		//Fail case, don't move tile
	}
	else {
		var p = document.getElementById(ids[0] + "-" + ids[1] + "-aliens");
		p.removeChild(document.getElementById("table-" + dragged.id));
		document.getElementById("aliens-" + dropped_id).appendChild(dragged);
		game.turn.aliens_to_remove.push(dragged);
		
		
		game.turn.use_action();
		game.stats["new-" + dropped_terrain]--;
		
		game.redisplay_stats_table();
	}
}

function update_time_crisis(ev) {
    ev.preventDefault();
	
	//Dragged object
    var dragged_id = ev.dataTransfer.getData("text");
	var dragged = document.getElementById(dragged_id);
	var ids = dragged_id.split('-');
	var player_number = ids[1];
	var alien_number = ids[3];
	var dragged_terrain = game.players[player_number].aliens[alien_number].terrain;
	var dragged_classifications = Object.keys(game.players[player_number].aliens[alien_number].classifications);
	
	//Dropped into object
	var dropped = ev.target;
	var dropped_class = dropped.className;
	var dropped_id = dropped.id;
	var dropped_terrain = dropped_id.split("-")[1];
	
	var dragged_id_split = dragged_id.split("-");
	var previous = "tile-" + game.players[dragged_id_split[1]]["x"] + "-" + game.players[dragged_id_split[1]]["y"];
	
	//return current alien
	game.turn.aliens_to_remove.push(dragged);
	successful_drag = 1; //For the ondrop action to trigger
	
	var thisTD = document.getElementById("td-" + dropped_id);
	
	//remove card from game.time_deck
	game.time_deck.resolve_action(dropped_id);
	
	//Remove card from board
	thisTD.removeChild(dropped);
	
	//place alien
	thisTD.appendChild(dragged);

	
	
	game.turn.use_action();
	game.update_stats("", "");	
}


function draw_card(ev) {
	if(game.turn.actions >= 1) {
		//game.stats.searched_cards++;
		
		game.turn.use_action();
		game.redisplay_stats_table();
	}
}