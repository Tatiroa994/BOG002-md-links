// funcion asincrona  recursiva para recorrer  directorios
const path = require("path");
const { readdir } = require("fs/promises");

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


const pathPrueba = path.resolve("./test");
console.log(pathPrueba  );

getAllFile(pathPrueba)
  .then((result) => {
    Promise.all(result).then((r) => {
    const newArray = r.flat(4000);
    const MdFiles = newArray.filter((element) => path.extname(element) === ".md")
    console.log(MdFiles);
  });
})
  .catch((error) => console.log(error));