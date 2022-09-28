'use strict';

// eslint-disable-next-line no-undef
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'test1',
          email: 'test1@mail',
          password: '1234',
          avatar: '3rty6ytety544ter',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'test2',
          email: 'test2@mail',
          password: '1234',
          avatar: '2rty6ytety544ter',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'test3',
          email: 'test3@mail',
          password: '1234',
          avatar: '1rty6ytety544ter',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
