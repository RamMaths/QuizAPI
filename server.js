const PORT = process.env.PORT || 3000;
const app = require('./app');
const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(con => console.log('\n\nconnection succesfully'));

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
