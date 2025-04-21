document.addEventListener('DOMContentLoaded', function () {
  const encodeButton = document.getElementById('encodeButton');
  const decodeButton = document.getElementById('decodeButton');
  const encodeForm = document.getElementById('encode-form');
  const decodeForm = document.getElementById('decode-form');


  encodeButton.addEventListener('click', function () {
    encodeForm.style.display = 'block';
    decodeForm.style.display = 'none';
    document.getElementById('output').style.display = 'none';
    document.getElementById('out').style.display = 'none';
    
  });

  decodeButton.addEventListener('click', function () {
    decodeForm.style.display = 'block';
    encodeForm.style.display = 'none';
    document.getElementById('output').style.display = 'none';
    document.getElementById('out').style.display = 'none';

  });


 
  
function stringToCharCodeArray(str) {
  return [...str].map(char => char.charCodeAt(0));
}

function charCodeArrayToString(arr) {
  return arr.map(code => String.fromCharCode(code)).join('');
}

// Encode 
document.getElementById("encode-form").onsubmit = function (e) {
  e.preventDefault();

  const file = document.getElementById("encode-image").files[0];
  const password = document.getElementById("pas").value;
  const message = document.getElementById("secret-message").value;

  if (!file || !password || !message) {
    alert("Please fill all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const combined = `${password}::${message.length}::${message}`;
      const codes = stringToCharCodeArray(combined);

      if (codes.length * 4 > pixels.length) {
        alert("Message is too long for this image.");
        return;
      }

      for (let i = 0, j = 0; i < codes.length; i++, j += 4) {
        pixels[j] = codes[i]; 
      }

      ctx.putImageData(imageData, 0, 0);
      const encodedURL = canvas.toDataURL("image/png");

      const link = document.querySelector("#output a");
      link.href = encodedURL;

      document.getElementById("output").style.display = "block";
      document.getElementById("encode-form").style.display = "none";

    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

// Decode 
document.getElementById("decode-form").onsubmit = function (e) {
  e.preventDefault();
  document.getElementById('decode-form').style.display = 'none';
  document.getElementById("out").style.display = "block";
  
  const file = document.getElementById("decode-image").files[0];
  const enteredPassword = document.getElementById("dpas").value;

  if (!file || !enteredPassword) {
    alert("Please fill all fields.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let chars = [];
      for (let i = 0; i < 1000 && i * 4 < pixels.length; i++) {
        chars.push(pixels[i * 4]); 
      }

      const raw = charCodeArrayToString(chars);
      const [storedPassword, msgLenStr, ...msgParts] = raw.split("::");

      const outDiv = document.getElementById("out");
      outDiv.style.display = "block";

      if (storedPassword === enteredPassword) {
        const msgLen = parseInt(msgLenStr);
        const message = msgParts.join("::").substring(0, msgLen);
        outDiv.innerHTML = `
        
        <p>Secret Message: ${message}</p>
         </div>
        `;
      } else {
        outDiv.innerHTML = `<p style="color:red;">❌ Incorrect password!</p>`;
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};
  




 
















































});
