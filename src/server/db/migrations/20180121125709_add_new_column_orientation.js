exports.up = function(knex, Promise) {
    return knex.schema.alterTable('notes', function(t) {
        // t.increments().primary();
        // drops previous default value from column, change type to string and add not nullable constraint
        t.string('orientation')
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('notes', function(t) {
        // t.increments().primary();
        // drops previous default value from column, change type to string and add not nullable constraint
    t.dropColumn('orientation')
    });
};