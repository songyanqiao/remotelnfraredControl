var e, t, s = require("../@babel/runtime/helpers/typeof");

e = global, t = function() {
    return function(e) {
        function t(e, t, s) {
            return t[s++] = e >> 8, t[s++] = e % 256, s;
        }
        function n(e, s, n, i) {
            return o(e, n, i = t(s, n, i)), i + s;
        }
        function i(e) {
            for (var t = 0, s = 0; s < e.length; s++) {
                var n = e.charCodeAt(s);
                2047 < n ? (55296 <= n && 56319 >= n && (s++, t++), t += 3) : 127 < n ? t += 2 : t++;
            }
            return t;
        }
        function o(e, t, s) {
            for (var n = 0; n < e.length; n++) {
                var i = e.charCodeAt(n);
                if (55296 <= i && 56319 >= i) {
                    var o = e.charCodeAt(++n);
                    if (isNaN(o)) throw Error(d(h.MALFORMED_UNICODE, [ i, o ]));
                    i = o - 56320 + (i - 55296 << 10) + 65536;
                }
                127 >= i ? t[s++] = i : (2047 >= i ? t[s++] = i >> 6 & 31 | 192 : (65535 >= i ? t[s++] = i >> 12 & 15 | 224 : (t[s++] = i >> 18 & 7 | 240, 
                t[s++] = i >> 12 & 63 | 128), t[s++] = i >> 6 & 63 | 128), t[s++] = 63 & i | 128);
            }
            return t;
        }
        function r(e, t, s) {
            for (var n, i = "", o = t; o < t + s; ) {
                if (!(128 > (n = e[o++]))) {
                    var r = e[o++] - 128;
                    if (0 > r) throw Error(d(h.MALFORMED_UTF, [ n.toString(16), r.toString(16), "" ]));
                    if (224 > n) n = 64 * (n - 192) + r; else {
                        var c = e[o++] - 128;
                        if (0 > c) throw Error(d(h.MALFORMED_UTF, [ n.toString(16), r.toString(16), c.toString(16) ]));
                        if (240 > n) n = 4096 * (n - 224) + 64 * r + c; else {
                            var a = e[o++] - 128;
                            if (0 > a) throw Error(d(h.MALFORMED_UTF, [ n.toString(16), r.toString(16), c.toString(16), a.toString(16) ]));
                            if (!(248 > n)) throw Error(d(h.MALFORMED_UTF, [ n.toString(16), r.toString(16), c.toString(16), a.toString(16) ]));
                            n = 262144 * (n - 240) + 4096 * r + 64 * c + a;
                        }
                    }
                }
                65535 < n && (n -= 65536, i += String.fromCharCode(55296 + (n >> 10)), n = 56320 + (1023 & n)), 
                i += String.fromCharCode(n);
            }
            return i;
        }
        var c = function(e, t) {
            for (var n in e) if (e.hasOwnProperty(n)) {
                if (!t.hasOwnProperty(n)) {
                    for (var i in n = "Unknown property, " + n + ". Valid properties are:", t) t.hasOwnProperty(i) && (n = n + " " + i);
                    throw Error(n);
                }
                if (s(e[n]) !== t[n]) throw Error(d(h.INVALID_TYPE, [ s(e[n]), n ]));
            }
        }, a = function(e, t) {
            return function() {
                return e.apply(t, arguments);
            };
        }, h = {
            OK: {
                code: 0,
                text: "AMQJSC0000I OK."
            },
            CONNECT_TIMEOUT: {
                code: 1,
                text: "AMQJSC0001E Connect timed out."
            },
            SUBSCRIBE_TIMEOUT: {
                code: 2,
                text: "AMQJS0002E Subscribe timed out."
            },
            UNSUBSCRIBE_TIMEOUT: {
                code: 3,
                text: "AMQJS0003E Unsubscribe timed out."
            },
            PING_TIMEOUT: {
                code: 4,
                text: "AMQJS0004E Ping timed out."
            },
            INTERNAL_ERROR: {
                code: 5,
                text: "AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"
            },
            CONNACK_RETURNCODE: {
                code: 6,
                text: "AMQJS0006E Bad Connack return code:{0} {1}."
            },
            SOCKET_ERROR: {
                code: 7,
                text: "AMQJS0007E Socket error:{0}."
            },
            SOCKET_CLOSE: {
                code: 8,
                text: "AMQJS0008I Socket closed."
            },
            MALFORMED_UTF: {
                code: 9,
                text: "AMQJS0009E Malformed UTF data:{0} {1} {2}."
            },
            UNSUPPORTED: {
                code: 10,
                text: "AMQJS0010E {0} is not supported by this browser."
            },
            INVALID_STATE: {
                code: 11,
                text: "AMQJS0011E Invalid state {0}."
            },
            INVALID_TYPE: {
                code: 12,
                text: "AMQJS0012E Invalid type {0} for {1}."
            },
            INVALID_ARGUMENT: {
                code: 13,
                text: "AMQJS0013E Invalid argument {0} for {1}."
            },
            UNSUPPORTED_OPERATION: {
                code: 14,
                text: "AMQJS0014E Unsupported operation."
            },
            INVALID_STORED_DATA: {
                code: 15,
                text: "AMQJS0015E Invalid data in local storage key={0} value={1}."
            },
            INVALID_MQTT_MESSAGE_TYPE: {
                code: 16,
                text: "AMQJS0016E Invalid MQTT message type {0}."
            },
            MALFORMED_UNICODE: {
                code: 17,
                text: "AMQJS0017E Malformed Unicode string:{0} {1}."
            },
            BUFFER_FULL: {
                code: 18,
                text: "AMQJS0018E Message buffer is full, maximum buffer size: {0}."
            }
        }, u = {
            0: "Connection Accepted",
            1: "Connection Refused: unacceptable protocol version",
            2: "Connection Refused: identifier rejected",
            3: "Connection Refused: server unavailable",
            4: "Connection Refused: bad user name or password",
            5: "Connection Refused: not authorized"
        }, d = function(e, t) {
            var s = e.text;
            if (t) for (var n, i, o = 0; o < t.length; o++) if (n = "{" + o + "}", 0 < (i = s.indexOf(n))) {
                var r = s.substring(0, i);
                s = s.substring(i + n.length), s = r + t[o] + s;
            }
            return s;
        }, l = [ 0, 6, 77, 81, 73, 115, 100, 112, 3 ], _ = [ 0, 4, 77, 81, 84, 84, 4 ], f = function(e, t) {
            for (var s in this.type = e, t) t.hasOwnProperty(s) && (this[s] = t[s]);
        };
        f.prototype.encode = function() {
            var e, s = (15 & this.type) << 4, o = 0, r = [], c = 0;
            switch (void 0 !== this.messageIdentifier && (o += 2), this.type) {
              case 1:
                switch (this.mqttVersion) {
                  case 3:
                    o += l.length + 3;
                    break;

                  case 4:
                    o += _.length + 3;
                }
                o += i(this.clientId) + 2, void 0 !== this.willMessage && (o += i(this.willMessage.destinationName) + 2, 
                (e = this.willMessage.payloadBytes) instanceof Uint8Array || (e = new Uint8Array(h)), 
                o += e.byteLength + 2), void 0 !== this.userName && (o += i(this.userName) + 2), 
                void 0 !== this.password && (o += i(this.password) + 2);
                break;

              case 8:
                s |= 2;
                for (var a = 0; a < this.topics.length; a++) r[a] = i(this.topics[a]), o += r[a] + 2;
                o += this.requestedQos.length;
                break;

              case 10:
                for (s |= 2, a = 0; a < this.topics.length; a++) r[a] = i(this.topics[a]), o += r[a] + 2;
                break;

              case 6:
                s |= 2;
                break;

              case 3:
                this.payloadMessage.duplicate && (s |= 8), s = s |= this.payloadMessage.qos << 1, 
                this.payloadMessage.retained && (s |= 1), c = i(this.payloadMessage.destinationName);
                var h = this.payloadMessage.payloadBytes;
                o = o + (c + 2) + h.byteLength, h instanceof ArrayBuffer ? h = new Uint8Array(h) : h instanceof Uint8Array || (h = new Uint8Array(h.buffer));
            }
            var u = o, d = (a = Array(1), 0);
            do {
                var f = u % 128;
                0 < (u >>= 7) && (f |= 128), a[d++] = f;
            } while (0 < u && 4 > d);
            if (u = a.length + 1, o = new ArrayBuffer(o + u), (d = new Uint8Array(o))[0] = s, 
            d.set(a, 1), 3 == this.type) u = n(this.payloadMessage.destinationName, c, d, u); else if (1 == this.type) {
                switch (this.mqttVersion) {
                  case 3:
                    d.set(l, u), u += l.length;
                    break;

                  case 4:
                    d.set(_, u), u += _.length;
                }
                s = 0, this.cleanSession && (s = 2), void 0 !== this.willMessage && (s = 4 | s | this.willMessage.qos << 3, 
                this.willMessage.retained && (s |= 32)), void 0 !== this.userName && (s |= 128), 
                void 0 !== this.password && (s |= 64), d[u++] = s, u = t(this.keepAliveInterval, d, u);
            }
            switch (void 0 !== this.messageIdentifier && (u = t(this.messageIdentifier, d, u)), 
            this.type) {
              case 1:
                u = n(this.clientId, i(this.clientId), d, u), void 0 !== this.willMessage && (u = n(this.willMessage.destinationName, i(this.willMessage.destinationName), d, u), 
                u = t(e.byteLength, d, u), d.set(e, u), u += e.byteLength), void 0 !== this.userName && (u = n(this.userName, i(this.userName), d, u)), 
                void 0 !== this.password && n(this.password, i(this.password), d, u);
                break;

              case 3:
                d.set(h, u);
                break;

              case 8:
                for (a = 0; a < this.topics.length; a++) u = n(this.topics[a], r[a], d, u), d[u++] = this.requestedQos[a];
                break;

              case 10:
                for (a = 0; a < this.topics.length; a++) u = n(this.topics[a], r[a], d, u);
            }
            return o;
        };
        var g = function(t, s) {
            this._client = t, this._keepAliveInterval = 1e3 * s, this.isReset = !1;
            var n = new f(12).encode(), i = function(e) {
                return function() {
                    return o.apply(e);
                };
            }, o = function() {
                this.isReset ? (this.isReset = !1, this._client._trace("Pinger.doPing", "send PINGREQ"), 
                e.sendSocketMessage({
                    data: n,
                    success: function() {},
                    fail: function() {},
                    complete: function() {}
                }), this.timeout = setTimeout(i(this), this._keepAliveInterval)) : (this._client._trace("Pinger.doPing", "Timed out"), 
                this._client._disconnected(h.PING_TIMEOUT.code, d(h.PING_TIMEOUT)));
            };
            this.reset = function() {
                this.isReset = !0, clearTimeout(this.timeout), 0 < this._keepAliveInterval && (this.timeout = setTimeout(i(this), this._keepAliveInterval));
            }, this.cancel = function() {
                clearTimeout(this.timeout);
            };
        }, p = function(e, t, s, n) {
            t || (t = 30), this.timeout = setTimeout(function(e, t, s) {
                return function() {
                    return e.apply(t, s);
                };
            }(s, e, n), 1e3 * t), this.cancel = function() {
                clearTimeout(this.timeout);
            };
        }, v = function(t, s, n, i, o) {
            for (var r in this._trace("Paho.MQTT.Client", t, s, n, i, o), this.host = s, this.port = n, 
            this.path = i, this.uri = t, this.clientId = o, this._wsuri = null, this._localKey = s + ":" + n + ("/mqtt" != i ? ":" + i : "") + ":" + o + ":", 
            this._msg_queue = [], this._buffered_msg_queue = [], this._sentMessages = {}, this._receivedMessages = {}, 
            this._notify_msg_sent = {}, this._message_identifier = 1, this._sequence = 0, e.getStorageInfoSync().keys) 0 !== r.indexOf("Sent:" + this._localKey) && 0 !== r.indexOf("Received:" + this._localKey) || this.restore(r);
        };
        v.prototype.host = null, v.prototype.port = null, v.prototype.path = null, v.prototype.uri = null, 
        v.prototype.clientId = null, v.prototype.socket = null, v.prototype.connected = !1, 
        v.prototype.maxMessageIdentifier = 65536, v.prototype.connectOptions = null, v.prototype.hostIndex = null, 
        v.prototype.onConnected = null, v.prototype.onConnectionLost = null, v.prototype.onMessageDelivered = null, 
        v.prototype.onMessageArrived = null, v.prototype.traceFunction = null, v.prototype._msg_queue = null, 
        v.prototype._buffered_msg_queue = null, v.prototype._connectTimeout = null, v.prototype.sendPinger = null, 
        v.prototype.receivePinger = null, v.prototype._reconnectInterval = 1, v.prototype._reconnecting = !1, 
        v.prototype._reconnectTimeout = null, v.prototype.disconnectedPublishing = !1, v.prototype.disconnectedBufferSize = 5e3, 
        v.prototype.receiveBuffer = null, v.prototype._traceBuffer = null, v.prototype._MAX_TRACE_ENTRIES = 100, 
        v.prototype.connect = function(e) {
            var t = this._traceMask(e, "password");
            if (this._trace("Client.connect", t, null, this.connected), this.connected) throw Error(d(h.INVALID_STATE, [ "already connected" ]));
            this._reconnecting && (this._reconnectTimeout.cancel(), this._reconnectTimeout = null, 
            this._reconnecting = !1), this.connectOptions = e, this._reconnectInterval = 1, 
            this._reconnecting = !1, e.uris ? (this.hostIndex = 0, this._doConnect(e.uris[0])) : this._doConnect(this.uri);
        }, v.prototype.subscribe = function(e, t) {
            if (this._trace("Client.subscribe", e, t), !this.connected) throw Error(d(h.INVALID_STATE, [ "not connected" ]));
            var s = new f(8);
            s.topics = [ e ], s.requestedQos = void 0 !== t.qos ? [ t.qos ] : [ 0 ], t.onSuccess && (s.onSuccess = function(e) {
                t.onSuccess({
                    invocationContext: t.invocationContext,
                    grantedQos: e
                });
            }), t.onFailure && (s.onFailure = function(e) {
                t.onFailure({
                    invocationContext: t.invocationContext,
                    errorCode: e,
                    errorMessage: d(e)
                });
            }), t.timeout && (s.timeOut = new p(this, t.timeout, t.onFailure, [ {
                invocationContext: t.invocationContext,
                errorCode: h.SUBSCRIBE_TIMEOUT.code,
                errorMessage: d(h.SUBSCRIBE_TIMEOUT)
            } ])), this._requires_ack(s), this._schedule_message(s);
        }, v.prototype.unsubscribe = function(e, t) {
            if (this._trace("Client.unsubscribe", e, t), !this.connected) throw Error(d(h.INVALID_STATE, [ "not connected" ]));
            var s = new f(10);
            s.topics = [ e ], t.onSuccess && (s.callback = function() {
                t.onSuccess({
                    invocationContext: t.invocationContext
                });
            }), t.timeout && (s.timeOut = new p(this, t.timeout, t.onFailure, [ {
                invocationContext: t.invocationContext,
                errorCode: h.UNSUBSCRIBE_TIMEOUT.code,
                errorMessage: d(h.UNSUBSCRIBE_TIMEOUT)
            } ])), this._requires_ack(s), this._schedule_message(s);
        }, v.prototype.send = function(e) {
            this._trace("Client.send", e);
            var t = new f(3);
            if (t.payloadMessage = e, this.connected) 0 < e.qos ? this._requires_ack(t) : this.onMessageDelivered && (this._notify_msg_sent[t] = this.onMessageDelivered(t.payloadMessage)), 
            this._schedule_message(t); else {
                if (!this._reconnecting || !this.disconnectedPublishing) throw Error(d(h.INVALID_STATE, [ "not connected" ]));
                if (Object.keys(this._sentMessages).length + this._buffered_msg_queue.length > this.disconnectedBufferSize) throw Error(d(h.BUFFER_FULL, [ this.disconnectedBufferSize ]));
                0 < e.qos ? this._requires_ack(t) : (t.sequence = ++this._sequence, this._buffered_msg_queue.push(t));
            }
        }, v.prototype.disconnect = function() {
            if (this._trace("Client.disconnect"), this._reconnecting && (this._reconnectTimeout.cancel(), 
            this._reconnectTimeout = null, this._reconnecting = !1), !this.connected) throw Error(d(h.INVALID_STATE, [ "not connecting or connected" ]));
            var e = new f(14);
            this._notify_msg_sent[e] = a(this._disconnected, this), this._schedule_message(e);
        }, v.prototype.getTraceLog = function() {
            if (null !== this._traceBuffer) {
                for (var e in this._trace("Client.getTraceLog", new Date()), this._trace("Client.getTraceLog in flight messages", this._sentMessages.length), 
                this._sentMessages) this._trace("_sentMessages ", e, this._sentMessages[e]);
                for (e in this._receivedMessages) this._trace("_receivedMessages ", e, this._receivedMessages[e]);
                return this._traceBuffer;
            }
        }, v.prototype.startTrace = function() {
            null === this._traceBuffer && (this._traceBuffer = []), this._trace("Client.startTrace", new Date(), "1.0.3");
        }, v.prototype.stopTrace = function() {
            delete this._traceBuffer;
        }, v.prototype._doConnect = function(t) {
            this.connectOptions.useSSL && ((t = t.split(":"))[0] = "wss", t = t.join(":")), 
            this._wsuri = t, this.connected = !1, e.connectSocket({
                url: t,
                protocols: [ "mqtt" ]
            }), e.onSocketOpen(a(this._on_socket_open, this)), e.onSocketMessage(a(this._on_socket_message, this)), 
            e.onSocketError(a(this._on_socket_error, this)), e.onSocketClose(a(this._on_socket_close, this)), 
            this.sendPinger = new g(this, this.connectOptions.keepAliveInterval), this.receivePinger = new g(this, this.connectOptions.keepAliveInterval), 
            this._connectTimeout && (this._connectTimeout.cancel(), this._connectTimeout = null), 
            this._connectTimeout = new p(this, this.connectOptions.timeout, this._disconnected, [ h.CONNECT_TIMEOUT.code, d(h.CONNECT_TIMEOUT) ]);
        }, v.prototype._schedule_message = function(e) {
            this._msg_queue.push(e), this.connected && this._process_queue();
        }, v.prototype.store = function(t, s) {
            var n = {
                type: s.type,
                messageIdentifier: s.messageIdentifier,
                version: 1
            };
            switch (s.type) {
              case 3:
                s.pubRecReceived && (n.pubRecReceived = !0), n.payloadMessage = {};
                for (var i = "", o = s.payloadMessage.payloadBytes, r = 0; r < o.length; r++) i = 15 >= o[r] ? i + "0" + o[r].toString(16) : i + o[r].toString(16);
                n.payloadMessage.payloadHex = i, n.payloadMessage.qos = s.payloadMessage.qos, n.payloadMessage.destinationName = s.payloadMessage.destinationName, 
                s.payloadMessage.duplicate && (n.payloadMessage.duplicate = !0), s.payloadMessage.retained && (n.payloadMessage.retained = !0), 
                0 === t.indexOf("Sent:") && (void 0 === s.sequence && (s.sequence = ++this._sequence), 
                n.sequence = s.sequence);
                break;

              default:
                throw Error(d(h.INVALID_STORED_DATA, [ key, n ]));
            }
            try {
                e.setStorageSync(t + this._localKey + s.messageIdentifier, JSON.stringify(n));
            } catch (e) {}
        }, v.prototype.restore = function(t) {
            var s = e.getStorageSync(t), n = JSON.parse(s), i = new f(n.type, n);
            switch (n.type) {
              case 3:
                s = n.payloadMessage.payloadHex;
                for (var o = new ArrayBuffer(s.length / 2), r = (o = new Uint8Array(o), 0); 2 <= s.length; ) {
                    var c = parseInt(s.substring(0, 2), 16);
                    s = s.substring(2, s.length), o[r++] = c;
                }
                (s = new m(o)).qos = n.payloadMessage.qos, s.destinationName = n.payloadMessage.destinationName, 
                n.payloadMessage.duplicate && (s.duplicate = !0), n.payloadMessage.retained && (s.retained = !0), 
                i.payloadMessage = s;
                break;

              default:
                throw Error(d(h.INVALID_STORED_DATA, [ t, s ]));
            }
            0 === t.indexOf("Sent:" + this._localKey) ? (i.payloadMessage.duplicate = !0, this._sentMessages[i.messageIdentifier] = i) : 0 === t.indexOf("Received:" + this._localKey) && (this._receivedMessages[i.messageIdentifier] = i);
        }, v.prototype._process_queue = function() {
            for (var e = null, t = this._msg_queue.reverse(); e = t.pop(); ) this._socket_send(e), 
            this._notify_msg_sent[e] && (this._notify_msg_sent[e](), delete this._notify_msg_sent[e]);
        }, v.prototype._requires_ack = function(e) {
            var t = Object.keys(this._sentMessages).length;
            if (t > this.maxMessageIdentifier) throw Error("Too many messages:" + t);
            for (;void 0 !== this._sentMessages[this._message_identifier]; ) this._message_identifier++;
            e.messageIdentifier = this._message_identifier, this._sentMessages[e.messageIdentifier] = e, 
            3 === e.type && this.store("Sent:", e), this._message_identifier === this.maxMessageIdentifier && (this._message_identifier = 1);
        }, v.prototype._on_socket_open = function(e) {
            (e = new f(1, this.connectOptions)).clientId = this.clientId, this._socket_send(e);
        }, v.prototype._on_socket_message = function(e) {
            this._trace("Client._on_socket_message", e.data), e = this._deframeMessages(e.data);
            for (var t = 0; t < e.length; t += 1) this._handleMessage(e[t]);
        }, v.prototype._deframeMessages = function(e) {
            e = new Uint8Array(e);
            var t = [];
            this.receiveBuffer && ((E = new Uint8Array(this.receiveBuffer.length + e.length)).set(this.receiveBuffer), 
            E.set(e, this.receiveBuffer.length), e = E, delete this.receiveBuffer);
            try {
                for (E = 0; E < e.length; ) {
                    var s;
                    e: {
                        var n = e, i = u = E, o = n[u], c = o >> 4, a = 15 & o, u = u + 1, l = void 0, _ = 0, g = 1;
                        do {
                            if (u == n.length) {
                                s = [ null, i ];
                                break e;
                            }
                            _ += (127 & (l = n[u++])) * g, g *= 128;
                        } while (0 != (128 & l));
                        if ((l = u + _) > n.length) s = [ null, i ]; else {
                            var p = new f(c);
                            switch (c) {
                              case 2:
                                1 & n[u++] && (p.sessionPresent = !0), p.returnCode = n[u++];
                                break;

                              case 3:
                                i = a >> 1 & 3;
                                var v = 256 * n[u] + n[u + 1], y = r(n, u += 2, v);
                                u += v, 0 < i && (p.messageIdentifier = 256 * n[u] + n[u + 1], u += 2);
                                var I = new m(n.subarray(u, l));
                                1 == (1 & a) && (I.retained = !0), 8 == (8 & a) && (I.duplicate = !0), I.qos = i, 
                                I.destinationName = y, p.payloadMessage = I;
                                break;

                              case 4:
                              case 5:
                              case 6:
                              case 7:
                              case 11:
                                p.messageIdentifier = 256 * n[u] + n[u + 1];
                                break;

                              case 9:
                                p.messageIdentifier = 256 * n[u] + n[u + 1], u += 2, p.returnCode = n.subarray(u, l);
                            }
                            s = [ p, l ];
                        }
                    }
                    var M = s[0], E = s[1];
                    if (null === M) break;
                    t.push(M);
                }
                E < e.length && (this.receiveBuffer = e.subarray(E));
            } catch (e) {
                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                return s = "undefined" == e.hasOwnProperty("stack") ? e.stack.toString() : "No Error Stack Available", 
                void this._disconnected(h.INTERNAL_ERROR.code, d(h.INTERNAL_ERROR, [ e.message, s ]));
            }
            return t;
        }, v.prototype._handleMessage = function(t) {
            this._trace("Client._handleMessage", t);
            try {
                switch (t.type) {
                  case 2:
                    if (this._connectTimeout.cancel(), this._reconnectTimeout && this._reconnectTimeout.cancel(), 
                    this.connectOptions.cleanSession) {
                        for (var s in this._sentMessages) {
                            var n = this._sentMessages[s];
                            e.removeStorageSync("Sent:" + this._localKey + n.messageIdentifier);
                        }
                        for (s in this._sentMessages = {}, this._receivedMessages) {
                            var i = this._receivedMessages[s];
                            e.removeStorageSync("Received:" + this._localKey + i.messageIdentifier);
                        }
                        this._receivedMessages = {};
                    }
                    if (0 !== t.returnCode) {
                        this._disconnected(h.CONNACK_RETURNCODE.code, d(h.CONNACK_RETURNCODE, [ t.returnCode, u[t.returnCode] ]));
                        break;
                    }
                    for (var o in this.connected = !0, this.connectOptions.uris && (this.hostIndex = this.connectOptions.uris.length), 
                    t = [], this._sentMessages) this._sentMessages.hasOwnProperty(o) && t.push(this._sentMessages[o]);
                    if (0 < this._buffered_msg_queue.length) {
                        o = null;
                        for (var r = this._buffered_msg_queue.reverse(); o = r.pop(); ) t.push(o), this.onMessageDelivered && (this._notify_msg_sent[o] = this.onMessageDelivered(o.payloadMessage));
                    }
                    t = t.sort(function(e, t) {
                        return e.sequence - t.sequence;
                    }), r = 0;
                    for (var c = t.length; r < c; r++) if (3 == (n = t[r]).type && n.pubRecReceived) {
                        var a = new f(6, {
                            messageIdentifier: n.messageIdentifier
                        });
                        this._schedule_message(a);
                    } else this._schedule_message(n);
                    this.connectOptions.onSuccess && this.connectOptions.onSuccess({
                        invocationContext: this.connectOptions.invocationContext
                    }), n = !1, this._reconnecting && (n = !0, this._reconnectInterval = 1, this._reconnecting = !1), 
                    this._connected(n, this._wsuri), this._process_queue();
                    break;

                  case 3:
                    this._receivePublish(t);
                    break;

                  case 4:
                    (n = this._sentMessages[t.messageIdentifier]) && (delete this._sentMessages[t.messageIdentifier], 
                    e.removeStorageSync("Sent:" + this._localKey + t.messageIdentifier), this.onMessageDelivered && this.onMessageDelivered(n.payloadMessage));
                    break;

                  case 5:
                    (n = this._sentMessages[t.messageIdentifier]) && (n.pubRecReceived = !0, a = new f(6, {
                        messageIdentifier: t.messageIdentifier
                    }), this.store("Sent:", n), this._schedule_message(a));
                    break;

                  case 6:
                    i = this._receivedMessages[t.messageIdentifier], e.removeStorageSync("Received:" + this._localKey + t.messageIdentifier), 
                    i && (this._receiveMessage(i), delete this._receivedMessages[t.messageIdentifier]);
                    var l = new f(7, {
                        messageIdentifier: t.messageIdentifier
                    });
                    this._schedule_message(l);
                    break;

                  case 7:
                    n = this._sentMessages[t.messageIdentifier], delete this._sentMessages[t.messageIdentifier], 
                    e.removeStorageSync("Sent:" + this._localKey + t.messageIdentifier), this.onMessageDelivered && this.onMessageDelivered(n.payloadMessage);
                    break;

                  case 9:
                    (n = this._sentMessages[t.messageIdentifier]) && (n.timeOut && n.timeOut.cancel(), 
                    128 === t.returnCode[0] ? n.onFailure && n.onFailure(t.returnCode) : n.onSuccess && n.onSuccess(t.returnCode), 
                    delete this._sentMessages[t.messageIdentifier]);
                    break;

                  case 11:
                    (n = this._sentMessages[t.messageIdentifier]) && (n.timeOut && n.timeOut.cancel(), 
                    n.callback && n.callback(), delete this._sentMessages[t.messageIdentifier]);
                    break;

                  case 13:
                    this.sendPinger.reset();
                    break;

                  case 14:
                    this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code, d(h.INVALID_MQTT_MESSAGE_TYPE, [ t.type ]));
                    break;

                  default:
                    this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code, d(h.INVALID_MQTT_MESSAGE_TYPE, [ t.type ]));
                }
            } catch (e) {
                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                n = "undefined" == e.hasOwnProperty("stack") ? e.stack.toString() : "No Error Stack Available", 
                this._disconnected(h.INTERNAL_ERROR.code, d(h.INTERNAL_ERROR, [ e.message, n ]));
            }
        }, v.prototype._on_socket_error = function(e) {
            this._reconnecting || this._disconnected(h.SOCKET_ERROR.code, d(h.SOCKET_ERROR, [ e.data ]));
        }, v.prototype._on_socket_close = function() {
            this._reconnecting || this._disconnected(h.SOCKET_CLOSE.code, d(h.SOCKET_CLOSE));
        }, v.prototype._socket_send = function(t) {
            if (1 == t.type) {
                var s = this._traceMask(t, "password");
                this._trace("Client._socket_send", s);
            } else this._trace("Client._socket_send", t);
            e.sendSocketMessage({
                data: t.encode(),
                success: function() {},
                fail: function() {},
                complete: function() {}
            }), this.sendPinger.reset();
        }, v.prototype._receivePublish = function(e) {
            switch (e.payloadMessage.qos) {
              case "undefined":
              case 0:
                this._receiveMessage(e);
                break;

              case 1:
                var t = new f(4, {
                    messageIdentifier: e.messageIdentifier
                });
                this._schedule_message(t), this._receiveMessage(e);
                break;

              case 2:
                this._receivedMessages[e.messageIdentifier] = e, this.store("Received:", e), e = new f(5, {
                    messageIdentifier: e.messageIdentifier
                }), this._schedule_message(e);
                break;

              default:
                throw Error("Invaild qos=" + wireMmessage.payloadMessage.qos);
            }
        }, v.prototype._receiveMessage = function(e) {
            this.onMessageArrived && this.onMessageArrived(e.payloadMessage);
        }, v.prototype._connected = function(e, t) {
            this.onConnected && this.onConnected(e, t);
        }, v.prototype._reconnect = function() {
            this._trace("Client._reconnect"), this.connected || (this._reconnecting = !0, this.sendPinger.cancel(), 
            this.receivePinger.cancel(), 128 > this._reconnectInterval && (this._reconnectInterval *= 2), 
            this.connectOptions.uris ? (this.hostIndex = 0, this._doConnect(this.connectOptions.uris[0])) : this._doConnect(this.uri));
        }, v.prototype._disconnected = function(e, t) {
            this._trace("Client._disconnected", e, t), void 0 !== e && this._reconnecting ? this._reconnectTimeout = new p(this, this._reconnectInterval, this._reconnect) : (this.sendPinger.cancel(), 
            this.receivePinger.cancel(), this._connectTimeout && (this._connectTimeout.cancel(), 
            this._connectTimeout = null), this._msg_queue = [], this._buffered_msg_queue = [], 
            this._notify_msg_sent = {}, this.connectOptions.uris && this.hostIndex < this.connectOptions.uris.length - 1 ? (this.hostIndex++, 
            this._doConnect(this.connectOptions.uris[this.hostIndex])) : (void 0 === e && (e = h.OK.code, 
            t = d(h.OK)), this.connected ? (this.connected = !1, this.onConnectionLost && this.onConnectionLost({
                errorCode: e,
                errorMessage: t,
                reconnect: this.connectOptions.reconnect,
                uri: this._wsuri
            }), e !== h.OK.code && this.connectOptions.reconnect && (this._reconnectInterval = 1, 
            this._reconnect())) : 4 === this.connectOptions.mqttVersion && !1 === this.connectOptions.mqttVersionExplicit ? (this._trace("Failed to connect V4, dropping back to V3"), 
            this.connectOptions.mqttVersion = 3, this.connectOptions.uris ? (this.hostIndex = 0, 
            this._doConnect(this.connectOptions.uris[0])) : this._doConnect(this.uri)) : this.connectOptions.onFailure && this.connectOptions.onFailure({
                invocationContext: this.connectOptions.invocationContext,
                errorCode: e,
                errorMessage: t
            })));
        }, v.prototype._trace = function() {
            if (this.traceFunction) {
                for (var e in arguments) void 0 !== arguments[e] && arguments.splice(e, 1, JSON.stringify(arguments[e]));
                e = Array.prototype.slice.call(arguments).join(""), this.traceFunction({
                    severity: "Debug",
                    message: e
                });
            }
            if (null !== this._traceBuffer) {
                e = 0;
                for (var t = arguments.length; e < t; e++) this._traceBuffer.length == this._MAX_TRACE_ENTRIES && this._traceBuffer.shift(), 
                0 === e || void 0 === arguments[e] ? this._traceBuffer.push(arguments[e]) : this._traceBuffer.push("  " + JSON.stringify(arguments[e]));
            }
        }, v.prototype._traceMask = function(e, t) {
            var s, n = {};
            for (s in e) e.hasOwnProperty(s) && (n[s] = s == t ? "******" : e[s]);
            return n;
        };
        var y = function(e, t, n, i) {
            var o;
            if ("string" != typeof e) throw Error(d(h.INVALID_TYPE, [ s(e), "host" ]));
            if (2 == arguments.length) {
                i = t;
                var r = (o = e).match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);
                if (!r) throw Error(d(h.INVALID_ARGUMENT, [ e, "host" ]));
                e = r[4] || r[2], t = parseInt(r[7]), n = r[8];
            } else {
                if (3 == arguments.length && (i = n, n = "/mqtt"), "number" != typeof t || 0 > t) throw Error(d(h.INVALID_TYPE, [ s(t), "port" ]));
                if ("string" != typeof n) throw Error(d(h.INVALID_TYPE, [ s(n), "path" ]));
                o = "ws://" + (-1 !== e.indexOf(":") && "[" !== e.slice(0, 1) && "]" !== e.slice(-1) ? "[" + e + "]" : e) + ":" + t + n;
            }
            for (var a = r = 0; a < i.length; a++) {
                var u = i.charCodeAt(a);
                55296 <= u && 56319 >= u && a++, r++;
            }
            if ("string" != typeof i || 65535 < r) throw Error(d(h.INVALID_ARGUMENT, [ i, "clientId" ]));
            var l = new v(o, e, t, n, i);
            this._getHost = function() {
                return e;
            }, this._setHost = function() {
                throw Error(d(h.UNSUPPORTED_OPERATION));
            }, this._getPort = function() {
                return t;
            }, this._setPort = function() {
                throw Error(d(h.UNSUPPORTED_OPERATION));
            }, this._getPath = function() {
                return n;
            }, this._setPath = function() {
                throw Error(d(h.UNSUPPORTED_OPERATION));
            }, this._getURI = function() {
                return o;
            }, this._setURI = function() {
                throw Error(d(h.UNSUPPORTED_OPERATION));
            }, this._getClientId = function() {
                return l.clientId;
            }, this._setClientId = function() {
                throw Error(d(h.UNSUPPORTED_OPERATION));
            }, this._getOnConnected = function() {
                return l.onConnected;
            }, this._setOnConnected = function(e) {
                if ("function" != typeof e) throw Error(d(h.INVALID_TYPE, [ s(e), "onConnected" ]));
                l.onConnected = e;
            }, this._getDisconnectedPublishing = function() {
                return l.disconnectedPublishing;
            }, this._setDisconnectedPublishing = function(e) {
                l.disconnectedPublishing = e;
            }, this._getDisconnectedBufferSize = function() {
                return l.disconnectedBufferSize;
            }, this._setDisconnectedBufferSize = function(e) {
                l.disconnectedBufferSize = e;
            }, this._getOnConnectionLost = function() {
                return l.onConnectionLost;
            }, this._setOnConnectionLost = function(e) {
                if ("function" != typeof e) throw Error(d(h.INVALID_TYPE, [ s(e), "onConnectionLost" ]));
                l.onConnectionLost = e;
            }, this._getOnMessageDelivered = function() {
                return l.onMessageDelivered;
            }, this._setOnMessageDelivered = function(e) {
                if ("function" != typeof e) throw Error(d(h.INVALID_TYPE, [ s(e), "onMessageDelivered" ]));
                l.onMessageDelivered = e;
            }, this._getOnMessageArrived = function() {
                return l.onMessageArrived;
            }, this._setOnMessageArrived = function(e) {
                if ("function" != typeof e) throw Error(d(h.INVALID_TYPE, [ s(e), "onMessageArrived" ]));
                l.onMessageArrived = e;
            }, this._getTrace = function() {
                return l.traceFunction;
            }, this._setTrace = function(e) {
                if ("function" != typeof e) throw Error(d(h.INVALID_TYPE, [ s(e), "onTrace" ]));
                l.traceFunction = e;
            }, this.connect = function(e) {
                if (c(e = e || {}, {
                    timeout: "number",
                    userName: "string",
                    password: "string",
                    willMessage: "object",
                    keepAliveInterval: "number",
                    cleanSession: "boolean",
                    useSSL: "boolean",
                    invocationContext: "object",
                    onSuccess: "function",
                    onFailure: "function",
                    hosts: "object",
                    ports: "object",
                    reconnect: "boolean",
                    mqttVersion: "number",
                    mqttVersionExplicit: "boolean",
                    uris: "object"
                }), void 0 === e.keepAliveInterval && (e.keepAliveInterval = 60), 4 < e.mqttVersion || 3 > e.mqttVersion) throw Error(d(h.INVALID_ARGUMENT, [ e.mqttVersion, "connectOptions.mqttVersion" ]));
                if (void 0 === e.mqttVersion ? (e.mqttVersionExplicit = !1, e.mqttVersion = 4) : e.mqttVersionExplicit = !0, 
                void 0 !== e.password && void 0 === e.userName) throw Error(d(h.INVALID_ARGUMENT, [ e.password, "connectOptions.password" ]));
                if (e.willMessage) {
                    if (!(e.willMessage instanceof m)) throw Error(d(h.INVALID_TYPE, [ e.willMessage, "connectOptions.willMessage" ]));
                    if (e.willMessage.stringPayload = null, void 0 === e.willMessage.destinationName) throw Error(d(h.INVALID_TYPE, [ s(e.willMessage.destinationName), "connectOptions.willMessage.destinationName" ]));
                }
                if (void 0 === e.cleanSession && (e.cleanSession = !0), e.hosts) {
                    if (!(e.hosts instanceof Array)) throw Error(d(h.INVALID_ARGUMENT, [ e.hosts, "connectOptions.hosts" ]));
                    if (1 > e.hosts.length) throw Error(d(h.INVALID_ARGUMENT, [ e.hosts, "connectOptions.hosts" ]));
                    for (var t = !1, i = 0; i < e.hosts.length; i++) {
                        if ("string" != typeof e.hosts[i]) throw Error(d(h.INVALID_TYPE, [ s(e.hosts[i]), "connectOptions.hosts[" + i + "]" ]));
                        if (/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(e.hosts[i])) {
                            if (0 === i) t = !0; else if (!t) throw Error(d(h.INVALID_ARGUMENT, [ e.hosts[i], "connectOptions.hosts[" + i + "]" ]));
                        } else if (t) throw Error(d(h.INVALID_ARGUMENT, [ e.hosts[i], "connectOptions.hosts[" + i + "]" ]));
                    }
                    if (t) e.uris = e.hosts; else {
                        if (!e.ports) throw Error(d(h.INVALID_ARGUMENT, [ e.ports, "connectOptions.ports" ]));
                        if (!(e.ports instanceof Array)) throw Error(d(h.INVALID_ARGUMENT, [ e.ports, "connectOptions.ports" ]));
                        if (e.hosts.length !== e.ports.length) throw Error(d(h.INVALID_ARGUMENT, [ e.ports, "connectOptions.ports" ]));
                        for (e.uris = [], i = 0; i < e.hosts.length; i++) {
                            if ("number" != typeof e.ports[i] || 0 > e.ports[i]) throw Error(d(h.INVALID_TYPE, [ s(e.ports[i]), "connectOptions.ports[" + i + "]" ]));
                            t = e.hosts[i];
                            var r = e.ports[i];
                            o = "ws://" + (-1 !== t.indexOf(":") ? "[" + t + "]" : t) + ":" + r + n, e.uris.push(o);
                        }
                    }
                }
                l.connect(e);
            }, this.subscribe = function(e, t) {
                if ("string" != typeof e) throw Error("Invalid argument:" + e);
                if (c(t = t || {}, {
                    qos: "number",
                    invocationContext: "object",
                    onSuccess: "function",
                    onFailure: "function",
                    timeout: "number"
                }), t.timeout && !t.onFailure) throw Error("subscribeOptions.timeout specified with no onFailure callback.");
                if (void 0 !== t.qos && 0 !== t.qos && 1 !== t.qos && 2 !== t.qos) throw Error(d(h.INVALID_ARGUMENT, [ t.qos, "subscribeOptions.qos" ]));
                l.subscribe(e, t);
            }, this.unsubscribe = function(e, t) {
                if ("string" != typeof e) throw Error("Invalid argument:" + e);
                if (c(t = t || {}, {
                    invocationContext: "object",
                    onSuccess: "function",
                    onFailure: "function",
                    timeout: "number"
                }), t.timeout && !t.onFailure) throw Error("unsubscribeOptions.timeout specified with no onFailure callback.");
                l.unsubscribe(e, t);
            }, this.send = function(e, t, n, i) {
                var o;
                if (0 === arguments.length) throw Error("Invalid argument.length");
                if (1 == arguments.length) {
                    if (!(e instanceof m) && "string" != typeof e) throw Error("Invalid argument:" + s(e));
                    if (void 0 === (o = e).destinationName) throw Error(d(h.INVALID_ARGUMENT, [ o.destinationName, "Message.destinationName" ]));
                } else (o = new m(t)).destinationName = e, 3 <= arguments.length && (o.qos = n), 
                4 <= arguments.length && (o.retained = i);
                l.send(o);
            }, this.publish = function(e, t, n, i) {
                var o;
                if (console.log("Publising message to: ", e), 0 === arguments.length) throw Error("Invalid argument.length");
                if (1 == arguments.length) {
                    if (!(e instanceof m) && "string" != typeof e) throw Error("Invalid argument:" + s(e));
                    if (void 0 === (o = e).destinationName) throw Error(d(h.INVALID_ARGUMENT, [ o.destinationName, "Message.destinationName" ]));
                } else (o = new m(t)).destinationName = e, 3 <= arguments.length && (o.qos = n), 
                4 <= arguments.length && (o.retained = i);
                l.send(o);
            }, this.disconnect = function() {
                l.disconnect();
            }, this.getTraceLog = function() {
                return l.getTraceLog();
            }, this.startTrace = function() {
                l.startTrace();
            }, this.stopTrace = function() {
                l.stopTrace();
            }, this.isConnected = function() {
                return l.connected;
            };
        };
        y.prototype = {
            get host() {
                return this._getHost();
            },
            set host(e) {
                this._setHost(e);
            },
            get port() {
                return this._getPort();
            },
            set port(e) {
                this._setPort(e);
            },
            get path() {
                return this._getPath();
            },
            set path(e) {
                this._setPath(e);
            },
            get clientId() {
                return this._getClientId();
            },
            set clientId(e) {
                this._setClientId(e);
            },
            get onConnected() {
                return this._getOnConnected();
            },
            set onConnected(e) {
                this._setOnConnected(e);
            },
            get disconnectedPublishing() {
                return this._getDisconnectedPublishing();
            },
            set disconnectedPublishing(e) {
                this._setDisconnectedPublishing(e);
            },
            get disconnectedBufferSize() {
                return this._getDisconnectedBufferSize();
            },
            set disconnectedBufferSize(e) {
                this._setDisconnectedBufferSize(e);
            },
            get onConnectionLost() {
                return this._getOnConnectionLost();
            },
            set onConnectionLost(e) {
                this._setOnConnectionLost(e);
            },
            get onMessageDelivered() {
                return this._getOnMessageDelivered();
            },
            set onMessageDelivered(e) {
                this._setOnMessageDelivered(e);
            },
            get onMessageArrived() {
                return this._getOnMessageArrived();
            },
            set onMessageArrived(e) {
                this._setOnMessageArrived(e);
            },
            get trace() {
                return this._getTrace();
            },
            set trace(e) {
                this._setTrace(e);
            }
        };
        var m = function(e) {
            var t, s;
            if (!("string" == typeof e || e instanceof ArrayBuffer || e instanceof Int8Array || e instanceof Uint8Array || e instanceof Int16Array || e instanceof Uint16Array || e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array)) throw d(h.INVALID_ARGUMENT, [ e, "newPayload" ]);
            t = e, this._getPayloadString = function() {
                return "string" == typeof t ? t : r(t, 0, t.length);
            }, this._getPayloadBytes = function() {
                if ("string" == typeof t) {
                    var e = new ArrayBuffer(i(t));
                    return e = new Uint8Array(e), o(t, e, 0), e;
                }
                return t;
            }, this._getDestinationName = function() {
                return s;
            }, this._setDestinationName = function(e) {
                if ("string" != typeof e) throw Error(d(h.INVALID_ARGUMENT, [ e, "newDestinationName" ]));
                s = e;
            };
            var n = 0;
            this._getQos = function() {
                return n;
            }, this._setQos = function(e) {
                if (0 !== e && 1 !== e && 2 !== e) throw Error("Invalid argument:" + e);
                n = e;
            };
            var c = !1;
            this._getRetained = function() {
                return c;
            }, this._setRetained = function(e) {
                if ("boolean" != typeof e) throw Error(d(h.INVALID_ARGUMENT, [ e, "newRetained" ]));
                c = e;
            };
            var a = !1;
            this._getDuplicate = function() {
                return a;
            }, this._setDuplicate = function(e) {
                a = e;
            };
        };
        return m.prototype = {
            get payloadString() {
                return this._getPayloadString();
            },
            get payloadBytes() {
                return this._getPayloadBytes();
            },
            get destinationName() {
                return this._getDestinationName();
            },
            set destinationName(e) {
                this._setDestinationName(e);
            },
            get topic() {
                return this._getDestinationName();
            },
            set topic(e) {
                this._setDestinationName(e);
            },
            get qos() {
                return this._getQos();
            },
            set qos(e) {
                this._setQos(e);
            },
            get retained() {
                return this._getRetained();
            },
            set retained(e) {
                this._setRetained(e);
            },
            get duplicate() {
                return this._getDuplicate();
            },
            set duplicate(e) {
                this._setDuplicate(e);
            }
        }, {
            Client: y,
            Message: m
        };
    }(wx);
}, "object" === ("undefined" == typeof exports ? "undefined" : s(exports)) && "object" === ("undefined" == typeof module ? "undefined" : s(module)) ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : "object" === ("undefined" == typeof exports ? "undefined" : s(exports)) ? exports = t() : (void 0 === e.Paho && (e.Paho = {}), 
e.Paho.MQTT = t());