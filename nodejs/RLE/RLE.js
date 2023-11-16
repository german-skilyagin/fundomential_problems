function escapeEncode() {
   fs.readFile(from, "utf8", (err, data) => {
      let string = data.toString();
      let encoded = "";
      for (let i = 0, j = 0; i < string.length; i = j) { 
         let symb = string[i];
         let add = symb == "#" ? 0 : 4;
         j = i + 1;
         while (string[j] == symb && j < string.length && (j - i) < (255 + add)) {
            j++;
         } 
         let count = j - i;
         if (count >= 4 || symb == "#") {
            let countSymb = String.fromCodePoint(count - add);//возвращает строку, созданную из указанной последовательности кодовых точек.
            encoded = encoded.concat("#").concat(countSymb).concat(symb);
         } else {
            while (count > 0){
               encoded = encoded.concat(symb);//объединяет строковые аргументы вызывающей строки и возвращают новую строку.
               count--;
            }
         }
      }
      write(encoded);
   });
}


function escapeDecode() {
   fs.readFile(from, (err, data) => {
      let string = data.toString();//возвращает строку, представляющую объект
      let decoded = "";
      for (let i = 0; i < string.length; i++) {
         let symb = string[i];
         if (symb == "#") {
            i += 1;
            let countSymb = string[i];
            let count = countSymb.codePointAt(0); // возвращает неотрицательное целое число, являющееся закодированным  значением кодовой точки. 
            i += 1;
            symb = string[i];
            count = count + (symb == "#" ? 1 : 4);
            while (count > 0) {
               decoded = decoded.concat(symb);
               count--;
            }
         } else {
            decoded = decoded.concat(symb);
         }
      }
      write(decoded);
   });
}


function jumpEncode() {
   fs.readFile(from, "utf8", (err, data) => {
      let string = data.toString();
      let encoded = "";      
      let symbRep = 1;
      let symbNotRep = 0;
      for (let i = 0; i < string.length; i++) {
         if (string[i + 1] != string[i]) {
            if (symbRep == 1) {
               symbNotRep += 1;
            } else if (symbRep > 1) {
               while (symbRep > 127) {
                  encoded = encoded.concat(String.fromCodePoint(127)+string[i]);
                  symbRep -= 127;
               }
               encoded = encoded.concat(String.fromCodePoint(symbRep)+string[i]);
               symbRep = 1;
            }
         } else {
            symbRep += 1;
         }
         if (symbNotRep >= 1 && (i == string.length-1 || string[i] == string[i+1])) {
            if (symbNotRep < 128) {
               encoded = (i == string.length-1) ? encoded.concat(String.fromCodePoint(symbNotRep+127) + string.slice(i-symbNotRep+1, i+1)) : encoded.concat(String.fromCodePoint(symbNotRep+127) + string.slice(i-symbNotRep, i));//String.fromCodePoint()
               //String.fromCodePoint()Метод возвращает строку, заданную кодами символов, введенными в аргументыМетод возвращает строку, заданную кодами символов, введенными в аргументы
            } else {
               while (symbNotRep > 127) {
                  encoded = (i == string.length-1) ? encoded.concat(String.fromCodePoint(255) + string.slice(i - symbNotRep + 1, 128)) : encoded.concat(String.fromCodePoint(255) + string.slice(i-symbNotRep, 128));
                  //slice() извлекает участок строки и возвращает его в виде новой строки, не изменяя исходную строку.
                  symbNotRep -= 128;
               }
               encoded = (i == string.length-1) ? encoded.concat(String.fromCodePoint(symbNotRep+127) + string.slice(i-symbNotRep+1, i+1)) : encoded.concat(String.fromCodePoint(symbNotRep+127) + string.slice(i-symbNotRep, i));
            }
            symbNotRep = 0;
         }
      }
      write(encoded);
   });
}

function jumpDecode() {
   fs.readFile(from, "utf8", (err, data) => {
      let string = data.toString();//возвращает строку, представляющую объект
      let decoded = "";
      for (let i = 0; i < string.length-1; i++) {
         symb = string[i];
         if (symb.codePointAt(0) < 128) {
            decoded = decoded.concat(string[i+1].repeat(symb.codePointAt(0)));//concat() объединяет строковые аргументы вызывающей строки и возвращают новую строку.
            //repeat() создает и возвращает новую строку который содержит указанное количество копий строки, в которой он был вызван, сцеплены вместе.
            i += 1;
         } else {
            decoded = decoded.concat(string.slice(i+1, i+symb.codePointAt(0)-127+1));
            i += symb.codePointAt(0)-127;
         }
      }
      write(decoded);
   });
}


function write(text) {
   fs.writeFile(to, text, "utf8", (err) => {
      if (err) {
         console.log(err);
      }
      console.log("Успешно");
   });
}

let fs = require('fs');
let arg = process.argv;
let from = arg[4];
let to = arg[5];

try {
   const fr = fs.readFileSync(from, 'utf8');
   if (to != undefined){
      if (arg[2].toString() == "--encode" && arg[3].toString() == "--escape") {
         escapeEncode();
      } else if (arg[2].toString() == "--decode" && arg[3].toString() == "--escape") {
         escapeDecode();
      } else if (arg[2].toString() == "--encode" && arg[3].toString() == "--jump") {
         jumpEncode();
      } else if (arg[2].toString() == "--decode" && arg[3].toString() == "--jump") {
         jumpDecode();
      } else {
         console.log("Ошибка в методе");
      }
   } else {
      console.log('Не указан файл на выход');
   }
}
catch (error) {
   console.log('Неверно указан на вход');
}
