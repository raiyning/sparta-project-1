var data = document.getElementById('data');
var text;

var ballSpeed = 1;
//GUIパラメータの準備
var sampleText = function () {
  this.message = "Radical Instrudtcions";
  this.color = "#ff0000";
  this.fontSize = 24;
  this.border = false;
  this.fontFamily = "sans-serif";
};

//GUI表示
window.onload = function () {
  text = new sampleText();
  setValue();
  var gui = new dat.GUI();
  gui.add(text, 'message').onChange(setValue);
  gui.addColor(text, 'color').onChange(setValue);
  gui.add(text, 'fontSize', 6, 48).onChange(setValue);
  gui.add(text, 'border').onChange(setValue);
  gui.add(text, 'fontFamily', ["sans-serif", "serif", "cursive", "ＭＳ 明朝", "monospace"]).onChange(setValue);
};

//設定更新処理
function setValue() {
  data.innerHTML = text.message;
  data.style.color = text.color;
  data.style.fontSize = text.fontSize + "px";
  data.style.fontFamily = text.fontFamily;
  if (text.border) {
    data.style.border = "solid 1px black";
    data.style.padding = "10px";
  }
  else {
    data.style.border = "none";
    data.style.padding = "0px";
  }
}