const removeExtraSpaces = (obj, ...props) => {
	for (let prop of props) {
		obj[prop] = obj[prop].trim().replace(/ +(?= )/g, '');
	}
};

const removeExtraSpacesFromStr = (str) => {
	str = str.trim().replace(/ +(?= )/g, '');
};

module.exports.removeExtraSpaces = removeExtraSpaces;
module.exports.removeExtraSpacesFromStr = removeExtraSpacesFromStr;
