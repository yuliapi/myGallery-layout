# myGallery-layout
Start API koa-server
````
$npm start
````
Delete all records from development database and fill it with a new data
````
$knex seed:run --env development
````
To make changes to the database schema
1. Create new migration step:
````
knex migrate:make name_of_migration_step 
````

2. Add require changes to generated migration script
http://knexjs.org/#Schema

3. Check if seeds and tests need to be changed according to new schema

````
knex migrate:latest --env development
````

4. Run tests 
````
$npm test
````
To process frontend static content and run content watcher execute
````
$grunt
````