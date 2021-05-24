// const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

// function getAllFile2(pathCurrent) {
//   let foundFile = [];
//   if (path.extname(pathCurrent) === ".md") {
//     foundFile.push(pathCurrent);
//   }
//   const isDir = fs.lstatSync(pathCurrent).isDirectory();
//   if (isDir) {
//     const pathList = fs.readdirSync(pathCurrent);
//     for (let i = 0; i < pathList.length; i++) {
//       // const pathJoin = path.join(pathCurrent, pathList[i]);
//       foundFile = foundFile.concat(getAllFile2(pathList));
//     }
//   }
//   return foundFile;
// }
//  console.log("resultado funcion ", getAllFile("./prueba"));

function getAllFile(pathCurrent) {
  return readdir(pathCurrent, { withFileTypes: true })
    .then((result) =>
      Promise.all(
        result.map((element) => {
          const pathREsolve = path.resolve(pathCurrent, element.name);
          const elementNew = element.isDirectory()
            ? getAllFile(pathREsolve)
            : pathREsolve;
          return elementNew;
        })
      )
    )
    .catch((error) => console.log(error));
}

const pathPrueba = path.resolve("./prueba");

getAllFile(pathPrueba)
  .then((result) => {
    Promise.all(result).then((r) => console.log(r.flat(4000)));
  })
  .catch((error) => console.log(error));
