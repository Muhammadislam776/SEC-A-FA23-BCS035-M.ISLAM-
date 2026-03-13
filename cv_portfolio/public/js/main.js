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
