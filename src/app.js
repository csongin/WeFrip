require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const appDataSource = require("./models/dataSource");
const routes = require("./routes");
const { globalErrorHandler } = require("./utils/error");
const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(routes);
app.use(globalErrorHandler);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const PORT = process.env.PORT;

const start = async () => {
  await appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized");
    })
    .catch(() => {
      console.log("Errors occurred in Data Source initializing");
      appDataSource.destroy();
    });
  try {
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
  } catch (err) {
    console.error(err);
  }
};
start();
