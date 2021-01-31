
const getLastPart= function (completeString, seperator) {
    return completeString.substring(completeString.lastIndexOf(seperator) + 1);
  };

  module.exports = {
	  getLastPart
  }