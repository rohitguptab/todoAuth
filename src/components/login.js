import React, { Component } from "react"
import { navigate } from "gatsby"
import { firebase } from "../firebase/firebase"

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
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
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.setState({ sucessMessage: "Sucessful Login" })
        navigate("/")
      })
      .catch(error => {
        this.setState({ error: error })
      })
  }

  forgotPassword = event => {
    event.preventDefault()
    const { email } = this.state
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ sucessMessage: "Email sent." })
      })
      .catch(error => {
        this.setState({ error: error })
      })
  }

  render() {
    const { email, password, error, sucessMessage } = this.state

    return (
      <div className="form-card">
        <div className="message">
          {sucessMessage ? <p className="success">{sucessMessage}</p> : null}
          {error ? <p className="error">{error.message}</p> : null}
        </div>
        <form className="login" onSubmit={this.handleSubmit}>
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
          <div className="check-main">
            <div className="forgot">
              <span onClick={this.forgotPassword}>Forgot password?</span>
            </div>
          </div>
          <button className="btn" type="submit">Login</button>
          <p>or sign in with:</p>
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
