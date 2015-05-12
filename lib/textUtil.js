'use strict';

/**
 * Normalize text (spaces and lines)
 */
var normalize = function(input) {
    return input.replace(/(\r\n|\n|\r)/gm,"").replace(/\s{2,}/g, ' ').trim();
};

var lastLine = function(input) {
  var lines = input.split(/\r?\n/);
  if (lines.length > 0) {
      return lines[lines.length - 1];
  } else {
      return '';
  }
};

var removeLastLine = function(input) {
    if(input.lastIndexOf('\n') > 0) {
        return input.substring(0, input.lastIndexOf('\n'));
    }
}

var lastPathComponent = function(input) {
  return input.match(/([^\/]*)\/*$/)[1];
};

module.exports = {
    normalize: normalize,
    lastLine: lastLine,
    removeLastLine: removeLastLine
};


String.prototype.normalize = function() {
    return normalize(this);
};

String.prototype.lastLine = function() {
    return lastLine(this);  
};

String.prototype.removeLastLine = function() {
    return removeLastLine(this);  
};

String.prototype.lastPathComponent = function() {
    return lastPathComponent(this);  
};