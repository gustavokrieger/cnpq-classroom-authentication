FROM python:3.9.5

RUN apt-get update && apt-get install -y \
    xmlsec1 \
    # Dependency of "wait-for" script.
    netcat \
 && rm -rf /var/lib/apt/lists/*

ARG WAIT_SCRIPT=/usr/local/bin/wait-for
RUN wget https://raw.githubusercontent.com/eficode/wait-for/v2.1.3/wait-for -O $WAIT_SCRIPT
RUN chmod +x $WAIT_SCRIPT

ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip install --upgrade pip

WORKDIR /usr/src/app

ARG REQUIREMENTS=requirements.txt
COPY $REQUIREMENTS .
RUN pip install --no-cache-dir -r $REQUIREMENTS
