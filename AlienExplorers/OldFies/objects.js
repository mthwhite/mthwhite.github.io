'use strict';
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}

//Board object

function create_tile_deck() {
	var cards = [];
	for (var i = 1; i <= 14; i++) { 
		cards.push("water");
		cards.push("desert");
		cards.push("forest");
	}
	
	//No goal cards in the first 12
	var startCards = [];
	for (var i = 1; i <= 12; i++) { 
		startCards.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
	}
	
	//remove 4 random cards
	var hid = [];
	for (var i = 1; i <= 4; i++) { 
		hid.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
	}
	
	for (var i = 1; i <= 6; i++) { 
		cards.push("goal");
	}
	var endCards = [];
	var bound = cards.length;
	for (var i = 1; i <= bound; i++) { 
		endCards.push(cards.splice(Math.floor(Math.random() * cards.length), 1)[0]);
	}
	
	var strt = ["start"];
	return {"start": startCards, "end": endCards, "hid": hid, "strt": strt}
}



function new_game () {
	var gameObject = {};
	
	//create game board
	var gameBoard = create_board();
	gameBoard.setup();
	gameObject.board = gameBoard;
	
	//Create time deck
	var timeDeck = create_time_deck();
	gameObject.time_deck = timeDeck;
	
	//create players
	var players = 2;
	gameObject.players = {};
	for (var i = 1; i <= players; i++) { 
		var player = create_player(i);
		gameObject.players[i] = player;
	}
	
	gameObject.setup_players = function() {
		//Hard coded two player for now
		//document.getElementsByClassName('tile start')[0].innerHTML += "<div id='player-1' class='player-piece' draggable = 'true' ondragstart='drag(event)' ondragend = 'drag_end(event)'> </div>";
		document.getElementsByClassName('tile start')[0].innerHTML += "<div id='player-1' class='player-piece one' draggable = 'true' ondragstart='drag_player(event)' ondragend = 'drag_end_player(event)'>  </div>";
		
		this.players[1].previous_loc["x"] = 3;
		this.players[1].previous_loc["y"] = 3;
		this.players[1]["x"] = 3;
		this.players[1]["y"] = 3;
		
		document.getElementsByClassName('tile start')[0].innerHTML += "<div id='player-2' class='player-piece two' draggable = 'false' ondragstart='drag_player(event)' ondragend = 'drag_end_player(event)'>  </div>";
		
		this.players[2].previous_loc["x"] = 3;
		this.players[2].previous_loc["y"] = 3;
		this.players[2]["x"] = 3;
		this.players[2]["y"] = 3;
	}
	
	gameObject.start_game = function() {
		var output = this.board.getdisplayCSS();
		this.update_stats("", "");

		document.getElementById("create_tiles").innerHTML = output;
		
		this.setup_players();
		
		//Create first crisis
		game.time_deck.draw_card(0);
		
		//Last thing to do before starting the game
		this.start_turn();
	}
	
	
	//*************************************************
	//Stats:
	gameObject.stats = {
		"turns" : 0,
		"moves" : 0,
		"cards_drawn" : 0,
		"coins" : 0,
		"experience" : 0,
		highest_level : 0,
		"goal"  : 0,
		"desert": 0,
		"water" : 0,
		"forest" : 0,
		"start"  : 0,
		
	};
	
	gameObject.saved_info = {
		"levelups" : 0,	
		"player_cards-1" : 0,	
		"player_cards-2" : 0,	
		"player_cards-3" : 0,	
		"player_cards-4" : 0,	
		"player_cards-5" : 0,	
	};
	
	gameObject.update_stats = function(classN, ID) {
		var ids = ID.split("-");
		
		var row = Number(ids[1]);
		var col = Number(ids[2]);
		
		if(classN != "") {
			this.stats.moves++;
			if(this.board.getTile(row, col).isUp) {
				var classes = classN.split(" ");
				if(classes[1] == "goal") {
					//this.stats.goal--;
				}
				else {
					this.stats[classes[1]]++;
				}
			}
		}
		this.redisplay_stats_table();
	}
	
	gameObject.redisplay_stats_table = function() {
		var ret = "<table>";
		ret += "<tr> <th> Stats </th> <td></td></tr>";
		for (var key in this.stats) {
			ret += "<tr> <td>" + key + "</td> <td> " + this.stats[key] + "</td></tr>";
		}
		ret += "</table>";
		
		document.getElementById('game-stats').innerHTML = ret;
		
		document.getElementById('new-goal-stats').innerHTML = this.stats["goal"];
	}
//End stats
//*************************************************
	
	
	var turnObject = new_turn(1);
	gameObject.turn = turnObject;
	
	gameObject.start_turn = function() {
		//Check for active effects from the previous turn
		
		//Set begining player actions.
		//document.getElementById("player-" + (this.turn.player) + "-actions").innerHTML = "Actions: " + this.turn.actions;
		document.getElementById("player-" + this.turn.player + "-board-span").setAttribute("class", "game-board");
		document.getElementById("player-" + this.turn.player + "-actions").innerHTML = "Actions: " + this.turn.actions;
		document.getElementById("current-player").innerHTML = "<font size = '5'>Current Player: " + this.turn.player + "</font>";
		document.getElementById("current_player_coins").innerHTML = "Coins to spend: " + this.players[this.turn.player].coins;
		
		document.getElementById("add_mark-" + this.turn.player).setAttribute("onclick", "game.players[" + this.turn.player + "].add_mark()");
		//document.getElementById("remove_mark").setAttribute("onclick", "game.players[" + this.turn.player + "].remove_current_mark()");
		
		//turn on aliens for current player
		for (var key in this.players[this.turn.player].aliens) {
			document.getElementById("player-" + (this.turn.player) + "-alien-" + key).setAttribute("draggable", "true");
		}
		//Turn on player piece
		document.getElementById("player-" + (this.turn.player)).setAttribute("draggable", "true");
		document.getElementById("player-" + (this.turn.player)).setAttribute("ondragstart", "drag_player(event)");
		
		//Set alien abilities
		var unused_aliens = document.getElementById("player-" + (this.turn.player) + "-aliens");
		for (var al in unused_aliens.children) { 
			var alien = unused_aliens.children[al];
			if(alien.id !== undefined) {
				var table = create_alien_table(alien);
				if(table != 0) {
					unused_aliens.appendChild(table);
				}
			}
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
	
	gameObject.end_turn = function() {
		//Clear all aliens not being used
		this.stats.turns++;
		for (var key in this.turn.aliens_to_remove) {
			var ID = this.turn.aliens_to_remove[key];
			ID.setAttribute("draggable", "true");
			ID.setAttribute("ondragend", "drag_end_alien(event)");
			ID.setAttribute("ondragstart", "drag_alien(event)");
			
			document.getElementById("player-" + this.turn.player + "-aliens").appendChild( ID );
			
			//Reset alien location
			var idsP = ID.id.split("-");
			if(idsP.length == 4 && idsP[2] == "alien") {
				game.players[idsP[1]].aliens[idsP[3]]["x"] = "";
				game.players[idsP[1]].aliens[idsP[3]]["y"] = "";
			}
			
		}
		
		//get rid of time deck tables
		var time_table = document.getElementById("time_cards");
		var tables_to_remove = document.getElementsByClassName("remove-table");
		for(var i = 0; i < tables_to_remove.length; i++) {
			var this_table = tables_to_remove.item(i);
			time_table.removeChild(this_table);
		}
		
		
		
		//Prepare for next turn
		var previous_player = this.turn.player;
		var new_player = previous_player + 1;
		if(this.players[new_player] === undefined ) {
			new_player = 1;
			this.end_round();
		};
		var turnObject = new_turn(new_player);
		this.turn = turnObject;
		
		//turn off aliens for previous player (they won't be off if you end turn with more than 0 actions)
		for (var key in this.players[previous_player].aliens) {
			document.getElementById("player-" + (previous_player) + "-alien-" + key).setAttribute("draggable", "false");
		}
		//Turn off previous player piece
		//Turn off previous player piece
		document.getElementById("player-" + (previous_player)).setAttribute("draggable", "false");
		
		//Save player board for previous
		document.getElementById("player-" + previous_player + "-board-span").setAttribute("class", "hidden-board");
		
		this.redisplay_stats_table();
		
		this.start_turn();
	}
	
	gameObject.end_round = function() {
		//Draw from time deck
		game.time_deck.draw_card(this.stats.highest_level);
		//reset max alien level
		this.stats.highest_level = 0;
	}
	
	return gameObject;
}

function create_time_deck() {
	var deckObject = {};
	
	var cards = [];
	for (var i = 1; i <= 6; i++) { 
		cards.push("level_up");
		cards.push("goal");
	}
	cards.push("level_up");
	cards.push("level_up");
	cards.push("level_up");
	
	var classifications = [];
	for (var i = 1; i <= 5; i++) { 
		classifications.push("science");
		classifications.push("exploration");
		classifications.push("diplomacy");
	}
	
	//Randomize time cards
	var startCards = [];
	var bound = cards.length;
	for (var i = 1; i <= bound; i++) { 
	//Add classification here (science/exploration/diplomacy)
		startCards.push({"card_id" : cards.splice(Math.floor(Math.random() * cards.length), 1)[0], "card_class" : classifications.splice(Math.floor(Math.random() * classifications.length), 1)[0]});
	}
	
	//Times up at the end
	startCards.push({"card_id" : "times_up", "card_class" : "none"});
	
	
	//Randomize time reqs
	var terrainReqs = [];
	for (var i = 1; i <= 40; i++) { 
		terrainReqs.push("desert");
		terrainReqs.push("water");
		terrainReqs.push("forest");
	}
	
	var startReqs = [];
	for (var key in terrainReqs) { 
		var rand_seed = Math.floor(Math.random() * 1000);
		if(rand_seed <= 333) {
			startReqs.push({"terrain" : terrainReqs[key], "card" : "classification-diplomacy"});
		}
		else if(rand_seed <= 666) {
			startReqs.push({"terrain" : terrainReqs[key], "card" : "classification-science"});
		}
		else if(rand_seed <= 1000) {
			startReqs.push({"terrain" : terrainReqs[key], "card" : "classification-exploration"});
		}
	}
	var endReqs = [];
	var req_bound = startReqs.length;
	for (var i = 1; i <= req_bound; i++) { 
		endReqs.push(startReqs.splice(Math.floor(Math.random() * startReqs.length), 1)[0]);
	}
	
	deckObject.cards = startCards;
	deckObject.reqs = endReqs;
	deckObject.active = [];
	
	
	deckObject.draw_card = function(level) {
		var out = {
			"crisis" : this.cards.shift(),
			"reqs" : [],
			"crisis_level" : 0
		};
		
		var bound = level + Object.keys(game.players).length;
		if(this.reqs.length < bound) {
			console.log("Not enough cards to draw... loss?");
		}
		if(!out["crisis"]) {
			alert("Game over!");
		}
		
		for (var i = 1; i <= bound; i++) { 
			out.reqs.push(this.reqs.shift());
		}
		
		out["crisis_level"] = out.reqs.length;

		game.stats["cards_drawn"] += bound;
		this.active.push(out);
		
		
		this.redisplay_time_cards();
	};
	
	deckObject.resolve_action = function(req_id) {
		var reqsIds = req_id.split("-");
		this.give_card_to_player(document.getElementById(req_id).getAttribute("card_id"));
		
		
		//Move the ids of the crisis tiles so they are on the same iteration as the saved array
		document.getElementById("td-" + req_id).setAttribute("id", "hide");
		for(var i = Number(reqsIds[2])+1; i < this.active[reqsIds[1]].reqs.length;i++) {
			document.getElementById("crisis-" + reqsIds[1] + "-" + i).setAttribute("id", "crisis-" + reqsIds[1] + "-" + (i - 1));
			document.getElementById("td-crisis-" + reqsIds[1] + "-" + i).setAttribute("id", "td-crisis-" + reqsIds[1] + "-" + (i - 1));
		}
		
		var this_req = this.active[reqsIds[1]].reqs.splice(reqsIds[2], 1);
		
		if(this.active[reqsIds[1]].reqs.length === 0) {
			var thisTD = document.getElementById("td-crisis-" + reqsIds[1]);
			var crisis_card = document.getElementById("crisis-" + reqsIds[1]);
			
			var value = Number(crisis_card.getAttribute("crisis_level"));
			if(this.active[reqsIds[1]]["crisis"]["card_id"] == "goal") {
				game.stats["experience"] += value;
			}
			else {
				game.stats["coins"] += value;
				for(var playerN in game.players) {
					game.players[playerN].coins += value;
				}
				document.getElementById("current_player_coins").innerHTML = "Coins to spend: " + game.players[game.turn.player].coins;
			}
			
			
			thisTD.removeChild(crisis_card);
			document.getElementById("time-" + reqsIds[1]).setAttribute("class", "remove-table");
			
			this.give_crisis_to_players(this.active[reqsIds[1]]);
			
			this.active[reqsIds[1]] = [];
		}
	};
	
	deckObject.give_crisis_to_players = function(criObj) {
		if(criObj.crisis["card_id"] == "goal") {
			game.stats["goal"]++;
		}
		else {
			//Other crisis effects
			for(var playerN in game.players) {
				//var crisis_div = document.createElement("div");
				//crisis_div.setAttribute("class", "levelup_button");
				
				game.saved_info["levelups"]++;
				//crisis_div.setAttribute("id", "levelup-" +playerN+ "-" + game.saved_info["levelups"]);
				//crisis_div.appendChild(document.createTextNode("level up"));

				//document.getElementById("player-"+playerN+"-buttons").appendChild(crisis_div);
			}
		}
	}
	
	deckObject.give_card_to_player = function(card_class) {
		//give player the card they activated
		var card_div = document.createElement("div");
		card_div.setAttribute("class", "player_card");
		game.saved_info["player_cards-" + game.turn.player]++;
		
		card_div.setAttribute("id", "player_card-" +game.turn.player+ "-" + game.saved_info["player_cards-" + game.turn.player]);
		card_div.appendChild(document.createTextNode(this.get_card_display(card_class)));
		card_div.setAttribute("card_id", card_class);
		document.getElementById("player-"+game.turn.player+"-cards").appendChild(card_div);
	}
	
	deckObject.redisplay_time_cards = function() {
		var timeElement = document.getElementById("time_cards");
		timeElement.innerHTML = "";
		
		var tables = [];
		for (var key in this.active) {
			if(this.active[key].length === 0 ) { continue };
			var new_table = document.createElement("table");
			new_table.setAttribute("class", "time-display-table");
			new_table.setAttribute("id", "time-" + key);
			var new_row = new_table.insertRow(0);
			var cell1 = new_row.insertCell(0);
			cell1.setAttribute("id", "td-crisis-" + key)
			var crisis_div = document.createElement("div");
			var crisis_class = "time crisis";
			if(this.active[key].crisis["card_id"] === "goal") {
				crisis_class = "time goal";
			}
			crisis_div.setAttribute("class", crisis_class);
			crisis_div.setAttribute("id", "crisis-" + key);
			crisis_div.setAttribute("crisis_level", this.active[key]["crisis_level"]);
			crisis_div.appendChild(document.createTextNode(this.active[key].crisis["card_id"]));
			crisis_div.appendChild(document.createElement("br"));
			crisis_div.appendChild(document.createTextNode(this.active[key].crisis["card_class"]));
			
			cell1.appendChild(crisis_div);
			
			for (var i = 0; i < this.active[key].reqs.length; i++) { 
				var cell = new_row.insertCell(i + 1);
				cell.setAttribute("id", "td-crisis-" + key + "-" + i);
				var terrain_div = document.createElement("div");
				terrain_div.setAttribute("class", "time " + this.active[key].reqs[i]["terrain"]);
				terrain_div.setAttribute("id", "crisis-" + key + "-" + i);
				terrain_div.appendChild(document.createTextNode(this.get_card_display(this.active[key].reqs[i]["card"])));
				terrain_div.setAttribute("card_id", this.active[key].reqs[i]["card"]);
				cell.appendChild(terrain_div);
			}
			
			tables.push(new_table);
		}
		
		window.requestAnimationFrame(function(timestamp){
			for(var ii = 0;ii < tables.length;ii++) {
				timeElement.appendChild(tables[ii]);
			}
		});
	};
	
	deckObject.get_card_display = function(card_class) {
		var card_parts = card_class.split("-");
		if(card_parts[0] == "classification") {
			return "+" + card_parts[1];
		}
		else {
			return card_class;
		}
	}
	
	deckObject.get_card_effect = function(card_element) {
		card_element.setAttribute("ondragover", "allowDrop(event)");
		card_element.setAttribute("class", card_element.className + " available-move");
		
		var card_parts = card_element.getAttribute("card_id").split('-');
		if(card_parts[0] == "classification") {
			card_element.setAttribute("ondrop", "add_ability(event, '" + card_parts[1] + "')");
		}
		else {
			return 0;
		}
	}	
	
	return deckObject;
}

function new_turn(plyr) {
	var turnObject = {};
	
	turnObject.player = plyr;
	turnObject.actions = 3;
	turnObject.active_effects = {};
	turnObject.aliens_to_remove = [];
	
	turnObject.use_action = function() {
		this.actions--;
		if(game.turn.actions < 0) {
			console.log("something went wrong");
		}
		
		document.getElementById("player-" + plyr + "-actions").innerHTML = "Actions: " + this.actions;
		//Turn off moving player
		//if(this.actions < 2) {
		//	document.getElementById("player-" + (this.player)).setAttribute("draggable", "false");
		//}
		if(this.actions == 0) {
			//Turn off all available actions
			for (var key in game.players[this.player].aliens) {
				document.getElementById("player-" + (this.player) + "-alien-" + key).setAttribute("draggable", "false");
			}
			
			var buttons = document.getElementsByClassName("action-button active");
			for(var key in buttons) {
				var this_button = buttons[key];
				if(isElement(this_button)) {
					this_button.setAttribute("class", "action-button inactive");
				}
				
			}
		}
	}
	
	return turnObject;
}

function create_board() {
		var boardObject = {};
		
		//Tile states
		boardObject.dispaly = "";
		boardObject.isUpdated = 1;
		
		
		//Functions
		boardObject.getTile = function(x, y) {return this[x][y]};
		boardObject.getdisplayCSS = function() {
			if(this.isUpdated) {
				this.generateBoard();
				this.isUpdated = 0;
			}

			return this.display;
		};
		boardObject.updateTile = function(x, y, effect) {
			this.isUpdated = 1;
			this.getTile(x,y).updateTile(effect);
		}
		
		
		var tile_deck = create_tile_deck();
		boardObject.setup = function() {
			for (var row = 0; row < 7; row++) { 
				this[row] = {}; 
				for (var col = 0; col < 7; col++) { 
					var current_tile = create_tile(row, col);
					current_tile.setup();
					current_tile.terrain = tile_deck[boardStart(row, col)].shift();
					this[row][col] = current_tile;
				}
			}
		};
		
		boardObject.generateBoard = function () {
			var output = "";
			for (var col = 0; col < 7; col++) { 
				output += "<div class='tile layout'>\n";
				output += "<div class='tile layout tile-list'>";
				output += "<ol>\n";
				for (var row = 0; row < 7; row++) { 
					var drag = 0;
					if(this.getTile(row, col).isStart){// || this.getTile(row, col).isUp) {
						drag = 0;
					}
					
					var current_tile = this.getTile(row, col).getTileDisplay(drag);
					output += current_tile;
				}	
				output += "</ol>\n";
				output += "</div>\n";			
				output += "</div>\n";
			}
			
			this.display = output;
		}
		
		
		boardObject.update_marks = function(classN, ID) {
			var ids = ID.split("-");
			
			var row = Number(ids[1]);
			var col = Number(ids[2]);
			var ter = game.board.getTile(row, col).terrain;
			
			if(classN != "") {
				if(this.getTile(row, col).isMarked) {
					this.updateTile(row, col, {"unmark" : 1});
					var this_mark = document.getElementById("mark-" + row + "-" + col);
					this_mark.setAttribute("class", "mark-off");
					
					if(ter != "goal") {
						this_mark.setAttribute("draggable", "false");
						this_mark.setAttribute("ondragstart", "");
						this_mark.setAttribute("ondragend", "");
					}
				}
				else {
					this.updateTile(row, col, {"mark" : 1});
					var this_mark = document.getElementById("mark-" + row + "-" + col);
					this_mark.setAttribute("class", "mark-on");
					
					if(ter != "goal") {
						this_mark.setAttribute("draggable", "true");
						this_mark.setAttribute("ondragend", "mark_move_end(" + row + ", " + col + ")");
						this_mark.setAttribute("ondragstart", "mark_move(event, " + row + ", " + col + ")");
					}
				}
			}	
		}
		
		return boardObject;
}	
	

function create_player(playerNum) {
	var playerObject = {};
	
	//Tile states
	playerObject.number = playerNum;
	playerObject["x"] = 3;
	playerObject["y"] = 3;
	playerObject.previous_loc = {"x" : 3, "y" : 3};
	playerObject.coins = 0;
	
	playerObject.aliens = {
		"1" : create_alien(playerNum, 1),
		"2" : create_alien(playerNum, 2),
		"3" : create_alien(playerNum, 3),
		"4" : create_alien(playerNum, 4),
		"5" : create_alien(playerNum, 5)
	};
	
	//Initial conditions for this game (hard coded for now)
	if(playerNum == 1) {
		playerObject.aliens["1"].addAbility({"terrain" : "forest"});
		playerObject.aliens["2"].addAbility({"terrain" : "water"});
		playerObject.aliens["3"].addAbility({"terrain" : "desert"});
		playerObject.aliens["4"].addAbility({"terrain" : "water"});
		playerObject.aliens["5"].addAbility({"terrain" : "desert"});

		playerObject.aliens["1"].levelup();
		playerObject.aliens["1"].addAbility({"classification" : 'diplomacy'});
		
		playerObject.aliens["2"].levelup();
		playerObject.aliens["2"].addAbility({"classification" : 'exploration'});
	}
	else if(playerNum == 2) {
		playerObject.aliens["1"].addAbility({"terrain" : "forest"});
		playerObject.aliens["2"].addAbility({"terrain" : "forest"});
		playerObject.aliens["3"].addAbility({"terrain" : "forest"});
		playerObject.aliens["4"].addAbility({"terrain" : "desert"});
		playerObject.aliens["5"].addAbility({"terrain" : "water"});

		playerObject.aliens["1"].levelup();
		playerObject.aliens["1"].addAbility({"classification" : 'diplomacy'});
		
		playerObject.aliens["2"].levelup();
		playerObject.aliens["2"].addAbility({"classification" : 'science'});
	}
	else {
		//player 3?
	}
	//End hard coded values
	
	create_player_board(playerNum);
	
	//create player board
	function create_player_board(playerN) {
		var span = document.createElement("span");
		span.setAttribute("id", "player-" + playerN + "-board-span");
		span.setAttribute("class", "hidden-board");
		
		var new_table = document.createElement("table");
		new_table.setAttribute("id", "player-" + playerN + "-board");
		new_table.setAttribute("class", "player-board");
		
		var row1 = new_table.insertRow(0);
		var th1 = document.createElement('th');
		th1.appendChild(document.createTextNode("Player " + playerN + " aliens available"));
		row1.appendChild(th1);
		
		var th2 = document.createElement('th');
		th2.setAttribute("id", "player-" + playerN + "-actions");
		row1.appendChild(th2);
		
		var th3 = document.createElement('th');
		row1.appendChild(th3);
		
		
		var row2 = new_table.insertRow(1);
		
		var cell1 = row2.insertCell(0);
		var div1 = document.createElement("div");
		div1.setAttribute("id", "player-" + playerN + "-aliens");
		
		var each_element = [document.createElement("br")];
		for(var ii = 1; ii <= 5; ii++) {
			var new_alien = document.createElement("div");
			new_alien.setAttribute("id", "player-" + playerN + "-alien-" + ii);
			new_alien.setAttribute("draggable", "true");
			new_alien.setAttribute("ondragend", "drag_end_alien(event)");
			new_alien.setAttribute("ondragstart", "drag_alien(event)");
			new_alien.setAttribute("class", "alien-piece " + playerObject.aliens[ii].terrain);
			each_element.push(new_alien)
		}
		for (var key in each_element) {
			div1.appendChild(each_element[key]);
		}
		
		
		cell1.appendChild(div1);
		
		var cell2 = row2.insertCell(1);
		cell2.appendChild(document.createTextNode("Player Actions:"));
		cell2.appendChild(document.createElement("br"));
		cell2.appendChild(document.createTextNode("2 Actions:"));
		cell2.appendChild(document.createElement("br"));
		cell2.appendChild(document.createTextNode("Drag player piece to adjacent space."));
		cell2.appendChild(document.createElement("br"));
		cell2.appendChild(document.createElement("br"));
		cell2.appendChild(document.createTextNode("1 Action:"));
		cell2.appendChild(document.createElement("br"));
		
		var mark_button = document.createElement("button");
		mark_button.innerHTML = "Mark current space";
		mark_button.setAttribute("id", "add_mark-" + playerN);
		mark_button.setAttribute("onclick", "");
		mark_button.setAttribute("class", "action-button active");
		cell2.appendChild(mark_button);
		
		var new_buttons = document.createElement("div");
		new_buttons.setAttribute("id", "player-" + playerN + "-buttons");
		cell2.appendChild(new_buttons);
		
		var new_cards = document.createElement("div");
		new_cards.setAttribute("id", "player-" + playerN + "-cards");
		cell2.appendChild(new_cards);
		
		var cell3 = row2.insertCell(2);
		var end_turn_button = document.createElement("button");
		end_turn_button.innerHTML = "END TURN";
		end_turn_button.setAttribute("id", "end_turn_button");
		end_turn_button.setAttribute("onclick", "game.end_turn()");
		end_turn_button.setAttribute("class", "end-turn");
		cell3.appendChild(end_turn_button);
		
		span.appendChild(new_table);
		
		
		document.getElementById("player-boards").appendChild(span);
	}
	
	
	
	playerObject.getTile = function () {
		return "tile-" + this["x"] + "-" + this["y"];
	}
	
	playerObject.getValidMoves = function () {
		var row = Number(this["x"]);
		var col = Number(this["y"]);
		
		var ret = [];
		var list = [[row + 1, col], [row -1, col], [row, col + 1], [row, col - 1]];
		for (var i = 0; i < list.length; i++) { 
			var row = list[i][0];
			var col = list[i][1];
			
			if(valid_tile(row, col)){
				ret.push(list[i]);
			}
		}
		return ret;
	}
	
	playerObject.getValidAlienMoves = function(alienNum) {
		var list = this.getValidMoves();
		var valid_moves = [];
		for (var i = 0; i < list.length; i++) { 
			var row = list[i][0];
			var col = list[i][1];
			var tile = "tile-" + row + "-" + col;
			var alienClass = "tile " + this.aliens[alienNum].terrain;
			var goalClass = "tile goal";
			var startClass = "tile start"
			
			var divTag = document.getElementById(tile);
			if((divTag.className == alienClass) || (divTag.className == goalClass) || (divTag.className == startClass)) {
				valid_moves.push([row, col]);
			}
		}
		
		return valid_moves;
	}
	
	playerObject.remove_current_mark = function() {
		var row = this["x"];
		var col = this["y"];
		var ter = game.board.getTile(row, col).terrain;
		if((game.turn.actions > 0) && (ter != "start" && ter != "goal") && game.board.getTile(row, col).isMarked){
			var this_tile = document.getElementById("tile-" + row + "-" + col);
			game.board.update_marks(this_tile.className, this_tile.id);
			
			game.turn.use_action();
			game.redisplay_stats_table();
		}
	}
	
	playerObject.add_mark = function() {
		var row = this["x"];
		var col = this["y"];
		var ter = game.board.getTile(row, col).terrain;
		if(ter == "goal") {
			if(game.stats["goal"] > 0) {
				var this_tile = document.getElementById("tile-" + row + "-" + col);
				game.board.update_marks(this_tile.className, this_tile.id);
				//game.board.updateTile(row, col, {"mark" : 1});
				
				
			
				game.turn.use_action();
				game.stats[ter]--;
				game.redisplay_stats_table();	
			}
		}
		else if((game.turn.actions > 0) && (ter != "start") && !game.board.getTile(row, col).isMarked){
			var this_tile = document.getElementById("tile-" + row + "-" + col);
			game.board.update_marks(this_tile.className, this_tile.id);
			//game.board.updateTile(row, col, {"mark" : 1});
			
			
		
			game.turn.use_action();
			game.redisplay_stats_table();
		}
	}
	
	
	return playerObject;
}

function create_alien(playerNum, alienNum) {
	var alienObject = {};
	
	//Tile states
	alienObject.playerNumber = playerNum;
	alienObject.number = alienNum;
	alienObject.terrain = 'none';
	alienObject.level = 1;
	alienObject.open_slots = 1;
	alienObject["x"] = "";
	alienObject["y"] = "";
	
	
	//Classifications are what types of issues you can help out with
	alienObject.classifications = {};
	alienObject.active_abilities = [];
	alienObject.passive_abilities = [];
	
	alienObject.getTile = function () {
		if(this["x"] === "")  {
			return "game-border"
		}
		return "tile-" + this["x"] + "-" + this["y"];
	}
	
	alienObject.levelup = function () {
		if(this.level < 5) {
			this.level++;
			this.open_slots++;
		}
		else{return 0;}
		return 1;
	}
	
	alienObject.addAbility = function(newAbility, slots_taken){
		var slots = 1;
		if(slots_taken !== undefined && slots_taken !== null) {slots = slots_taken}
		if(this.open_slots >= slots) {
			if(newAbility["terrain"]) {
				this.terrain = newAbility["terrain"];
				this.open_slots += -slots;
			}
			if(newAbility["drawcard"]) {
				var card_button = document.createElement("button");
				card_button.setAttribute("class", "action-button active");
				card_button.setAttribute("onclick", "draw_card()");
				
				var t = document.createTextNode("Search for goal");  
				card_button.appendChild(t); 
				
				this.active_abilities.push(card_button);
				this.open_slots += -slots;
			}
			if(newAbility["classification"]) {
				var this_is_new = 1;
				var class_key = Object.keys(this.classifications);
				for(var key in class_key) {
					if(class_key[key] == newAbility["classification"]) {
						this_is_new = 0;
					}
				}
				if(this_is_new) {
					this.classifications[newAbility["classification"]] = 1;
					this.open_slots += -slots;
				}
				else {
					this.classifications[newAbility["classification"]]++;
					this.open_slots += -slots;
				}
			}
		}
		//All slots taken
		else {return 0;}
		return 1;
	}
	
	
	return alienObject;
}		
	

//Tile objects
function create_tile(row, col) {
		var tileObject = {};
		
		//Tile states
		tileObject.isHidden = 0;
		tileObject.isStart = 0;
		tileObject.isUp = 0;
		
		//Terrain attributes	
		tileObject.isMarked = 0;
		tileObject.terrain = "";
		
		//Location
		tileObject['x'] = row;
		tileObject['y'] = col;
		
		
		//Functions
		tileObject.getCoord = function() {return [this['x'], this['y']]};
		tileObject.getdisplayCSS = function() {
			if(this.isHidden){return "hidden"}
			else if(this.isStart){return "start"}
			else if(this.isUp){return this.terrain}
			return "down";
		};
		tileObject.getClassCSS = function() {return "tile " + this.getdisplayCSS()};
		
		
		tileObject.getTileDisplayCSS_class = function(){
			return this.getClassCSS()
		};
		
		tileObject.getTileDisplayCSS_ondragover = function(){
			if(this.isStart || this.isUp) {
				return "allowDrop(event)";
			}
			else return "false";
		};
		
		tileObject.getTileDisplayCSS_ondrop = function(){
			if(this.isStart || this.isUp) {
				return "drop_on_tile(event)";
			}
			else return "false";
		};
		
		
		tileObject.getTileDisplay = function(drag){
			var can_drag = "ondragover='false' ondrop='false'";
			if(drag) {
				can_drag =  "ondragover='allowDrop(event)' ondrop='drop_on_tile(event)'";
			}
			
			var markClass = "mark-off"
			if(this.isMarked && valid_tile(this["x"], this["y"]) && this.isUp){
				markClass = "mark-on";
			}
			var mark = "<div id = 'mark-" + row + "-" + col + "' class = '" + markClass + "'> </div>";
			
			return "<li><a id='tile-" + this['x'] + "-" + this['y'] + "' class = '" + this.getClassCSS() + "' " + can_drag + "> " + mark + "  </a></li>\n";
		};
		
		tileObject.updateTile = function(effect) {
			if(effect["up"]) {
				this.isUp = effect["up"];
			}
			if(effect["unmark"]) {
				this.isMarked = 0;
			}
			if(effect["mark"]) {
				this.isMarked = 1;
			}
		}
		
		
		tileObject.setup = function() {
			var row = this['x'];
			var col = this['y'];
			//Start Tile
			if((row == 3) && col == 3) {
				this.isStart = 1;
				this.isUp = 1;
			}
			
			//Adjacent to start tile
			if(row == 3) {
				if(col == 2) {
					this.isUp = 1;
				}
				if(col == 4) {
					this.isUp = 1;
				}
			}
			if(col == 3) {
				if(row == 2) {
					this.isUp = 1;
				}
				if(row == 4) {
					this.isUp = 1;
				}
			}
			
			//Corners
			if((row === 0) && col === 0) {
				this.isHidden = 1;
			}

			if((row === 0) && col == 6) {
				this.isHidden = 1;
			}
			if((row == 6) && col === 0) {
				this.isHidden = 1;
			}
			
			if((row == 6) && col == 6) {
				this.isHidden = 1;		
			}
		};
		
		return tileObject;
}

function boardStart(row, col) {
	if(row == 1) {
		if((col == 3)) {
			return "start";
		}
	}
	if(row == 2) {
		if((col == 2) || (col == 3) || (col == 4)) {
			return "start";
		}
	}
	if(row == 3) {
		if((col == 1) || (col == 2) || (col == 4) || (col == 5)) {
			return "start";
		}
	}
	if(row == 4) {
		if((col == 2) || (col == 3) || (col == 4)) {
			return "start";
		}
	}
	if(row == 5) {
		if((col == 3)) {
			return "start";
		}
	}
	//Corners
	if((row === 0) && col === 0) {
		 return "hid";
	}

	if((row === 0) && col == 6) {
		return "hid";
	}
	if((row == 6) && col === 0) {
		return "hid";
	}
	if((row == 6) && col == 6) {
		return "hid";
	}
	
	//Start tile
	if((row == 3) && col == 3) {
		return "strt";
	}
	return "end";
}


//Function to check if a tile is on the game board
function valid_tile(row, col) {
	//Edges
	if(!(row >= 0 && row < 7 && col >= 0 && col < 7)){
		return 0;
	}
	//Corners
	if((row === 0) && col === 0) {
		 return 0;
	}

	if((row === 0) && col == 6) {
		return 0;
	}
	if((row == 6) && col === 0) {
		return 0;
	}
	if((row == 6) && col == 6) {
		return 0;
	}
	
	return 1;
}

function create_alien_table(alien) {
	var alien_id = alien.id;
	var ids = alien_id.split('-');
	if((ids[0] + "-" + ids[1] + "-" + ids[2]) == ("player-" + (game.turn.player) + "-alien")) {
		var new_table = document.createElement("table");
		new_table.setAttribute("class", "alien-display-table");
		new_table.setAttribute("id", "table-" + alien_id);
		var new_row = new_table.insertRow(0);
		var cell1 = new_row.insertCell(0);
		cell1.appendChild(alien);
		
		var cell_cnt = 1;
		//Placeholder for now. Will eventually contain ability buttons
		for(var key in game.players[game.turn.player].aliens[ids[3]].active_abilities) {
			var cell2 = new_row.insertCell(cell_cnt);
			cell2.appendChild(game.players[game.turn.player].aliens[ids[3]].active_abilities[key]);
			cell_cnt++
		}
		
		var key_class = Object.keys(game.players[game.turn.player].aliens[ids[3]].classifications);
		for(var key in key_class) {
			var cell2 = new_row.insertCell(cell_cnt);
			cell2.appendChild(document.createTextNode(key_class[key] + " [" + game.players[game.turn.player].aliens[ids[3]].classifications[key_class[key]] + "]"));
			cell_cnt++
		}
		for(var key in game.players[game.turn.player].aliens[ids[3]].passive_abilities) {
			var cell2 = new_row.insertCell(cell_cnt);
			cell2.appendChild(document.createTextNode(game.players[game.turn.player].aliens[ids[3]].passive_abilities[key]));
			cell_cnt++
		}
		if(game.players[game.turn.player].aliens[ids[3]].open_slots) {
			var available_cell = new_row.insertCell(cell_cnt);
			available_cell.appendChild(document.createTextNode("open slots: " + game.players[game.turn.player].aliens[ids[3]].open_slots));
			cell_cnt++;
		}
		return new_table;
	}
	else {
		return 0;
	}
}
	