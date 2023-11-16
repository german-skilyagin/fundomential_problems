function hashSq(str){
   let s = 0;
   for (let i = 0; i < str.length; i++){
      s += Math.pow(str[i].charCodeAt(), 2);
   }
   return s;
}

function hashRK(str){
   let s = 0;
   for (let i = 0; i < str.length; i++){
      s += str[i].charCodeAt() * Math.pow(2, str.length - 1 - i);
   }
   return s;
}

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

function h1(entries, string, substring, n, m, collisions, num) {
   let hs = hashSq(string.slice(0, m));
   let hss = hashSq(substring);
   let j;
   for (let i = 1; i < n - m + 1; i++) {
      if (hs == hss && substring == string.slice(i - 1 , i + m - 1)) {
         entries.push(i);
         if (entries.length == num) {
            return [entries, collisions];
         }
      }
      else if (hs == hss && substring != string.slice(i - 1, i + m - 1)) {
         collisions += 1;
      }
      hs = hs - Math.pow(string[i-1].charCodeAt(), 2) + Math.pow(string[i + m - 1].charCodeAt(), 2);
      j = i+1;
   }
   if (hs == hss) {
      entries.push(j);
      if (entries.length == num) {
         return [entries, collisions];
      }
   }
   return [entries, collisions];
}

function h2(entries, string, substring, n, m, collisions, num) {
   let hs = hashRK(string.slice(0, m));
   let hss = hashRK(substring);
   let j;
   for (let i = 1; i < n - m + 1; i++) {
      if (hs == hss && substring == string.slice(i - 1 , i + m - 1)) {
         entries.push(i);
         if (entries.length == num) {
            return [entries, collisions];
         }
      }
      else if (hs == hss && substring != string.slice(i - 1, i + m - 1)) {
         collisions += 1;
      }
      hs = (hs - string[i-1].charCodeAt() * Math.pow(2, m-1)) * 2 + string[i+m-1].charCodeAt();
      j = i+1;
   }
   if (hs == hss) {
      entries.push(j);
      if (entries.length == num) {
         return [entries, collisions];
      }
   }
   return [entries, collisions];
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
         } else if (method == 'h1') {
            if (keys.indexOf("-n") == -1) {
               time = performance.now();
               answer = h1(entries, string, substring, n, m, collisions, -1);
               time = performance.now() - time;
            }
            else {
               time = performance.now();
               answer = h1(entries, string, substring, n, m, collisions, keys[keys.indexOf("-n") + 1]);
               time = performance.now() - time;
            }
         } else if (method == 'h2') {
            if (keys.indexOf("-n") == -1) {
               time = performance.now();
               answer = h2(entries, string, substring, n, m, collisions, -1);
               time = performance.now() - time;
            }
            else {
               time = performance.now();
               answer = h2(entries, string, substring, n, m, collisions, keys[keys.indexOf("-n") + 1]);
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