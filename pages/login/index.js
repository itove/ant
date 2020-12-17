import CryptoJS from '../../utils/crypto-js/crypto-js.js'
const key = 'aI4tI6Cq';
const iv = 'aI4tI6Cq';
var appData = getApp().globalData;

function encryptByDES(message, key, iv) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }
    );
    return encrypted.ciphertext.toString();
}

function sha1_to_base64(sha1) {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64_rep = "";
    var cnt = 0;
    var bit_arr = 0;
    var bit_num = 0;
    var ascv;
    for (var n = 0; n < sha1.length; ++n) {
        if (sha1[n] >= 'A' && sha1[n] <= 'Z') {
            ascv = sha1.charCodeAt(n) - 55;
        }
        else if (sha1[n] >= 'a' && sha1[n] <= 'z') {
            ascv = sha1.charCodeAt(n) - 87;
        }
        else {
            ascv = sha1.charCodeAt(n) - 48;
        }
        bit_arr = (bit_arr << 4) | ascv;
        bit_num += 4;
        if (bit_num >= 6) {
            bit_num -= 6;
            base64_rep += digits[bit_arr >>> bit_num];
            bit_arr &= ~(-1 << bit_num);
        }
    }
    if (bit_num > 0) {
        bit_arr <<= 6 - bit_num;
        base64_rep += digits[bit_arr];
    }
    var padding = base64_rep.length % 4;
    if (padding > 0) {
        for (var n = 0; n < 4 - padding; ++n) {
            base64_rep += "=";
        }
    }
    return base64_rep;
}

Page({
    data: {
        winWidth: 0,
        winHeight: 0,
        currentTab: 0,
    },
    onLoad: function() {
        console.log(getApp().req());
    },
    onLoad0: function() {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        var s = date.getSeconds();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        h = h < 10 ? '0' + h : h;
        min = min < 10 ? '0' + min : min;
        s = s < 10 ? '0' + s : s;
        var time = y + '' + m + '' + d + '' + h + '' + min + '' + s;
        var Searchtime = '';
        //var username = 'admin';
        //var pass = '123456';
        var UserId = wx.getStorageSync('UserId');
        var Token = wx.getStorageSync('Token');
        var Equcode = '1212123456342478';
        var Equcode = '1581551721300008';
        var Equid = Equcode;

        var username = sha1_to_base64(encryptByDES(username, key, iv));
        var pass = sha1_to_base64(encryptByDES(pass, key, iv));
        var time = sha1_to_base64(encryptByDES(time, key, iv));
        var UserId = sha1_to_base64(encryptByDES(UserId, key, iv));
        var Equid = sha1_to_base64(encryptByDES(Equid, key, iv));

        // UserLogin
        var data = '<?xml version="1.0" encoding="utf-8"?> <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> <soap12:Body> <UserLogin xmlns="http://tempuri.org/"> <username>' + username + '</username> <password>' + pass + '</password> <time>' + time + '</time> </UserLogin> </soap12:Body> </soap12:Envelope>';
        // GetEquipmentDetils
        var data = '<?xml version="1.0" encoding="utf-8"?> <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> <soap12:Body> <GetEquipmentDetils xmlns="http://tempuri.org/"> <userid>'+ UserId +'</userid> <equid>'+ Equid +'</equid> <searchtime>'+ Searchtime +'</searchtime> <time>'+ time +'</time> <token>'+ Token +'</token> </GetEquipmentDetils> </soap12:Body> </soap12:Envelope>';
        // GetUserEuipment
        var data = '<?xml version="1.0" encoding="utf-8"?> <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> <soap12:Body> <GetUserEuipment xmlns="http://tempuri.org/"> <userid>'+ UserId +'</userid> <equcode></equcode> <pageindex>1</pageindex> <pagesize>5</pagesize> <time>'+ time +'</time> <token>'+ Token+'</token> </GetUserEuipment> </soap12:Body> </soap12:Envelope>';
        // GetSingleEquipment
        var data = '<?xml version="1.0" encoding="utf-8"?> <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> <soap12:Body> <GetSingleEquipment xmlns="http://tempuri.org/"> <userid>'+ UserId +'</userid> <equid>'+ Equid +'</equid> <time>' + time + '</time> <token>' + Token + '</token> </GetSingleEquipment> </soap12:Body> </soap12:Envelope>';
        wx.request({
            url: appData.url,
            data: data,
            method: 'POST',
            header: {
                'Content-Type': 'application/soap+xml; charset=utf-8',
            },
            success(res){
                var d = res.data.match(/{(.*)}/g)[0];   // Extact json from xml
                // Remove quotes in Data: "{..}" and Data: "[...]"
                d = d.replace('"{', '{'); 
                d = d.replace('}"', '}'); 
                d = d.replace('"[', '['); 
                d = d.replace(']"', ']'); 
                d = d.replace(/\\/g, '');   // Remove \
                d = JSON.parse(d);
                console.log(d.Data);
                //console.log(res.data);
                getApp().globalData.data = d.Data;
                //wx.setStorageSync('Token', d.Token);
                //wx.setStorageSync('UserId', d.Data.UserId);
                //wx.setStorageSync('RoleId', d.Data.RoleId);
            }
        });

        //wx.setStorageSync("sessionid", "sometoken");
        //console.log(wx.getStorageSync("sessionid"));
        //wx.clearStorage();
        if (Token !== '') {
            wx.switchTab({
                url: "../status/index"
            });
        }

        var that = this;

        wx.getSystemInfo( {

            success: function( res ) {
                that.setData( {
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }

        });
    },
    formSubmit: function(e) {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        var s = date.getSeconds();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        h = h < 10 ? '0' + h : h;
        min = min < 10 ? '0' + min : min;
        s = s < 10 ? '0' + s : s;
        var time = y + '' + m + '' + d + '' + h + '' + min + '' + s;
        var username = e.detail.value.Username;
        var pass = e.detail.value.Pwd;
        var username = sha1_to_base64(encryptByDES(username, key, iv));
        var pass = sha1_to_base64(encryptByDES(pass, key, iv));
        var time = sha1_to_base64(encryptByDES(time, key, iv));
        var data = '<?xml version="1.0" encoding="utf-8"?> <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"> <soap12:Body> <UserLogin xmlns="http://tempuri.org/"> <username>' + username + '</username> <password>' + pass + '</password> <time>' + time + '</time> </UserLogin> </soap12:Body> </soap12:Envelope>';
        wx.request({
            url: appData.url,
            data: data,
            method: "POST",
            header: {
                'Content-Type': 'application/soap+xml; charset=utf-8',
                },
            success: (res) => {
                var d = res.data.match(/{(.*)}/g)[0];   // Extact json from xml
                // Remove quotes in Data: "{..}" and Data: "[...]"
                d = d.replace('"{', '{'); 
                d = d.replace('}"', '}'); 
                d = d.replace('"[', '['); 
                d = d.replace(']"', ']'); 
                d = d.replace(/\\/g, '');   // Remove \
                d = JSON.parse(d);
                console.log(d);
                //console.log(res);
                if (d.Code === '0') {
                //if (1) {
                    wx.setStorageSync('Token', d.Token);
                    wx.setStorageSync('UserId', d.Data.UserId);
                    wx.setStorageSync('RoleId', d.Data.RoleId);
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                        duration: 2000
                    });
                    setTimeout(() => {
                        wx.switchTab({
                            url: "../status/index"
                        })
                    },500
                    );
                } else {
                    wx.showToast({
                        title: '账号或密码错误',
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
        });
    },
      
    swichNav: function( e ) {

        var that = this;

        if( this.data.currentTab === e.target.dataset.current ) {
            return false;
        } else {
            that.setData( {
                currentTab: e.target.dataset.current
            })
        }
    },

    bindChange: function( e ) {

        var that = this;
        that.setData( { currentTab: e.detail.current });

    },

    onReady: function() {
    }
})
