# Md-Links :)

Con esta ibrería podras extraer y validar links encontrados  archivos markdown (.md), obteniendo las estadísticas de los links totales, únicos y rotos.

### *Previamente crea archivo .npmrc:*
En tu proyecto crea el  archivo .npmrc , en el cual  debes dejar esta linea de codigo:
```js
registry=https://npm.pkg.github.com/tatiroa994
```
o esta otra, las dos te funcionaran igual,
```js
@tatiroa994:registry=https://npm.pkg.github.com
```
## CLI

### *1. Instalación:*
```js
npm install @tatiroa994/md-links@1.0.0
```
### *2. ¿Como usar? :*
md-links recibe la ruta/path del archivo con extension *".md"*, o un directorio que contenga archivo(s)  y las opciones a ejecutar

`md-links <path-to-file> [options]`

### *3. Opciones:*

* Defecto:

Por defecto imprime el listado de link, junto al texto contenido y la ruta del archivo donde se localizan:

```sh
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
./some/example.md http://google.com/ Google
```
* Validate:

Al asignar la opción `--validate`, se imprime el listado de link, junto al texto contenido, la ruta del archivo donde se localizan y  adicional  el  estato de la rta HTTP y su respectivo mensaje:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```
* Stats

Al  asignar la opción `--stats` se imprime un texto con estadísticas básicas sobre los links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

También puedes  combinar `--stats` y `--validate` para obtener estadísticas que necesiten de los resultados de la validación.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## Modulo JS API

### *1. Instalación:*
* Instalacion desde la terminal:
```js
npm install @tatiroa994/md-links@1.0.0
```
* Instalacion desde el package.json:
```js
"@tatiroa994/md-links": "1.0.0"
```
### *2. ¿Como usar? :*
Importa con:
```js
const  {mdLinks} = require("@tatiroa994/md-links")
```
* Ejemplo :

```js
const  {mdLinks} = require("@tatiroa994/md-links")

mdLinks("./some/example.md")
  .then(links => {
    // => [{ href, text, file }, ...]
  })
  .catch(console.error);

mdLinks("./some/example.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }, ...]
  })
  .catch(console.error);

mdLinks("./some/dir")
  .then(links => {
    // => [{ href, text, file }, ...]
  })
  .catch(console.error);
```

