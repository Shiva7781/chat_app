const app = require("./index");
const connectDB = require("./configs/db");
require("dotenv").config();

const port = process.env.PORT || 7781;
app.listen(port, () => {
  connectDB();
  console.log(
    `Backend server is runnig on http://localhost:${port} DB connecting...`
  );
});
