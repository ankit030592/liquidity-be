var Validator = require('./Validator');
var config = require('config');
var db = require('../db/db');
// var Product_Spec = db.import('../models/product_spec');
// var ProdCatSpecReln = db.import('../models/prod_cat_spec_reln');
var User = db.import('../models/user');
// var Cart = db.import('../models/cart');
// var waterfall = require('async-waterfall');
var crypto = require('crypto');
var randtoken = require('rand-token');
var moment = require('moment');
// const sgMail = require('@sendgrid/mail')
// const handlebars = require('handlebars');

// sgMail.setApiKey(config.SENDGRID_CONFIG.api_key);

var fail_obj = {
    status: 401,
    'error': 'you are not authenticated to perform this action'
};

function removeDups(array) {
    return array.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });
}

function priceTOPoint(price) {
    var ratio = 1;
    return points = price * ratio;
}

function isUser(token) {
    User.findOne({
        where: {
            token: token
        }
    }).then(function(user) {
        if (user.token_expires_on < new Date()) {
            return res.status(401).send(fail_obj);
        }
        return "ok";

    }).catch(function(err) {
        return res.status(401).send(fail_obj);
    });
}

function make_rules(str) {
    var chunks = str.split(',');
    var result = {};

    chunks.map(function(chunk) {
        chunk = chunk.split(':');
        var rule_data = {};
        rule_data.type = chunk[1];
        if (chunk[1] == 'string' || chunk[1] == 'number') {
            rule_data.minlength = 1; // default value

        }
        result[chunk[0]] = rule_data;
    });
    return result;
}

function processGetSpecs(req, res, category_id) {
    waterfall([
            function(callback) {
                ProdCatSpecReln.findAll({
                        where: {
                            category_id: category_id
                        }
                    })
                    .then(function(prod_cat_spec_reln) {
                        spec_arr = prod_cat_spec_reln.map(function(x) {
                            return x.spec_id;
                        });
                        var cb_obj = {
                            prod_cat_spec_reln: prod_cat_spec_reln,
                            spec_arr: spec_arr
                        };
                        callback(null, cb_obj);
                    }).catch(function(err) {
                        console.log('err is ' + JSON.stringify(err));
                        callback(messages.fetch(err), null);
                    });
            },
            function(cb_obj, callback) {
                console.log('cb_obj >>>>', cb_obj);
                Product_Spec.findAll({
                    where: {
                        id: {
                            $in: cb_obj.spec_arr
                        }
                    }
                }).then(function(specData) {
                    var specObj = {};
                    for (var i = 0; i < specData.length; i++) {
                        // console.log('specData[i] >>>>>> ', specData[i]);
                        var spec = specData[i].dataValues;
                        // console.log('spec is ????? ', spec);
                        specObj[spec.id] = spec;
                    }
                    // console.log("specObj >>>>>>>> ", specObj);
                    cat_spec_reln = cb_obj.prod_cat_spec_reln.map(function(p) {
                        var temp_var = {};
                        temp_var.id = p.dataValues.id;
                        temp_var.category_id = p.dataValues.category_id;
                        temp_var.spec_id = p.dataValues.spec_id;
                        temp_var.spec_name = specObj[p.dataValues.spec_id].name;
                        console.log('temp_var is ', temp_var);
                        return temp_var;
                    });
                    console.log("cat_spec_reln.dataValues ", cat_spec_reln);
                    callback(null, cat_spec_reln);
                }).catch(function(err) {
                    callback(err);
                });
            }
        ],
        function(err, result) {
            if (err) {
                console.log('err >>', err);
                //responder.sendError(res, err);
                res.status(400).send(err);
            } else {
                // return result
                res.status(200).send(result);
                //res.status(200).send((results[0].id).toString());
            }
        });
}

function getSaltedPassword(password) {
    return crypto.createHmac('sha1', 'simplesalt3112').update(password).digest('hex');
}

function handleCart(req, res) {
    // if (req.session.cart) {
    console.log('inside handle cart function');
    console.log(req.session);
    if (req.session.cart.length !== 0) {
        var product_ids = req.session.cart.map(function(x) {
            return x.product_id;
        });
        console.log("product_ids is ", product_ids);
        Cart.findAll({
            where: {
                buyer_id: req.session.user.id,
                product_id: {
                    $in: product_ids
                }
            }
        }).then(function(exists) {
            // console.log(exists);
            if (exists.length !== 0) {
                existsId = exists.map(function(x) {
                    return x.dataValues.product_id;
                });

                new_product = lodash.difference(product_ids, existsId);
                console.log("new_products ??? ", new_product);
                if (new_product.length !== 0) {
                    var dataToInsert = new_product.map(function(x, i) {
                        var data = {};
                        data.product_id = x;
                        data.buyer_id = req.session.user.id;
                        return data;
                    });
                    console.log('dataToInsert ??? ', dataToInsert);
                    Cart.bulkCreate(dataToInsert).then(function(result) {
                        console.log('created Cart', result);
                        // return res.status(200).send("Product added to cart");
                    }).catch(function(err) {
                        console.log(err);
                        return res.status(400).send("Could not add to cart");
                    });
                }

            }
            if (!exists || exists.length === 0) {
                console.log('easy way');
                var dataToInsert = req.session.cart.map(function(x, i) {
                    var data = {};
                    data.product_id = x.product_id;
                    data.buyer_id = req.session.user.id;
                    return data;
                });
                Cart.bulkCreate(dataToInsert).then(function(result) {
                    console.log('created Cart', result);
                    // return res.status(200).send("Product added to cart");
                }).catch(function(err) {
                    console.log(err);
                    return res.status(400).send("Could not add to cart");
                });
            }
            // callback(null, userObj);
        }).catch(function(err) {
            // callback(err)
            console.log(err);
        });
    }
    // callback(null, userObj);
    // }
}

function pagination(pageNo, itemsPerPage, arr) {
    console.log('checking pagination');
    var offset = itemsPerPage * (pageNo - 1);
    var lastItem = offset + itemsPerPage;
    var paginatedData = [];
    for (var i = 0; i < arr.length; i++) {
        if (i >= offset && i < lastItem) {
            paginatedData.push(arr[i]);
        }
    }
    return ({
        data: paginatedData,
        count: arr.length
    });
}

function getToken() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth();
    var day = currentDate.getDate();
    var nextYear = new Date(year + 1, month, day);
    var token = randtoken.generate(16);
    var now = moment();
    var issued_on = currentDate;
    var expires_on = nextYear;

    return {
        token: token,
        issued_on: issued_on,
        expires_on: expires_on
    };
}

function pad(num, size) {
    if (num > 9999) {
        num = num - 9999;
    }
    console.log(num);
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function getIncrementalAlphanumric(previous_code) {

    var numeric = previous_code.numeric;
    var first_alpha = previous_code.first_alpha;
    var second_alpha = previous_code.second_alpha;

    var first_alpha_ascii = first_alpha.charCodeAt(0);
    var second_alpha_ascii = second_alpha.charCodeAt(0);

    if (numeric === 99) {
        numeric = 1;
        if (second_alpha_ascii === 90) {
            second_alpha_ascii = 65;
            first_alpha_ascii++;
        } else {
            second_alpha_ascii++;
        }
        // if (second_alpha_ascii === )
    } else {
        numeric++;
    }
    var display_id_number = pad(numeric, 2);
    first_alpha = String.fromCharCode(first_alpha_ascii);
    second_alpha = String.fromCharCode(second_alpha_ascii);
    var display_id = first_alpha + second_alpha + display_id_number;
    return ({
        first_alpha: first_alpha,
        second_alpha: second_alpha,
        numeric: numeric,
        display_id: display_id
    });
}

function sendMail(message, email, subject) {
    const msg = {
        to: email,
        from: "Kasback<" + config.SENDGRID_CONFIG.from + ">",
        subject: subject,
        html: message,
    };
    sgMail.send(msg).then((data) => {
            console.log("\n\nSending mail from ", config.SENDGRID_CONFIG.from);
        })
        .catch(error => {
            //Log friendly error
            console.log("Error occurred", error.toString());
        });;
}

function renderHbs(source, data) {
    var template = handlebars.compile(source);
    var outputString = template(data);
    return outputString;
}

module.exports = {
    getSaltedPassword: getSaltedPassword,
    processGetSpecs: processGetSpecs,
    Validator: Validator,
    removeDups: removeDups,
    make_rules: make_rules,
    handleCart: handleCart,
    getToken: getToken,
    priceTOPoint: priceTOPoint,
    pagination: pagination,
    pad: pad,
    getIncrementalAlphanumric: getIncrementalAlphanumric,
    sendMail: sendMail,
    renderHbs: renderHbs
};