const express = require("express");
const logger = require("morgan");
const indexRouter = require("./routes/indexRouter");
const gameRouter = require("./routes/gameRouter");
const app = express();


//middleware
app.use(logger("dev"));
app.use(express.json());
app.use("/", indexRouter);
app.use("/api/game", gameRouter);

app.listen(3000, ()=>{
    console.log(`Server is running on PORT: ${3000}`);
});