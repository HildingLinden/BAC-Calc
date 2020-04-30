"use strict";

let drinks = new Array();
let chart = null;

function createChart(time, BAC) {
	let context = document.getElementById("chart").getContext("2d");

	chart = new Chart(context, {
		type: "line",
		data: {
			labels: [time],
			datasets: [{
				label: "BAC by weight",
				data: [ BAC ]
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	})
}

function add() {
	// Fetch values from input and store them in a drink object in the drinks array
	let drinkStrength = document.getElementById("drinkStrengthInput").value;
	let drinkSize = document.getElementById("drinkSizeInput").value;
	let drinkTime = document.getElementById("drinkTimeInput").value;

	let drinkTimeInput = document.getElementById("drinkTimeInput").value;
	let time = new Date(Date.now());
	if (drinkTimeInput) {
		let hoursAndMinutes = drinkTime.split(":");
		time.setHours(hoursAndMinutes[0], hoursAndMinutes[1]);
	}

	let hoursAndMinutes = time.toTimeString().split(":");
	let timeString = hoursAndMinutes[0] + ":" + hoursAndMinutes[1];

	let drink = {
		strength: drinkStrength,
		size: drinkSize,
		time: time.getTime(),
		timeString: timeString
	};

	drinks.push(drink);

	drinks.sort((a,b) => a.time-b.time);

	calcBAC();
}

const bodyWaterInBlood = 0.806;
const bodyWater = [0.58, 0.49];
const metabolism = [0.015, 0.017];

function calcBAC() {
	// Sex is 0 for male, 1 for female
	let sex;
	let buttons = document.getElementsByName("sex");
	buttons.forEach((button, index) => {
		if (button.checked) { sex = index;}
	});

	// Body weight in kilogram
	let bodyWeight = document.getElementById("bodyWeight").value;

	// Calculating BAC and adding drinks to list/chart
	let prevTime = drinks[0].time;

	let drinkList = document.getElementById("drinksList");
	drinkList.innerHTML = "";

	let BAC = 0;
	let labels = new Array();
	let data = new Array();

	for (let drink of drinks) {
		let timeElapsed = drink.time - prevTime;
		timeElapsed = timeElapsed / (1000 * 3600);

		//console.log(BAC);
		BAC -= metabolism[sex] * timeElapsed * 10;
		BAC = Math.max(BAC, 0);
		//console.log(BAC);

		let alcVol = (drink.strength / 100) * drink.size;
		let alcMass = alcVol * 0.789;
		let standardGlas =  alcMass / 12;

		let bloodAlcohol = (bodyWaterInBlood * standardGlas)  / (bodyWater[sex] * bodyWeight);
		BAC += bloodAlcohol * 10;

		labels.push(drink.timeString);
		data.push(BAC);

		let li = document.createElement("li");
		li.appendChild(document.createTextNode("Size: " + drink.size + "cl, Strength: " + drink.strength + "%, Time: " + drink.timeString));
		drinkList.appendChild(li);

		prevTime = drink.time;
	}

	// Add to chart
	if (chart === null) {
		createChart("", "");
	}

	chart.data.labels = labels;
	chart.data.datasets[0].data = data;
	chart.update();
}