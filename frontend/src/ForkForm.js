import React, { useState } from "react";

export class ForkForm extends React.Component {

    constructor(props) {
        localStorage.removeItem('repo_link');
        super(props);
        this.state = {value: '', repo_forked: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.value)
        async function forkSampleRepo(username, repo_name){
            await fetch("http://localhost:5000/forkRepo?username="+ username + "&repo_name=" + repo_name, {
            method: "GET"
            }).then((res) => {
            return res.json();
            }).then((data) => {
                console.log(data)
                if(data.repo_name){
                    localStorage.setItem("repo_link", "https://github.com/"+username+"/"+repo_name);
                }
            })
        }
        forkSampleRepo(localStorage.getItem("username"), this.state.value).then(
            () => {this.setState({repo_forked: true})}
        );
    }
  
    render() {
      return (
        <>
        {this.state.repo_forked ?
          <>
          <h1>Forked Repo Created <a href={"https://github.com/"+localStorage.getItem("username")+"/"+this.state.value} target="_blank">here!</a></h1>
          </>
          :
            <>
            <form onSubmit={this.handleSubmit}>
            <label>
                New Fork Name: 
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
            </>
        }
        </>
      );
    }
  }