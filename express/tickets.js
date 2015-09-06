/**
 * Created by cailong on 2015/1/22.
 */

var requesterList = {
    "links": [{
        "rel": "self",
        "href": "http://localhost:8080/api/contacts?page=0&size=20&sort=createdDate,desc"
    }, {"rel": "next", "href": "http://localhost:8080/api/contacts?page=1&size=20&sort=createdDate,desc"}],
    "content": [{
        "id": "ffc35def-ab59-11e4-8546-f3d348449eb3",
        "name": "12",
        "gender": "Unknown",
        "mobile": "12",
        "blocked": false,
        "deleted": false,
        "verified": false,
        "version": 1,
        "links": [{"rel": "self", "href": "http://localhost:8080/api/contacts/ffc35def-ab59-11e4-8546-f3d348449eb3"}]
    }, {
        "id": "a1753807-aad4-11e4-8acf-ff18f6c93d51",
        "name": "iuiu",
        "gender": "Unknown",
        "mobile": "1212",
        "blocked": false,
        "deleted": false,
        "verified": false,
        "version": 1,
        "links": [{"rel": "self", "href": "http://localhost:8080/api/contacts/a1753807-aad4-11e4-8acf-ff18f6c93d51"}]
    }, {
        "id": "518e7a45-aab2-11e4-98bd-c76063a9a4be",
        "name": "新建联系人1",
        "gender": "Unknown",
        "mobile": "123",
        "blocked": false,
        "deleted": false,
        "verified": false,
        "version": 1,
        "links": [{"rel": "self", "href": "http://localhost:8080/api/contacts/518e7a45-aab2-11e4-98bd-c76063a9a4be"}]
    }, {
        "id": "327fec52-9fa2-11e4-9861-910db81ac4d9",
        "corporation": {"id": "6314f1dc-9f7e-11e4-9861-910db81ac4d9", "name": "ss"},
        "name": "张三",
        "gender": "Unknown",
        "mobile": "222",
        "blocked": false,
        "deleted": false,
        "verified": false,
        "version": 1,
        "links": [{
            "rel": "self",
            "href": "http://localhost:8080/api/contacts/327fec52-9fa2-11e4-9861-910db81ac4d9"
        }, {
            "rel": "corporation",
            "href": "http://localhost:8080/api/corporations/6314f1dc-9f7e-11e4-9861-910db81ac4d9"
        }]
    }, {
        "id": "9a213aa1-9fa0-11e4-9861-910db81ac4d9",
        "corporation": {"id": "6314f1dc-9f7e-11e4-9861-910db81ac4d9", "name": "ss"},
        "name": "112312313",
        "gender": "Unknown",
        "mobile": "223",
        "blocked": false,
        "deleted": false,
        "verified": false,
        "version": 1,
        "links": [{
            "rel": "self",
            "href": "http://localhost:8080/api/contacts/9a213aa1-9fa0-11e4-9861-910db81ac4d9"
        }, {
            "rel": "corporation",
            "href": "http://localhost:8080/api/corporations/6314f1dc-9f7e-11e4-9861-910db81ac4d9"
        }]
    }, {
        "id": "9ecca7d0-9f80-11e4-9861-910db81ac4d9",
        "corporation": {"id": "6314f1dc-9f7e-11e4-9861-910db81ac4d9", "name": "ss"},
        "name": "33",
        "gender": "Unknown",
        "mobile": "222",
        "blocked": false,
        "deleted": false,
        "verified": false,
        "version": 1,
        "links": [{
            "rel": "self",
            "href": "http://localhost:8080/api/contacts/9ecca7d0-9f80-11e4-9861-910db81ac4d9"
        }, {
            "rel": "corporation",
            "href": "http://localhost:8080/api/corporations/6314f1dc-9f7e-11e4-9861-910db81ac4d9"
        }]
    }],
    "page": {"size": 20, "totalElements": 47, "totalPages": 3, "number": 0}
};
var requesterList2 = {
    data: [
        {
            name: '客户(请求人)1',
            id: '1'
        },
        {
            name: '客户(请求人)2',
            id: '2'
        },
        {
            name: '客户(请求人)3',
            id: '3'
        }
    ]
};
var ticketsTypeList = {
    data: [
        {
            name: '问题',
            id: '111'
        },
        {
            name: '请求',
            id: '222'
        }
    ]
};
var ticketsStatusList = {
    data: [
        {
            name: '处理中',
            id: '111'
        },
        {
            name: '完成',
            id: '222'
        },
        {
            name: '关闭',
            id: '333'
        }
    ]
};
var ticketsSourceList = {
    data: [
        {
            name: '微信',
            id: '1'
        }, {
            name: '邮件',
            id: '2'
        }, {
            name: '电话',
            id: '3'
        }, {
            name: '短信',
            id: '4'
        }
    ]
};
var ticketsPriorityList = {
    data: [
        {
            name: '低',
            id: '111'
        },
        {
            name: '中',
            id: '222'
        },
        {
            name: '高',
            id: '333'
        },
        {
            name: '严重',
            id: '444'
        }
    ]
};
var ticketsGroupList = {
    data: [
        {
            name: '问答组',
            id: '111'
        },
        {
            name: '管理组',
            id: '222'
        },
        {
            name: '销售组',
            id: '333'
        }
    ]
};
var ticketsSeatList = {
    data: [
        {
            name: '座席1',
            id: '111'
        },
        {
            name: '座席2',
            id: '222'
        },
        {
            name: '座席3',
            id: '333'
        }
    ]
};
var ticketsDuebyList = {
    data: [
        {
            name: 'Out Of Time',
            id: '111'
        },
        {
            name: 'Today',
            id: '222'
        },
        {
            name: 'Tomorrow',
            id: '333'
        },
        {
            name: 'In 8 Hours',
            id: '444'
        }
    ]
};
var ticketsCreateAtList = {
    data: [
        {
            name: '',
            id: '0'
        },
        {
            name: 'All Times',
            id: '1'
        },
        {
            name: 'In 5 Minutes',
            id: '222'
        },
        {
            name: 'In 15 Minutes',
            id: '333'
        },
        {
            name: 'In 30 Minutes',
            id: '4'
        },
        {
            name: 'In 1 Hours',
            id: '5'
        },
        {
            name: 'In 4 Hours',
            id: '6'
        },
        {
            name: 'In 8 Hours',
            id: '7'
        },
        {
            name: 'In 12 Hours',
            id: '8'
        },
        {
            name: 'Todays',
            id: '9'
        }
    ]
};
/*
var id = parseInt(Math.random() * 100);
var oneTicket = {
    id: 'id' + id,
    ticketNumber: parseInt(Math.random() * 100000000),//编号
    name: '工单' + id,
    description: '工单' + id + '描述信息',
    requester: {
        id: id,
        name: '请求人' + id,
        email: 'cailong@unicall.cc'
    },// 请求人(联系人,公司)
    user: {
        id: id,
        name: '创建人' + id
    },//(创建人,登录用户)
    assign: {
        id: id,
        name: '客服/分配人' + id
    },//分配人(客服)
    group: {
        id: id,
        name: '组' + id
    },
    created_at: '2014-' + id_10 + '-' + id_10 + '',
    due_by: '2015-10-10',//到期时间
    status: {
        id: '222',
        name: '处理中'
    },
    priority: {
        id: '1',
        name: '高'
    },
    type: {
        id: '1',
        name: '问题'
    },
    source: {
        id: '1',
        name: '邮箱'
    },//来源,手机,邮箱,微信
    trash: {
        id: '1',
        name: '否'
    },//是否是垃圾
    seat: {
        id: 'id' + id,
        name: '座席' + id
    },
    mergeid: '11111',//合并id
    deleted: false,//是否删除,
    history: {
        data: []
    }
};

for (var i = 0; i < 5; i++) {
    id = parseInt(Math.random() * 100);
    var id_10 = parseInt(Math.random() * 10);
    oneTicket.history.data.push({
        id: 'id' + id,
        ticketNumber: parseInt(Math.random() * 100000000),//编号
        name: '工单' + id,
        description: '工单' + id + '描述信息',
        requester: {
            id: id,
            name: '请求人' + id
        },// 请求人(联系人,公司)
        user: {
            id: id,
            name: '创建人' + id
        },//(创建人,登录用户)
        assign: {
            id: id,
            name: '客服/分配人' + id
        },//分配人(客服)
        group: {
            id: id,
            name: '组' + id
        },
        created_at: '2014-' + id_10 + '-' + id_10 + '',
        due_by: '2015-10-10',//到期时间
        status: {
            id: '1',
            name: '处理中'
        },
        priority: {
            id: '1',
            name: '高'
        },
        type: {
            id: '1',
            name: '问题'
        },
        source: {
            id: '1',
            name: '邮箱'
        },//来源,手机,邮箱,微信
        trash: {
            id: '1',
            name: '否'
        },//是否是垃圾
        mergeid: '11111',//合并id
        deleted: false//是否删除
    });
}
*/
var oneTicket = {
    id: 'bdb58bce-df65-11e4-88fd-2b2ee735a198',
    serialNumber: '187',
    requester: {
        'id': 'a7d1058b-df62-11e4-88fd-2b2ee735a198',
        'serialNumber': '149',
        'email': 'chenli@unicall.cc',
        'name': '陈利',
        'gender': 'Unknown',
        'blocked': false,
        'deleted': false,
        'verified': false
    },
    createdBy: {
        'username': 'agent1@unicall.cc',
        'name': 'agent1@unicall.cc'
    },
    assignee: {
        'id': '5@1.com',
        'username': '5@1.com',
        'name': '你'
    },
    group: {
        id: '2e2ce135-dcd7-11e4-9866-2febe8949655',
        name: '咨询组',
        description: '负责解答用户问题',
        agentList: [
            'agent1@unicall.cc',
            'agent2@unicall.cc',
            'agent3@unicall.cc'
        ]
    },
    createdDate: '2015-04-10T09:41:19.000Z',
    subject: '测试新建工单是否被加载2',
    type: '销售',
    state: 'Opening',
    priority: 60,
    expiredDate: '2015-04-14T03:06:57.319Z',
    spam: false,
    deleted: false,
    merged: false,
    attachments: [],
    statuses: [
        {
            id: '63909522-df68-11e4-88fd-2b2ee735a198',
            createdDate: '2015-04-10T10:00:16.000Z',
            description: '3<br>',
            type: 'Memo',
            visibility: 'AgentOnly'
        },
        {
            id: '6156aab1-df68-11e4-88fd-2b2ee735a198',
            createdDate: '2015-04-10T10:00:13.000Z',
            description: '2',
            type: 'Memo',
            visibility: 'AgentOnly'
        },
        {
            id: '22e60460-df68-11e4-88fd-2b2ee735a198',
            createdDate: '2015-04-10T09:58:28.000Z',
            description: '1',
            type: 'Memo',
            visibility: 'AgentOnly'
        }
    ],
    statusCount: 4,
    size: 3,
    links: [
        {
            rel: 'self',
            href: 'http://math.linkdesk.com/api/tickets/bdb58bce-df65-11e4-88fd-2b2ee735a198'
        },
        {
            rel: 'timeline',
            href: 'http://math.linkdesk.com/api/tickets/bdb58bce-df65-11e4-88fd-2b2ee735a198'
        }
    ]
}
var ticketsList = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: 0,
        size: 20,
        totalElements: 50,
        totalPages: 3
    }
};

var ticketsListNull = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: 0,
        size: 20,
        totalElements: 50,
        totalPages: 3
    }
};

for (var i = 0; i < 10; i++) {
    var id = parseInt(Math.random() * 100);
    var id_10 = parseInt(Math.random() * 10);
    var d = parseInt(Math.random() * 12) + 1;
    ticketsList.content.push({
        id: 'id' + id,
        serialNumber: parseInt(Math.random() * 100000000),//编号
        subject: '工单' + id,
        description: '工单' + id + '描述信息',
        requester: {
            id: id,
            name: '请求人' + id
        },// 请求人(联系人,公司)
        user: {
            id: id,
            name: '创建人' + id
        },//(创建人,登录用户)
        assignee: {
            id: id,
            name: '客服/分配人' + id
        },//分配人(客服)
        group: {
            id: id,
            name: '组' + id
        },
        createdDate: '2014-' + d + '-' + d + '',
        due_by: '2015-10-10',//到期时间
        state: 'Resolved',
        priority: 20,
        type: 'Problem',
        source: {
            id: '1',
            name: '邮箱'
        },//来源,手机,邮箱,微信
        spam: false,//是否是垃圾
        mergeid: '11111',//合并id
        deleted: false//是否删除
    });
}

var qucikqueryList = {data: []};

qucikqueryList.data.push({
    id: '5',
    name: '回收站',
    url: '#',
    type: 1
});
qucikqueryList.data.push({
    id: '1',
    name: '新 & 处理中的工单',
    url: '#',
    type: 1
});
qucikqueryList.data.push({
    id: '2',
    name: '所有工单',
    url: '#',
    type: 1
});
qucikqueryList.data.push({
    id: '3',
    name: '回收站',
    url: '#',
    type: 1
});
qucikqueryList.data.push({
    id: '4',
    name: '垃圾邮件',
    url: '#',
    type: 1
});
qucikqueryList.data.push({
    id: '6',
    name: 'My Open And Pending Tickets',
    url: '#',
    type: 0
});
qucikqueryList.data.push({
    id: '7',
    name: 'My Overdu Tickets',
    url: '#',
    type: 0
});

var qucikqueryFilter = {
    id: '6',
    name: 'My Open And Pending Tickets',
    url: '#',
    type: 0,
    filter: {
        seat: [{
            id: '111',
            name: '客服1'
        }, {
            id: '222',
            name: '客服2'
        }],
        group: [{
            name: '问答组',
            id: '111'
        },
        {
            name: '管理组',
            id: '222'
        },
        {
            name: '销售组',
            id: '333'
        }],
        createAt: [{
            id: '1',
            name: 'All Times'
        }],
        dueBy: [{
            id: '1',
            name: 'Today'
        }, {
            id: '2',
            name: 'All Time'
        }],
        status: [{
            id: '1',
            name: '处理中'
        }, {
            id: '2',
            name: '关bi'
        }],
        priority: [{
            id: '1',
            name: '高'
        }, {
            id: '2',
            name: '低'
        }],
        type: [{
            id: '1',
            name: '请求'
        }, {
            id: '2',
            name: '问题'
        }],
        source: [{
            id: '1',
            name: '邮件'
        }, {
            id: '2',
            name: '微信'
        }],
        customer: [{
            id: '1',
            name: '张三'
        }, {
            id: '2',
            name: '李四'
        }],
        requester: [{
            id: '1',
            name: '王五'
        }, {
            id: '2',
            name: '找刘'
        }]
    }
}

var historyList = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: 0,
        size: 12,
        totalElements: 10,
        totalPages: 3
    }
}

for (var i = 0; i < 3; i++) {
    var ii = parseInt(Math.random() * 100);
    historyList.content.push({
        id: 'id' + ii,
        name: 'name' + ii,
        mome: '改变了状态' + i,
        time: '2015-01-01',
        user: {
            id: 'id' + ii,
            name: 'user' + ii
        }
    });
}

module.exports = {
    getTicketFilterDomain: function(req, res) {
        res.send({
            "ticketState": [{
                "agentDisplay": "Opened",
                "customerDisplay": "Opened"
            }, {
                "agentDisplay": "Resolved",
                "customerDisplay": "Resolved"
            }, {
                "agentDisplay": "Pending",
                "customerDisplay": "Pending"
            }, {
                "agentDisplay": "Closed",
                "customerDisplay": "Closed"
            }],
            "type": ["Question", "Incident", "Problem", "Feature Request", "Lead"]
        });
    },
    getRequesterList: function (req, res) {
        console.log('get requester!');
        res.send(requesterList2);
    },
    getTicketsTypeList: function (req, res) {
        console.log('getTicketsTypeList!');
        res.send(ticketsTypeList);
    },
    getTicketsStatusList: function (req, res) {
        console.log('getTicketsStatusList!');
        res.send(ticketsStatusList);
    },
    getTicketsSourceList: function (req, res) {
        console.log('getTicketsSourceList!');
        res.send(ticketsSourceList);
    },
    getTicketsPriorityList: function (req, res) {
        console.log('getTicketsPriorityList!');
        res.send(ticketsPriorityList);
    },
    getTicketsGroupList: function (req, res) {
        console.log('getTicketsGroupList!');
        res.send(ticketsGroupList);
    },
    getTicketsSeatList: function (req, res) {
        console.log('getTicketsSeatList!');
        res.send(ticketsSeatList);
    },
    addTicket: function (req, res) {
        console.log('add ticket!');
        res.send(oneTicket);
    },
    getTicketsList: function (req, res) {
        console.log('get tickets list');
        res.send(ticketsList);
    },
    getTicketsCreateAtList: function (req, res) {
        console.log('getTicketsCreateAtList!');
        res.send(ticketsCreateAtList);
    },
    getTicketsDuebyList: function (req, res) {
        console.log('getTicketsDuebyList!');
        res.send(ticketsDuebyList);
    },
    getQucikqueryList: function (req, res) {
        console.log('getTicketsDuebyList!');
        res.send(qucikqueryList);
    },
    addQucikquery: function (req, res) {
        console.log('addQucikquery!');
        res.send(qucikqueryList);
    },
    updateQucikquery: function (req, res) {
        console.log('updateQucikquery!');
        res.send(qucikqueryList);
    },
    deleteQucikquery: function (req, res) {
        console.log('deleteQucikquery!');
        res.send(qucikqueryList);
    },
    getOneTicket: function (req, res) {
        console.log('getOneTicket!');
        res.send(oneTicket);
    },
    getQucikqueryFilter: function (req, res) {
        console.log('getQucikqueryFilter');
        res.send(qucikqueryFilter);
    },
    getHistoryList: function (req, res) {
        console.log('getHistoryList!');
        res.send(historyList);
    }
};
