'use strict';
function levelup_alien(ev) {
	ev.preventDefault();
	successful_drag = 0;
	var value = 3;
	var player = game.players[game.turn.player];
	if(player.coins >= value) {
		player.coins -= value;
		document.getElementById("current_player_coins").innerHTML = "Coins to spend: " + player.coins;
		
		//Dragged object
		var dragged_id = ev.dataTransfer.getData("text");
		var dragged = document.getElementById(dragged_id);
		var ids = dragged_id.split('-');
		if(ids.length == 4) {
			var player_number = ids[1];
			var alien_number = ids[3];
			
			//Dropped into object
			var dropped = ev.target;
			
			game.players[player_number].aliens[alien_number].levelup();
			//document.getElementById("player-" + player_number + "-buttons").removeChild(dropped);

			var unused_aliens = document.getElementById("player-" + (game.turn.player) + "-aliens");
			unused_aliens.removeChild(document.getElementById("table-" + dragged.id));
			var table = create_alien_table(dragged);
			if(table != 0) {
				unused_aliens.appendChild(table);
			}
		}
	}
}

function add_ability(ev, added_classification) {
	ev.preventDefault();
	successful_drag = 0;
	
	//Dragged object
    var dragged_id = ev.dataTransfer.getData("text");
	var dragged = document.getElementById(dragged_id);
	var ids = dragged_id.split('-');
	if(ids.length == 4) {
		var player_number = ids[1];
		var alien_number = ids[3];
		
		//Dropped into object
		var dropped = ev.target;

		var added = game.players[player_number].aliens[alien_number].addAbility({"classification" : added_classification});
		if(added) {
			document.getElementById("player-" + player_number + "-cards").removeChild(dropped);
			game.turn.use_action();
		}
		
		var unused_aliens = document.getElementById("player-" + (game.turn.player) + "-aliens");
		unused_aliens.removeChild(document.getElementById("table-" + dragged.id));
		var table = create_alien_table(dragged);
		if(table != 0) {
			unused_aliens.appendChild(table);
		}
	}
}

function add_action_button() {
	var value = 4;
	var player = game.players[game.turn.player];
	if(player.coins >= value) {
		player.coins -= value;
		document.getElementById("current_player_coins").innerHTML = "Coins to spend: " + player.coins;
		
		game.turn.actions++;
		document.getElementById("player-" + game.turn.player + "-actions").innerHTML = "Actions: " + game.turn.actions;
		
		if(this.actions == 1) {
			//Turn on all available actions
			for (var key in game.players[this.player].aliens) {
				document.getElementById("player-" + (this.player) + "-alien-" + key).setAttribute("draggable", "true");
			}
			
			//Reset buttons to clickable
			var buttons = document.getElementsByClassName("action-button inactive");
			for(var key in buttons) {
				var this_button = buttons[key];
				if(isElement(this_button)) {
					this_button.setAttribute("class", "action-button active");
				}
			}
		}
	}
}
function recruit_alien_button() {
	var value = 10;
	var player = game.players[game.turn.player];
	if(player.coins >= value) {
		player.coins -= value;
		document.getElementById("current_player_coins").innerHTML = "Coins to spend: " + player.coins;
		
		console.log("add alien");
	}
}