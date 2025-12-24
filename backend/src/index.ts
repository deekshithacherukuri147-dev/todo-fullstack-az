import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/categories";
import todoRoutes from "./routes/todos";



const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/todos", todoRoutes);


app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
