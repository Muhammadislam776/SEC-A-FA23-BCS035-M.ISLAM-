const express = require("express");
const path = require("path");
const PDFDocument = require("pdfkit");

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ROUTES
// Home
app.get("/", (req, res) => {
  res.render("home");
});

// About
app.get("/about", (req, res) => {
  res.render("about");
});

// Experience
app.get("/experience", (req, res) => {
  res.render("experience");
});

// Projects
app.get("/projects", (req, res) => {
  res.render("projects");
});

// Contact
app.get("/contact", (req, res) => {
  res.render("contact");
});

// CV Page
app.get("/cv", (req, res) => {
  res.render("cv");
});


// DOWNLOAD CV PDF
app.get("/download-cv", (req, res) => {

  const doc = new PDFDocument({ size: "A4", margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=MuhammadIslamCV.pdf");

  doc.pipe(res);

  // HEADER
  doc
    .fontSize(26)
    .fillColor("#1F4E79")
    .text("Muhammad Islam", { align: "center" });

  doc
    .fontSize(14)
    .fillColor("#000")
    .text("Full Stack Web Developer", { align: "center" });

  doc.moveDown();

  // CONTACT
  doc
    .fontSize(12)
    .text("Email: muhammadislam6590.i@gmail.com")
    .text("Phone: +92 319 6590756")
    .text("Location: Pakistan");

  doc.moveDown();

  // EDUCATION
  doc
    .fontSize(18)
    .fillColor("#1F4E79")
    .text("Education");

  doc
    .fontSize(12)
    .fillColor("#000")
    .list([
      "BS Computer Science – COMSATS University Islamabad (6th Semester)",
      "Intermediate – KIPS College",
      "Matriculation – Local School"
    ]);

  doc.moveDown();

  // SKILLS
  doc
    .fontSize(18)
    .fillColor("#1F4E79")
    .text("Skills");

  doc
    .fontSize(12)
    .fillColor("#000")
    .list([
      "HTML5, CSS3, JavaScript",
      "Bootstrap",
      "Node.js, Express",
      "MongoDB",
      "Git & GitHub"
    ]);

  doc.moveDown();

  // PROJECTS
  doc
    .fontSize(18)
    .fillColor("#1F4E79")
    .text("Projects");

  doc
    .fontSize(12)
    .fillColor("#000")
    .list([
      "Portfolio Website – Node.js & Bootstrap",
      "Task Manager – Express + MongoDB",
      "Ecommerce UI – HTML/CSS/JS"
    ]);

  doc.moveDown();

  // EXPERIENCE
  doc
    .fontSize(18)
    .fillColor("#1F4E79")
    .text("Experience");

  doc
    .fontSize(12)
    .fillColor("#000")
    .list([
      "Frontend Developer – COMSATS University",
      "Web Development Intern – ABC Solutions",
      "Freelance Web Developer"
    ]);

  doc.end();
});


if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
