'use strict';

// eslint-disable-next-line no-undef
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'tokens',
      [
        {
          refresh_token: 'testtoken1',
          owner_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('tokens', null, {});
  },
};
