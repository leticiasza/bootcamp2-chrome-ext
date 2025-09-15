# Gerador de Senhas Aleatórias

Uma extensão simples para Google Chrome que gera **senhas aleatórias seguras** e permite copiá-las para a área de transferência.  

---

## 📝 Funcionalidades

- Gerar senhas aleatórias com letras, números e símbolos.  
- Copiar senha gerada para a área de transferência.  
- Salvar a última senha gerada para exibição no próximo uso do popup.  

---

## 📁 Estrutura do projeto

my-chrome-extension/
├─ src/
│  ├─ popup/
│  │  ├─ popup.html
│  │  ├─ popup.js
│  │  └─ popup.css
│  ├─ background/
│  │  └─ service-worker.js
│  ├─ assets/
│  │  └─ logo.svg
│  └─ styles/
│     └─ global.css
├─ icons/
│  ├─ icon16.png
│  ├─ icon32.png
│  ├─ icon48.png
│  └─ icon128.png
├─ docs/
│  └─ index.html
├─ manifest.json
├─ README.md
└─ LICENSE

---

## ⚙️ Instalação

1. Abra o Google Chrome e vá para:  
chrome://extensions/

2. Ative o **Modo do Desenvolvedor** no canto superior direito.

3. Clique em **“Carregar sem compactação”**.

4. Selecione a pasta raiz da extensão (`my-chrome-extension/`).

5. O ícone da extensão aparecerá na barra de ferramentas do Chrome.

---

## 🚀 Uso

1. Clique no ícone da extensão na barra do Chrome.  
2. Clique em **“Gerar Senha”** para criar uma senha aleatória.  
3. A senha aparecerá no campo de texto.  
4. Clique em **“Copiar”** para copiar a senha para a área de transferência.  
5. A última senha gerada será salva automaticamente e exibida ao abrir o popup novamente.

---

## 🎨 Personalização

- **Alterar tamanho da senha:**  
Edite a função `generatePassword()` em `popup.js`:

```javascript
function generatePassword(length = 12) {
 // ...
}
Alterar caracteres disponíveis:
Modifique a variável charset na mesma função.

📄 Licença
Este projeto está licenciado sob a MIT License. Consulte o arquivo LICENSE para mais detalhes.