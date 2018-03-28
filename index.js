var opratorArray = [];//中缀转后缀时存放符号的运算符数组
var suffixArray = [];//后缀表达式
var numberArray = [];//计算后缀表达式时存放数字的数组
var expressionArray = [];//将字符串形式的表达式转换为数组形式的表达式

//第一步：将参数(json data)传到表达式expression中，参数是json，expression中有x、y、z等参数，将对应的字母换成json中对应键对应的值就行
//遍历表达式，判断遇到的数如果出现在json的键中 则将此处的值换位json中对应键的值就好
//是不是应该把表达式字符串转还为数组呢，但是要将表达式中数字部分转换为数字、表达式中符号部分转换为字符串。不可行，因为表达式中的参数都是字母，所以将表达式转换为数组就好
//涉及到两个步骤，1.取出data中键对应的值。2.将这个值写入到expression中对应的位置

//由于取不到data中对应的键，也就取不到键对应的值，所以考虑将data转换为数组
var dataArray = [];


var simpleCaculate = function(expression,data) {
	//将data转换为数组
	for (var i in data) {
		dataArray.push(i);
		dataArray.push(data[i]);
	}
	//将字符串形式的表达式转换为数组 
	expressionArray = expression.split('');
	for (var i = 0; i < expressionArray.length; i++) {
		var temp = expressionArray[i];//得到的temp为
		//遍历dataArray，找到temp在dataArray中对应的值，取后面一个值赋给expressionArray
		for (var j = 0; j < dataArray.length; j ++) {
			if (dataArray[j] == temp) {
				expressionArray[i] = dataArray[j + 1];//取j后面一个数赋给expressionArray
			}
		}
		
	}
	return inffix2Suffix(expressionArray);//得到的expressionArray中，符号是字符串 ，而 数字是数字
}


//第二步:通过第一步后得到的中缀表达式realExpression中将不包含x、y、z等字母，转换成后缀表达式
var inffix2Suffix = function(expressionArray) {
	for (var i = 0; i < expressionArray.length; i++) {
		var temp = expressionArray[i];

		if (temp == '*' || temp == '/' || temp == '(') {//如果为* / ( 则直接入栈
			opratorArray.push(temp);

		} else if (temp == '+' || temp == '-') {  //如果为+ - ，判断此时运算符栈的栈顶元素是否为‘（’，如果不是 则需要将运算符栈里面的符号全部弹出到后缀表达式中 直到遇到 '('，然后将它入栈
			if (opratorArray.length == 0) {
				opratorArray.push(temp);
			} else {
				var po = opratorArray.pop();//弹出栈顶元素
				while (po != '(' && opratorArray.length > 0) {//遇到pop()记得判断栈大小是否为空，不然容易导致栈溢出
					suffixArray.push(po);
					po = opratorArray.pop(); 
				}
				if (po == "+" || po == '-') {//当运算符栈中最后一个弹出的数为+或者-时，记得让这个数进入后缀表达式中
					suffixArray.push(po);
				}
				if (po == '(') {//当弹出的元素为‘（’时，记得把它推回原位。
					opratorArray.push(po);
				}
				opratorArray.push(temp);
			}
		} else if (temp == ')') {  // 如果为 ‘）’ 则需要将运算符栈的符号全部弹出到后缀表达式中，直到遇到‘（’，将‘（’抛弃
			var po = opratorArray.pop();//弹出运算符栈中栈顶元素
		    while (po != '(' && opratorArray.length > 0) {
		    	suffixArray.push(po);//当弹出的栈顶元素不是'('并且运算符栈长度大于0时，将po推进后缀数组中
		    	po = opratorArray.pop();
		    }
		    //此时栈顶元素为'('且已被弹出运算符栈
		    if (po != '(') {
		    	throw "错误：没有匹配"
		    }
		} else {
			suffixArray.push(temp);
		}

	}
	while (opratorArray.length > 0) {
		suffixArray.push(opratorArray.pop());
	}

	return caculateSuffix(suffixArray);//后缀表达式中的数字为数字，符号为字符串
}
// console.log(inffixToSuffix('8+(9-1)*8+7/2'));

//第三步：计算后缀表达式
var caculateSuffix = function (suffixArray) {
	for (var i = 0; i < suffixArray.length; i++) {
		var temp = suffixArray[i];
		//如果为符号，则将数字表达式中的后两位数弹出进行运算(需要将字符串转换为数字才能进行计算)，然后将运算结果放入到数字表达式中
		if (temp == '+') {
			var backNumber = numberArray.pop();
			var frontNumber = numberArray.pop();
			// var result = parseFloat(frontNumber) + parseFloat(backNumber);//注意，这里要将backNumber和frontNumber转换为数字
			var result = frontNumber + backNumber;
			//然后将计算结果result放回到数字表达式中
			numberArray.push(result);
		} else if (temp == '-') {
			var backNumber = numberArray.pop();
			var frontNumber = numberArray.pop();
			var result = frontNumber - backNumber;
			// var result = parseFloat(frontNumber) - parseFloat(backNumber);
			numberArray.push(result);
		} else if (temp == '*') {
			var backNumber = numberArray.pop();
			var frontNumber = numberArray.pop();
			// var result = parseFloat(frontNumber) * parseFloat(backNumber);
			var result = frontNumber * backNumber;
			numberArray.push(result);
		} else if (temp == '/') {
			var backNumber = numberArray.pop();
			var frontNumber = numberArray.pop();
			// var result = parseFloat(frontNumber) / parseFloat(backNumber);
			var result = frontNumber / backNumber;
			numberArray.push(result);
		} else {   //如果为数字，则直接放入数值数组中
			numberArray.push(temp);
		}
	}
	console.log(numberArray[0]);
	return numberArray[0];//将计算得到的result返回

}

// var expression = '(x+y)*z';
// var data = {
//         x: 0.1,
//         y: 0.2,
//         z: 1
//     };


 // console.log(simpleCaculate(expression,data));
module.exports = simpleCaculate;

	//需要解决的问题，1.函数的调用(解决)。2.caculateSuffix中将数字数组中的元素转换为数字(解决)。
	//3.中缀表达式转后缀时的栈溢出问题(解决)。4.如何将json参数中的值传到expressionArray中（解决）
	//5.通过`Module.exports = 方法` 将方法暴露出去













