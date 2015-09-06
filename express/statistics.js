var getAgentReportsList = [
    {
        agentName: 'agent1',
        createdTicketsNum: '10',
        openedTicketsNum: '2',
        pendingTicketsNum: '1',
        resolvedTicketsNum:'5',
        closedTicketsNum:'2'
    },
    {
        agentName: 'agent2',
        createdTicketsNum: '0',
        openedTicketsNum: '0',
        pendingTicketsNum: '0',
        resolvedTicketsNum:'0',
        closedTicketsNum:'0'

    },
    {
        agentName: 'agent3',
        createdTicketsNum: '12',
        openedTicketsNum: '2',
        pendingTicketsNum: '1',
        resolvedTicketsNum:'5',
        closedTicketsNum:'3'
    }
];
module.exports = {
	general: function(req, res) {
        return res.send({
            title: 'Beijing Linkage Technology Co.,Ltd'
        });
    },
    getAgentReports: function(req, res) {
        console.log('get getAgentReports !!');
        res.send(getAgentReportsList);
    }
};


