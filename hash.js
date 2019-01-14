const bcrypt = require('bcrypt-nodejs');

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash('1234', salt, (err, hashed) => {
    console.log(`Hashed: ${hashed}`);
  });
  console.log(`Salt: ${salt}`);
});
