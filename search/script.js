function search() {
  var search = document.getElementById('searchbox');
  if (search.value.length == 0) {
    search.style.background = 'rgba(255,220,220,0.7)';
    search.style.border = 'solid 2px rgba(255,50,50,0.7)'
  } else {
    window.open('https://www.bing.com/search?q='+search.value)
  }
}
function checkKey(event) {
  var event = event || window.event;
  if (event.keyCode == 13) {
    search();
  }
}
function sthBoxOnClick(e) {
  e.target.style.background = 'rgba(255,255,255,0.8)';
  e.target.style.width = '70%';
  e.target.style.border = 'none'
  document.getElementById('cover').classList.add('show');
}
function coverOnClick() {
  var e = document.getElementById('cover');
  if (e.classList.contains('show')) {
    var n = document.getElementById('searchbox');
    n.style.width = '50%';
    n.style.background = 'rgba(255,255,255,0.6)';
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