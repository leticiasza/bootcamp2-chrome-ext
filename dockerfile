# Base Playwright com Chromium incluído
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm ci --silent

# Instala Chromium explicitamente (garantia)
RUN npx playwright install --with-deps chromium

# Copia todos os arquivos do projeto
COPY . .

# Build da extensão para dist/
RUN npm run build

# Comando padrão
CMD ["npm", "test"]