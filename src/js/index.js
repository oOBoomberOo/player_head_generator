let inputBox = document.querySelector('#username');
let inputButton = document.querySelector('#generate');
let textAreas = document.querySelectorAll('textarea');
let giveResult = document.getElementById('give-result');
let advResult = document.getElementById('advancement-result');
let nbtResult = document.getElementById('nbt-result');

for (let textArea of textAreas) {
	textArea.addEventListener('click', event => {
		event.target.focus();
		event.target.select();
	});
}

inputButton.addEventListener('click', event => {
	giveResult.innerText = '';
	advResult.innerText = '';
	nbtResult.innerText = '';
	generatePlayerHead();
});

async function generatePlayerHead() {
	try {
		let timestamp = Date.now();
		let username = inputBox.value;
		let proxy = `https://cors-anywhere.herokuapp.com/`;
		let uuidFetcher = `https://api.mojang.com/users/profiles/minecraft/{username}?at={timestamp}`;
		let skinFetcher = `https://sessionserver.mojang.com/session/minecraft/profile/{uuid}`;
		let data = await fetch(proxy + uuidFetcher.replace('{timestamp}', timestamp).replace('{username}', username)).then(response => response.json());
		let uuid = data.id;
		let skinData = await fetch(proxy + skinFetcher.replace('{uuid}', uuid)).then(response => response.json());
		if (skinData.properties) {
			playerHead(skinData);
		}
	}
	catch(error) {
		throw(error);
	}
}

function playerHead({name, properties}) {
	const nbtTemplate = `{SkullOwner:{Name: "${name}", Properties: {textures: [{textures}]}}}`;
	const textureTemplate = `{Value: "{texture}"}`;
	let result = [];
	for (let texture of properties) {
		let data = textureTemplate.replace('{texture}', texture.value);
		result.push(data);
	}

	let resultString = nbtTemplate;
	resultString = resultString.replace('{textures}', result.join(', '));
	let escapedString = resultString.replace(/\"/g,'\\"');

	giveResult.innerHTML = `/give @p player_head${escapedString}`;
	advResult.innerHTML = `"icon": {\n   "item": "minecraft:player_head",\n   "nbt": "${escapedString}"\n}`;
	nbtResult.innerHTML = `${escapedString}`;
}