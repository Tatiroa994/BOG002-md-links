const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { mdLinks, getStatusLink } = require("../index");

const mock = new MockAdapter(axios);
mock
  .onGet("https://docs.npmjs.com/getting-started/publishingfdfsdf")
  .reply(404, {});
mock
  .onGet(
    "https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry"
  )
  .reply(200, {});
mock
  .onGet("https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback")
  .reply(200, {});
mock
  .onGet("https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback")
  .reply(200, {});

describe("mdLinks", () => {
  it("Deberia retornar promesa al ingresar un directorio relativo", () => {
    expect(typeof mdLinks("./test")).toBe("object");
  });

  it("Deberia retornar promesa al ingresar un directorio absoluto", () => {
    const path = "C:/Users/laboratoria/Desktop/Laboratoria/BOG002-md-links/test";
    expect( typeof mdLinks(path)).toBe("object");
  });

  it("Deberia retornar promesa al ingresar archivo md", () => {
    expect(typeof mdLinks("./test/prueba.md")).toBe("object");
  });

  it("Deberia indicar que parametro ingresado es string", () => {
    expect.assertions(1);
    return mdLinks(123).catch((result) => {
      expect(result.message).toBe("typeof must be string");
    });
  });

  it("Deberia indicar que la extencion del archivo debe ser md", () => {
    expect.assertions(1);
    return mdLinks("./cli.js").catch((result) => {
      expect(result.message).toBe("file extension is not .md");
    });
  });

  it("Deberia indicar que no hay archivos con extension md", () => {
    expect.assertions(1);
    return mdLinks("./test/vacio").catch((result) => {
      expect(result.message).toBe("no files exist .md");
    });
  });
});

describe("getStatusLink", () => {
  const data = {
    href: "https://docs.npmjs.com/getting-started/publishingfdfsdf",
    text: "Publicar packpage5",
    file: "testprueba.md",
  };

  const data2 = {
    href: "https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback",
    text: "leer directorio",
    file: "testprueba.md",
  };

  it("Deberia retornar status 404", () => {
    expect.assertions(1);
    return getStatusLink(data).then((result) => {
      expect(result.status).toBe(404);
    });
  });

  it("Deberia retornar status 202", () => {
    expect.assertions(1);
    return getStatusLink(data2).then((result) => {
      expect(result.status).toBe(200);
    });
  });
});
