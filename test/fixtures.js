// Contact roles
// 0820000111: registered user
// 0820000222: unregistered user

module.exports = function() {
return [

    // 0: get identity 0820000111 by msisdn (to validate registered check)
    {
        "request": {
            "method": "GET",
            "params": {
                "details__addresses__msisdn": "+267820000111"
            },
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/search/",
        },
        "response": {
            "code": 200,
            "data": {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [{
                    "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-00000000111/",
                    "id": "cb245673-aa41-4302-ac47-00000000111",
                    "version": 1,
                    "details": {
                        "id_number": "12345",
                        "name": "Bruce Lee",
                        "site": "Hong Kong",
                        "registered": true,
                        "addresses": {
                            "msisdn": {
                                "+267820000111": {}
                            }
                        }
                    },
                    "created_at": "2016-05-10T06:13:29.693272Z",
                    "updated_at": "2016-05-10T06:13:29.693298Z"
                }]
            }
        }
    },

    // 1: get identity 0820000222 by msisdn (to validate registered check)
    {
        "request": {
            "method": "GET",
            "params": {
                "details__addresses__msisdn": "+267820000222"
            },
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/search/",
        },
        "response": {
            "code": 200,
            "data": {
                "count": 0,
                "next": null,
                "previous": null,
                "results": []
            }
        }
    },

    // 2: create identity 0820000222
    {
        "repeatable": true,
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/",
            "data":  {
                "details": {
                    "default_addr_type": "msisdn",
                    "addresses": {
                        "msisdn": {
                            "+267820000222": {}
                        }
                    }
                }
            }
        },
        "response": {
            "code": 201,
            "data": {
                "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-00000000222/",
                "id": "cb245673-aa41-4302-ac47-00000000222",
                "version": 1,
                "details": {
                    "addresses": {
                        "msisdn": {
                            "+267820000222": {}
                        }
                    }
                },
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 3: create registration 0820000222
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8002/api/v1/registration/",
            "data":  {
                "user_id": "cb245673-aa41-4302-ac47-00000000222",
                "data": {
                    "id_number": "12345",
                    "name": "John Doe",
                    "site": "Gotham"
                }
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 4: get identity cb245673-aa41-4302-ac47-00000000222
    {
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-00000000222/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-000000000222",
                "version": 1,
                "details": {
                    "addresses": {
                        "msisdn": {
                            "+267820000222": {}
                        }
                    }
                },
                "created_at": "2016-04-05T06:13:29.693272Z",
                "updated_at": "2016-04-05T06:13:29.693298Z"
            }
        }
    },

    // 5: patch identity cb245673-aa41-4302-ac47-000000000222
    {
        "request": {
            "method": "PATCH",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000222/",
            "data":  {
                "id": "cb245673-aa41-4302-ac47-000000000222",
                "version": 1,
                "details": {
                    "addresses": {
                        "msisdn": {
                            "+267820000222": {}
                        }
                    },
                },
            }
        },
        "response": {
            "code": 200,
            "data": {}
        }
    },

];
};
