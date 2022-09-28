'use strict';

// eslint-disable-next-line no-undef
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'notes',
      [
        {
          description: 'testdesc1',
          color: 'color',
          owner_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'testdesc2',
          color: 'color',
          owner_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'testdesc3',
          color: 'color',
          owner_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('notes', null, {});
  },
};
