// module.exports = () => {
//   // ...
// };

const Fs = require("fs");
const regEx = /(\[[^\s].*\])(\([http]+.*\))/gi;
// const regExText = /(\[[^\s](.*)\])/gi;
// const regExtLink = /(\([http]+.*\))/gi;

const dataLinks = [];
// console.log(Fs.readFile('./README.md', 'utf8', callback));

// function callback(err, data) {
//   if (err) throw err;
//   console.log(data);
// }


try {
  const data = Fs.readFileSync('./README.md', 'utf8');
  const listLinks = [...data.matchAll(regEx)];
  // console.log(listLinks);
  // for (let i = 0; i < listLinks.length; i++) {
  //     dataLinks.push({ text: listLinks[i].match(regExText), link: listLinks[i].match(regExtLink) });


    listLinks.forEach((element) => {   
    dataLinks.push({ text: element[1], link: element[2] });
    })
  //   listLinks.forEach((element) => {   
  //     dataLinks.push({ text: element.match(regExText), link: element.match(regExtLink) });
  //     })
  // // }
  console.log(dataLinks);
} catch (err) {
  console.error(err)
}

// C:/Users/laboratoria/Downloads/3-column-preview-card-component-main/README-template.md

// var cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// var expresion = /[A-E]/gi;
// var array_emparejamientos = cadena.match(expresion);
// console.log(Array.isArray(array_emparejamientos));


// (\[[^\s].*\])(\([http]+.*\))