import express from "express";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// create project
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, link, tech } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const project = new Project({
      user: req.userId,
      title,
      description,
      link,
      tech: Array.isArray(tech) ? tech : (tech ? tech.split(",").map(t => t.trim()) : [])
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: err.message });
  }
});

// get all projects for user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ message: err.message });
  }
});

// update project
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });

    const { title, description, link, tech } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (link !== undefined) project.link = link;
    if (tech !== undefined) project.tech = Array.isArray(tech) ? tech : (tech ? tech.split(",").map(t => t.trim()) : []);

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: err.message });
  }
});

// delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.user.toString() !== req.userId) return res.status(403).json({ message: "Forbidden" });
    await project.remove();
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
