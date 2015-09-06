/*
* @Author: chongzhen
* @Date:   2015-03-19 16:10:05
* @Last Modified by:   chongzhen
* @Last Modified time: 2015-03-26 14:44:12
*/
var HomeDomain = {
    expiredNum: 0,
    todayExpiredNum: 0,
    openedNum: 1,
    pendingNum: 0,
    unassignedNum: 0
};

var HomeDomainTicket = {
    links: [{
        rel: 'self',
        href: 'http://localhost:8080/api/home/tickets{?page,size,sort}'
    }],
    content: [],
    page: {
        size: 10,
        totalElements: 1,
        totalPages: 3,
        number: 0
    }
};

for (var i = 1; i <= 1; i++) {
    HomeDomainTicket.content.push({
        id: '98984599-ce02-11e4-b454-e7a61c4be269' + i,
        serialNumber: '2014001200212220000',
        activityTime: '2015-03-19T06:38:47.335Z',
        subject: '测试' + parseInt(Math.random()*100),
        type: 'Question',
        agent: {
            id: '90098-v4-11re2-aabcd12345',
            name: 'agent name'
        },
        links: [{
            rel: 'self',
            href: 'http://localhost:8080/api/tickets/98984599-ce02-11e4-b454-e7a61c4be269'
        }, {
            rel: 'timeline',
            href: 'http://localhost:8080/api/tickets/98984599-ce02-11e4-b454-e7a61c4be269'
        }]
    });
}


var HomeDomainTicketNon = {
    links: [{
        rel: 'self',
        href: 'http://localhost:8080/api/home/tickets{?page,size,sort}'
    }],
    content: [],
    page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        number: 0
    }
};
module.exports = {
    getTotal: function(req, res) {
        console.log('get agent getHome !!');
        // res.send(contactall);
        res.send(HomeDomain);
    },
    getActivities: function(req, res) {
        console.log('get agent getTickets !!');
        // res.send(contactall);
        res.send(HomeDomainTicket);
    },
};