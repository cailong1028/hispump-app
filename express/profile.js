var oneProfile = {
    id: '1',
    name: '客服1',
    username: 'service2@unicall.cc',
    mobile: '13899999991',
    telephone: '010-87678901',
    description: '备注',
    position:'QA'
};
module.exports = {
    general: function(req, res) {
        return res.send({
            title: 'Beijing Linkage Technology Co.,Ltd'
        });
    },
    getProfile: function(req, res) {
        console.log('get getProfile !!');
        res.send(oneProfile);
    }
}