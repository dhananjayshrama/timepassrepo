import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Smart Interview API is running" });
});

app.use("/api/interview", interviewRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});