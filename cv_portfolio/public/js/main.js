const elements=document.querySelectorAll(
".skill-card,.service-card,.project-card"
);
const toggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

toggle.addEventListener("click", () => {
sidebar.classList.toggle("show");
});
const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

elements.forEach(el=>{
observer.observe(el);
});

document.addEventListener("DOMContentLoaded", function () {

const filterButtons = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");

filterButtons.forEach(button => {

button.addEventListener("click", () => {

document.querySelector(".filter-btn.active").classList.remove("active");
button.classList.add("active");

const filter = button.getAttribute("data-filter");

projectItems.forEach(item => {

if (filter === "all") {
item.style.display = "block";
}

else if (item.classList.contains(filter)) {
item.style.display = "block";
}

else {
item.style.display = "none";
}

});

});

});

});
// Smooth scrolling for sidebar links
document.querySelectorAll('.menu-item').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if(target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = link.getAttribute('href'); // navigate if different page
    }
  });
});

// Highlight active menu item on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  let scrollPos = window.scrollY || window.pageYOffset;

  sections.forEach(section => {
    const offsetTop = section.offsetTop - 60; // adjust offset for sidebar
    const offsetBottom = offsetTop + section.offsetHeight;
    const menuItem = document.querySelector(`.menu-item[href="#${section.id}"]`);
    if(menuItem) {
      if(scrollPos >= offsetTop && scrollPos < offsetBottom) {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        menuItem.classList.add('active');
      }
    }
  });
});

// Hero typing text effect
  // TYPING ANIMATION
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    const texts = ["Full Stack Developer", "Web Developer", "Node.js Expert"];
    let count = 0, index = 0, currentText = "", letter = "";
    function type() {
      if (count === texts.length) count = 0;
      currentText = texts[count];
      letter = currentText.slice(0, ++index);
      typingText.textContent = letter;
      if (letter.length === currentText.length) {
        setTimeout(() => {
          index = 0;
          count++;
          type();
        }, 2000);
      } else {
        setTimeout(type, 100);
      }
    }
    type();
  }

// CV Preview iframe - optional: reload on button click to refresh CV
const cvBtn = document.querySelector('.btn-cv-download');
if(cvBtn) {
  cvBtn.addEventListener('click', () => {
    const iframe = document.querySelector('iframe');
    if(iframe) {
      iframe.src = '/download-cv';
    }
  });
}
