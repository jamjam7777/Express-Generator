const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find( { user: req.user._id } )
    .populate('campsites', 'user')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})

// .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Favorite.findOne({user: req.user._id })
//     .then(favorite => {
//         if (req.user._id.includes(Favorite)) {
//             err = new Error ("That campsite is already a favorite!") ;
//             err.statu = 404;
//             return next(err);
        
//         } else {

//         console.log('Campsite Created', favorite);
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favorite);
//     })
//     .catch(err => next(err));
// })

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode =403;
    res.end('PUT operation not supported on /campsites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findOneAndDelete()
    .then(favorite => { 
        if (favorite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        } else {
            res.statusCode =403;
            res.end('You do not have any favorites to delete.'); 
        }
    })
    .catch(err => next(err));
});




favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
     $set: req.body   
    }, { new: true})
    .then(campsite => {
    res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
    })


.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));       
});


module.exports = favoriteRouter;
