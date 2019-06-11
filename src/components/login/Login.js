import React, { Component } from 'react';

import Panel from '../common/Panel.js';
import Button from '../common/Button.js';

import * as ajax from '../../api/ajaxfunctions';

import styles from './Login.module.css';

export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    nameChange = (e) => {
        const value = e.target.value;
        this.props.setState((oldState) => ({
            ...oldState,
            auth: {
                ...oldState.auth,
                username: value,
            }
        }));
    }
    
    pwdChange = (e) => {
        const value = e.target.value;
        this.props.setState((oldState) => ({
            ...oldState,
            auth: {
                ...oldState.auth,
                password: value,
            }
        }));
    }

    submit = () => {
        ajax.postJSON(
            this.props.setState,
            this.props.auth,
            '/login',
            { 
                username: this.props.auth.username,
                password: this.props.auth.password,
            },
            (result) => {
                if (!result.success) {
                    return console.log(result.message);
                }

                const profile = {};
                for (let i in result.profile) {
                    if (result.profile[i] === null) profile[i] = '';
                    else profile[i] = result.profile[i];
                }

                console.log('SUCCESS!');
                this.props.setState((oldState) => ({
                    ...oldState,
                    auth: {
                        ...oldState.auth,
                        password: '',
                        loggedin: true,
                        promptlogin: false,
                    },
                    profile: profile,
                }));
            },
            (err) => { return console.log(err.message); }
        );
    }

    keyDownHandler = (e) => {
        if(e.keyCode === 13) this.submit();
    }

    render() {
        return (
            <div 
                className={styles.outerDiv}
                tabIndex='0'
                onKeyDown={this.keyDownHandler}
            >
                <Panel 
                    outerClass={styles.panelOuter}
                    innerClass={styles.panelInner}
                >
                    <div className={styles.container}>
                        <h1>Login</h1>
                        <div className={styles.textinputs}>
                            <div className={styles.userName}>
                                Username: <input 
                                    id='username' 
                                    type='text'
                                    value={this.props.auth.username} 
                                    onChange={this.nameChange}
                                />
                            </div>
                            <div className={styles.password}>
                                Password: <input 
                                    id='password' 
                                    type='password'
                                    value={this.props.auth.password} 
                                    onChange={this.pwdChange}
                                />
                            </div>
                        </div>
                        <div className={styles.submit}>
                            <Button 
                                class={styles.login}
                                clickHandler={this.submit}
                            >Login</Button>
                            <Button 
                                class={styles.register}
                                clickHandler={() => {
                                    this.props.setState((oldState) => ({
                                        ...oldState,
                                        auth: {
                                            ...oldState.auth,
                                            register: true,
                                            loggedin: false,
                                            promptlogin: false,
                                        }
                                    }));
                                }}
                            >
                                New User
                            </Button>
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }
}
