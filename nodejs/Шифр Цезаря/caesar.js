
let russianAlf = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

let russianStat = {
   'а': 8.01,
   'б': 1.59,
   'в': 4.54,
   'г': 1.7,
   'д': 2.98,
   'е': 8.45,
   'ё': 0.04,
   'ж': 0.94,
   'з': 1.65,
   'и': 7.35,
   'й': 1.21,
   'к': 3.49,
   'л': 4.4,
   'м': 3.21,
   'н': 6.7,
   'о': 10.97,
   'п': 2.81,
   'р': 4.73,
   'с': 5.47,
   'т': 6.26,
   'у': 2.62,
   'ф': 0.26,
   'х': 0.97,
   'ц': 0.48,
   'ч': 1.44,
   'ш': 0.73,
   'щ': 0.36,
   'ъ': 0.04,
   'ы': 1.9,
   'ь': 1.74,
   'э': 0.32,
   'ю': 0.64,
   'я': 2.01
}

function encode(key) {
   let stringToEncode = fs.readFileSync(from).toString();
   console.log();
   let encoded = "";
   let alf = "";
   alf = russianAlf;
   for (let i = 0; i < stringToEncode.length; i++) {
      if (alf.indexOf(stringToEncode[i]) != -1) {//является ли он допустимым символом в указанном алфавите
         encoded += alf[(alf.indexOf(stringToEncode[i]) + key) % alf.length];
      }
      else {
         if (stringToEncode[i].toLowerCase() != stringToEncode[i].toUpperCase()) {//проверка является ли буквой, используя, что верхний и нижний регистры букв не будут равны
            encoded += alf[(alf.indexOf(stringToEncode[i].toLowerCase()) + key) % alf.length].toUpperCase(); // сдвигаем нижний регистр буквы и преобразуем обратно в верхний регистр
         }
         else{ //Если это не буква, то добавляем символ без изменений
            encoded += stringToEncode[i];
         }
      }
   }
   fs.writeFileSync(to, encoded);
}

function decode() {
   let stringToDecode = fs.readFileSync(from).toString();
   let decoded = [];
   let alf = "";
   let standStat;
   alf = russianAlf;
   standStat = russianStat;
 
   let letterCount = 0;

   let currStat = {};

   for (let i = 0; i < alf.length; i++){ //инициализируем статистку теущего файла
      currStat[alf[i]] = 0;
   }

   for (let i = 0; i < stringToDecode.length; i++) { //подсчёт кол-ва букв
      if (alf.indexOf(stringToDecode[i].toLowerCase()) > -1) {
         letterCount++;
         currStat[stringToDecode[i]] += 1; //одновременно инкрементируем кол-во соответствующей буквы
      }
      else {
         decoded[i] = stringToDecode[i];
      }
   }
   for (let i = 0; i < alf.length; i++) {
      currStat[alf[i]] = (currStat[alf[i]] / letterCount) * 100; 
   }
   

   let key;
   let sum;
   let minSum = 1000000;
   for (let k = 0; k < alf.length; k++) {
      sum = 0;
      for (let i = 0; i < alf.length; i++){
         sum += (currStat[alf[i]] - standStat[alf[(alf.length + i - k) % alf.length]]) ** 2;
      }
      if (sum < minSum){
         key = k;
         minSum = sum;
      }
   }
   
   console.log("Ключ: " + (key-5));
   for (let i = 0; i < stringToDecode.length; i++) { //заполняем decoded
      if (decoded[i] == undefined) {
         if (stringToDecode[i].toLowerCase() == stringToDecode[i]) {
            decoded[i] = alf[(alf.length + alf.indexOf(stringToDecode[i]) - key) % alf.length];
         }
         else {
            decoded[i] = alf[(alf.length + alf.indexOf(stringToDecode[i].toLowerCase()) - key) % alf.length].toUpperCase();
         }
      }
   }
   decoded = decoded.join('');
   fs.writeFileSync(to, decoded);
}


let fs = require("fs");
let args = process.argv;
let action = args[2];
let from = args[3];
let to = args[4];
let lang = "ru";

try {
      if (action == "encode") {
         let key = args[5];
         if (!isNaN(key)) encode(Number(key));
         else console.log("Ключ должен быть числом!");
      }
      else if (action == "decode") {
         decode();
      }
      else {
         console.log("Ошибка метода");
      }
}
catch (err) {
   console.log("Ошибка в чтении файла!");
}