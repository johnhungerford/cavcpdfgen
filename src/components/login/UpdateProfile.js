import React, { Component } from 'react';

import Panel from '../common/Panel.js';
import Button from '../common/Button.js';

import * as ajax from '../../api/ajaxfunctions';

import styles from './Login.module.css';

export default class UpdateProfile extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            username: '',
            password1: '',
            password2: '',
            err: false,
            errMessage: '',
        };

        console.log('PROPS!!!');
        console.log(this.props);
    }

    submit = () => {
        console.log('Submitting!');
        if (this.props.auth.password === '') {
            return this.setState((oldState) => ({
                ...oldState,
                err: true,
                errMessage: 'You must enter your current password to make changes'
            }));
        }

        if (this.state.username !== '') {
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
        }     
        
        if (this.state.password1 !== '' && this.state.password2 != '') {
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
        }

        if (this.props.profile.email !== '') {
            const reEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            if (!reEmail.test(this.props.profile.email)) {
                return this.setState((oldState) => {
                    return {
                        ...oldState,
                        err: true,
                        errMessage: `Invalid email address`,
                    }
                });
            }
        }

        const updateObj = {
            username: this.props.auth.username,
            password: this.props.auth.password,
        };

        if (this.state.username !== '') updateObj.newusername = this.state.username;
        if (this.state.password1 !== '') updateObj.newpassword = this.state.password;
        if (this.props.profile.email !== '') updateObj.email = this.props.profile.email;
        if (this.props.profile.phone !== '') updateObj.phone = this.props.profile.phone;
        if (this.props.profile.title !== '') updateObj.title = this.props.profile.title;
        if (this.props.profile.fullname !== '') updateObj.fullname = this.props.profile.fullname;
        if (this.props.profile.office !== '') updateObj.office = this.props.profile.office;
        if (this.props.profile.department !== '') updateObj.department = this.props.profile.department;
        if (this.props.profile.street !== '') updateObj.street = this.props.profile.street;
        if (this.props.profile.city !== '') updateObj.city = this.props.profile.city;
        if (this.props.profile.state !== '') updateObj.state = this.props.profile.state;
        if (this.props.profile.zip !== '') updateObj.zip = this.props.profile.zip;
        if (this.props.profile.general !== '') updateObj.general = this.props.profile.general;
        if (this.props.profile.chief !== '') updateObj.chief = this.props.profile.chief;
        if (this.props.profile.deputy !== '') updateObj.deputy = this.props.profile.deputy;

        ajax.postJSON(
            this.props.setState,
            this.props.auth,
            '/login/update',
            updateObj,
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
                    updateProfile: false,
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
                        <h1>Update Profile</h1>
                        <div className={styles.textinputs}>
                            <div className={styles.error}>
                                {this.state.err ? this.state.errMessage : null}
                            </div>
                            <div className={styles.userName}>
                                {`Current Username: ${this.props.auth.username}`}
                            </div>
                            <div className={styles.password}>
                                Current Password: <input 
                                    type='password'
                                    value={this.props.auth.password} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                auth: {
                                                    ...oldState.auth,
                                                    password: value,
                                                }
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.userName}>
                                New Username: <input 
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
                                New Password: <input 
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
                                Re-Enter New Password: <input 
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
                                    value={this.props.profile.email} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    email: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Full Name: <input 
                                    type='text'
                                    value={this.props.profile.fullname} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    fullname: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Title: <input 
                                    type='text'
                                    value={this.props.profile.title} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    title: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Office: <input 
                                    type='text'
                                    value={this.props.profile.office} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    office: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Department: <input 
                                    type='text'
                                    value={this.props.profile.department} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    department: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Street Address: <input 
                                    type='text'
                                    value={this.props.profile.street} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    street: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                City: <input 
                                    type='text'
                                    value={this.props.profile.city} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    city: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                State: <input 
                                    type='text'
                                    value={this.props.profile.state} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    state: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Postal Code: <input 
                                    type='text'
                                    value={this.props.profile.zip} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    zip: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Phone Number: <input 
                                    type='text'
                                    value={this.props.profile.phone} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    phone: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                General Counsel (Full Name): <input 
                                    type='text'
                                    value={this.props.profile.general} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    general: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Chief Counsel (Full Name): <input 
                                    type='text'
                                    value={this.props.profile.chief} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    chief: value,
                                                },
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div className={styles.password}>
                                Deputy Chief Counsel (Full Name): <input 
                                    type='text'
                                    value={this.props.profile.deputy} 
                                    onChange={(e)=>{
                                        const value = e.target.value;
                                        return this.props.setState((oldState) => {
                                            return {
                                                ...oldState,
                                                profile: {
                                                    ...oldState.profile,
                                                    deputy: value,
                                                },
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
                                Update
                            </Button>
                            <Button 
                                class={styles.register}
                                clickHandler={()=>{
                                    this.props.setState((oldState) => ({
                                        ...oldState,
                                        updateProfile: false,
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