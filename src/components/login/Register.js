import React, { Component } from 'react';

import Panel from '../common/Panel.js';
import Button from '../common/Button.js';

import * as ajax from '../../api/ajaxfunctions';

import styles from './Login.module.css';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.auth.username,
            password1: '',
            password2: '',
            email1: '',
            fullname: '',
            title: '',
            office: '',
            department: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            general: '',
            chief: '',
            deputy: '',
            err: false,
            errMessage: '',
        }
    }

    submit = () => {
        console.log('Submitting!');
        if (
            this.state.username.length < 6 ||
            this.state.username.search(';') > -1 ||
            !/^[A-Za-z0-9_-]+$/.test(this.state.username)
        ) {
            return this.setState((oldState) => {
                return {
                    ...oldState,
                    err: true,
                    errMessage: 'Invalid username: must be more than 5 characters and contain only alphanumeric characters and "-", "_"',
                }
            });
        }
    
        if (this.state.password1 !== this.state.password2) {
            return this.setState((oldState) => {
                return {
                    ...oldState,
                    err: true,
                    errMessage: `Passwords do not match!`,
                }
            });
        }

        if (
            this.state.password1.length < 8 ||
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&~])/.test(this.state.password1)
        ) {
            return this.setState((oldState) => {
                return {
                    ...oldState,
                    err: true,
                    errMessage: `Invalid password: must be more than 7 characters and contain at least one lower case letter, one uppercase letter, one numerical digit, and one special character (!@#$%^&~)`,
                }
            });
        }

        const reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!reEmail.test(this.state.email)) {
            return this.setState((oldState) => {
                return {
                    ...oldState,
                    err: true,
                    errMessage: `Invalid email address`,
                }
            });
        }

        ajax.postJSON(
            this.props.setState,
            this.props.auth,
            '/login/register',
            { 
                username: this.state.username,
                password: this.state.password1,
                email: this.state.email,
                fullname: this.state.fullname,
                title: this.state.title,
                office: this.state.office,
                department: this.state.department,
                street: this.state.street,
                city: this.state.city,
                state: this.state.state,
                zip: this.state.zip,
                phone: this.state.phone,
                general: this.state.general,
                chief: this.state.chief,
                deputy: this.state.deputy,
            },
            (result) => {
                if (!result.success) {
                    this.setState((oldState) => {
                        return {
                            ...oldState,
                            err: true,
                            errMessage: result.message,
                        }
                    });

                    return;
                }

                console.log('Successful registration!');
                this.props.setState((oldState) => ({
                    ...oldState,
                    auth: {
                        username: this.state.username,
                        promptlogin: true,
                        loggedin: false,
                        register: false,
                    },
                    profile: result.profile,
                }));
            },
            (err) => this.setState((oldState) => ({
                ...oldState,
                err: true,
                errMessage: err.message,
            })) 
        );
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
                        <h1>Register</h1>
                        <div className={styles.textinputs}>
                            <div className={styles.error}>
                                {this.state.err ? this.state.errMessage : null}
                            </div>
                            <div className={styles.userName}>
                                Username: <input 
                                    type='text'
                                    value={this.state.username} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                username: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Password: <input 
                                    type='password'
                                    value={this.state.password1} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                password1: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Re-enter Password: <input 
                                    type='password'
                                    value={this.state.password2} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                password2: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Email: <input 
                                    type='text'
                                    value={this.state.email} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                email: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Full Name: <input 
                                    type='text'
                                    value={this.state.fullname} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                fullname: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Title: <input 
                                    type='text'
                                    value={this.state.title} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                title: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Office: <input 
                                    type='text'
                                    value={this.state.office} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                office: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Department: <input 
                                    type='text'
                                    value={this.state.department} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                department: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Street Address: <input 
                                    type='text'
                                    value={this.state.street} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                street: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                City: <input 
                                    type='text'
                                    value={this.state.city} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                city: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                State: <input 
                                    type='text'
                                    value={this.state.state} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                state: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Zip Code: <input 
                                    type='text'
                                    value={this.state.zip} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                zip: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Phone: <input 
                                    type='text'
                                    value={this.state.phone} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                phone: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                General Counsel (Full Name): <input 
                                    type='text'
                                    value={this.state.general} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                general: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Chief Counsel (Full Name): <input 
                                    type='text'
                                    value={this.state.chief} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                chief: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Deputy Chief Counsel (Full Name): <input 
                                    type='text'
                                    value={this.state.deputy} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                deputy: value,
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.error}>
                            {this.state.err ? this.state.errMessage : null}
                        </div>
                        <div className={styles.submit}>
                            <Button 
                                class={styles.login}
                                clickHandler={this.submit}
                            >
                                Register
                            </Button>
                            <Button 
                                class={styles.register}
                                clickHandler={()=>{
                                    this.props.setState((oldState) => ({
                                        ...oldState,
                                        auth: {
                                            ...oldState.auth,
                                            loggedin: false,
                                            username: this.state.username,
                                            password: '',
                                            promptlogin: true,
                                            register: false,
                                        }
                                    }));
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </Panel>
            </div>
        );
    }
}