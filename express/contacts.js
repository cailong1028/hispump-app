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
]
var all = {
    content: [],
    links: [
        {
            href: "http://localhost/contacts{?page,size,sort}",
            rel: "self"
        }
    ],
    page: {
        number: 0,
        size: 20,
        totalElements: 24,
        totalPages: 52
    }

};
for (var i = 1; i <= 50; i++) {
    all.content.push({
        id: i + '',
        name: 'Usersrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr ' + i,
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
    name: 'Mark Ice',
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
module.exports = {
    getContacts: function(req, res) {
        console.log('get contacts !!');
        res.send(all);
    },
    addContacts: function(req, res) {
        console.log('add one contact!');
        res.send(contactsInfo);
    },
    getContactsInfo: function(req, res) {
        console.log('get one contact info!');
        var url = req.originalUrl;
        res.send(contactsInfo);
    },
    updateContacts: function(req, res) {
        res.send(contactsInfo);
    },
    deleteContacts: function(req, res) {
        res.send(contactsInfo);
    },
    sendVerifyEmail: function(req, res) {
        res.send("send ok");
    }
};
