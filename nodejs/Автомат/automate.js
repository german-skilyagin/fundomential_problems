const isNumeric = n => !!Number(n);

//создаём таблицу переходов
function creatingTable(t, m) {
   let alf = [];
   //определяем алфавит подстроки t
   for (let i = 0; i < m; i++){
      alf[t.charAt(i)] = 0;
   }

   //в двойном массиве delta храним таблицу переходов
   let delta = new Array(m+1);
   for (let j = 0; j <= m; j++){
      delta[j] = [];
   }

   //инициализируем талбицу переходов
   for (let i in alf) {
      delta[0][i] = 0;
   }
   
   
   //формируем таблицу переходов
   let curr;
   for (let j = 0; j < m; j++){
      curr = delta[j][t.charAt(j)]; // нынешнее состояние 
      delta[j][t.charAt(j)] = j + 1; //проход вперёд для буквы
      for (let i in alf) {
         delta[j+1][i] = delta[curr][i]; // слудующее состояние формируется в зависимости от предыдущего
      }
   }
   return [alf, delta];
}
function auto(entries, s, t, n, m, num) {
   let mas = creatingTable(t, m);
   let alf = mas[0]; //алфавит
   let delta = mas[1]; //таблица
   let condition = 0;
   let char;
   let flag;
   for (let i = 0; i < s.length; i++){
      char = s[i];
      flag = 0;
      for (j in alf) {
         if (char == j) {
            flag = 1;
            break;
         }
      }
      if (flag == 0) {
         condition = 0;
      }
      else {
         condition = delta[condition][char];
      }
      
      if (condition + 1 == delta.length) {
         entries.push(i - condition + 2);
         if (entries.length == num) {
            return [entries, delta, alf];
         }
      }
   }
   return [entries, delta, alf];
}

let fs = require('fs');
let arg = process.argv;
let len = arg.length;

let substringFile = arg[len-1];
let stringFile = arg[len-2];
let keys = arg.slice(2, len-2);

try {
   const string = fs.readFileSync(stringFile).toString();
   const substring = fs.readFileSync(substringFile).toString();

   const n = string.length;
   const m = substring.length;

   let entries = [];

   let out = [];

   let time;
   let mistKeys = 0;
   if (keys.length > 0 && keys.length < 5) {
      for (let i = 0; i < keys.length; i++){         
         if (keys[i] == '-a' || keys[i] == '-t' ||  (Number.isNaN(keys[i]) && keys[i-1] == '-n') || (keys[i] == '-n' && !Number.isNaN(keys[keys.indexOf('-n')+1]))) {
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
      time = performance.now();
      let mas = auto(entries, string, substring, n, m);
      time = performance.now() - time;

      if (keys.indexOf("-n") == -1) {
         time = performance.now();
         let mas = auto(entries, string, substring, n, m, -1);
         time = performance.now() - time;
      }
      else {
         time = performance.now();
         let mas = auto(entries, string, substring, n, m, keys[keys.indexOf("-n") + 1]);
         time = performance.now() - time;
      }

      entries = mas[0];
      let delta = mas[1];
      let alf = mas[2];
      for (let i = 0; i < keys.length; i++) {
         if (keys[i] == '-a') {
            let table = '   ';
            for (let j in alf) {
               table += `${j}  `;
            }
            table += '\n';
            for (let k = 0; k < delta.length; k++){
               table += `${k}  `
               for (let q in delta[k]) {
                  table += `${delta[k][q]}  `;
               }
               table += '\n';
            }
            out.push(`Таблица:\n${table}\n`);
         } else if (keys[i] == '-t') {
            out.push(`Время выполнения: ${time}\n\n`);
         } else if (keys[i] == '-n') {
            let cEntries = Number(keys[i+1]);
            let str = ` `;
            if (cEntries <= entries.length) {
               for (let i = 0; i < cEntries; i++){
                  str += `${entries[i]} `
               }
            }
            else {
               str += `Количество вхождений: ${entries.length/2}`;
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
}
catch (err) {
   console.log('Ошибка в чтении файла');
}
