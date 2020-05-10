import { Link } from "gatsby"
import React, { Component } from "react"
import { firebase } from "../firebase/firebase"
import UploadImage from "../components/uploadImage"
import Image from "../components/image"

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,
    }
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isLogin: true,
        })
      } else {
        this.setState({
          isLogin: false,
        })
      }
    })
  }

  render() {
    const { isLogin } = this.state
    return (
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <Link to="/">
                <Image />
              </Link>
            </div>
            <div className="right-side">
              <div className="menu">
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  {!isLogin && (
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                  )}
                </ul>
              </div>
              {isLogin ? (
                <div className="user-details">
                  <div className="avatar">
                    <UploadImage />
                  </div>
                  <div className="hover-item">
                    <ul>
                      <li>
                        <Link to="/dashboard">Dashboard</Link>
                      </li>
                      <li
                        onClick={() => {
                          firebase.auth().signOut()
                          this.forceUpdate()
                        }}
                      >
                        <Link>Logout</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>
    )
  }
}
