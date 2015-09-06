var presignImage = function(req, res) {
    res.send({
        "action": "http://localhost:9000/image/upload",
        "uri": "aws-s3:cn-north-1:uimg:__TEMP__/math.linkdesk.com-eyJleHBpcmF0aW9uIjoiMjAxNS0wNi0.tmp",
        "formData": {
            "Policy": "eyJleHBpcmF0aW9uIjoiMjAxNS0wNi0yM1QwNTozNzoyMS45NDJaIiwiY29uZGl0aW9ucyI6W3siYWNsIjoicHVibGljLXJlYWQifSx7ImJ1Y2tldCI6InVpbWcifSx7ImtleSI6Il9fVEVNUF9fL3QtY2wwMS55dW5rZWZ1LmNvbS1sb2dvLnRtcCJ9LFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiaW1hZ2UvIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSw1MjQyODhdLHsieC1hbXotZGF0ZSI6IjIwMTUwNjIzVDA1MjIyMVoifSx7IlgtQW16LUNyZWRlbnRpYWwiOiJBS0lBT0taWllYQUNEUElLS0c2QS8yMDE1MDYyMy9jbi1ub3J0aC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9XX0=",
            "X-Amz-Signature": "199543869c682fbc10f2e3e3799d46f26fcdb1a882a7fb01abd81521c1475512",
            "X-Amz-Credential": "AKIAOKZZYXACDPIKKG6A/20150623/cn-north-1/s3/aws4_request",
            "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
            "x-amz-date": "20150623T052221Z",
            "acl": "public-read",
            "key": "__TEMP__/math.linkdesk.com-eyJleHBpcmF0aW9uIjoiMjAxNS0wNi0.tmp",
            "Content-Type": "image/png"
        }
    });
};
var presignAttachment = function(req, res) {
    res.send({
        "action": "http://localhost:9000/attachment/upload",
        "uri": "aws-s3:cn-north-1:uimg:__TEMP__/math.linkdesk.com-f2e3e3799d46f26fcdb1a882a7fb01abd81521c1475512.tmp",
        "formData": {
            "Policy": "eyJleHBpcmF0aW9uIjoiMjAxNS0wNi0yM1QwNTozNzoyMS45NDJaIiwiY29uZGl0aW9ucyI6W3siYWNsIjoicHVibGljLXJlYWQifSx7ImJ1Y2tldCI6InVpbWcifSx7ImtleSI6Il9fVEVNUF9fL3QtY2wwMS55dW5rZWZ1LmNvbS1sb2dvLnRtcCJ9LFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiaW1hZ2UvIl0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSw1MjQyODhdLHsieC1hbXotZGF0ZSI6IjIwMTUwNjIzVDA1MjIyMVoifSx7IlgtQW16LUNyZWRlbnRpYWwiOiJBS0lBT0taWllYQUNEUElLS0c2QS8yMDE1MDYyMy9jbi1ub3J0aC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsiWC1BbXotQWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9XX0=",
            "X-Amz-Signature": "199543869c682fbc10f2e3e3799d46f26fcdb1a882a7fb01abd81521c1475512",
            "X-Amz-Credential": "AKIAOKZZYXACDPIKKG6A/20150623/cn-north-1/s3/aws4_request",
            "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
            "x-amz-date": "20150623T052221Z",
            "acl": "public-read",
            "key": "__TEMP__/math.linkdesk.com-f2e3e3799d46f26fcdb1a882a7fb01abd81521c1475512.tmp",
            "Content-Type": "plain/text"
        }
    });
};
module.exports = {
    presignAttachment: presignAttachment,
    presignImage: presignImage
};
