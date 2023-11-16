const isNumeric = n => !!Number(n);

function creatingBadTable(substring, m) {
   let badTable = new Array(); //пустая таблица
   for (let i = 0; i < m; i++){
      badTable[substring.charAt(i)] = i + 1; //для каждого символа запоминаем его самое правое вхождение
   }
   return badTable;
}


function bm(entries, string, substring, n, m, num) {
   let badTable = creatingBadTable(substring, m);
   for (let i = 0; i < n - m;) {
      for (let j = 0; j < m; j++){ // сдвиг указателя по шаблону
         if (string[i - j] != substring[m - j - 1]){ // не совпал символ
            let shift1 = 0; //сдвиг по эвристике плохого символа
            if (badTable[string[i - j]] == undefined) {//Если не нашелся символ в таблице сдвигов  символов подстроки (badTable)
               shift1 = m - j; // сдвиг на всю длинну строчки по эвристике плохого символа если символа нет в таблице сдвигов (свигаем слово за несовпавший символ)
            }
            else {
               shift1 = m - badTable[string[i - j]] - j; //сдвигаем до символа если есть
            }
            i += Math.max(1, shift1); //выбор максимума между единицей и плохим символом
            break;
         }
         //если совпал  символ
         if (j == m - 1){  //если долши до конца шаблона
            entries.push(i - m + 1); //добавляем в массив результатов
            if (entries.length == num) {
               return entries;
            }
            i += 1;
            break;
         }
      }
   }
   return entries;
}

let fs = require('fs');
let arg = process.argv;
let len = arg.length;

let substringFile = arg[len-1];
let stringFile = arg[len-2];
let keys = arg.slice(2, len-2);

try {
    const str = fs.readFileSync(stringFile).toString();
    const substring = fs.readFileSync(substringFile).toString();
 
    const n = str.length;
    const m = substring.length;
 
    let entries = [];
 
    let out = [];
 
    let time;
    let mistKeys = 0;
    if (keys.length > 0 && keys.length < 4) {
       for (let i = 0; i < keys.length; i++){         
          if (keys[i] == '-t' || (Number.isNaN(keys[i]) && keys[i-1] == '-n') || (keys[i] == '-n' && !Number.isNaN(keys[keys.indexOf('-n')+1]))) {
             continue;
          }
          else {
             mistKeys = 1;
             break;
          }
       }
    } else {
       mistKeys = 1;
    }
    if (mistKeys == 0) {
       if (keys.indexOf("-n") == -1) {
          time = performance.now();
          entries = bm(entries, str, substring, n, m, -1);
          time = performance.now() - time;
       }
       else {
          time = performance.now();
          entries = bm(entries, str, substring, n, m, keys[keys.indexOf("-n") + 1]);
          time = performance.now() - time;
       }
       
       for (let i = 0; i < keys.length; i++) {
          if (keys[i] == '-t') {
             out.push(`Время выполнения: ${time}\n\n`);
          } else if (keys[i] == '-n') {
             let cEntries = Number(keys[i+1]);
             let str = ``;
             if (cEntries <= entries.length) {
                for (let i = 0; i < cEntries; i++){
                   str +=  `${entries[i]}` 
                }
             }
             else {
                str += ` всего ${entries.length + 1} вхождений`;
             }
             str += '\n';
             out.push(str);
             i++;
          }
       }
       console.log(out.join(''));
    }
    
    else{
       console.log('Ошибка в ключах');
    }
 } catch (error) {
    console.log(error);
}

