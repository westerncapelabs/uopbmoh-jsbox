// Contact roles
// 0820000111: registered user; has untaken quizzes
// 0820000222: unregistered user
// 0820000333: registered user; no untaken quizzes

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
                    "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000111/",
                    "id": "cb245673-aa41-4302-ac47-000000000111",
                    "version": 1,
                    "details": {
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
                "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000222/",
                "id": "cb245673-aa41-4302-ac47-000000000222",
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
                "user_id": "cb245673-aa41-4302-ac47-000000000222",
                "data": {
                    "facility_code": "12345",
                    "gender": "male",
                    "cadre": "Xpress",
                    "department": "Back-office"
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
            "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000222/",
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

    // 6: get untaken quizzes for identity cb245673-aa41-4302-ac47-000000000111
    {
        "request": {
            "method": "GET",
            "params": {
                "identity": "cb245673-aa41-4302-ac47-000000000111"
            },
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/quiz/untaken",
        },
        "response": {
            "code": 200,
            "data": {
                "count": 1,
                "next": null,
                "previous": null,
                "results": [
                    {
                        "id": "cb245673-aa41-4302-ac47-q00000000111",
                        "created_at": "2016-04-05T06:13:29.693272Z",
                        "updated_at": "2016-04-05T06:13:29.693298Z"
                    },
                    {
                        "id": "cb245673-aa41-4302-ac47-q00000000112",
                        "created_at": "2016-04-05T06:13:29.693272Z",
                        "updated_at": "2016-04-05T06:13:29.693298Z"
                    },
                    {
                        "id": "cb245673-aa41-4302-ac47-q00000000113",
                        "created_at": "2016-04-05T06:13:29.693272Z",
                        "updated_at": "2016-04-05T06:13:29.693298Z"
                    },
                    {
                        "id": "cb245673-aa41-4302-ac47-q00000000114",
                        "created_at": "2016-04-05T06:13:29.693272Z",
                        "updated_at": "2016-04-05T06:13:29.693298Z"
                    },
                ]
            }
        }
    },

    // 7: get identity 0820000333 by msisdn (to validate registered check)
    {
        "request": {
            "method": "GET",
            "params": {
                "details__addresses__msisdn": "+267820000333"
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
                    "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000333/",
                    "id": "cb245673-aa41-4302-ac47-000000000333",
                    "version": 1,
                    "details": {
                        "registered": true,
                        "addresses": {
                            "msisdn": {
                                "+267820000333": {}
                            }
                        }
                    },
                    "created_at": "2016-05-10T06:13:29.693272Z",
                    "updated_at": "2016-05-10T06:13:29.693298Z"
                }]
            }
        }
    },

    // 8: get untaken quizzes for identity cb245673-aa41-4302-ac47-000000000333
    {
        "request": {
            "method": "GET",
            "params": {
                "identity": "cb245673-aa41-4302-ac47-000000000333"
            },
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/quiz/untaken",
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

    // 9: get questions for quiz cb245673-aa41-4302-ac47-q00000000111
    {
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/quiz/cb245673-aa41-4302-ac47-q00000000111/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-q0000000111",
                "description": "Primary quiz on WC staff",
                "questions": ["cb245673-aa41-4302-ac47-qq000000001", "cb245673-aa41-4302-ac47-qq000000002", "cb245673-aa41-4302-ac47-qq000000003"],
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 10: get questions for quiz cb245673-aa41-4302-ac47-q00000000112
    {
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/quiz/cb245673-aa41-4302-ac47-q00000000112/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-q0000000112",
                "description": "Quiz on TB treatment",
                "questions": ["cb245673-aa41-4302-ac47-qq000000004", "cb245673-aa41-4302-ac47-qq000000005", "cb245673-aa41-4302-ac47-qq000000006"],
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 11: get questions for quiz cb245673-aa41-4302-ac47-q00000000113
    {
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/quiz/cb245673-aa41-4302-ac47-q00000000113/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-q0000000113",
                "description": "Quiz on TB signs and symptoms",
                "questions": ["cb245673-aa41-4302-ac47-qq000000007", "cb245673-aa41-4302-ac47-qq000000008", "cb245673-aa41-4302-ac47-qq000000009"],
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 12: get questions for quiz cb245673-aa41-4302-ac47-q00000000114
    {
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/quiz/cb245673-aa41-4302-ac47-q00000000114/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-q0000000114",
                "description": "Quiz on TB diagnosis",
                "questions": ["cb245673-aa41-4302-ac47-qq000000011", "cb245673-aa41-4302-ac47-qq000000012", "cb245673-aa41-4302-ac47-qq000000013"],
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 13: get questions for quiz cb245673-aa41-4302-ac47-qq000000001
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000001/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000001",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Who is tallest?",
                "answers": [
                    {
                        "value": "mike",
                        "text": "Mike",
                        "correct": false
                    },
                    {
                        "value": "nicki",
                        "text": "Nicki",
                        "correct": true
                    },
                    {
                        "value": "george",
                        "text": "George",
                        "correct": false
                    }
                ],
                "response_correct": "Correct! That's why only he bangs his head on the lamp!",
                "response_incorrect": "Incorrect! You need to open your eyes and see it's Nicki!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 14: get questions for quiz cb245673-aa41-4302-ac47-qq000000002
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000002/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000002",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Who is fittest?",
                "answers": [
                    {
                        "value": "mike",
                        "text": "Mike",
                        "correct": false
                    },
                    {
                        "value": "nicki",
                        "text": "Nicki",
                        "correct": false
                    },
                    {
                        "value": "george",
                        "text": "George",
                        "correct": true
                    }
                ],
                "response_correct": "Correct! He goes to the gym often!",
                "response_incorrect": "Incorrect! You need to open your eyes and see it's George!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 15: get questions for quiz cb245673-aa41-4302-ac47-qq000000003
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000003/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000003",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Who is the boss?",
                "answers": [
                    {
                        "value": "mike",
                        "text": "Mike",
                        "correct": true
                    },
                    {
                        "value": "nicki",
                        "text": "Nicki",
                        "correct": false
                    },
                    {
                        "value": "george",
                        "text": "George",
                        "correct": false
                    }
                ],
                "response_correct": "Correct! That's why he's got the final say!",
                "response_incorrect": "Incorrect! You need to open your eyes and see it's Mike!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 16: get questions for quiz cb245673-aa41-4302-ac47-qq000000004
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000004/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000004",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Which of these are medications used to treat latent TB infection?",
                "answers": [
                    {
                        "value": "ethambutol",
                        "text": "Ethambutol",
                        "correct": false
                    },
                    {
                        "value": "paracetamol",
                        "text": "Paracetamol",
                        "correct": false
                    },
                    {
                        "value": "rifapentine",
                        "text": "Rifapentine",
                        "correct": true
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 17: get questions for quiz cb245673-aa41-4302-ac47-qq000000005
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000005/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000005",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Treatment modification should be made in which of the following cases?",
                "answers": [
                    {
                        "value": "fever",
                        "text": "Fever",
                        "correct": false
                    },
                    {
                        "value": "pregnancy",
                        "text": "Pregnancy",
                        "correct": true
                    },
                    {
                        "value": "diarrhea",
                        "text": "Diarrhea",
                        "correct": false
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 18: get questions for quiz cb245673-aa41-4302-ac47-qq000000006
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000006/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000006",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "TB disease can be treated by taking several drugs for how long?",
                "answers": [
                    {
                        "value": "6_to_9_months",
                        "text": "6 to 9 months",
                        "correct": true
                    },
                    {
                        "value": "1_month",
                        "text": "1 month",
                        "correct": false
                    },
                    {
                        "value": "2_to_3_months",
                        "text": "2 to 3 months",
                        "correct": false
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 19: get questions for quiz cb245673-aa41-4302-ac47-qq000000007
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000007/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000007",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Through what is TB spread?",
                "answers": [
                    {
                        "value": "sharing_toothbrushes",
                        "text": "Sharing toothbrushes",
                        "correct": false
                    },
                    {
                        "value": "kissing",
                        "text": "Kissing",
                        "correct": false
                    },
                    {
                        "value": "air",
                        "text": "Air",
                        "correct": true
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 20: get questions for quiz cb245673-aa41-4302-ac47-qq000000008
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000008/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000008",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Which of these are TB symptoms?",
                "answers": [
                    {
                        "value": "cough_lasting_1_week",
                        "text": "Cough lasting 1 week",
                        "correct": false
                    },
                    {
                        "value": "chest_pain",
                        "text": "Chest pain",
                        "correct": true
                    },
                    {
                        "value": "slow_speech",
                        "text": "Slow speech",
                        "correct": true
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 21: get questions for quiz cb245673-aa41-4302-ac47-qq000000009
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000009/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000009",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "Which of the following is NOT a TB disease risk factor:",
                "answers": [
                    {
                        "value": "was_correctly_treated_for_TB_before",
                        "text": "Was correctly treated for TB before",
                        "correct": true
                    },
                    {
                        "value": "has_HIV_infection",
                        "text": "Has HIV infection",
                        "correct": false
                    },
                    {
                        "value": "has_diabetes",
                        "text": "Has diabetes",
                        "correct": false
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 22: get questions for quiz cb245673-aa41-4302-ac47-qq000000011
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000011/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000011",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "What is not a test used to determine if someone has TB infection?",
                "answers": [
                    {
                        "value": "TB_blood_tests",
                        "text": "TB blood tests",
                        "correct": false
                    },
                    {
                        "value": "tuberculin_skin_test",
                        "text": "Tuberculin skin test",
                        "correct": false
                    },
                    {
                        "value": "cardiovascular_assessment",
                        "text": "Cardiovascular assessment",
                        "correct": true
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 23: get questions for quiz cb245673-aa41-4302-ac47-qq000000012
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000012/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000012",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "What is needed to see whether a person has TB disease?",
                "answers": [
                    {
                        "value": "blood_pressure_test",
                        "text": "Blood pressure test",
                        "correct": false
                    },
                    {
                        "value": "chest_x-ray",
                        "text": "Chest x-ray",
                        "correct": true
                    },
                    {
                        "value": "oral_examination",
                        "text": "Oral examination",
                        "correct": false
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 24: get questions for quiz cb245673-aa41-4302-ac47-qq000000013
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/question/cb245673-aa41-4302-ac47-qq000000013/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-qq000000013",
                "version": 1,
                "question_type": "multiplechoice",
                "question": "What does a TB blood test measure?",
                "answers": [
                    {
                        "value": "how_the_immune_system_reacts_to_TB_bacteria",
                        "text": "How the immune system reacts to TB bacteria",
                        "correct": true
                    },
                    {
                        "value": "the_number_of_TB_causing_parasites_in_the_blood",
                        "text": "The number of TB causing parasites in the blood",
                        "correct": false
                    },
                    {
                        "value": "blood_supply_in_the_body",
                        "text": "Blood supply in the body",
                        "correct": false
                    }
                ],
                "response_correct": "Correct!",
                "response_incorrect": "Incorrect!",
                "created_by": "2",
                "created_at": "2016-05-10T06:13:29.693272Z",
                "updated_by": "2",
                "updated_at": "2016-05-10T06:13:29.693298Z"
            }
        }
    },

    // 25: get identity cb245673-aa41-4302-ac47-00000000111
    {
        "repeatable": true,
        "request": {
            "method": "GET",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000111/",
        },
        "response": {
            "code": 200,
            "data": {
                "id": "cb245673-aa41-4302-ac47-000000000111",
                "version": 1,
                "details": {
                    "addresses": {
                        "msisdn": {
                            "+267820000111": {}
                        }
                    }
                },
                "created_at": "2016-04-05T06:13:29.693272Z",
                "updated_at": "2016-04-05T06:13:29.693298Z"
            }
        }
    },

    // 26: patch identity cb245673-aa41-4302-ac47-00000000111
    {
        "repeatable": true,
        "request": {
            "method": "PATCH",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8001/api/v1/identities/cb245673-aa41-4302-ac47-000000000111/",
            "data":  {
                "id": "cb245673-aa41-4302-ac47-000000000111",
                "version": 1,
                "details": {
                    "addresses": {
                        "msisdn": {
                            "+267820000111": {}
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

    // 27: mark quiz cb245673-aa41-4302-ac47-q0000000111 as completed
    //         for identity cb245673-aa41-4302-ac47-00000000111
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/completed/",
            "data":  {
                "identity": "cb245673-aa41-4302-ac47-000000000111",
                "quiz": "cb245673-aa41-4302-ac47-q00000000111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 28: send sms for identity cb245673-aa41-4302-ac47-00000000111
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8004/api/v1/outbound/",
            "data":  {
                "identity": "cb245673-aa41-4302-ac47-000000000111",
                "content": "Your results from today's quiz: Correct! That's why only he bangs his head on the lamp! Correct! That's why only he bangs his head on the lamp! Correct! He goes to the gym often! Correct! He goes to the gym often! Correct! That's why he's got the final say! Correct! That's why he's got the final say!"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 29: send sms for identity cb245673-aa41-4302-ac47-00000000111
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8004/api/v1/outbound/",
            "data":  {
                "identity": "cb245673-aa41-4302-ac47-000000000111",
                "content": "Your results from today's quiz: Incorrect! You need to open your eyes and see it's Nicki! Incorrect! You need to open your eyes and see it's Nicki! Correct! He goes to the gym often! Correct! He goes to the gym often! Incorrect! You need to open your eyes and see it's Mike! Incorrect! You need to open your eyes and see it's Mike!"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 30: send sms for identity cb245673-aa41-4302-ac47-00000000111
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8004/api/v1/outbound/",
            "data":  {
                "identity": "cb245673-aa41-4302-ac47-000000000111",
                "content": "Your results from today's quiz: Incorrect! You need to open your eyes and see it's Nicki! Incorrect! You need to open your eyes and see it's Nicki! Incorrect! You need to open your eyes and see it's George! Incorrect! You need to open your eyes and see it's George! Correct! That's why he's got the final say! Correct! That's why he's got the final say!"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 31: create tracker for
    // identity cb245673-aa41-4302-ac47-000000000111,
    // quiz cb245673-aa41-4302-ac47-q00000000111
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/tracker/",
            "data":  {
                "identity": "cb245673-aa41-4302-ac47-000000000111",
                "quiz": "cb245673-aa41-4302-ac47-q00000000111"
            }
        },
        "response": {
            "code": 201,
            "data": {
                "tracker_id": "cb245673-aa41-4302-ac47-t00000111111"
            }
        }
    },


    // 32: log answer for question cb245673-aa41-4302-ac47-qq000000001, answered correctly
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/answer/",
            "data":  {
                "question": "cb245673-aa41-4302-ac47-qq000000001",
                "question_text": "Who is tallest?",
                "answer_value": "nicki",
                "answer_text": "Nicki",
                "answer_correct": "True",
                "response_sent": "Correct! That's why only he bangs his head on the lamp!",
                "tracker": "cb245673-aa41-4302-ac47-t00000111111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 33: log answer for question cb245673-aa41-4302-ac47-qq000000001, answered incorrectly
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/answer/",
            "data":  {
                "question": "cb245673-aa41-4302-ac47-qq000000001",
                "question_text": "Who is tallest?",
                "answer_value": "mike",
                "answer_text": "Mike",
                "answer_correct": "False",
                "response_sent": "Incorrect! You need to open your eyes and see it's Nicki!",
                "tracker": "cb245673-aa41-4302-ac47-t00000111111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 34: log answer for question cb245673-aa41-4302-ac47-qq000000002, answered correctly
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/answer/",
            "data":  {
                "question": "cb245673-aa41-4302-ac47-qq000000002",
                "question_text": "Who is fittest?",
                "answer_value": "george",
                "answer_text": "George",
                "answer_correct": "True",
                "response_sent": "Correct! He goes to the gym often!",
                "tracker": "cb245673-aa41-4302-ac47-t00000111111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 35: log answer for question cb245673-aa41-4302-ac47-qq000000002, answered incorrectly
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/answer/",
            "data":  {
                "question": "cb245673-aa41-4302-ac47-qq000000002",
                "question_text": "Who is fittest?",
                "answer_value": "nicki",
                "answer_text": "Nicki",
                "answer_correct": "False",
                "response_sent": "Incorrect! You need to open your eyes and see it's George!",
                "tracker": "cb245673-aa41-4302-ac47-t00000111111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 36: log answer for question cb245673-aa41-4302-ac47-qq000000003, answered correctly
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/answer/",
            "data":  {
                "question": "cb245673-aa41-4302-ac47-qq000000003",
                "question_text": "Who is the boss?",
                "answer_value": "mike",
                "answer_text": "Mike",
                "answer_correct": "True",
                "response_sent": "Correct! That's why he's got the final say!",
                "tracker": "cb245673-aa41-4302-ac47-t00000111111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 37: log answer for question cb245673-aa41-4302-ac47-qq000000003, answered incorrectly
    {
        "request": {
            "method": "POST",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/answer/",
            "data":  {
                "question": "cb245673-aa41-4302-ac47-qq000000003",
                "question_text": "Who is the boss?",
                "answer_value": "nicki",
                "answer_text": "Nicki",
                "answer_correct": "False",
                "response_sent": "Incorrect! You need to open your eyes and see it's Mike!",
                "tracker": "cb245673-aa41-4302-ac47-t00000111111"
            }
        },
        "response": {
            "code": 201,
            "data": {}
        }
    },

    // 38: patch tracker cb245673-aa41-4302-ac47-t00000111111 with completed status
    {
        "request": {
            "method": "PATCH",
            "headers": {
                "Authorization": ["Token test_key"],
                "Content-Type": ["application/json"]
            },
            "url": "http://localhost:8003/api/v1/tracker/cb245673-aa41-4302-ac47-t00000111111/",
            "data":  {
                "complete": "True",
                "completed_at": "2016-04-04T22:00:00.000Z"
            }
        },
        "response": {
            "code": 200,
            "data": {}
        }
    },

];
};
