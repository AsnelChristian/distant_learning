import React, { Component } from 'react';

import FormViewController from "./FormViewController"

import $ from 'jquery';

import '../stylesheets/FormView.css';
import '../stylesheets/App.css';

class FormView extends Component {
  constructor(props){
    super();
    this.state = {
      selection: "SYSTEMS",
      parent: null,
      selectionParent: null,
    }
  }

  getSystems = () => {
    $.ajax({
      url: `/systems`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ parent: result.data, selectionParent:result.data?result.data[0]:null })
        return;
      },
      error: (error) => {
        alert('Unable to load systems. Please try your request again')
        return;
      }
    })
  }

  getEducations = () => {
    $.ajax({
      url: `/educations`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ parent: result.data, selectionParent: result.data?result.data[0]:null })
        return;
      },
      error: (error) => {
        alert('Unable to load educations. Please try your request again')
        return;
      }
    })
  }

  getCategories = () => {
    $.ajax({
      url: `/categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ parent: result.data, selectionParent:result.data?result.data[0]:null })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }

  getSubCategories = () => {
    $.ajax({
      url: `/sub_categories`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ parent: result.data, selectionParent:result.data?result.data[0]:null })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }

  getClass = () => {
    $.ajax({
      url: `/class`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ parent: result.data, selectionParent:result.data?result.data[0]:null })
        return;
      },
      error: (error) => {
        alert('Unable to load classes. Please try your request again')
        return;
      }
    })
  }

  getSubjects = () => {
    $.ajax({
      url: `/subject`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({ parent: result.data, selectionParent:result.data?result.data[0]:null })
        return;
      },
      error: (error) => {
        alert('Unable to load subjects. Please try your request again')
        return;
      }
    })
  }

  setActive = () => {
    document.getElementsByClassName('active')[0].classList.remove('active')
    document.getElementsByClassName(this.state.selection)[0].classList.add('active')
  }

  setSelection = (some_selection) => {
    if(some_selection==='SYSTEMS'){
      this.setState({
        selection: some_selection,
        parent: null
      })
      return;
    }
    this.setState({
      selection: some_selection
    })
    if(some_selection==="EDUCATION"){
      this.getSystems()
      return;
    }
    if(some_selection==="CATEGORY"){
      this.getClass()
      return;
    }
    if(some_selection==="SUB-CATEGORY"){
      this.getCategories()
      return;
    }
    if(some_selection==="CLASS"){
      this.getEducations()
      return;
    }
    if(some_selection==="SUBJECT"){
      this.getClass()
      return;
    }
    if(some_selection==="VIDEO"){
      this.getClass()
      return;
    }
    return;
  }

  setSelectionParent = (item) => {
    this.setState({
      selectionParent: item
   })
   return;
  }

  render() {
    console.log(this.state.selection);
    return (
      <div className="form-view">
        <div className="form-view__categories-list" >
          <h2>ADD CATEGORY</h2>
          <ul>
              <li className={`form-view__categories-list-item SYSTEMS ${"SYSTEMS" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('SYSTEMS')}}>
                System Of Education
              </li>
              <li className={`form-view__categories-list-item EDUCATION ${"EDUCATION" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('EDUCATION')}}>
                Education Type
              </li>
              <li className={`form-view__categories-list-item CLASS ${"CLASS" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('CLASS')}}>
                Class
              </li>
              <li className={`form-view__categories-list-item CATEGORY ${"CATEGORY" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('CATEGORY')}}>
                Level Or Cycle
              </li>
              <li className={`form-view__categories-list-item VIDEO ${"VIDEO" === this.state.selection ? 'active' : null}`} onClick={() => {this.setSelection('VIDEO')}}>
                Video
              </li>
          </ul>
        </div>
        <div className="parent-holder">
          <div className={`form-view__categories-list form-view__categories-list__add-video total_view ${this.state.selection === "VIDEO"? 'hide':null }`} >
            <ul>
            {this.state.parent && this.state.parent.map((item, ind)=> (
                <li key={item.id} className={`form-view__categories-list-item ${item.id === this.state.selectionParent.id || item.id == this.state.selectionParent ? 'active' : null}`} onClick={() => {this.setSelectionParent(item)}}>
                  {item.name}
                </li>))}
            </ul>
          </div>
          <div className="form-view__item-view">
            <FormViewController selection={this.state.selection} parent={this.state.selectionParent} />
          </div>
        </div>
      </div>
    );
  }
}

export default FormView;
