const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs').promises;
let apiKey = "dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf";
let fetchUrl = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=' + apiKey + '&lang=en-en&text='
const helper = require('./functions/general');

app.get('/', async(req, res)=> {
	// Step 1: Fetch url content in string variable
	let content = await fs.readFile('big.txt', 'utf8'); //http://norvig.com/big.txt
	let top10words = helper.countWords(content);
	let toReturn = [];
	//Step 2: Fetch information from yandex for these top 10 words
	for(let word in top10words) {
		let url = fetchUrl + word;
		try{
			console.log(url);
			let dataForWord = await axios.get(url);
			dataForWord = dataForWord.data.def;
			if (dataForWord.length) {
				let tr = helper.getSynonymsAndPartsOfSpeech(dataForWord); 
				toReturn.push({
					'word' : word,
					'synonyms': tr.synonyms,
					'count': top10words[word],
					'pos': tr.pos
				});
			}
		} catch(e) {
			console.log(e);
			break;
		 }
	}
	//Step 3: Send output in JSON format 
	var output = {
		'top10Words': top10words,
		'wordInfo': toReturn
	}
	console.log("******Finished Processing*******");
	res.send(output);	 
});

const port = process.env.PORT | 8081;
app.listen(port, function() {
    console.log('*****Conversational app listening on port '+ port + "*******");
});
