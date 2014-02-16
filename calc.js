// var keys = document.querySelectorAll('#calculator span');

// console.log("file_loaded")
// console.log(keys.length);

// $("#calculator span").click(function(){
// 	alert("clicked")

function readOperand(tokens){
	num = tokens.shift();
	result = parseInt(num);
	if (isNaN(result))
		throw("Not a number");
	return result;
}

function evaluate(tokens) {
	var operators = ["+", "-", "*", "/"];

	// if (tokens.length == 0)
	// 	throw("Missing operand");


	var value = readOperand(tokens);
	while (tokens.length > 0) {
		var operator = tokens.shift();
		if (operators.indexOf(operator) == -1) {
			throw("Unrecognized operator");
		}
		if (tokens.length == 0) 
			throw("Missing operand");
		var temp = readOperand(tokens);
		value = eval(value + operator + temp);
	}
	return value;
}


function changeNegative(num) {
	if (num == "0")
		return num;
	else if (num.charAt(0) == "-")
		return num.substring(1);
	else return "-" + num;
}


$(function(){
	var lastInput = "";
	var lastNum = 0;
	var lastBit = 0;
	$("#calculator span").click(function(){

		var content = $(this).text();
		if (content == "\xF7")
			content = "/";
		else if (content == "\xD7")
			content = "*";

		var operators = ["+", "-", "/", "*"];
		var notShow = ["MC", "M+", "M-", "MR"]
		var tokens = $(".screen").text().split(" ");

		if (operators.indexOf(content) != -1) {
			var tmp = tokens.pop();
			if (tmp == " ")
				tmp = tokens.pop();
			if (operators.indexOf(tmp) == -1) {

				tokens.push(tmp);
			}
			tokens.push(content);

			$(".screen").text( function(i, originText) {
				return tokens.join(" ") + " ";
			});
		}

		if (content == 'C') {
			$(".screen").text("0");
		}

		else if (content == "\xB1") {
			for (var i = tokens.length - 1; i >= 0; i--) {
				if (tokens[i] == String(lastNum)) {
					tokens[i] = changeNegative(String(lastNum))
					//alert(tokens[i])
				}
			}	
			$(".screen").text( function(i, originText) {
				return tokens.join(" ");
			});
		}

		else if (content == '=') {
			try {
				var val = evaluate(tokens);
				lastNum = val;
				if (tokens.length > 0 ) 
					throw("Ill-formed expression");
				$(".screen").html( function(i, originText) {
					return originText + "<br>" + val;
				});
			} catch (err) {
				$(".screen").html( function(i, originText) {
					return originText + "<br>" + err;
				});
			}
		}

		else if ( !isNaN(parseInt(content)) ) {
			if (tokens[tokens.length - 1] == "0") {
				if (content != "0")
					$(".screen").text(content);
			}
			else {
				$(".screen").text( function(i, originText) {
				return originText + content;
				});
			}
		}

		lastInput = $(this).text();
		lastBit = parseInt(lastInput)
		if (!isNaN(lastBit)){
			lastNum = lastNum * 10 + lastBit;
		}

	});
});
