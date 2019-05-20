import React, { Component } from 'react';

import Login from './login/Login';
import Register from './login/Register';

import * as ajax from '../api/ajaxfunctions';

import styles from './App.module.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            casenum: '',
            auth: {
                username: '',
                password: '',
                loggedin: false,
                promptlogin: true,
                register: false,
            }
        }

        this.inputRef = React.createRef();

        ajax.postJSON(
            this.setState,
            this.state.auth,
            `/login`,
            { test: true },
            (data)=>{
                if (data.success) {
                    this.setState((oldState) => ({
                        ...oldState,
                        auth: {
                            ...oldState.auth,
                            promptlogin: false,
                            loggedin: true,
                        }
                    }));
                }
            }
        );
    }

    stateSet = (fn1, fn2) => this.setState(fn1, fn2);

    noaSubmit = () => {
        window.open(`/doc/noa/${this.state.casenum}`);
        this.inputRef.current.focus();
        this.inputRef.current.select();
    }

    noaKeyPress = (e) => {if (e.key === 'Enter') this.noaSubmit();}

    casenumChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.slice(0,2)}-${value.slice(2)}`;
        if (value.length === 2) value = value + '-';
        if (value.length > 7) value = value.slice(0,7);
        this.setState((oldState) => ({
            ...oldState,
            casenum: value,
        }));
    }

    render() {
        if (this.state.auth.register) return (
            <div><Register setState={this.stateSet} auth={this.state.auth}/></div>
        );

        if (this.state.auth.promptlogin) return (
            <div><Login setState={this.stateSet} auth={this.state.auth}/></div>
        );

        console.log(this.state);

        return (
            <div className={styles.outerDiv}>
                <div className={styles.innerDiv}>
                    Case Number: 
                    <input 
                        className={styles.textInput} 
                        type='text' 
                        value={this.state.casenum}
                        autoFocus={true}
                        onChange={this.casenumChange}
                        onKeyPress={this.noaKeyPress}
                        ref={this.inputRef}
                    />
                    <button type='submit' onClick={this.noaSubmit}>Notice of Appearance</button>
                </div>
            </div>
        );
    };
};
