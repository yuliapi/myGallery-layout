const Router = require('koa-router');
const queries = require('../db/queries/notes');

const router = new Router();
const BASE_URL = `/api/v1/notes`;

router.get(BASE_URL, async (ctx) => {
    try {
        let notes;
        if (ctx.query.limit) {
            notes = await queries.getAllNotes(ctx.query.limit);
        } else {
            notes = await queries.getAllNotes();
        }
        ctx.body = {
            status: 'success',
            data: notes
        };
    } catch (err) {
        console.log(err)
    }
});

router.get(`${BASE_URL}/:id`, async(ctx) => {
    try {
        const note = await queries.getSingleNote(ctx.params.id);
        ctx.body = {
            status: 'success',
            data: note
        }
    }
    catch(err) {
        console.log(err)
    }
})

module.exports = router;