let inputBox = document.querySelector('#username');
let inputButton = document.querySelector('#generate');
let giveResult = document.getElementById('give-result');
let advResult = document.getElementById('advancement-result');
let nbtResult = document.getElementById('nbt-result');
let errorBox = document.querySelector('#errorBox');
let errorMessage = errorBox.querySelector('#errorMessage');

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
		console.log(error);
	}
}

function playerHead({name, properties}) {
	const nbtTemplate = `{SkullOwner:{Name: ${name}, Properties: {textures: [{textures}]}}}`;
	const textureTemplate = `{Value: {texture}}`;
	let result = [];
	for (let texture of properties) {
		let data = textureTemplate.replace('{texture}', texture.value);
		result.push(data);
	}

	let resultString = nbtTemplate;
	resultString = resultString.replace('{textures}', result.join(', '));

	giveResult.innerHTML = `/give @p player_head${resultString}`;
	advResult.innerHTML = `icon: {\n   "item": "minecraft:player_head",\n   "nbt": "${resultString}"\n}`;
	nbtResult.innerHTML = `${resultString}`;
}