import React, { Component } from "react"
import { navigate } from "gatsby"

import Layout from "../components/layout"
import TodoList from "../components/todoList"
import SEO from "../components/seo"
import { firebase } from "../firebase/firebase"

export default class IndexPage extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
      } else {
        navigate("/login")
      }
    })
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" keywords={[`Rohit Gupta`, `Home`, `Todo`, `Task`]} />
        <div className="content">
          <TodoList />
        </div>
      </Layout>
    )
  }
}
