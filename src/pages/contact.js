import React, { Component } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default class Contact extends Component {
  render() {
    return (
      <Layout>
        <SEO title="Contact" keywords={[`Rohit Gupta`, `Contact`]} />
        <div className="content">
          <h1>Contact Me</h1>
          <form
            action="https://formspree.io/rohitguptab33@gmail.com"
            method="POST"
            name="contact"
            className="defult-fotm"
          >
            <div>
              <label>
                Your name
                <input type="text" name="name" required />
              </label>
            </div>
            <div>
              <label>
                Your Email:
                <input type="email" name="email" required />
              </label>
            </div>
            <div>
              <label>
                Message:
                <textarea name="message" required></textarea>
              </label>
            </div>
            <div>
              <button type="submit" className="default-btn" required>
                Send
              </button>
            </div>
          </form>
        </div>
      </Layout>
    )
  }
}
