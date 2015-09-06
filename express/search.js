/*
* @Author: chongzhen
* @Date:   2015-03-06 13:51:38
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-04-03 14:10:04
*/

var corporations = [
    'Beijing Unicall Technology Co.Ltd,',
    'Unicall Mobile',
    'Unicall Enterprise',
    'Unicall Network'
];
var titles = [
    'Developer',
    'Manager',
    '总监',
    '管理员'
];
//数据量
var len = 50;
var number = 0;
var size = 0;
var totalElements = 30;
var totalPages = 11;
//联系人
var contactall = {
    content: [],
    links: [
        {
            href: "http://localhost/contacts{?page,size,sort}",
            rel: "self"
        }
    ],
    page: {
        number: number,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
    }

};
for (var i = 1; i <= len; i++) {
    contactall.content.push({
        id: i + '',
        name: '<b>Users</b> ' + i,
        corporation: {
            name: corporations[i * 11 % 4]
        },
        email: 'user' + i + '@test.com',
        title: titles[i * 33 % 4],
        mobile: '(+86)13789456123',
        verified: i * 21 % 2 == 0,
        deleted: i%2 === 0
    });
}
var contactsInfo = {
    id: '13123123123123123123',
    name: 'Mark <em>Ice</em>',
    corporation: {
        name: corporations[11 % 4]
    },
    email: 'imak.ice@test.com',
    title: titles[33 % 4],
    mobile: '(+86)13789456123',
    telephone: '(+86)010-2122222',
    gender: 'Male',
    address1: 'Haidian District XueQingLu Rd. ',
    address2: 'Beijing China',
    verified: false,
    birthday: '1968-07-08',
    nickname: 'iMak'
};

//公司

var corporationall = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: number,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
    }
};
for (var i = 1; i <= len; i++) {
    corporationall.content.push({
        id: i + '',
        name: 'Corps_' + corporations[i%4],
        memo: '公司备注信息,此公司为世界500强',
        description: '公司描述信息:位于北京市',
        domain: '@unicall.cc',
        contacts: parseInt(Math.random()*100)
    });
}

var one = {
    id: '22222',
    name: 'Unicall corp 2014-2015',
    memo: '公司备注信息,此公司为世界500强',
    description: '公司描述信息:位于北京市',
    domain: '@unicall.cc',
    contacts: parseInt(Math.random()*100)
};

//工单
var ticketsList = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: number,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
    }
};

for (var i = 0; i < 10; i++) {
    var id = parseInt(Math.random() * 100);
    var id_10 = parseInt(Math.random() * 10);
    ticketsList.content.push({
        id: 'id' + id,
        serialNumber: parseInt(Math.random() * 100000000),//编号
        subject: '工单' + id,
        description: '工单' + id + '中文的粗体： 中文的斜体： 中文的下划线： 中文彩色： LI 内容： 节点1 节点2 节点3 超链接：百度 描述中会添加大量的内容，并增加对应的格式。 以此确认当存入全文检索引擎之后，产生的数据是否是有效的，同时进行了怎样的展示： 这里是英文的内容 没有任何的格式： Jsoup is nice, but I encountered some drawbacks with it. 这里是英文的内容 带有格式话的html：内容加长加长，此处省略10万字',
        requester: {
            id: id,
            name: '请求人' + id
        },// 请求人(联系人,公司)
        createdBy: {
            id: 'f4a5bf2c-d8e9',
            username: 'daliu',
            name: '大刘'
        },//(创建人,登录用户)
        assignee: {
            id: id,
            name: '客服/分配人' + id
        },//分配人(客服)
        createdDate: '2015-04-02T03:40:07.060Z',
        expiredDate: '2015-10-10',//到期时间
        state: 'Opened',
        status: [{
            id: '596d46695a5445774f47497a597a55305a6a55784d6a497a596d466c4d7a686a5a6a55774f546b345a44413d',
            statusId: 'da257f94-d902-11e4-9b99-1bb54629e78e',
            description: '这是个什么<b>货</b>',
            createdDate: '2015-04-02T03:40:07.060Z',
            createdBy: {
                id: 'f4a5bf2c-d8e9-11e4-84d',
                username: 'jinZhongLiang',
                name: '金忠亮'
            }},{
            id: '596d46695a5445774f47497a59',
            statusId: 'da257f94-d902-11e4-9b99-1bb54629e78e',
            description: '这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>这是个什么<b>货</b>',
            createdDate: '2015-04-02T03:40:07.060Z',
            createdBy: {
                id: 'f4a5bf2c-d8e9-11e4-84d',
                username: 'jinZhongLiang',
                name: '金忠亮'
            }
        }],
        priority: 80,
        mergeid: false,
        deleted: false//是否删除
    });
}
//全部查询
var allList = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: number,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
    }
};

for (var i = 1; i <= 2; i++) {
    //插入联系人数据
    allList.content.push({
        id: i + '',
        contactId: i + '',//查询后属性特有的业务id
        name: 'Users ' + i,
        corporation: {
            name: corporations[i * 11 % 4]
        },
        email: 'user' + i + '@test.com',
        title: titles[i * 33 % 4],
        mobile: '(+86)13789456123',
        verified: i * 21 % 2 == 0,
        deleted: i%2 === 0
    });
    //推入公司数据
    allList.content.push({
        id: i + 'corporation',
        corporationId: i + 'corporation',//查询后属性特有的业务id
        name: 'Corps_' + corporations[i%4],
        memo: '公司备注信息,此公司为世界500强',
        description: '公司描述信息:位于北京市',
        domain: '@unicall.cc',
        contacts: parseInt(Math.random()*100)
    });
    //推入工单数据
    var id = parseInt(Math.random() * 100);
    var id_10 = parseInt(Math.random() * 10);
    allList.content.push({
        id: 'id' + id + i,
        ticketId: 'id' + id + i,
        serialNumber: parseInt(Math.random() * 100000000),//编号
        subject: '工单' + id,
        description: '工单' + id + '中文的粗体： 中文的斜体： 中文的下划线： 中文彩色： LI 内容： 节点1 节点2 节点3 超链接：百度 描述中会添加大量的内容，并增加对应的格式。 以此确认当存入全文检索引擎之后，产生的数据是否是有效的，同时进行了怎样的展示： 这里是英文的内容 没有任何的格式： Jsoup is nice, but I encountered some drawbacks with it. 这里是英文的内容 带有格式话的html：内容加长加长，此处省略10万字',
        requester: {
            id: id,
            name: '请求人' + id
        },// 请求人(联系人,公司)
        createdBy: {
            id: 'f4a5bf2c-d8e9',
            username: 'daliu',
            name: '大刘'
        },//(创建人,登录用户)
        assignee: {
            id: id,
            name: '客服/分配人' + id
        },//分配人(客服)
        createdDate: '2015-04-02T03:40:07.060Z',
        expiredDate: '2015-10-10',//到期时间
        state: 'Opened',
        status: [{
            id: '596d46695a5445774f47497a597a55305a6a55784d6a497a596d466c4d7a686a5a6a55774f546b345a44413d',
            statusId: 'da257f94-d902-11e4-9b99-1bb54629e78e',
            description: '这是个什么<b>货</b>',
            createdDate: '2015-04-02T03:40:07.060Z',
            createdBy: {
                id: 'f4a5bf2c-d8e9-11e4-84d',
                username: 'jinZhongLiang',
                name: '金忠亮'
            }
        }],
        priority: 80,
        mergeid: false,
        deleted: false//是否删除
    });
}

//空数据
var nullList = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: number,
        size: size,
        totalElements: totalElements,
        totalPages: totalPages
    }
};
module.exports = {
    getContacts: function(req, res) {
        console.log('get search contacts !!');
        // res.send(contactall);
        res.send(contactall);
    },
    getCorporations: function(req, res) {
        console.log('get search corporations !!');
        res.send(corporationall);
    },
    getTickets: function(req, res) {
        console.log('get search tickets !!');
        res.send(ticketsList);
    },
    getAll: function(req, res) {
        console.log('get search all !!');
        res.send(allList);
    },

};
