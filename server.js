const express = require("express");
const userRouter = require("./routes/user.routes");
const app = express();
const connectDB = require("./configs/db");
const bookRouter = require("./routes/book.routes");
const authorRouter = require("./routes/author.routes");
const analyticsRouter = require("./routes/analytics.routes");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json())
connectDB()
app.use("/api/v1/", userRouter);
app.use("/api/v1/", authorRouter)
app.use("/api/v1/", bookRouter)
app.use("/api/v1", analyticsRouter)


app.listen(PORT, ()=>{
    console.log(`server started http://localhost:${PORT}`)
})