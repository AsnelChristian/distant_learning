// import React, { Component } from 'react';
import $ from 'jquery';
import React, { Component } from 'react';
import client from '../services/Client';
// import ReactMixin from 'react-mixin';
// import Auth from '../services/AuthService'

import '../stylesheets/UserView.css';
import '../stylesheets/Loading.css';

class UserView extends Component {
    constructor(props){
        super();
        this.state = {
          users: null,
          fetchingInProgress: false,
        }
      }

      componentDidMount(){
        this.getUsers()
      }

      getUsers = (event) => {
        this.setState({ fetchingInProgress: true });
        $.ajax({
          url: '/users', //TODO: update request URL
          type: "GET",
          dataType: 'json',
          contentType: 'application/json',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(client.LOCAL_STORAGE_KEY)}`,
            },
          data: JSON.stringify({}),
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: (result) => {
            console.log(result)
            this.setState({
              users: result.data,
              fetchingInProgress: false,
            })
            return;
          },
          error: (error) => {
            console.log(error)
            alert(error.responseJSON.message)
            this.setState({
              fetchingInProgress: false,
            })
            return;
          }
        })
      }

    
      handleChange = (id, rank, event) => {
        // console.log('updating')
        // console.log(id)
        // console.log(event.target.value)
        // console.log(rank)
        // console.log(this.state.item_rank)
        // this.setState({item_name: event.target.value, item_id:id , item_rank:this.state.item_rank!==""?this.state.rank:rank})
      }
    
      handleRankChange = (id, name, event) => {
        // console.log('updating')
        // console.log(id)
        // console.log(event.target.value)
        // name = typeof this.state.item_name == "undefined" || this.state.item_name === ""?name: this.state.item_name;
        // console.log(name)
        // console.log(this.state.item_name)
        // this.setState({item_rank: event.target.value, item_id: this.state.item_id!==0?this.state.item_id:id, item_name: name })
      }
    
      submitUpdate = (event) => {
        // event.preventDefault();
        // this.props.updateChild(this.state.item_id, this.state.item_rank, this.state.item_name)
        // this.setState({item_id: 0, item_name: 0, item_rank:0})
        // document.getElementById("edit-video-form").reset();
      }

    render() {
        if (this.state.fetchingInProgress){
            return (
                <div className='loader'></div>
            )
        }
        else {
            return (
                <div className="view-user-holder">
                { this.state.users && <div id="view-user-items" className="view-user-holder__view-user-items">
                <h2></h2>
                <ul >
                    {this.state.users.map((item, ind) => (
                    <li key={item['id']} className="view-user-holder__list-item">
                        <form className="edit-items__form-view edit-user__form-view" id="edit-video-form" onSubmit={this.submitUpdate}>
                        <div> {item['email']}</div>
                        <label>
                            <input type="text" placeholder={item['name']} name="item_name" onChange={this.handleChange.bind(this, item['id'], item['rank'])} />
                        </label>
                        <label >
                            <select name="rank_id" onChange={this.handleRankChange.bind(this, item['id'], item['name'])}>
                                <option value={0}>{item['rank']}</option>
                                {this.items && this.items.map((item, ind) => (
                                <option key={`${item['name']+item['id']}`} value={ind+1}>
                                    {ind+1}
                                </option>
                                ))}
                            </select>
                        </label>
                        <input type="submit" className="button" value="update" />
                        </form>
                        <img src="./delete.png" alt="delete" className="view-user-holder__delete" onClick={() => this.props.deleteAction(item.id)}/>
                    </li>
                    ))}
                </ul>
                </div>}
                { !this.state.users && <div id="view-user-items" className="view-user-holder__view-user-items">
                    <h2>No users added</h2>
                </div>}
            </div>
            );
        }
    }
}

export default UserView