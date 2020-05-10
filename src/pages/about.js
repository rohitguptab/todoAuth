import React, { Component } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default class About extends Component {
  render() {
    return (
      <Layout>
        <SEO title="About" keywords={[`Rohit Gupta`, `About`]} />
        <div className="content about">
          <h1>About Us</h1>
          <p>TodoAuth is Learning site with Firebase. Login and register with Google.</p>
          <h3>Author</h3>
          <div class="author-main">
            <div class="author-left">
              <img
                src="https://images.ctfassets.net/hwhhx381e090/5IlJCTvfaBL5TZ1U56ykpb/098bdd3b3f918aa29708f28fec7fdde9/rohitgupta.jpg?w=200&h=200&q=50&fit=fill"
                alt="Rohit Gupta"
              />
            </div>
            <div class="author-right">
              <h3 class="mb-0">Rohit Gupta</h3>
              <p class="mb-0">
                <a
                  href="https://rohitgupta.design/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </p>
              <p class="mb-0">
                <a href="mailto:rohitguptab33@gmail.com">Gmail</a>
              </p>
              <p class="mb-0">
                <a
                  href="https://github.com/rohitguptab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </p>
              <p class="mb-0">
                <a
                  href="https://twitter.com/_rohitguptab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </p>
            </div>
          </div>
          <h3>Features</h3>
          <ul>
            <li>Todo List.</li>
            <li>Using Firebase ( Database, Auth, Storage ).</li>
            <li>Login with Google and Facebook.</li>
            <li>Task List with sub task.</li>
            <li>Dashboard manager like change Profile picture, User details, Password and Delete Account.</li>
            <li>Contact form with Email notification using formspree.io.</li>
            <li>PWA</li>
          </ul>
          <h3>Setup</h3>
          <h3>Create a Gatsby site.</h3>
          <p>Use the Gatsby CLI to Clone this site.</p>
          <code>
            # Clone this Repositories<br></br>
            gatsby new todoAuth https://github.com/rohitguptab/todoAuth.git
          </code>
          <h3>Setup Firebase.</h3>
          <a href="https://console.firebase.google.com/" rel="nofollow">Firebase console</a>
          <h3>Setup your Own Configure Projects.</h3>
          <p>Create .env file in root directory Configure below keys</p>
          <ul>
            <li>apiKey = Key</li>
            <li>authDomain = Key</li>
            <li>databaseURL = Key</li>
            <li>projectId = Key</li>
            <li>storageBucket = Key</li>
            <li>messagingSenderId = Key</li>
            <li>appId = Key</li>
          </ul>
          <h3>Start developing.</h3>
          <code>
            cd todoAuth<br></br>
            npm install<br></br>
            gatsby develop
          </code>
        </div>
      </Layout>
    )
  }
}
