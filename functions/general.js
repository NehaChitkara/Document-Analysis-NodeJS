/**
 * Returns obj having all strings with string occurances
 * */
exports.createStringArray = function (str){
  let countObj = {};
  let arrOfWords = [];
   str = str.replace(/(^\s*)|(\s*$)|(\*)/gi,"");
   str = str.replace(/[ ]{2,}/gi," ");
   str = str.replace(/\n/g," ").replace(/!/g,"").replace(/-/g," ").replace(/,/g," ").replace(/{/g," ").replace(/}/g," ").replace(/}/g," ");
   let strArray = str.split(' ');
   for(let element of strArray) {
	element = element.replace(/"/g, '');
	let len = element.toString().trim().length;
	if ( len > 0) {
		arrOfWords.push(element);
		countObj[element] = 1 + (countObj[element] || 0);
	}
}
   return countObj;
}

/**
 * Returns the top 10 words
 * */
exports.countWords = function(str) {
   
	//Step 1: create array of words and count occurrence of each word
   let counts = this.createStringArray(str);
	let sortedArray =[];
   for (let txt in counts) {
		sortedArray.push([txt, counts[txt]]);
	}
	
	sortedArray.sort(function(a, b) {
	    return b[1] - a[1];
	});
	let top10 = sortedArray.slice(0,10);
	let top10Obj ={};
	for(let ele of top10)
	{
		top10Obj[ele[0]] = ele[1];
	}
	return top10Obj;
}

/**
 * Fetches synonyms and parts of speech using the yandex api
 * */
exports.getSynonymsAndPartsOfSpeech = function(data) {
		let synonyms = new Set();
	let pos=  new Set();
	let translations = data[0].tr;
	if(!translations)
	{
		return {};
	}
	if (translations.length) {
		for (let tr of translations) {
			 
			synonyms.add(tr.text);
			pos.add(tr.pos);
		}
	}
	var obj =  {
		synonyms: synonyms.size? Array.from(synonyms).join(','):'',
		pos: pos.size? Array.from(pos).join(','):''
	}
	return obj;
}
