const fs = require("fs");
const axios = require("axios");
const marked = require("marked");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

function getListLink(pathMd) {
  const dataLinks = [];
  const data = fs.readFileSync(pathMd, 'utf8');
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
    return new Promise((resolve, reject) => {
    axios.get(objectLink.href)
      .then(({ status, statusText }) => {
        resolve(createObjectValidate(objectLink, { status, statusText }));
      })
      .catch((error) => {
        const status = error.response.status;
        const statusText = error.response.statusText;
        if (status) {
          resolve(createObjectValidate(objectLink, { status, statusText }));
        }
        reject(error);
      });
  });
}

function mdLinks(pathLink, validate) {
  return new Promise((resolve, reject) => {
    const arrayMdLinks = getListLink(pathLink)
      .map((obLink) => ({ ...obLink, file: pathLink }));
    if (!validate) {
      resolve(arrayMdLinks);
    } else {
      const promises = [];
      arrayMdLinks.forEach((element) => {
        promises.push(getStatusLink(element));
      });
      return Promise.all(promises).then((values) => resolve(values));
    }
  });
}

mdLinks('./README.md', { validate: true })
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

// mdLinks('./README.md')
//   .then((result) => console.log(result))
//   .catch((error) => console.log(error));