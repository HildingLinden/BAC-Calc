"use strict";

function addEvents() {
	document.getElementById("calculate").addEventListener("click", calculate, false);
	document.getElementById("reset").addEventListener("click", reset, false);
	document.getElementById("drinks").addEventListener("click", addDrinks, false);
}

// Standard of alcohol is the swedish "standardglas" which is 12 grams of pure ethanol
function addDrinks(event) {
	if (event.target.nodeName === "BUTTON") {
		let drinks = document.getElementById("drinks").children;

		for (let i = 0; i < drinks.length; i++) {
			if (drinks[i].children[2] == event.target) {
				drinks[i].children[0].innerHTML = parseInt(drinks[i].children[0].textContent)+1;
			}
		}
		standardGlas += parseFloat(event.target.value);
	}
}

function reset() {
	let drinks = document.getElementById("drinks").children;
	for (let i = 0; i < drinks.length; i++) {
		drinks[i].children[0].innerHTML = 0;
	}
	document.getElementById("permille").innerHTML = "Permille: 0.00";
	standardGlas = 0;
}

let standardGlas = 0;

function calculate() {
	// Constants
	const bodyWaterInBlood = 0.806;
	const bodyWater = [0.58, 0.49];
	const metabolism = [0.015, 0.017];

	// Sex is 0 for male, 1 for female
	let sex;
	let buttons = document.getElementsByName("sex");
	buttons.forEach((button, index) => {
		if (button.checked) { sex = index;}
	});

	// Body wieght in kilogram
	let bodyWeight = document.getElementById("bodyWeight").value;

	// Drinking period in hours
	let drinkingPeriod = document.getElementById("drinkingPeriod").value;

	let totalAlcohol = (bodyWaterInBlood * standardGlas) / (bodyWater[sex] * bodyWeight);
	let alcoholLeft = totalAlcohol - metabolism[sex] * drinkingPeriod;
	let permille = alcoholLeft * 10;

	if (permille > 0) {
		document.getElementById("permille").innerHTML = "Permille: " + permille.toFixed(2);
	} else {
		document.getElementById("permille").innerHTML = "Permille: 0.00";
	}
}