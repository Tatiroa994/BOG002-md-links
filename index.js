const fs = require("fs");
const axios = require("axios");
const marked = require("marked");
const jsdom = require("jsdom");
const { resolve } = require("path");
const { rejects } = require("assert");

const { JSDOM } = jsdom;

function getListLink(pathMd) {
  const dataLinks = [];
  const data = fs.readFileSync(pathMd, 'utf8');
  const toHtml = marked(data);
  const dom = new JSDOM(toHtml);
  const tagsA = dom.window.document.querySelectorAll("a");
  tagsA.forEach((element) => {
    if (element.href.includes("http")) {
      dataLinks.push({ text: element.textContent, link: element.href });
    }
  });
  return dataLinks;
}

function getStatusLink(link) {
  return axios.get(link)
    .then((result) => result)
    .catch((error) => error);
}

function mdLinks(pathLink, validate) {
  // return new Promise(resolve, reject){
  const linkList = getListLink(pathLink);
  const arrayMdLinks = [];
  linkList.forEach((element) => {
    arrayMdLinks.push({
      href: element.link,
      text: element.text,
      file: pathLink,
    });
  });
  if (!validate) return arrayMdLinks;
  arrayMdLinks.forEach((element) => {
    const objCurrent = element;
    getStatusLink(element.href)
      .then((result) => {
        objCurrent.status = result.status;
        objCurrent.ok = result.statusText;
      })
      .catch((error) => {
        objCurrent.status = error.response.status;
        objCurrent.ok = error.response.statusText;
      });
  });
  return arrayMdLinks;

// }
}

mdLinks('./README.md', { validate: true });
