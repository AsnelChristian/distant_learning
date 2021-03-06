import React, { Component } from "react";
import "../stylesheets/MainCategoryNav.css";
import $ from "jquery";
import ContentDisplay from "./ContentDisplay";
import VideoView from "./VideoView";
import TimetableView from "./TimetableView"

class MainCategoryNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            level1Data: {
                isFetching: false,
                data: null,
                error: null,
            },
            level2Data: [],
            lastLevelData: {
                isFetching: false,
                data: null,
                error: null,
            },
            selectedItem1: null,
            selectedItem2: null,
            videos: [],
            tabVisibility: false,
            subTabVisibility: false,
            selectedSubCatId: '',
            selectedSubCatname: '',
            selected_class: '',
            selected_category: '',
            selectedSubCat: null,
            selectedEduc: null,
            viewTimeTable: false,
            viewRevisionVideos: false,
        };
    }
    componentDidMount() {
        this.setState(
            (prevState) => ({
                ...prevState,
                level1Data: {
                    ...prevState.level1Data,
                    isFetching: true,
                },
            }),
            () =>
                $.ajax({
                    url: `/systems`, //TODO: update request URL
                    type: "GET",
                    success: (result) => {
                        // console.log("labista one", result.data);
                        this.setState(
                            (prevState) => ({
                                ...prevState,
                                level1Data: {
                                    ...prevState.level1Data,
                                    data: result.data,
                                    isFetching: false,
                                },
                                level2Data: result.data[0].education_list,
                                selectedItem1: result.data[0].id + '-' + result.data[0].name,
                                selectedEduc: result.data[0].education_list && result.data[0].education_list.length > 0
                                    ? result.data[0].education_list[0]
                                    : null,
                                selectedItem2:
                                    result.data[0].education_list && result.data[0].education_list.length > 0
                                        ? result.data[0].education_list[0].id + result.data[0].education_list[0].name
                                        : null,
                            }),
                            () => typeof this.state.level2Data[0] !== "undefined"?this.showChildData(this.state.level2Data[0], this.state.level2Data[0].education_list):(()=>{})()
                        );
                        return;
                    },
                    error: (error) => {
                        alert("Unable to load systems. Please try your request again");
                        return;
                    },
                })
        );
    }

    getInitialVideos = (selection_id, revision, timetable) => {
        revision = typeof(revision) === "undefined"?false:revision
        timetable = typeof(timetable) === "undefined"?false:timetable
        // console.log("SOme videos")
        $.ajax({
        url: `/videos?education_id=${selection_id}&revision=${revision}`, //TODO: update request URL
        type: "GET",
        success: (result) => {
            this.setState({ videos: result.data, viewRevisionVideos: revision, viewTimeTable : timetable})
            // console.log(result.data)
            // console.log(selection_id)
            // this.props.updateVideos(this.state.videos)
            return;
        },
        error: (error) => {
            alert('Unable to load systems. Please try your request again')
            return;
        }
        })
    }

    displayTab = (data) => {
        return (
            <div className="row nav-item-system__row ml-0 mr-0" style={{ color: "white", backgroundColor: "#468908" }}>
                {data.map((item) => (
                    <div
                        key={item.id}
                        id={`${item.id}${item.name}`}
                        onClick={() => this.handleTabClick(item, item.education_list)}
                        className={`col hover__cursor__style single-tab-hover text-center py-3 nav-item-system font-weight-bolder ${
                            item.id + '-' + item.name === this.state.selectedItem1 ? "nav-item-system__active" : null
                        }`}
                    >
                        {item.name.toUpperCase()}
                    </div>
                ))}
            </div>
        );
    };

    handleTabClick = (data, nextData) => {
        this.setState((prevState) => ({
            ...prevState,
            selectedItem1: data.id + '-' + data.name,
            videos: [],
            selectedEduc: nextData?nextData[0]:null,
            tabVisibility: true,
        }));
        this.showChildData(data, nextData);
    };

    handleTab2Click = (data, nextData) => {
        // console.log('something is working')
        // console.log(data.sub_categories)
        var cond = data.sub_categories && data.sub_categories.length > 0?true:false
        // console.log(cond)
        this.setState((prevState) => ({
            ...prevState,
            selectedItem2: data.id + data.name,
            selectedEduc: data,
            subTabVisibility: cond,
            selectedSubCat: null,
            selected_class: '',
            selected_category: '',
        }));
        this.getInitialVideos(data.id)
        this.showChildData(data, nextData);
    };

    handleSubCatClick = (data, parentData) => {
        this.setState({ selectedSubCatId: data.id + data.name, 
            selectedSubCatname: data.name,
            selectedSubCat: data,
            subTabVisibility:false });
        // this.getInitialVideos(parentData.id)
        this.fetchClassSubData(data);
    };

    fetchClassSubData = (prevData, showExams) => {
        if (prevData){
            var showExamsCheck = typeof(showExams) === 'undefined'?false:showExams
            var url_for = (!this.state.viewTimeTable && !this.state.viewRevisionVideos)? '/class': '/exams'
            url_for = typeof(showExams) === 'undefined'? (showExamsCheck?'/exams':url_for):(showExams?'/exams':'/class')
            this.setState(
                (prevState) => ({
                    ...prevState,
                    lastLevelData: {
                        ...prevState.lastLevelData,
                        isFetching: true,
                    },
                }),
                () =>
                    $.ajax({
                        url: `${url_for}?sub_category_id=${prevData.id}`, //TODO: update request URL
                        type: "GET",
                        success: (result) => {
                            // console.log(result.data);
                            this.setState((prevState) => ({
                                ...prevState,
                                lastLevelData: {
                                    ...prevState.lastLevelData,
                                    data: result.data,
                                    isFetching: false,
                                },
                            }));
                            return;
                        },
                        error: (error) => {
                            alert("Unable to load categories. Please try your request again");
                            return;
                        },
                    })
            );
        }
        
    };

    showChildData = (prevData, data) => {
        // console.log(data);
        // console.log('system_click')
        // if (data === this.state.level2Data && this.state.level2Data.length > 0) {
        //     this.setState((prevState) => ({
        //         ...prevState,
        //         level2Data: [],
        //         lastLevelData: {
        //             isFetching: false,
        //             data: null,
        //             error: null,
        //         },
        //     }));
        // } else 
        if (!data) {
            this.fetchLeaveData(prevData);
        } else if (data.length === 0) {
            this.setState(
                (prevState) => ({
                    ...prevState,
                    level2Data: [],
                }),
                () => this.fetchLeaveData(prevData)
            );
        } else {
            this.setState((prevState) => ({
                ...prevState,
                level2Data: data,
                lastLevelData: {
                    isFetching: false,
                    data: null,
                    error: null,
                },
            }), ()=>
            {
                this.state.level2Data.length > 0 && this.fetchLeaveData(this.state.level2Data[0])
            });
        }
    };

    fetchLeaveData = (prevData, showExams) => {
        var showExamsCheck = typeof(showExams) === 'undefined'?false:showExams
        var url_for = (!this.state.viewTimeTable && !this.state.viewRevisionVideos)? '/class': '/exams'
        url_for = typeof(showExams) === 'undefined'? (showExamsCheck?'/exams':url_for):(showExams?'/exams':'/class')
        // console.log(url_for)
        var viewTimeTableCheck = url_for === '/exams'?true:false
        this.setState(
            (prevState) => ({
                ...prevState,
                lastLevelData: {
                    ...prevState.lastLevelData,
                    isFetching: true,
                },
            }),
            () =>
                $.ajax({
                    url: `${url_for}?education_id=${prevData.id}`, //TODO: update request URL
                    type: "GET",
                    cache: false,
                    success: (result) => {
                        // console.log(result.data);
                        this.setState((prevState) => ({
                            ...prevState,
                            lastLevelData: {
                                ...prevState.lastLevelData,
                                data: result.data,
                                isFetching: false,
                            },
                        }));
                        // (typeof result.data !== "undefined"|| result.data.length > 0 ) && typeof result.data[0] !== "undefined"? this.getInitialVideos(prevData.id, this.state.viewRevisionVideos):(()=>{})()
                        this.getInitialVideos(prevData.id, this.state.viewRevisionVideos, viewTimeTableCheck)
                        return;
                    },
                    error: (error) => {
                        alert("Unable to load categories. Please try your request again");
                        return;
                    },
                })
        );
    };

    fetchVideoData = (class_id, category_id, revision) => {
        revision = typeof(revision) === "undefined"?this.state.viewRevisionVideos:revision
        var query_url = category_id && typeof category_id !== "undefined"?`/videos?category_id=${category_id}`: `/videos?class_id=${class_id}`
        var sec_query_url = category_id && typeof category_id !== "undefined"?`/videos?exam_level_id=${category_id}`: `/videos?exam_id=${class_id}`
        var url_for_query = (!this.state.viewTimeTable && !this.state.viewRevisionVideos) ? query_url : sec_query_url
        $.ajax({
            url: url_for_query, //TODO: update request URL
            type: "GET",
            success: (result) => {
              this.setState({ videos: result.data, selected_category: category_id, selected_class: class_id})
              return;
            },
            error: (error) => {
              alert('Unable to load systems. Please try your request again')
              return;
            }
          })
    }

    setTimetableInfo = (class_id, category_id) => {
        this.setState({
            selected_class: class_id,
            selected_category: category_id,
        })
    }

    showTimeTable = () => {
        // console.log('showtimetable')
        this.setState({
            viewRevisionVideos: this.state.viewTimeTable,
            viewTimeTable: !this.state.viewTimeTable
        })
    }

    showTimeTableMain = () => {
        var viewTimeTable = this.state.viewRevisionVideos && !this.state.viewTimeTable? false:!this.state.viewTimeTable
        this.setState({
            viewRevisionVideos: false,
            viewTimeTable: viewTimeTable
        })
        if(!viewTimeTable){
             if( this.state.selected_category !== "" || this.state.selected_class !== ""){
                this.fetchVideoData(this.state.selected_class, this.state.selected_category, false)
            }else{
                this.getInitialVideos(this.state.selectedEduc.id, false)
            }
        }
        this.state.selectedSubCat?this.fetchClassSubData(this.state.selectedSubCat, viewTimeTable):this.fetchLeaveData(this.state.selectedEduc, viewTimeTable)
    }

    showRevisionVideo = () => {
        if(this.state.selected_category !== "" || this.state.selected_class !== ""){
            this.fetchVideoData(this.state.selected_class, this.state.selected_category, !this.state.viewRevisionVideos)
        }else{
            this.state.viewRevisionVideos===false?this.getInitialVideos(this.state.selectedEduc.id, !this.state.viewRevisionVideos):this.showTimeTable()
        }
        this.setState({
            viewTimeTable: this.state.viewRevisionVideos,
            viewRevisionVideos: !this.state.viewRevisionVideos
        })
        // this.fetchLeaveData(this.state.level2Data[0], true)
    }

    render() {
        return (
            <div>
                {this.state.level1Data.isFetching ? (
                    <div className="text-center py-3">
                        <div className="spinner-grow text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : this.state.level1Data.error ? (
                    <div className="alert alert-danger" role="alert">
                        Error occured file fetching data
                    </div>
                ) : this.state.level1Data.data ? (
                    <div className="">
                        {this.displayTab(this.state.level1Data.data)}
                        {this.state.level2Data.length > 0 && (
                            <div className="row second-tab-row m-0">
                                {this.state.level2Data.map((item) => (
                                    <>
                                        <div
                                            key={item.id}
                                            id={`${item.id}${item.name}`}
                                            className={`col hover__cursor__style single-tab-hover text-center py-3 font-weight-bolder second-tab ${
                                                item.id + item.name === this.state.selectedItem2 ? "second-tab__active" : null
                                            }`}
                                        >
                                        <span className="educ-name" onClick={() => this.handleTab2Click(item, item.education_list)}>{item.name.toUpperCase()}</span>
                                        <span className={`sub-cat__sub-name ${ item.id + item.name === this.state.selectedItem2 && item.sub_categories.length > 0 ? "nav-toggle-show" : 'nav-toggle-hide'
                                            }`}>{this.state.selectedSubCatname.toUpperCase()}</span>
                                        <div className={`${item.sub_categories.length > 0 && this.state.subTabVisibility ?"nav-toggle-show":'nav-toggle-hide'} sub_cat`}>
                                        {item.sub_categories.length > 0 && item.sub_categories.map((sub_item) => (
                                            <div
                                                key={sub_item.id}
                                                id={`${sub_item.id}${sub_item.name}`}
                                                onClick={() => this.handleSubCatClick(sub_item, item)}
                                                className={`sub_cat__item ${
                                                    sub_item.id + sub_item.name === this.state.selectedsub_Item2 ? "second-tab__active" : null
                                                }`}
                                            >
                                                <span>{sub_item.name.toUpperCase()}</span>
                                            </div>
                                        ))}
                                        </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                        )}
                        <div className="mt-5 main-body-content" style={{ minHeight: "400px" }}>
                            {this.state.lastLevelData.isFetching ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            ) : this.state.lastLevelData.error ? (
                                <div className="alert alert-danger" role="alert">
                                    Error occured file fetching data
                                </div>
                            ) : this.state.lastLevelData.data && this.state.lastLevelData.data.length > 0  ? (
                                <>
                                {/* <div className=""> */}
                                    <div className="main-body-menu">
                                        <input type="checkbox" id="nav-toggle" className="nav-toggle"></input>

                                        <label htmlFor="nav-toggle" className="nav-toggle-label">
                                            <span></span>
                                        </label>
                                        <div className="class-nav">
                                            <ContentDisplay classes={this.state.lastLevelData.data} fetchVideoData={this.fetchVideoData} setTimetableInfo={this.setTimetableInfo}/>
                                        </div>
                                    </div>
                                    <div className="main-body-content-section">
                                        {/* <div className='timetable-button' onClick={() => {this.showTimeTableMain()}}>
                                        {(!this.state.viewTimeTable && !this.state.viewRevisionVideos)? (<div><svg className="icon-calendar icon-calendar-question">
                                            <use xlinkHref="./icons/symbol-defs.svg#icon-calendar"></use>
                                        </svg>
                                        revision/révision</div>):
                                        <div><svg className="icon-arrow-left2 icon-arrow-left2-question">
                                            <use xlinkHref="./icons/symbol-defs.svg#icon-arrow-left2"></use>
                                        </svg>
                                        back</div>}
                                        </div> */}
                                        {(this.state.viewTimeTable || this.state.viewRevisionVideos) && <div className={`timetable-button-secondary ${this.state.viewTimeTable?"front":"back"}`} onClick={() => {this.showRevisionVideo()}}>
                                        {this.state.viewTimeTable? (<div className="floating-button">
                                            <div className="button-names">
                                                <span>revision videos</span>
                                                <span>vidéos de révision</span>
                                            </div>
                                            <div className="button-icons">
                                                <svg className="icon-film-front icon-film-question">
                                                    <use xlinkHref="./icons/symbol-defs.svg#icon-film"></use>
                                                </svg>
                                            </div>
                                        </div>):
                                        <div className="floating-button">
                                            <div className="button-icons">
                                                <svg className="icon-calendar-front icon-calendar-question">
                                                    <use xlinkHref="./icons/symbol-defs.svg#icon-calendar"></use>
                                                </svg>
                                            </div>
                                            <div className="button-names">
                                                <span>timetable</span>
                                                <span>calendrier</span>
                                            </div>
                                        </div>}
                                        </div>}
                                        {this.state.viewTimeTable? (<div className="video-body">
                                            <TimetableView category_id={this.state.selected_category} class_id={this.state.selected_class} />
                                        </div>): <div className="video-body">
                                            <VideoView from_add={this.state.videos} delete_hide={true} revision={this.state.viewRevisionVideos} />
                                        </div>}
                                        {/* <div className="timetable-notification">
                                            <p>Check timetable regularly before the start of class for instructions on how to attend</p>
                                            <p>Vérifiez régulièrement les implois du temps avant le début du cours pour savoir comment y assister.</p>
                                        </div> */}
                                    </div>
                                {/* </div> */}
                                {/* <div className="row main-body-content">
                                    <div className="col-2 class-nav">
                                        <ContentDisplay classes={this.state.lastLevelData.data} fetchVideoData={this.fetchVideoData}/>
                                    </div>
                                    <div className="col-10 video-body">
                                        <VideoView from_add={this.state.videos} delete_hide={true} />
                                    </div>
                                </div> */}
                                </>
                            ) : <div className="col-3 ml-auto mr-auto alert alert-danger" role="alert">
                            No Data Available
                        </div>}
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-danger" role="alert">
                        Something not right
                    </div>
                )}
            </div>
        );
    }
}

export default MainCategoryNav;
