# Use Node.js LTS
FROM node:20-bullseye

# Install dependencies for Playwright
RUN apt-get update && \
    apt-get install -y wget curl git libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxss1 libx11-xcb1 libxcomposite1 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 libpango1.0-0 libgtk-3-0 libxshmfence1 libglu1-mesa xvfb && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install browsers
RUN npx playwright install --with-deps


# Install dependencies
RUN npm ci

# Copy project
COPY . .

# Build TypeScript
RUN npm run build

# Run tests by default
CMD ["npx", "playwright", "test", "--reporter=html"]
