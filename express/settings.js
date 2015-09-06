var len = 5;
var allGroup = {
    content: [],
    links: [{
        href: 'http://localhost/settings/group{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: 0,
        size: 10,
        totalElements: 50,
        totalPages: 3
    }
};
for (var i = 1; i <= len; i++) {
    allGroup.content.push({
        id: i + '',
        name: '组' + i,
        description: '优创客服',
        agentList: ['service2@unicall.cc','service3@unicall.cc'],
        ticketTimeout: '1',
        timeoutMailTo: 'service2@unicall.cc'
    });
}
var oneGroup = {
    id: '1000',
    name: '开发组1',
    description: '公司描述信息:位于北京市',
    agentList: ['service2@unicall.cc','service3@unicall.cc'],
    ticketTimeout: '1',
    timeoutMailTo: 'service2@unicall.cc'
};

var agentList = [
    {
        username: 'service1@unicall.cc',
        name: '客服1',
        id: '1',
        mobile:'13899999991',
        telephone:'010-86788981',
        status:'上一次登录是在about 1 month前。',
        position:'QA'
    },
    {
        username: 'service2@unicall.cc',
        name: '客服2',
        id: '2',
        mobile:'13899999992',
        telephone:'010-86788982',
        status:'上一次登录是在about 1 hour前。',
        position:'QA'

    },
    {
        username: 'service3@unicall.cc',
        name: '客服3',
        id: '3',
        mobile:'13899999993',
        telephone:'010-86788983',
        status:'未登录过',
        position:'Test'
    }
];
var agentListWithAdmin = [
   {
        email: 'service1@unicall.cc',
        name: '客服1',
        id: '1',
        mobile:'13899999991',
        telephone:'010-86788981',
        status:'上一次登录是在about 1 month前。',
        position:'QA'
    },
    {
        email: 'service2@unicall.cc',
        name: '客服2',
        id: '2',
        mobile:'13899999992',
        telephone:'010-86788982',
        status:'上一次登录是在about 1 hour前。',
        position:'QA'

    },
    {
        email: 'service3@unicall.cc',
        name: '客服3',
        id: '3',
        mobile:'13899999993',
        telephone:'010-86788983',
        status:'未登录过',
        position:'Test'
    }
];
var oneAgent = {
    id: '1',
    name: '客服1',
    username: 'service2@unicall.cc',
    mobile: '13899999991',
    telephone: '010-87678901',
    description: '备注',
    position:'QA',
    password:'666666',
    confirmPassword:'666666'
};
var agentTicketsList = [
   {
        id: '1',
        name: '工单1',
        description: '工单1描述信息',
		created_at: '2014-12-11',
		status: '等待回复'
    },
    {
        id: '2',
        name: '工单2',
        description: '工单2描述信息',
		created_at: '2014-12-12',
		status: '等待回复'

    },
    {
        id: '3',
        name: '工单3',
        description: '工单3描述信息',
		created_at: '2014-12-13',
		status: '处理中'
    }
];
var allAgent = {
    content: [],
    links: [{
        href: 'http://localhost/settings/agents{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: 0,
        size: 5,
        totalElements: 20,
        totalPages: 3
    }
};
for (var i = 1; i <= len; i++) {
    allAgent.content.push({
        id: i + '',
        name: '客服' + i,
        mobile: '13900000000',
        username: 'service'+i+'@unicall.cc'
    });
}
module.exports = {
    general: function(req, res) {
        return res.send({
            title: 'Beijing Linkage Technology Co.,Ltd'
        });
    },
    //group begin
    getGroup: function(req, res) {
        console.log('get group! url is --> '+req.url);
        res.send(allGroup);
    },
    addGroup: function(req, res){
        console.log('add group!');
        res.send(oneGroup);
    },
    getGroupInfo: function(req, res){
        console.log('get group info');
        res.send(oneGroup);
    },
    updateGroup: function(req, res){
        console.log('update group!!');
        res.send(oneGroup);
    },
    deleteGroup: function(req, res){
        console.log('delete group!! url is --> '+req.url);
        console.log('delete group!! query is --> '+JSON.stringify(req.query));
        console.log('delete group!! body is --> '+req.body);
        console.log('delete group!! params is --> '+JSON.stringify(req.params));
        //console.log('req is --> '+ JSON.stringify(JSON.parse(req)));
        res.send(oneGroup);
    },
    getAgent: function(req, res){
        console.log('get agent! url is --> '+req.url);
        res.send(allAgent);
    },
    getAgent2: function(req, res){
        res.send(agentListWithAdmin);
    },
    getAgentInfo: function(req, res){
        console.log('get agent info');
        res.send(oneAgent);
    },
    updateAgent: function(req, res){
        console.log("update agent!");
        res.send(agentList);
    },
    addAgent: function(req, res){
        console.log("add agent!");
        res.send(agentList);
    },
    agentTickets:function(req, res){
        console.log("get agent tickets!");
        res.send(agentTicketsList);
    },
    deleteAgent:function(req, res){
        console.log('delete agent!! url is --> '+req.url);
        res.send(oneAgent);
    },
}