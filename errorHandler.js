
const errorHandler = (error, req, res, next) => {
    let status = error.status || 500;
    let msg = error.msg;
    return res.status(status).json({error: {status: status, msg: msg}, stack: error.stack})
}

module.exports = errorHandler

