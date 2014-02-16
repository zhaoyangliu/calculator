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
	var lastNum = "";
	var lastBit = "";
	var lastEqual = 0;
	var throwError = 0;

	function reset(resetContent){
		if (resetContent == undefined) {
			$(".screen").text("0");
			lastNum = "";
		}
		else {
			$(".screen").text(resetContent);
		}
		lastInput = "";
		lastBit = "";
		lastEqual = 0;
		throwError = 0;
	}

	$("#calculator span").click(function(){

		var content = $(this).text();
		if (content == "\xF7")
			content = "/";
		else if (content == "\xD7")
			content = "*";

		var operators = ["+", "-", "/", "*"];
		var notShow = ["MC", "M+", "M-", "MR"]

		if (throwError) {
			reset();
		}
		
		if ($(".screen").text().length > 15) {
			alert("Too long input");
			throwError = 1;
			content = ""
		}

		var tokens = $(".screen").text().split(" ");
		var tmp = tokens.pop();
		if (tmp != "" && tmp!=undefined)
			tokens.push(tmp)

		if (lastEqual){
			if (!isNaN(parseInt(content)))
				reset();
			else if (operators.indexOf(content) != -1 )
				reset(lastNum)
			if (content == "=") {
				if (tokens.length == 2)
					reset(lastNum);
				else {
					tokens.pop()
					var tmpNum = tokens.pop()
					reset(lastNum + " " + tokens.pop() + " " + tmpNum)
				}
			}

		}
		var tokens = $(".screen").text().split(" ");

		if (operators.indexOf(content) != -1) {
			var tmp = tokens.pop();
			if (operators.indexOf(tmp) == -1) {
				tokens.push(tmp);
			}
			tokens.push(content);

			$(".screen").text( function(i, originText) {
				return tokens.join(" ") + " ";
			});
		}

		else if (content == 'C') {
			reset();
		}

		else if (content == "\xB1") {
			for (var i = tokens.length - 1; i >= 0; i--) {
				if (tokens[i] == lastNum) {
					tokens[i] = changeNegative(lastNum)
					lastNum = tokens[i];
				}
			}	
			$(".screen").text( function(i, originText) {
				return tokens.join(" ");
			});
		}

		else if (content == '=') {
			try {
				var val = evaluate(tokens);
				lastNum = String(val);				//the negative should be detect "current number".
				lastEqual = 1;
				if (tokens.length > 0 ) 
					throw("Ill-formed expression");
				$(".screen").html( function(i, originText) {
					return originText + "<br>" + " " + val;
				});
			} catch (err) {
				$(".screen").html( function(i, originText) {
					return originText + "<br>" + err;
				});
				throwError = 1;
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

			
			if (operators.indexOf(tokens[tokens.length - 1]) != -1 ) {
				lastNum = "";
			}
		}

		lastInput = $(this).text();
		lastBit = parseInt(lastInput)
		if (!isNaN(lastBit)){
			lastNum = lastNum + String(lastBit);
		}

	});
});
