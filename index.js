
// set to true to make all divs have a random color. This is purely for testing purposes
// rand_colors = true;
rand_colors = false;


function scrollToDiv(target_id) {
  const targetDiv = document.getElementById(target_id);
  const toolbarHeight = document.querySelector('.toolbar-container').offsetHeight;
  const targetDivPosition = targetDiv.offsetTop - 1.1*(toolbarHeight);

  window.scrollTo({
    top: targetDivPosition,
    behavior: 'smooth' 
  });
}


function toggleMenu() {
  console.log("in togglemenu")
  var menu = document.querySelector('.hamburger-menu');
  menu.classList.toggle('show');

}

function dismissMenu(){
  console.log("in dismiss")
  var menu = document.querySelector('.hamburger-menu');
  menu.classList.toggle('show');
}


if (rand_colors){
  function assignRandomLightColorToDivs() {
    var divs = document.getElementsByTagName("div");
    for (var i = 0; i < divs.length; i++) {
        var randomLightColor = getRandomLightColor();
        divs[i].style.backgroundColor = randomLightColor;
    }
  }
  function getRandomLightColor() {

    var red = Math.floor(Math.random() * 76) + 80;
    var green = Math.floor(Math.random() * 76) + 80; 
    var blue = Math.floor(Math.random() * 76) + 80; 

    var lightColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
    return lightColor;
  }
  window.onload = assignRandomLightColorToDivs;
}