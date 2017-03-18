'use strict';

//Alien Movement
function allowDrop(ev) {
    ev.preventDefault();
}

function change_css(changes) {
	var ks = Object.keys(changes);
	window.requestAnimationFrame(function(timestamp){
		for(var idN in ks) {
			var id = ks[idN];
			var dom_element = document.getElementById(id);
			var ks2 = Object.keys(changes[id]);
			for(var propN in ks2) {
				var property = ks2[propN];
				dom_element.setAttribute(property, changes[id][property]);
			}
		}
	});
}

//Global variable to signify to the dragend function that it was dropped correctly.
var successful_drag = 0;
var turn_off_alien = 0;
function drag_player(ev) {
	successful_drag = 0;
	
	var dragged_piece = ev.target;
	
	var dragged_id = dragged_piece.id;
	var dragged_id_split = dragged_id.split("-");
	
	var playerNum = dragged_id_split[1];
	var player = game.players[playerNum];
	
	var all_css_changes = { 
		add_changes : function(id, change, value) {
				if(!this[id]) {
					this[id] = {};
				}
				this[id][change] = value;
	}};

	
	//Attempting to move a player onto a new tile
	var moves = player.getValidMoves();
	if(game.turn.actions >= 2) {
		for (var i = 0; i < moves.length; i++) { 
			var row = moves[i][0];
			var col = moves[i][1];
			var move_tile = document.getElementById("tile-" + (row) + "-" + (col));
			
			all_css_changes.add_changes("tile-" + (row) + "-" + (col), "ondragover", game.board.getTile(row, col).getTileDisplayCSS_ondragover());
			all_css_changes.add_changes("tile-" + (row) + "-" + (col), "ondrop", game.board.getTile(row, col).getTileDisplayCSS_ondrop());
			all_css_changes.add_changes("tile-" + (row) + "-" + (col), "class", move_tile.className + " available-move");
		}
	}
	
	//Move onto an adjacent used alien
	if(game.turn.actions >= 1) {
		function check_alien(ID, movesA) {
			var idsA = ID.split("-");
			var rowA = game.players[idsA[1]].aliens[idsA[3]]["x"];
			var colA = game.players[idsA[1]].aliens[idsA[3]]["y"];
			for (var key in moves) {
				if(moves[key][0] == rowA && moves[key][1] == colA ) {
					return 1;
				}
			}
			
			return 0;
		}
		
		for (var key in game.turn.aliens_to_remove) {
			var ID = game.turn.aliens_to_remove[key];
			if(check_alien(ID.id, moves)) {
				all_css_changes.add_changes(ID.id, "ondragover", "allowDrop(event)");
				all_css_changes.add_changes(ID.id, "ondrop", "drop_on_alien(event)");
				
				var idsA = ID.id.split("-");
				var alienNum = idsA[3];
				
				var rowA = game.players[playerNum].aliens[alienNum]["x"];
				var colA = game.players[playerNum].aliens[alienNum]["y"];
				var move_tile = document.getElementById("tile-" + (rowA) + "-" + (colA));
				
				if(game.turn.actions >= 2) {
					//Turning off the drop onto the tile, the player should drop onto the alien instead
					all_css_changes.add_changes("tile-" + (rowA) + "-" + (colA), "ondragover", "false");
					all_css_changes.add_changes("tile-" + (rowA) + "-" + (colA), "ondrop", "false");
				}
				else {
					all_css_changes.add_changes("tile-" + (rowA) + "-" + (colA), "class", move_tile.className + " available-move");
				}
			}
		}
	}
	
	change_css(all_css_changes);

	
    ev.dataTransfer.setData("text", dragged_id);
}

function drag_alien(ev) {
	successful_drag = 0;
	
	var dragged_piece = ev.target;
	
	var dragged_id = dragged_piece.id;
	var dragged_id_split = dragged_id.split("-");
	
	var playerNum = dragged_id_split[1];
	var alienNum = dragged_id_split[3];
	var player = game.players[playerNum];
	
	var all_css_changes = { 
		add_changes : function(id, change, value) {
				if(!this[id]) {
					this[id] = {};
				}
				this[id][change] = value;
	}};
	
	
	//Attempting to move an alien
	var moves = player.getValidAlienMoves(alienNum);
	for (var i = 0; i < moves.length; i++) { 
		var row = moves[i][0];
		var col = moves[i][1];
		
		var move_tile = document.getElementById("tile-" + (row) + "-" + (col));
		
		all_css_changes.add_changes("tile-" + (row) + "-" + (col), "ondragover", game.board.getTile(row, col).getTileDisplayCSS_ondragover());
		all_css_changes.add_changes("tile-" + (row) + "-" + (col), "ondrop", game.board.getTile(row, col).getTileDisplayCSS_ondrop());
		all_css_changes.add_changes("tile-" + (row) + "-" + (col), "class", move_tile.className + " available-move");
	}

	var player_terrain = game.board.getTile(game.players[playerNum]["x"], game.players[playerNum]["y"]).terrain;
	var dragged_terrain = dragged_piece.className.split(" ")[1];
	
	//Turn on level up cards
	if(player.coins >= 3) {
		all_css_changes.add_changes("levelup_button", "ondragover", "allowDrop(event)");
		all_css_changes.add_changes("levelup_button", "ondrop", "levelup_alien(event)");
		all_css_changes.add_changes("levelup_button", "class", "levelup_button available-move");
		
	}
	
	//Turn on ability cards
	var each_card = document.getElementById("player-" + playerNum + "-cards").children;
	for(var key in each_card) {
		if(each_card[key].className == "player_card") {
			game.time_deck.get_card_effect(each_card[key]);
		}
	}
	
	//Turn on time cards
	if(player_terrain === dragged_terrain) {
		var class_tiles = document.getElementsByClassName("time " + dragged_terrain);
		
		var time_tiles = []
		for(var i = 0; i < class_tiles.length; i++) {
		   time_tiles.push(class_tiles.item(i));
		}
		
		for (var i = 0; i < time_tiles.length; i++) { 
			all_css_changes.add_changes(time_tiles[i].id, "ondragover", "allowDrop(event)");
			all_css_changes.add_changes(time_tiles[i].id, "ondrop", "update_time_crisis(event)");
			all_css_changes.add_changes(time_tiles[i].id, "class", time_tiles[i].className + " available-move");
		}
	}
	
	var alien_classifications = Object.keys(game.players[playerNum].aliens[alienNum].classifications);
	if(alien_classifications.length) {
		for(var i = 0; i < alien_classifications.length; i++) {
			var this_alien = alien_classifications[i];
			var this_level = game.players[playerNum].aliens[alienNum].classifications[this_alien];
			
			for(var j = 0; j < game.time_deck.active.length; j++) {
				if(game.time_deck.active[j].length === 0 ) { continue };
				if(game.time_deck.active[j].crisis["card_class"] == this_alien) {
					//Match alien classification with crisis classification
					//Level 2 or above aliens match all colors of the correct crisis classification
					for(var k = 0; k < game.time_deck.active[j].reqs.length; k++) {
						if((this_level >= 2) || (player_terrain == game.time_deck.active[j].reqs[k]["terrain"])) {
							var time_tile = document.getElementById("crisis-" + j + "-" + k);
							if(!(time_tile.ondragover == "allowDrop(event)")) {
								all_css_changes.add_changes(time_tile.id, "ondragover", "allowDrop(event)");
								all_css_changes.add_changes(time_tile.id, "ondrop", "update_time_crisis(event)");
								all_css_changes.add_changes(time_tile.id, "class", time_tile.className + " available-move");
							}
						}
					}
				}
			}
		}
	}
	
	change_css(all_css_changes);
	
    ev.dataTransfer.setData("text", dragged_id);
}

function drop_on_alien(ev) {
	ev.preventDefault();
	
	//Dragged object
    var dragged_id = ev.dataTransfer.getData("text");
	
	
	//Dropped into object
	var dropped = ev.target;
	var dropped_class = dropped.className;
	var dropped_id = dropped.id;
	var dropped_id_split = dropped_id.split("-");
	
	//Placing the player tile on top of the other tile, have to pull the correct a tag here
	var rowP = game.players[dropped_id_split[1]].aliens[dropped_id_split[3]]["x"];
	var colP = game.players[dropped_id_split[1]].aliens[dropped_id_split[3]]["y"];
	
	var new_drop= document.getElementById("tile-" + (rowP) + "-" + (colP));
	dragged_id = ev.target.id;
	
	//Remove the alien from the to_remove listStyleType
	var new_remove = [];
	for (var key in game.turn.aliens_to_remove){
		if(game.turn.aliens_to_remove[key].id == dragged_id) {
			//remove from list
		}
		else {
			new_remove.push(game.turn.aliens_to_remove[key]);
		}
	}
	game.turn.aliens_to_remove = new_remove;


	//new_drop.dataTransfer.setData("text", dragged_id);
	//new_drop.dataTransfer.setData("old_move", 1);
	
	//Fake event object
	drop_on_tile({
		target: new_drop, 
		dataTransfer : {getData : function(inh){var obj = {"text" : dragged_id, "old_move" : 1};return obj[inh]}}, 
		preventDefault: function() {} 
		});
}

function drop_on_tile(ev) {
	successful_drag = 1;
    ev.preventDefault();
	
	//Dragged object
    var dragged_id = ev.dataTransfer.getData("text");
	var old_move = ev.dataTransfer.getData("old_move");
	
	
	//Dropped into object
	var dropped = ev.target;
	var dropped_class = dropped.className;
	var dropped_id = dropped.id;
	var dropped_id_split = dropped_id.split("-");
	
	var new_move = 0;
	
	var dragged = document.getElementById(dragged_id);
	var row = Number(dropped_id_split[1]);
	var col = Number(dropped_id_split[2]);
	
	//Set new player location
	var dragged_id_split = dragged_id.split("-");
	
	//Save previous location
	game.players[dragged_id_split[1]].previous_loc["x"] = game.players[dragged_id_split[1]]["x"];
	game.players[dragged_id_split[1]].previous_loc["y"] = game.players[dragged_id_split[1]]["y"];
	
	var previous = "tile-" + game.players[dragged_id_split[1]]["x"] + "-" + game.players[dragged_id_split[1]]["y"];
	
	//Reset CSS
	//var evClass = game.board.getTile(row, col).getTileDisplayCSS_class();
	//reset_css(previous);
	
	
	//return previous alien
	if(document.getElementById(previous).children[0]) {
		var prevInside = document.getElementById(previous).children;
		for (var key in prevInside) {
			var childID = prevInside[key].id;
			if(childID === undefined) {continue};
			var idsP = childID.split("-");
			if(idsP.length == 4 && idsP[2] == "alien" && idsP[1] == dragged_id_split[1]) {
				game.players[idsP[1]].aliens[idsP[3]]["x"] = game.players[dragged_id_split[1]]["x"];
				game.players[idsP[1]].aliens[idsP[3]]["y"] = game.players[dragged_id_split[1]]["y"];
				
				var alien_to_remove = document.getElementById(previous).children[key];
				game.turn.aliens_to_remove.push(alien_to_remove);
			}
		}
	}
	
	//Set Location
	if(dragged_id_split.length == 2) {
		game.players[dragged_id_split[1]]["x"] = row;
		game.players[dragged_id_split[1]]["y"] = col;
		
		game.turn.use_action();
	}
	else if(dragged_id_split.length == 4) {	
		dragged.appendChild(document.getElementById("player-" + dragged_id_split[1]));
		game.players[dragged_id_split[1]]["x"] = row;
		game.players[dragged_id_split[1]]["y"] = col;
	}
	
	
	var loop = [[row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]];

	game.turn.use_action();
	game.update_stats(dropped_class, dropped_id);	
	
	for (var key in loop) {
		var rowL = loop[key][0];
		var colL = loop[key][1];
		
		if(valid_tile(rowL, colL)) {
			//Set as up		
			game.board.updateTile(rowL, colL, {"up" : 1});
			document.getElementById("tile-" + (rowL) + "-" + (colL)).className = game.board.getTile(rowL, colL).getTileDisplayCSS_class();
		}
	}
	
	if(!old_move) {
		dragged.setAttribute("draggable", "false");
		dragged.setAttribute("ondragstart", "false");
		turn_off_alien = 1;
		ev.target.appendChild(dragged);
	}
	

	var update_marks_on_move = 0;
	if(update_marks_on_move) {
		game.board.update_marks(dropped_class, dropped_id);	
		game.board.updateTile(row, col, {"unmark" : 1});
	}
}


function drag_end_player(ev) {
	var dragged = ev.target;
	var ids = dragged.id.split('-');
	var row = game.players[ids[1]].previous_loc["x"];
	var col = game.players[ids[1]].previous_loc["y"];
	var previous = "tile-" + row + "-" + col;
	
	row = game.players[ids[1]]["x"];
	col = game.players[ids[1]]["y"];
	var current = "tile-" + row + "-" + col;
	
	var all_css_changes = { 
		add_changes : function(id, change, value) {
				if(!this[id]) {
					this[id] = {};
				}
				this[id][change] = value;
	}};
	
	all_css_changes = reset_css(all_css_changes, previous);
	all_css_changes = reset_css(all_css_changes, current);
	
	change_css(all_css_changes);
}

function drag_end_alien(ev) {
	var dragged = ev.target;
	var ids = dragged.id.split('-');
	var playerNum = ids[1];
	var alienNum = ids[3];
	
	var row = game.players[playerNum].previous_loc["x"];
	var col = game.players[playerNum].previous_loc["y"];
	var previous = "tile-" + row + "-" + col;
	
	row = game.players[playerNum]["x"];
	col = game.players[playerNum]["y"];
	var current = "tile-" + row + "-" + col;
	
	if(!successful_drag) {//The drag failed
	}
	else{
		var p = document.getElementById(ids[0] + "-" + playerNum + "-aliens");
		p.removeChild(document.getElementById("table-" + dragged.id));
		
		//Find the highest level used alien this turn
		var new_level = game.players[playerNum].aliens[alienNum].level;
		if(new_level > game.stats.highest_level) {
			game.stats.highest_level = new_level;
		}
		
	}
	
	var all_css_changes = { 
		add_changes : function(id, change, value) {
				if(!this[id]) {
					this[id] = {};
				}
				this[id][change] = value;
	}};
	
	
	all_css_changes = reset_css(all_css_changes, previous);
	all_css_changes = reset_css(all_css_changes, current);
	all_css_changes = reset_time_css(all_css_changes);
	all_css_changes = reset_button_css(all_css_changes);
	all_css_changes = reset_card_css(all_css_changes);
	
	//Turn off ondragend for this alien
	if(turn_off_alien){
		all_css_changes.add_changes(dragged.id, "ondragend", "false");
		turn_off_alien = 0;
	}
	
	change_css(all_css_changes);
}

function mark_move(ev, row, col) {
	successful_drag = 0;
	if(game.turn.actions > 0) {
		var dragged = ev.target;
		var ter = game.board.getTile(row, col).terrain;
		
		var all_css_changes = { 
		add_changes : function(id, change, value) {
				if(!this[id]) {
					this[id] = {};
				}
				this[id][change] = value;
		}};
	
		
		var class_tiles = document.getElementsByClassName("time " + ter);
				
		var time_tiles = []
		for(var i = 0; i < class_tiles.length; i++) {
		   time_tiles.push(class_tiles.item(i));
		}
		
		for (var i = 0; i < time_tiles.length; i++) { 
			all_css_changes.add_changes(time_tiles[i].id, "ondragover", "allowDrop(event)");
			all_css_changes.add_changes(time_tiles[i].id, "ondrop", "drop_mark(event)");
			all_css_changes.add_changes(time_tiles[i].id, "class", time_tiles[i].className + " available-move");
		}
		
		change_css(all_css_changes);
	}
}

function drop_mark(ev) {
	successful_drag = 1;
	var dropped = ev.target;
	var dropped_id = dropped.id;
	var thisTD = document.getElementById("td-" + dropped_id);
	
	game.time_deck.resolve_action(dropped_id);
	
	//Remove card from board
	thisTD.removeChild(dropped);
	//remove card from game.time_deck
	
	game.turn.use_action();
	game.update_stats("", "");
}

function mark_move_end(row, col) {
	var all_css_changes = { 
		add_changes : function(id, change, value) {
				if(!this[id]) {
					this[id] = {};
				}
				this[id][change] = value;
	}};
	
	
	all_css_changes = reset_time_css(all_css_changes);
	
	if(successful_drag) {
		var this_tile = document.getElementById("tile-" + row + "-" + col);
		game.board.update_marks(this_tile.className, this_tile.id);
	}
	
	change_css(all_css_changes);
}

function reset_css(all_css_changes, tile) {
	var idSave = tile.split("-");
	var row = Number(idSave[1]);
	var col = Number(idSave[2]);
	var loop = [[row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]];
	
	
	for (var key in loop) {
		var rowL = loop[key][0];
		var colL = loop[key][1];
		if(valid_tile(rowL, colL)) {
			all_css_changes.add_changes("tile-" + (rowL) + "-" + (colL), "class", game.board.getTile(rowL, colL).getTileDisplayCSS_class());
		}
	}

	for (var row = 0; row < 7; row++) { 
		for (var col = 0; col < 7; col++) { 
			all_css_changes.add_changes("tile-" + (row) + "-" + (col), "ondragover", "false");
			all_css_changes.add_changes("tile-" + (row) + "-" + (col), "ondrop", "false");
		}
	}
	
	return all_css_changes;
}

function reset_time_css(all_css_changes) {
	var terrains = ["forest", "water", "desert"];
	for (var j in terrains) {
		var each_terrain = terrains[j];
		var class_tiles = document.getElementsByClassName("time " + each_terrain + " available-move");
		
		var time_tiles = []
		for(var i = 0; i < class_tiles.length; i++)
		{
		   time_tiles.push(class_tiles.item(i));
		}

		for (var i = 0; i < time_tiles.length; i++) { 
			all_css_changes.add_changes(time_tiles[i].id, "ondragover", "false");
			all_css_changes.add_changes(time_tiles[i].id, "ondrop", "false");
			all_css_changes.add_changes(time_tiles[i].id, "class", "time " + each_terrain);
		}
	}
	
	return all_css_changes;
}

function reset_button_css (all_css_changes) {
	var each_button = document.getElementsByClassName("levelup_button available-move");
	var each_button_array = []
	for(var i = 0; i < each_button.length; i++)
	{
	   each_button_array.push(each_button.item(i));
	}
	for(var key in each_button_array) {
		all_css_changes.add_changes(each_button_array[key].id, "ondragover", "false");
		all_css_changes.add_changes(each_button_array[key].id, "ondrop", "false");
		all_css_changes.add_changes(each_button_array[key].id, "class", "levelup_button");
	}
	
	return all_css_changes;
}

function reset_card_css (all_css_changes) {
	var each_card = document.getElementsByClassName("player_card available-move");
	var each_card_array = []
	for(var i = 0; i < each_card.length; i++)
	{
	   each_card_array.push(each_card.item(i));
	}
	for(var key in each_card_array) {
		all_css_changes.add_changes(each_card_array[key].id, "ondragover", "false");
		all_css_changes.add_changes(each_card_array[key].id, "ondrop", "false");
		all_css_changes.add_changes(each_card_array[key].id, "class", "player_card");
	}
	
	return all_css_changes;
}