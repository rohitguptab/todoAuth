/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { Component } from "react"
import PropTypes from "prop-types"
import Header from "./header"
import Footer from "./footer"
import "../css/style.css"
import "../css/font-awesome.css"

export default class Layout extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="main">
          <div className="container">{this.props.children}</div>
        </div>
        <Footer />
      </>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
