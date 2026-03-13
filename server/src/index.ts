import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./router/router";


const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
