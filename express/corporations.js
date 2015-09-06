/**
 * Created by lnye on 2014/12/30.
 */
var corporations = [
    'Beijing Unicall Technology Co.Ltd,',
    'Unicall Mobile',
    'Unicall Enterprise',
    'Unicall Network'
];

var len = 50;
var all = {
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
var allNon = {
    content: [],
    links: [{
        href: 'http://localhost/corporations{?page,size,sort}',
        ref: 'self'
    }],
    page: {
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0
    }
};
for (var i = 1; i <= len; i++) {
    all.content.push({
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

module.exports = {
    getCorporations: function(req, res) {
        console.log('get corporations! url is --> '+req.url);
        res.send(all);
    },
    addCorporations: function(req, res){
        console.log('add corporation!');
        res.send(one);
    },
    getCorporationInfo: function(req, res){
        console.log('get corporation info');
        res.send(one);
    },
    updateCorporations: function(req, res){
        console.log('update corporation!!');
        res.send(one);
    },
    deleteCorporations: function(req, res){
        console.log('delete corporation!! url is --> '+req.url);
        console.log('delete corporation!! query is --> '+JSON.stringify(req.query));
        console.log('delete corporation!! body is --> '+req.body);
        console.log('delete corporation!! params is --> '+JSON.stringify(req.params));
        //console.log('req is --> '+ JSON.stringify(JSON.parse(req)));
        res.send(one);
    }
};
