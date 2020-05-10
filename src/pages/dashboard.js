import React, { Component } from "react"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import UploadImage from "../components/uploadImage"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { firebase } from "../firebase/firebase"

export default class Dashboard extends Component {
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
      popup: false,
      loader: true,
      userID: "",
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          name: user.displayName,
          email: user.email,
          number: user.phoneNumber,
          userID: user.uid,
          loader: false,
        })
      }
    })
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

  handleDeleteUser = () => {
    const { userId } = this.state
    let user = firebase.auth().currentUser
    user
      .delete()
      .then(() => {
        console.log("Successfully Deleted Account")
        this.setState({
          popup: false,
        })
        firebase.database().ref(`todos/${userId}`).set(null)
      })
      .catch(function (error) {
        console.log(error)
        let toDel = window.confirm("Please Login again to perform this action")
        if (true === toDel) {
          firebase.auth().signOut()
        }
      })
    navigate("/login")
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handlePasswordSubmit = event => {
    event.preventDefault()
    const { password, confirmPassword } = this.state

    let user = firebase.auth().currentUser

    if (password === confirmPassword) {
      user
        .updatePassword(password)
        .then(() => {
          this.setState({
            sucessMessage: "Password Update successful",
          })
        })
        .catch(error => {
          console.log(error)
          this.setState({
            error: "Password Update unsuccessful",
          })
          let toDel = window.confirm("Please Login again to perform this action")
          if (true === toDel) {
            firebase.auth().signOut()
            navigate("/login")
          }
        })
    } else {
      alert("Passwords do not match.")
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const { name, email, number } = this.state

    let user = firebase.auth().currentUser

    user.updateEmail(email).then(() => {})
    .catch(function (error) {
      console.log(error)
    })

    user.updateProfile({ displayName: name, phoneNumber: number })
    .then(() => {
      this.setState({
        sucessMessage: "Update",
      })
    })
    .catch(error => {
      console.log(error)
      this.setState({
        error: error,
      })
    })
  }

  render() {
    const { name, email, password, number, error, sucessMessage, confirmPassword, popup, loader } = this.state

    return (
      <Layout>
        <SEO title="Dashboard" keywords={[`Rohit Gupta`, `Dashboard`]} />
        <div className="content">
          {loader ? (
            <div className="loading-page">
              <span className="loading-icon"></span>Loading
            </div>
          ) : (
            <Tabs>
              <div className="dashboard">
                <div className="left">
                  <UploadImage />
                  <div className="navigation">
                    <TabList>
                      <Tab>Dashboard</Tab>
                      <Tab>Change Password</Tab>
                      <Tab>Delete Account</Tab>
                    </TabList>
                  </div>
                </div>
                <div className="right">
                  <div className="message">
                    {sucessMessage ? (
                      <p className="success">{sucessMessage}</p>
                    ) : null}
                    {error ? <p className="error">{error}</p> : null}
                  </div>
                  <TabPanel>
                    <h2>Dashboard</h2>
                    <form className="register" onSubmit={this.handleSubmit}>
                      <div className="form-grid">
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          required
                          value={name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                      <div className="form-grid">
                        <input
                          type="email"
                          name="email"
                          value={email}
                          placeholder="E-mail"
                          onChange={this.handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-grid">
                        <input
                          type="number"
                          value={number}
                          placeholder="Phone Number"
                          onChange={this.handleInputChange}
                          name="number"
                        />
                      </div>
                      <div className="form-btn">
                        <button className="default-btn" type="submit">
                          Update
                        </button>
                      </div>
                    </form>
                  </TabPanel>
                  <TabPanel>
                    <h2>Change Password</h2>
                    <form className="register">
                      <div className="form-grid">
                        <input
                          type="password"
                          value={password}
                          placeholder="Password"
                          onChange={this.handleInputChange}
                          name="password"
                          required
                        />
                      </div>
                      <div className="form-grid">
                        <input
                          type="password"
                          value={confirmPassword}
                          placeholder="Confirm Password"
                          onChange={this.handleInputChange}
                          name="confirmPassword"
                          required
                        />
                      </div>
                      <div className="form-btn">
                        <button
                          className="default-btn"
                          type="submit"
                          onClick={this.handlePasswordSubmit}
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </TabPanel>
                  <TabPanel>
                    <h2>Delete Account</h2>
                    <button
                      onClick={() => {
                        this.setState({
                          popup: true,
                        })
                      }}
                      className="default-btn"
                    >
                      Delete
                    </button>
                    {popup ? (
                      <div className="alert-popup">
                        <span
                          className="layer"
                          onClick={() => {
                            this.setState({
                              popup: false,
                            })
                          }}
                        />
                        <div className="body">
                          <i
                            className="far fa-times-circle remove"
                            onClick={() => {
                              this.setState({
                                popup: false,
                              })
                            }}
                          />
                          <strong>
                            Are you sure you want to Delete this Account?
                          </strong>
                          <button
                            onClick={this.handleDeleteUser}
                            className="default-btn"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </TabPanel>
                </div>
              </div>
            </Tabs>
          )}
        </div>
      </Layout>
    )
  }
}
