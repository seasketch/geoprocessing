ARG VARIANT="jammy"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

RUN apt-get update && apt-get -y upgrade \
  && apt-get install -y --no-install-recommends \
    postgresql-client \
    openjdk-17-jdk \
    git \
    wget \
    g++ \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN touch /root/.bashrc
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && mkdir /root/.conda \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh \
    && echo "Running $(conda --version)" && \
    conda init bash && \
    . /root/.bashrc && \
    conda update conda && \
    conda install python=3.8 pip && \
    conda install -c conda-forge gdal=3.3.1

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v16.17.0
RUN mkdir -p /usr/local/nvm && apt-get update && echo "y" | apt-get install curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH
RUN nvm install v16.16.0 \
    npm install -g npm@8.11.0