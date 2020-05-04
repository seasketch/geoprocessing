FROM osgeo/gdal:ubuntu-full-latest
LABEL maintainer="Chad Burt <chad@underbluewaters.net>"
ENV TZ=America/Los_Angeles
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update
RUN apt -y install nano wget curl ca-certificates git gnupg
RUN curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo deb "http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN apt-get update
RUN apt -y install postgresql-client-12
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN mkdir /data
RUN echo 'alias bundle-features="/project/node_modules/.bin/geoprocessing bundle-features"' >> ~/.bashrc
CMD bash