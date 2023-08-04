import flask
from flask import Flask, request
import requests
from flask_cors import CORS, cross_origin
from github import Github
from github import Auth

CLIENT_ID = "<your github oauth app client id>"
CLIENT_SECRET = "<your github oauth app client secret>"

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/getUsername", methods=["GET"])
@cross_origin()
def getUsername():
    # exchange the code for github access token
    args = request.args
    code = args.get("code")
    url = "https://github.com/login/oauth/access_token?" + \
        "client_id=" + CLIENT_ID + \
        "&client_secret=" + CLIENT_SECRET + \
        "&code=" + code
    response = requests.post(url).text
    access_token = "Bearer " + response.split('&')[0].split('=')[1]

    # get github username and store the access token
    username = requests.get("https://api.github.com/user", 
                                  headers={"Authorization": access_token}).json()["login"]
    
    # store the access token in our table
    # which right now is a local csv file
    with(open("username_access_token.csv", "a")) as f:
        f.write(username + "," + access_token + "\n")

    final_response = flask.jsonify({"username": username})

    return final_response

@app.route("/logout", methods=["GET"])
@cross_origin()
def logout():
    # exchange the code for github access token
    args = request.args
    username = args.get("username")

    # remove the user from the table (csv file...lol)
    with open("username_access_token.csv", "r") as f:
        rows = f.readlines()
    with open("username_access_token.csv", "w") as f:
        for row in rows:
            if row.split(',')[0] != username:
                f.write(row)

    return flask.jsonify({"logged_out": True})   


@app.route("/forkRepo", methods=["GET"])
@cross_origin()
def forkRepo():
    # TODO: CHANGE THE REPO OWNER AND NAME TO FORK IT!
    owner = "kenshoo"
    repo_name = "python-style-guide"
    # exchange the code for github access token
    args = request.args
    username = args.get("username")
    new_repo_name = args.get("repo_name").strip().replace(" ", "-")

    # get user's access token. should replace this with an actual database/table probably :)
    # Using readlines()
    tokenfile = open('username_access_token.csv', 'r')
    rows = tokenfile.readlines()
    access_token = ""
    for row in rows:
        rowsplit = row.split(",")
        uname = rowsplit[0].strip()
        if username == uname:
            access_token = rowsplit[1].strip()
            break
    
    if access_token == "":
        return flask.jsonify({"error": "username not found"})
    
    auth = access_token.split(" ")[1]
    g = Github(auth=Auth.Token(auth))
    g_user = g.get_user()
    repo = g.get_repo(f"{owner}/{repo_name}")
    myfork = g_user.create_fork(repo, name=new_repo_name, default_branch_only=True)
    
    final_response = flask.jsonify({"repo_name": new_repo_name, "full_name": myfork.full_name})

    return final_response