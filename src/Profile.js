import React, { Component } from 'react';
import { Person } from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
      },
      newText:"",
      newTitle:"",
      title:"",
      text:"",
  	};
  }

  saveNewArticle(title, text) {
    const { userSession } = this.props

    let article = {
      title: title.trim(),
      text: text.trim(),
      created_at: Date.now()
    }

    const options = { encrypt: true }
    userSession.putFile('article.json', JSON.stringify(article), options)
      .then(() => {
        this.setState({
          newText: article.text,
          newTitle: article.title,
        })
      })
  }

  fetchData() {
    const { userSession } = this.props
    const options = { decrypt: true }
    userSession.getFile('article.json', options)
      .then((file) => {
        var article = JSON.parse(file || '[]')
        console.log(article)
        this.setState({
          title:article.title,
          text:article.text,
        })
      })
      .finally(() => {
        console.log("read over")
      })
  }

  handleNewTitleChange(event) {
    this.setState({newTitle: event.target.value})
  }

  handleNewTextChange(event) {
    this.setState({newText: event.target.value})
  }

  handleNewArticleSubmit(event) {
    this.saveNewArticle(this.state.newTitle, this.state.newText)
    this.setState({
      newTitle: "",
      newText: "",
    })
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
        <h1>Description: <span id="heading-name">{ person.description() ? person.description() : 'Nothing' }</span>!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
        <br/>
        <input
          value={this.state.newTitle}
          onChange={e => this.handleNewTitleChange(e)}
          placeholder="输入标题"
        />
        <br/>
        <textarea className="input-status"
                 value={this.state.newText}
                 onChange={e => this.handleNewTextChange(e)}
                 placeholder="输入文章"
               />
        <br/>
        <button
                 className="btn btn-primary btn-lg"
                 onClick={e => this.handleNewArticleSubmit(e)}
                >
                提交
        </button>
        <p>  题目:{this.state.title}</p>
        <p> {this.state.text} </p>
      </div> : null
    );
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
    });
  }
}
