const $ = require('jquery');

const getJSON = function(setState, auth, url, successCallback, failCallback) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: true,
    }).done((data2)=>{
        console.log('getJSON:');
        console.log(data2);
        if (data2.wlreauth) {
            if (auth.username === null || auth.password === null) {
                return setState((oldState) => ({
                    ...oldState,
                    auth: {
                        ...oldState.auth,
                        promptlogin: true,
                        loggedin: false,
                        password: null,
                    }
                }));
            }

            return postJSON(
                `/login`,
                { username: auth.username, password: auth.password },
                (result) => {
                    if (result.success) {
                        setState((oldState) => ({
                            ...oldState,
                            auth: {
                                ...oldState.auth,
                                promptlogin: false,
                                loggedin: true,
                            }
                        }), () => {
                            getJSON(setState, auth, url, successCallback, failCallback)
                        });
                    }

                    setState((oldState) => ({
                        ...oldState,
                        auth: {
                            ...oldState.auth,
                            promptlogin: true,
                            loggedin: false,
                            password: null,
                        }
                    }));
                },
                (err) => {
                    setState((oldState) => ({
                        promptlogin: true,
                        loggedin: false,
                        password: null,
                    }));
                }
            );
        }

        return successCallback instanceof Function ? successCallback(data2) : null;
    }).fail((data3) => {
        console.log('getJSON err:');
        console.log(data3);
        return failCallback instanceof Function ? failCallback(data3) : null;
    });
}

const postJSON = function(setState, auth, url, data, successCallback, failCallback) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: url,
        dataType: "json",
        async: true,
        data: JSON.stringify(data),
    }).done((data2)=>{
        console.log('postJSON:');
        console.log(data2);
        if (data2.wlreauth) {
            if (auth.username === null || auth.password === null) {
                return setState((oldState) => ({
                    ...oldState,
                    auth: {
                        ...oldState.auth,
                        promptlogin: true,
                        loggedin: false,
                        password: null,
                    }
                }));
            }

            return postJSON(
                `/login`,
                { username: auth.username, password: auth.password },
                (result) => {
                    if (result.success) {
                        setState((oldState) => ({
                            ...oldState,
                            auth: {
                                ...oldState.auth,
                                promptlogin: false,
                                loggedin: true,
                            }
                        }), () => {
                            getJSON(setState, auth, url, successCallback, failCallback)
                        });
                    }

                    setState((oldState) => ({
                        ...oldState,
                        auth: {
                            ...oldState.auth,
                            promptlogin: true,
                            loggedin: false,
                            password: null,
                        }
                    }));
                },
                (err) => {
                    setState((oldState) => ({
                        promptlogin: true,
                        loggedin: false,
                        password: null,
                    }));
                }
            );
        }

        return successCallback instanceof Function ? successCallback(data2) : null;
    }).fail((data3) => {
        console.log('postJSON err:');
        console.log(data3);
        return failCallback instanceof Function ? failCallback(data3) : null;
    });
}

module.exports.getJSON = getJSON;
module.exports.postJSON = postJSON;
