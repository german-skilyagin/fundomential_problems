const isNumeric = n => !!Number(n);

function bf(entries, string, substring, n, m, num) {
   let i = 1;
   let j;
   while (i <= n - m + 1) {
      j = 0;
      while (string[i + j - 1] == substring[j]) {
         j++;
         if (j == m) {
            entries.push(i);
            if (entries.length == num) {
               return entries;
            }
            break;
         }
      }
      i++;
   }
   return entries;
}
let fs = require('fs');
let arg = process.argv;
let len = arg.length;

let substringFile = arg[len-1];
let stringFile = arg[len-2];
let method = arg[len-3];
let keys = arg.slice(2, len-3);

try {
   const string = fs.readFileSync(stringFile).toString();
   const substring = fs.readFileSync(substringFile).toString();

   const n = string.length;
   const m = substring.length;

   let entries = [];

   let out = [];

   let collisions = 0;
   let mistKeys = 0;

   let time;
   if (method == 'bf' || method == 'h1' || method == 'h2') {
      
      if (0 < keys.length < 5) {
         for (let i = 0; i < keys.length; i++){         
            if (keys[i] == '-c' || keys[i] == '-t' ||  (Number.isNaN(keys[i]) && keys[i-1] == '-n') || (keys[i] == '-n' && !Number.isNaN(keys[keys.indexOf('-n')+1]))) {
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
         let answer = [];
         if (method == 'bf') {
            if (keys.indexOf("-n") == -1) {
               time = performance.now();
               entries = bf(entries, string, substring, n, m, -1);
               time = performance.now() - time;
            }
            else {
               time = performance.now();
               entries = bf(entries, string, substring, n, m, keys[keys.indexOf("-n") + 1]);
               time = performance.now() - time;
            }
         } else {
            console.log('Метод не указан');
         }
         if (method != 'bf') {
            entries = answer[0];
            collisions = answer[1];
         }
         for (let i = 0; i < keys.length; i++) {
            if (keys[i] == '-c') {
               out.push(`Число коллизий: ${collisions}\n`);
            } else if (keys[i] == '-t') {
               out.push(`Время выполнения: ${time}\n`);
            } else if (keys[i] == '-n') {
               let cEntries = Number(keys[i+1]);
               let str = ` `;              
               if (cEntries <= entries.length) {
                  for (let i = 0; i < cEntries; i++){
                     str += ` ${entries[i]} `
                  }
               }
               else {
                  str += ` Количество вхождений: ${entries.length}`;
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
   else {
      console.log('Ошибка в методе');
   }
}
catch (err) {
   console.log('Ошибка в чтении файла');
}