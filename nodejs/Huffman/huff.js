function sortingPairsBubble(m){
   let temp = 0;
   for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m.length - i - 1; j ++) {
         if (m[j][1] > m[j+1][1]){
            temp = m[j];
            m[j] = m[j+1];
            m[j+1] = temp;
         }
      }
   }
   return m;
}// сортируем массив от большего к меньшему кол-ва повторов элементов

function createJSON(table) {
   let data = JSON.stringify(table, null, 2);
   fs.writeFile(tableFile, data, (err) => {
      if (err) console.log(err);
      console.log('Создан файл с таблицей кодов');
   });
}

function tree(ps) {
   if (ps.length < 2) {
      return ps[0]; //полностью построенное дерево
   }
   else {
      return tree(sortingPairsBubble([[ps.slice(0, 2), ps[0][1] + ps[1][1]]].concat(ps.slice(2))));
   }
}

//преобразование дерева в таблицу кодов
function codes(tree, pfx="") {
   //Oператор  instanceof проверяет, принадлежит ли объект к данной категории.
   if (tree[0] instanceof Array) {
      return Object.assign(codes(tree[0][0], pfx + "0"), codes(tree[0][1], pfx + "1"));
      //return { codes(tree[0][0], pfx + "0"), codes(tree[0][1], pfx + "1") };
   }
   else {
      return {[tree[0]]: pfx};
   }
}

function readJSON() {
   let rawdata = fs.readFileSync(tableFile);
   let table = JSON.parse(rawdata);
   return table;
}


function encode(from) {
   let stringArr = fs.readFileSync(from).toString().split("");
   let charCode = {};
   let encoded = "";
   stringArr.forEach(s => charCode[s] = stringArr.filter(i => i == s).length); //кладем в этот массив символ и его кол-во повторов(это НЕ будет, массив в массиве(один массив))
   //Метод filter() создаёт новый массив со всеми элементами, прошедшими проверку, задаваемую в передаваемой функции.
   let arr = [];
   for (let key in charCode) {
      arr.push([key, charCode[key]]);
   }//кладем в этот массив символ и его кол-во повторов(это будет, массив в массиве)

   arr = sortingPairsBubble(arr);

   let codesObj = codes(tree(arr));

   //составляем закодированную строку
   for (let i = 0; i < stringArr.length; i++) {
      for (let key in codesObj) {
         if(stringArr[i] == key)
            encoded += codesObj[key];           
      }
   }
      
   let table = {}; 

   //составляем таблицу
   Object.entries(codesObj).forEach(([key, value]) => { //Object.entries() метод возвращает массив собственных перечисляемых свойств указанного объекта в формате [key, value]
      //Метод forEach() выполняет указанную функцию один раз для каждого элемента в массиве.
      table[value] = key
   });
   createJSON(table);
   write(encoded);
}


function decode(from) {
   let string = fs.readFileSync(from).toString().split(""); 
   let decoded = "";
   let table = readJSON();   
   //пробегаемся по массиву символов
   for (let i = 0; i < string.length; i++){
      if (table.hasOwnProperty(string[i])) {//Метод hasOwnProperty() возвращает логическое значение, указывающее,  имеет ли обЪкт указанное свойство в качестве собственного свойства
         //если значение кода есть в таблице, то не делаем ничего
      } else if (string[i+1] != undefined) {
         //иначе, если мы не дошли до конца массива, то объединяем строку со следующей и заменяем её на ^
         string[i + 1] = string[i] + string[i + 1];
         string.splice(i, 1, "^");
      } 
   }
   let err = 0;
   for (let i = 0; i < string.length; i++) {   
      if (string[i] != "^") {
         if (table[string[i]] != undefined) {//Undefined — это примитивный тип данных, состоящий из одного значения undefined
            decoded += table[string[i]];
         }
         else {
            err = 1;
            break;
         }
      } 
   }
   if (err == 0) {
      write(decoded);
   }
   else {
      console.log("Ошибка декодирования");
   }
}


function write(text) {
   fs.writeFile(to, text, "utf8", (err) => {
      if (err) {
         console.log(err);
      }
      console.log("Успешно");
   });
}


let fs = require("fs");
let arg = process.argv;
let action = arg[2];
let from = arg[3];
let tableFile = arg[4];
let to = arg[5];

if (action == '--encode') {
   try {
      if (tableFile != undefined && to != undefined) encode(from);
      else console.log("Не указан файл на выход");
   }
   catch (err) {
      console.log("Ошибка в чтении файла");
   }
} else if (action == '--decode'){
   try {
      if (to != undefined) decode(from);
      else console.log("Не указан файл на выход");
   }
   catch (err) {
      console.log("Ошибка в чтении файла");
   }
} else {
   console.log("Ошибка метода");
}