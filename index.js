
function scrollToDiv(target_id) {
  const targetDiv = document.getElementById(target_id);
  const toolbarHeight = document.querySelector('.toolbar-container').offsetHeight;
  const targetDivPosition = targetDiv.offsetTop - (toolbarHeight);

  window.scrollTo({
    top: targetDivPosition,
    behavior: 'smooth' 
  });
}

function toggleMenu() {
  var menu = document.querySelector('.hamburger-menu');
  menu.classList.toggle('show');
}

function dismissMenu(){
  var menu = document.querySelector('.hamburger-menu');
  menu.classList.toggle('show');
}
