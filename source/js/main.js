// Main menu show/hide handler for mobile

var menuButton = document.querySelector('.main-nav__toggle');
var mainMenu = document.querySelector('.main-nav');

menuButton.addEventListener('click', function(){
  if(this.classList.contains('main-nav__toggle--active')){
    mainMenu.classList.remove('main-nav--open');
    this.classList.remove('main-nav__toggle--active');
  } else {
    mainMenu.classList.add('main-nav--open');
    this.classList.add('main-nav__toggle--active');
  }
});
