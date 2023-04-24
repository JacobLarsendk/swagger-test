
/**Set our Swagger Config Options */
const swaggerOptions = {
    swaggerDefinition:{
        info: {
            title: "Health Routes DEMO",
            version: "1.0.0",
            description: "A simple Node/Express API with Swagger"
        },
    },
    apis: ["./index.js", "./routes/*.js"],
}

module.exports = swaggerOptions
