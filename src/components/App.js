import React, { Component } from 'react';

import Login from './login/Login';
import UpdateProfile from './login/UpdateProfile';
import Register from './login/Register';
import Button from './common/Button';

import * as ajax from '../api/ajaxfunctions';

import styles from './App.module.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            casenum: '',
            date: '',
            auth: {
                username: '',
                password: '',
                loggedin: false,
                promptlogin: true,
                register: false,
            },
            updateProfile: false,
            profile: {
                email: '',
                fullname: '',
                title: '',
                office: '',
                department: '',
                street: '',
                city: '',
                state: '',
                zip: '',
                phone: '',
            },
            err: false,
            errMessage: '',
        }

        this.inputRef = React.createRef();

        ajax.getJSON(
            this.setState,
            this.state.auth,
            `/login/test`,
            (data)=>{
                if (data.success) {
                    this.setState((oldState) => ({
                        ...oldState,
                        auth: {
                            ...oldState.auth,
                            promptlogin: false,
                            loggedin: true,
                        },
                        profile: data.profile,
                    }));
                }
            }
        );
    }

    logout = () => {
        ajax.getJSON(
            this.setState,
            this.state.auth,
            `/login/logout`,
            (data)=>{
                if (data.success) {
                    this.setState((oldState) => ({
                        ...oldState,
                        auth: {
                            ...oldState.auth,
                            promptlogin: true,
                            loggedin: false,
                            register: false,
                            password: '',
                        }
                    }));
                }
            }
        );
    }

    updateProfile = () => {
        this.setState((oldState) => ({
            ...oldState,
            auth: {
                ...oldState.auth,
                register: false,
                promptlogin: false,
                password: '',
            },
            updateProfile: true,
        }));
    }

    stateSet = (fn1, fn2) => this.setState(fn1, fn2);

    noaSubmit = () => {
        if (this.state.casenum.length !== 7) return this.setState((oldState) => ({
            ...oldState,
            err: true,
            errMessage: 'Case Number is required for a Notice of Appearance',
        }));

        window.open(`/doc/noa/${this.state.casenum}`);
        this.inputRef.current.focus();
        this.inputRef.current.select();
    }

    staySubmit = () => {
        if (this.state.casenum.length !== 7) return this.setState((oldState) => ({
            ...oldState,
            err: true,
            errMessage: 'Case Number is required for a Motion to Stay',
        }));
        
        window.open(
            this.state.date === '' ? 
                `/doc/stay/${this.state.casenum}` : 
                `/doc/stay/${this.state.casenum}/${this.state.date}`
        );
        this.inputRef.current.focus();
        this.inputRef.current.select();
    }

    noaKeyPress = (e) => {if (e.key === 'Enter') this.noaSubmit();}
    stayKeyPress = (e) => {if (e.key === 'Enter') this.staySubmit();}

    casenumChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 2) value = `${value.slice(0,2)}-${value.slice(2)}`;
        if (value.length === 2) value = value + '-';
        if (value.length > 7) value = value.slice(0,7);
        this.setState((oldState) => ({
            ...oldState,
            casenum: value,
            err: false,
            errMessage: '',
        }));
    }

    stayChange = (e) => {
        let value = e.target.value;
        this.setState((oldState) => ({
            ...oldState,
            date: value,
            err: false,
            errMessage: '',
        }));
    }

    today = () => {
        const dateToday = new Date();
        this.setState((oldState) => ({
            ...oldState,
            date: new Date(dateToday.getTime() - (dateToday.getTimezoneOffset() * 60000 ))
                .toISOString()
                .split('T')[0],
        }));
    }

    render() {
        if (this.state.auth.register) return (
            <div><Register setState={this.stateSet} auth={this.state.auth}/></div>
        );

        if (this.state.auth.promptlogin) return (
            <div><Login setState={this.stateSet} auth={this.state.auth}/></div>
        );

        if (this.state.updateProfile) return (
            <div><UpdateProfile 
                setState={this.stateSet} 
                auth={this.state.auth}
                profile={this.state.profile}
            /></div>
        )

        console.log(this.state);

        return (
            <div className={styles.outerDiv}>
                <div className={styles.innerDiv}>
                    <div>
                        {
                            this.state.err ? 
                                <span className={styles.errMsg}>{this.state.errMessage}</span> :
                                ''
                        }
                    </div>
                    <div className={styles.noaDiv}>
                        <div>Case Number</div>
                        <div onKeyPress={this.noaKeyPress}>
                            <input 
                                className={styles.textInput} 
                                type='text' 
                                value={this.state.casenum}
                                autoFocus={true}
                                onChange={this.casenumChange}
                                size='7'
                                ref={this.inputRef}
                            />
                        </div>
                    </div>
                    <div><Button clickHandler={this.noaSubmit}>Notice of Appearance</Button></div>
                    <div className={styles.stayDiv}>
                        <div>Stay Submission Date</div>
                        <div onKeyPress={this.stayKeyPress}>
                            <input 
                                className={styles.dateInput} 
                                type='date' 
                                value={this.state.date}
                                onChange={this.stayChange}
                                onKeyPress={this.stayKeyPress}
                                size='7'
                            />
                            <Button
                                option='small'
                                clickHandler={this.today}
                            >Today</Button>
                        </div>
                        <div><Button clickHandler={this.staySubmit}>Motion for Stay</Button></div>
                    </div>
                    <div className={styles.logoutButtonDiv}>
                        <span style={{ marginRight: 50, }}><Button
                            clickHandler={this.updateProfile}
                        >Edit Profile</Button></span>
                        <Button
                            clickHandler={this.logout}
                        >Logout</Button>
                    </div>
                </div>
            </div>
        );
    };
};
