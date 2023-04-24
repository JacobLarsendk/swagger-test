            /**REQUIRES */



const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerOptions = require('./config/swagger')
const default404 = require('./error_handling/default_404')
const errorHandler = require('./error_handling/errorHandler')
const healthRoutes = require('./routes/healthRoutes')




            /**CONFIG */


const app = express() //initializes express
const swaggerDocs = swaggerJsDoc(swaggerOptions)
console.log(swaggerDocs)
const PORT = 4000



            /**MIDDLEWARE, ROUTES, ETC. */



app.use(express.json()) //Give Express ability to parse json bodies
// app.use(express.urlencoded({extended:true})) // Give Express ability to parse form data
app.use('/health', healthRoutes)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * DEFAULT REQUEST RECEIVED
 */
app.use((req, res, next)=>{
    console.log("REQUEST RECEIVED")
    next()
})



            /**LANDING PAGE */



/**
 * @swagger
 * /:
 *   get:
 *     description: Get all books
 *     responses:
 *       200:
 *         description: Success
 * 
 */
app.get('/', (req,res,next) => {
    return res.status(200).send('<h1>LANDING PAGE<h1>')
}) 



            /**ERROR HANDLING */



app.use(default404)
app.use(errorHandler)



            /**SERVER */



app.listen(PORT,()=>{
    console.log(`SERVER STARTED ON PORT: ${PORT}`)
})
