const dotenv = require("dotenv")

if (process.env.ENVIRONMENT !== "production") {
  dotenv.config()
}

const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } = process.env

module.exports = {
  siteMetadata: {
    title: `TodoAuth`,
    description: `TodoAuth is Learning site with Firebase. Login and register with Google and Facebook.`,
    author: `@rohitguptab`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey,
          authDomain,
          databaseURL,
          projectId,
          storageBucket,
          messagingSenderId,
          appId,
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `TodoAuth`,
        short_name: `TodoAuth`,
        start_url: `/`,
        background_color: `#fafafa`,
        theme_color: `#333333`,
        display: `minimal-ui`,
        icon: `src/images/todoauth_logo.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
  ],
}
