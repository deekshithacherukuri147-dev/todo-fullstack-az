import { Router } from "express";
import { categories, generateId, todos } from "../store/db";

const router = Router();
router.get("/", (_req, res) => {
  res.status(200).json(categories);
});

router.post("/", (req, res) => {
  const { name } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const normalized = name.trim();
  const duplicate = categories.some(
    c => c.name.toLowerCase() === normalized.toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ message: "Category already exists" });
  }

  const newCategory = {
    id: generateId(),
    name: normalized,
    createdAt: new Date(),
  };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});


router.delete("/:id", (req,res) => {
    const {id} = req.params;
    const index = categories.findIndex(c=> c.id === id);
    if (index === -1){
        return res.status(404).json({message : "Category not found"});
    }
    categories.splice(index,1);
    for (let i = todos.length - 1; i >= 0; i -= 1) {
      if (todos[i].categoryId === id) {
        todos.splice(i, 1);
      }
    }
    res.status(204).send();
})

export default router;
