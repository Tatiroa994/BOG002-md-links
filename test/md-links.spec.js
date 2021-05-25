const { mdLinks } = require("../index");

describe("mdLinks", () => {
  it("Deberia retornar promesa al ingresar un directorio relativo", () => {
    expect(typeof mdLinks("./test")).toBe("object");
  });

  it("Deberia retornar promesa al ingresar un directorio absoluto", () => {
    expect(typeof mdLinks("C:/Users/laboratoria/Desktop/Laboratoria/BOG002-md-links/test")).toBe("object");
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
});
