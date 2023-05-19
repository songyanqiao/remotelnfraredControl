var e = require("../@babel/runtime/helpers/typeof");

!function(t) {
    if ("object" === ("undefined" == typeof exports ? "undefined" : e(exports)) && "undefined" != typeof module) module.exports = t(); else if ("function" == typeof define && define.amd) define([], t); else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).mqtt = t();
    }
}(function() {
    return function e(t, r, n) {
        function i(s, a) {
            if (!r[s]) {
                if (!t[s]) {
                    var u = "function" == typeof require && require;
                    if (!a && u) return u(s, !0);
                    if (o) return o(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw c.code = "MODULE_NOT_FOUND", c;
                }
                var l = r[s] = {
                    exports: {}
                };
                t[s][0].call(l.exports, function(e) {
                    return i(t[s][1][e] || e);
                }, l, l.exports, e, t, r, n);
            }
            return r[s].exports;
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) i(n[s]);
        return i;
    }({
        1: [ function(t, r, n) {
            (function(n, i) {
                var o = t("events"), s = t("./store"), a = t("mqtt-packet"), u = t("readable-stream").Writable, c = t("inherits"), l = t("reinterval"), f = t("./validations"), h = t("xtend"), p = i.setImmediate || function(e) {
                    n.nextTick(e);
                }, d = {
                    keepalive: 60,
                    reschedulePings: !0,
                    protocolId: "MQTT",
                    protocolVersion: 4,
                    reconnectPeriod: 1e3,
                    connectTimeout: 3e4,
                    clean: !0,
                    resubscribe: !0
                }, g = {
                    0: "",
                    1: "Unacceptable protocol version",
                    2: "Identifier rejected",
                    3: "Server unavailable",
                    4: "Bad username or password",
                    5: "Not authorized",
                    16: "No matching subscribers",
                    17: "No subscription existed",
                    128: "Unspecified error",
                    129: "Malformed Packet",
                    130: "Protocol Error",
                    131: "Implementation specific error",
                    132: "Unsupported Protocol Version",
                    133: "Client Identifier not valid",
                    134: "Bad User Name or Password",
                    135: "Not authorized",
                    136: "Server unavailable",
                    137: "Server busy",
                    138: "Banned",
                    139: "Server shutting down",
                    140: "Bad authentication method",
                    141: "Keep Alive timeout",
                    142: "Session taken over",
                    143: "Topic Filter invalid",
                    144: "Topic Name invalid",
                    145: "Packet identifier in use",
                    146: "Packet Identifier not found",
                    147: "Receive Maximum exceeded",
                    148: "Topic Alias invalid",
                    149: "Packet too large",
                    150: "Message rate too high",
                    151: "Quota exceeded",
                    152: "Administrative action",
                    153: "Payload format invalid",
                    154: "Retain not supported",
                    155: "QoS not supported",
                    156: "Use another server",
                    157: "Server moved",
                    158: "Shared Subscriptions not supported",
                    159: "Connection rate exceeded",
                    160: "Maximum connect time",
                    161: "Subscription Identifiers not supported",
                    162: "Wildcard Subscriptions not supported"
                };
                function b(e, t, r) {
                    e.emit("packetsend", t), !a.writeToStream(t, e.stream, e.options) && r ? e.stream.once("drain", r) : r && r();
                }
                function y(e) {
                    e && Object.keys(e).forEach(function(t) {
                        "function" == typeof e[t] && (e[t](new Error("Connection closed")), delete e[t]);
                    });
                }
                function _(e, t, r, n) {
                    e.outgoingStore.put(t, function(i) {
                        if (i) return r && r(i);
                        n(), b(e, t, r);
                    });
                }
                function m() {}
                function v(e, t) {
                    var r, n = this;
                    if (!(this instanceof v)) return new v(e, t);
                    for (r in this.options = t || {}, d) void 0 === this.options[r] ? this.options[r] = d[r] : this.options[r] = t[r];
                    this.options.clientId = "string" == typeof t.clientId ? t.clientId : "mqttjs_" + Math.random().toString(16).substr(2, 8), 
                    this.options.customHandleAcks = 5 === t.protocolVersion && t.customHandleAcks ? t.customHandleAcks : function() {
                        arguments[3](0);
                    }, this.streamBuilder = e, this.outgoingStore = t.outgoingStore || new s(), this.incomingStore = t.incomingStore || new s(), 
                    this.queueQoSZero = void 0 === t.queueQoSZero || t.queueQoSZero, this._resubscribeTopics = {}, 
                    this.messageIdToTopic = {}, this.pingTimer = null, this.connected = !1, this.disconnecting = !1, 
                    this.queue = [], this.connackTimer = null, this.reconnectTimer = null, this._storeProcessing = !1, 
                    this._packetIdsDuringStoreProcessing = {}, this.nextId = Math.max(1, Math.floor(65535 * Math.random())), 
                    this.outgoing = {}, this._firstConnection = !0, this.on("close", function() {
                        this.connected = !1, clearTimeout(this.connackTimer);
                    }), this.on("connect", function() {
                        var e = this.queue;
                        !function t() {
                            var r, i = e.shift();
                            i && (r = i.packet, n._sendPacket(r, function(e) {
                                i.cb && i.cb(e), t();
                            }));
                        }();
                    }), this.on("close", function() {
                        null !== n.pingTimer && (n.pingTimer.clear(), n.pingTimer = null);
                    }), this.on("close", this._setupReconnect), o.EventEmitter.call(this), this._setupStream();
                }
                c(v, o.EventEmitter), v.prototype._setupStream = function() {
                    var t, r = this, i = new u(), o = a.parser(this.options), s = null, c = [];
                    function l() {
                        n.nextTick(f);
                    }
                    function f() {
                        var e = c.shift(), t = s;
                        e ? r._handlePacket(e, l) : (s = null, t());
                    }
                    if (this._clearReconnect(), this.stream = this.streamBuilder(this), o.on("packet", function(e) {
                        c.push(e);
                    }), i._write = function(e, t, r) {
                        s = r, o.parse(e), f();
                    }, this.stream.pipe(i), this.stream.on("error", m), this.stream.on("close", function() {
                        r.emit("close");
                    }), (t = Object.create(this.options)).cmd = "connect", b(this, t), o.on("error", this.emit.bind(this, "error")), 
                    this.options.properties) {
                        if (!this.options.properties.authenticationMethod && this.options.properties.authenticationData) return this.emit("error", new Error("Packet has no Authentication Method")), 
                        this;
                        if (this.options.properties.authenticationMethod && this.options.authPacket && "object" === e(this.options.authPacket)) b(this, h({
                            cmd: "auth",
                            reasonCode: 0
                        }, this.options.authPacket));
                    }
                    this.stream.setMaxListeners(1e3), clearTimeout(this.connackTimer), this.connackTimer = setTimeout(function() {
                        r._cleanUp(!0);
                    }, this.options.connectTimeout);
                }, v.prototype._handlePacket = function(e, t) {
                    var r = this.options;
                    if (5 === r.protocolVersion && r.properties && r.properties.maximumPacketSize && r.properties.maximumPacketSize < e.length) return this.emit("error", new Error("exceeding packets size " + e.cmd)), 
                    this.end({
                        reasonCode: 149,
                        properties: {
                            reasonString: "Maximum packet size was exceeded"
                        }
                    }), this;
                    switch (this.emit("packetreceive", e), e.cmd) {
                      case "publish":
                        this._handlePublish(e, t);
                        break;

                      case "puback":
                      case "pubrec":
                      case "pubcomp":
                      case "suback":
                      case "unsuback":
                        this._handleAck(e), t();
                        break;

                      case "pubrel":
                        this._handlePubrel(e, t);
                        break;

                      case "connack":
                        this._handleConnack(e), t();
                        break;

                      case "pingresp":
                        this._handlePingresp(e), t();
                    }
                }, v.prototype._checkDisconnecting = function(e) {
                    return this.disconnecting && (e ? e(new Error("client disconnecting")) : this.emit("error", new Error("client disconnecting"))), 
                    this.disconnecting;
                }, v.prototype.publish = function(e, t, r, n) {
                    var i, o = this.options;
                    "function" == typeof r && (n = r, r = null);
                    if (r = h({
                        qos: 0,
                        retain: !1,
                        dup: !1
                    }, r), this._checkDisconnecting(n)) return this;
                    switch (i = {
                        cmd: "publish",
                        topic: e,
                        payload: t,
                        qos: r.qos,
                        retain: r.retain,
                        messageId: this._nextId(),
                        dup: r.dup
                    }, 5 === o.protocolVersion && (i.properties = r.properties, (!o.properties && i.properties && i.properties.topicAlias || r.properties && o.properties && (r.properties.topicAlias && o.properties.topicAliasMaximum && r.properties.topicAlias > o.properties.topicAliasMaximum || !o.properties.topicAliasMaximum && r.properties.topicAlias)) && delete i.properties.topicAlias), 
                    r.qos) {
                      case 1:
                      case 2:
                        this.outgoing[i.messageId] = n || m, this._storeProcessing ? (this._packetIdsDuringStoreProcessing[i.messageId] = !1, 
                        this._storePacket(i, void 0, r.cbStorePut)) : this._sendPacket(i, void 0, r.cbStorePut);
                        break;

                      default:
                        this._storeProcessing ? this._storePacket(i, n, r.cbStorePut) : this._sendPacket(i, n, r.cbStorePut);
                    }
                    return this;
                }, v.prototype.subscribe = function() {
                    for (var e, t = new Array(arguments.length), r = 0; r < arguments.length; r++) t[r] = arguments[r];
                    var n, i = [], o = t.shift(), s = o.resubscribe, a = t.pop() || m, u = t.pop(), c = this, l = this.options.protocolVersion;
                    if (delete o.resubscribe, "string" == typeof o && (o = [ o ]), "function" != typeof a && (u = a, 
                    a = m), null !== (n = f.validateTopics(o))) return p(a, new Error("Invalid topic " + n)), 
                    this;
                    if (this._checkDisconnecting(a)) return this;
                    var d = {
                        qos: 0
                    };
                    if (5 === l && (d.nl = !1, d.rap = !1, d.rh = 0), u = h(d, u), Array.isArray(o) ? o.forEach(function(e) {
                        if (!c._resubscribeTopics.hasOwnProperty(e) || c._resubscribeTopics[e].qos < u.qos || s) {
                            var t = {
                                topic: e,
                                qos: u.qos
                            };
                            5 === l && (t.nl = u.nl, t.rap = u.rap, t.rh = u.rh), i.push(t);
                        }
                    }) : Object.keys(o).forEach(function(e) {
                        if (!c._resubscribeTopics.hasOwnProperty(e) || c._resubscribeTopics[e].qos < o[e].qos || s) {
                            var t = {
                                topic: e,
                                qos: o[e].qos
                            };
                            5 === l && (t.nl = o[e].nl, t.rap = o[e].rap, t.rh = o[e].rh), i.push(t);
                        }
                    }), e = {
                        cmd: "subscribe",
                        subscriptions: i,
                        qos: 1,
                        retain: !1,
                        dup: !1,
                        messageId: this._nextId()
                    }, u.properties && (e.properties = u.properties), i.length) {
                        if (this.options.resubscribe) {
                            var g = [];
                            i.forEach(function(e) {
                                if (c.options.reconnectPeriod > 0) {
                                    var t = {
                                        qos: e.qos
                                    };
                                    5 === l && (t.nl = e.nl || !1, t.rap = e.rap || !1, t.rh = e.rh || 0), c._resubscribeTopics[e.topic] = t, 
                                    g.push(e.topic);
                                }
                            }), c.messageIdToTopic[e.messageId] = g;
                        }
                        return this.outgoing[e.messageId] = function(e, t) {
                            if (!e) for (var r = t.granted, n = 0; n < r.length; n += 1) i[n].qos = r[n];
                            a(e, i);
                        }, this._sendPacket(e), this;
                    }
                    a(null, []);
                }, v.prototype.unsubscribe = function() {
                    for (var t = {
                        cmd: "unsubscribe",
                        qos: 1,
                        messageId: this._nextId()
                    }, r = this, n = new Array(arguments.length), i = 0; i < arguments.length; i++) n[i] = arguments[i];
                    var o = n.shift(), s = n.pop() || m, a = n.pop();
                    return "string" == typeof o && (o = [ o ]), "function" != typeof s && (a = s, s = m), 
                    this._checkDisconnecting(s) || ("string" == typeof o ? t.unsubscriptions = [ o ] : "object" === e(o) && o.length && (t.unsubscriptions = o), 
                    this.options.resubscribe && t.unsubscriptions.forEach(function(e) {
                        delete r._resubscribeTopics[e];
                    }), "object" === e(a) && a.properties && (t.properties = a.properties), this.outgoing[t.messageId] = s, 
                    this._sendPacket(t)), this;
                }, v.prototype.end = function() {
                    var t = this, r = arguments[0], n = arguments[1], i = arguments[2];
                    function o() {
                        t.disconnected = !0, t.incomingStore.close(function() {
                            t.outgoingStore.close(function() {
                                i && i.apply(null, arguments), t.emit("end");
                            });
                        }), t._deferredReconnect && t._deferredReconnect();
                    }
                    function s() {
                        t._cleanUp(r, p.bind(null, o), n);
                    }
                    return null != r && "boolean" == typeof r || (i = n || m, n = r, r = !1, "object" !== e(n) && (i = n, 
                    n = null, "function" != typeof i && (i = m))), "object" !== e(n) && (i = n, n = null), 
                    i = i || m, this.disconnecting || (this._clearReconnect(), this.disconnecting = !0, 
                    !r && Object.keys(this.outgoing).length > 0 ? this.once("outgoingEmpty", setTimeout.bind(null, s, 10)) : s()), 
                    this;
                }, v.prototype.removeOutgoingMessage = function(e) {
                    var t = this.outgoing[e];
                    return delete this.outgoing[e], this.outgoingStore.del({
                        messageId: e
                    }, function() {
                        t(new Error("Message removed"));
                    }), this;
                }, v.prototype.reconnect = function(e) {
                    var t = this, r = function() {
                        e ? (t.options.incomingStore = e.incomingStore, t.options.outgoingStore = e.outgoingStore) : (t.options.incomingStore = null, 
                        t.options.outgoingStore = null), t.incomingStore = t.options.incomingStore || new s(), 
                        t.outgoingStore = t.options.outgoingStore || new s(), t.disconnecting = !1, t.disconnected = !1, 
                        t._deferredReconnect = null, t._reconnect();
                    };
                    return this.disconnecting && !this.disconnected ? this._deferredReconnect = r : r(), 
                    this;
                }, v.prototype._reconnect = function() {
                    this.emit("reconnect"), this._setupStream();
                }, v.prototype._setupReconnect = function() {
                    var e = this;
                    !e.disconnecting && !e.reconnectTimer && e.options.reconnectPeriod > 0 && (this.reconnecting || (this.emit("offline"), 
                    this.reconnecting = !0), e.reconnectTimer = setInterval(function() {
                        e._reconnect();
                    }, e.options.reconnectPeriod));
                }, v.prototype._clearReconnect = function() {
                    this.reconnectTimer && (clearInterval(this.reconnectTimer), this.reconnectTimer = null);
                }, v.prototype._cleanUp = function(e, t) {
                    var r = arguments[2];
                    if (t && this.stream.on("close", t), e) 0 === this.options.reconnectPeriod && this.options.clean && y(this.outgoing), 
                    this.stream.destroy(); else {
                        var n = h({
                            cmd: "disconnect"
                        }, r);
                        this._sendPacket(n, p.bind(null, this.stream.end.bind(this.stream)));
                    }
                    this.disconnecting || (this._clearReconnect(), this._setupReconnect()), null !== this.pingTimer && (this.pingTimer.clear(), 
                    this.pingTimer = null), t && !this.connected && (this.stream.removeListener("close", t), 
                    t());
                }, v.prototype._sendPacket = function(e, t, r) {
                    if (r = r || m, this.connected) {
                        switch (this._shiftPingInterval(), e.cmd) {
                          case "publish":
                            break;

                          case "pubrel":
                            return void _(this, e, t, r);

                          default:
                            return void b(this, e, t);
                        }
                        switch (e.qos) {
                          case 2:
                          case 1:
                            _(this, e, t, r);
                            break;

                          case 0:
                          default:
                            b(this, e, t);
                        }
                    } else this._storePacket(e, t, r);
                }, v.prototype._storePacket = function(e, t, r) {
                    r = r || m, 0 === (e.qos || 0) && this.queueQoSZero || "publish" !== e.cmd ? this.queue.push({
                        packet: e,
                        cb: t
                    }) : e.qos > 0 ? (t = this.outgoing[e.messageId], this.outgoingStore.put(e, function(e) {
                        if (e) return t && t(e);
                        r();
                    })) : t && t(new Error("No connection to broker"));
                }, v.prototype._setupPingTimer = function() {
                    var e = this;
                    !this.pingTimer && this.options.keepalive && (this.pingResp = !0, this.pingTimer = l(function() {
                        e._checkPing();
                    }, 1e3 * this.options.keepalive));
                }, v.prototype._shiftPingInterval = function() {
                    this.pingTimer && this.options.keepalive && this.options.reschedulePings && this.pingTimer.reschedule(1e3 * this.options.keepalive);
                }, v.prototype._checkPing = function() {
                    this.pingResp ? (this.pingResp = !1, this._sendPacket({
                        cmd: "pingreq"
                    })) : this._cleanUp(!0);
                }, v.prototype._handlePingresp = function() {
                    this.pingResp = !0;
                }, v.prototype._handleConnack = function(e) {
                    var t = this.options, r = 5 === t.protocolVersion ? e.reasonCode : e.returnCode;
                    if (clearTimeout(this.connackTimer), e.properties && (e.properties.topicAliasMaximum && (t.properties || (t.properties = {}), 
                    t.properties.topicAliasMaximum = e.properties.topicAliasMaximum), e.properties.serverKeepAlive && t.keepalive && (t.keepalive = e.properties.serverKeepAlive, 
                    this._shiftPingInterval()), e.properties.maximumPacketSize && (t.properties || (t.properties = {}), 
                    t.properties.maximumPacketSize = e.properties.maximumPacketSize)), 0 === r) this.reconnecting = !1, 
                    this._onConnect(e); else if (r > 0) {
                        var n = new Error("Connection refused: " + g[r]);
                        n.code = r, this.emit("error", n);
                    }
                }, v.prototype._handlePublish = function(e, t) {
                    t = void 0 !== t ? t : m;
                    var r = e.topic.toString(), n = e.payload, i = e.qos, o = e.messageId, s = this, a = this.options, u = [ 0, 16, 128, 131, 135, 144, 145, 151, 153 ];
                    switch (i) {
                      case 2:
                        a.customHandleAcks(r, n, e, function(r, n) {
                            return r instanceof Error || (n = r, r = null), r ? s.emit("error", r) : -1 === u.indexOf(n) ? s.emit("error", new Error("Wrong reason code for pubrec")) : void (n ? s._sendPacket({
                                cmd: "pubrec",
                                messageId: o,
                                reasonCode: n
                            }, t) : s.incomingStore.put(e, function() {
                                s._sendPacket({
                                    cmd: "pubrec",
                                    messageId: o
                                }, t);
                            }));
                        });
                        break;

                      case 1:
                        a.customHandleAcks(r, n, e, function(i, a) {
                            return i instanceof Error || (a = i, i = null), i ? s.emit("error", i) : -1 === u.indexOf(a) ? s.emit("error", new Error("Wrong reason code for puback")) : (a || s.emit("message", r, n, e), 
                            void s.handleMessage(e, function(e) {
                                if (e) return t && t(e);
                                s._sendPacket({
                                    cmd: "puback",
                                    messageId: o,
                                    reasonCode: a
                                }, t);
                            }));
                        });
                        break;

                      case 0:
                        this.emit("message", r, n, e), this.handleMessage(e, t);
                    }
                }, v.prototype.handleMessage = function(e, t) {
                    t();
                }, v.prototype._handleAck = function(e) {
                    var t, r = e.messageId, n = e.cmd, i = null, o = this.outgoing[r], s = this;
                    if (o) {
                        switch (n) {
                          case "pubcomp":
                          case "puback":
                            var a = e.reasonCode;
                            a && a > 0 && 16 !== a && ((t = new Error("Publish error: " + g[a])).code = a, o(t, e)), 
                            delete this.outgoing[r], this.outgoingStore.del(e, o);
                            break;

                          case "pubrec":
                            i = {
                                cmd: "pubrel",
                                qos: 2,
                                messageId: r
                            };
                            var u = e.reasonCode;
                            u && u > 0 && 16 !== u ? ((t = new Error("Publish error: " + g[u])).code = u, o(t, e)) : this._sendPacket(i);
                            break;

                          case "suback":
                            delete this.outgoing[r];
                            for (var c = 0; c < e.granted.length; c++) if (0 != (128 & e.granted[c])) {
                                var l = this.messageIdToTopic[r];
                                l && l.forEach(function(e) {
                                    delete s._resubscribeTopics[e];
                                });
                            }
                            o(null, e);
                            break;

                          case "unsuback":
                            delete this.outgoing[r], o(null);
                            break;

                          default:
                            s.emit("error", new Error("unrecognized packet type"));
                        }
                        this.disconnecting && 0 === Object.keys(this.outgoing).length && this.emit("outgoingEmpty");
                    }
                }, v.prototype._handlePubrel = function(e, t) {
                    t = void 0 !== t ? t : m;
                    var r = e.messageId, n = this, i = {
                        cmd: "pubcomp",
                        messageId: r
                    };
                    n.incomingStore.get(e, function(e, r) {
                        e ? n._sendPacket(i, t) : (n.emit("message", r.topic, r.payload, r), n.handleMessage(r, function(e) {
                            if (e) return t(e);
                            n.incomingStore.del(r, m), n._sendPacket(i, t);
                        }));
                    });
                }, v.prototype._nextId = function() {
                    var e = this.nextId++;
                    return 65536 === this.nextId && (this.nextId = 1), e;
                }, v.prototype.getLastMessageId = function() {
                    return 1 === this.nextId ? 65535 : this.nextId - 1;
                }, v.prototype._resubscribe = function(e) {
                    !this._firstConnection && (this.options.clean || 5 === this.options.protocolVersion && !e.sessionPresent) && Object.keys(this._resubscribeTopics).length > 0 && (this.options.resubscribe ? (this._resubscribeTopics.resubscribe = !0, 
                    this.subscribe(this._resubscribeTopics)) : this._resubscribeTopics = {}), this._firstConnection = !1;
                }, v.prototype._onConnect = function(e) {
                    if (this.disconnected) this.emit("connect", e); else {
                        var t = this;
                        this._setupPingTimer(), this._resubscribe(e), this.connected = !0, function r() {
                            var n = t.outgoingStore.createStream();
                            function i() {
                                t._storeProcessing = !1, t._packetIdsDuringStoreProcessing = {};
                            }
                            function o() {
                                n.destroy(), n = null, i();
                            }
                            t.once("close", o), n.on("error", function(e) {
                                i(), t.removeListener("close", o), t.emit("error", e);
                            }), n.on("end", function() {
                                var n = !0;
                                for (var s in t._packetIdsDuringStoreProcessing) if (!t._packetIdsDuringStoreProcessing[s]) {
                                    n = !1;
                                    break;
                                }
                                n ? (i(), t.removeListener("close", o), t.emit("connect", e)) : r();
                            }), function e() {
                                if (n) {
                                    t._storeProcessing = !0;
                                    var r, i = n.read(1);
                                    i ? t._packetIdsDuringStoreProcessing[i.messageId] ? e() : t.disconnecting || t.reconnectTimer ? n.destroy && n.destroy() : (r = t.outgoing[i.messageId], 
                                    t.outgoing[i.messageId] = function(t, n) {
                                        r && r(t, n), e();
                                    }, t._packetIdsDuringStoreProcessing[i.messageId] = !0, t._sendPacket(i)) : n.once("readable", e);
                                }
                            }();
                        }();
                    }
                }, r.exports = v;
            }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./store": 7,
            "./validations": 8,
            _process: 92,
            events: 13,
            inherits: 80,
            "mqtt-packet": 84,
            "readable-stream": 108,
            reinterval: 109,
            xtend: 121
        } ],
        2: [ function(e, t, r) {
            (function(r) {
                var n, i, o, s = e("readable-stream").Transform, a = e("duplexify"), u = e("base64-js"), c = !1;
                t.exports = function(e, t) {
                    if (t.hostname = t.hostname || t.host, !t.hostname) throw new Error("Could not determine host. Specify host manually.");
                    var l = "MQIsdp" === t.protocolId && 3 === t.protocolVersion ? "mqttv3.1" : "mqtt";
                    !function(e) {
                        e.hostname || (e.hostname = "localhost"), e.path || (e.path = "/"), e.wsOptions || (e.wsOptions = {});
                    }(t);
                    var f = function(e, t) {
                        var r = "alis" === e.protocol ? "wss" : "ws", n = r + "://" + e.hostname + e.path;
                        return e.port && 80 !== e.port && 443 !== e.port && (n = r + "://" + e.hostname + ":" + e.port + e.path), 
                        "function" == typeof e.transformWsUrl && (n = e.transformWsUrl(n, e, t)), n;
                    }(t, e);
                    return (n = t.my).connectSocket({
                        url: f,
                        protocols: l
                    }), i = function() {
                        var e = new s();
                        return e._write = function(e, t, r) {
                            n.sendSocketMessage({
                                data: e.buffer,
                                success: function() {
                                    r();
                                },
                                fail: function() {
                                    r(new Error());
                                }
                            });
                        }, e._flush = function(e) {
                            n.closeSocket({
                                success: function() {
                                    e();
                                }
                            });
                        }, e;
                    }(), o = a.obj(), c || (c = !0, n.onSocketOpen(function() {
                        o.setReadable(i), o.setWritable(i), o.emit("connect");
                    }), n.onSocketMessage(function(e) {
                        if ("string" == typeof e.data) {
                            var t = u.toByteArray(e.data), n = r.from(t);
                            i.push(n);
                        } else {
                            var o = new FileReader();
                            o.addEventListener("load", function() {
                                var e = o.result;
                                e = e instanceof ArrayBuffer ? r.from(e) : r.from(e, "utf8"), i.push(e);
                            }), o.readAsArrayBuffer(e.data);
                        }
                    }), n.onSocketClose(function() {
                        o.end(), o.destroy();
                    }), n.onSocketError(function(e) {
                        o.destroy(e);
                    })), o;
                };
            }).call(this, e("buffer").Buffer);
        }, {
            "base64-js": 10,
            buffer: 12,
            duplexify: 17,
            "readable-stream": 108
        } ],
        3: [ function(e, t, r) {
            var n = e("net");
            t.exports = function(e, t) {
                var r, i;
                return t.port = t.port || 1883, t.hostname = t.hostname || t.host || "localhost", 
                r = t.port, i = t.hostname, n.createConnection(r, i);
            };
        }, {
            net: 11
        } ],
        4: [ function(e, t, r) {
            var n = e("tls");
            t.exports = function(e, t) {
                var r;
                function i(n) {
                    t.rejectUnauthorized && e.emit("error", n), r.end();
                }
                return t.port = t.port || 8883, t.host = t.hostname || t.host || "localhost", t.rejectUnauthorized = !1 !== t.rejectUnauthorized, 
                delete t.path, (r = n.connect(t)).on("secureConnect", function() {
                    t.rejectUnauthorized && !r.authorized ? r.emit("error", new Error("TLS not authorized")) : r.removeListener("error", i);
                }), r.on("error", i), r;
            };
        }, {
            tls: 11
        } ],
        5: [ function(e, t, r) {
            (function(r) {
                var n = e("websocket-stream"), i = e("url"), o = [ "rejectUnauthorized", "ca", "cert", "key", "pfx", "passphrase" ], s = "browser" === r.title;
                function a(e, t) {
                    var r = "MQIsdp" === t.protocolId && 3 === t.protocolVersion ? "mqttv3.1" : "mqtt";
                    !function(e) {
                        e.hostname || (e.hostname = "localhost"), e.port || ("wss" === e.protocol ? e.port = 443 : e.port = 80), 
                        e.path || (e.path = "/"), e.wsOptions || (e.wsOptions = {}), s || "wss" !== e.protocol || o.forEach(function(t) {
                            e.hasOwnProperty(t) && !e.wsOptions.hasOwnProperty(t) && (e.wsOptions[t] = e[t]);
                        });
                    }(t);
                    var i = function(e, t) {
                        var r = e.protocol + "://" + e.hostname + ":" + e.port + e.path;
                        return "function" == typeof e.transformWsUrl && (r = e.transformWsUrl(r, e, t)), 
                        r;
                    }(t, e);
                    return n(i, [ r ], t.wsOptions);
                }
                t.exports = s ? function(e, t) {
                    if (t.hostname || (t.hostname = t.host), !t.hostname) {
                        if ("undefined" == typeof document) throw new Error("Could not determine host. Specify host manually.");
                        var r = i.parse(document.URL);
                        t.hostname = r.hostname, t.port || (t.port = r.port);
                    }
                    return a(e, t);
                } : function(e, t) {
                    return a(e, t);
                };
            }).call(this, e("_process"));
        }, {
            _process: 92,
            url: 113,
            "websocket-stream": 118
        } ],
        6: [ function(e, t, r) {
            (function(r, n) {
                var i, o, s, a = e("readable-stream").Transform, u = e("duplexify");
                t.exports = function(e, t) {
                    if (t.hostname = t.hostname || t.host, !t.hostname) throw new Error("Could not determine host. Specify host manually.");
                    var c = "MQIsdp" === t.protocolId && 3 === t.protocolVersion ? "mqttv3.1" : "mqtt";
                    !function(e) {
                        e.hostname || (e.hostname = "localhost"), e.path || (e.path = "/"), e.wsOptions || (e.wsOptions = {});
                    }(t);
                    var l = function(e, t) {
                        var r = "wxs" === e.protocol ? "wss" : "ws", n = r + "://" + e.hostname + e.path;
                        return e.port && 80 !== e.port && 443 !== e.port && (n = r + "://" + e.hostname + ":" + e.port + e.path), 
                        "function" == typeof e.transformWsUrl && (n = e.transformWsUrl(n, e, t)), n;
                    }(t, e);
                    i = wx.connectSocket({
                        url: l,
                        protocols: c
                    }), o = function() {
                        var e = new a();
                        return e._write = function(e, t, r) {
                            i.send({
                                data: e.buffer,
                                success: function() {
                                    r();
                                },
                                fail: function(e) {
                                    r(new Error(e));
                                }
                            });
                        }, e._flush = function(e) {
                            i.close({
                                success: function() {
                                    e();
                                }
                            });
                        }, e;
                    }(), (s = u.obj())._destroy = function(e, t) {
                        i.close({
                            success: function() {
                                t && t(e);
                            }
                        });
                    };
                    var f = s.destroy;
                    return s.destroy = function() {
                        s.destroy = f;
                        var e = this;
                        r.nextTick(function() {
                            i.close({
                                fail: function() {
                                    e._destroy(new Error());
                                }
                            });
                        });
                    }.bind(s), i.onOpen(function() {
                        s.setReadable(o), s.setWritable(o), s.emit("connect");
                    }), i.onMessage(function(e) {
                        var t = e.data;
                        t = t instanceof ArrayBuffer ? n.from(t) : n.from(t, "utf8"), o.push(t);
                    }), i.onClose(function() {
                        s.end(), s.destroy();
                    }), i.onError(function(e) {
                        s.destroy(new Error(e.errMsg));
                    }), s;
                };
            }).call(this, e("_process"), e("buffer").Buffer);
        }, {
            _process: 92,
            buffer: 12,
            duplexify: 17,
            "readable-stream": 108
        } ],
        7: [ function(e, t, r) {
            (function(r) {
                var n = e("xtend"), i = e("readable-stream").Readable, o = {
                    objectMode: !0
                }, s = {
                    clean: !0
                }, a = e("es6-map");
                function u(e) {
                    if (!(this instanceof u)) return new u(e);
                    this.options = e || {}, this.options = n(s, e), this._inflights = new a();
                }
                u.prototype.put = function(e, t) {
                    return this._inflights.set(e.messageId, e), t && t(), this;
                }, u.prototype.createStream = function() {
                    var e = new i(o), t = !1, n = [], s = 0;
                    return this._inflights.forEach(function(e, t) {
                        n.push(e);
                    }), e._read = function() {
                        !t && s < n.length ? this.push(n[s++]) : this.push(null);
                    }, e.destroy = function() {
                        if (!t) {
                            var e = this;
                            t = !0, r.nextTick(function() {
                                e.emit("close");
                            });
                        }
                    }, e;
                }, u.prototype.del = function(e, t) {
                    return (e = this._inflights.get(e.messageId)) ? (this._inflights.delete(e.messageId), 
                    t(null, e)) : t && t(new Error("missing packet")), this;
                }, u.prototype.get = function(e, t) {
                    return (e = this._inflights.get(e.messageId)) ? t(null, e) : t && t(new Error("missing packet")), 
                    this;
                }, u.prototype.close = function(e) {
                    this.options.clean && (this._inflights = null), e && e();
                }, t.exports = u;
            }).call(this, e("_process"));
        }, {
            _process: 92,
            "es6-map": 67,
            "readable-stream": 108,
            xtend: 121
        } ],
        8: [ function(e, t, r) {
            function n(e) {
                for (var t = e.split("/"), r = 0; r < t.length; r++) if ("+" !== t[r]) {
                    if ("#" === t[r]) return r === t.length - 1;
                    if (-1 !== t[r].indexOf("+") || -1 !== t[r].indexOf("#")) return !1;
                }
                return !0;
            }
            t.exports = {
                validateTopics: function(e) {
                    if (0 === e.length) return "empty_topic_list";
                    for (var t = 0; t < e.length; t++) if (!n(e[t])) return e[t];
                    return null;
                }
            };
        }, {} ],
        9: [ function(t, r, n) {
            (function(n) {
                var i = t("../client"), o = t("../store"), s = t("url"), a = t("xtend"), u = {};
                function c(t, r) {
                    if ("object" !== e(t) || r || (r = t, t = null), r = r || {}, t) {
                        var n = s.parse(t, !0);
                        if (null != n.port && (n.port = Number(n.port)), null === (r = a(n, r)).protocol) throw new Error("Missing protocol");
                        r.protocol = r.protocol.replace(/:$/, "");
                    }
                    if (function(e) {
                        var t;
                        e.auth && ((t = e.auth.match(/^(.+):(.+)$/)) ? (e.username = t[1], e.password = t[2]) : e.username = e.auth);
                    }(r), r.query && "string" == typeof r.query.clientId && (r.clientId = r.query.clientId), 
                    r.cert && r.key) {
                        if (!r.protocol) throw new Error("Missing secure protocol key");
                        if (-1 === [ "mqtts", "wss", "wxs", "alis" ].indexOf(r.protocol)) switch (r.protocol) {
                          case "mqtt":
                            r.protocol = "mqtts";
                            break;

                          case "ws":
                            r.protocol = "wss";
                            break;

                          case "wx":
                            r.protocol = "wxs";
                            break;

                          case "ali":
                            r.protocol = "alis";
                            break;

                          default:
                            throw new Error('Unknown protocol for secure connection: "' + r.protocol + '"!');
                        }
                    }
                    if (!u[r.protocol]) {
                        var o = -1 !== [ "mqtts", "wss" ].indexOf(r.protocol);
                        r.protocol = [ "mqtt", "mqtts", "ws", "wss", "wx", "wxs", "ali", "alis" ].filter(function(e, t) {
                            return (!o || t % 2 != 0) && "function" == typeof u[e];
                        })[0];
                    }
                    if (!1 === r.clean && !r.clientId) throw new Error("Missing clientId for unclean clients");
                    return r.protocol && (r.defaultProtocol = r.protocol), new i(function(e) {
                        return r.servers && (e._reconnectCount && e._reconnectCount !== r.servers.length || (e._reconnectCount = 0), 
                        r.host = r.servers[e._reconnectCount].host, r.port = r.servers[e._reconnectCount].port, 
                        r.protocol = r.servers[e._reconnectCount].protocol ? r.servers[e._reconnectCount].protocol : r.defaultProtocol, 
                        r.hostname = r.host, e._reconnectCount++), u[r.protocol](e, r);
                    }, r);
                }
                "browser" !== n.title ? (u.mqtt = t("./tcp"), u.tcp = t("./tcp"), u.ssl = t("./tls"), 
                u.tls = t("./tls"), u.mqtts = t("./tls")) : (u.wx = t("./wx"), u.wxs = t("./wx"), 
                u.ali = t("./ali"), u.alis = t("./ali")), u.ws = t("./ws"), u.wss = t("./ws"), r.exports = c, 
                r.exports.connect = c, r.exports.MqttClient = i, r.exports.Store = o;
            }).call(this, t("_process"));
        }, {
            "../client": 1,
            "../store": 7,
            "./ali": 2,
            "./tcp": 3,
            "./tls": 4,
            "./ws": 5,
            "./wx": 6,
            _process: 92,
            url: 113,
            xtend: 121
        } ],
        10: [ function(e, t, r) {
            r.byteLength = function(e) {
                var t = c(e), r = t[0], n = t[1];
                return 3 * (r + n) / 4 - n;
            }, r.toByteArray = function(e) {
                for (var t, r = c(e), n = r[0], s = r[1], a = new o(function(e, t, r) {
                    return 3 * (t + r) / 4 - r;
                }(0, n, s)), u = 0, l = s > 0 ? n - 4 : n, f = 0; f < l; f += 4) t = i[e.charCodeAt(f)] << 18 | i[e.charCodeAt(f + 1)] << 12 | i[e.charCodeAt(f + 2)] << 6 | i[e.charCodeAt(f + 3)], 
                a[u++] = t >> 16 & 255, a[u++] = t >> 8 & 255, a[u++] = 255 & t;
                2 === s && (t = i[e.charCodeAt(f)] << 2 | i[e.charCodeAt(f + 1)] >> 4, a[u++] = 255 & t);
                1 === s && (t = i[e.charCodeAt(f)] << 10 | i[e.charCodeAt(f + 1)] << 4 | i[e.charCodeAt(f + 2)] >> 2, 
                a[u++] = t >> 8 & 255, a[u++] = 255 & t);
                return a;
            }, r.fromByteArray = function(e) {
                for (var t, r = e.length, i = r % 3, o = [], s = 0, a = r - i; s < a; s += 16383) o.push(l(e, s, s + 16383 > a ? a : s + 16383));
                1 === i ? (t = e[r - 1], o.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], 
                o.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
                return o.join("");
            };
            for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, u = s.length; a < u; ++a) n[a] = s[a], 
            i[s.charCodeAt(a)] = a;
            function c(e) {
                var t = e.length;
                if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                var r = e.indexOf("=");
                return -1 === r && (r = t), [ r, r === t ? 0 : 4 - r % 4 ];
            }
            function l(e, t, r) {
                for (var i, o, s = [], a = t; a < r; a += 3) i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), 
                s.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
                return s.join("");
            }
            i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
        }, {} ],
        11: [ function(e, t, r) {}, {} ],
        12: [ function(t, r, n) {
            var i = t("base64-js"), o = t("ieee754");
            n.Buffer = a, n.SlowBuffer = function(e) {
                +e != e && (e = 0);
                return a.alloc(+e);
            }, n.INSPECT_MAX_BYTES = 50;
            function s(e) {
                if (e > 2147483647) throw new RangeError('The value "' + e + '" is invalid for option "size"');
                var t = new Uint8Array(e);
                return t.__proto__ = a.prototype, t;
            }
            function a(e, t, r) {
                if ("number" == typeof e) {
                    if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
                    return l(e);
                }
                return u(e, t, r);
            }
            function u(t, r, n) {
                if ("string" == typeof t) return function(e, t) {
                    "string" == typeof t && "" !== t || (t = "utf8");
                    if (!a.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
                    var r = 0 | p(e, t), n = s(r), i = n.write(e, t);
                    i !== r && (n = n.slice(0, i));
                    return n;
                }(t, r);
                if (ArrayBuffer.isView(t)) return f(t);
                if (null == t) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + e(t));
                if (D(t, ArrayBuffer) || t && D(t.buffer, ArrayBuffer)) return function(e, t, r) {
                    if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
                    if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
                    var n;
                    n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r);
                    return n.__proto__ = a.prototype, n;
                }(t, r, n);
                if ("number" == typeof t) throw new TypeError('The "value" argument must not be of type number. Received type number');
                var i = t.valueOf && t.valueOf();
                if (null != i && i !== t) return a.from(i, r, n);
                var o = function(e) {
                    if (a.isBuffer(e)) {
                        var t = 0 | h(e.length), r = s(t);
                        return 0 === r.length || e.copy(r, 0, 0, t), r;
                    }
                    if (void 0 !== e.length) return "number" != typeof e.length || F(e.length) ? s(0) : f(e);
                    if ("Buffer" === e.type && Array.isArray(e.data)) return f(e.data);
                }(t);
                if (o) return o;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive]) return a.from(t[Symbol.toPrimitive]("string"), r, n);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + e(t));
            }
            function c(e) {
                if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
                if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
            }
            function l(e) {
                return c(e), s(e < 0 ? 0 : 0 | h(e));
            }
            function f(e) {
                for (var t = e.length < 0 ? 0 : 0 | h(e.length), r = s(t), n = 0; n < t; n += 1) r[n] = 255 & e[n];
                return r;
            }
            function h(e) {
                if (e >= 2147483647) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + 2147483647..toString(16) + " bytes");
                return 0 | e;
            }
            function p(t, r) {
                if (a.isBuffer(t)) return t.length;
                if (ArrayBuffer.isView(t) || D(t, ArrayBuffer)) return t.byteLength;
                if ("string" != typeof t) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + e(t));
                var n = t.length, i = arguments.length > 2 && !0 === arguments[2];
                if (!i && 0 === n) return 0;
                for (var o = !1; ;) switch (r) {
                  case "ascii":
                  case "latin1":
                  case "binary":
                    return n;

                  case "utf8":
                  case "utf-8":
                    return L(t).length;

                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return 2 * n;

                  case "hex":
                    return n >>> 1;

                  case "base64":
                    return U(t).length;

                  default:
                    if (o) return i ? -1 : L(t).length;
                    r = ("" + r).toLowerCase(), o = !0;
                }
            }
            function d(e, t, r) {
                var n = !1;
                if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                if ((r >>>= 0) <= (t >>>= 0)) return "";
                for (e || (e = "utf8"); ;) switch (e) {
                  case "hex":
                    return j(this, t, r);

                  case "utf8":
                  case "utf-8":
                    return k(this, t, r);

                  case "ascii":
                    return I(this, t, r);

                  case "latin1":
                  case "binary":
                    return O(this, t, r);

                  case "base64":
                    return E(this, t, r);

                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return T(this, t, r);

                  default:
                    if (n) throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(), n = !0;
                }
            }
            function g(e, t, r) {
                var n = e[t];
                e[t] = e[r], e[r] = n;
            }
            function b(e, t, r, n, i) {
                if (0 === e.length) return -1;
                if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), 
                F(r = +r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                    if (i) return -1;
                    r = e.length - 1;
                } else if (r < 0) {
                    if (!i) return -1;
                    r = 0;
                }
                if ("string" == typeof t && (t = a.from(t, n)), a.isBuffer(t)) return 0 === t.length ? -1 : y(e, t, r, n, i);
                if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : y(e, [ t ], r, n, i);
                throw new TypeError("val must be string, number or Buffer");
            }
            function y(e, t, r, n, i) {
                var o, s = 1, a = e.length, u = t.length;
                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (e.length < 2 || t.length < 2) return -1;
                    s = 2, a /= 2, u /= 2, r /= 2;
                }
                function c(e, t) {
                    return 1 === s ? e[t] : e.readUInt16BE(t * s);
                }
                if (i) {
                    var l = -1;
                    for (o = r; o < a; o++) if (c(e, o) === c(t, -1 === l ? 0 : o - l)) {
                        if (-1 === l && (l = o), o - l + 1 === u) return l * s;
                    } else -1 !== l && (o -= o - l), l = -1;
                } else for (r + u > a && (r = a - u), o = r; o >= 0; o--) {
                    for (var f = !0, h = 0; h < u; h++) if (c(e, o + h) !== c(t, h)) {
                        f = !1;
                        break;
                    }
                    if (f) return o;
                }
                return -1;
            }
            function _(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                n ? (n = Number(n)) > i && (n = i) : n = i;
                var o = t.length;
                n > o / 2 && (n = o / 2);
                for (var s = 0; s < n; ++s) {
                    var a = parseInt(t.substr(2 * s, 2), 16);
                    if (F(a)) return s;
                    e[r + s] = a;
                }
                return s;
            }
            function m(e, t, r, n) {
                return q(L(t, e.length - r), e, r, n);
            }
            function v(e, t, r, n) {
                return q(function(e) {
                    for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                    return t;
                }(t), e, r, n);
            }
            function w(e, t, r, n) {
                return v(e, t, r, n);
            }
            function S(e, t, r, n) {
                return q(U(t), e, r, n);
            }
            function x(e, t, r, n) {
                return q(function(e, t) {
                    for (var r, n, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), 
                    n = r >> 8, i = r % 256, o.push(i), o.push(n);
                    return o;
                }(t, e.length - r), e, r, n);
            }
            function E(e, t, r) {
                return 0 === t && r === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, r));
            }
            function k(e, t, r) {
                r = Math.min(e.length, r);
                for (var n = [], i = t; i < r; ) {
                    var o, s, a, u, c = e[i], l = null, f = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                    if (i + f <= r) switch (f) {
                      case 1:
                        c < 128 && (l = c);
                        break;

                      case 2:
                        128 == (192 & (o = e[i + 1])) && (u = (31 & c) << 6 | 63 & o) > 127 && (l = u);
                        break;

                      case 3:
                        o = e[i + 1], s = e[i + 2], 128 == (192 & o) && 128 == (192 & s) && (u = (15 & c) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (u < 55296 || u > 57343) && (l = u);
                        break;

                      case 4:
                        o = e[i + 1], s = e[i + 2], a = e[i + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (u = (15 & c) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && u < 1114112 && (l = u);
                    }
                    null === l ? (l = 65533, f = 1) : l > 65535 && (l -= 65536, n.push(l >>> 10 & 1023 | 55296), 
                    l = 56320 | 1023 & l), n.push(l), i += f;
                }
                return function(e) {
                    var t = e.length;
                    if (t <= 4096) return String.fromCharCode.apply(String, e);
                    var r = "", n = 0;
                    for (;n < t; ) r += String.fromCharCode.apply(String, e.slice(n, n += 4096));
                    return r;
                }(n);
            }
            n.kMaxLength = 2147483647, a.TYPED_ARRAY_SUPPORT = function() {
                try {
                    var e = new Uint8Array(1);
                    return e.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42;
                        }
                    }, 42 === e.foo();
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    return !1;
                }
            }(), a.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), 
            Object.defineProperty(a.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (a.isBuffer(this)) return this.buffer;
                }
            }), Object.defineProperty(a.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (a.isBuffer(this)) return this.byteOffset;
                }
            }), "undefined" != typeof Symbol && null != Symbol.species && a[Symbol.species] === a && Object.defineProperty(a, Symbol.species, {
                value: null,
                configurable: !0,
                enumerable: !1,
                writable: !1
            }), a.poolSize = 8192, a.from = function(e, t, r) {
                return u(e, t, r);
            }, a.prototype.__proto__ = Uint8Array.prototype, a.__proto__ = Uint8Array, a.alloc = function(e, t, r) {
                return function(e, t, r) {
                    return c(e), e <= 0 ? s(e) : void 0 !== t ? "string" == typeof r ? s(e).fill(t, r) : s(e).fill(t) : s(e);
                }(e, t, r);
            }, a.allocUnsafe = function(e) {
                return l(e);
            }, a.allocUnsafeSlow = function(e) {
                return l(e);
            }, a.isBuffer = function(e) {
                return null != e && !0 === e._isBuffer && e !== a.prototype;
            }, a.compare = function(e, t) {
                if (D(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)), D(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)), 
                !a.isBuffer(e) || !a.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (e === t) return 0;
                for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i) if (e[i] !== t[i]) {
                    r = e[i], n = t[i];
                    break;
                }
                return r < n ? -1 : n < r ? 1 : 0;
            }, a.isEncoding = function(e) {
                switch (String(e).toLowerCase()) {
                  case "hex":
                  case "utf8":
                  case "utf-8":
                  case "ascii":
                  case "latin1":
                  case "binary":
                  case "base64":
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return !0;

                  default:
                    return !1;
                }
            }, a.concat = function(e, t) {
                if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length) return a.alloc(0);
                var r;
                if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                var n = a.allocUnsafe(t), i = 0;
                for (r = 0; r < e.length; ++r) {
                    var o = e[r];
                    if (D(o, Uint8Array) && (o = a.from(o)), !a.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
                    o.copy(n, i), i += o.length;
                }
                return n;
            }, a.byteLength = p, a.prototype._isBuffer = !0, a.prototype.swap16 = function() {
                var e = this.length;
                if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var t = 0; t < e; t += 2) g(this, t, t + 1);
                return this;
            }, a.prototype.swap32 = function() {
                var e = this.length;
                if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var t = 0; t < e; t += 4) g(this, t, t + 3), g(this, t + 1, t + 2);
                return this;
            }, a.prototype.swap64 = function() {
                var e = this.length;
                if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var t = 0; t < e; t += 8) g(this, t, t + 7), g(this, t + 1, t + 6), g(this, t + 2, t + 5), 
                g(this, t + 3, t + 4);
                return this;
            }, a.prototype.toString = function() {
                var e = this.length;
                return 0 === e ? "" : 0 === arguments.length ? k(this, 0, e) : d.apply(this, arguments);
            }, a.prototype.toLocaleString = a.prototype.toString, a.prototype.equals = function(e) {
                if (!a.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === a.compare(this, e);
            }, a.prototype.inspect = function() {
                var e = "", t = n.INSPECT_MAX_BYTES;
                return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), 
                "<Buffer " + e + ">";
            }, a.prototype.compare = function(t, r, n, i, o) {
                if (D(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)), !a.isBuffer(t)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + e(t));
                if (void 0 === r && (r = 0), void 0 === n && (n = t ? t.length : 0), void 0 === i && (i = 0), 
                void 0 === o && (o = this.length), r < 0 || n > t.length || i < 0 || o > this.length) throw new RangeError("out of range index");
                if (i >= o && r >= n) return 0;
                if (i >= o) return -1;
                if (r >= n) return 1;
                if (this === t) return 0;
                for (var s = (o >>>= 0) - (i >>>= 0), u = (n >>>= 0) - (r >>>= 0), c = Math.min(s, u), l = this.slice(i, o), f = t.slice(r, n), h = 0; h < c; ++h) if (l[h] !== f[h]) {
                    s = l[h], u = f[h];
                    break;
                }
                return s < u ? -1 : u < s ? 1 : 0;
            }, a.prototype.includes = function(e, t, r) {
                return -1 !== this.indexOf(e, t, r);
            }, a.prototype.indexOf = function(e, t, r) {
                return b(this, e, t, r, !0);
            }, a.prototype.lastIndexOf = function(e, t, r) {
                return b(this, e, t, r, !1);
            }, a.prototype.write = function(e, t, r, n) {
                if (void 0 === t) n = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) n = t, 
                r = this.length, t = 0; else {
                    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
                }
                var i = this.length - t;
                if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                n || (n = "utf8");
                for (var o = !1; ;) switch (n) {
                  case "hex":
                    return _(this, e, t, r);

                  case "utf8":
                  case "utf-8":
                    return m(this, e, t, r);

                  case "ascii":
                    return v(this, e, t, r);

                  case "latin1":
                  case "binary":
                    return w(this, e, t, r);

                  case "base64":
                    return S(this, e, t, r);

                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return x(this, e, t, r);

                  default:
                    if (o) throw new TypeError("Unknown encoding: " + n);
                    n = ("" + n).toLowerCase(), o = !0;
                }
            }, a.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                };
            };
            function I(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
                return n;
            }
            function O(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
                return n;
            }
            function j(e, t, r) {
                var n = e.length;
                (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
                for (var i = "", o = t; o < r; ++o) i += N(e[o]);
                return i;
            }
            function T(e, t, r) {
                for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                return i;
            }
            function A(e, t, r) {
                if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
            }
            function P(e, t, r, n, i, o) {
                if (!a.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
                if (r + n > e.length) throw new RangeError("Index out of range");
            }
            function C(e, t, r, n, i, o) {
                if (r + n > e.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range");
            }
            function M(e, t, r, n, i) {
                return t = +t, r >>>= 0, i || C(e, 0, r, 4), o.write(e, t, r, n, 23, 4), r + 4;
            }
            function B(e, t, r, n, i) {
                return t = +t, r >>>= 0, i || C(e, 0, r, 8), o.write(e, t, r, n, 52, 8), r + 8;
            }
            a.prototype.slice = function(e, t) {
                var r = this.length;
                (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), 
                t < e && (t = e);
                var n = this.subarray(e, t);
                return n.__proto__ = a.prototype, n;
            }, a.prototype.readUIntLE = function(e, t, r) {
                e >>>= 0, t >>>= 0, r || A(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); ) n += this[e + o] * i;
                return n;
            }, a.prototype.readUIntBE = function(e, t, r) {
                e >>>= 0, t >>>= 0, r || A(e, t, this.length);
                for (var n = this[e + --t], i = 1; t > 0 && (i *= 256); ) n += this[e + --t] * i;
                return n;
            }, a.prototype.readUInt8 = function(e, t) {
                return e >>>= 0, t || A(e, 1, this.length), this[e];
            }, a.prototype.readUInt16LE = function(e, t) {
                return e >>>= 0, t || A(e, 2, this.length), this[e] | this[e + 1] << 8;
            }, a.prototype.readUInt16BE = function(e, t) {
                return e >>>= 0, t || A(e, 2, this.length), this[e] << 8 | this[e + 1];
            }, a.prototype.readUInt32LE = function(e, t) {
                return e >>>= 0, t || A(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
            }, a.prototype.readUInt32BE = function(e, t) {
                return e >>>= 0, t || A(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
            }, a.prototype.readIntLE = function(e, t, r) {
                e >>>= 0, t >>>= 0, r || A(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256); ) n += this[e + o] * i;
                return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;
            }, a.prototype.readIntBE = function(e, t, r) {
                e >>>= 0, t >>>= 0, r || A(e, t, this.length);
                for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256); ) o += this[e + --n] * i;
                return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
            }, a.prototype.readInt8 = function(e, t) {
                return e >>>= 0, t || A(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
            }, a.prototype.readInt16LE = function(e, t) {
                e >>>= 0, t || A(e, 2, this.length);
                var r = this[e] | this[e + 1] << 8;
                return 32768 & r ? 4294901760 | r : r;
            }, a.prototype.readInt16BE = function(e, t) {
                e >>>= 0, t || A(e, 2, this.length);
                var r = this[e + 1] | this[e] << 8;
                return 32768 & r ? 4294901760 | r : r;
            }, a.prototype.readInt32LE = function(e, t) {
                return e >>>= 0, t || A(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
            }, a.prototype.readInt32BE = function(e, t) {
                return e >>>= 0, t || A(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
            }, a.prototype.readFloatLE = function(e, t) {
                return e >>>= 0, t || A(e, 4, this.length), o.read(this, e, !0, 23, 4);
            }, a.prototype.readFloatBE = function(e, t) {
                return e >>>= 0, t || A(e, 4, this.length), o.read(this, e, !1, 23, 4);
            }, a.prototype.readDoubleLE = function(e, t) {
                return e >>>= 0, t || A(e, 8, this.length), o.read(this, e, !0, 52, 8);
            }, a.prototype.readDoubleBE = function(e, t) {
                return e >>>= 0, t || A(e, 8, this.length), o.read(this, e, !1, 52, 8);
            }, a.prototype.writeUIntLE = function(e, t, r, n) {
                (e = +e, t >>>= 0, r >>>= 0, n) || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                var i = 1, o = 0;
                for (this[t] = 255 & e; ++o < r && (i *= 256); ) this[t + o] = e / i & 255;
                return t + r;
            }, a.prototype.writeUIntBE = function(e, t, r, n) {
                (e = +e, t >>>= 0, r >>>= 0, n) || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
                var i = r - 1, o = 1;
                for (this[t + i] = 255 & e; --i >= 0 && (o *= 256); ) this[t + i] = e / o & 255;
                return t + r;
            }, a.prototype.writeUInt8 = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1;
            }, a.prototype.writeUInt16LE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, 
                t + 2;
            }, a.prototype.writeUInt16BE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, 
                t + 2;
            }, a.prototype.writeUInt32LE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, 
                this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4;
            }, a.prototype.writeUInt32BE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, 
                this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
            }, a.prototype.writeIntLE = function(e, t, r, n) {
                if (e = +e, t >>>= 0, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    P(this, e, t, r, i - 1, -i);
                }
                var o = 0, s = 1, a = 0;
                for (this[t] = 255 & e; ++o < r && (s *= 256); ) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), 
                this[t + o] = (e / s >> 0) - a & 255;
                return t + r;
            }, a.prototype.writeIntBE = function(e, t, r, n) {
                if (e = +e, t >>>= 0, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    P(this, e, t, r, i - 1, -i);
                }
                var o = r - 1, s = 1, a = 0;
                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256); ) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), 
                this[t + o] = (e / s >> 0) - a & 255;
                return t + r;
            }, a.prototype.writeInt8 = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), 
                this[t] = 255 & e, t + 1;
            }, a.prototype.writeInt16LE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 2, 32767, -32768), this[t] = 255 & e, 
                this[t + 1] = e >>> 8, t + 2;
            }, a.prototype.writeInt16BE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, 
                this[t + 1] = 255 & e, t + 2;
            }, a.prototype.writeInt32LE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, 
                this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
            }, a.prototype.writeInt32BE = function(e, t, r) {
                return e = +e, t >>>= 0, r || P(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), 
                this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, 
                t + 4;
            }, a.prototype.writeFloatLE = function(e, t, r) {
                return M(this, e, t, !0, r);
            }, a.prototype.writeFloatBE = function(e, t, r) {
                return M(this, e, t, !1, r);
            }, a.prototype.writeDoubleLE = function(e, t, r) {
                return B(this, e, t, !0, r);
            }, a.prototype.writeDoubleBE = function(e, t, r) {
                return B(this, e, t, !1, r);
            }, a.prototype.copy = function(e, t, r, n) {
                if (!a.isBuffer(e)) throw new TypeError("argument should be a Buffer");
                if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), 
                t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
                if (0 === e.length || 0 === this.length) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
                if (n < 0) throw new RangeError("sourceEnd out of bounds");
                n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                var i = n - r;
                if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, n); else if (this === e && r < t && t < n) for (var o = i - 1; o >= 0; --o) e[o + t] = this[o + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
                return i;
            }, a.prototype.fill = function(e, t, r, n) {
                if ("string" == typeof e) {
                    if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, 
                    r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                    if ("string" == typeof n && !a.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
                    if (1 === e.length) {
                        var i = e.charCodeAt(0);
                        ("utf8" === n && i < 128 || "latin1" === n) && (e = i);
                    }
                } else "number" == typeof e && (e &= 255);
                if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                if (r <= t) return this;
                var o;
                if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e; else {
                    var s = a.isBuffer(e) ? e : a.from(e, n), u = s.length;
                    if (0 === u) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
                    for (o = 0; o < r - t; ++o) this[o + t] = s[o % u];
                }
                return this;
            };
            var R = /[^+/0-9A-Za-z-_]/g;
            function N(e) {
                return e < 16 ? "0" + e.toString(16) : e.toString(16);
            }
            function L(e, t) {
                var r;
                t = t || 1 / 0;
                for (var n = e.length, i = null, o = [], s = 0; s < n; ++s) {
                    if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                        if (!i) {
                            if (r > 56319) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue;
                            }
                            if (s + 1 === n) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue;
                            }
                            i = r;
                            continue;
                        }
                        if (r < 56320) {
                            (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                            continue;
                        }
                        r = 65536 + (i - 55296 << 10 | r - 56320);
                    } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                    if (i = null, r < 128) {
                        if ((t -= 1) < 0) break;
                        o.push(r);
                    } else if (r < 2048) {
                        if ((t -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128);
                    } else if (r < 65536) {
                        if ((t -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
                    } else {
                        if (!(r < 1114112)) throw new Error("Invalid code point");
                        if ((t -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
                    }
                }
                return o;
            }
            function U(e) {
                return i.toByteArray(function(e) {
                    if ((e = (e = e.split("=")[0]).trim().replace(R, "")).length < 2) return "";
                    for (;e.length % 4 != 0; ) e += "=";
                    return e;
                }(e));
            }
            function q(e, t, r, n) {
                for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
                return i;
            }
            function D(e, t) {
                return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name;
            }
            function F(e) {
                return e != e;
            }
        }, {
            "base64-js": 10,
            ieee754: 79
        } ],
        13: [ function(t, r, n) {
            var i = Object.create || function(e) {
                var t = function() {};
                return t.prototype = e, new t();
            }, o = Object.keys || function(e) {
                var t = [];
                for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
                return r;
            }, s = Function.prototype.bind || function(e) {
                var t = this;
                return function() {
                    return t.apply(e, arguments);
                };
            };
            function a() {
                this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = i(null), 
                this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
            }
            r.exports = a, a.EventEmitter = a, a.prototype._events = void 0, a.prototype._maxListeners = void 0;
            var u, c = 10;
            try {
                var l = {};
                Object.defineProperty && Object.defineProperty(l, "x", {
                    value: 0
                }), u = 0 === l.x;
            } catch (e) {
                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                u = !1;
            }
            function f(e) {
                return void 0 === e._maxListeners ? a.defaultMaxListeners : e._maxListeners;
            }
            function h(e, t, r) {
                if (t) e.call(r); else for (var n = e.length, i = S(e, n), o = 0; o < n; ++o) i[o].call(r);
            }
            function p(e, t, r, n) {
                if (t) e.call(r, n); else for (var i = e.length, o = S(e, i), s = 0; s < i; ++s) o[s].call(r, n);
            }
            function d(e, t, r, n, i) {
                if (t) e.call(r, n, i); else for (var o = e.length, s = S(e, o), a = 0; a < o; ++a) s[a].call(r, n, i);
            }
            function g(e, t, r, n, i, o) {
                if (t) e.call(r, n, i, o); else for (var s = e.length, a = S(e, s), u = 0; u < s; ++u) a[u].call(r, n, i, o);
            }
            function b(e, t, r, n) {
                if (t) e.apply(r, n); else for (var i = e.length, o = S(e, i), s = 0; s < i; ++s) o[s].apply(r, n);
            }
            function y(t, r, n, o) {
                var s, a, u;
                if ("function" != typeof n) throw new TypeError('"listener" argument must be a function');
                if ((a = t._events) ? (a.newListener && (t.emit("newListener", r, n.listener ? n.listener : n), 
                a = t._events), u = a[r]) : (a = t._events = i(null), t._eventsCount = 0), u) {
                    if ("function" == typeof u ? u = a[r] = o ? [ n, u ] : [ u, n ] : o ? u.unshift(n) : u.push(n), 
                    !u.warned && (s = f(t)) && s > 0 && u.length > s) {
                        u.warned = !0;
                        var c = new Error("Possible EventEmitter memory leak detected. " + u.length + ' "' + String(r) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
                        c.name = "MaxListenersExceededWarning", c.emitter = t, c.type = r, c.count = u.length, 
                        "object" === ("undefined" == typeof console ? "undefined" : e(console)) && console.warn && console.warn("%s: %s", c.name, c.message);
                    }
                } else u = a[r] = n, ++t._eventsCount;
                return t;
            }
            function _() {
                if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 
                arguments.length) {
                  case 0:
                    return this.listener.call(this.target);

                  case 1:
                    return this.listener.call(this.target, arguments[0]);

                  case 2:
                    return this.listener.call(this.target, arguments[0], arguments[1]);

                  case 3:
                    return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);

                  default:
                    for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) e[t] = arguments[t];
                    this.listener.apply(this.target, e);
                }
            }
            function m(e, t, r) {
                var n = {
                    fired: !1,
                    wrapFn: void 0,
                    target: e,
                    type: t,
                    listener: r
                }, i = s.call(_, n);
                return i.listener = r, n.wrapFn = i, i;
            }
            function v(e, t, r) {
                var n = e._events;
                if (!n) return [];
                var i = n[t];
                return i ? "function" == typeof i ? r ? [ i.listener || i ] : [ i ] : r ? function(e) {
                    for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
                    return t;
                }(i) : S(i, i.length) : [];
            }
            function w(e) {
                var t = this._events;
                if (t) {
                    var r = t[e];
                    if ("function" == typeof r) return 1;
                    if (r) return r.length;
                }
                return 0;
            }
            function S(e, t) {
                for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
                return r;
            }
            u ? Object.defineProperty(a, "defaultMaxListeners", {
                enumerable: !0,
                get: function() {
                    return c;
                },
                set: function(e) {
                    if ("number" != typeof e || e < 0 || e != e) throw new TypeError('"defaultMaxListeners" must be a positive number');
                    c = e;
                }
            }) : a.defaultMaxListeners = c, a.prototype.setMaxListeners = function(e) {
                if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
                return this._maxListeners = e, this;
            }, a.prototype.getMaxListeners = function() {
                return f(this);
            }, a.prototype.emit = function(e) {
                var t, r, n, i, o, s, a = "error" === e;
                if (s = this._events) a = a && null == s.error; else if (!a) return !1;
                if (a) {
                    if (arguments.length > 1 && (t = arguments[1]), t instanceof Error) throw t;
                    var u = new Error('Unhandled "error" event. (' + t + ")");
                    throw u.context = t, u;
                }
                if (!(r = s[e])) return !1;
                var c = "function" == typeof r;
                switch (n = arguments.length) {
                  case 1:
                    h(r, c, this);
                    break;

                  case 2:
                    p(r, c, this, arguments[1]);
                    break;

                  case 3:
                    d(r, c, this, arguments[1], arguments[2]);
                    break;

                  case 4:
                    g(r, c, this, arguments[1], arguments[2], arguments[3]);
                    break;

                  default:
                    for (i = new Array(n - 1), o = 1; o < n; o++) i[o - 1] = arguments[o];
                    b(r, c, this, i);
                }
                return !0;
            }, a.prototype.addListener = function(e, t) {
                return y(this, e, t, !1);
            }, a.prototype.on = a.prototype.addListener, a.prototype.prependListener = function(e, t) {
                return y(this, e, t, !0);
            }, a.prototype.once = function(e, t) {
                if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
                return this.on(e, m(this, e, t)), this;
            }, a.prototype.prependOnceListener = function(e, t) {
                if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
                return this.prependListener(e, m(this, e, t)), this;
            }, a.prototype.removeListener = function(e, t) {
                var r, n, o, s, a;
                if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
                if (!(n = this._events)) return this;
                if (!(r = n[e])) return this;
                if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = i(null) : (delete n[e], 
                n.removeListener && this.emit("removeListener", e, r.listener || t)); else if ("function" != typeof r) {
                    for (o = -1, s = r.length - 1; s >= 0; s--) if (r[s] === t || r[s].listener === t) {
                        a = r[s].listener, o = s;
                        break;
                    }
                    if (o < 0) return this;
                    0 === o ? r.shift() : function(e, t) {
                        for (var r = t, n = r + 1, i = e.length; n < i; r += 1, n += 1) e[r] = e[n];
                        e.pop();
                    }(r, o), 1 === r.length && (n[e] = r[0]), n.removeListener && this.emit("removeListener", e, a || t);
                }
                return this;
            }, a.prototype.removeAllListeners = function(e) {
                var t, r, n;
                if (!(r = this._events)) return this;
                if (!r.removeListener) return 0 === arguments.length ? (this._events = i(null), 
                this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = i(null) : delete r[e]), 
                this;
                if (0 === arguments.length) {
                    var s, a = o(r);
                    for (n = 0; n < a.length; ++n) "removeListener" !== (s = a[n]) && this.removeAllListeners(s);
                    return this.removeAllListeners("removeListener"), this._events = i(null), this._eventsCount = 0, 
                    this;
                }
                if ("function" == typeof (t = r[e])) this.removeListener(e, t); else if (t) for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
                return this;
            }, a.prototype.listeners = function(e) {
                return v(this, e, !0);
            }, a.prototype.rawListeners = function(e) {
                return v(this, e, !1);
            }, a.listenerCount = function(e, t) {
                return "function" == typeof e.listenerCount ? e.listenerCount(t) : w.call(e, t);
            }, a.prototype.listenerCount = w, a.prototype.eventNames = function() {
                return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
            };
        }, {} ],
        14: [ function(t, r, n) {
            (function(t) {
                function r(e) {
                    return Object.prototype.toString.call(e);
                }
                n.isArray = function(e) {
                    return Array.isArray ? Array.isArray(e) : "[object Array]" === r(e);
                }, n.isBoolean = function(e) {
                    return "boolean" == typeof e;
                }, n.isNull = function(e) {
                    return null === e;
                }, n.isNullOrUndefined = function(e) {
                    return null == e;
                }, n.isNumber = function(e) {
                    return "number" == typeof e;
                }, n.isString = function(e) {
                    return "string" == typeof e;
                }, n.isSymbol = function(t) {
                    return "symbol" === e(t);
                }, n.isUndefined = function(e) {
                    return void 0 === e;
                }, n.isRegExp = function(e) {
                    return "[object RegExp]" === r(e);
                }, n.isObject = function(t) {
                    return "object" === e(t) && null !== t;
                }, n.isDate = function(e) {
                    return "[object Date]" === r(e);
                }, n.isError = function(e) {
                    return "[object Error]" === r(e) || e instanceof Error;
                }, n.isFunction = function(e) {
                    return "function" == typeof e;
                }, n.isPrimitive = function(t) {
                    return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" === e(t) || void 0 === t;
                }, n.isBuffer = t.isBuffer;
            }).call(this, {
                isBuffer: t("../../is-buffer/index.js")
            });
        }, {
            "../../is-buffer/index.js": 81
        } ],
        15: [ function(e, t, r) {
            var n, i = e("es5-ext/object/copy"), o = e("es5-ext/object/normalize-options"), s = e("es5-ext/object/valid-callable"), a = e("es5-ext/object/map"), u = e("es5-ext/object/valid-callable"), c = e("es5-ext/object/valid-value"), l = Function.prototype.bind, f = Object.defineProperty, h = Object.prototype.hasOwnProperty;
            n = function(e, t, r) {
                var n, o = c(t) && u(t.value);
                return delete (n = i(t)).writable, delete n.value, n.get = function() {
                    return !r.overwriteDefinition && h.call(this, e) ? o : (t.value = l.call(o, r.resolveContext ? r.resolveContext(this) : this), 
                    f(this, e, t), this[e]);
                }, n;
            }, t.exports = function(e) {
                var t = o(arguments[1]);
                return null != t.resolveContext && s(t.resolveContext), a(e, function(e, r) {
                    return n(r, e, t);
                });
            };
        }, {
            "es5-ext/object/copy": 39,
            "es5-ext/object/map": 48,
            "es5-ext/object/normalize-options": 49,
            "es5-ext/object/valid-callable": 54,
            "es5-ext/object/valid-value": 55
        } ],
        16: [ function(e, t, r) {
            var n = e("es5-ext/object/assign"), i = e("es5-ext/object/normalize-options"), o = e("es5-ext/object/is-callable"), s = e("es5-ext/string/#/contains");
            (t.exports = function(e, t) {
                var r, o, a, u, c;
                return arguments.length < 2 || "string" != typeof e ? (u = t, t = e, e = null) : u = arguments[2], 
                null == e ? (r = a = !0, o = !1) : (r = s.call(e, "c"), o = s.call(e, "e"), a = s.call(e, "w")), 
                c = {
                    value: t,
                    configurable: r,
                    enumerable: o,
                    writable: a
                }, u ? n(i(u), c) : c;
            }).gs = function(e, t, r) {
                var a, u, c, l;
                return "string" != typeof e ? (c = r, r = t, t = e, e = null) : c = arguments[3], 
                null == t ? t = void 0 : o(t) ? null == r ? r = void 0 : o(r) || (c = r, r = void 0) : (c = t, 
                t = r = void 0), null == e ? (a = !0, u = !1) : (a = s.call(e, "c"), u = s.call(e, "e")), 
                l = {
                    get: t,
                    set: r,
                    configurable: a,
                    enumerable: u
                }, c ? n(i(c), l) : l;
            };
        }, {
            "es5-ext/object/assign": 36,
            "es5-ext/object/is-callable": 42,
            "es5-ext/object/normalize-options": 49,
            "es5-ext/string/#/contains": 56
        } ],
        17: [ function(e, t, r) {
            (function(r, n) {
                var i = e("readable-stream"), o = e("end-of-stream"), s = e("inherits"), a = e("stream-shift"), u = n.from && n.from !== Uint8Array.from ? n.from([ 0 ]) : new n([ 0 ]), c = function(e, t) {
                    e._corked ? e.once("uncork", t) : t();
                }, l = function(e, t) {
                    return function(r) {
                        r ? function(e, t) {
                            e._autoDestroy && e.destroy(t);
                        }(e, "premature close" === r.message ? null : r) : t && !e._ended && e.end();
                    };
                }, f = function e(t, r, n) {
                    if (!(this instanceof e)) return new e(t, r, n);
                    i.Duplex.call(this, n), this._writable = null, this._readable = null, this._readable2 = null, 
                    this._autoDestroy = !n || !1 !== n.autoDestroy, this._forwardDestroy = !n || !1 !== n.destroy, 
                    this._forwardEnd = !n || !1 !== n.end, this._corked = 1, this._ondrain = null, this._drained = !1, 
                    this._forwarding = !1, this._unwrite = null, this._unread = null, this._ended = !1, 
                    this.destroyed = !1, t && this.setWritable(t), r && this.setReadable(r);
                };
                s(f, i.Duplex), f.obj = function(e, t, r) {
                    return r || (r = {}), r.objectMode = !0, r.highWaterMark = 16, new f(e, t, r);
                }, f.prototype.cork = function() {
                    1 == ++this._corked && this.emit("cork");
                }, f.prototype.uncork = function() {
                    this._corked && 0 == --this._corked && this.emit("uncork");
                }, f.prototype.setWritable = function(e) {
                    if (this._unwrite && this._unwrite(), this.destroyed) e && e.destroy && e.destroy(); else if (null !== e && !1 !== e) {
                        var t = this, n = o(e, {
                            writable: !0,
                            readable: !1
                        }, l(this, this._forwardEnd)), i = function() {
                            var e = t._ondrain;
                            t._ondrain = null, e && e();
                        };
                        this._unwrite && r.nextTick(i), this._writable = e, this._writable.on("drain", i), 
                        this._unwrite = function() {
                            t._writable.removeListener("drain", i), n();
                        }, this.uncork();
                    } else this.end();
                }, f.prototype.setReadable = function(e) {
                    if (this._unread && this._unread(), this.destroyed) e && e.destroy && e.destroy(); else {
                        if (null === e || !1 === e) return this.push(null), void this.resume();
                        var t, r = this, n = o(e, {
                            writable: !1,
                            readable: !0
                        }, l(this)), s = function() {
                            r._forward();
                        }, a = function() {
                            r.push(null);
                        };
                        this._drained = !0, this._readable = e, this._readable2 = e._readableState ? e : (t = e, 
                        new i.Readable({
                            objectMode: !0,
                            highWaterMark: 16
                        }).wrap(t)), this._readable2.on("readable", s), this._readable2.on("end", a), this._unread = function() {
                            r._readable2.removeListener("readable", s), r._readable2.removeListener("end", a), 
                            n();
                        }, this._forward();
                    }
                }, f.prototype._read = function() {
                    this._drained = !0, this._forward();
                }, f.prototype._forward = function() {
                    if (!this._forwarding && this._readable2 && this._drained) {
                        var e;
                        for (this._forwarding = !0; this._drained && null !== (e = a(this._readable2)); ) this.destroyed || (this._drained = this.push(e));
                        this._forwarding = !1;
                    }
                }, f.prototype.destroy = function(e) {
                    if (!this.destroyed) {
                        this.destroyed = !0;
                        var t = this;
                        r.nextTick(function() {
                            t._destroy(e);
                        });
                    }
                }, f.prototype._destroy = function(e) {
                    if (e) {
                        var t = this._ondrain;
                        this._ondrain = null, t ? t(e) : this.emit("error", e);
                    }
                    this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), 
                    this._writable && this._writable.destroy && this._writable.destroy()), this.emit("close");
                }, f.prototype._write = function(e, t, r) {
                    return this.destroyed ? r() : this._corked ? c(this, this._write.bind(this, e, t, r)) : e === u ? this._finish(r) : this._writable ? void (!1 === this._writable.write(e) ? this._ondrain = r : r()) : r();
                }, f.prototype._finish = function(e) {
                    var t = this;
                    this.emit("preend"), c(this, function() {
                        var r, n;
                        r = t._forwardEnd && t._writable, n = function() {
                            !1 === t._writableState.prefinished && (t._writableState.prefinished = !0), t.emit("prefinish"), 
                            c(t, e);
                        }, r ? r._writableState && r._writableState.finished ? n() : r._writableState ? r.end(n) : (r.end(), 
                        n()) : n();
                    });
                }, f.prototype.end = function(e, t, r) {
                    return "function" == typeof e ? this.end(null, null, e) : "function" == typeof t ? this.end(e, null, t) : (this._ended = !0, 
                    e && this.write(e), this._writableState.ending || this.write(u), i.Writable.prototype.end.call(this, r));
                }, t.exports = f;
            }).call(this, e("_process"), e("buffer").Buffer);
        }, {
            _process: 92,
            buffer: 12,
            "end-of-stream": 18,
            inherits: 80,
            "readable-stream": 108,
            "stream-shift": 111
        } ],
        18: [ function(e, t, r) {
            var n = e("once"), i = function() {};
            t.exports = function e(t, r, o) {
                if ("function" == typeof r) return e(t, null, r);
                r || (r = {}), o = n(o || i);
                var s = t._writableState, a = t._readableState, u = r.readable || !1 !== r.readable && t.readable, c = r.writable || !1 !== r.writable && t.writable, l = function() {
                    t.writable || f();
                }, f = function() {
                    c = !1, u || o.call(t);
                }, h = function() {
                    u = !1, c || o.call(t);
                }, p = function(e) {
                    o.call(t, e ? new Error("exited with error code: " + e) : null);
                }, d = function(e) {
                    o.call(t, e);
                }, g = function() {
                    return (!u || a && a.ended) && (!c || s && s.ended) ? void 0 : o.call(t, new Error("premature close"));
                }, b = function() {
                    t.req.on("finish", f);
                };
                return !function(e) {
                    return e.setHeader && "function" == typeof e.abort;
                }(t) ? c && !s && (t.on("end", l), t.on("close", l)) : (t.on("complete", f), t.on("abort", g), 
                t.req ? b() : t.on("request", b)), function(e) {
                    return e.stdio && Array.isArray(e.stdio) && 3 === e.stdio.length;
                }(t) && t.on("exit", p), t.on("end", h), t.on("finish", f), !1 !== r.error && t.on("error", d), 
                t.on("close", g), function() {
                    t.removeListener("complete", f), t.removeListener("abort", g), t.removeListener("request", b), 
                    t.req && t.req.removeListener("finish", f), t.removeListener("end", l), t.removeListener("close", l), 
                    t.removeListener("finish", f), t.removeListener("exit", p), t.removeListener("end", h), 
                    t.removeListener("error", d), t.removeListener("close", g);
                };
            };
        }, {
            once: 90
        } ],
        19: [ function(e, t, r) {
            var n = e("../../object/valid-value");
            t.exports = function() {
                return n(this).length = 0, this;
            };
        }, {
            "../../object/valid-value": 55
        } ],
        20: [ function(e, t, r) {
            var n = e("../../number/is-nan"), i = e("../../number/to-pos-integer"), o = e("../../object/valid-value"), s = Array.prototype.indexOf, a = Object.prototype.hasOwnProperty, u = Math.abs, c = Math.floor;
            t.exports = function(e) {
                var t, r, l, f;
                if (!n(e)) return s.apply(this, arguments);
                for (r = i(o(this).length), l = arguments[1], t = l = isNaN(l) ? 0 : l >= 0 ? c(l) : i(this.length) - c(u(l)); t < r; ++t) if (a.call(this, t) && (f = this[t], 
                n(f))) return t;
                return -1;
            };
        }, {
            "../../number/is-nan": 30,
            "../../number/to-pos-integer": 34,
            "../../object/valid-value": 55
        } ],
        21: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Array.from : e("./shim");
        }, {
            "./is-implemented": 22,
            "./shim": 23
        } ],
        22: [ function(e, t, r) {
            t.exports = function() {
                var e, t, r = Array.from;
                return "function" == typeof r && (t = r(e = [ "raz", "dwa" ]), Boolean(t && t !== e && "dwa" === t[1]));
            };
        }, {} ],
        23: [ function(e, t, r) {
            var n = e("es6-symbol").iterator, i = e("../../function/is-arguments"), o = e("../../function/is-function"), s = e("../../number/to-pos-integer"), a = e("../../object/valid-callable"), u = e("../../object/valid-value"), c = e("../../object/is-value"), l = e("../../string/is-string"), f = Array.isArray, h = Function.prototype.call, p = {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: null
            }, d = Object.defineProperty;
            t.exports = function(e) {
                var t, r, g, b, y, _, m, v, w, S, x = arguments[1], E = arguments[2];
                if (e = Object(u(e)), c(x) && a(x), this && this !== Array && o(this)) t = this; else {
                    if (!x) {
                        if (i(e)) return 1 !== (y = e.length) ? Array.apply(null, e) : ((b = new Array(1))[0] = e[0], 
                        b);
                        if (f(e)) {
                            for (b = new Array(y = e.length), r = 0; r < y; ++r) b[r] = e[r];
                            return b;
                        }
                    }
                    b = [];
                }
                if (!f(e)) if (void 0 !== (w = e[n])) {
                    for (m = a(w).call(e), t && (b = new t()), v = m.next(), r = 0; !v.done; ) S = x ? h.call(x, E, v.value, r) : v.value, 
                    t ? (p.value = S, d(b, r, p)) : b[r] = S, v = m.next(), ++r;
                    y = r;
                } else if (l(e)) {
                    for (y = e.length, t && (b = new t()), r = 0, g = 0; r < y; ++r) S = e[r], r + 1 < y && (_ = S.charCodeAt(0)) >= 55296 && _ <= 56319 && (S += e[++r]), 
                    S = x ? h.call(x, E, S, g) : S, t ? (p.value = S, d(b, g, p)) : b[g] = S, ++g;
                    y = g;
                }
                if (void 0 === y) for (y = s(e.length), t && (b = new t(y)), r = 0; r < y; ++r) S = x ? h.call(x, E, e[r], r) : e[r], 
                t ? (p.value = S, d(b, r, p)) : b[r] = S;
                return t && (p.value = null, b.length = y), b;
            };
        }, {
            "../../function/is-arguments": 24,
            "../../function/is-function": 25,
            "../../number/to-pos-integer": 34,
            "../../object/is-value": 44,
            "../../object/valid-callable": 54,
            "../../object/valid-value": 55,
            "../../string/is-string": 59,
            "es6-symbol": 73
        } ],
        24: [ function(e, t, r) {
            var n = Object.prototype.toString, i = n.call(function() {
                return arguments;
            }());
            t.exports = function(e) {
                return n.call(e) === i;
            };
        }, {} ],
        25: [ function(e, t, r) {
            var n = Object.prototype.toString, i = n.call(e("./noop"));
            t.exports = function(e) {
                return "function" == typeof e && n.call(e) === i;
            };
        }, {
            "./noop": 26
        } ],
        26: [ function(e, t, r) {
            t.exports = function() {};
        }, {} ],
        27: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Math.sign : e("./shim");
        }, {
            "./is-implemented": 28,
            "./shim": 29
        } ],
        28: [ function(e, t, r) {
            t.exports = function() {
                var e = Math.sign;
                return "function" == typeof e && (1 === e(10) && -1 === e(-20));
            };
        }, {} ],
        29: [ function(e, t, r) {
            t.exports = function(e) {
                return e = Number(e), isNaN(e) || 0 === e ? e : e > 0 ? 1 : -1;
            };
        }, {} ],
        30: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Number.isNaN : e("./shim");
        }, {
            "./is-implemented": 31,
            "./shim": 32
        } ],
        31: [ function(e, t, r) {
            t.exports = function() {
                var e = Number.isNaN;
                return "function" == typeof e && (!e({}) && e(NaN) && !e(34));
            };
        }, {} ],
        32: [ function(e, t, r) {
            t.exports = function(e) {
                return e != e;
            };
        }, {} ],
        33: [ function(e, t, r) {
            var n = e("../math/sign"), i = Math.abs, o = Math.floor;
            t.exports = function(e) {
                return isNaN(e) ? 0 : 0 !== (e = Number(e)) && isFinite(e) ? n(e) * o(i(e)) : e;
            };
        }, {
            "../math/sign": 27
        } ],
        34: [ function(e, t, r) {
            var n = e("./to-integer"), i = Math.max;
            t.exports = function(e) {
                return i(0, n(e));
            };
        }, {
            "./to-integer": 33
        } ],
        35: [ function(e, t, r) {
            var n = e("./valid-callable"), i = e("./valid-value"), o = Function.prototype.bind, s = Function.prototype.call, a = Object.keys, u = Object.prototype.propertyIsEnumerable;
            t.exports = function(e, t) {
                return function(r, c) {
                    var l, f = arguments[2], h = arguments[3];
                    return r = Object(i(r)), n(c), l = a(r), h && l.sort("function" == typeof h ? o.call(h, r) : void 0), 
                    "function" != typeof e && (e = l[e]), s.call(e, l, function(e, n) {
                        return u.call(r, e) ? s.call(c, f, r[e], e, r, n) : t;
                    });
                };
            };
        }, {
            "./valid-callable": 54,
            "./valid-value": 55
        } ],
        36: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Object.assign : e("./shim");
        }, {
            "./is-implemented": 37,
            "./shim": 38
        } ],
        37: [ function(e, t, r) {
            t.exports = function() {
                var e, t = Object.assign;
                return "function" == typeof t && (t(e = {
                    foo: "raz"
                }, {
                    bar: "dwa"
                }, {
                    trzy: "trzy"
                }), e.foo + e.bar + e.trzy === "razdwatrzy");
            };
        }, {} ],
        38: [ function(e, t, r) {
            var n = e("../keys"), i = e("../valid-value"), o = Math.max;
            t.exports = function(e, t) {
                var r, s, a, u = o(arguments.length, 2);
                for (e = Object(i(e)), a = function(n) {
                    try {
                        e[n] = t[n];
                    } catch (e) {
                        e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                        r || (r = e);
                    }
                }, s = 1; s < u; ++s) n(t = arguments[s]).forEach(a);
                if (void 0 !== r) throw r;
                return e;
            };
        }, {
            "../keys": 45,
            "../valid-value": 55
        } ],
        39: [ function(e, t, r) {
            var n = e("../array/from"), i = e("./assign"), o = e("./valid-value");
            t.exports = function(e) {
                var t = Object(o(e)), r = arguments[1], s = Object(arguments[2]);
                if (t !== e && !r) return t;
                var a = {};
                return r ? n(r, function(t) {
                    (s.ensure || t in e) && (a[t] = e[t]);
                }) : i(a, e), a;
            };
        }, {
            "../array/from": 21,
            "./assign": 36,
            "./valid-value": 55
        } ],
        40: [ function(e, t, r) {
            var n, i, o, s, a = Object.create;
            e("./set-prototype-of/is-implemented")() || (n = e("./set-prototype-of/shim")), 
            t.exports = n ? 1 !== n.level ? a : (i = {}, o = {}, s = {
                configurable: !1,
                enumerable: !1,
                writable: !0,
                value: void 0
            }, Object.getOwnPropertyNames(Object.prototype).forEach(function(e) {
                o[e] = "__proto__" !== e ? s : {
                    configurable: !0,
                    enumerable: !1,
                    writable: !0,
                    value: void 0
                };
            }), Object.defineProperties(i, o), Object.defineProperty(n, "nullPolyfill", {
                configurable: !1,
                enumerable: !1,
                writable: !1,
                value: i
            }), function(e, t) {
                return a(null === e ? i : e, t);
            }) : a;
        }, {
            "./set-prototype-of/is-implemented": 52,
            "./set-prototype-of/shim": 53
        } ],
        41: [ function(e, t, r) {
            t.exports = e("./_iterate")("forEach");
        }, {
            "./_iterate": 35
        } ],
        42: [ function(e, t, r) {
            t.exports = function(e) {
                return "function" == typeof e;
            };
        }, {} ],
        43: [ function(t, r, n) {
            var i = t("./is-value"), o = {
                function: !0,
                object: !0
            };
            r.exports = function(t) {
                return i(t) && o[e(t)] || !1;
            };
        }, {
            "./is-value": 44
        } ],
        44: [ function(e, t, r) {
            var n = e("../function/noop")();
            t.exports = function(e) {
                return e !== n && null !== e;
            };
        }, {
            "../function/noop": 26
        } ],
        45: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Object.keys : e("./shim");
        }, {
            "./is-implemented": 46,
            "./shim": 47
        } ],
        46: [ function(e, t, r) {
            t.exports = function() {
                try {
                    return Object.keys("primitive"), !0;
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    return !1;
                }
            };
        }, {} ],
        47: [ function(e, t, r) {
            var n = e("../is-value"), i = Object.keys;
            t.exports = function(e) {
                return i(n(e) ? Object(e) : e);
            };
        }, {
            "../is-value": 44
        } ],
        48: [ function(e, t, r) {
            var n = e("./valid-callable"), i = e("./for-each"), o = Function.prototype.call;
            t.exports = function(e, t) {
                var r = {}, s = arguments[2];
                return n(t), i(e, function(e, n, i, a) {
                    r[n] = o.call(t, s, e, n, i, a);
                }), r;
            };
        }, {
            "./for-each": 41,
            "./valid-callable": 54
        } ],
        49: [ function(e, t, r) {
            var n = e("./is-value"), i = Array.prototype.forEach, o = Object.create, s = function(e, t) {
                var r;
                for (r in e) t[r] = e[r];
            };
            t.exports = function(e) {
                var t = o(null);
                return i.call(arguments, function(e) {
                    n(e) && s(Object(e), t);
                }), t;
            };
        }, {
            "./is-value": 44
        } ],
        50: [ function(e, t, r) {
            var n = Array.prototype.forEach, i = Object.create;
            t.exports = function(e) {
                var t = i(null);
                return n.call(arguments, function(e) {
                    t[e] = !0;
                }), t;
            };
        }, {} ],
        51: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Object.setPrototypeOf : e("./shim");
        }, {
            "./is-implemented": 52,
            "./shim": 53
        } ],
        52: [ function(e, t, r) {
            var n = Object.create, i = Object.getPrototypeOf, o = {};
            t.exports = function() {
                var e = Object.setPrototypeOf, t = arguments[0] || n;
                return "function" == typeof e && i(e(t(null), o)) === o;
            };
        }, {} ],
        53: [ function(e, t, r) {
            var n, i = e("../is-object"), o = e("../valid-value"), s = Object.prototype.isPrototypeOf, a = Object.defineProperty, u = {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: void 0
            };
            n = function(e, t) {
                if (o(e), null === t || i(t)) return e;
                throw new TypeError("Prototype must be null or an object");
            }, t.exports = function(e) {
                var t, r;
                return e ? (2 === e.level ? e.set ? (r = e.set, t = function(e, t) {
                    return r.call(n(e, t), t), e;
                }) : t = function(e, t) {
                    return n(e, t).__proto__ = t, e;
                } : t = function e(t, r) {
                    var i;
                    return n(t, r), (i = s.call(e.nullPolyfill, t)) && delete e.nullPolyfill.__proto__, 
                    null === r && (r = e.nullPolyfill), t.__proto__ = r, i && a(e.nullPolyfill, "__proto__", u), 
                    t;
                }, Object.defineProperty(t, "level", {
                    configurable: !1,
                    enumerable: !1,
                    writable: !1,
                    value: e.level
                })) : null;
            }(function() {
                var e, t = Object.create(null), r = {}, n = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
                if (n) {
                    try {
                        (e = n.set).call(t, r);
                    } catch (e) {}
                    if (Object.getPrototypeOf(t) === r) return {
                        set: e,
                        level: 2
                    };
                }
                return t.__proto__ = r, Object.getPrototypeOf(t) === r ? {
                    level: 2
                } : ((t = {}).__proto__ = r, Object.getPrototypeOf(t) === r && {
                    level: 1
                });
            }()), e("../create");
        }, {
            "../create": 40,
            "../is-object": 43,
            "../valid-value": 55
        } ],
        54: [ function(e, t, r) {
            t.exports = function(e) {
                if ("function" != typeof e) throw new TypeError(e + " is not a function");
                return e;
            };
        }, {} ],
        55: [ function(e, t, r) {
            var n = e("./is-value");
            t.exports = function(e) {
                if (!n(e)) throw new TypeError("Cannot use null or undefined");
                return e;
            };
        }, {
            "./is-value": 44
        } ],
        56: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? String.prototype.contains : e("./shim");
        }, {
            "./is-implemented": 57,
            "./shim": 58
        } ],
        57: [ function(e, t, r) {
            var n = "razdwatrzy";
            t.exports = function() {
                return "function" == typeof n.contains && (!0 === n.contains("dwa") && !1 === n.contains("foo"));
            };
        }, {} ],
        58: [ function(e, t, r) {
            var n = String.prototype.indexOf;
            t.exports = function(e) {
                return n.call(this, e, arguments[1]) > -1;
            };
        }, {} ],
        59: [ function(t, r, n) {
            var i = Object.prototype.toString, o = i.call("");
            r.exports = function(t) {
                return "string" == typeof t || t && "object" === e(t) && (t instanceof String || i.call(t) === o) || !1;
            };
        }, {} ],
        60: [ function(e, t, r) {
            var n, i = e("es5-ext/object/set-prototype-of"), o = e("es5-ext/string/#/contains"), s = e("d"), a = e("es6-symbol"), u = e("./"), c = Object.defineProperty;
            n = t.exports = function(e, t) {
                if (!(this instanceof n)) throw new TypeError("Constructor requires 'new'");
                u.call(this, e), t = t ? o.call(t, "key+value") ? "key+value" : o.call(t, "key") ? "key" : "value" : "value", 
                c(this, "__kind__", s("", t));
            }, i && i(n, u), delete n.prototype.constructor, n.prototype = Object.create(u.prototype, {
                _resolve: s(function(e) {
                    return "value" === this.__kind__ ? this.__list__[e] : "key+value" === this.__kind__ ? [ e, this.__list__[e] ] : e;
                })
            }), c(n.prototype, a.toStringTag, s("c", "Array Iterator"));
        }, {
            "./": 63,
            d: 16,
            "es5-ext/object/set-prototype-of": 51,
            "es5-ext/string/#/contains": 56,
            "es6-symbol": 73
        } ],
        61: [ function(e, t, r) {
            var n = e("es5-ext/function/is-arguments"), i = e("es5-ext/object/valid-callable"), o = e("es5-ext/string/is-string"), s = e("./get"), a = Array.isArray, u = Function.prototype.call, c = Array.prototype.some;
            t.exports = function(e, t) {
                var r, l, f, h, p, d, g, b, y = arguments[2];
                if (a(e) || n(e) ? r = "array" : o(e) ? r = "string" : e = s(e), i(t), f = function() {
                    h = !0;
                }, "array" !== r) if ("string" !== r) for (l = e.next(); !l.done; ) {
                    if (u.call(t, y, l.value, f), h) return;
                    l = e.next();
                } else for (d = e.length, p = 0; p < d && (g = e[p], p + 1 < d && (b = g.charCodeAt(0)) >= 55296 && b <= 56319 && (g += e[++p]), 
                u.call(t, y, g, f), !h); ++p) ; else c.call(e, function(e) {
                    return u.call(t, y, e, f), h;
                });
            };
        }, {
            "./get": 62,
            "es5-ext/function/is-arguments": 24,
            "es5-ext/object/valid-callable": 54,
            "es5-ext/string/is-string": 59
        } ],
        62: [ function(e, t, r) {
            var n = e("es5-ext/function/is-arguments"), i = e("es5-ext/string/is-string"), o = e("./array"), s = e("./string"), a = e("./valid-iterable"), u = e("es6-symbol").iterator;
            t.exports = function(e) {
                return "function" == typeof a(e)[u] ? e[u]() : n(e) ? new o(e) : i(e) ? new s(e) : new o(e);
            };
        }, {
            "./array": 60,
            "./string": 65,
            "./valid-iterable": 66,
            "es5-ext/function/is-arguments": 24,
            "es5-ext/string/is-string": 59,
            "es6-symbol": 73
        } ],
        63: [ function(e, t, r) {
            var n, i = e("es5-ext/array/#/clear"), o = e("es5-ext/object/assign"), s = e("es5-ext/object/valid-callable"), a = e("es5-ext/object/valid-value"), u = e("d"), c = e("d/auto-bind"), l = e("es6-symbol"), f = Object.defineProperty, h = Object.defineProperties;
            t.exports = n = function(e, t) {
                if (!(this instanceof n)) throw new TypeError("Constructor requires 'new'");
                h(this, {
                    __list__: u("w", a(e)),
                    __context__: u("w", t),
                    __nextIndex__: u("w", 0)
                }), t && (s(t.on), t.on("_add", this._onAdd), t.on("_delete", this._onDelete), t.on("_clear", this._onClear));
            }, delete n.prototype.constructor, h(n.prototype, o({
                _next: u(function() {
                    var e;
                    if (this.__list__) return this.__redo__ && void 0 !== (e = this.__redo__.shift()) ? e : this.__nextIndex__ < this.__list__.length ? this.__nextIndex__++ : void this._unBind();
                }),
                next: u(function() {
                    return this._createResult(this._next());
                }),
                _createResult: u(function(e) {
                    return void 0 === e ? {
                        done: !0,
                        value: void 0
                    } : {
                        done: !1,
                        value: this._resolve(e)
                    };
                }),
                _resolve: u(function(e) {
                    return this.__list__[e];
                }),
                _unBind: u(function() {
                    this.__list__ = null, delete this.__redo__, this.__context__ && (this.__context__.off("_add", this._onAdd), 
                    this.__context__.off("_delete", this._onDelete), this.__context__.off("_clear", this._onClear), 
                    this.__context__ = null);
                }),
                toString: u(function() {
                    return "[object " + (this[l.toStringTag] || "Object") + "]";
                })
            }, c({
                _onAdd: u(function(e) {
                    e >= this.__nextIndex__ || (++this.__nextIndex__, this.__redo__ ? (this.__redo__.forEach(function(t, r) {
                        t >= e && (this.__redo__[r] = ++t);
                    }, this), this.__redo__.push(e)) : f(this, "__redo__", u("c", [ e ])));
                }),
                _onDelete: u(function(e) {
                    var t;
                    e >= this.__nextIndex__ || (--this.__nextIndex__, this.__redo__ && (-1 !== (t = this.__redo__.indexOf(e)) && this.__redo__.splice(t, 1), 
                    this.__redo__.forEach(function(t, r) {
                        t > e && (this.__redo__[r] = --t);
                    }, this)));
                }),
                _onClear: u(function() {
                    this.__redo__ && i.call(this.__redo__), this.__nextIndex__ = 0;
                })
            }))), f(n.prototype, l.iterator, u(function() {
                return this;
            }));
        }, {
            d: 16,
            "d/auto-bind": 15,
            "es5-ext/array/#/clear": 19,
            "es5-ext/object/assign": 36,
            "es5-ext/object/valid-callable": 54,
            "es5-ext/object/valid-value": 55,
            "es6-symbol": 73
        } ],
        64: [ function(e, t, r) {
            var n = e("es5-ext/function/is-arguments"), i = e("es5-ext/object/is-value"), o = e("es5-ext/string/is-string"), s = e("es6-symbol").iterator, a = Array.isArray;
            t.exports = function(e) {
                return !!i(e) && (!!a(e) || (!!o(e) || (!!n(e) || "function" == typeof e[s])));
            };
        }, {
            "es5-ext/function/is-arguments": 24,
            "es5-ext/object/is-value": 44,
            "es5-ext/string/is-string": 59,
            "es6-symbol": 73
        } ],
        65: [ function(e, t, r) {
            var n, i = e("es5-ext/object/set-prototype-of"), o = e("d"), s = e("es6-symbol"), a = e("./"), u = Object.defineProperty;
            n = t.exports = function(e) {
                if (!(this instanceof n)) throw new TypeError("Constructor requires 'new'");
                e = String(e), a.call(this, e), u(this, "__length__", o("", e.length));
            }, i && i(n, a), delete n.prototype.constructor, n.prototype = Object.create(a.prototype, {
                _next: o(function() {
                    if (this.__list__) return this.__nextIndex__ < this.__length__ ? this.__nextIndex__++ : void this._unBind();
                }),
                _resolve: o(function(e) {
                    var t, r = this.__list__[e];
                    return this.__nextIndex__ === this.__length__ ? r : (t = r.charCodeAt(0)) >= 55296 && t <= 56319 ? r + this.__list__[this.__nextIndex__++] : r;
                })
            }), u(n.prototype, s.toStringTag, o("c", "String Iterator"));
        }, {
            "./": 63,
            d: 16,
            "es5-ext/object/set-prototype-of": 51,
            "es6-symbol": 73
        } ],
        66: [ function(e, t, r) {
            var n = e("./is-iterable");
            t.exports = function(e) {
                if (!n(e)) throw new TypeError(e + " is not iterable");
                return e;
            };
        }, {
            "./is-iterable": 64
        } ],
        67: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Map : e("./polyfill");
        }, {
            "./is-implemented": 68,
            "./polyfill": 72
        } ],
        68: [ function(e, t, r) {
            t.exports = function() {
                var e, t;
                if ("function" != typeof Map) return !1;
                try {
                    e = new Map([ [ "raz", "one" ], [ "dwa", "two" ], [ "trzy", "three" ] ]);
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    return !1;
                }
                return "[object Map]" === String(e) && (3 === e.size && ("function" == typeof e.clear && ("function" == typeof e.delete && ("function" == typeof e.entries && ("function" == typeof e.forEach && ("function" == typeof e.get && ("function" == typeof e.has && ("function" == typeof e.keys && ("function" == typeof e.set && ("function" == typeof e.values && (!1 === (t = e.entries().next()).done && (!!t.value && ("raz" === t.value[0] && "one" === t.value[1])))))))))))));
            };
        }, {} ],
        69: [ function(e, t, r) {
            t.exports = "undefined" != typeof Map && "[object Map]" === Object.prototype.toString.call(new Map());
        }, {} ],
        70: [ function(e, t, r) {
            t.exports = e("es5-ext/object/primitive-set")("key", "value", "key+value");
        }, {
            "es5-ext/object/primitive-set": 50
        } ],
        71: [ function(e, t, r) {
            var n, i = e("es5-ext/object/set-prototype-of"), o = e("d"), s = e("es6-iterator"), a = e("es6-symbol").toStringTag, u = e("./iterator-kinds"), c = Object.defineProperties, l = s.prototype._unBind;
            n = t.exports = function(e, t) {
                if (!(this instanceof n)) return new n(e, t);
                s.call(this, e.__mapKeysData__, e), t && u[t] || (t = "key+value"), c(this, {
                    __kind__: o("", t),
                    __values__: o("w", e.__mapValuesData__)
                });
            }, i && i(n, s), n.prototype = Object.create(s.prototype, {
                constructor: o(n),
                _resolve: o(function(e) {
                    return "value" === this.__kind__ ? this.__values__[e] : "key" === this.__kind__ ? this.__list__[e] : [ this.__list__[e], this.__values__[e] ];
                }),
                _unBind: o(function() {
                    this.__values__ = null, l.call(this);
                }),
                toString: o(function() {
                    return "[object Map Iterator]";
                })
            }), Object.defineProperty(n.prototype, a, o("c", "Map Iterator"));
        }, {
            "./iterator-kinds": 70,
            d: 16,
            "es5-ext/object/set-prototype-of": 51,
            "es6-iterator": 63,
            "es6-symbol": 73
        } ],
        72: [ function(e, t, r) {
            var n, i = e("es5-ext/array/#/clear"), o = e("es5-ext/array/#/e-index-of"), s = e("es5-ext/object/set-prototype-of"), a = e("es5-ext/object/valid-callable"), u = e("es5-ext/object/valid-value"), c = e("d"), l = e("event-emitter"), f = e("es6-symbol"), h = e("es6-iterator/valid-iterable"), p = e("es6-iterator/for-of"), d = e("./lib/iterator"), g = e("./is-native-implemented"), b = Function.prototype.call, y = Object.defineProperties, _ = Object.getPrototypeOf;
            t.exports = n = function() {
                var e, t, r, i = arguments[0];
                if (!(this instanceof n)) throw new TypeError("Constructor requires 'new'");
                return r = g && s && Map !== n ? s(new Map(), _(this)) : this, null != i && h(i), 
                y(r, {
                    __mapKeysData__: c("c", e = []),
                    __mapValuesData__: c("c", t = [])
                }), i ? (p(i, function(r) {
                    var n = u(r)[0];
                    r = r[1], -1 === o.call(e, n) && (e.push(n), t.push(r));
                }, r), r) : r;
            }, g && (s && s(n, Map), n.prototype = Object.create(Map.prototype, {
                constructor: c(n)
            })), l(y(n.prototype, {
                clear: c(function() {
                    this.__mapKeysData__.length && (i.call(this.__mapKeysData__), i.call(this.__mapValuesData__), 
                    this.emit("_clear"));
                }),
                delete: c(function(e) {
                    var t = o.call(this.__mapKeysData__, e);
                    return -1 !== t && (this.__mapKeysData__.splice(t, 1), this.__mapValuesData__.splice(t, 1), 
                    this.emit("_delete", t, e), !0);
                }),
                entries: c(function() {
                    return new d(this, "key+value");
                }),
                forEach: c(function(e) {
                    var t, r, n = arguments[1];
                    for (a(e), r = (t = this.entries())._next(); void 0 !== r; ) b.call(e, n, this.__mapValuesData__[r], this.__mapKeysData__[r], this), 
                    r = t._next();
                }),
                get: c(function(e) {
                    var t = o.call(this.__mapKeysData__, e);
                    if (-1 !== t) return this.__mapValuesData__[t];
                }),
                has: c(function(e) {
                    return -1 !== o.call(this.__mapKeysData__, e);
                }),
                keys: c(function() {
                    return new d(this, "key");
                }),
                set: c(function(e, t) {
                    var r, n = o.call(this.__mapKeysData__, e);
                    return -1 === n && (n = this.__mapKeysData__.push(e) - 1, r = !0), this.__mapValuesData__[n] = t, 
                    r && this.emit("_add", n, e), this;
                }),
                size: c.gs(function() {
                    return this.__mapKeysData__.length;
                }),
                values: c(function() {
                    return new d(this, "value");
                }),
                toString: c(function() {
                    return "[object Map]";
                })
            })), Object.defineProperty(n.prototype, f.iterator, c(function() {
                return this.entries();
            })), Object.defineProperty(n.prototype, f.toStringTag, c("c", "Map"));
        }, {
            "./is-native-implemented": 69,
            "./lib/iterator": 71,
            d: 16,
            "es5-ext/array/#/clear": 19,
            "es5-ext/array/#/e-index-of": 20,
            "es5-ext/object/set-prototype-of": 51,
            "es5-ext/object/valid-callable": 54,
            "es5-ext/object/valid-value": 55,
            "es6-iterator/for-of": 61,
            "es6-iterator/valid-iterable": 66,
            "es6-symbol": 73,
            "event-emitter": 78
        } ],
        73: [ function(e, t, r) {
            t.exports = e("./is-implemented")() ? Symbol : e("./polyfill");
        }, {
            "./is-implemented": 74,
            "./polyfill": 76
        } ],
        74: [ function(t, r, n) {
            var i = {
                object: !0,
                symbol: !0
            };
            r.exports = function() {
                var t;
                if ("function" != typeof Symbol) return !1;
                t = Symbol("test symbol");
                try {
                    String(t);
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    return !1;
                }
                return !!i[e(Symbol.iterator)] && (!!i[e(Symbol.toPrimitive)] && !!i[e(Symbol.toStringTag)]);
            };
        }, {} ],
        75: [ function(t, r, n) {
            r.exports = function(t) {
                return !!t && ("symbol" === e(t) || !!t.constructor && ("Symbol" === t.constructor.name && "Symbol" === t[t.constructor.toStringTag]));
            };
        }, {} ],
        76: [ function(t, r, n) {
            var i, o, s, a, u = t("d"), c = t("./validate-symbol"), l = Object.create, f = Object.defineProperties, h = Object.defineProperty, p = Object.prototype, d = l(null);
            if ("function" == typeof Symbol) {
                i = Symbol;
                try {
                    String(i()), a = !0;
                } catch (e) {}
            }
            var g, b = (g = l(null), function(e) {
                for (var t, r, n = 0; g[e + (n || "")]; ) ++n;
                return g[e += n || ""] = !0, h(p, t = "@@" + e, u.gs(null, function(e) {
                    r || (r = !0, h(this, t, u(e)), r = !1);
                })), t;
            });
            s = function(e) {
                if (this instanceof s) throw new TypeError("Symbol is not a constructor");
                return o(e);
            }, r.exports = o = function e(t) {
                var r;
                if (this instanceof e) throw new TypeError("Symbol is not a constructor");
                return a ? i(t) : (r = l(s.prototype), t = void 0 === t ? "" : String(t), f(r, {
                    __description__: u("", t),
                    __name__: u("", b(t))
                }));
            }, f(o, {
                for: u(function(e) {
                    return d[e] ? d[e] : d[e] = o(String(e));
                }),
                keyFor: u(function(e) {
                    var t;
                    for (t in c(e), d) if (d[t] === e) return t;
                }),
                hasInstance: u("", i && i.hasInstance || o("hasInstance")),
                isConcatSpreadable: u("", i && i.isConcatSpreadable || o("isConcatSpreadable")),
                iterator: u("", i && i.iterator || o("iterator")),
                match: u("", i && i.match || o("match")),
                replace: u("", i && i.replace || o("replace")),
                search: u("", i && i.search || o("search")),
                species: u("", i && i.species || o("species")),
                split: u("", i && i.split || o("split")),
                toPrimitive: u("", i && i.toPrimitive || o("toPrimitive")),
                toStringTag: u("", i && i.toStringTag || o("toStringTag")),
                unscopables: u("", i && i.unscopables || o("unscopables"))
            }), f(s.prototype, {
                constructor: u(o),
                toString: u("", function() {
                    return this.__name__;
                })
            }), f(o.prototype, {
                toString: u(function() {
                    return "Symbol (" + c(this).__description__ + ")";
                }),
                valueOf: u(function() {
                    return c(this);
                })
            }), h(o.prototype, o.toPrimitive, u("", function() {
                var t = c(this);
                return "symbol" === e(t) ? t : t.toString();
            })), h(o.prototype, o.toStringTag, u("c", "Symbol")), h(s.prototype, o.toStringTag, u("c", o.prototype[o.toStringTag])), 
            h(s.prototype, o.toPrimitive, u("c", o.prototype[o.toPrimitive]));
        }, {
            "./validate-symbol": 77,
            d: 16
        } ],
        77: [ function(e, t, r) {
            var n = e("./is-symbol");
            t.exports = function(e) {
                if (!n(e)) throw new TypeError(e + " is not a symbol");
                return e;
            };
        }, {
            "./is-symbol": 75
        } ],
        78: [ function(t, r, n) {
            var i, o, s, a, u, c, l, f = t("d"), h = t("es5-ext/object/valid-callable"), p = Function.prototype.apply, d = Function.prototype.call, g = Object.create, b = Object.defineProperty, y = Object.defineProperties, _ = Object.prototype.hasOwnProperty, m = {
                configurable: !0,
                enumerable: !1,
                writable: !0
            };
            o = function(e, t) {
                var r, n;
                return h(t), n = this, i.call(this, e, r = function() {
                    s.call(n, e, r), p.call(t, this, arguments);
                }), r.__eeOnceListener__ = t, this;
            }, u = {
                on: i = function(t, r) {
                    var n;
                    return h(r), _.call(this, "__ee__") ? n = this.__ee__ : (n = m.value = g(null), 
                    b(this, "__ee__", m), m.value = null), n[t] ? "object" === e(n[t]) ? n[t].push(r) : n[t] = [ n[t], r ] : n[t] = r, 
                    this;
                },
                once: o,
                off: s = function(t, r) {
                    var n, i, o, s;
                    if (h(r), !_.call(this, "__ee__")) return this;
                    if (!(n = this.__ee__)[t]) return this;
                    if (i = n[t], "object" === e(i)) for (s = 0; o = i[s]; ++s) o !== r && o.__eeOnceListener__ !== r || (2 === i.length ? n[t] = i[s ? 0 : 1] : i.splice(s, 1)); else i !== r && i.__eeOnceListener__ !== r || delete n[t];
                    return this;
                },
                emit: a = function(t) {
                    var r, n, i, o, s;
                    if (_.call(this, "__ee__") && (o = this.__ee__[t])) if ("object" === e(o)) {
                        for (n = arguments.length, s = new Array(n - 1), r = 1; r < n; ++r) s[r - 1] = arguments[r];
                        for (o = o.slice(), r = 0; i = o[r]; ++r) p.call(i, this, s);
                    } else switch (arguments.length) {
                      case 1:
                        d.call(o, this);
                        break;

                      case 2:
                        d.call(o, this, arguments[1]);
                        break;

                      case 3:
                        d.call(o, this, arguments[1], arguments[2]);
                        break;

                      default:
                        for (n = arguments.length, s = new Array(n - 1), r = 1; r < n; ++r) s[r - 1] = arguments[r];
                        p.call(o, this, s);
                    }
                }
            }, c = {
                on: f(i),
                once: f(o),
                off: f(s),
                emit: f(a)
            }, l = y({}, c), r.exports = n = function(e) {
                return null == e ? g(l) : y(Object(e), c);
            }, n.methods = u;
        }, {
            d: 16,
            "es5-ext/object/valid-callable": 54
        } ],
        79: [ function(e, t, r) {
            r.read = function(e, t, r, n, i) {
                var o, s, a = 8 * i - n - 1, u = (1 << a) - 1, c = u >> 1, l = -7, f = r ? i - 1 : 0, h = r ? -1 : 1, p = e[t + f];
                for (f += h, o = p & (1 << -l) - 1, p >>= -l, l += a; l > 0; o = 256 * o + e[t + f], 
                f += h, l -= 8) ;
                for (s = o & (1 << -l) - 1, o >>= -l, l += n; l > 0; s = 256 * s + e[t + f], f += h, 
                l -= 8) ;
                if (0 === o) o = 1 - c; else {
                    if (o === u) return s ? NaN : 1 / 0 * (p ? -1 : 1);
                    s += Math.pow(2, n), o -= c;
                }
                return (p ? -1 : 1) * s * Math.pow(2, o - n);
            }, r.write = function(e, t, r, n, i, o) {
                var s, a, u, c = 8 * o - i - 1, l = (1 << c) - 1, f = l >> 1, h = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : o - 1, d = n ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t) / Math.LN2), 
                t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), (t += s + f >= 1 ? h / u : h * Math.pow(2, 1 - f)) * u >= 2 && (s++, 
                u /= 2), s + f >= l ? (a = 0, s = l) : s + f >= 1 ? (a = (t * u - 1) * Math.pow(2, i), 
                s += f) : (a = t * Math.pow(2, f - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + p] = 255 & a, 
                p += d, a /= 256, i -= 8) ;
                for (s = s << i | a, c += i; c > 0; e[r + p] = 255 & s, p += d, s /= 256, c -= 8) ;
                e[r + p - d] |= 128 * g;
            };
        }, {} ],
        80: [ function(e, t, r) {
            "function" == typeof Object.create ? t.exports = function(e, t) {
                e.super_ = t, e.prototype = Object.create(t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                });
            } : t.exports = function(e, t) {
                e.super_ = t;
                var r = function() {};
                r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
            };
        }, {} ],
        81: [ function(e, t, r) {
            function n(e) {
                return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
            }
            t.exports = function(e) {
                return null != e && (n(e) || function(e) {
                    return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0));
                }(e) || !!e._isBuffer);
            };
        }, {} ],
        82: [ function(e, t, r) {
            var n = e("safe-buffer").Buffer, i = t.exports;
            for (var o in i.types = {
                0: "reserved",
                1: "connect",
                2: "connack",
                3: "publish",
                4: "puback",
                5: "pubrec",
                6: "pubrel",
                7: "pubcomp",
                8: "subscribe",
                9: "suback",
                10: "unsubscribe",
                11: "unsuback",
                12: "pingreq",
                13: "pingresp",
                14: "disconnect",
                15: "auth"
            }, i.codes = {}, i.types) {
                var s = i.types[o];
                i.codes[s] = o;
            }
            for (var a in i.CMD_SHIFT = 4, i.CMD_MASK = 240, i.DUP_MASK = 8, i.QOS_MASK = 3, 
            i.QOS_SHIFT = 1, i.RETAIN_MASK = 1, i.LENGTH_MASK = 127, i.LENGTH_FIN_MASK = 128, 
            i.SESSIONPRESENT_MASK = 1, i.SESSIONPRESENT_HEADER = n.from([ i.SESSIONPRESENT_MASK ]), 
            i.CONNACK_HEADER = n.from([ i.codes.connack << i.CMD_SHIFT ]), i.USERNAME_MASK = 128, 
            i.PASSWORD_MASK = 64, i.WILL_RETAIN_MASK = 32, i.WILL_QOS_MASK = 24, i.WILL_QOS_SHIFT = 3, 
            i.WILL_FLAG_MASK = 4, i.CLEAN_SESSION_MASK = 2, i.CONNECT_HEADER = n.from([ i.codes.connect << i.CMD_SHIFT ]), 
            i.properties = {
                sessionExpiryInterval: 17,
                willDelayInterval: 24,
                receiveMaximum: 33,
                maximumPacketSize: 39,
                topicAliasMaximum: 34,
                requestResponseInformation: 25,
                requestProblemInformation: 23,
                userProperties: 38,
                authenticationMethod: 21,
                authenticationData: 22,
                payloadFormatIndicator: 1,
                messageExpiryInterval: 2,
                contentType: 3,
                responseTopic: 8,
                correlationData: 9,
                maximumQoS: 36,
                retainAvailable: 37,
                assignedClientIdentifier: 18,
                reasonString: 31,
                wildcardSubscriptionAvailable: 40,
                subscriptionIdentifiersAvailable: 41,
                sharedSubscriptionAvailable: 42,
                serverKeepAlive: 19,
                responseInformation: 26,
                serverReference: 28,
                topicAlias: 35,
                subscriptionIdentifier: 11
            }, i.propertiesCodes = {}, i.properties) {
                var u = i.properties[a];
                i.propertiesCodes[u] = a;
            }
            function c(e) {
                return [ 0, 1, 2 ].map(function(t) {
                    return [ 0, 1 ].map(function(r) {
                        return [ 0, 1 ].map(function(o) {
                            var s = new n(1);
                            return s.writeUInt8(i.codes[e] << i.CMD_SHIFT | (r ? i.DUP_MASK : 0) | t << i.QOS_SHIFT | o, 0, !0), 
                            s;
                        });
                    });
                });
            }
            i.propertiesTypes = {
                sessionExpiryInterval: "int32",
                willDelayInterval: "int32",
                receiveMaximum: "int16",
                maximumPacketSize: "int32",
                topicAliasMaximum: "int16",
                requestResponseInformation: "byte",
                requestProblemInformation: "byte",
                userProperties: "pair",
                authenticationMethod: "string",
                authenticationData: "binary",
                payloadFormatIndicator: "byte",
                messageExpiryInterval: "int32",
                contentType: "string",
                responseTopic: "string",
                correlationData: "binary",
                maximumQoS: "int8",
                retainAvailable: "byte",
                assignedClientIdentifier: "string",
                reasonString: "string",
                wildcardSubscriptionAvailable: "byte",
                subscriptionIdentifiersAvailable: "byte",
                sharedSubscriptionAvailable: "byte",
                serverKeepAlive: "int32",
                responseInformation: "string",
                serverReference: "string",
                topicAlias: "int16",
                subscriptionIdentifier: "var"
            }, i.PUBLISH_HEADER = c("publish"), i.SUBSCRIBE_HEADER = c("subscribe"), i.SUBSCRIBE_OPTIONS_QOS_MASK = 3, 
            i.SUBSCRIBE_OPTIONS_NL_MASK = 1, i.SUBSCRIBE_OPTIONS_NL_SHIFT = 2, i.SUBSCRIBE_OPTIONS_RAP_MASK = 1, 
            i.SUBSCRIBE_OPTIONS_RAP_SHIFT = 3, i.SUBSCRIBE_OPTIONS_RH_MASK = 3, i.SUBSCRIBE_OPTIONS_RH_SHIFT = 4, 
            i.SUBSCRIBE_OPTIONS_RH = [ 0, 16, 32 ], i.SUBSCRIBE_OPTIONS_NL = 4, i.SUBSCRIBE_OPTIONS_RAP = 8, 
            i.SUBSCRIBE_OPTIONS_QOS = [ 0, 1, 2 ], i.UNSUBSCRIBE_HEADER = c("unsubscribe"), 
            i.ACKS = {
                unsuback: c("unsuback"),
                puback: c("puback"),
                pubcomp: c("pubcomp"),
                pubrel: c("pubrel"),
                pubrec: c("pubrec")
            }, i.SUBACK_HEADER = n.from([ i.codes.suback << i.CMD_SHIFT ]), i.VERSION3 = n.from([ 3 ]), 
            i.VERSION4 = n.from([ 4 ]), i.VERSION5 = n.from([ 5 ]), i.QOS = [ 0, 1, 2 ].map(function(e) {
                return n.from([ e ]);
            }), i.EMPTY = {
                pingreq: n.from([ i.codes.pingreq << 4, 0 ]),
                pingresp: n.from([ i.codes.pingresp << 4, 0 ]),
                disconnect: n.from([ i.codes.disconnect << 4, 0 ])
            };
        }, {
            "safe-buffer": 110
        } ],
        83: [ function(e, t, r) {
            var n = e("safe-buffer").Buffer, i = e("./writeToStream"), o = e("events").EventEmitter;
            function s() {
                this._array = new Array(20), this._i = 0;
            }
            e("inherits")(s, o), s.prototype.write = function(e) {
                return this._array[this._i++] = e, !0;
            }, s.prototype.concat = function() {
                var e, t, r = 0, i = new Array(this._array.length), o = this._array, s = 0;
                for (e = 0; e < o.length && void 0 !== o[e]; e++) "string" != typeof o[e] ? i[e] = o[e].length : i[e] = n.byteLength(o[e]), 
                r += i[e];
                for (t = n.allocUnsafe(r), e = 0; e < o.length && void 0 !== o[e]; e++) "string" != typeof o[e] ? (o[e].copy(t, s), 
                s += i[e]) : (t.write(o[e], s), s += i[e]);
                return t;
            }, t.exports = function(e, t) {
                var r = new s();
                return i(e, r, t), r.concat();
            };
        }, {
            "./writeToStream": 89,
            events: 13,
            inherits: 80,
            "safe-buffer": 110
        } ],
        84: [ function(e, t, r) {
            r.parser = e("./parser"), r.generate = e("./generate"), r.writeToStream = e("./writeToStream");
        }, {
            "./generate": 83,
            "./parser": 88,
            "./writeToStream": 89
        } ],
        85: [ function(e, t, r) {
            var n = e("readable-stream/duplex"), i = e("util"), o = e("safe-buffer").Buffer;
            function s(e) {
                if (!(this instanceof s)) return new s(e);
                if (this._bufs = [], this.length = 0, "function" == typeof e) {
                    this._callback = e;
                    var t = function(e) {
                        this._callback && (this._callback(e), this._callback = null);
                    }.bind(this);
                    this.on("pipe", function(e) {
                        e.on("error", t);
                    }), this.on("unpipe", function(e) {
                        e.removeListener("error", t);
                    });
                } else this.append(e);
                n.call(this);
            }
            i.inherits(s, n), s.prototype._offset = function(e) {
                var t, r = 0, n = 0;
                if (0 === e) return [ 0, 0 ];
                for (;n < this._bufs.length; n++) {
                    if (e < (t = r + this._bufs[n].length) || n == this._bufs.length - 1) return [ n, e - r ];
                    r = t;
                }
            }, s.prototype.append = function(e) {
                var t = 0;
                if (o.isBuffer(e)) this._appendBuffer(e); else if (Array.isArray(e)) for (;t < e.length; t++) this.append(e[t]); else if (e instanceof s) for (;t < e._bufs.length; t++) this.append(e._bufs[t]); else null != e && ("number" == typeof e && (e = e.toString()), 
                this._appendBuffer(o.from(e)));
                return this;
            }, s.prototype._appendBuffer = function(e) {
                this._bufs.push(e), this.length += e.length;
            }, s.prototype._write = function(e, t, r) {
                this._appendBuffer(e), "function" == typeof r && r();
            }, s.prototype._read = function(e) {
                if (!this.length) return this.push(null);
                e = Math.min(e, this.length), this.push(this.slice(0, e)), this.consume(e);
            }, s.prototype.end = function(e) {
                n.prototype.end.call(this, e), this._callback && (this._callback(null, this.slice()), 
                this._callback = null);
            }, s.prototype.get = function(e) {
                return this.slice(e, e + 1)[0];
            }, s.prototype.slice = function(e, t) {
                return "number" == typeof e && e < 0 && (e += this.length), "number" == typeof t && t < 0 && (t += this.length), 
                this.copy(null, 0, e, t);
            }, s.prototype.copy = function(e, t, r, n) {
                if (("number" != typeof r || r < 0) && (r = 0), ("number" != typeof n || n > this.length) && (n = this.length), 
                r >= this.length) return e || o.alloc(0);
                if (n <= 0) return e || o.alloc(0);
                var i, s, a = !!e, u = this._offset(r), c = n - r, l = c, f = a && t || 0, h = u[1];
                if (0 === r && n == this.length) {
                    if (!a) return 1 === this._bufs.length ? this._bufs[0] : o.concat(this._bufs, this.length);
                    for (s = 0; s < this._bufs.length; s++) this._bufs[s].copy(e, f), f += this._bufs[s].length;
                    return e;
                }
                if (l <= this._bufs[u[0]].length - h) return a ? this._bufs[u[0]].copy(e, t, h, h + l) : this._bufs[u[0]].slice(h, h + l);
                for (a || (e = o.allocUnsafe(c)), s = u[0]; s < this._bufs.length; s++) {
                    if (!(l > (i = this._bufs[s].length - h))) {
                        this._bufs[s].copy(e, f, h, h + l);
                        break;
                    }
                    this._bufs[s].copy(e, f, h), f += i, l -= i, h && (h = 0);
                }
                return e;
            }, s.prototype.shallowSlice = function(e, t) {
                e = e || 0, t = t || this.length, e < 0 && (e += this.length), t < 0 && (t += this.length);
                var r = this._offset(e), n = this._offset(t), i = this._bufs.slice(r[0], n[0] + 1);
                return 0 == n[1] ? i.pop() : i[i.length - 1] = i[i.length - 1].slice(0, n[1]), 0 != r[1] && (i[0] = i[0].slice(r[1])), 
                new s(i);
            }, s.prototype.toString = function(e, t, r) {
                return this.slice(t, r).toString(e);
            }, s.prototype.consume = function(e) {
                for (;this._bufs.length; ) {
                    if (!(e >= this._bufs[0].length)) {
                        this._bufs[0] = this._bufs[0].slice(e), this.length -= e;
                        break;
                    }
                    e -= this._bufs[0].length, this.length -= this._bufs[0].length, this._bufs.shift();
                }
                return this;
            }, s.prototype.duplicate = function() {
                for (var e = 0, t = new s(); e < this._bufs.length; e++) t.append(this._bufs[e]);
                return t;
            }, s.prototype.destroy = function() {
                this._bufs.length = 0, this.length = 0, this.push(null);
            }, function() {
                var e = {
                    readDoubleBE: 8,
                    readDoubleLE: 8,
                    readFloatBE: 4,
                    readFloatLE: 4,
                    readInt32BE: 4,
                    readInt32LE: 4,
                    readUInt32BE: 4,
                    readUInt32LE: 4,
                    readInt16BE: 2,
                    readInt16LE: 2,
                    readUInt16BE: 2,
                    readUInt16LE: 2,
                    readInt8: 1,
                    readUInt8: 1
                };
                for (var t in e) !function(t) {
                    s.prototype[t] = function(r) {
                        return this.slice(r, r + e[t])[t](0);
                    };
                }(t);
            }(), t.exports = s;
        }, {
            "readable-stream/duplex": 97,
            "safe-buffer": 110,
            util: 117
        } ],
        86: [ function(e, t, r) {
            var n = e("safe-buffer").Buffer, i = {};
            function o(e) {
                var t = n.allocUnsafe(2);
                return t.writeUInt8(e >> 8, 0), t.writeUInt8(255 & e, 1), t;
            }
            t.exports = {
                cache: i,
                generateCache: function() {
                    for (var e = 0; e < 65536; e++) i[e] = o(e);
                },
                generateNumber: o,
                genBufVariableByteInt: function(e) {
                    var t = 0, r = 0, i = function(e) {
                        return e >= 0 && e < 128 ? 1 : e >= 128 && e < 16384 ? 2 : e >= 16384 && e < 2097152 ? 3 : e >= 2097152 && e < 268435456 ? 4 : 0;
                    }(e), o = n.allocUnsafe(i);
                    do {
                        t = e % 128 | 0, (e = e / 128 | 0) > 0 && (t |= 128), o.writeUInt8(t, r++);
                    } while (e > 0);
                    return {
                        data: o,
                        length: i
                    };
                },
                generate4ByteBuffer: function(e) {
                    var t = n.allocUnsafe(4);
                    return t.writeUInt32BE(e, 0), t;
                }
            };
        }, {
            "safe-buffer": 110
        } ],
        87: [ function(e, t, r) {
            t.exports = function() {
                this.cmd = null, this.retain = !1, this.qos = 0, this.dup = !1, this.length = -1, 
                this.topic = null, this.payload = null;
            };
        }, {} ],
        88: [ function(e, t, r) {
            var n = e("bl"), i = e("inherits"), o = e("events").EventEmitter, s = e("./packet"), a = e("./constants");
            function u(e) {
                if (!(this instanceof u)) return new u(e);
                this.settings = e || {}, this._states = [ "_parseHeader", "_parseLength", "_parsePayload", "_newPacket" ], 
                this._resetState();
            }
            i(u, o), u.prototype._resetState = function() {
                this.packet = new s(), this.error = null, this._list = n(), this._stateCounter = 0;
            }, u.prototype.parse = function(e) {
                for (this.error && this._resetState(), this._list.append(e); (-1 !== this.packet.length || this._list.length > 0) && this[this._states[this._stateCounter]]() && !this.error; ) this._stateCounter++, 
                this._stateCounter >= this._states.length && (this._stateCounter = 0);
                return this._list.length;
            }, u.prototype._parseHeader = function() {
                var e = this._list.readUInt8(0);
                return this.packet.cmd = a.types[e >> a.CMD_SHIFT], this.packet.retain = 0 != (e & a.RETAIN_MASK), 
                this.packet.qos = e >> a.QOS_SHIFT & a.QOS_MASK, this.packet.dup = 0 != (e & a.DUP_MASK), 
                this._list.consume(1), !0;
            }, u.prototype._parseLength = function() {
                var e = this._parseVarByteNum(!0);
                return e && (this.packet.length = e.value, this._list.consume(e.bytes)), !!e;
            }, u.prototype._parsePayload = function() {
                var e = !1;
                if (0 === this.packet.length || this._list.length >= this.packet.length) {
                    switch (this._pos = 0, this.packet.cmd) {
                      case "connect":
                        this._parseConnect();
                        break;

                      case "connack":
                        this._parseConnack();
                        break;

                      case "publish":
                        this._parsePublish();
                        break;

                      case "puback":
                      case "pubrec":
                      case "pubrel":
                      case "pubcomp":
                        this._parseConfirmation();
                        break;

                      case "subscribe":
                        this._parseSubscribe();
                        break;

                      case "suback":
                        this._parseSuback();
                        break;

                      case "unsubscribe":
                        this._parseUnsubscribe();
                        break;

                      case "unsuback":
                        this._parseUnsuback();
                        break;

                      case "pingreq":
                      case "pingresp":
                        break;

                      case "disconnect":
                        this._parseDisconnect();
                        break;

                      case "auth":
                        this._parseAuth();
                        break;

                      default:
                        this._emitError(new Error("Not supported"));
                    }
                    e = !0;
                }
                return e;
            }, u.prototype._parseConnect = function() {
                var e, t, r, n, i, o, s = {}, u = this.packet;
                if (null === (e = this._parseString())) return this._emitError(new Error("Cannot parse protocolId"));
                if ("MQTT" !== e && "MQIsdp" !== e) return this._emitError(new Error("Invalid protocolId"));
                if (u.protocolId = e, this._pos >= this._list.length) return this._emitError(new Error("Packet too short"));
                if (u.protocolVersion = this._list.readUInt8(this._pos), 3 !== u.protocolVersion && 4 !== u.protocolVersion && 5 !== u.protocolVersion) return this._emitError(new Error("Invalid protocol version"));
                if (this._pos++, this._pos >= this._list.length) return this._emitError(new Error("Packet too short"));
                if (s.username = this._list.readUInt8(this._pos) & a.USERNAME_MASK, s.password = this._list.readUInt8(this._pos) & a.PASSWORD_MASK, 
                s.will = this._list.readUInt8(this._pos) & a.WILL_FLAG_MASK, s.will && (u.will = {}, 
                u.will.retain = 0 != (this._list.readUInt8(this._pos) & a.WILL_RETAIN_MASK), u.will.qos = (this._list.readUInt8(this._pos) & a.WILL_QOS_MASK) >> a.WILL_QOS_SHIFT), 
                u.clean = 0 != (this._list.readUInt8(this._pos) & a.CLEAN_SESSION_MASK), this._pos++, 
                u.keepalive = this._parseNum(), -1 === u.keepalive) return this._emitError(new Error("Packet too short"));
                if (5 === u.protocolVersion) {
                    var c = this._parseProperties();
                    Object.getOwnPropertyNames(c).length && (u.properties = c);
                }
                if (null === (t = this._parseString())) return this._emitError(new Error("Packet too short"));
                if (u.clientId = t, s.will) {
                    if (5 === u.protocolVersion) {
                        var l = this._parseProperties();
                        Object.getOwnPropertyNames(l).length && (u.will.properties = l);
                    }
                    if (null === (r = this._parseString())) return this._emitError(new Error("Cannot parse will topic"));
                    if (u.will.topic = r, null === (n = this._parseBuffer())) return this._emitError(new Error("Cannot parse will payload"));
                    u.will.payload = n;
                }
                if (s.username) {
                    if (null === (o = this._parseString())) return this._emitError(new Error("Cannot parse username"));
                    u.username = o;
                }
                if (s.password) {
                    if (null === (i = this._parseBuffer())) return this._emitError(new Error("Cannot parse password"));
                    u.password = i;
                }
                return this.settings = u, u;
            }, u.prototype._parseConnack = function() {
                var e = this.packet;
                if (this._list.length < 2) return null;
                if (e.sessionPresent = !!(this._list.readUInt8(this._pos++) & a.SESSIONPRESENT_MASK), 
                5 === this.settings.protocolVersion ? e.reasonCode = this._list.readUInt8(this._pos++) : e.returnCode = this._list.readUInt8(this._pos++), 
                -1 === e.returnCode || -1 === e.reasonCode) return this._emitError(new Error("Cannot parse return code"));
                if (5 === this.settings.protocolVersion) {
                    var t = this._parseProperties();
                    Object.getOwnPropertyNames(t).length && (e.properties = t);
                }
            }, u.prototype._parsePublish = function() {
                var e = this.packet;
                if (e.topic = this._parseString(), null === e.topic) return this._emitError(new Error("Cannot parse topic"));
                if (!(e.qos > 0) || this._parseMessageId()) {
                    if (5 === this.settings.protocolVersion) {
                        var t = this._parseProperties();
                        Object.getOwnPropertyNames(t).length && (e.properties = t);
                    }
                    e.payload = this._list.slice(this._pos, e.length);
                }
            }, u.prototype._parseSubscribe = function() {
                var e, t, r, n, i, o, s, u = this.packet;
                if (1 !== u.qos) return this._emitError(new Error("Wrong subscribe header"));
                if (u.subscriptions = [], this._parseMessageId()) {
                    if (5 === this.settings.protocolVersion) {
                        var c = this._parseProperties();
                        Object.getOwnPropertyNames(c).length && (u.properties = c);
                    }
                    for (;this._pos < u.length; ) {
                        if (null === (e = this._parseString())) return this._emitError(new Error("Cannot parse topic"));
                        r = (t = this._parseByte()) & a.SUBSCRIBE_OPTIONS_QOS_MASK, o = 0 != (t >> a.SUBSCRIBE_OPTIONS_NL_SHIFT & a.SUBSCRIBE_OPTIONS_NL_MASK), 
                        i = 0 != (t >> a.SUBSCRIBE_OPTIONS_RAP_SHIFT & a.SUBSCRIBE_OPTIONS_RAP_MASK), n = t >> a.SUBSCRIBE_OPTIONS_RH_SHIFT & a.SUBSCRIBE_OPTIONS_RH_MASK, 
                        s = {
                            topic: e,
                            qos: r
                        }, 5 === this.settings.protocolVersion && (s.nl = o, s.rap = i, s.rh = n), u.subscriptions.push(s);
                    }
                }
            }, u.prototype._parseSuback = function() {
                var e = this.packet;
                if (this.packet.granted = [], this._parseMessageId()) {
                    if (5 === this.settings.protocolVersion) {
                        var t = this._parseProperties();
                        Object.getOwnPropertyNames(t).length && (e.properties = t);
                    }
                    for (;this._pos < this.packet.length; ) this.packet.granted.push(this._list.readUInt8(this._pos++));
                }
            }, u.prototype._parseUnsubscribe = function() {
                var e = this.packet;
                if (e.unsubscriptions = [], this._parseMessageId()) {
                    if (5 === this.settings.protocolVersion) {
                        var t = this._parseProperties();
                        Object.getOwnPropertyNames(t).length && (e.properties = t);
                    }
                    for (;this._pos < e.length; ) {
                        var r;
                        if (null === (r = this._parseString())) return this._emitError(new Error("Cannot parse topic"));
                        e.unsubscriptions.push(r);
                    }
                }
            }, u.prototype._parseUnsuback = function() {
                var e = this.packet;
                if (!this._parseMessageId()) return this._emitError(new Error("Cannot parse messageId"));
                if (5 === this.settings.protocolVersion) {
                    var t = this._parseProperties();
                    for (Object.getOwnPropertyNames(t).length && (e.properties = t), e.granted = []; this._pos < this.packet.length; ) this.packet.granted.push(this._list.readUInt8(this._pos++));
                }
            }, u.prototype._parseConfirmation = function() {
                var e = this.packet;
                if (this._parseMessageId(), 5 === this.settings.protocolVersion && e.length > 2) {
                    e.reasonCode = this._parseByte();
                    var t = this._parseProperties();
                    Object.getOwnPropertyNames(t).length && (e.properties = t);
                }
                return !0;
            }, u.prototype._parseDisconnect = function() {
                var e = this.packet;
                if (5 === this.settings.protocolVersion) {
                    e.reasonCode = this._parseByte();
                    var t = this._parseProperties();
                    Object.getOwnPropertyNames(t).length && (e.properties = t);
                }
                return !0;
            }, u.prototype._parseAuth = function() {
                var e = this.packet;
                if (5 !== this.settings.protocolVersion) return this._emitError(new Error("Not supported auth packet for this version MQTT"));
                e.reasonCode = this._parseByte();
                var t = this._parseProperties();
                return Object.getOwnPropertyNames(t).length && (e.properties = t), !0;
            }, u.prototype._parseMessageId = function() {
                var e = this.packet;
                return e.messageId = this._parseNum(), null !== e.messageId || (this._emitError(new Error("Cannot parse messageId")), 
                !1);
            }, u.prototype._parseString = function(e) {
                var t, r = this._parseNum(), n = r + this._pos;
                return -1 === r || n > this._list.length || n > this.packet.length ? null : (t = this._list.toString("utf8", this._pos, n), 
                this._pos += r, t);
            }, u.prototype._parseStringPair = function() {
                return {
                    name: this._parseString(),
                    value: this._parseString()
                };
            }, u.prototype._parseBuffer = function() {
                var e, t = this._parseNum(), r = t + this._pos;
                return -1 === t || r > this._list.length || r > this.packet.length ? null : (e = this._list.slice(this._pos, r), 
                this._pos += t, e);
            }, u.prototype._parseNum = function() {
                if (this._list.length - this._pos < 2) return -1;
                var e = this._list.readUInt16BE(this._pos);
                return this._pos += 2, e;
            }, u.prototype._parse4ByteNum = function() {
                if (this._list.length - this._pos < 4) return -1;
                var e = this._list.readUInt32BE(this._pos);
                return this._pos += 4, e;
            }, u.prototype._parseVarByteNum = function(e) {
                for (var t, r = 0, n = 1, i = 0, o = !0, s = this._pos ? this._pos : 0; r < 5 && (i += n * ((t = this._list.readUInt8(s + r++)) & a.LENGTH_MASK), 
                n *= 128, 0 != (t & a.LENGTH_FIN_MASK)); ) if (this._list.length <= r) {
                    o = !1;
                    break;
                }
                return s && (this._pos += r), o = !!o && (e ? {
                    bytes: r,
                    value: i
                } : i);
            }, u.prototype._parseByte = function() {
                var e = this._list.readUInt8(this._pos);
                return this._pos++, e;
            }, u.prototype._parseByType = function(e) {
                switch (e) {
                  case "byte":
                    return 0 !== this._parseByte();

                  case "int8":
                    return this._parseByte();

                  case "int16":
                    return this._parseNum();

                  case "int32":
                    return this._parse4ByteNum();

                  case "var":
                    return this._parseVarByteNum();

                  case "string":
                    return this._parseString();

                  case "pair":
                    return this._parseStringPair();

                  case "binary":
                    return this._parseBuffer();
                }
            }, u.prototype._parseProperties = function() {
                for (var e = this._parseVarByteNum(), t = this._pos + e, r = {}; this._pos < t; ) {
                    var n = this._parseByte(), i = a.propertiesCodes[n];
                    if (!i) return this._emitError(new Error("Unknown property")), !1;
                    if ("userProperties" !== i) r[i] = this._parseByType(a.propertiesTypes[i]); else {
                        r[i] || (r[i] = {});
                        var o = this._parseByType(a.propertiesTypes[i]);
                        r[i][o.name] = o.value;
                    }
                }
                return r;
            }, u.prototype._newPacket = function() {
                return this.packet && (this._list.consume(this.packet.length), this.emit("packet", this.packet)), 
                this.packet = new s(), this._pos = 0, !0;
            }, u.prototype._emitError = function(e) {
                this.error = e, this.emit("error", e);
            }, t.exports = u;
        }, {
            "./constants": 82,
            "./packet": 87,
            bl: 85,
            events: 13,
            inherits: 80
        } ],
        89: [ function(t, r, n) {
            var i = t("./constants"), o = t("safe-buffer").Buffer, s = o.allocUnsafe(0), a = o.from([ 0 ]), u = t("./numbers"), c = t("process-nextick-args").nextTick, l = u.cache, f = u.generateNumber, h = u.generateCache, p = u.genBufVariableByteInt, d = u.generate4ByteBuffer, g = x, b = !0;
            function y(t, r, n) {
                switch (r.cork && (r.cork(), c(_, r)), b && (b = !1, h()), t.cmd) {
                  case "connect":
                    return function(t, r, n) {
                        var s = t || {}, a = s.protocolId || "MQTT", u = s.protocolVersion || 4, c = s.will, l = s.clean, f = s.keepalive || 0, h = s.clientId || "", p = s.username, d = s.password, b = s.properties;
                        void 0 === l && (l = !0);
                        var y = 0;
                        if (!a || "string" != typeof a && !o.isBuffer(a)) return r.emit("error", new Error("Invalid protocolId")), 
                        !1;
                        y += a.length + 2;
                        if (3 !== u && 4 !== u && 5 !== u) return r.emit("error", new Error("Invalid protocol version")), 
                        !1;
                        y += 1;
                        if ("string" != typeof h && !o.isBuffer(h) || !h && 4 !== u || !h && !l) {
                            if (u < 4) return r.emit("error", new Error("clientId must be supplied before 3.1.1")), 
                            !1;
                            if (1 * l == 0) return r.emit("error", new Error("clientId must be given if cleanSession set to 0")), 
                            !1;
                        } else y += h.length + 2;
                        if ("number" != typeof f || f < 0 || f > 65535 || f % 1 != 0) return r.emit("error", new Error("Invalid keepalive")), 
                        !1;
                        y += 2;
                        if (y += 1, 5 === u) {
                            var _ = O(r, b);
                            y += _.length;
                        }
                        if (c) {
                            if ("object" !== e(c)) return r.emit("error", new Error("Invalid will")), !1;
                            if (!c.topic || "string" != typeof c.topic) return r.emit("error", new Error("Invalid will topic")), 
                            !1;
                            if (y += o.byteLength(c.topic) + 2, c.payload) {
                                if (!(c.payload.length >= 0)) return r.emit("error", new Error("Invalid will payload")), 
                                !1;
                                "string" == typeof c.payload ? y += o.byteLength(c.payload) + 2 : y += c.payload.length + 2;
                                var m = {};
                                5 === u && (m = O(r, c.properties), y += m.length);
                            }
                        }
                        var S = !1;
                        if (null != p) {
                            if (!P(p)) return r.emit("error", new Error("Invalid username")), !1;
                            S = !0, y += o.byteLength(p) + 2;
                        }
                        if (null != d) {
                            if (!S) return r.emit("error", new Error("Username is required to use password")), 
                            !1;
                            if (!P(d)) return r.emit("error", new Error("Invalid password")), !1;
                            y += A(d) + 2;
                        }
                        r.write(i.CONNECT_HEADER), v(r, y), I(r, a), r.write(4 === u ? i.VERSION4 : 5 === u ? i.VERSION5 : i.VERSION3);
                        var x = 0;
                        x |= null != p ? i.USERNAME_MASK : 0, x |= null != d ? i.PASSWORD_MASK : 0, x |= c && c.retain ? i.WILL_RETAIN_MASK : 0, 
                        x |= c && c.qos ? c.qos << i.WILL_QOS_SHIFT : 0, x |= c ? i.WILL_FLAG_MASK : 0, 
                        x |= l ? i.CLEAN_SESSION_MASK : 0, r.write(o.from([ x ])), g(r, f), 5 === u && _.write();
                        I(r, h), c && (5 === u && m.write(), w(r, c.topic), I(r, c.payload));
                        null != p && I(r, p);
                        null != d && I(r, d);
                        return !0;
                    }(t, r);

                  case "connack":
                    return function(e, t, r) {
                        var n = r ? r.protocolVersion : 4, s = e || {}, u = 5 === n ? s.reasonCode : s.returnCode, c = s.properties, l = 2;
                        if ("number" != typeof u) return t.emit("error", new Error("Invalid return code")), 
                        !1;
                        var f = null;
                        5 === n && (f = O(t, c), l += f.length);
                        t.write(i.CONNACK_HEADER), v(t, l), t.write(s.sessionPresent ? i.SESSIONPRESENT_HEADER : a), 
                        t.write(o.from([ u ])), null != f && f.write();
                        return !0;
                    }(t, r, n);

                  case "publish":
                    return function(e, t, r) {
                        var n = r ? r.protocolVersion : 4, a = e || {}, u = a.qos || 0, c = a.retain ? i.RETAIN_MASK : 0, l = a.topic, f = a.payload || s, h = a.messageId, p = a.properties, d = 0;
                        if ("string" == typeof l) d += o.byteLength(l) + 2; else {
                            if (!o.isBuffer(l)) return t.emit("error", new Error("Invalid topic")), !1;
                            d += l.length + 2;
                        }
                        o.isBuffer(f) ? d += f.length : d += o.byteLength(f);
                        if (u && "number" != typeof h) return t.emit("error", new Error("Invalid messageId")), 
                        !1;
                        u && (d += 2);
                        var b = null;
                        5 === n && (b = O(t, p), d += b.length);
                        t.write(i.PUBLISH_HEADER[u][a.dup ? 1 : 0][c ? 1 : 0]), v(t, d), g(t, A(l)), t.write(l), 
                        u > 0 && g(t, h);
                        null != b && b.write();
                        return t.write(f);
                    }(t, r, n);

                  case "puback":
                  case "pubrec":
                  case "pubrel":
                  case "pubcomp":
                    return function(e, t, r) {
                        var n = r ? r.protocolVersion : 4, s = e || {}, a = s.cmd || "puback", u = s.messageId, c = s.dup && "pubrel" === a ? i.DUP_MASK : 0, l = 0, f = s.reasonCode, h = s.properties, p = 5 === n ? 3 : 2;
                        "pubrel" === a && (l = 1);
                        if ("number" != typeof u) return t.emit("error", new Error("Invalid messageId")), 
                        !1;
                        var d = null;
                        if (5 === n) {
                            if (!(d = j(t, h, r, p))) return !1;
                            p += d.length;
                        }
                        t.write(i.ACKS[a][l][c][0]), v(t, p), g(t, u), 5 === n && t.write(o.from([ f ]));
                        null !== d && d.write();
                        return !0;
                    }(t, r, n);

                  case "subscribe":
                    return function(t, r, n) {
                        var s = n ? n.protocolVersion : 4, a = t || {}, u = a.dup ? i.DUP_MASK : 0, c = a.messageId, l = a.subscriptions, f = a.properties, h = 0;
                        if ("number" != typeof c) return r.emit("error", new Error("Invalid messageId")), 
                        !1;
                        h += 2;
                        var p = null;
                        5 === s && (p = O(r, f), h += p.length);
                        if ("object" !== e(l) || !l.length) return r.emit("error", new Error("Invalid subscriptions")), 
                        !1;
                        for (var d = 0; d < l.length; d += 1) {
                            var b = l[d].topic, y = l[d].qos;
                            if ("string" != typeof b) return r.emit("error", new Error("Invalid subscriptions - invalid topic")), 
                            !1;
                            if ("number" != typeof y) return r.emit("error", new Error("Invalid subscriptions - invalid qos")), 
                            !1;
                            if (5 === s) {
                                if ("boolean" != typeof (l[d].nl || !1)) return r.emit("error", new Error("Invalid subscriptions - invalid No Local")), 
                                !1;
                                if ("boolean" != typeof (l[d].rap || !1)) return r.emit("error", new Error("Invalid subscriptions - invalid Retain as Published")), 
                                !1;
                                var _ = l[d].rh || 0;
                                if ("number" != typeof _ || _ > 2) return r.emit("error", new Error("Invalid subscriptions - invalid Retain Handling")), 
                                !1;
                            }
                            h += o.byteLength(b) + 2 + 1;
                        }
                        r.write(i.SUBSCRIBE_HEADER[1][u ? 1 : 0][0]), v(r, h), g(r, c), null !== p && p.write();
                        for (var m = !0, S = 0; S < l.length; S++) {
                            var x, E = l[S], k = E.topic, I = E.qos, j = +E.nl, T = +E.rap, A = E.rh;
                            w(r, k), x = i.SUBSCRIBE_OPTIONS_QOS[I], 5 === s && (x |= j ? i.SUBSCRIBE_OPTIONS_NL : 0, 
                            x |= T ? i.SUBSCRIBE_OPTIONS_RAP : 0, x |= A ? i.SUBSCRIBE_OPTIONS_RH[A] : 0), m = r.write(o.from([ x ]));
                        }
                        return m;
                    }(t, r, n);

                  case "suback":
                    return function(t, r, n) {
                        var s = n ? n.protocolVersion : 4, a = t || {}, u = a.messageId, c = a.granted, l = a.properties, f = 0;
                        if ("number" != typeof u) return r.emit("error", new Error("Invalid messageId")), 
                        !1;
                        f += 2;
                        if ("object" !== e(c) || !c.length) return r.emit("error", new Error("Invalid qos vector")), 
                        !1;
                        for (var h = 0; h < c.length; h += 1) {
                            if ("number" != typeof c[h]) return r.emit("error", new Error("Invalid qos vector")), 
                            !1;
                            f += 1;
                        }
                        var p = null;
                        if (5 === s) {
                            if (!(p = j(r, l, n, f))) return !1;
                            f += p.length;
                        }
                        r.write(i.SUBACK_HEADER), v(r, f), g(r, u), null !== p && p.write();
                        return r.write(o.from(c));
                    }(t, r, n);

                  case "unsubscribe":
                    return function(t, r, n) {
                        var s = n ? n.protocolVersion : 4, a = t || {}, u = a.messageId, c = a.dup ? i.DUP_MASK : 0, l = a.unsubscriptions, f = a.properties, h = 0;
                        if ("number" != typeof u) return r.emit("error", new Error("Invalid messageId")), 
                        !1;
                        h += 2;
                        if ("object" !== e(l) || !l.length) return r.emit("error", new Error("Invalid unsubscriptions")), 
                        !1;
                        for (var p = 0; p < l.length; p += 1) {
                            if ("string" != typeof l[p]) return r.emit("error", new Error("Invalid unsubscriptions")), 
                            !1;
                            h += o.byteLength(l[p]) + 2;
                        }
                        var d = null;
                        5 === s && (d = O(r, f), h += d.length);
                        r.write(i.UNSUBSCRIBE_HEADER[1][c ? 1 : 0][0]), v(r, h), g(r, u), null !== d && d.write();
                        for (var b = !0, y = 0; y < l.length; y++) b = w(r, l[y]);
                        return b;
                    }(t, r, n);

                  case "unsuback":
                    return function(t, r, n) {
                        var s = n ? n.protocolVersion : 4, a = t || {}, u = a.messageId, c = a.dup ? i.DUP_MASK : 0, l = a.granted, f = a.properties, h = a.cmd, p = 2;
                        if ("number" != typeof u) return r.emit("error", new Error("Invalid messageId")), 
                        !1;
                        if (5 === s) {
                            if ("object" !== e(l) || !l.length) return r.emit("error", new Error("Invalid qos vector")), 
                            !1;
                            for (var d = 0; d < l.length; d += 1) {
                                if ("number" != typeof l[d]) return r.emit("error", new Error("Invalid qos vector")), 
                                !1;
                                p += 1;
                            }
                        }
                        var b = null;
                        if (5 === s) {
                            if (!(b = j(r, f, n, p))) return !1;
                            p += b.length;
                        }
                        r.write(i.ACKS[h][0][c][0]), v(r, p), g(r, u), null !== b && b.write();
                        5 === s && r.write(o.from(l));
                        return !0;
                    }(t, r, n);

                  case "pingreq":
                  case "pingresp":
                    return function(e, t, r) {
                        return t.write(i.EMPTY[e.cmd]);
                    }(t, r);

                  case "disconnect":
                    return function(e, t, r) {
                        var n = r ? r.protocolVersion : 4, s = e || {}, a = s.reasonCode, u = s.properties, c = 5 === n ? 1 : 0, l = null;
                        if (5 === n) {
                            if (!(l = j(t, u, r, c))) return !1;
                            c += l.length;
                        }
                        t.write(o.from([ i.codes.disconnect << 4 ])), v(t, c), 5 === n && t.write(o.from([ a ]));
                        null !== l && l.write();
                        return !0;
                    }(t, r, n);

                  case "auth":
                    return function(e, t, r) {
                        var n = r ? r.protocolVersion : 4, s = e || {}, a = s.reasonCode, u = s.properties, c = 5 === n ? 1 : 0;
                        5 !== n && t.emit("error", new Error("Invalid mqtt version for auth packet"));
                        var l = j(t, u, r, c);
                        if (!l) return !1;
                        c += l.length, t.write(o.from([ i.codes.auth << 4 ])), v(t, c), t.write(o.from([ a ])), 
                        null !== l && l.write();
                        return !0;
                    }(t, r, n);

                  default:
                    return r.emit("error", new Error("Unknown command")), !1;
                }
            }
            function _(e) {
                e.uncork();
            }
            Object.defineProperty(y, "cacheNumbers", {
                get: function() {
                    return g === x;
                },
                set: function(e) {
                    e ? (l && 0 !== Object.keys(l).length || (b = !0), g = x) : (b = !1, g = E);
                }
            });
            var m = {};
            function v(e, t) {
                var r = m[t];
                r || (r = p(t).data, t < 16384 && (m[t] = r)), e.write(r);
            }
            function w(e, t) {
                var r = o.byteLength(t);
                g(e, r), e.write(t, "utf8");
            }
            function S(e, t, r) {
                w(e, t), w(e, r);
            }
            function x(e, t) {
                return e.write(l[t]);
            }
            function E(e, t) {
                return e.write(f(t));
            }
            function k(e, t) {
                return e.write(d(t));
            }
            function I(e, t) {
                "string" == typeof t ? w(e, t) : t ? (g(e, t.length), e.write(t)) : g(e, 0);
            }
            function O(t, r) {
                if ("object" !== e(r) || null != r.length) return {
                    length: 1,
                    write: function() {
                        T(t, {}, 0);
                    }
                };
                var n = 0;
                function s(n) {
                    var s = i.propertiesTypes[n], a = r[n], u = 0;
                    switch (s) {
                      case "byte":
                        if ("boolean" != typeof a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 2;
                        break;

                      case "int8":
                        if ("number" != typeof a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 2;
                        break;

                      case "binary":
                        if (a && null === a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 1 + o.byteLength(a) + 2;
                        break;

                      case "int16":
                        if ("number" != typeof a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 3;
                        break;

                      case "int32":
                        if ("number" != typeof a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 5;
                        break;

                      case "var":
                        if ("number" != typeof a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 1 + p(a).length;
                        break;

                      case "string":
                        if ("string" != typeof a) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += 3 + o.byteLength(a.toString());
                        break;

                      case "pair":
                        if ("object" !== e(a)) return t.emit("error", new Error("Invalid " + n)), !1;
                        u += Object.getOwnPropertyNames(a).reduce(function(e, t) {
                            return e += 3 + o.byteLength(t.toString()) + 2 + o.byteLength(a[t].toString());
                        }, 0);
                        break;

                      default:
                        return t.emit("error", new Error("Invalid property " + n)), !1;
                    }
                    return u;
                }
                if (r) for (var a in r) {
                    var u = s(a);
                    if (!u) return !1;
                    n += u;
                }
                return {
                    length: p(n).length + n,
                    write: function() {
                        T(t, r, n);
                    }
                };
            }
            function j(e, t, r, n) {
                var i = [ "reasonString", "userProperties" ], o = r && r.properties && r.properties.maximumPacketSize ? r.properties.maximumPacketSize : 0, s = O(e, t);
                if (o) for (;n + s.length > o; ) {
                    var a = i.shift();
                    if (!a || !t[a]) return !1;
                    delete t[a], s = O(e, t);
                }
                return s;
            }
            function T(e, t, r) {
                for (var n in v(e, r), t) if (t.hasOwnProperty(n) && null !== t[n]) {
                    var s = t[n];
                    switch (i.propertiesTypes[n]) {
                      case "byte":
                        e.write(o.from([ i.properties[n] ])), e.write(o.from([ +s ]));
                        break;

                      case "int8":
                        e.write(o.from([ i.properties[n] ])), e.write(o.from([ s ]));
                        break;

                      case "binary":
                        e.write(o.from([ i.properties[n] ])), I(e, s);
                        break;

                      case "int16":
                        e.write(o.from([ i.properties[n] ])), g(e, s);
                        break;

                      case "int32":
                        e.write(o.from([ i.properties[n] ])), k(e, s);
                        break;

                      case "var":
                        e.write(o.from([ i.properties[n] ])), v(e, s);
                        break;

                      case "string":
                        e.write(o.from([ i.properties[n] ])), w(e, s);
                        break;

                      case "pair":
                        Object.getOwnPropertyNames(s).forEach(function(t) {
                            e.write(o.from([ i.properties[n] ])), S(e, t.toString(), s[t].toString());
                        });
                        break;

                      default:
                        return e.emit("error", new Error("Invalid property " + n)), !1;
                    }
                }
            }
            function A(e) {
                return e ? e instanceof o ? e.length : o.byteLength(e) : 0;
            }
            function P(e) {
                return "string" == typeof e || e instanceof o;
            }
            r.exports = y;
        }, {
            "./constants": 82,
            "./numbers": 86,
            "process-nextick-args": 91,
            "safe-buffer": 110
        } ],
        90: [ function(e, t, r) {
            var n = e("wrappy");
            function i(e) {
                var t = function t() {
                    return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
                };
                return t.called = !1, t;
            }
            function o(e) {
                var t = function t() {
                    if (t.called) throw new Error(t.onceError);
                    return t.called = !0, t.value = e.apply(this, arguments);
                }, r = e.name || "Function wrapped with `once`";
                return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
            }
            t.exports = n(i), t.exports.strict = n(o), i.proto = i(function() {
                Object.defineProperty(Function.prototype, "once", {
                    value: function() {
                        return i(this);
                    },
                    configurable: !0
                }), Object.defineProperty(Function.prototype, "onceStrict", {
                    value: function() {
                        return o(this);
                    },
                    configurable: !0
                });
            });
        }, {
            wrappy: 120
        } ],
        91: [ function(e, t, r) {
            (function(e) {
                !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
                    nextTick: function(t, r, n, i) {
                        if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
                        var o, s, a = arguments.length;
                        switch (a) {
                          case 0:
                          case 1:
                            return e.nextTick(t);

                          case 2:
                            return e.nextTick(function() {
                                t.call(null, r);
                            });

                          case 3:
                            return e.nextTick(function() {
                                t.call(null, r, n);
                            });

                          case 4:
                            return e.nextTick(function() {
                                t.call(null, r, n, i);
                            });

                          default:
                            for (o = new Array(a - 1), s = 0; s < o.length; ) o[s++] = arguments[s];
                            return e.nextTick(function() {
                                t.apply(null, o);
                            });
                        }
                    }
                } : t.exports = e;
            }).call(this, e("_process"));
        }, {
            _process: 92
        } ],
        92: [ function(e, t, r) {
            var n, i, o = t.exports = {};
            function s() {
                throw new Error("setTimeout has not been defined");
            }
            function a() {
                throw new Error("clearTimeout has not been defined");
            }
            function u(e) {
                if (n === setTimeout) return setTimeout(e, 0);
                if ((n === s || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
                try {
                    return n(e, 0);
                } catch (t) {
                    t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                    try {
                        return n.call(null, e, 0);
                    } catch (t) {
                        t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                        return n.call(this, e, 0);
                    }
                }
            }
            !function() {
                try {
                    n = "function" == typeof setTimeout ? setTimeout : s;
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    n = s;
                }
                try {
                    i = "function" == typeof clearTimeout ? clearTimeout : a;
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    i = a;
                }
            }();
            var c, l = [], f = !1, h = -1;
            function p() {
                f && c && (f = !1, c.length ? l = c.concat(l) : h = -1, l.length && d());
            }
            function d() {
                if (!f) {
                    var e = u(p);
                    f = !0;
                    for (var t = l.length; t; ) {
                        for (c = l, l = []; ++h < t; ) c && c[h].run();
                        h = -1, t = l.length;
                    }
                    c = null, f = !1, function(e) {
                        if (i === clearTimeout) return clearTimeout(e);
                        if ((i === a || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);
                        try {
                            i(e);
                        } catch (t) {
                            t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                            try {
                                return i.call(null, e);
                            } catch (t) {
                                t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                                return i.call(this, e);
                            }
                        }
                    }(e);
                }
            }
            function g(e, t) {
                this.fun = e, this.array = t;
            }
            function b() {}
            o.nextTick = function(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                l.push(new g(e, t)), 1 !== l.length || f || u(d);
            }, g.prototype.run = function() {
                this.fun.apply(null, this.array);
            }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", 
            o.versions = {}, o.on = b, o.addListener = b, o.once = b, o.off = b, o.removeListener = b, 
            o.removeAllListeners = b, o.emit = b, o.prependListener = b, o.prependOnceListener = b, 
            o.listeners = function(e) {
                return [];
            }, o.binding = function(e) {
                throw new Error("process.binding is not supported");
            }, o.cwd = function() {
                return "/";
            }, o.chdir = function(e) {
                throw new Error("process.chdir is not supported");
            }, o.umask = function() {
                return 0;
            };
        }, {} ],
        93: [ function(t, r, n) {
            (function(t) {
                !function(i) {
                    var o = "object" == e(n) && n && !n.nodeType && n, s = "object" == e(r) && r && !r.nodeType && r, a = "object" == e(t) && t;
                    a.global !== a && a.window !== a && a.self !== a || (i = a);
                    var u, c, l = 2147483647, f = /^xn--/, h = /[^\x20-\x7E]/, p = /[\x2E\u3002\uFF0E\uFF61]/g, d = {
                        overflow: "Overflow: input needs wider integers to process",
                        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                        "invalid-input": "Invalid input"
                    }, g = Math.floor, b = String.fromCharCode;
                    function y(e) {
                        throw new RangeError(d[e]);
                    }
                    function _(e, t) {
                        for (var r = e.length, n = []; r--; ) n[r] = t(e[r]);
                        return n;
                    }
                    function m(e, t) {
                        var r = e.split("@"), n = "";
                        return r.length > 1 && (n = r[0] + "@", e = r[1]), n + _((e = e.replace(p, ".")).split("."), t).join(".");
                    }
                    function v(e) {
                        for (var t, r, n = [], i = 0, o = e.length; i < o; ) (t = e.charCodeAt(i++)) >= 55296 && t <= 56319 && i < o ? 56320 == (64512 & (r = e.charCodeAt(i++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), 
                        i--) : n.push(t);
                        return n;
                    }
                    function w(e) {
                        return _(e, function(e) {
                            var t = "";
                            return e > 65535 && (t += b((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), 
                            t += b(e);
                        }).join("");
                    }
                    function S(e, t) {
                        return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
                    }
                    function x(e, t, r) {
                        var n = 0;
                        for (e = r ? g(e / 700) : e >> 1, e += g(e / t); e > 455; n += 36) e = g(e / 35);
                        return g(n + 36 * e / (e + 38));
                    }
                    function E(e) {
                        var t, r, n, i, o, s, a, u, c, f, h, p = [], d = e.length, b = 0, _ = 128, m = 72;
                        for ((r = e.lastIndexOf("-")) < 0 && (r = 0), n = 0; n < r; ++n) e.charCodeAt(n) >= 128 && y("not-basic"), 
                        p.push(e.charCodeAt(n));
                        for (i = r > 0 ? r + 1 : 0; i < d; ) {
                            for (o = b, s = 1, a = 36; i >= d && y("invalid-input"), ((u = (h = e.charCodeAt(i++)) - 48 < 10 ? h - 22 : h - 65 < 26 ? h - 65 : h - 97 < 26 ? h - 97 : 36) >= 36 || u > g((l - b) / s)) && y("overflow"), 
                            b += u * s, !(u < (c = a <= m ? 1 : a >= m + 26 ? 26 : a - m)); a += 36) s > g(l / (f = 36 - c)) && y("overflow"), 
                            s *= f;
                            m = x(b - o, t = p.length + 1, 0 == o), g(b / t) > l - _ && y("overflow"), _ += g(b / t), 
                            b %= t, p.splice(b++, 0, _);
                        }
                        return w(p);
                    }
                    function k(e) {
                        var t, r, n, i, o, s, a, u, c, f, h, p, d, _, m, w = [];
                        for (p = (e = v(e)).length, t = 128, r = 0, o = 72, s = 0; s < p; ++s) (h = e[s]) < 128 && w.push(b(h));
                        for (n = i = w.length, i && w.push("-"); n < p; ) {
                            for (a = l, s = 0; s < p; ++s) (h = e[s]) >= t && h < a && (a = h);
                            for (a - t > g((l - r) / (d = n + 1)) && y("overflow"), r += (a - t) * d, t = a, 
                            s = 0; s < p; ++s) if ((h = e[s]) < t && ++r > l && y("overflow"), h == t) {
                                for (u = r, c = 36; !(u < (f = c <= o ? 1 : c >= o + 26 ? 26 : c - o)); c += 36) m = u - f, 
                                _ = 36 - f, w.push(b(S(f + m % _, 0))), u = g(m / _);
                                w.push(b(S(u, 0))), o = x(r, d, n == i), r = 0, ++n;
                            }
                            ++r, ++t;
                        }
                        return w.join("");
                    }
                    if (u = {
                        version: "1.4.1",
                        ucs2: {
                            decode: v,
                            encode: w
                        },
                        decode: E,
                        encode: k,
                        toASCII: function(e) {
                            return m(e, function(e) {
                                return h.test(e) ? "xn--" + k(e) : e;
                            });
                        },
                        toUnicode: function(e) {
                            return m(e, function(e) {
                                return f.test(e) ? E(e.slice(4).toLowerCase()) : e;
                            });
                        }
                    }, o && s) if (r.exports == o) s.exports = u; else for (c in u) u.hasOwnProperty(c) && (o[c] = u[c]); else i.punycode = u;
                }(this);
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {} ],
        94: [ function(e, t, r) {
            function n(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
            }
            t.exports = function(e, t, r, o) {
                t = t || "&", r = r || "=";
                var s = {};
                if ("string" != typeof e || 0 === e.length) return s;
                var a = /\+/g;
                e = e.split(t);
                var u = 1e3;
                o && "number" == typeof o.maxKeys && (u = o.maxKeys);
                var c = e.length;
                u > 0 && c > u && (c = u);
                for (var l = 0; l < c; ++l) {
                    var f, h, p, d, g = e[l].replace(a, "%20"), b = g.indexOf(r);
                    b >= 0 ? (f = g.substr(0, b), h = g.substr(b + 1)) : (f = g, h = ""), p = decodeURIComponent(f), 
                    d = decodeURIComponent(h), n(s, p) ? i(s[p]) ? s[p].push(d) : s[p] = [ s[p], d ] : s[p] = d;
                }
                return s;
            };
            var i = Array.isArray || function(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
            };
        }, {} ],
        95: [ function(t, r, n) {
            var i = function(t) {
                switch (e(t)) {
                  case "string":
                    return t;

                  case "boolean":
                    return t ? "true" : "false";

                  case "number":
                    return isFinite(t) ? t : "";

                  default:
                    return "";
                }
            };
            r.exports = function(t, r, n, u) {
                return r = r || "&", n = n || "=", null === t && (t = void 0), "object" === e(t) ? s(a(t), function(e) {
                    var a = encodeURIComponent(i(e)) + n;
                    return o(t[e]) ? s(t[e], function(e) {
                        return a + encodeURIComponent(i(e));
                    }).join(r) : a + encodeURIComponent(i(t[e]));
                }).join(r) : u ? encodeURIComponent(i(u)) + n + encodeURIComponent(i(t)) : "";
            };
            var o = Array.isArray || function(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
            };
            function s(e, t) {
                if (e.map) return e.map(t);
                for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));
                return r;
            }
            var a = Object.keys || function(e) {
                var t = [];
                for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
                return t;
            };
        }, {} ],
        96: [ function(e, t, r) {
            r.decode = r.parse = e("./decode"), r.encode = r.stringify = e("./encode");
        }, {
            "./decode": 94,
            "./encode": 95
        } ],
        97: [ function(e, t, r) {
            t.exports = e("./lib/_stream_duplex.js");
        }, {
            "./lib/_stream_duplex.js": 98
        } ],
        98: [ function(e, t, r) {
            var n = e("process-nextick-args"), i = Object.keys || function(e) {
                var t = [];
                for (var r in e) t.push(r);
                return t;
            };
            t.exports = f;
            var o = e("core-util-is");
            o.inherits = e("inherits");
            var s = e("./_stream_readable"), a = e("./_stream_writable");
            o.inherits(f, s);
            for (var u = i(a.prototype), c = 0; c < u.length; c++) {
                var l = u[c];
                f.prototype[l] || (f.prototype[l] = a.prototype[l]);
            }
            function f(e) {
                if (!(this instanceof f)) return new f(e);
                s.call(this, e), a.call(this, e), e && !1 === e.readable && (this.readable = !1), 
                e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), 
                this.once("end", h);
            }
            function h() {
                this.allowHalfOpen || this._writableState.ended || n.nextTick(p, this);
            }
            function p(e) {
                e.end();
            }
            Object.defineProperty(f.prototype, "writableHighWaterMark", {
                enumerable: !1,
                get: function() {
                    return this._writableState.highWaterMark;
                }
            }), Object.defineProperty(f.prototype, "destroyed", {
                get: function() {
                    return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
                },
                set: function(e) {
                    void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, 
                    this._writableState.destroyed = e);
                }
            }), f.prototype._destroy = function(e, t) {
                this.push(null), this.end(), n.nextTick(t, e);
            };
        }, {
            "./_stream_readable": 100,
            "./_stream_writable": 102,
            "core-util-is": 14,
            inherits: 80,
            "process-nextick-args": 91
        } ],
        99: [ function(e, t, r) {
            t.exports = o;
            var n = e("./_stream_transform"), i = e("core-util-is");
            function o(e) {
                if (!(this instanceof o)) return new o(e);
                n.call(this, e);
            }
            i.inherits = e("inherits"), i.inherits(o, n), o.prototype._transform = function(e, t, r) {
                r(null, e);
            };
        }, {
            "./_stream_transform": 101,
            "core-util-is": 14,
            inherits: 80
        } ],
        100: [ function(e, t, r) {
            (function(r, n) {
                var i = e("process-nextick-args");
                t.exports = m;
                var o, s = e("isarray");
                m.ReadableState = _;
                e("events").EventEmitter;
                var a = function(e, t) {
                    return e.listeners(t).length;
                }, u = e("./internal/streams/stream"), c = e("safe-buffer").Buffer, l = n.Uint8Array || function() {};
                var f = e("core-util-is");
                f.inherits = e("inherits");
                var h = e("util"), p = void 0;
                p = h && h.debuglog ? h.debuglog("stream") : function() {};
                var d, g = e("./internal/streams/BufferList"), b = e("./internal/streams/destroy");
                f.inherits(m, u);
                var y = [ "error", "close", "destroy", "pause", "resume" ];
                function _(t, r) {
                    t = t || {};
                    var n = r instanceof (o = o || e("./_stream_duplex"));
                    this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode);
                    var i = t.highWaterMark, s = t.readableHighWaterMark, a = this.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : n && (s || 0 === s) ? s : a, this.highWaterMark = Math.floor(this.highWaterMark), 
                    this.buffer = new g(), this.length = 0, this.pipes = null, this.pipesCount = 0, 
                    this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, 
                    this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, 
                    this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", 
                    this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, 
                    t.encoding && (d || (d = e("string_decoder/").StringDecoder), this.decoder = new d(t.encoding), 
                    this.encoding = t.encoding);
                }
                function m(t) {
                    if (o = o || e("./_stream_duplex"), !(this instanceof m)) return new m(t);
                    this._readableState = new _(t, this), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), 
                    "function" == typeof t.destroy && (this._destroy = t.destroy)), u.call(this);
                }
                function v(e, t, r, n, i) {
                    var o, s = e._readableState;
                    null === t ? (s.reading = !1, function(e, t) {
                        if (t.ended) return;
                        if (t.decoder) {
                            var r = t.decoder.end();
                            r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
                        }
                        t.ended = !0, x(e);
                    }(e, s)) : (i || (o = function(e, t) {
                        var r;
                        n = t, c.isBuffer(n) || n instanceof l || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
                        var n;
                        return r;
                    }(s, t)), o ? e.emit("error", o) : s.objectMode || t && t.length > 0 ? ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function(e) {
                        return c.from(e);
                    }(t)), n ? s.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : w(e, s, t, !0) : s.ended ? e.emit("error", new Error("stream.push() after EOF")) : (s.reading = !1, 
                    s.decoder && !r ? (t = s.decoder.write(t), s.objectMode || 0 !== t.length ? w(e, s, t, !1) : k(e, s)) : w(e, s, t, !1))) : n || (s.reading = !1));
                    return function(e) {
                        return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
                    }(s);
                }
                function w(e, t, r, n) {
                    t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, 
                    n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && x(e)), k(e, t);
                }
                Object.defineProperty(m.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._readableState && this._readableState.destroyed;
                    },
                    set: function(e) {
                        this._readableState && (this._readableState.destroyed = e);
                    }
                }), m.prototype.destroy = b.destroy, m.prototype._undestroy = b.undestroy, m.prototype._destroy = function(e, t) {
                    this.push(null), t(e);
                }, m.prototype.push = function(e, t) {
                    var r, n = this._readableState;
                    return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = c.from(e, t), 
                    t = ""), r = !0), v(this, e, t, !1, r);
                }, m.prototype.unshift = function(e) {
                    return v(this, e, null, !0, !1);
                }, m.prototype.isPaused = function() {
                    return !1 === this._readableState.flowing;
                }, m.prototype.setEncoding = function(t) {
                    return d || (d = e("string_decoder/").StringDecoder), this._readableState.decoder = new d(t), 
                    this._readableState.encoding = t, this;
                };
                function S(e, t) {
                    return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function(e) {
                        return e >= 8388608 ? e = 8388608 : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, 
                        e |= e >>> 8, e |= e >>> 16, e++), e;
                    }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
                }
                function x(e) {
                    var t = e._readableState;
                    t.needReadable = !1, t.emittedReadable || (p("emitReadable", t.flowing), t.emittedReadable = !0, 
                    t.sync ? i.nextTick(E, e) : E(e));
                }
                function E(e) {
                    p("emit readable"), e.emit("readable"), T(e);
                }
                function k(e, t) {
                    t.readingMore || (t.readingMore = !0, i.nextTick(I, e, t));
                }
                function I(e, t) {
                    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (p("maybeReadMore read 0"), 
                    e.read(0), r !== t.length); ) r = t.length;
                    t.readingMore = !1;
                }
                function O(e) {
                    p("readable nexttick read 0"), e.read(0);
                }
                function j(e, t) {
                    t.reading || (p("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, 
                    e.emit("resume"), T(e), t.flowing && !t.reading && e.read(0);
                }
                function T(e) {
                    var t = e._readableState;
                    for (p("flow", t.flowing); t.flowing && null !== e.read(); ) ;
                }
                function A(e, t) {
                    return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), 
                    t.buffer.clear()) : r = function(e, t, r) {
                        var n;
                        e < t.head.data.length ? (n = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : n = e === t.head.data.length ? t.shift() : r ? function(e, t) {
                            var r = t.head, n = 1, i = r.data;
                            e -= i.length;
                            for (;r = r.next; ) {
                                var o = r.data, s = e > o.length ? o.length : e;
                                if (s === o.length ? i += o : i += o.slice(0, e), 0 === (e -= s)) {
                                    s === o.length ? (++n, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, 
                                    r.data = o.slice(s));
                                    break;
                                }
                                ++n;
                            }
                            return t.length -= n, i;
                        }(e, t) : function(e, t) {
                            var r = c.allocUnsafe(e), n = t.head, i = 1;
                            n.data.copy(r), e -= n.data.length;
                            for (;n = n.next; ) {
                                var o = n.data, s = e > o.length ? o.length : e;
                                if (o.copy(r, r.length - e, 0, s), 0 === (e -= s)) {
                                    s === o.length ? (++i, n.next ? t.head = n.next : t.head = t.tail = null) : (t.head = n, 
                                    n.data = o.slice(s));
                                    break;
                                }
                                ++i;
                            }
                            return t.length -= i, r;
                        }(e, t);
                        return n;
                    }(e, t.buffer, t.decoder), r);
                    var r;
                }
                function P(e) {
                    var t = e._readableState;
                    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
                    t.endEmitted || (t.ended = !0, i.nextTick(C, t, e));
                }
                function C(e, t) {
                    e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"));
                }
                function M(e, t) {
                    for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
                    return -1;
                }
                m.prototype.read = function(e) {
                    p("read", e), e = parseInt(e, 10);
                    var t = this._readableState, r = e;
                    if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return p("read: emitReadable", t.length, t.ended), 
                    0 === t.length && t.ended ? P(this) : x(this), null;
                    if (0 === (e = S(e, t)) && t.ended) return 0 === t.length && P(this), null;
                    var n, i = t.needReadable;
                    return p("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && p("length less than watermark", i = !0), 
                    t.ended || t.reading ? p("reading or ended", i = !1) : i && (p("do read"), t.reading = !0, 
                    t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), 
                    t.sync = !1, t.reading || (e = S(r, t))), null === (n = e > 0 ? A(e, t) : null) ? (t.needReadable = !0, 
                    e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && P(this)), 
                    null !== n && this.emit("data", n), n;
                }, m.prototype._read = function(e) {
                    this.emit("error", new Error("_read() is not implemented"));
                }, m.prototype.pipe = function(e, t) {
                    var n = this, o = this._readableState;
                    switch (o.pipesCount) {
                      case 0:
                        o.pipes = e;
                        break;

                      case 1:
                        o.pipes = [ o.pipes, e ];
                        break;

                      default:
                        o.pipes.push(e);
                    }
                    o.pipesCount += 1, p("pipe count=%d opts=%j", o.pipesCount, t);
                    var u = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? l : m;
                    function c(t, r) {
                        p("onunpipe"), t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0, p("cleanup"), 
                        e.removeListener("close", y), e.removeListener("finish", _), e.removeListener("drain", f), 
                        e.removeListener("error", b), e.removeListener("unpipe", c), n.removeListener("end", l), 
                        n.removeListener("end", m), n.removeListener("data", g), h = !0, !o.awaitDrain || e._writableState && !e._writableState.needDrain || f());
                    }
                    function l() {
                        p("onend"), e.end();
                    }
                    o.endEmitted ? i.nextTick(u) : n.once("end", u), e.on("unpipe", c);
                    var f = function(e) {
                        return function() {
                            var t = e._readableState;
                            p("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && a(e, "data") && (t.flowing = !0, 
                            T(e));
                        };
                    }(n);
                    e.on("drain", f);
                    var h = !1;
                    var d = !1;
                    function g(t) {
                        p("ondata"), d = !1, !1 !== e.write(t) || d || ((1 === o.pipesCount && o.pipes === e || o.pipesCount > 1 && -1 !== M(o.pipes, e)) && !h && (p("false write response, pause", n._readableState.awaitDrain), 
                        n._readableState.awaitDrain++, d = !0), n.pause());
                    }
                    function b(t) {
                        p("onerror", t), m(), e.removeListener("error", b), 0 === a(e, "error") && e.emit("error", t);
                    }
                    function y() {
                        e.removeListener("finish", _), m();
                    }
                    function _() {
                        p("onfinish"), e.removeListener("close", y), m();
                    }
                    function m() {
                        p("unpipe"), n.unpipe(e);
                    }
                    return n.on("data", g), function(e, t, r) {
                        if ("function" == typeof e.prependListener) return e.prependListener(t, r);
                        e._events && e._events[t] ? s(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [ r, e._events[t] ] : e.on(t, r);
                    }(e, "error", b), e.once("close", y), e.once("finish", _), e.emit("pipe", n), o.flowing || (p("pipe resume"), 
                    n.resume()), e;
                }, m.prototype.unpipe = function(e) {
                    var t = this._readableState, r = {
                        hasUnpiped: !1
                    };
                    if (0 === t.pipesCount) return this;
                    if (1 === t.pipesCount) return e && e !== t.pipes || (e || (e = t.pipes), t.pipes = null, 
                    t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
                    if (!e) {
                        var n = t.pipes, i = t.pipesCount;
                        t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                        for (var o = 0; o < i; o++) n[o].emit("unpipe", this, r);
                        return this;
                    }
                    var s = M(t.pipes, e);
                    return -1 === s || (t.pipes.splice(s, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), 
                    e.emit("unpipe", this, r)), this;
                }, m.prototype.on = function(e, t) {
                    var r = u.prototype.on.call(this, e, t);
                    if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
                        var n = this._readableState;
                        n.endEmitted || n.readableListening || (n.readableListening = n.needReadable = !0, 
                        n.emittedReadable = !1, n.reading ? n.length && x(this) : i.nextTick(O, this));
                    }
                    return r;
                }, m.prototype.addListener = m.prototype.on, m.prototype.resume = function() {
                    var e = this._readableState;
                    return e.flowing || (p("resume"), e.flowing = !0, function(e, t) {
                        t.resumeScheduled || (t.resumeScheduled = !0, i.nextTick(j, e, t));
                    }(this, e)), this;
                }, m.prototype.pause = function() {
                    return p("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (p("pause"), 
                    this._readableState.flowing = !1, this.emit("pause")), this;
                }, m.prototype.wrap = function(e) {
                    var t = this, r = this._readableState, n = !1;
                    for (var i in e.on("end", function() {
                        if (p("wrapped end"), r.decoder && !r.ended) {
                            var e = r.decoder.end();
                            e && e.length && t.push(e);
                        }
                        t.push(null);
                    }), e.on("data", function(i) {
                        (p("wrapped data"), r.decoder && (i = r.decoder.write(i)), r.objectMode && null == i) || (r.objectMode || i && i.length) && (t.push(i) || (n = !0, 
                        e.pause()));
                    }), e) void 0 === this[i] && "function" == typeof e[i] && (this[i] = function(t) {
                        return function() {
                            return e[t].apply(e, arguments);
                        };
                    }(i));
                    for (var o = 0; o < y.length; o++) e.on(y[o], this.emit.bind(this, y[o]));
                    return this._read = function(t) {
                        p("wrapped _read", t), n && (n = !1, e.resume());
                    }, this;
                }, Object.defineProperty(m.prototype, "readableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._readableState.highWaterMark;
                    }
                }), m._fromList = A;
            }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./_stream_duplex": 98,
            "./internal/streams/BufferList": 103,
            "./internal/streams/destroy": 104,
            "./internal/streams/stream": 105,
            _process: 92,
            "core-util-is": 14,
            events: 13,
            inherits: 80,
            isarray: 106,
            "process-nextick-args": 91,
            "safe-buffer": 110,
            "string_decoder/": 107,
            util: 11
        } ],
        101: [ function(e, t, r) {
            t.exports = s;
            var n = e("./_stream_duplex"), i = e("core-util-is");
            function o(e, t) {
                var r = this._transformState;
                r.transforming = !1;
                var n = r.writecb;
                if (!n) return this.emit("error", new Error("write callback called multiple times"));
                r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e);
                var i = this._readableState;
                i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
            }
            function s(e) {
                if (!(this instanceof s)) return new s(e);
                n.call(this, e), this._transformState = {
                    afterTransform: o.bind(this),
                    needTransform: !1,
                    transforming: !1,
                    writecb: null,
                    writechunk: null,
                    writeencoding: null
                }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), 
                "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", a);
            }
            function a() {
                var e = this;
                "function" == typeof this._flush ? this._flush(function(t, r) {
                    u(e, t, r);
                }) : u(this, null, null);
            }
            function u(e, t, r) {
                if (t) return e.emit("error", t);
                if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
                if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
                return e.push(null);
            }
            i.inherits = e("inherits"), i.inherits(s, n), s.prototype.push = function(e, t) {
                return this._transformState.needTransform = !1, n.prototype.push.call(this, e, t);
            }, s.prototype._transform = function(e, t, r) {
                throw new Error("_transform() is not implemented");
            }, s.prototype._write = function(e, t, r) {
                var n = this._transformState;
                if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
                    var i = this._readableState;
                    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
                }
            }, s.prototype._read = function(e) {
                var t = this._transformState;
                null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0;
            }, s.prototype._destroy = function(e, t) {
                var r = this;
                n.prototype._destroy.call(this, e, function(e) {
                    t(e), r.emit("close");
                });
            };
        }, {
            "./_stream_duplex": 98,
            "core-util-is": 14,
            inherits: 80
        } ],
        102: [ function(e, t, r) {
            (function(r, n, i) {
                var o = e("process-nextick-args");
                function s(e) {
                    var t = this;
                    this.next = null, this.entry = null, this.finish = function() {
                        !function(e, t, r) {
                            var n = e.entry;
                            e.entry = null;
                            for (;n; ) {
                                var i = n.callback;
                                t.pendingcb--, i(r), n = n.next;
                            }
                            t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
                        }(t, e);
                    };
                }
                t.exports = _;
                var a, u = !r.browser && [ "v0.10", "v0.9." ].indexOf(r.version.slice(0, 5)) > -1 ? i : o.nextTick;
                _.WritableState = y;
                var c = e("core-util-is");
                c.inherits = e("inherits");
                var l = {
                    deprecate: e("util-deprecate")
                }, f = e("./internal/streams/stream"), h = e("safe-buffer").Buffer, p = n.Uint8Array || function() {};
                var d, g = e("./internal/streams/destroy");
                function b() {}
                function y(t, r) {
                    a = a || e("./_stream_duplex"), t = t || {};
                    var n = r instanceof a;
                    this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.writableObjectMode);
                    var i = t.highWaterMark, c = t.writableHighWaterMark, l = this.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : n && (c || 0 === c) ? c : l, this.highWaterMark = Math.floor(this.highWaterMark), 
                    this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, 
                    this.destroyed = !1;
                    var f = !1 === t.decodeStrings;
                    this.decodeStrings = !f, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, 
                    this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, 
                    this.onwrite = function(e) {
                        !function(e, t) {
                            var r = e._writableState, n = r.sync, i = r.writecb;
                            if (function(e) {
                                e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
                            }(r), t) !function(e, t, r, n, i) {
                                --t.pendingcb, r ? (o.nextTick(i, n), o.nextTick(E, e, t), e._writableState.errorEmitted = !0, 
                                e.emit("error", n)) : (i(n), e._writableState.errorEmitted = !0, e.emit("error", n), 
                                E(e, t));
                            }(e, r, n, t, i); else {
                                var s = S(r);
                                s || r.corked || r.bufferProcessing || !r.bufferedRequest || w(e, r), n ? u(v, e, r, s, i) : v(e, r, s, i);
                            }
                        }(r, e);
                    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, 
                    this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, 
                    this.corkedRequestsFree = new s(this);
                }
                function _(t) {
                    if (a = a || e("./_stream_duplex"), !(d.call(_, this) || this instanceof a)) return new _(t);
                    this._writableState = new y(t, this), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), 
                    "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), 
                    "function" == typeof t.final && (this._final = t.final)), f.call(this);
                }
                function m(e, t, r, n, i, o, s) {
                    t.writelen = n, t.writecb = s, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), 
                    t.sync = !1;
                }
                function v(e, t, r, n) {
                    r || function(e, t) {
                        0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
                    }(e, t), t.pendingcb--, n(), E(e, t);
                }
                function w(e, t) {
                    t.bufferProcessing = !0;
                    var r = t.bufferedRequest;
                    if (e._writev && r && r.next) {
                        var n = t.bufferedRequestCount, i = new Array(n), o = t.corkedRequestsFree;
                        o.entry = r;
                        for (var a = 0, u = !0; r; ) i[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
                        i.allBuffers = u, m(e, t, !0, t.length, i, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, 
                        o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new s(t), 
                        t.bufferedRequestCount = 0;
                    } else {
                        for (;r; ) {
                            var c = r.chunk, l = r.encoding, f = r.callback;
                            if (m(e, t, !1, t.objectMode ? 1 : c.length, c, l, f), r = r.next, t.bufferedRequestCount--, 
                            t.writing) break;
                        }
                        null === r && (t.lastBufferedRequest = null);
                    }
                    t.bufferedRequest = r, t.bufferProcessing = !1;
                }
                function S(e) {
                    return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
                }
                function x(e, t) {
                    e._final(function(r) {
                        t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), 
                        E(e, t);
                    });
                }
                function E(e, t) {
                    var r = S(t);
                    return r && (!function(e, t) {
                        t.prefinished || t.finalCalled || ("function" == typeof e._final ? (t.pendingcb++, 
                        t.finalCalled = !0, o.nextTick(x, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
                    }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), r;
                }
                c.inherits(_, f), y.prototype.getBuffer = function() {
                    for (var e = this.bufferedRequest, t = []; e; ) t.push(e), e = e.next;
                    return t;
                }, function() {
                    try {
                        Object.defineProperty(y.prototype, "buffer", {
                            get: l.deprecate(function() {
                                return this.getBuffer();
                            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
                        });
                    } catch (e) {}
                }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (d = Function.prototype[Symbol.hasInstance], 
                Object.defineProperty(_, Symbol.hasInstance, {
                    value: function(e) {
                        return !!d.call(this, e) || this === _ && (e && e._writableState instanceof y);
                    }
                })) : d = function(e) {
                    return e instanceof this;
                }, _.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe, not readable"));
                }, _.prototype.write = function(e, t, r) {
                    var n, i = this._writableState, s = !1, a = !i.objectMode && (n = e, h.isBuffer(n) || n instanceof p);
                    return a && !h.isBuffer(e) && (e = function(e) {
                        return h.from(e);
                    }(e)), "function" == typeof t && (r = t, t = null), a ? t = "buffer" : t || (t = i.defaultEncoding), 
                    "function" != typeof r && (r = b), i.ended ? function(e, t) {
                        var r = new Error("write after end");
                        e.emit("error", r), o.nextTick(t, r);
                    }(this, r) : (a || function(e, t, r, n) {
                        var i = !0, s = !1;
                        return null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (s = new TypeError("Invalid non-string/buffer chunk")), 
                        s && (e.emit("error", s), o.nextTick(n, s), i = !1), i;
                    }(this, i, e, r)) && (i.pendingcb++, s = function(e, t, r, n, i, o) {
                        if (!r) {
                            var s = function(e, t, r) {
                                e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = h.from(t, r));
                                return t;
                            }(t, n, i);
                            n !== s && (r = !0, i = "buffer", n = s);
                        }
                        var a = t.objectMode ? 1 : n.length;
                        t.length += a;
                        var u = t.length < t.highWaterMark;
                        u || (t.needDrain = !0);
                        if (t.writing || t.corked) {
                            var c = t.lastBufferedRequest;
                            t.lastBufferedRequest = {
                                chunk: n,
                                encoding: i,
                                isBuf: r,
                                callback: o,
                                next: null
                            }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, 
                            t.bufferedRequestCount += 1;
                        } else m(e, t, !1, a, n, i, o);
                        return u;
                    }(this, i, a, e, t, r)), s;
                }, _.prototype.cork = function() {
                    this._writableState.corked++;
                }, _.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || w(this, e));
                }, _.prototype.setDefaultEncoding = function(e) {
                    if ("string" == typeof e && (e = e.toLowerCase()), !([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
                    return this._writableState.defaultEncoding = e, this;
                }, Object.defineProperty(_.prototype, "writableHighWaterMark", {
                    enumerable: !1,
                    get: function() {
                        return this._writableState.highWaterMark;
                    }
                }), _.prototype._write = function(e, t, r) {
                    r(new Error("_write() is not implemented"));
                }, _.prototype._writev = null, _.prototype.end = function(e, t, r) {
                    var n = this._writableState;
                    "function" == typeof e ? (r = e, e = null, t = null) : "function" == typeof t && (r = t, 
                    t = null), null != e && this.write(e, t), n.corked && (n.corked = 1, this.uncork()), 
                    n.ending || n.finished || function(e, t, r) {
                        t.ending = !0, E(e, t), r && (t.finished ? o.nextTick(r) : e.once("finish", r));
                        t.ended = !0, e.writable = !1;
                    }(this, n, r);
                }, Object.defineProperty(_.prototype, "destroyed", {
                    get: function() {
                        return void 0 !== this._writableState && this._writableState.destroyed;
                    },
                    set: function(e) {
                        this._writableState && (this._writableState.destroyed = e);
                    }
                }), _.prototype.destroy = g.destroy, _.prototype._undestroy = g.undestroy, _.prototype._destroy = function(e, t) {
                    this.end(), t(e);
                };
            }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("timers").setImmediate);
        }, {
            "./_stream_duplex": 98,
            "./internal/streams/destroy": 104,
            "./internal/streams/stream": 105,
            _process: 92,
            "core-util-is": 14,
            inherits: 80,
            "process-nextick-args": 91,
            "safe-buffer": 110,
            timers: 112,
            "util-deprecate": 115
        } ],
        103: [ function(e, t, r) {
            var n = e("safe-buffer").Buffer, i = e("util");
            t.exports = function() {
                function e() {
                    !function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                    }(this, e), this.head = null, this.tail = null, this.length = 0;
                }
                return e.prototype.push = function(e) {
                    var t = {
                        data: e,
                        next: null
                    };
                    this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
                }, e.prototype.unshift = function(e) {
                    var t = {
                        data: e,
                        next: this.head
                    };
                    0 === this.length && (this.tail = t), this.head = t, ++this.length;
                }, e.prototype.shift = function() {
                    if (0 !== this.length) {
                        var e = this.head.data;
                        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, 
                        --this.length, e;
                    }
                }, e.prototype.clear = function() {
                    this.head = this.tail = null, this.length = 0;
                }, e.prototype.join = function(e) {
                    if (0 === this.length) return "";
                    for (var t = this.head, r = "" + t.data; t = t.next; ) r += e + t.data;
                    return r;
                }, e.prototype.concat = function(e) {
                    if (0 === this.length) return n.alloc(0);
                    if (1 === this.length) return this.head.data;
                    for (var t, r, i, o = n.allocUnsafe(e >>> 0), s = this.head, a = 0; s; ) t = s.data, 
                    r = o, i = a, t.copy(r, i), a += s.data.length, s = s.next;
                    return o;
                }, e;
            }(), i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function() {
                var e = i.inspect({
                    length: this.length
                });
                return this.constructor.name + " " + e;
            });
        }, {
            "safe-buffer": 110,
            util: 11
        } ],
        104: [ function(e, t, r) {
            var n = e("process-nextick-args");
            function i(e, t) {
                e.emit("error", t);
            }
            t.exports = {
                destroy: function(e, t) {
                    var r = this, o = this._readableState && this._readableState.destroyed, s = this._writableState && this._writableState.destroyed;
                    return o || s ? (t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || n.nextTick(i, this, e), 
                    this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), 
                    this._destroy(e || null, function(e) {
                        !t && e ? (n.nextTick(i, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e);
                    }), this);
                },
                undestroy: function() {
                    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, 
                    this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, 
                    this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, 
                    this._writableState.errorEmitted = !1);
                }
            };
        }, {
            "process-nextick-args": 91
        } ],
        105: [ function(e, t, r) {
            t.exports = e("events").EventEmitter;
        }, {
            events: 13
        } ],
        106: [ function(e, t, r) {
            var n = {}.toString;
            t.exports = Array.isArray || function(e) {
                return "[object Array]" == n.call(e);
            };
        }, {} ],
        107: [ function(e, t, r) {
            var n = e("safe-buffer").Buffer, i = n.isEncoding || function(e) {
                switch ((e = "" + e) && e.toLowerCase()) {
                  case "hex":
                  case "utf8":
                  case "utf-8":
                  case "ascii":
                  case "binary":
                  case "base64":
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                  case "raw":
                    return !0;

                  default:
                    return !1;
                }
            };
            function o(e) {
                var t;
                switch (this.encoding = function(e) {
                    var t = function(e) {
                        if (!e) return "utf8";
                        for (var t; ;) switch (e) {
                          case "utf8":
                          case "utf-8":
                            return "utf8";

                          case "ucs2":
                          case "ucs-2":
                          case "utf16le":
                          case "utf-16le":
                            return "utf16le";

                          case "latin1":
                          case "binary":
                            return "latin1";

                          case "base64":
                          case "ascii":
                          case "hex":
                            return e;

                          default:
                            if (t) return;
                            e = ("" + e).toLowerCase(), t = !0;
                        }
                    }(e);
                    if ("string" != typeof t && (n.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e);
                    return t || e;
                }(e), this.encoding) {
                  case "utf16le":
                    this.text = u, this.end = c, t = 4;
                    break;

                  case "utf8":
                    this.fillLast = a, t = 4;
                    break;

                  case "base64":
                    this.text = l, this.end = f, t = 3;
                    break;

                  default:
                    return this.write = h, void (this.end = p);
                }
                this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t);
            }
            function s(e) {
                return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
            }
            function a(e) {
                var t = this.lastTotal - this.lastNeed, r = function(e, t, r) {
                    if (128 != (192 & t[0])) return e.lastNeed = 0, "�";
                    if (e.lastNeed > 1 && t.length > 1) {
                        if (128 != (192 & t[1])) return e.lastNeed = 1, "�";
                        if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, 
                        "�";
                    }
                }(this, e);
                return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), 
                this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), 
                void (this.lastNeed -= e.length));
            }
            function u(e, t) {
                if ((e.length - t) % 2 == 0) {
                    var r = e.toString("utf16le", t);
                    if (r) {
                        var n = r.charCodeAt(r.length - 1);
                        if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], 
                        this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
                    }
                    return r;
                }
                return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], 
                e.toString("utf16le", t, e.length - 1);
            }
            function c(e) {
                var t = e && e.length ? this.write(e) : "";
                if (this.lastNeed) {
                    var r = this.lastTotal - this.lastNeed;
                    return t + this.lastChar.toString("utf16le", 0, r);
                }
                return t;
            }
            function l(e, t) {
                var r = (e.length - t) % 3;
                return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 
                1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], 
                this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
            }
            function f(e) {
                var t = e && e.length ? this.write(e) : "";
                return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
            }
            function h(e) {
                return e.toString(this.encoding);
            }
            function p(e) {
                return e && e.length ? this.write(e) : "";
            }
            r.StringDecoder = o, o.prototype.write = function(e) {
                if (0 === e.length) return "";
                var t, r;
                if (this.lastNeed) {
                    if (void 0 === (t = this.fillLast(e))) return "";
                    r = this.lastNeed, this.lastNeed = 0;
                } else r = 0;
                return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
            }, o.prototype.end = function(e) {
                var t = e && e.length ? this.write(e) : "";
                return this.lastNeed ? t + "�" : t;
            }, o.prototype.text = function(e, t) {
                var r = function(e, t, r) {
                    var n = t.length - 1;
                    if (n < r) return 0;
                    var i = s(t[n]);
                    if (i >= 0) return i > 0 && (e.lastNeed = i - 1), i;
                    if (--n < r || -2 === i) return 0;
                    if ((i = s(t[n])) >= 0) return i > 0 && (e.lastNeed = i - 2), i;
                    if (--n < r || -2 === i) return 0;
                    if ((i = s(t[n])) >= 0) return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), 
                    i;
                    return 0;
                }(this, e, t);
                if (!this.lastNeed) return e.toString("utf8", t);
                this.lastTotal = r;
                var n = e.length - (r - this.lastNeed);
                return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
            }, o.prototype.fillLast = function(e) {
                if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), 
                this.lastChar.toString(this.encoding, 0, this.lastTotal);
                e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
            };
        }, {
            "safe-buffer": 110
        } ],
        108: [ function(e, t, r) {
            (r = t.exports = e("./lib/_stream_readable.js")).Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), 
            r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), 
            r.PassThrough = e("./lib/_stream_passthrough.js");
        }, {
            "./lib/_stream_duplex.js": 98,
            "./lib/_stream_passthrough.js": 99,
            "./lib/_stream_readable.js": 100,
            "./lib/_stream_transform.js": 101,
            "./lib/_stream_writable.js": 102
        } ],
        109: [ function(e, t, r) {
            function n(e, t, r) {
                var n = this;
                this._callback = e, this._args = r, this._interval = setInterval(e, t, this._args), 
                this.reschedule = function(e) {
                    e || (e = n._interval), n._interval && clearInterval(n._interval), n._interval = setInterval(n._callback, e, n._args);
                }, this.clear = function() {
                    n._interval && (clearInterval(n._interval), n._interval = void 0);
                }, this.destroy = function() {
                    n._interval && clearInterval(n._interval), n._callback = void 0, n._interval = void 0, 
                    n._args = void 0;
                };
            }
            t.exports = function() {
                if ("function" != typeof arguments[0]) throw new Error("callback needed");
                if ("number" != typeof arguments[1]) throw new Error("interval needed");
                var e;
                if (arguments.length > 0) {
                    e = new Array(arguments.length - 2);
                    for (var t = 0; t < e.length; t++) e[t] = arguments[t + 2];
                }
                return new n(arguments[0], arguments[1], e);
            };
        }, {} ],
        110: [ function(e, t, r) {
            var n = e("buffer"), i = n.Buffer;
            function o(e, t) {
                for (var r in e) t[r] = e[r];
            }
            function s(e, t, r) {
                return i(e, t, r);
            }
            i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r), 
            r.Buffer = s), o(i, s), s.from = function(e, t, r) {
                if ("number" == typeof e) throw new TypeError("Argument must not be a number");
                return i(e, t, r);
            }, s.alloc = function(e, t, r) {
                if ("number" != typeof e) throw new TypeError("Argument must be a number");
                var n = i(e);
                return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), 
                n;
            }, s.allocUnsafe = function(e) {
                if ("number" != typeof e) throw new TypeError("Argument must be a number");
                return i(e);
            }, s.allocUnsafeSlow = function(e) {
                if ("number" != typeof e) throw new TypeError("Argument must be a number");
                return n.SlowBuffer(e);
            };
        }, {
            buffer: 12
        } ],
        111: [ function(e, t, r) {
            t.exports = function(e) {
                var t = e._readableState;
                return t ? t.objectMode ? e.read() : e.read(function(e) {
                    if (e.buffer.length) return e.buffer.head ? e.buffer.head.data.length : e.buffer[0].length;
                    return e.length;
                }(t)) : null;
            };
        }, {} ],
        112: [ function(e, t, r) {
            (function(t, n) {
                var i = e("process/browser.js").nextTick, o = Function.prototype.apply, s = Array.prototype.slice, a = {}, u = 0;
                function c(e, t) {
                    this._id = e, this._clearFn = t;
                }
                r.setTimeout = function() {
                    return new c(o.call(setTimeout, window, arguments), clearTimeout);
                }, r.setInterval = function() {
                    return new c(o.call(setInterval, window, arguments), clearInterval);
                }, r.clearTimeout = r.clearInterval = function(e) {
                    e.close();
                }, c.prototype.unref = c.prototype.ref = function() {}, c.prototype.close = function() {
                    this._clearFn.call(window, this._id);
                }, r.enroll = function(e, t) {
                    clearTimeout(e._idleTimeoutId), e._idleTimeout = t;
                }, r.unenroll = function(e) {
                    clearTimeout(e._idleTimeoutId), e._idleTimeout = -1;
                }, r._unrefActive = r.active = function(e) {
                    clearTimeout(e._idleTimeoutId);
                    var t = e._idleTimeout;
                    t >= 0 && (e._idleTimeoutId = setTimeout(function() {
                        e._onTimeout && e._onTimeout();
                    }, t));
                }, r.setImmediate = "function" == typeof t ? t : function(e) {
                    var t = u++, n = !(arguments.length < 2) && s.call(arguments, 1);
                    return a[t] = !0, i(function() {
                        a[t] && (n ? e.apply(null, n) : e.call(null), r.clearImmediate(t));
                    }), t;
                }, r.clearImmediate = "function" == typeof n ? n : function(e) {
                    delete a[e];
                };
            }).call(this, e("timers").setImmediate, e("timers").clearImmediate);
        }, {
            "process/browser.js": 92,
            timers: 112
        } ],
        113: [ function(t, r, n) {
            var i = t("punycode"), o = t("./util");
            function s() {
                this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, 
                this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, 
                this.path = null, this.href = null;
            }
            n.parse = v, n.resolve = function(e, t) {
                return v(e, !1, !0).resolve(t);
            }, n.resolveObject = function(e, t) {
                return e ? v(e, !1, !0).resolveObject(t) : t;
            }, n.format = function(e) {
                o.isString(e) && (e = v(e));
                return e instanceof s ? e.format() : s.prototype.format.call(e);
            }, n.Url = s;
            var a = /^([a-z0-9.+-]+:)/i, u = /:[0-9]*$/, c = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, l = [ "{", "}", "|", "\\", "^", "`" ].concat([ "<", ">", '"', "`", " ", "\r", "\n", "\t" ]), f = [ "'" ].concat(l), h = [ "%", "/", "?", ";", "#" ].concat(f), p = [ "/", "?", "#" ], d = /^[+a-z0-9A-Z_-]{0,63}$/, g = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, b = {
                javascript: !0,
                "javascript:": !0
            }, y = {
                javascript: !0,
                "javascript:": !0
            }, _ = {
                http: !0,
                https: !0,
                ftp: !0,
                gopher: !0,
                file: !0,
                "http:": !0,
                "https:": !0,
                "ftp:": !0,
                "gopher:": !0,
                "file:": !0
            }, m = t("querystring");
            function v(e, t, r) {
                if (e && o.isObject(e) && e instanceof s) return e;
                var n = new s();
                return n.parse(e, t, r), n;
            }
            s.prototype.parse = function(t, r, n) {
                if (!o.isString(t)) throw new TypeError("Parameter 'url' must be a string, not " + e(t));
                var s = t.indexOf("?"), u = -1 !== s && s < t.indexOf("#") ? "?" : "#", l = t.split(u);
                l[0] = l[0].replace(/\\/g, "/");
                var v = t = l.join(u);
                if (v = v.trim(), !n && 1 === t.split("#").length) {
                    var w = c.exec(v);
                    if (w) return this.path = v, this.href = v, this.pathname = w[1], w[2] ? (this.search = w[2], 
                    this.query = r ? m.parse(this.search.substr(1)) : this.search.substr(1)) : r && (this.search = "", 
                    this.query = {}), this;
                }
                var S = a.exec(v);
                if (S) {
                    var x = (S = S[0]).toLowerCase();
                    this.protocol = x, v = v.substr(S.length);
                }
                if (n || S || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var E = "//" === v.substr(0, 2);
                    !E || S && y[S] || (v = v.substr(2), this.slashes = !0);
                }
                if (!y[S] && (E || S && !_[S])) {
                    for (var k, I, O = -1, j = 0; j < p.length; j++) {
                        -1 !== (T = v.indexOf(p[j])) && (-1 === O || T < O) && (O = T);
                    }
                    -1 !== (I = -1 === O ? v.lastIndexOf("@") : v.lastIndexOf("@", O)) && (k = v.slice(0, I), 
                    v = v.slice(I + 1), this.auth = decodeURIComponent(k)), O = -1;
                    for (j = 0; j < h.length; j++) {
                        var T;
                        -1 !== (T = v.indexOf(h[j])) && (-1 === O || T < O) && (O = T);
                    }
                    -1 === O && (O = v.length), this.host = v.slice(0, O), v = v.slice(O), this.parseHost(), 
                    this.hostname = this.hostname || "";
                    var A = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                    if (!A) for (var P = this.hostname.split(/\./), C = (j = 0, P.length); j < C; j++) {
                        var M = P[j];
                        if (M && !M.match(d)) {
                            for (var B = "", R = 0, N = M.length; R < N; R++) M.charCodeAt(R) > 127 ? B += "x" : B += M[R];
                            if (!B.match(d)) {
                                var L = P.slice(0, j), U = P.slice(j + 1), q = M.match(g);
                                q && (L.push(q[1]), U.unshift(q[2])), U.length && (v = "/" + U.join(".") + v), this.hostname = L.join(".");
                                break;
                            }
                        }
                    }
                    this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), 
                    A || (this.hostname = i.toASCII(this.hostname));
                    var D = this.port ? ":" + this.port : "", F = this.hostname || "";
                    this.host = F + D, this.href += this.host, A && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), 
                    "/" !== v[0] && (v = "/" + v));
                }
                if (!b[x]) for (j = 0, C = f.length; j < C; j++) {
                    var z = f[j];
                    if (-1 !== v.indexOf(z)) {
                        var W = encodeURIComponent(z);
                        W === z && (W = escape(z)), v = v.split(z).join(W);
                    }
                }
                var K = v.indexOf("#");
                -1 !== K && (this.hash = v.substr(K), v = v.slice(0, K));
                var H = v.indexOf("?");
                if (-1 !== H ? (this.search = v.substr(H), this.query = v.substr(H + 1), r && (this.query = m.parse(this.query)), 
                v = v.slice(0, H)) : r && (this.search = "", this.query = {}), v && (this.pathname = v), 
                _[x] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                    D = this.pathname || "";
                    var V = this.search || "";
                    this.path = D + V;
                }
                return this.href = this.format(), this;
            }, s.prototype.format = function() {
                var e = this.auth || "";
                e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@");
                var t = this.protocol || "", r = this.pathname || "", n = this.hash || "", i = !1, s = "";
                this.host ? i = e + this.host : this.hostname && (i = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), 
                this.port && (i += ":" + this.port)), this.query && o.isObject(this.query) && Object.keys(this.query).length && (s = m.stringify(this.query));
                var a = this.search || s && "?" + s || "";
                return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || _[t]) && !1 !== i ? (i = "//" + (i || ""), 
                r && "/" !== r.charAt(0) && (r = "/" + r)) : i || (i = ""), n && "#" !== n.charAt(0) && (n = "#" + n), 
                a && "?" !== a.charAt(0) && (a = "?" + a), t + i + (r = r.replace(/[?#]/g, function(e) {
                    return encodeURIComponent(e);
                })) + (a = a.replace("#", "%23")) + n;
            }, s.prototype.resolve = function(e) {
                return this.resolveObject(v(e, !1, !0)).format();
            }, s.prototype.resolveObject = function(e) {
                if (o.isString(e)) {
                    var t = new s();
                    t.parse(e, !1, !0), e = t;
                }
                for (var r = new s(), n = Object.keys(this), i = 0; i < n.length; i++) {
                    var a = n[i];
                    r[a] = this[a];
                }
                if (r.hash = e.hash, "" === e.href) return r.href = r.format(), r;
                if (e.slashes && !e.protocol) {
                    for (var u = Object.keys(e), c = 0; c < u.length; c++) {
                        var l = u[c];
                        "protocol" !== l && (r[l] = e[l]);
                    }
                    return _[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), 
                    r.href = r.format(), r;
                }
                if (e.protocol && e.protocol !== r.protocol) {
                    if (!_[e.protocol]) {
                        for (var f = Object.keys(e), h = 0; h < f.length; h++) {
                            var p = f[h];
                            r[p] = e[p];
                        }
                        return r.href = r.format(), r;
                    }
                    if (r.protocol = e.protocol, e.host || y[e.protocol]) r.pathname = e.pathname; else {
                        for (var d = (e.pathname || "").split("/"); d.length && !(e.host = d.shift()); ) ;
                        e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== d[0] && d.unshift(""), 
                        d.length < 2 && d.unshift(""), r.pathname = d.join("/");
                    }
                    if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, 
                    r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) {
                        var g = r.pathname || "", b = r.search || "";
                        r.path = g + b;
                    }
                    return r.slashes = r.slashes || e.slashes, r.href = r.format(), r;
                }
                var m = r.pathname && "/" === r.pathname.charAt(0), v = e.host || e.pathname && "/" === e.pathname.charAt(0), w = v || m || r.host && e.pathname, S = w, x = r.pathname && r.pathname.split("/") || [], E = (d = e.pathname && e.pathname.split("/") || [], 
                r.protocol && !_[r.protocol]);
                if (E && (r.hostname = "", r.port = null, r.host && ("" === x[0] ? x[0] = r.host : x.unshift(r.host)), 
                r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === d[0] ? d[0] = e.host : d.unshift(e.host)), 
                e.host = null), w = w && ("" === d[0] || "" === x[0])), v) r.host = e.host || "" === e.host ? e.host : r.host, 
                r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname, r.search = e.search, 
                r.query = e.query, x = d; else if (d.length) x || (x = []), x.pop(), x = x.concat(d), 
                r.search = e.search, r.query = e.query; else if (!o.isNullOrUndefined(e.search)) {
                    if (E) r.hostname = r.host = x.shift(), (T = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) && (r.auth = T.shift(), 
                    r.host = r.hostname = T.shift());
                    return r.search = e.search, r.query = e.query, o.isNull(r.pathname) && o.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), 
                    r.href = r.format(), r;
                }
                if (!x.length) return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, 
                r.href = r.format(), r;
                for (var k = x.slice(-1)[0], I = (r.host || e.host || x.length > 1) && ("." === k || ".." === k) || "" === k, O = 0, j = x.length; j >= 0; j--) "." === (k = x[j]) ? x.splice(j, 1) : ".." === k ? (x.splice(j, 1), 
                O++) : O && (x.splice(j, 1), O--);
                if (!w && !S) for (;O--; O) x.unshift("..");
                !w || "" === x[0] || x[0] && "/" === x[0].charAt(0) || x.unshift(""), I && "/" !== x.join("/").substr(-1) && x.push("");
                var T, A = "" === x[0] || x[0] && "/" === x[0].charAt(0);
                E && (r.hostname = r.host = A ? "" : x.length ? x.shift() : "", (T = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) && (r.auth = T.shift(), 
                r.host = r.hostname = T.shift()));
                return (w = w || r.host && x.length) && !A && x.unshift(""), x.length ? r.pathname = x.join("/") : (r.pathname = null, 
                r.path = null), o.isNull(r.pathname) && o.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), 
                r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), 
                r;
            }, s.prototype.parseHost = function() {
                var e = this.host, t = u.exec(e);
                t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), 
                e && (this.hostname = e);
            };
        }, {
            "./util": 114,
            punycode: 93,
            querystring: 96
        } ],
        114: [ function(t, r, n) {
            r.exports = {
                isString: function(e) {
                    return "string" == typeof e;
                },
                isObject: function(t) {
                    return "object" === e(t) && null !== t;
                },
                isNull: function(e) {
                    return null === e;
                },
                isNullOrUndefined: function(e) {
                    return null == e;
                }
            };
        }, {} ],
        115: [ function(e, t, r) {
            (function(e) {
                function r(t) {
                    try {
                        if (!e.localStorage) return !1;
                    } catch (e) {
                        e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                        return !1;
                    }
                    var r = e.localStorage[t];
                    return null != r && "true" === String(r).toLowerCase();
                }
                t.exports = function(e, t) {
                    if (r("noDeprecation")) return e;
                    var n = !1;
                    return function() {
                        if (!n) {
                            if (r("throwDeprecation")) throw new Error(t);
                            r("traceDeprecation") ? console.trace(t) : console.warn(t), n = !0;
                        }
                        return e.apply(this, arguments);
                    };
                };
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {} ],
        116: [ function(t, r, n) {
            r.exports = function(t) {
                return t && "object" === e(t) && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8;
            };
        }, {} ],
        117: [ function(t, r, n) {
            (function(r, i) {
                var o = /%[sdj%]/g;
                n.format = function(e) {
                    if (!_(e)) {
                        for (var t = [], r = 0; r < arguments.length; r++) t.push(u(arguments[r]));
                        return t.join(" ");
                    }
                    r = 1;
                    for (var n = arguments, i = n.length, s = String(e).replace(o, function(e) {
                        if ("%%" === e) return "%";
                        if (r >= i) return e;
                        switch (e) {
                          case "%s":
                            return String(n[r++]);

                          case "%d":
                            return Number(n[r++]);

                          case "%j":
                            try {
                                return JSON.stringify(n[r++]);
                            } catch (e) {
                                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                                return "[Circular]";
                            }

                          default:
                            return e;
                        }
                    }), a = n[r]; r < i; a = n[++r]) b(a) || !w(a) ? s += " " + a : s += " " + u(a);
                    return s;
                }, n.deprecate = function(e, t) {
                    if (m(i.process)) return function() {
                        return n.deprecate(e, t).apply(this, arguments);
                    };
                    if (!0 === r.noDeprecation) return e;
                    var o = !1;
                    return function() {
                        if (!o) {
                            if (r.throwDeprecation) throw new Error(t);
                            r.traceDeprecation ? console.trace(t) : console.error(t), o = !0;
                        }
                        return e.apply(this, arguments);
                    };
                };
                var s, a = {};
                function u(e, t) {
                    var r = {
                        seen: [],
                        stylize: l
                    };
                    return arguments.length >= 3 && (r.depth = arguments[2]), arguments.length >= 4 && (r.colors = arguments[3]), 
                    g(t) ? r.showHidden = t : t && n._extend(r, t), m(r.showHidden) && (r.showHidden = !1), 
                    m(r.depth) && (r.depth = 2), m(r.colors) && (r.colors = !1), m(r.customInspect) && (r.customInspect = !0), 
                    r.colors && (r.stylize = c), f(r, e, r.depth);
                }
                function c(e, t) {
                    var r = u.styles[t];
                    return r ? "[" + u.colors[r][0] + "m" + e + "[" + u.colors[r][1] + "m" : e;
                }
                function l(e, t) {
                    return e;
                }
                function f(e, t, r) {
                    if (e.customInspect && t && E(t.inspect) && t.inspect !== n.inspect && (!t.constructor || t.constructor.prototype !== t)) {
                        var i = t.inspect(r, e);
                        return _(i) || (i = f(e, i, r)), i;
                    }
                    var o = function(e, t) {
                        if (m(t)) return e.stylize("undefined", "undefined");
                        if (_(t)) {
                            var r = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                            return e.stylize(r, "string");
                        }
                        if (y(t)) return e.stylize("" + t, "number");
                        if (g(t)) return e.stylize("" + t, "boolean");
                        if (b(t)) return e.stylize("null", "null");
                    }(e, t);
                    if (o) return o;
                    var s = Object.keys(t), a = function(e) {
                        var t = {};
                        return e.forEach(function(e, r) {
                            t[e] = !0;
                        }), t;
                    }(s);
                    if (e.showHidden && (s = Object.getOwnPropertyNames(t)), x(t) && (s.indexOf("message") >= 0 || s.indexOf("description") >= 0)) return h(t);
                    if (0 === s.length) {
                        if (E(t)) {
                            var u = t.name ? ": " + t.name : "";
                            return e.stylize("[Function" + u + "]", "special");
                        }
                        if (v(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
                        if (S(t)) return e.stylize(Date.prototype.toString.call(t), "date");
                        if (x(t)) return h(t);
                    }
                    var c, l = "", w = !1, k = [ "{", "}" ];
                    (d(t) && (w = !0, k = [ "[", "]" ]), E(t)) && (l = " [Function" + (t.name ? ": " + t.name : "") + "]");
                    return v(t) && (l = " " + RegExp.prototype.toString.call(t)), S(t) && (l = " " + Date.prototype.toUTCString.call(t)), 
                    x(t) && (l = " " + h(t)), 0 !== s.length || w && 0 != t.length ? r < 0 ? v(t) ? e.stylize(RegExp.prototype.toString.call(t), "regexp") : e.stylize("[Object]", "special") : (e.seen.push(t), 
                    c = w ? function(e, t, r, n, i) {
                        for (var o = [], s = 0, a = t.length; s < a; ++s) T(t, String(s)) ? o.push(p(e, t, r, n, String(s), !0)) : o.push("");
                        return i.forEach(function(i) {
                            i.match(/^\d+$/) || o.push(p(e, t, r, n, i, !0));
                        }), o;
                    }(e, t, r, a, s) : s.map(function(n) {
                        return p(e, t, r, a, n, w);
                    }), e.seen.pop(), function(e, t, r) {
                        if (e.reduce(function(e, t) {
                            return t.indexOf("\n") >= 0 && 0, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1;
                        }, 0) > 60) return r[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + r[1];
                        return r[0] + t + " " + e.join(", ") + " " + r[1];
                    }(c, l, k)) : k[0] + l + k[1];
                }
                function h(e) {
                    return "[" + Error.prototype.toString.call(e) + "]";
                }
                function p(e, t, r, n, i, o) {
                    var s, a, u;
                    if ((u = Object.getOwnPropertyDescriptor(t, i) || {
                        value: t[i]
                    }).get ? a = u.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : u.set && (a = e.stylize("[Setter]", "special")), 
                    T(n, i) || (s = "[" + i + "]"), a || (e.seen.indexOf(u.value) < 0 ? (a = b(r) ? f(e, u.value, null) : f(e, u.value, r - 1)).indexOf("\n") > -1 && (a = o ? a.split("\n").map(function(e) {
                        return "  " + e;
                    }).join("\n").substr(2) : "\n" + a.split("\n").map(function(e) {
                        return "   " + e;
                    }).join("\n")) : a = e.stylize("[Circular]", "special")), m(s)) {
                        if (o && i.match(/^\d+$/)) return a;
                        (s = JSON.stringify("" + i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), 
                        s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), 
                        s = e.stylize(s, "string"));
                    }
                    return s + ": " + a;
                }
                function d(e) {
                    return Array.isArray(e);
                }
                function g(e) {
                    return "boolean" == typeof e;
                }
                function b(e) {
                    return null === e;
                }
                function y(e) {
                    return "number" == typeof e;
                }
                function _(e) {
                    return "string" == typeof e;
                }
                function m(e) {
                    return void 0 === e;
                }
                function v(e) {
                    return w(e) && "[object RegExp]" === k(e);
                }
                function w(t) {
                    return "object" === e(t) && null !== t;
                }
                function S(e) {
                    return w(e) && "[object Date]" === k(e);
                }
                function x(e) {
                    return w(e) && ("[object Error]" === k(e) || e instanceof Error);
                }
                function E(e) {
                    return "function" == typeof e;
                }
                function k(e) {
                    return Object.prototype.toString.call(e);
                }
                function I(e) {
                    return e < 10 ? "0" + e.toString(10) : e.toString(10);
                }
                n.debuglog = function(e) {
                    if (m(s) && (s = r.env.NODE_DEBUG || ""), e = e.toUpperCase(), !a[e]) if (new RegExp("\\b" + e + "\\b", "i").test(s)) {
                        var t = r.pid;
                        a[e] = function() {
                            var r = n.format.apply(n, arguments);
                            console.error("%s %d: %s", e, t, r);
                        };
                    } else a[e] = function() {};
                    return a[e];
                }, n.inspect = u, u.colors = {
                    bold: [ 1, 22 ],
                    italic: [ 3, 23 ],
                    underline: [ 4, 24 ],
                    inverse: [ 7, 27 ],
                    white: [ 37, 39 ],
                    grey: [ 90, 39 ],
                    black: [ 30, 39 ],
                    blue: [ 34, 39 ],
                    cyan: [ 36, 39 ],
                    green: [ 32, 39 ],
                    magenta: [ 35, 39 ],
                    red: [ 31, 39 ],
                    yellow: [ 33, 39 ]
                }, u.styles = {
                    special: "cyan",
                    number: "yellow",
                    boolean: "yellow",
                    undefined: "grey",
                    null: "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                }, n.isArray = d, n.isBoolean = g, n.isNull = b, n.isNullOrUndefined = function(e) {
                    return null == e;
                }, n.isNumber = y, n.isString = _, n.isSymbol = function(t) {
                    return "symbol" === e(t);
                }, n.isUndefined = m, n.isRegExp = v, n.isObject = w, n.isDate = S, n.isError = x, 
                n.isFunction = E, n.isPrimitive = function(t) {
                    return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" === e(t) || void 0 === t;
                }, n.isBuffer = t("./support/isBuffer");
                var O = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                function j() {
                    var e = new Date(), t = [ I(e.getHours()), I(e.getMinutes()), I(e.getSeconds()) ].join(":");
                    return [ e.getDate(), O[e.getMonth()], t ].join(" ");
                }
                function T(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t);
                }
                n.log = function() {
                    console.log("%s - %s", j(), n.format.apply(n, arguments));
                }, n.inherits = t("inherits"), n._extend = function(e, t) {
                    if (!t || !w(t)) return e;
                    for (var r = Object.keys(t), n = r.length; n--; ) e[r[n]] = t[r[n]];
                    return e;
                };
            }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            "./support/isBuffer": 116,
            _process: 92,
            inherits: 80
        } ],
        118: [ function(t, r, n) {
            (function(n, i) {
                var o = t("readable-stream").Transform, s = t("duplexify"), a = t("ws"), u = t("safe-buffer").Buffer;
                r.exports = function(t, r, c) {
                    var l, f, h = "browser" === n.title, p = !!i.WebSocket, d = h ? function e(t, r, n) {
                        if (f.bufferedAmount > b) return void setTimeout(e, y, t, r, n);
                        _ && "string" == typeof t && (t = u.from(t, "utf8"));
                        try {
                            f.send(t);
                        } catch (e) {
                            e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                            return n(e);
                        }
                        n();
                    } : function(e, t, r) {
                        if (f.readyState !== f.OPEN) return void r();
                        _ && "string" == typeof e && (e = u.from(e, "utf8"));
                        f.send(e, r);
                    };
                    r && !Array.isArray(r) && "object" === e(r) && (c = r, r = null, ("string" == typeof c.protocol || Array.isArray(c.protocol)) && (r = c.protocol));
                    c || (c = {});
                    void 0 === c.objectMode && (c.objectMode = !(!0 === c.binary || void 0 === c.binary));
                    var g = function(e, t, r) {
                        var n = new o({
                            objectMode: e.objectMode
                        });
                        return n._write = t, n._flush = r, n;
                    }(c, d, function(e) {
                        f.close(), e();
                    });
                    c.objectMode || (g._writev = function(e, t) {
                        for (var r = new Array(e.length), n = 0; n < e.length; n++) "string" == typeof e[n].chunk ? r[n] = u.from(e[n], "utf8") : r[n] = e[n].chunk;
                        this._write(u.concat(r), "binary", t);
                    });
                    var b = c.browserBufferSize || 524288, y = c.browserBufferTimeout || 1e3;
                    "object" === e(t) ? f = t : (f = p && h ? new a(t, r) : new a(t, r, c)).binaryType = "arraybuffer";
                    f.readyState === f.OPEN ? l = g : (l = s.obj(), f.onopen = function() {
                        l.setReadable(g), l.setWritable(g), l.emit("connect");
                    });
                    l.socket = f, f.onclose = function() {
                        l.end(), l.destroy();
                    }, f.onerror = function(e) {
                        l.destroy(e);
                    }, f.onmessage = function(e) {
                        var t = e.data;
                        t = t instanceof ArrayBuffer ? u.from(t) : u.from(t, "utf8");
                        g.push(t);
                    }, g.on("close", function() {
                        f.close();
                    });
                    var _ = !c.objectMode;
                    return l;
                };
            }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {
            _process: 92,
            duplexify: 17,
            "readable-stream": 108,
            "safe-buffer": 110,
            ws: 119
        } ],
        119: [ function(e, t, r) {
            var n = null;
            "undefined" != typeof WebSocket ? n = WebSocket : "undefined" != typeof MozWebSocket ? n = MozWebSocket : "undefined" != typeof window && (n = window.WebSocket || window.MozWebSocket), 
            t.exports = n;
        }, {} ],
        120: [ function(e, t, r) {
            t.exports = function e(t, r) {
                if (t && r) return e(t)(r);
                if ("function" != typeof t) throw new TypeError("need wrapper function");
                return Object.keys(t).forEach(function(e) {
                    n[e] = t[e];
                }), n;
                function n() {
                    for (var e = new Array(arguments.length), r = 0; r < e.length; r++) e[r] = arguments[r];
                    var n = t.apply(this, e), i = e[e.length - 1];
                    return "function" == typeof n && n !== i && Object.keys(i).forEach(function(e) {
                        n[e] = i[e];
                    }), n;
                }
            };
        }, {} ],
        121: [ function(e, t, r) {
            t.exports = function() {
                for (var e = {}, t = 0; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var i in r) n.call(r, i) && (e[i] = r[i]);
                }
                return e;
            };
            var n = Object.prototype.hasOwnProperty;
        }, {} ]
    }, {}, [ 9 ])(9);
});