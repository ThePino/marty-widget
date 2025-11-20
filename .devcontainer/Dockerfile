FROM mcr.microsoft.com/devcontainers/typescript-node:20

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libgtk-3-0 \
    libgl1 \
    # AGGIUNTA: Driver per il rendering software (fondamentali se manca la GPU)
    libgl1-mesa-dri \
    x11-apps 

RUN apt-get clean && rm -rf /var/lib/apt/lists/*