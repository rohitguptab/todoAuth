import React, { Component } from "react"
import { firebase } from "../firebase/firebase"
import ImageUploader from "react-images-upload"

export default class UploadImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pictures: [],
      imageUrl: "",
      userId: "",
      profileName: "",
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          imageUrl: user.photoURL,
          profileName: user.displayName,
          userId: user.uid,
        })
      }
    })
  }

  onDrop = picture => {
    this.setState({
      imageLoading: !this.state.imageLoading,
    })
    picture.map((item, index) => {
      firebase
        .storage()
        .ref()
        .child(`${this.state.userId}/${this.state.profileName}`)
        .put(item)
        .then(snapshot => {
          console.log("Uploaded a file!")
          this.updateOnAuth()
        })
        .catch(error => {
          console.log("upload media errors:", error)
        })
      return null
    })
  }

  updateOnAuth = () => {
    firebase
      .storage()
      .ref()
      .child(`${this.state.userId}/${this.state.profileName}`)
      .getDownloadURL()
      .then(url => {
        firebase
          .auth()
          .currentUser.updateProfile({
            photoURL: url,
          })
          .then(() => {
            this.setState({
              imageUrl: url,
              imageLoading: !this.state.imageLoading,
            })
            this.forceUpdate()
          })
          .catch(error => {
            console.log(error)
            this.setState({
              imageLoading: !this.state.imageLoading,
            })
          })
      })
      .catch(function (error) {
        console.log("Handle any errors:", error)
      })
  }

  render() {
    const { imageUrl, profileName, imageLoading } = this.state
    return (
      <div className="avatar-img">
        <div className={`avatar-inner ${imageLoading ? "loading" : ""}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={profileName} />
          ) : (
            <span className="avatar">
              {this.state.profileName ? this.state.profileName.charAt(0) : ""}
            </span>
          )}
          <ImageUploader
            withIcon={false}
            buttonText="Change images"
            onChange={this.onDrop}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
          />
        </div>
      </div>
    )
  }
}
