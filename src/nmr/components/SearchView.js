import React, { Component } from "react";

import ServiceClient from "../service/ServiceClient";
import SuggestionListView from "./SuggestionListView";

export default class SearchView extends Component
{
    static PropTypes = {
        placeholder: React.PropTypes.string
    }

    static defaultProps = {
        placeholder: "please input"
    }

    state = {
        data: [],
        keyword: "",
        show: false
    }

    constructor(props)
    {
        super(props);
        this.inputTimer = null;
    }

    handleInputChange(event)
    {
        if (this.inpputTimer)
        {
            window.clearTimeout(this.inputTimer);
            this.inputTimer = null;
        }
        event.persist();
        this.inputTimer = window.setTimeout(() => {
            const keyword = event.nativeEvent.target.value;
            if (keyword && keyword !== "")
            {
                if ( keyword !== this.state.keyword) {
                    ServiceClient.getInstance().search(keyword, false).then(data => {
                        this.setState({
                            keyword,
                            data: (data ? data : [])
                        });
                    }, (error)=> {
                        console.log("search error");
                    });
                }
                this.setState({
                    show: true
                });
            }
            else
            {
                this.setState({
                    keyword: "",
                    data: [],
                    show: false
                });
            }
        }, 300);
    }

    componentWillReceiveProps(nextProps)
    {

    }

    componentDidMount()
    {
        this.refs["song-input"].onblur = () => { this.setState({show: false}); };
        this.refs["song-input"].onfocus = () => { this.setState({show: true}); };
    }


    render()
    {
        return (<div className={ this.props.className ? this.props.className : "" }>
            <span className="iconfont icon-search"></span>
            <input  ref="song-input" type="search" placeholder={this.props.placeholder} onChange={ this.handleInputChange.bind(this) }/>
            <SuggestionListView className={ "nm-suggestion-list-view " + (this.state.show ? "nm-show" : "nm-hide")} data={ this.state.data } handleSelectionChange={ this.props.handleSelectionChange } />
        </div>);
    }

    handleSelectionChange(data)
    {
        this.props.handleSelectionChange(data);
    }
}
