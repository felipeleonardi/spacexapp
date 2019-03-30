const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const port = process.env.PORT || 5000;
const schema = require('./schema');

// Allow cross-origin
const cors = require('cors');
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});