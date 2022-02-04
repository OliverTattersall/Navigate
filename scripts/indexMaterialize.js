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




function loadModalContent(modal, items){
  console.log(items)
  // items[0]._popup._content
    document.getElementById(modal).innerHTML = '<h4>Favourite Locations</h4>'
    // items = Object.values(items)
    // console.log(modal)
    // console.log(document.getElementById(modal))
    var str="";
    let temp1 = '<a class="waves-effect modal-close waves-green teal lighten-4 black-text modalList">';
    let temp2 = '</a>';
    for(i=0;i<items.length;i++){
      // console.log(items[i])
        console.log(items[i]._popup._content)
        str=str+temp1+items[i]._popup._content+temp2
      
    }
    document.getElementById(modal).innerHTML+=str+'<a class="waves-effect modal-close waves-green teal lighten-4 black-text modalList" id="addLoc" onclick="star=true;">Add a favourite locations</a>';
}