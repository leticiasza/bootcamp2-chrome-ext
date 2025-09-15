const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const passwordInput = document.getElementById("password");

function generatePassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

generateBtn.addEventListener("click", () => {
  const password = generatePassword();
  passwordInput.value = password;
  chrome.storage.local.set({ lastPassword: password });
});

copyBtn.addEventListener("click", () => {
  passwordInput.select();
  document.execCommand("copy");
  alert("Senha copiada para a área de transferência!");
});

// Carrega última senha gerada
chrome.storage.local.get("lastPassword", (data) => {
  if (data.lastPassword) {
    passwordInput.value = data.lastPassword;
  }
});
