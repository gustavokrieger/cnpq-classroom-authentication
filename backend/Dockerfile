FROM python:3.9.5

RUN apt-get update && apt-get install -y \
    xmlsec1 \
 && rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /usr/src/app

ARG REQUIREMENTS=requirements.txt
COPY $REQUIREMENTS .
RUN pip install --no-cache-dir -r $REQUIREMENTS
