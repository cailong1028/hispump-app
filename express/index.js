var express = require('express');
var path = require('path');
var app = express();
app.disable('etag');
var ActiveModule = require('./active');
var Customers = require('./customers');
var Contacts  = require('./contacts');
var Corporations = require('./corporations');
var Settings = require('./settings');
var tickets = require('./tickets');

var groups = require('./groups');
var profile = require('./profile');
//全文检索
var Search = require('./search');
var AgentHome = require('./agenthome');

var upload = require('./upload');

//客服报表

var Statistics = require('./statistics');

app.get('/api/sites', function(req, res){
    return res.send({'title':'Company Name'});
});
app.get('/api/profile', function(req, res) {
    return res.send({
        'id': '1',
        'username': 'agent1@unicall.cc',
        'name': 'agent 1',
        'mobile': '12345678901234567890',
        'roles' : ['Administrator', 'Agents'],
        'permissions': [
            'navbar:*',
            'contacts:*',
            'corporations:*',
            'tickets:*',
            'general:*',
            'groups:*',
            'agents:*'
        ],
        'links': [{
            'rel': 'self',
            'href': 'http://math.linkdesk.com/api/profile'
        }]
    });
});
app.get('/api/general', function(req, res) {
    return res.send({'title':'公司'});
});
app.get('/api/active', ActiveModule.active);
app.get('/api/customers', Customers.customers);

app.get('/api/contacts', Contacts.getContacts);
app.get('/api/contacts/suggest', Contacts.getContacts);
app.post('/api/contacts', Contacts.addContacts);
app.put('/api/contacts/*/verify', Contacts.sendVerifyEmail);
app.get('/api/contacts/*', Contacts.getContactsInfo);
app.put('/api/contacts/*', Contacts.updateContacts);
app.delete('/api/contacts/*', Contacts.deleteContacts);


app.get('/api/corporations', Corporations.getCorporations);
app.post('/api/corporations', Corporations.addCorporations);
app.get('/api/corporations/*', Corporations.getCorporationInfo);
app.put('/api/corporations/*', Corporations.updateCorporations);
app.delete('/api/corporations/*', Corporations.deleteCorporations);

app.get('/api/general', Settings.general);
app.put('/api/general', Settings.general);
app.get('/api/tickets/getRequesterList', tickets.getRequesterList);
app.get('/api/tickets/getTicketsTypeList', tickets.getTicketsTypeList);
app.get('/api/tickets/getTicketsStatusList', tickets.getTicketsStatusList);
app.get('/api/tickets/getTicketsPriorityList', tickets.getTicketsPriorityList);
app.get('/api/tickets/getTicketsGroupList', tickets.getTicketsGroupList);
app.get('/api/tickets/getTicketsSeatList', tickets.getTicketsSeatList);
app.get('/api/tickets/getTicketsSourceList', tickets.getTicketsSourceList);
app.get('/api/tickets/getTicketsCreateAtList', tickets.getTicketsCreateAtList);
app.get('/api/tickets/getTicketsDuebyList', tickets.getTicketsDuebyList);

app.get('/api/tickets/qucikquery', tickets.getQucikqueryList);
app.get('/api/tickets/qucikquery/*', tickets.getQucikqueryFilter);
app.post('/api/tickets/qucikquery', tickets.addQucikquery);
app.put('/api/tickets/qucikquery/*', tickets.updateQucikquery);
app.delete('/api/tickets/qucikquery/*', tickets.deleteQucikquery);
app.get('/api/tickets/ticketdomain', tickets.getTicketFilterDomain);

app.get('/api/tickets/history', tickets.getHistoryList);

//首页
app.get('/api/tickets/total',AgentHome.getTotal);
app.get('/api/tickets/activities',AgentHome.getActivities);
//客户信息下工单历史
app.get('/api/tickets/filter*', tickets.getTicketsList);

app.post('/api/tickets', tickets.addTicket);
app.get('/api/tickets', tickets.getTicketsList);
app.get('/api/tickets/*', tickets.getOneTicket);
app.put('/api/tickets/*', tickets.getOneTicket);


app.get('/api/groups', groups.getGroups);
app.get('/api/groups/*/members', groups.getGroupMembers);

app.get('/api/group', Settings.getGroup);
app.post('/api/group', Settings.addGroup);
app.get('/api/agents', Settings.getAgent);
app.get('/api/agents/*', Settings.getAgentInfo);
app.put('/api/agents/*', Settings.updateAgent);
app.post('/api/agents', Settings.addAgent);
app.delete('/api/agents/*',Settings.deleteAgent)
//app.get('/api/agent2', Settings.getAgent2);//客服列表，包含系统管理员
app.get('/api/groups/*', Settings.getGroupInfo);
app.put('/api/groups/*', Settings.updateGroup);
app.delete('/api/groups/*', Settings.deleteGroup);

app.get('/api/agentTickets', Settings.agentTickets);
//全文检索
//检索客户
app.get('/api/search/contacts',Search.getContacts);
//检索公司
app.get('/api/search/corporations',Search.getCorporations);
//检索工单
app.get('/api/search/tickets',Search.getTickets);
//检索全部
app.get('/api/search/all',Search.getAll);

app.get('/api/contacts', Contacts.getContacts);

app.get('/api/profile',profile.getProfile);
app.post('/api/profile',profile.getProfile);
app.post('/api/profile/change-password',profile.getProfile);

app.get('/api/statistics/agentreports/*',Statistics.getAgentReports);
app.post('/api/profile/reset-password',profile.getProfile);
app.post('/api/agents/1/reset-password',profile.getProfile);

app.get('/api/images/presign', upload.presignImage);
app.get('/api/attachments/presign', upload.presignAttachment);
module.exports = app;
