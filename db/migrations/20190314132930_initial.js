
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('password');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('recipes', (table) => {
      table.increments('id').primary();
      table.string('yummly_url');
      table.string('baking_notes');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.timestamps(true,true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('recipes')
  ]);
};
