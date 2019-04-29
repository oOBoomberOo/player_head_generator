let total = document.querySelector('section #total');
let recent = document.querySelector('section #recent');
let sale = document.querySelector('section #sale-velocity');
let proxy = 'https://cors-anywhere.herokuapp.com/';
let url = 'https://api.mojang.com/orders/statistics';
let xhr = new XMLHttpRequest();

getStat();

function getStat() {
	xhr.open('POST', proxy + url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
    "metricKeys": [
			"item_sold_minecraft",
			"prepaid_card_redeemed_minecraft"
    ]
	}));
	setTimeout(getStat, 60 * 1000);
}

xhr.onreadystatechange = function() {
	if (this.readyState != 4) return;
	if (this.status == 200) {
		let data = JSON.parse(this.responseText);
		total.innerText = `Total: ${separator(data.total)}`;
		recent.innerText = `Last 24hr: ${separator(data.last24h)}`;
		sale.innerText = `Sale Velocity: ${data.saleVelocityPerSeconds}`;
	}
}

function separator(n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}