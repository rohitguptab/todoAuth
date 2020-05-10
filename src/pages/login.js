import React, { Component } from "react"
import Layout from "../components/layout"
import { navigate } from "gatsby"
import SEO from "../components/seo"
import Login from "../components/login"
import Register from "../components/register"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { firebase } from "../firebase/firebase"

export default class LoginPage extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        navigate("/")
      }
    })
  }

  render() {
    return (
      <Layout>
        <SEO title="Login" keywords={[`Rohit Gupta`, `Login`, `Register`]} />
        <div className="content">
          <div className="form-box">
            <Tabs>
              <TabList>
                <Tab>Login</Tab>
                <Tab>Register</Tab>
              </TabList>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </Layout>
    )
  }
}
