const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BookeeShop API",
      version: "1.0.0",
      description: "API documentation for BookeeShop NodeJS project",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },

  apis: [path.join(__dirname, "../routes/**/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
