//side nav
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

//dropdown trigger
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems);
});

//dropdown initialization
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
  // console.log(elems[0])
});

// modal initialization
// cool stuff to talk about, DOM, generalized modals, dictionary
document.addEventListener('DOMContentLoaded', function() {
  var options = {onOpenEnd:closeSideOnModal, onCloseEnd: openSideOnModal}
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, options);
});



function closeSideOnModal(){
  // console.log("hello")
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.getInstance(elems[0]).close();
}
function openSideOnModal(){
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.getInstance(elems[0]).open();
}