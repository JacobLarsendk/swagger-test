const {ExpressError} = require('./expressError')

const default404 = (req,res,next) => {
    const e = new ExpressError("Page Not Found", 404)
    next(e)
}

module.exports = default404

