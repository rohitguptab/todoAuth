import React, { Component, Fragment } from "react"
import { firebase } from "../firebase/firebase"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import UploadImage from "./uploadImage"

export default class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: true,
      listData: [],
      userId: "",
      presentToDo: "",
      presentToDoSub: "",
      filter: "all",
      mainTitle: "",
      data: [],
      noData: false,
      isLogin: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          userId: user.uid,
          isLogin: true,
          loader: false,
          data: {
            id: user.uid,
            name: user.displayName,
            avatar: user.photoURL,
          },
        })
        this.fetchData(user.uid)
      } else {
        this.setState({
          loader: true,
          isLogin: false,
        })
      }
    })
  }

  fetchData = active => {
    const { userId } = this.state
    firebase
      .database()
      .ref(`todos/${userId}`)
      .once("value")
      .then(snapshot => {
        let dataGet = []
        snapshot.forEach(childSnapshot => {
          childSnapshot.val().map((item, index) => {
            dataGet.push(item)
            return null
          })
          return null
        })
        if (dataGet.length > 0) {
          this.setState({
            listData: dataGet,
            loader: false,
          })
        } else {
          this.setState({
            listData: [],
            loader: false,
            noData: true,
          })
        }
      })
  }

  addNewTodoChild = (event, index) => {
    event.preventDefault()
    const { presentToDo, listData } = this.state

    if (presentToDo) {
      let copyData = [...listData]
      let copy = listData[index].tasks ? listData[index].tasks : []
      let finaleData = [{ title: presentToDo, complete: false }, ...copy]
      copyData[index].tasks = finaleData
      this.setState({
        listData: copyData,
        presentToDo: "",
      })
      this.handleUpdate(copyData)
    }
  }

  addNewTodoSubTask = (event, parentIndex, index) => {
    event.preventDefault()

    const { presentToDoSub, listData } = this.state

    if (presentToDoSub) {
      let copyData = [...listData]
      let copy = copyData[parentIndex].tasks[index].subtask ? copyData[parentIndex].tasks[index].subtask : []
      copy.push({ title: presentToDoSub, complete: false })
      copyData[parentIndex].tasks[index].subtask = copy
      this.setState({
        listData: copyData,
        presentToDoSub: "",
      })
      this.handleUpdate(copyData)
    }
  }

  handleUpdate = data => {
    const { userId, listData } = this.state
    firebase
      .database()
      .ref(`todos/${userId}/data`)
      .set(data ? data : listData)
      .then(() => {
        console.log("Data is saved!")
      })
      .catch(e => {
        console.log("This failed.", e)
      })
  }

  addNewTodoParent = event => {
    event.preventDefault()
    const { mainTitle, listData, isLogin } = this.state

    if (isLogin && mainTitle) {
      let copyData = [...[{ title: mainTitle, tasks: [] },], ...listData,]
      this.setState({
        listData: copyData,
        mainTitle: "",
      })
      this.handleUpdate(copyData)
    }
  }

  handleClearAll = index => {
    const { listData } = this.state
    let copyData = []
    listData[index].tasks.map((item, i) => {
      if (!item.complete) {
        copyData.push(item)
      }
      return null
    })
    listData[index].tasks = copyData
    this.setState({
      listData: listData,
    })
    this.handleUpdate(listData)
  }

  render() {
    const { loader, listData, presentToDo, filter, mainTitle, noData } = this.state

    if (loader) {
      return (
        <div className="loading-page">
          <span className="loading-icon"></span>Loading
        </div>
      )
    }

    return (
      <div className="todo-main">
        {listData.length > 0 ? (
          <Fragment>
            <Tabs className="dashboard">
              <div className="left">
                <UploadImage />
                <div className="addnew-parent">
                  <form className="added-list" onSubmit={this.addNewTodoParent}>
                    <input
                      className="title"
                      type="text"
                      value={mainTitle}
                      placeholder="Add Toda Title"
                      onChange={e => {
                        this.setState({
                          mainTitle: e.target.value,
                        })
                      }}
                    />
                    <button
                      className="default-btn"
                      onClick={this.addNewTodoParent}
                    >
                      Add New List
                    </button>
                  </form>
                </div>
                <div className="navigation">
                  <TabList className="todos-list">
                    {listData.map((item, index) => {
                      return (
                        <Tab key={index}>
                          {item.title}
                          <i
                            className="fas fa-times remove"
                            onClick={() => {
                              let toDel = window.confirm("Are you sure you want to delete?")
                              if (true === toDel) {
                                let copyData = []
                                listData.map((item, i) => {
                                  if (index !== i) {
                                    copyData.push(item)
                                  }
                                  return null
                                })
                                this.setState({
                                  listData: copyData,
                                })
                                this.handleUpdate(copyData)
                              }
                            }}
                          />
                        </Tab>
                      )
                    })}
                  </TabList>
                </div>
              </div>
              <div className="right">
                {listData.map((data, i) => {
                  return (
                    <TabPanel key={i}>
                      <h2>{data.title}</h2>
                      <div className="add-new-itme">
                        <form
                          className="add-todo"
                          onSubmit={event => {
                            this.addNewTodoChild(event, i)
                          }}
                        >
                          <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={presentToDo}
                            onChange={e => {
                              this.setState({
                                presentToDo: e.target.value,
                              })
                            }}
                          />
                        </form>
                      </div>
                      <ul className={`todo-list ${filter}`}>
                        {loader ? (
                          <li>Loading...</li>
                        ) : (
                          <Fragment>
                            {data.tasks ? (
                              <Fragment>
                                {data.tasks.length > 0 ? (
                                  <Fragment>
                                    {data.tasks.map((item, index) => {
                                      return (
                                        <li
                                          key={index}
                                          id={item.id}
                                          className={`list-item ${ item.complete ? "complete" : "" }`}
                                        >
                                          <input
                                            className="toggle"
                                            type="checkbox"
                                            value={item.complete}
                                            onClick={e => {
                                              let copyArray = [...listData]
                                              copyArray[i].tasks[index].complete = !item.complete
                                              this.setState({
                                                listData: copyArray,
                                              })
                                              this.handleUpdate(copyArray)
                                            }}
                                          />
                                          {item.edit ? (
                                            <input
                                              className="title"
                                              type="text"
                                              value={item.title}
                                              onDoubleClick={() => {
                                                let copyArray = [...listData]
                                                copyArray[i].tasks[index].edit = !item.edit
                                                this.setState({
                                                  listData: copyArray,
                                                })
                                                this.handleUpdate(copyArray)
                                              }}
                                              onChange={e => {
                                                let copyArray = [...listData]
                                                copyArray[i].tasks[index].title = e.target.value
                                                this.setState({
                                                  listData: copyArray,
                                                })
                                                this.handleUpdate()
                                              }}
                                            />
                                          ) : (
                                            <span
                                              onDoubleClick={() => {
                                                let copyArray = [...listData]
                                                copyArray[i].tasks[index].edit = !item.edit
                                                this.setState({
                                                  listData: copyArray,
                                                })
                                                this.handleUpdate(copyArray)
                                              }}
                                            >
                                              {item.title}
                                            </span>
                                          )}
                                          <div className="settings">
                                            <i
                                              className="fas fa-times remove"
                                              onClick={e => {
                                                let toDel = window.confirm("Are you sure you want to delete?")
                                                if (true === toDel) {
                                                  let copyData = []
                                                  listData[i].tasks.map(
                                                    (item, i) => {
                                                      if (index !== i) {
                                                        copyData.push(item)
                                                      }
                                                      return null
                                                    }
                                                  )
                                                  listData[i].tasks = copyData
                                                  this.setState({
                                                    listData: listData,
                                                  })
                                                  this.handleUpdate(listData)
                                                }
                                              }}
                                            />
                                            <i
                                              className={`fas fa-${item.edit ? "check" : "pencil-alt"} edit`}
                                              onClick={e => {
                                                let copyArray = [...listData]
                                                copyArray[i].tasks[index].edit = !item.edit
                                                this.setState({
                                                  listData: copyArray,
                                                })
                                                this.handleUpdate(copyArray)
                                              }}
                                            />
                                          </div>
                                          <input type="checkbox" className="arrow" />
                                          <div className="details">
                                            <div className="add-new-itme">
                                              <form
                                                className="add-todo"
                                                onSubmit={event => {
                                                  this.addNewTodoSubTask(event, i, index)
                                                }}
                                              >
                                                <input
                                                  type="text"
                                                  placeholder="Sub Task : What needs to be done?"
                                                  value={this.state.presentToDoSub}
                                                  onChange={e => {
                                                    this.setState({
                                                      presentToDoSub: e.target.value,
                                                    })
                                                  }}
                                                />
                                              </form>
                                            </div>
                                            <ul className="todo-list sub-task">
                                              {item.subtask ? (
                                                <Fragment>
                                                  {item.subtask.map(
                                                    (sub, subIndex) => {
                                                      return (
                                                        <li key={subIndex} className={`list-item ${ sub.complete ? "complete" : "" }`} >
                                                          <input
                                                            className="toggle"
                                                            type="checkbox"
                                                            value={sub.complete}
                                                            onClick={e => {
                                                              let copyArray = [...listData,]
                                                              copyArray[i].tasks[index].subtask[subIndex].complete = !sub.complete
                                                              this.setState({
                                                                listData: copyArray,
                                                              })
                                                              this.handleUpdate(copyArray)
                                                            }}
                                                          />
                                                          {sub.edit ? (
                                                            <input
                                                              className="title"
                                                              type="text"
                                                              value={sub.title}
                                                              onDoubleClick={() => {
                                                                let copyArray = [...listData]
                                                                copyArray[i].tasks[index].subtask[subIndex].edit = !sub.edit
                                                                this.setState({
                                                                  listData: copyArray,
                                                                })
                                                                this.handleUpdate(copyArray)
                                                              }}
                                                              onChange={e => {
                                                                let copyArray = [...listData]
                                                                copyArray[i].tasks[index].subtask[subIndex].title = e.target.value
                                                                this.setState({
                                                                  listData: copyArray,
                                                                })
                                                                this.handleUpdate(copyArray)
                                                              }}
                                                            />
                                                          ) : (
                                                            <span
                                                              onDoubleClick={() => {
                                                                let copyArray = [...listData]
                                                                copyArray[i].tasks[index].subtask[subIndex].edit = !sub.edit
                                                                this.setState({
                                                                  listData: copyArray,
                                                                })
                                                                this.handleUpdate(copyArray)
                                                              }}
                                                            >
                                                              {sub.title}
                                                            </span>
                                                          )}
                                                          <div className="settings">
                                                            <i
                                                              className="fas fa-times remove"
                                                              onClick={e => {
                                                                let toDel = window.confirm("Are you sure you want to delete?")
                                                                if (true === toDel) {
                                                                  let copyData = []
                                                                  listData[i].tasks[index].subtask.map((copy, copyIndex) => {
                                                                      if (copyIndex !==subIndex) {
                                                                        copyData.push(copy)
                                                                      }
                                                                      return null
                                                                    }
                                                                  )
                                                                  listData[i].tasks[index].subtask = copyData
                                                                  this.setState({
                                                                    listData: listData
                                                                  })
                                                                  this.handleUpdate(listData)
                                                                }
                                                              }}
                                                            />
                                                            <i className={`fas fa-${ sub.edit ? "check" : "pencil-alt" } edit`}
                                                              onClick={e => {
                                                                let copyArray = [ ...listData ]
                                                                copyArray[i].tasks[ index].subtask[subIndex].edit = !sub.edit
                                                                this.setState({
                                                                  listData: copyArray,
                                                                })
                                                                this.handleUpdate(copyArray)
                                                              }}
                                                            />
                                                          </div>
                                                        </li>
                                                      )
                                                    }
                                                  )}
                                                </Fragment>
                                              ) : null}
                                            </ul>
                                          </div>
                                        </li>
                                      )
                                    })}
                                  </Fragment>
                                ) : (
                                  <li>No Task Found</li>
                                )}
                              </Fragment>
                            ) : (
                              <li>No Task Found</li>
                            )}
                          </Fragment>
                        )}
                      </ul>
                      <div className="todo-details">
                        <span className="todo-count">
                          {data.tasks ? data.tasks.length : "0"} Items
                        </span>
                        <ul>
                          <li
                            className={filter === "all" && "active"}
                            onClick={e => {
                              this.setState({
                                filter: "all",
                              })
                            }}
                          >
                            All
                          </li>
                          <li
                            className={filter === "Active" && "active"}
                            onClick={e => {
                              this.setState({
                                filter: "Active",
                              })
                            }}
                          >
                            Active
                          </li>
                          <li
                            className={filter === "Completed" && "active"}
                            onClick={e => {
                              this.setState({
                                filter: "Completed",
                              })
                            }}
                          >
                            Completed
                          </li>
                        </ul>
                        <span
                          className="clear"
                          onClick={() => {
                            this.handleClearAll(i)
                          }}
                        >
                          Clear Completed
                        </span>
                      </div>
                    </TabPanel>
                  )
                })}
              </div>
            </Tabs>
          </Fragment>
        ) : (
          <div className="dashboard">
            <div className="left">
              <UploadImage />
              <div className="addnew-parent">
                <form className="added-list" onSubmit={this.addNewTodoParent}>
                  <input
                    className="title"
                    type="text"
                    value={mainTitle}
                    placeholder="Add Toda Title"
                    onChange={e => {
                      this.setState({
                        mainTitle: e.target.value,
                      })
                    }}
                  />
                  <button
                    className="default-btn"
                    onClick={this.addNewTodoParent}
                  >
                    Add New List
                  </button>
                </form>
              </div>
            </div>
            <div className="right">
              <div className="no-data">
                {noData ? (
                  <h2>No Todos List Found</h2>
                ) : (
                  <h2 className="loading-small">Tasks Loading...</h2>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
