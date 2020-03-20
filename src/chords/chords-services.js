const ChordsService = {
    getAllChords(knex) {
        return knex.select('*').from('chordful_chords')
    },
    insertChord(knex, newChord) {
        return knex
            .insert(newChord)
            .into('chordful_chords')
            .returning('*')
            .then(rows => {
                return rows [0]
            })
    },
    getById(knex, id) {
        return knex
            .from('chordful_chords')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteChord(knex, id) {
        return knex('chordful_chords')
            .where({ id })
            .delete()
    },
    updateLyrics(knex, id, newChordFields) {
        return knex('chordful_chords')
            .where({ id })
            .update(newChordFields)
    },
}

module.exports = ChordsService