
function encode(args) {
    let message = args;
    let outstr;
    if (message.length == 4) {
       let dig = message.split('');
       for (let i = 0; i < dig.length; i++) {
          dig[i] = Number(dig[i]);
       }
       let encoded = [];
       let p = [];
       p[0] = ((dig[0] + dig[1] + dig[2]) % 2 == 0) ? 0 : 1;
       p[1] = ((dig[0] + dig[2] + dig[3]) % 2 == 0) ? 0 : 1;
       p[2] = ((dig[0] + dig[1] + dig[3]) % 2 == 0) ? 0 : 1;
       let i = 0, j = 0;
       for (let i = 0, j = 0, k = 1; i < 4; k++) {
          if (Math.log2(k) == Math.floor(Math.log2(k))) {
             encoded.push(p[j]);
             j++;
          }
          else {
             encoded.push(dig[i]);
             i++;
          }
       }
        
       outstr = encoded.join('');
    }
    else {
       outstr = 'You have to write 4 chars';
    }
    console.log(outstr)
 }
 
 
 function diffDig(d) {
    if (d == 0) {
       return 1;
    }   
    return 0;
 }
 
 function decode(args) {
    let message = args;
    if (message.length == 7) {
       let mes = message.split('');
       let p = [];
       let dig = [];
       for (let i = 0; i < 7; i++) {
          if (i == 0 || i == 1 || i == 3) {
             p.push(Number(mes[i]));
          }
          else {
             dig.push(Number(mes[i]));
          }
       }
 
       let mist = [0, 0, 0];
 
       if ((p[0] + dig[0] + dig[1] + dig[2]) % 2 != 0) {
          mist[0] = 1;
       } 
       if ((p[1] + dig[0] + dig[2] + dig[3]) % 2 != 0 ) {
          mist[1] = 1;
       } 
       if ((p[2] + dig[0] + dig[1] + dig[3]) % 2 != 0) {
          mist[2] = 1;
       }
       
       let err;
 
       if (mist[0] == 1 && mist[1] == 1 && mist[2] == 1) {
          dig[0] = diffDig(dig[0]);
          err = " Error: 1 char 3BIT";
       } else if (mist[0] == 0 && mist[1] == 1 && mist[2] == 1) {
          dig[3] = diffDig(dig[3]);
          err = " Error: 4 char 7BIT";
       } else if (mist[0] == 1 && mist[1] == 0 && mist[2] == 1) {
          dig[1] = diffDig(dig[1]);
          err = " Error: 2 char 5BIT";
       } else if (mist[0] == 1 && mist[1] == 1 && mist[2] == 0) {
          dig[2] = diffDig(dig[2]);
          err = " Error: 3 char 6BIT";
       } else if (mist[0] == 1 && mist[1] == 0 && mist[2] == 0) {
          p[0] = diffDig(p[0]);
          err = " Error: 1 checker 1BIT";
       } else if (mist[0] == 0 && mist[1] == 1 && mist[2] == 0) {
          p[1] = diffDig(p[1]);
          err = " Error: 2 checker 2BIT";
       } else if (mist[0] == 0 && mist[1] == 0 && mist[2] == 1) {
          p[2] = diffDig(p[2]);
          err = " Error: 3 checker 4BIT";
       } 
 
       let decoded = [];
 
       for (let i = 0, j = 0, k = 1; i < 4; k++) {
          if (Math.log2(k) == Math.floor(Math.log2(k))) {
             decoded.push(p[j]);
             j++;
          }
          else {
             decoded.push(dig[i]);
             i++;
          }
       }
       
       outstr = decoded.join('') + " => " + dig.join('');
       console.log(err ?? "No error");
    }
    else {
       outstr = 'You have to write 7 chars';
    }
    console.log(outstr);
 }
 
 const fs = require("fs");
 let action = process.argv[2];
 let args = process.argv[3];
 
 
 try {
       if (action.toString() == "--encode") {
          encode(args);
       } else if (action.toString() == "--decode") {
          decode(args);
       } else {
          console.log("Ошибка в методе");
       }
    }
 catch (error) {
    console.log('Неверно указан на вход');
 }
 