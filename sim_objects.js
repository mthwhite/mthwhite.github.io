'use strict';


//Set up and run the simulation
var simulation = new_simulation();
simulation.setup(30); //Create Rule30

var run_iterations = "";
var currently_running = 0;
function start_simulation() {
	if(!currently_running) {
		currently_running = 1;
		simulation.sim_data.create_display();
		document.getElementById("show_result").innerHTML = simulation.get_display().innerHTML;
	
		run_iterations = setInterval(function() {
			simulation.iterate();
			simulation.sim_data.create_display();
			document.getElementById("show_result").innerHTML = simulation.get_display().innerHTML;
		}, 500);
	}
}

function stop_simulation() {
	if(currently_running) {
		clearInterval(run_iterations);
		currently_running = 0;
	}
}

function refresh_simulation() {
	stop_simulation();
	simulation = new_simulation();
	simulation.setup(30); //Create Rule30

	run_iterations = "";
	currently_running = 0;
	
	start_simulation();
}

//End running the simulation

function new_simulation () {
	var sim_object = {};
	
	//create data
	var data_obj = create_data();
	sim_object.sim_data = data_obj;
	
	sim_object.setup = function(rule) {
		if(rule > 255) {rule = rule % 255}
		var add_rule = rule.toString(2).split("");
		var rules = this.sim_data.output;
		
		var i = 7;
		while(add_rule.length > 0) {rules[i] = add_rule.pop();i--};
		
		this.sim_data.output = rules;
		this.sim_data.data_table = [["0", "1", "0"]];
		this.sim_data.create_display();
	}
	
	sim_object.iterate = function() {
		
		for(var j in this.sim_data.data_table) {
			this.sim_data.data_table[j].unshift("0");
			this.sim_data.data_table[j].push("0");
		}
		
		var last_line = this.sim_data.data_table.pop();
		
		var new_iteration = ["0"];
		for(var i = 1;i < last_line.length-1;i++) {
			new_iteration.push(this.sim_data.calculate(last_line[i-1],last_line[i], last_line[i+1]));
		}
		new_iteration.push("0");
		this.sim_data.data_table.push(last_line);
		this.sim_data.data_table.push(new_iteration);
	}
	
	sim_object.get_display = function() {
		return this.sim_data.display;
	}
	
	return sim_object;
}

function create_data() {
	var data_object = {};
	
	data_object.data_table = [];
	data_object.display = "";
	data_object.output = ["0", "0", "0", "0", "0", "0", "0", "0"];
	data_object.situations = {"111" : 0, "110" : 1, "101" : 2, "100" : 3, "011" : 4, "010" : 5, "001" : 6, "000" : 7};
	
	data_object.calculate = function(left, middle, right) {
		var combo = left + middle + right;
		return this.output[this.situations[combo]];
	}
	
	data_object.create_display = function() {
		this.display = document.createElement("span");
		
		var classes = ["off", "on"];
		for(var k in this.data_table) {
			var this_div = document.createElement("div");
			this_div.setAttribute("class", "new-row");
			for(var kk in this.data_table[k]) {
				var this_span = document.createElement("span");
				this_span.setAttribute("class", "tile " + classes[this.data_table[k][kk]]);
				this_div.appendChild(this_span);
			}
			this_div.appendChild(document.createElement("br"));
			this.display.appendChild(this_div);
		}
	}
	
	return data_object;
}