exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('notes').del()
        .then(function () {
            // Inserts seed entries
            return knex('notes').insert([
                {header: 'header 1', body: 'body 1', photo: 'blue'},
                {header: 'header 2', body: 'body 2', photo: 'red'},
                {header: 'header 3', body: 'body 3', photo: 'green'},
                {header: 'header 4', body: 'body 4', photo: 'orange'},
                {header: 'header 5', body: 'body 5', photo: 'purple'}
            ]);
        });
};
