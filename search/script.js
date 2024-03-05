function search() {
  var search = document.getElementById('searchbox');
  if (search.value.length == 0) {
    search.classList.add('error');
  } else {
    window.open('https://www.bing.com/search?q='+search.value);
  }
}
function checkKey(event) {
  var event = event || window.event;
  if (event.keyCode == 13) {
    search();
  }
}
function sthBoxOnClick(e) {
  var n = document.getElementById('searchbox');
  var a = document.getElementById('cover');
  n.classList.add('click');
  n.classList.remove('error');
  a.classList.add('show');
}
function coverOnClick() {
  var e = document.getElementById('cover');
  if (e.classList.contains('show')) {
    var n = document.getElementById('searchbox');
    n.classList.remove('click');
    n.classList.remove('error');
    e.classList.remove('show');
  }
}
function nowTime(a) {
  var date = new Date();
  var hour = date.getHours().toString().padStart(2,0);
  var minute = date.getMinutes().toString().padStart(2,0);
  var second = date.getSeconds().toString().padStart(2,0);
  return a == 1 ? `${hour}:${minute}` : `${hour}:${minute}:${second}`;
}
window.onload = () => document.getElementById("time").innerHTML = nowTime();
setInterval(() => document.getElementById("time").innerHTML =nowTime(),100);