import React, { Component } from "react"
import { firebase } from "../firebase/firebase"

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      number: "",
      error: null,
      sucessMessage: null,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { error, sucessMessage } = this.state
    if (error !== prevState.error) {
      setTimeout(() => {
        this.setState({ sucessMessage: null, error: null })
      }, 8000)
    }
    if (sucessMessage !== prevState.sucessMessage) {
      setTimeout(() => {
        this.setState({ sucessMessage: null, error: null })
      }, 8000)
    }
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { name, email, password, number, confirmPassword } = this.state

    if(password === confirmPassword){
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            user.updateProfile({
              displayName: name,
              phoneNumber: number,
            })
            this.setState({
              sucessMessage: "Register Successfully",
              error: null,
            })
          }
        })
      })
      .catch(error => {
        this.setState({ error: error, sucessMessage: null })
      })
    } else{
      this.setState({
        sucessMessage: null,
        error: "Password is not same"
      })
    }
    
  }

  render() {
    const { name, email, password, number, error, sucessMessage, confirmPassword } = this.state
    return (
      <div className="form-card">
        <div className="message">
          {sucessMessage ? <p className="success">{sucessMessage}</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </div>
        <form className="register" onSubmit={this.handleSubmit}>
          <div className="md-form">
            <input
              type="text"
              name="name"
              placeholder="First Name"
              value={name}
              required
              onChange={this.handleInputChange}
            />
          </div>
          <div className="md-form">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
              required
              onChange={this.handleInputChange}
            />
          </div>
          <div className="md-form">
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              value={password}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="md-form">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="md-form">
            <input
              type="number"
              placeholder="Phone Number"
              name="number"
              value={number}
              onChange={this.handleInputChange}
            />
          </div>
          <button className="btn" type="submit">
            Sign up
          </button>
          <p>or sign up with:</p>
          <ul className="social-main">
            <li>
              <span
                className="fab fa-google google"
                onClick={() => {
                  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
                }}
              ></span>
            </li>
          </ul>
        </form>
      </div>
    )
  }
}
