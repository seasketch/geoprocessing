ARG VARIANT="jammy"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

RUN apt-get update && apt-get -y upgrade \
  && apt-get install -y --no-install-recommends \
    postgresql-client \
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
