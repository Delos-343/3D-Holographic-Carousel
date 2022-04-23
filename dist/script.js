var radius = 250; // carousel radius
 var autoRotate = true; // auto rotate
 var rotateSpeed = -60; // rotate: 360 deg/sec
 var imgWidth = 120; // img width in px
 var imgHeight = 170; // img height in px

 // Music link or API - set to 'null' for no music
 var bgMusicURL = null;  
 var bgMusicControls = true;

 // ===================== start =======================  
 // animation.start > 1000 miliseconds  
 setTimeout(init, 1000);  
 var odrag = document.getElementById('drag-container');  
 var ospin = document.getElementById('spin-container');  
 var aImg = ospin.getElementsByTagName('img');  
 var aVid = ospin.getElementsByTagName('video');  
 var aEle = [...aImg, ...aVid]; // combine 2 arrays

 // img size
 ospin.style.width = imgWidth + "px";  
 ospin.style.height = imgHeight + "px";

 // ground size : radius
 var ground = document.getElementById('ground');  
 ground.style.width = radius * 3 + "px";  
 ground.style.height = radius * 3 + "px";

 function init(delayTime) {  
  for (var i = 0; i < aEle.length; i++) {  
   aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";  
   aEle[i].style.transition = "transform 1s";  
   aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";  
  }  
 }

 function applyTranform(obj) {  
  // Constrain camera angle (~ 0 and 180)  
  if(tY > 180) tY = 180;  
  if(tY < 0) tY = 0;
   
  // Apply the angle  
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";  
 }

 function playSpin(yes) {  
  ospin.style.animationPlayState = (yes?'running':'paused');  
 }

 var sX, sY, nX, nY, desX = 0,  
     desY = 0,  
     tX = 0,  
     tY = 10; 

 // auto spin  
 if (autoRotate) {  
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');  
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;  
 }  

 // add background music  
 if (bgMusicURL) {  
  document.getElementById('music-container').innerHTML += `  
 <audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
 <p>If you are reading this, it is because your browser does not support the audio element.</p>  
 </audio>  
 `;  
 }  

 // sevent handling 
 document.onpointerdown = function (e) {
   
  clearInterval(odrag.timer);  
  e = e || window.event;  
  var sX = e.clientX,  
    sY = e.clientY;
   
  this.onpointermove = function (e) {
   e = e || window.event;
    
   var nX = e.clientX,  
     nY = e.clientY;
    
   desX = nX - sX;  
   desY = nY - sY;
    
   tX += desX * 0.1;  
   tY += desY * 0.1;
    
   applyTranform(odrag);
    
   sX = nX;  
   sY = nY;  
  };
   
  this.onpointerup = function (e) {  
   odrag.timer = setInterval(function () {  
    desX *= 0.95;  
    desY *= 0.95;  
    tX += desX * 0.1;  
    tY += desY * 0.1;  
    applyTranform(odrag);  
    playSpin(false);
     
    if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {  
     clearInterval(odrag.timer);  
     playSpin(true);  
    }  
   }, 17);
    
   this.onpointermove = this.onpointerup = null;  
  };
   
  return false;  
 };


 document.onmousewheel = function(e) {  
  e = e || window.event;  
  var d = e.wheelDelta / 20 || -e.detail;  
  radius += d;  
  init(1);  
 };