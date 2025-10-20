console.log("Service Worker rodando...");

chrome.runtime.onInstalled.addListener(() => {
  console.log("Gerador de Senhas instalada com sucesso!");
});
