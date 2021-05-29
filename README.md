# CNPq Classroom Authentication

### Setup:

First, open a terminal window and navigate root directory of this project.

Create `.env` file from the `.env.example` file. Run one of the following commands:

On Unix or MacOS, run:

    cp .env.example .env

On Windows, run:

    copy .env.example .env

### Running:

Run the following commands in the root directory of this project.

Build the Docker containers. Run:

    docker-compose build

Start running the Docker containers in the background. Run:

    docker-compose up -d

Open in a browser:

http://127.0.0.1:5000/
