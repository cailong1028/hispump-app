/**
 * Created by cailong on 2015/1/22.
 */

var groups = [
    {
        name: '海泰方圆项目研发部',
        id: '1'
    }, {
        name: '海泰方圆软件开发部门',
        id: '2'
    }, {
        title: '海泰方圆人事行政部',
        id: '3'
    }
];
module.exports = {
    getGroups: function (req, res) {
        console.log('get groups!');
        res.send(groups);
    },
    getGroupMembers: function(req, res) {
        res.send([{
            id: 'agent1@unicall.cc',
            name: 'Agent 1'
        }, {
            id: 'agent2@unicall.cc',
            name: 'Agent 2'
        }, {
            id: 'agent3@unicall.cc',
            name: 'Agent 3'
        }])
    }
};
