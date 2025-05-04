/* 
    ----- THEME TOGGLE FEATURE -----
*/

// Calculates the current setting by comparing them to 
function calcSettingAsThemeString({ localStorageTheme}) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    }
}
  
// Update button image and aria-label.
function updateButton({ themeButton, isLight }) {
    const newCta = isLight ? "Dark" : "Light"; // If isLight is true, assign "Dark", else if isLight is false, assign "Light"
    // Updates aria label based on theme
    themeButton.setAttribute("aria-label", newCta);
    // Changes button image based on theme
    if (newCta == "Dark") {
        themeImg.src = "svg/dark-theme.svg";
    } else if (newCta == "Light") {
        themeImg.src = "svg/light-theme.svg";
    }
}
  
// Utility funct to update the theme setting on the html tag
function updateHTMLElementTheme({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
}
  
// Assign elements and localstorage items to variables
const themeButton = document.querySelector("[data-theme-toggle]");
const themeImg = document.getElementById("themeImg");
const localStorageTheme = localStorage.getItem("theme");

// Get current settings
let currentThemeSetting = calcSettingAsThemeString({localStorageTheme});
  
// Update the theme setting and button image based on settings
updateButton({ themeButton: themeButton, isLight: currentThemeSetting === "dark" });
updateHTMLElementTheme({ theme: currentThemeSetting });
  

// Event listener on button to toggle the theme 
themeButton.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark"; // Short-hand if else - If (currentThemeSetting) = dark, then newTheme = light etc.
    localStorage.setItem("theme", newTheme);
    updateButton({ themeButton: themeButton, isLight: newTheme === "dark" });
    updateHTMLElementTheme({ theme: newTheme });
  
    currentThemeSetting = newTheme; // Sets theme setting to the theme thats been switched to
});

/* 
    ----- PRODUCT DESCRIPTION ON HOVER -----
*/

// Get array of info-boxes on page
var infoboxes = document.getElementsByClassName("product-infoBox"); 

// on hover, add visible class to info-box's parent's sibling overlay element
var hover = function() { 
  try {
    var overlay = this.parentElement.nextElementSibling; // Get the overlay element of the product relative to the infoBox
    overlay.classList.add("visible");  // Add the 'visible' class
  } catch(err) { 
    // Tells me which product is missing the overlay element if there isnt one :D
    console.log(`Missing overlay element for product "${this.parentElement.querySelector(".productTitle").innerHTML}"`)
  }
}

// remove visible when no longer hovered
var endHover = function() { 
  try {
    var overlay = this.parentElement.nextElementSibling;
    overlay.classList.remove("visible");
  } catch(err) { } // Suppress errors to only print on hover off
}

// iterate through infobox array
for (var i = 0; i < infoboxes.length; i++) { 
  infoboxes[i].addEventListener('mouseover', hover, false);
  infoboxes[i].addEventListener('mouseout', endHover, false);
}

/* 
    ----- TOAST POPUP -----
*/

function toastFunction(text) {
    const footerRef = document.querySelector('.footer'); // Make a reference to the footer
    var toast = document.createElement("div"); // Create the toast element
    footerRef.before(toast); // Insert toast popup before the footer
    toast.classList.add('toastPopup'); // Add toastPopup class to it
    toast.innerHTML = `${text}`;
    toast.classList.add("visible"); // Add the "show" class to DIV
    // remove the DIV after 3.5 seconds
    setTimeout(function(){ toast.remove(); }, 3500);
};

/* 
    ----- CHECKOUT FORM VALIDATION -----
*/

const form = document.querySelector("#form");

const forenameInput = document.querySelector("#forenameInput");
const surnameInput = document.querySelector("#surnameInput");

const email = document.querySelector("#emailInput");
const teleInput = document.querySelector("#teleInput");
const countryInput = document.querySelector("#countryInput");

const address1 = document.querySelector("#address1-field");
const address2 = document.querySelector("#address2-field");
const address3 = document.querySelector("#address3-field");

const emailRegex = /[A-Za-z0-9]+@[A-Za-z0-9]+/i;
const teleRegex = /[0-9]{10,11}/;
let isValid = true;
let errors = [];

try {
form.addEventListener("submit", (event) => {
  event.preventDefault();
  errors = [];

  // Check if any field empty
  if((forenameInput.value || surnameInput.value || email.value || teleInput.value || countryInput.value || address1.value || address2.value || address3.value)  === '') {
    errors.push("Please fill in all fields.");
    showError();
    return isValid = false;
  }
  
  // Email
  if(!emailRegex.test(email.value)) {
    errors.push("This is not a valid email address.");
    showError();
    return isValid = false;
  }

  // Telephone Number
  if(!teleRegex.test(teleInput.value)) {
    errors.push("This is not a valid number. \n Must be a UK number between 10 and 11 digits.");
    showError();
  }

  // Names must have between 2 and 50 characters.
  if((forenameInput.value.length || surnameInput.value.length) < 2 || (forenameInput.value.length || surnameInput.value.length) > 50) {
    errors.push("This is not a valid name. Please try again");
    showError();
    return isValid = false;
  }

  // Submit form
  if(isValid = true) {
      toastFunction("Success! Order has been sent.");
      // Submits using fetchAPI (no need for page reload, and preventDefault overrides submit)
      fetch(form.action, {
        method: "post",
        body: new FormData(form)
      });
      submitFormAnimation();
      console.log("Success");
  }
});
} catch(err) {console.log("Error: No element with form class on page.")}

function showError(){ // Function to join together errors and pass it to toast function
  var message = errors.join("<br>");
  toastFunction(message);
}

/* 
    ----- CANVAS ANIMATION ON FORM SUBMIT -----
*/

function submitFormAnimation() {
  // Create canvas and append
  const animCanvas = document.createElement('canvas');
  animCanvas.id = "submitAnimCanvas"; // Set ID
  animCanvas.width = 200; // Set width
  animCanvas.height = 200; // Set height
  document.body.appendChild(animCanvas); // Append to document

  const xMid = animCanvas.width / 2; // For convenience
  const yMid = animCanvas.height / 2; 

  const ctx = animCanvas.getContext('2d');

  let drawingX = 0; // Initial X pos of the drawing
  const drawingSpeed = 1.5; // Speed of the drawing

  function drawShape(x, y) {
      ctx.beginPath();
      ctx.moveTo(x, y); // Start at middle
      ctx.lineTo(x - 40, y - 20); // Stroke to the left and up
      ctx.lineTo(x - 35, y); // Stroke inwards (little folded bit)
      ctx.lineTo(x - 40, y + 20); // Stroke out back again
      ctx.fillStyle = 'whitesmoke';
      ctx.fill(); // Fill prior to middle line so it doesn't overwrite it
      ctx.lineTo(x, y); 
      ctx.lineTo(x - 35, y); // Little middle line :3
      ctx.stroke();
  }

  function drawTick() {
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo((xMid + 15), (yMid - 25));
      ctx.lineTo(xMid - 10, yMid + 15 );
      ctx.lineTo(xMid - 20, yMid);
      ctx.stroke();
  }

  function updateShape() {
      ctx.clearRect(0, 0, animCanvas.width, animCanvas.height); // Clear canvas
      if (localStorageTheme == "dark" ) {
        ctx.fillStyle = "rgb(160, 160, 160)";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(0,0,animCanvas.width,animCanvas.height); // Add background depending on theme

      if (drawingX < (animCanvas.width + (animCanvas.width / 4))) { // While shape <25% out of the canvas
          drawShape(drawingX, yMid); // Draw shape at specified x and middle of y
          drawingX += drawingSpeed; // Move the shape to the right
      } else {
          drawTick();
          setTimeout(() => {
              animCanvas.remove(); // Remove canvas after 0.8s
          }, 900);
      }
      requestAnimationFrame(updateShape); // Draws on each call
  }
  updateShape();
}

/* 
    ----- LOAD PRODUCTS FROM JSON -----
*/

let cart = [];

/* Saves clicked product to load in session storage */

var products = document.getElementsByClassName("productSlot");

var myFunction = function(e) { // Function allows for products open in new tab to be correctly loaded
  if (e.button == 0 || e.button == 1) { // Checks if left clicked or middle clicked
    var productID = this.getAttribute("prodID")
    localStorage.setItem("clickedProduct", `${productID}`); // Sets clicked product in local storage to maintain across sessions
  }
};

for (var i = 0; i < products.length; i++) {
  products[i].addEventListener("mousedown", myFunction, false);
}

/* Load product info on product-details page */
if (document.URL.includes("product-details.html")) { // Only executes code on product-details page
  prodName = document.querySelector("#product-name"); // Get product name header
  prodPrice = document.querySelector("#product-price"); // Get product price header
  prodImgContainer = document.querySelector(".product-photo"); // Get product image container
  prodDescription = document.querySelector(".prod-desc-body");
  productSpecs = document.querySelector("#productSpecForm");

  let idToCheck = localStorage.getItem("clickedProduct"); // Gets ID of clicked product from local storage

  fetch("products.json") // Uses FetchAPI to get products from json
  .then(response => response.json())
  .then(data =>{   
      try {
        const jsonProduct = data.find(p => p.id === idToCheck); // Gets product of ID matching the one in local storage
        prodName.innerHTML = jsonProduct.name; // Sets html product name to json element's name
        prodPrice.innerHTML = jsonProduct.price; // Sets html price  to json element's price
        prodImgContainer.querySelector("img").setAttribute("src", `${jsonProduct.image}`); // Sets the container's child 'img' src to json element's image value
        prodDescription.innerHTML = jsonProduct.description;
        
        if (jsonProduct.dropdown != undefined) { // If the product has additional options, add the dropdown
          var prodOptions = `
                          <label for="prod-variation-type">Subject Type:</label>
                          <select name="prod-variation-type" id="formSubjectType">
                              <option name="prod-variation-type" id="prodvar_1" value="Option 1">${jsonProduct.dropdown[0]}</option>
                              <option name="prod-variation-type" id="prodvar_2" value="Option 2">${jsonProduct.dropdown[1]}</option>
                          </select>
                        `;
          productSpecs.insertAdjacentHTML("afterbegin", prodOptions); // Inserts the dropdown box html
        };
      } catch(err) {
        window.location.href = "./products.html";
      };
  });
  
  addToCart = document.forms["productSpecForm"]; // Gets add to cart form

  addToCart.addEventListener("submit", getValues);

  function getValues(e) {
    e.preventDefault();

    let data = {}
  }
}

/* Load products in checkout page */

const cartTotal = document.querySelector("#cart-sum-total");

fetch("products.json")
.then(response => response.json())
.then(data =>{
    var itemCosts = [];
    let html = "";
    data.forEach(product =>{
        html += `
            <li class="cart-item-entry">
                <img src="${product.image}">
                <p class="productname">${product.name}</p>
                <input type="number" value="1" min="0" aria-label="Current quantity of item in cart">
                <span class="item-cost">${product.price}</span>
            </div>
        `;
        itemCosts.push(`${product.price}`);
    });
    try {
      document.getElementById("cart-list").innerHTML = html;
    }
    catch(err) {
      console.log(err + " | Page is likely not 'checkout'") // Error to print if no cart on page
    }
    // Calculate the total cost
    const cleanedCost = itemCosts
    .map(cost => parseFloat(cost.replace("£", ""))) // Remove £ and make a number using parsefloat
    .reduce((sum, current) => sum + current, 0); // Add together the costs
    cartTotal.innerHTML = `Total: £${cleanedCost.toFixed(2)}`; // Change cart-total html to display price
});
