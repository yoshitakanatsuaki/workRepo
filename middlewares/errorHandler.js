module.exports = function(err, req, res, next) {
    const resErr ={};
    resErr.status = err.status;
    resErr.message = err.message;
    console.dir(resErr , {depth: null});
    res.status(resErr.status);
    res.send(resErr);
    };