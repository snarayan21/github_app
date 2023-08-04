# github_app

First make sure that you have setup a github oauth app. Get the client id and the client secret and fill in the corresponding fields at the top of `backend/server.py` and `frontend/App.js`. Make sure the oauth application url is correct -- if running locally, use localhost:3000 as application URL and localhost:3000/success as redirect URL.

to start backend:

```
cd backend
pip install -r requirements.txt
flask --app server run
```

to start frontend

```
cd frontend
npm install
npm start
```

To change the repo being forked, change the `owner` and `repo_name` fields in the `forkRepo()` function in `backend/server.py`.
