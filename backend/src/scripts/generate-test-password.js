const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password:', password);
  console.log('Generated hash:', hash);
  console.log('Hash prefix:', hash.substring(0, 4));
}

generateHash().catch(console.error);
