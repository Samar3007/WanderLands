module.exports = func => {
    return (req, res, next)=>{
        func(req, res, next).catch(next);
    }
}

//func is what is passed, this returns new function that has func executed and catches and passes it to next;