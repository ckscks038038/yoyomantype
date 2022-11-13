const {
  addNewConnectedUsersToMap,
  removeDisconnectedUsersFromMap,
} = require('./roomMap');
addNewConnectedUsersToMap({ roomId: 123, userMail: 'abc' });

const map = {};

map['123'] = { users: { name: 'kyle' } };

map['123'].artcle = 'abcd';

console.log(map['123']);
