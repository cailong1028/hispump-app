var customers = [{
    id: '1',
    displayName: 'Zhao Jin',
    email: 'zhaoj@unicall.cc'
}, {
    id: '2',
    displayName: 'Beijing Linkage',
    home: 'http://www.unicall.cc'
}]
module.exports = {
    customers: function(req, res) {
        return res.send(customers);
    }
};
