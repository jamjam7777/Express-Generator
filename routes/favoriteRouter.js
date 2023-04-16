const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find( { user: req.user._id } )
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(fave => {
                if (!favorite.campsites.includes(fave._id)) {
                    favorite.campsites.push(fave._id);
                }
            });
            favorite
                .save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err))
            } else {
                Favorite.create({user: req.user._id })
                .then(favorite => {
                    req.body.forEach(fave => {
                    favorite.campsites.push(fave._id);
                });
                favorite 
                .save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err)); 
            })
        .catch(err => next(err));
            }
    })
    .catch(err => next(err));       
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode =403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOneAndDelete()
    .then(favorite => { 
        if (favorite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
        } else {
            res.statusCode =403;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You do not have any favorites to delete.'); 
        }
    })
    .catch(err => next(err));
});


favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode =403;
    res.end('PUT operation not supported on /favorites');
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.user._id.includes
            
            .then(favorite => {
            err = new Error ("That campsite is already in the list of favorites!") ;
            err.status = 404;
            return next(err);
            })
            .catch(err => next(err));
        } else {
            favorite.comments.push(req.body);
            campsite.save()
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
                }
            })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode =403;
    res.end('PUT operation not supported on /favorites');
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
