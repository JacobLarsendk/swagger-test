            /**REQUIRES */



const express = require('express')
const {ExpressError} = require('../error_handling/expressError')
const router = new express.Router()



            /**CONFIG, GLOBALS, DEMO DATA */



const app = express() //initializes express
const PORT = 4000
let DEMO_HEALTH_API_DATA = [
    {
        hostname: "lxt-stna-000xyz",
        active: true,
        deepMonitoring: true,
        status: "YELLOW"
    },
    {
        hostname: "lxp-stna-000abc",
        active: true,
        deepMonitoring: true,
        status: "GREEN"
    }
]

/**
 * Checks if our required fields are defined
 * @param  {String} hostname
 * @param  {Boolean} active Whether or not we have health monitoring on the specified hostname
 * @param  {Boolean} deepMonitoring Whether or not we have deepMonitoring on the specified hostname
 * @param  {String} status The status of our monitoring on the specified hostname
 * @return {Boolean} true/false whether or not our required fields have been properly defined     
 */
function requiredFieldsDefined(hostname, active, deepMonitoring, status, next){
    //This can be refactored to a dynamic function that checks all required fields from a list and throws error for first that is not defined properly
    try{
        if (!hostname) throw new ExpressError(`BAD REQUEST ERROR - FIELD hostname: ${hostname} - required`, 400)
        if (!active) throw new ExpressError(`BAD REQUEST ERROR - FIELD active: ${active} - required`, 400)
        if (!deepMonitoring) throw new ExpressError(`BAD REQUEST ERROR - FIELD deepMonitoring: ${deepMonitoring} - required`, 400)
        if (!status) throw new ExpressError(`BAD REQUEST ERROR: FIELD status: ${status} - required`, 400)
        return true
    }
    catch(error){
        return next(error)
    }
    
   
}
   


            /**ROUTES */


/**
 * @swagger
 * /health:
 *   get:
 *     description: GET JSON array of all hostname health objects
 *     responses:
 *       200:
 *         description: SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', (req,res,next) => {
    const GET_HEALTH_API_DATA_DEMO = DEMO_HEALTH_API_DATA
    return res.status(200).json(GET_HEALTH_API_DATA_DEMO)
}) 

/**
 * @swagger
 * /health/{hostname}:
 *   get:
 *     description: GET hostname health object for specified hostname
 *     parameters:
 *       - in: path
 *         hostname: hostname
 *         schema:
 *           type: string
 *         required: true
 *         description: STRING hostname on which to get health object data
 *     responses:
 *       200:
 *         description: SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: NOT FOUND - Hostname not found
 */
router.get('/:hostname',(req,res,next)=>{
    try{
        const hostname = req.params.hostname
        DEMO_HEALTH_API_DATA.forEach((listItem) => {
            if (hostname === listItem['hostname']){
                return res.status(200).json(listItem)
            }
        })
        throw new ExpressError(`NOT FOUND ERROR - hostname: ${hostname} - NOT FOUND`, 404)
    }
    catch(error){
        return next(error)
    }
})

/**
 * POST /health/:hostname
 * "@params" are required in the request body when posting
 * @param  {String} hostname
 * @param  {Boolean} active Whether or not we have health monitoring on the specified hostname
 * @param  {Boolean} deepMonitoring Whether or not we have deepMonitoring on the specified hostname
 * @param  {String} status The status of our monitoring on the specified hostname
 * @return {JSON} list of hostname health objects with new hostname included   
 */
/**
 * @swagger
 * /health/{hostname}:
 *   post:
 *     description: POST new hostname health object
 *     parameters:
 *       - in: path
 *         hostname: hostname
 *         schema:
 *           type: string
 *         required: true
 *         description: STRING hostname of the hostname to post health data for
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: CREATED
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: BAD REQUEST - Request body missing required fields or hostname already exists
 *       403:
 *         description: FORBIDDEN - Hostname not acceptable
 *       404:
 *         description: NOT FOUND - Hostname not found
 */
router.post('/:hostname',(req,res,next)=>{
    try{
        const reqBody = req.body
        const {hostname, active, deepMonitoring, status} = reqBody
        if(!(req.params.hostname === hostname)) throw new ExpressError(`BAD REQUEST ERROR - HOSTNAME PARAMETER DOES NOT MATCH 'hostname' IN BODY: ${req.params.hostname} != ${hostname}`, 400)
        const found = DEMO_HEALTH_API_DATA.find(ele => ele.hostname === hostname)
        if (found) throw new ExpressError(`BAD REQUEST ERROR - hostname:${hostname} - ALREADY EXISTS. USE PATCH METHOD TO UPDATE, NOT POST`, 400)
        if(requiredFieldsDefined(hostname, active, deepMonitoring, status, next)){
            if (hostname.toLowerCase() === "badhost"){
                throw new ExpressError(`FORBIDDEN ERROR - hostname: ${hostname} - BAD HOST`, 403)
            }
            DEMO_HEALTH_API_DATA.push({hostname, active, deepMonitoring, status})
            return res.status(201).json(DEMO_HEALTH_API_DATA)
        }
    }
    catch(error){
        return next(error)
    }
})

/**
 * PUT /health/:hostname
 * "@params" are required in the request body when using PUT
 * @param  {String} hostname
 * @param  {Boolean} active Whether or not we have health monitoring on the specified hostname
 * @param  {Boolean} deepMonitoring Whether or not we have deepMonitoring on the specified hostname
 * @param  {String} status The status of our monitoring on the specified hostname
 * @return {JSON} adjusted hostname health object for corresponding hostname 
 */
/**
 * @swagger
 * /health/{hostname}:
 *   get:
 *     description: GET hostname health object for specified hostname
 *     parameters:
 *       - in: path
 *         hostname: hostname
 *         schema:
 *           type: string
 *         required: true
 *         description: STRING hostname of the hostname to get health object on
 *     responses:
 *       200:
 *         description: SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: BAD REQUEST - Request body missing required fields or hostname already exists
 *       403:
 *         description: FORBIDDEN - Hostname not acceptable
 *       404:
 *         description: NOT FOUND - Hostname not found
 */
router.put("/:hostname", (req,res,next) => {
    try{
        const reqBody = req.body
        const {hostname, active, deepMonitoring, status} = reqBody
        if(!(req.params.hostname === hostname)) throw new ExpressError(`BAD REQUEST ERROR - HOSTNAME PARAMETER DOES NOT MATCH 'hostname' IN BODY: ${req.params.hostname} != ${hostname}`, 400)
        if(requiredFieldsDefined(hostname, active, deepMonitoring, status, next)){
            DEMO_HEALTH_API_DATA.forEach((listItem) => {
                if (hostname === listItem['hostname']){
                    listItem['active'] = active
                    listItem['deepMonitoring'] = deepMonitoring
                    listItem['status'] = status
                    return res.status(200).json(listItem)
                }
                else{
                    throw new ExpressError(`NOT FOUND ERROR - hostname: ${hostname} - NOT FOUND`, 404)
                }
            })
        }
    }
    catch(error){
        return next(error)
    }
})

/**
 * DELETE /health/:hostname
 * @return {JSON} list of hostname health objects after removal
 */
router.delete('/:hostname', (req,res,next) => {
    try{
        const hostnameToBeDeleted = req.params.hostname
        const found = DEMO_HEALTH_API_DATA.find(ele => ele.hostname === hostnameToBeDeleted)
        console.log(found)
        if (!found) throw new ExpressError(`NOT FOUND ERROR - hostname:${hostnameToBeDeleted} - NOT FOUND`, 404)
        else{
            DEMO_HEALTH_API_DATA = DEMO_HEALTH_API_DATA.filter(ele => ele.hostname !== hostnameToBeDeleted)
            return res.status(202).json(DEMO_HEALTH_API_DATA)
        }
    }
    catch(error){
        return next(error)
    }
})



            /**EXPORTS */



module.exports = router;
