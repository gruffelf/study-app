# study-app
Finally a project managment tool for high school students, to keep you focused and on track.

## How to view
Visit page here [mdr-core.torpy.co/study](https://mdr-core.torpy.co/study)

API info here [mdr-core.torpy.co/api/docs](https://mdr-core.torpy.co/api/docs)

## How to run
### Web Server
HTML, CSS, JS, and asset files, running on web server.
Make sure to set API_URL in app.js to whatever the API server is running on.

### API Server
main.py, running with a python virtual environment through FastAPI cli, and requirements.txt downloaded with pip.
```
pip install -r requirements.txt
fastapi run main.py
```
