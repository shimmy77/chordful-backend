const express = require('express')
const path = require('path')
const xss = require('xss')
const NotesService = require('./notes-service')

const chordsRouter = express.Router()
const jsonParser = express.json()

const serializeNotes = note => ({
    id: chord.id,
    title: xss(chord.title),
    artist: chord.content,
    key: chord.folder_id,
    tuning: chord.tuning,
    lyrics: chord.lyrics
})

chordsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ChordsService.getAllNotes(knexInstance)
            .then(notes => {
                res.json(chords)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, artist, key, tuning, lyrics } = req.body
        const newChord = { title, artist, key, tuning, lyrics }

        for (const [key, value] of Object.entries(newChord)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        ChordsService.insertChord(
            req.app.get('db'),
            newChord
        )
            .then(chord => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${chord.id}`))
                    .json(serializeNotes(chord))
            })
            .catch(next)
    })

chordsRouter
    .route('/:chord_id')
    .all((req, res, next) => {
        ChordsService.getChordById(
            req.app.get('db'),
            req.params.chord_id
        )
        .then(chord => {
            if(!chord) {
                return res.status(404).json({
                    error: { message: `Chords doesn't exist` }
                })
            }
            res.chord = chord
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.chord)
    })
    .delete((req, res, next) => {
        ChordsService.deleteChord(
            req.app.get('db'),
            req.params.chord_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, artist, key, tuning, lyrics } = req.body
        const newchord = { title, artist, key, tuning, lyrics }
        
        const numberOfValues = Object.values(newChord).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'title', 'artist', or 'chord id'`
                }
            })
        }

        ChordsService.updateChord(
            req.app.get('db'),
            req.params.chord_id,
            newChord
        )
        .then(() =>{
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = ChordsRouter