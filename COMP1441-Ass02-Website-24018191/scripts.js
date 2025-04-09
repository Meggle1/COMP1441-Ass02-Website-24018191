/*
    THEME TOGGLE FEATURE
*/

// Calculates the current setting by comparing them to 
function calcSettingAsThemeString({ localStorageTheme}) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    }
}
  
// Update button image and aria-label.
function updateButton({ themeButton, isDark }) {
    const newCta = isDark ? "Dark" : "Light";
    // Updates aria label based on theme
    themeButton.setAttribute("aria-label", newCta);
    // Changes button image based on theme
    if (newCta == "Dark") {
        themeImg.src = "svg/dark-theme.svg"
    } else if (newCta == "Light") {
        themeImg.src = "svg/light-theme.svg"
    }
}
  
// Utility function to update the theme setting on the html tag
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
updateButton({ themeButton: themeButton, isDark: currentThemeSetting === "dark" });
updateHTMLElementTheme({ theme: currentThemeSetting });
  

// Event listener on button to toggle the theme 
themeButton.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark"; // Short-hand if else - If (currentThemeSetting) = dark, then newTheme = light etc.
    localStorage.setItem("theme", newTheme);
    updateButton({ themeButton: themeButton, isDark: newTheme === "dark" });
    updateHTMLElementTheme({ theme: newTheme });
  
    currentThemeSetting = newTheme; // Sets theme setting to the theme thats been switched to
}); 

/*
    NEXT FEATURE
*/