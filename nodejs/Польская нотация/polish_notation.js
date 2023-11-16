function isNumber(num) {
	return typeof num === 'number' && !isNaN(num);
}

function typeFilter(list) {
   for (let i = 0; i < list.length; i++){
      if (isNumber(Number(list[i]))){
         list[i] = Number(list[i]);
      }
   }
   return list;
}

function stringToExpression(string) {
   let list = [];
   for (let i = 0; i < string.length; i++) {
      if (string[i] == ' ') {
         continue;
      }
      if (string[i+1] == '.') {
         list.push(string[i]);
         list[list.length-1] += string[i+1];
         i += 2;
         for (let j = i; isNumber(Number(string[j])) && string[j] != ' '; j++) {
            list[list.length-1] += string[j];
            i = j;
         }
      }
      else if (isNumber(Number(string[i])) && isNumber(Number(string[i+1]) && string[i+1] != ' ') ) {
         list.push(string[i]);
         i += 1;
         for (let j = i; isNumber(Number(string[j])) && string[j] != ' '; j++) {
            list[list.length-1] += string[j];
            i = j;
         }
      }
      else {
         list.push(string[i]);
      }
   
   }
   return list;
}


function checker(list){
   let err = 0;
   try {
      let arr = [];
      for (let i = 0; i < list.length; i++){
         if (list[i] == '^'){
            arr.push('**');
         }
         else {
            arr.push(list[i]);
         }
         if (isNumber(list[i]) && isNumber(list[i+1])) {
            err = 1;
         }
      }
      eval(arr.join(''));
   }
   catch {
      err = 1;
   }
   
   return err;
}

let string = process.argv[2];
let data = [];

data = stringToExpression(string);

data = typeFilter(data);

let Priority = {
   '+' : 0,
   '-' : 0,
   '*' : 1,
   '/' : 1,
   '^' : 2
}

let stack = [];
let out = "";

let err = checker(data);

if (err == 0) {
   for (let i = 0; i < data.length; i++) {
      if (isNumber(data[i])) {
         out += `${data[i]} `;
      }
      else {
         if (stack.length > 0) {
            switch (data[i]) {
               case '(':
                  stack.push(data[i]);
                  break;
               case ')':
                  while (stack[stack.length - 1] != '(') {
                     out += `${stack.pop()} `;
                  }
                  stack.pop();
                  break;
               default:
                  if (Priority[data[i]] <= Priority[stack[stack.length - 1]]) {
                     while ((stack[stack.length - 1] != '(' && stack.indexOf('(') > -1) || (stack.length != 0 && stack.indexOf('(') == -1)) {
                        out += `${stack.pop()} `;
                     }
                     stack.push(data[i]);
                  }
                  else {
                     stack.push(data[i]);
                  }
            }
         }
         else {
            stack.push(data[i]);
         }
      }
   }
   while (stack.length != 0) {
      out += `${stack.pop()} `;
   }
   
   console.log(`1. Выражение в обратной польской записи: ${out}`);
   
   let res = [];
   
   res = stringToExpression(out)
   res = typeFilter(res);
   
   for (let i = 0; i <= res.length; i++) {
      if (isNumber(res[i])) {
         stack.push(res[i]);
      }
      else {
         switch(res[i]) {
            case '+':
               stack[stack.length-2] = stack[stack.length-2] + stack[stack.length-1]
               stack.pop();
               break;
            case '-':
               stack[stack.length-2] = stack[stack.length-2] - stack[stack.length-1]
               stack.pop();
               break;
            case '*':
               stack[stack.length-2] = stack[stack.length-2] * stack[stack.length-1]
               stack.pop();
               break;
            case '/':
               stack[stack.length-2] = stack[stack.length-2] / stack[stack.length-1]
               stack.pop();
               break;
            case '^':
               stack[stack.length-2] = stack[stack.length-2] ** stack[stack.length-1]
               stack.pop();
               break;
         }
      }
   }
   console.log(`2. Результат подсчёта этого выражения: ${stack[0]}`);
}
else {
   console.log('Ошибка в выражени');
}
