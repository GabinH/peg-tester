# Highligth code editor

```html
<div class='main'>
  <pre class="myText"></pre>
  <textarea name="" id="myTextarea" cols="60" rows="20" autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false"></textarea>
</div>
```

```js
var area = document.querySelector('textarea');
var myText = document.querySelector('.myText');
var reg = new RegExp("\n", "ig");
area.addEventListener('input', function handleChange(event) {
    console.log(event.target.value);
    myText.innerHTML = event.target.value
        .replaceAll(' is ', '<span class="blue" title="this is a IS"> is </span>')
        .replace(reg, '<br>');
}, false);
myText.addEventListener('click', (event) => {
    area.focus();
});
```

```css
.main {
    /*background-color: blue;*/
    position: relative;
    height: 500px;
}
.blue {
    color: blue;
}
.blue:hover{
    color: green;
}
#myTextarea{
    font-family:"Times New Roman", Times, serif;
    color: transparent;
    font-size: 20px;
    background: none;
    position: absolute;
    top:0;
    left:0;
    display: block;
    z-index: 10;
    height: 300px;
    width: 500px;
    caret-color: black;
}
.myText{
    font-family:"Times New Roman", Times, serif;
    font-size: 20px;
    background: transparent;
    position: absolute;
    top:0;
    left:0;
    height: 300px;
    width: 500px;
    z-index: 20;
    margin: 4px;
}
.myText:hover{
    cursor:pointer;
}
```
