const Koa = require('koa');
const cors = require('@koa/cors');
const indexRoutes = require('./routes/index');
const notesRoutes = require('./routes/notes');

const app = new Koa();
const PORT = process.env.PORT || 1337;

app.use(cors());
app.use(indexRoutes.routes());
app.use(notesRoutes.routes());

const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;

