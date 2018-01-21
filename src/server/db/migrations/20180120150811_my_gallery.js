
exports.up = (knex, Promise) => {
    return knex.schema.createTable('notes', (table) => {
        table.increments();
        table.string('header').nullable();
        table.string('body').nullable();
        table.string('photo').nullable();
        table.timestamp('created_datetime').defaultTo(knex.fn.now());
        table.timestamp('updated_datetime').defaultTo(knex.fn.now());

    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('notes');
};
