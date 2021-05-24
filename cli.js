#!/usr/bin/env node

const { mdLinks } = require("./index");

const [, , ...args] = process.argv;
const [path, ...options] = args;
const existsValidate = options.includes("--validate");
const existStats = options.includes("--stats");
const existStatsValidate = existStats && existsValidate;

function uniqueELement(array) {
  const unique = [...new Set(array.map((element) => element.href))];
  return unique;
}

function stats(dataMd) {
  const total = dataMd.length;
  const unique = uniqueELement(dataMd);
  process.stdout.write(`Total: ${total}\nunique: ${unique.length}`);
}

function statsValidate(dataMd) {
  const total = dataMd.length;
  const unique = uniqueELement(dataMd);
  const broken = dataMd.filter((element) => element.ok === "Fail");
  const brokenUnique = uniqueELement(broken);
  process.stdout.write(
    `Total: ${total}\nUnique: ${unique.length}\nBroken: ${brokenUnique.length}`
  );
}

function validateFalse(dataMd) {
  dataMd.forEach((element) => {
    const text =
      element.text.length > 50 ? element.text.substr(0, 50): element.text;
    process.stdout.write(
      `${element.file} ${element.href} ${text}\n`
    );
  });
}

function validate(dataMd) {
  dataMd.forEach((element) => {
    const text =
      element.text.length > 50 ? element.text.substr(0, 50) : element.text;
    process.stdout.write(
      `${element.file} ${element.href} ${element.ok} ${element.status} ${text}\n`
    );
  });
}

function runOptions(dataMd) {
  if (options.length > 0 && !existsValidate && !existStats) {
    process.stdout.write(`option invalide \n`);
    return;
  }
  if (existsValidate && !existStats) {
    validate(dataMd);
  } else if (!existsValidate && !existStats) {
    validateFalse(dataMd);
  }
  if (existStats && !existsValidate) {
    stats(dataMd);
  }
  if (existStatsValidate) {
    statsValidate(dataMd);
  }
}

mdLinks(path, { validate: existsValidate })
  .then((result) => {
    const dataMd = result;
    runOptions(dataMd);
  })
  .catch((error) => process.stdout.write(error.message));
