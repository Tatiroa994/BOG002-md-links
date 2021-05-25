const fs = require("fs");
const axios = require("axios");
const marked = require("marked");
const jsdom = require("jsdom");
const path = require("path");

const { JSDOM } = jsdom;

function readFile(pathMd) {
  // lee archivos md
  let mdData;
  if (typeof pathMd === "string") {
    mdData = fs.readFileSync(pathMd, "utf8");
  } else {
    const data = pathMd.map((file) => fs.readFileSync(file, "utf8"));
    mdData = data.toString();
  }
  return mdData;
}

function getListLink(stringData) {
  // retorna links
  const dataLinks = [];
  const data = readFile(stringData);
  const toHtml = marked(data);
  const dom = new JSDOM(toHtml);
  const tagsA = dom.window.document.querySelectorAll("a");
  tagsA.forEach((element) => {
    if (element.href.includes("http")) {
      dataLinks.push({ href: element.href, text: element.textContent });
    }
  });
  return dataLinks;
}

function createObjectValidate(objectLink, { status, statusText }) {
  // crea objeto con status http
  const { href, text, file } = objectLink;
  const newObj = {
    href,
    text,
    file,
    status,
    ok: statusText,
  };
  return newObj;
}

function getStatusLink(objectLink) {
  // valida status http
  return new Promise((resolve) => {
    axios
      .get(objectLink.href)
      .then(({ status, statusText }) => {
        resolve(createObjectValidate(objectLink, { status, statusText }));
      })
      .catch((error) => {
        if (error.response) {
          const { status } = error.response;
          resolve(createObjectValidate(objectLink, { status, statusText:"Fail" }));
        }
        resolve(
          createObjectValidate(objectLink, {
            status: error.code,
            statusText: "Fail",
          })
        );
      });
    
  });
}

function getAllFile(pathCurrent) {
  let foundFile = [];
  if (path.extname(pathCurrent) === ".md") {
    foundFile.push(pathCurrent);
  }
  const isDir = fs.lstatSync(pathCurrent).isDirectory();
  if (isDir) {
    const pathList = fs.readdirSync(pathCurrent);
    for (let i = 0; i < pathList.length; i++) {
      const pathJoin = path.join(pathCurrent, pathList[i]);
      foundFile = foundFile.concat(getAllFile(pathJoin));
    }
  }
  return foundFile;
}

function getArrayPromise(pathLink, file, validate) {
  console.log(pathLink);
  // crea arreglo que se retornara en promesa
  const arrayMdLinks = getListLink(pathLink).map((objectLink) => ({
    ...objectLink,
    file,
  }));

  if (!validate) {
    return arrayMdLinks;
  }
  const promises = [];
  arrayMdLinks.forEach((element) => {
    promises.push(getStatusLink(element));
  });

  return Promise.all(promises)
    .then((values) => values)
    .catch((error) => error);
}

function mdLinks(pathLink, options = {validate: false}) {
  return new Promise((resolve, reject) => {
    // pathLink must be a string
    if (typeof pathLink !== "string") {
      reject(new Error("typeof must be string"));
    }
    // pathLink the path must exist or be valid
    if (!fs.existsSync(pathLink)) {
      reject(new Error("path does not exist or invalid"));
    }
    const isAbsolute = path.isAbsolute(pathLink)
      ? pathLink
      : path.resolve(pathLink);

    const isDirectory = fs.lstatSync(isAbsolute).isDirectory();

    if (isDirectory) {
      const allFile = getAllFile(isAbsolute);
      resolve(getArrayPromise(allFile, pathLink, options.validate));
    } else if (path.extname(isAbsolute) === ".md") {
      resolve(getArrayPromise(isAbsolute, pathLink, options.validate));
    } else {
      reject(new Error("file extension is not .md"));
    }
  });
}
console.log(process.cwd()); // path.relative(process.cwd(), file)  
 module.exports = {mdLinks, getStatusLink};