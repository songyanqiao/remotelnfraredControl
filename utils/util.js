var t = function(t) {
    return (t = t.toString())[1] ? t : "0".concat(t);
};

module.exports = {
    formatTime: function(e) {
        var n = e.getFullYear(), o = e.getMonth() + 1, r = e.getDate(), a = e.getHours(), c = e.getMinutes(), u = e.getSeconds();
        return "".concat([ n, o, r ].map(t).join("/"), " ").concat([ a, c, u ].map(t).join(":"));
    }
};