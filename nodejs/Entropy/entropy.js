let fs = require('fs');
let logBase = process.argv[3] ?? 2;
let h = 0;
let n = 0;
let col = {};
let p = {};
fs.readFile(process.argv[2].toString(), (err, data) => {   
   str = data.toString().split("");
   str.forEach(s => col[s] = str.filter(i => i == s).length);//считаем количество символов в строке
   for (let i of Object.values(col)) {//Object.values() возвращает массив собственных перечисляемых значений свойств данного объекта со строковым ключом.
      n += i;
   }
   for (let i in col){
      p[i] = col[i]/n;
   }
   for (let i of Object.values(p)){
      h += (i * (Math.log(1/i) / Math.log(logBase)));
   }
   console.log(p);
   console.log(h);
});
