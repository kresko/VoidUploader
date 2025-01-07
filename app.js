const express = require('express');
const app = express();

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log("Listening on port " + port);
});