const knex = require('../connection');

function getAllNotes(limit = 'ALL') {

    if (limit === 'ALL') {
        return knex.select('*').from('notes');
    }
    return knex.select('*').from('notes').limit(limit);


}

function getSingleNote(id) {
    return knex.select('*').from('notes').where('id', id)
}

module.exports = {
    getAllNotes,
    getSingleNote
};