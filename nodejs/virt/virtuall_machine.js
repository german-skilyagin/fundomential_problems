try {
    function checker(fileName) {
       let err = 0;
       if(fileName == "nod.txt"){
         a1 = process.argv[3];
         a2 = process.argv[4];
         process.argv[3] = Math.abs(a1);
         process.argv[4] = Math.abs(a2);

       //if (fileName == "nod.txt") {
          //if (!(process.argv[3] > 0 && process.argv[4] > 0)) {
           //  err = 0;
          //}
       //}
       }
      //  else if(fileName == "NOK.txt"){
      //    a1 = process.argv[3];
      //    a2 = process.argv[4];
      //    process.argv[3] = Math.abs(a1);
      //    process.argv[4] = Math.abs(a2);
      //  }
       return err;
      }

    function mov(pos) {
       return memory[len + pos] = Number(arg[3 + pos]);
    }
 
    function ifeqp(a, b) {
       return (Number(a) == Number(b));
    }
 
    function prt(value) {
       console.log(value);
    }
 
    function pos(value) {
       return Number(memory[len + Number(value)]) > 0;
    }
 
    function neg(value) {
       return !(Number(memory[len + Number(value)]) > 0);
    }
 
    function diff(a, b, c) {
       memory[len + c] = memory[len + a] - memory[len + b];
    }
 
    function jg(i) {
       return -1*i;
    }

    function sum(a, b, ceil) {
      memory[len + ceil] = a + b;
   }

    let fs = require('fs');
    let arg = process.argv;
    let fileName = arg[2];
    let fileContent = fs.readFileSync(fileName, 'utf8');
    let err = checker(fileName);
    let memory = fileContent.replace(/\n/g," ").replace(/\r/g,"").split(" ");
    let len = memory.length;
    memory[len + 100] = 0;
 
    for (let i = 0; ((i < len) && (err == 0)); i++) {
       if (memory[i] == "mov") {
          mov(Number(memory[i + 1]));
          i += 1;
       }

       else if (memory[i] == "ifeqp") {
          memory[len + 100]  = ifeqp(memory[len + Number(memory[i+1])], memory[len + Number(memory[i+2])]);
          if (memory[len + 100] == 1) i += 2;
          else i += 4;
       }

       else if (memory[i] == "prt") {
         if (memory[len + 100]  == 1) {
            prt(memory[len + Number(memory[i+1])]);
            break;
         }
         i += 1;
       }

       else if (memory[i] == "pos") {
          memory[len + 100] = pos(memory[i+1]);
          i += 1;
       }

       else if(memory[i] == "diff") {
          if (memory[len + 100]   == 1) {
             diff(Number(memory[i+1]), Number(memory[i+2]), Number(memory[i+3]));
             i += 3;
             continue;
          }
          i += 3;
       }

       else if(memory[i] == "neg") {
          memory[len + 100] = neg(memory[i+1]);
          i += 1;
       }

       else if (memory[i] == "jg") {
          i = i + jg(Number(memory[i + 1]));
       }
       else if (memory[i] == "sum") {
         sum(memory[len + Number(memory[i+1])], memory[len + Number(memory[i+2])], Number(memory[i+3]));
         i += 3;
      }
    }
 }

 catch (err) {
    console.log('Нет такого файла');
 }