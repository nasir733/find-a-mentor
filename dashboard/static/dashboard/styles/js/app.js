(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/iframe-resizer/js/iframeResizer.js
  var require_iframeResizer = __commonJS({
    "node_modules/iframe-resizer/js/iframeResizer.js"(exports, module) {
      (function(undefined) {
        if (typeof window === "undefined")
          return;
        var count = 0, logEnabled = false, hiddenCheckEnabled = false, msgHeader = "message", msgHeaderLen = msgHeader.length, msgId = "[iFrameSizer]", msgIdLen = msgId.length, pagePosition = null, requestAnimationFrame2 = window.requestAnimationFrame, resetRequiredMethods = {
          max: 1,
          scroll: 1,
          bodyScroll: 1,
          documentElementScroll: 1
        }, settings = {}, timer = null, defaults = {
          autoResize: true,
          bodyBackground: null,
          bodyMargin: null,
          bodyMarginV1: 8,
          bodyPadding: null,
          checkOrigin: true,
          inPageLinks: false,
          enablePublicMethods: true,
          heightCalculationMethod: "bodyOffset",
          id: "iFrameResizer",
          interval: 32,
          log: false,
          maxHeight: Infinity,
          maxWidth: Infinity,
          minHeight: 0,
          minWidth: 0,
          resizeFrom: "parent",
          scrolling: false,
          sizeHeight: true,
          sizeWidth: false,
          warningTimeout: 5e3,
          tolerance: 0,
          widthCalculationMethod: "scroll",
          onClose: function() {
            return true;
          },
          onClosed: function() {
          },
          onInit: function() {
          },
          onMessage: function() {
            warn2("onMessage function not defined");
          },
          onMouseEnter: function() {
          },
          onMouseLeave: function() {
          },
          onResized: function() {
          },
          onScroll: function() {
            return true;
          }
        };
        function getMutationObserver() {
          return window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        }
        function addEventListener(el, evt, func) {
          el.addEventListener(evt, func, false);
        }
        function removeEventListener(el, evt, func) {
          el.removeEventListener(evt, func, false);
        }
        function setupRequestAnimationFrame() {
          var vendors = ["moz", "webkit", "o", "ms"];
          var x;
          for (x = 0; x < vendors.length && !requestAnimationFrame2; x += 1) {
            requestAnimationFrame2 = window[vendors[x] + "RequestAnimationFrame"];
          }
          if (!requestAnimationFrame2) {
            log("setup", "RequestAnimationFrame not supported");
          } else {
            requestAnimationFrame2 = requestAnimationFrame2.bind(window);
          }
        }
        function getMyID(iframeId) {
          var retStr = "Host page: " + iframeId;
          if (window.top !== window.self) {
            if (window.parentIFrame && window.parentIFrame.getId) {
              retStr = window.parentIFrame.getId() + ": " + iframeId;
            } else {
              retStr = "Nested host page: " + iframeId;
            }
          }
          return retStr;
        }
        function formatLogHeader(iframeId) {
          return msgId + "[" + getMyID(iframeId) + "]";
        }
        function isLogEnabled(iframeId) {
          return settings[iframeId] ? settings[iframeId].log : logEnabled;
        }
        function log(iframeId, msg) {
          output("log", iframeId, msg, isLogEnabled(iframeId));
        }
        function info(iframeId, msg) {
          output("info", iframeId, msg, isLogEnabled(iframeId));
        }
        function warn2(iframeId, msg) {
          output("warn", iframeId, msg, true);
        }
        function output(type, iframeId, msg, enabled) {
          if (enabled === true && typeof window.console === "object") {
            console[type](formatLogHeader(iframeId), msg);
          }
        }
        function iFrameListener(event) {
          function resizeIFrame() {
            function resize() {
              setSize(messageData);
              setPagePosition(iframeId);
              on2("onResized", messageData);
            }
            ensureInRange("Height");
            ensureInRange("Width");
            syncResize(resize, messageData, "init");
          }
          function processMsg() {
            var data2 = msg.substr(msgIdLen).split(":");
            var height = data2[1] ? parseInt(data2[1], 10) : 0;
            var iframe = settings[data2[0]] && settings[data2[0]].iframe;
            var compStyle = getComputedStyle(iframe);
            return {
              iframe,
              id: data2[0],
              height: height + getPaddingEnds(compStyle) + getBorderEnds(compStyle),
              width: data2[2],
              type: data2[3]
            };
          }
          function getPaddingEnds(compStyle) {
            if (compStyle.boxSizing !== "border-box") {
              return 0;
            }
            var top = compStyle.paddingTop ? parseInt(compStyle.paddingTop, 10) : 0;
            var bot = compStyle.paddingBottom ? parseInt(compStyle.paddingBottom, 10) : 0;
            return top + bot;
          }
          function getBorderEnds(compStyle) {
            if (compStyle.boxSizing !== "border-box") {
              return 0;
            }
            var top = compStyle.borderTopWidth ? parseInt(compStyle.borderTopWidth, 10) : 0;
            var bot = compStyle.borderBottomWidth ? parseInt(compStyle.borderBottomWidth, 10) : 0;
            return top + bot;
          }
          function ensureInRange(Dimension) {
            var max = Number(settings[iframeId]["max" + Dimension]), min = Number(settings[iframeId]["min" + Dimension]), dimension = Dimension.toLowerCase(), size = Number(messageData[dimension]);
            log(iframeId, "Checking " + dimension + " is in range " + min + "-" + max);
            if (size < min) {
              size = min;
              log(iframeId, "Set " + dimension + " to min value");
            }
            if (size > max) {
              size = max;
              log(iframeId, "Set " + dimension + " to max value");
            }
            messageData[dimension] = "" + size;
          }
          function isMessageFromIFrame() {
            function checkAllowedOrigin() {
              function checkList() {
                var i = 0, retCode = false;
                log(iframeId, "Checking connection is from allowed list of origins: " + checkOrigin);
                for (; i < checkOrigin.length; i++) {
                  if (checkOrigin[i] === origin) {
                    retCode = true;
                    break;
                  }
                }
                return retCode;
              }
              function checkSingle() {
                var remoteHost = settings[iframeId] && settings[iframeId].remoteHost;
                log(iframeId, "Checking connection is from: " + remoteHost);
                return origin === remoteHost;
              }
              return checkOrigin.constructor === Array ? checkList() : checkSingle();
            }
            var origin = event.origin, checkOrigin = settings[iframeId] && settings[iframeId].checkOrigin;
            if (checkOrigin && "" + origin !== "null" && !checkAllowedOrigin()) {
              throw new Error("Unexpected message received from: " + origin + " for " + messageData.iframe.id + ". Message was: " + event.data + ". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");
            }
            return true;
          }
          function isMessageForUs() {
            return msgId === ("" + msg).substr(0, msgIdLen) && msg.substr(msgIdLen).split(":")[0] in settings;
          }
          function isMessageFromMetaParent() {
            var retCode = messageData.type in { true: 1, false: 1, undefined: 1 };
            if (retCode) {
              log(iframeId, "Ignoring init message from meta parent page");
            }
            return retCode;
          }
          function getMsgBody(offset) {
            return msg.substr(msg.indexOf(":") + msgHeaderLen + offset);
          }
          function forwardMsgFromIFrame(msgBody) {
            log(iframeId, "onMessage passed: {iframe: " + messageData.iframe.id + ", message: " + msgBody + "}");
            on2("onMessage", {
              iframe: messageData.iframe,
              message: JSON.parse(msgBody)
            });
            log(iframeId, "--");
          }
          function getPageInfo() {
            var bodyPosition = document.body.getBoundingClientRect(), iFramePosition = messageData.iframe.getBoundingClientRect();
            return JSON.stringify({
              iframeHeight: iFramePosition.height,
              iframeWidth: iFramePosition.width,
              clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
              clientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
              offsetTop: parseInt(iFramePosition.top - bodyPosition.top, 10),
              offsetLeft: parseInt(iFramePosition.left - bodyPosition.left, 10),
              scrollTop: window.pageYOffset,
              scrollLeft: window.pageXOffset,
              documentHeight: document.documentElement.clientHeight,
              documentWidth: document.documentElement.clientWidth,
              windowHeight: window.innerHeight,
              windowWidth: window.innerWidth
            });
          }
          function sendPageInfoToIframe(iframe, iframeId2) {
            function debouncedTrigger() {
              trigger("Send Page Info", "pageInfo:" + getPageInfo(), iframe, iframeId2);
            }
            debounceFrameEvents(debouncedTrigger, 32, iframeId2);
          }
          function startPageInfoMonitor() {
            function setListener(type, func) {
              function sendPageInfo() {
                if (settings[id]) {
                  sendPageInfoToIframe(settings[id].iframe, id);
                } else {
                  stop();
                }
              }
              ;
              ["scroll", "resize"].forEach(function(evt) {
                log(id, type + evt + " listener for sendPageInfo");
                func(window, evt, sendPageInfo);
              });
            }
            function stop() {
              setListener("Remove ", removeEventListener);
            }
            function start2() {
              setListener("Add ", addEventListener);
            }
            var id = iframeId;
            start2();
            if (settings[id]) {
              settings[id].stopPageInfo = stop;
            }
          }
          function stopPageInfoMonitor() {
            if (settings[iframeId] && settings[iframeId].stopPageInfo) {
              settings[iframeId].stopPageInfo();
              delete settings[iframeId].stopPageInfo;
            }
          }
          function checkIFrameExists() {
            var retBool = true;
            if (messageData.iframe === null) {
              warn2(iframeId, "IFrame (" + messageData.id + ") not found");
              retBool = false;
            }
            return retBool;
          }
          function getElementPosition(target) {
            var iFramePosition = target.getBoundingClientRect();
            getPagePosition(iframeId);
            return {
              x: Math.floor(Number(iFramePosition.left) + Number(pagePosition.x)),
              y: Math.floor(Number(iFramePosition.top) + Number(pagePosition.y))
            };
          }
          function scrollRequestFromChild(addOffset) {
            function reposition() {
              pagePosition = newPosition;
              scrollTo();
              log(iframeId, "--");
            }
            function calcOffset() {
              return {
                x: Number(messageData.width) + offset.x,
                y: Number(messageData.height) + offset.y
              };
            }
            function scrollParent() {
              if (window.parentIFrame) {
                window.parentIFrame["scrollTo" + (addOffset ? "Offset" : "")](newPosition.x, newPosition.y);
              } else {
                warn2(iframeId, "Unable to scroll to requested position, window.parentIFrame not found");
              }
            }
            var offset = addOffset ? getElementPosition(messageData.iframe) : { x: 0, y: 0 }, newPosition = calcOffset();
            log(iframeId, "Reposition requested from iFrame (offset x:" + offset.x + " y:" + offset.y + ")");
            if (window.top !== window.self) {
              scrollParent();
            } else {
              reposition();
            }
          }
          function scrollTo() {
            if (on2("onScroll", pagePosition) !== false) {
              setPagePosition(iframeId);
            } else {
              unsetPagePosition();
            }
          }
          function findTarget(location) {
            function jumpToTarget() {
              var jumpPosition = getElementPosition(target);
              log(iframeId, "Moving to in page link (#" + hash + ") at x: " + jumpPosition.x + " y: " + jumpPosition.y);
              pagePosition = {
                x: jumpPosition.x,
                y: jumpPosition.y
              };
              scrollTo();
              log(iframeId, "--");
            }
            function jumpToParent() {
              if (window.parentIFrame) {
                window.parentIFrame.moveToAnchor(hash);
              } else {
                log(iframeId, "In page link #" + hash + " not found and window.parentIFrame not found");
              }
            }
            var hash = location.split("#")[1] || "", hashData = decodeURIComponent(hash), target = document.getElementById(hashData) || document.getElementsByName(hashData)[0];
            if (target) {
              jumpToTarget();
            } else if (window.top !== window.self) {
              jumpToParent();
            } else {
              log(iframeId, "In page link #" + hash + " not found");
            }
          }
          function onMouse(event2) {
            on2(event2, {
              iframe: messageData.iframe,
              screenX: messageData.width,
              screenY: messageData.height,
              type: messageData.type
            });
          }
          function on2(funcName, val) {
            return chkEvent(iframeId, funcName, val);
          }
          function actionMsg() {
            if (settings[iframeId] && settings[iframeId].firstRun)
              firstRun();
            switch (messageData.type) {
              case "close":
                closeIFrame(messageData.iframe);
                break;
              case "message":
                forwardMsgFromIFrame(getMsgBody(6));
                break;
              case "mouseenter":
                onMouse("onMouseEnter");
                break;
              case "mouseleave":
                onMouse("onMouseLeave");
                break;
              case "autoResize":
                settings[iframeId].autoResize = JSON.parse(getMsgBody(9));
                break;
              case "scrollTo":
                scrollRequestFromChild(false);
                break;
              case "scrollToOffset":
                scrollRequestFromChild(true);
                break;
              case "pageInfo":
                sendPageInfoToIframe(settings[iframeId] && settings[iframeId].iframe, iframeId);
                startPageInfoMonitor();
                break;
              case "pageInfoStop":
                stopPageInfoMonitor();
                break;
              case "inPageLink":
                findTarget(getMsgBody(9));
                break;
              case "reset":
                resetIFrame(messageData);
                break;
              case "init":
                resizeIFrame();
                on2("onInit", messageData.iframe);
                break;
              default:
                resizeIFrame();
            }
          }
          function hasSettings(iframeId2) {
            var retBool = true;
            if (!settings[iframeId2]) {
              retBool = false;
              warn2(messageData.type + " No settings for " + iframeId2 + ". Message was: " + msg);
            }
            return retBool;
          }
          function iFrameReadyMsgReceived() {
            for (var iframeId2 in settings) {
              trigger("iFrame requested init", createOutgoingMsg(iframeId2), settings[iframeId2].iframe, iframeId2);
            }
          }
          function firstRun() {
            if (settings[iframeId]) {
              settings[iframeId].firstRun = false;
            }
          }
          var msg = event.data, messageData = {}, iframeId = null;
          if (msg === "[iFrameResizerChild]Ready") {
            iFrameReadyMsgReceived();
          } else if (isMessageForUs()) {
            messageData = processMsg();
            iframeId = messageData.id;
            if (settings[iframeId]) {
              settings[iframeId].loaded = true;
            }
            if (!isMessageFromMetaParent() && hasSettings(iframeId)) {
              log(iframeId, "Received: " + msg);
              if (checkIFrameExists() && isMessageFromIFrame()) {
                actionMsg();
              }
            }
          } else {
            info(iframeId, "Ignored: " + msg);
          }
        }
        function chkEvent(iframeId, funcName, val) {
          var func = null, retVal = null;
          if (settings[iframeId]) {
            func = settings[iframeId][funcName];
            if (typeof func === "function") {
              retVal = func(val);
            } else {
              throw new TypeError(funcName + " on iFrame[" + iframeId + "] is not a function");
            }
          }
          return retVal;
        }
        function removeIframeListeners(iframe) {
          var iframeId = iframe.id;
          delete settings[iframeId];
        }
        function closeIFrame(iframe) {
          var iframeId = iframe.id;
          if (chkEvent(iframeId, "onClose", iframeId) === false) {
            log(iframeId, "Close iframe cancelled by onClose event");
            return;
          }
          log(iframeId, "Removing iFrame: " + iframeId);
          try {
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
          } catch (error2) {
            warn2(error2);
          }
          chkEvent(iframeId, "onClosed", iframeId);
          log(iframeId, "--");
          removeIframeListeners(iframe);
        }
        function getPagePosition(iframeId) {
          if (pagePosition === null) {
            pagePosition = {
              x: window.pageXOffset !== undefined ? window.pageXOffset : document.documentElement.scrollLeft,
              y: window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop
            };
            log(iframeId, "Get page position: " + pagePosition.x + "," + pagePosition.y);
          }
        }
        function setPagePosition(iframeId) {
          if (pagePosition !== null) {
            window.scrollTo(pagePosition.x, pagePosition.y);
            log(iframeId, "Set page position: " + pagePosition.x + "," + pagePosition.y);
            unsetPagePosition();
          }
        }
        function unsetPagePosition() {
          pagePosition = null;
        }
        function resetIFrame(messageData) {
          function reset() {
            setSize(messageData);
            trigger("reset", "reset", messageData.iframe, messageData.id);
          }
          log(messageData.id, "Size reset requested by " + (messageData.type === "init" ? "host page" : "iFrame"));
          getPagePosition(messageData.id);
          syncResize(reset, messageData, "reset");
        }
        function setSize(messageData) {
          function setDimension(dimension) {
            if (!messageData.id) {
              log("undefined", "messageData id not set");
              return;
            }
            messageData.iframe.style[dimension] = messageData[dimension] + "px";
            log(messageData.id, "IFrame (" + iframeId + ") " + dimension + " set to " + messageData[dimension] + "px");
          }
          function chkZero(dimension) {
            if (!hiddenCheckEnabled && messageData[dimension] === "0") {
              hiddenCheckEnabled = true;
              log(iframeId, "Hidden iFrame detected, creating visibility listener");
              fixHiddenIFrames();
            }
          }
          function processDimension(dimension) {
            setDimension(dimension);
            chkZero(dimension);
          }
          var iframeId = messageData.iframe.id;
          if (settings[iframeId]) {
            if (settings[iframeId].sizeHeight) {
              processDimension("height");
            }
            if (settings[iframeId].sizeWidth) {
              processDimension("width");
            }
          }
        }
        function syncResize(func, messageData, doNotSync) {
          if (doNotSync !== messageData.type && requestAnimationFrame2 && !window.jasmine) {
            log(messageData.id, "Requesting animation frame");
            requestAnimationFrame2(func);
          } else {
            func();
          }
        }
        function trigger(calleeMsg, msg, iframe, id, noResponseWarning) {
          function postMessageToIFrame() {
            var target = settings[id] && settings[id].targetOrigin;
            log(id, "[" + calleeMsg + "] Sending msg to iframe[" + id + "] (" + msg + ") targetOrigin: " + target);
            iframe.contentWindow.postMessage(msgId + msg, target);
          }
          function iFrameNotFound() {
            warn2(id, "[" + calleeMsg + "] IFrame(" + id + ") not found");
          }
          function chkAndSend() {
            if (iframe && "contentWindow" in iframe && iframe.contentWindow !== null) {
              postMessageToIFrame();
            } else {
              iFrameNotFound();
            }
          }
          function warnOnNoResponse() {
            function warning() {
              if (settings[id] && !settings[id].loaded && !errorShown) {
                errorShown = true;
                warn2(id, "IFrame has not responded within " + settings[id].warningTimeout / 1e3 + " seconds. Check iFrameResizer.contentWindow.js has been loaded in iFrame. This message can be ignored if everything is working, or you can set the warningTimeout option to a higher value or zero to suppress this warning.");
              }
            }
            if (!!noResponseWarning && settings[id] && !!settings[id].warningTimeout) {
              settings[id].msgTimeout = setTimeout(warning, settings[id].warningTimeout);
            }
          }
          var errorShown = false;
          id = id || iframe.id;
          if (settings[id]) {
            chkAndSend();
            warnOnNoResponse();
          }
        }
        function createOutgoingMsg(iframeId) {
          return iframeId + ":" + settings[iframeId].bodyMarginV1 + ":" + settings[iframeId].sizeWidth + ":" + settings[iframeId].log + ":" + settings[iframeId].interval + ":" + settings[iframeId].enablePublicMethods + ":" + settings[iframeId].autoResize + ":" + settings[iframeId].bodyMargin + ":" + settings[iframeId].heightCalculationMethod + ":" + settings[iframeId].bodyBackground + ":" + settings[iframeId].bodyPadding + ":" + settings[iframeId].tolerance + ":" + settings[iframeId].inPageLinks + ":" + settings[iframeId].resizeFrom + ":" + settings[iframeId].widthCalculationMethod;
        }
        function setupIFrame(iframe, options) {
          function setLimits() {
            function addStyle(style) {
              if (settings[iframeId][style] !== Infinity && settings[iframeId][style] !== 0) {
                iframe.style[style] = settings[iframeId][style] + "px";
                log(iframeId, "Set " + style + " = " + settings[iframeId][style] + "px");
              }
            }
            function chkMinMax(dimension) {
              if (settings[iframeId]["min" + dimension] > settings[iframeId]["max" + dimension]) {
                throw new Error("Value for min" + dimension + " can not be greater than max" + dimension);
              }
            }
            chkMinMax("Height");
            chkMinMax("Width");
            addStyle("maxHeight");
            addStyle("minHeight");
            addStyle("maxWidth");
            addStyle("minWidth");
          }
          function newId() {
            var id = options && options.id || defaults.id + count++;
            if (document.getElementById(id) !== null) {
              id += count++;
            }
            return id;
          }
          function ensureHasId(iframeId2) {
            if (iframeId2 === "") {
              iframe.id = iframeId2 = newId();
              logEnabled = (options || {}).log;
              log(iframeId2, "Added missing iframe ID: " + iframeId2 + " (" + iframe.src + ")");
            }
            return iframeId2;
          }
          function setScrolling() {
            log(iframeId, "IFrame scrolling " + (settings[iframeId] && settings[iframeId].scrolling ? "enabled" : "disabled") + " for " + iframeId);
            iframe.style.overflow = (settings[iframeId] && settings[iframeId].scrolling) === false ? "hidden" : "auto";
            switch (settings[iframeId] && settings[iframeId].scrolling) {
              case "omit":
                break;
              case true:
                iframe.scrolling = "yes";
                break;
              case false:
                iframe.scrolling = "no";
                break;
              default:
                iframe.scrolling = settings[iframeId] ? settings[iframeId].scrolling : "no";
            }
          }
          function setupBodyMarginValues() {
            if (typeof (settings[iframeId] && settings[iframeId].bodyMargin) === "number" || (settings[iframeId] && settings[iframeId].bodyMargin) === "0") {
              settings[iframeId].bodyMarginV1 = settings[iframeId].bodyMargin;
              settings[iframeId].bodyMargin = "" + settings[iframeId].bodyMargin + "px";
            }
          }
          function checkReset() {
            var firstRun = settings[iframeId] && settings[iframeId].firstRun, resetRequertMethod = settings[iframeId] && settings[iframeId].heightCalculationMethod in resetRequiredMethods;
            if (!firstRun && resetRequertMethod) {
              resetIFrame({ iframe, height: 0, width: 0, type: "init" });
            }
          }
          function setupIFrameObject() {
            if (settings[iframeId]) {
              settings[iframeId].iframe.iFrameResizer = {
                close: closeIFrame.bind(null, settings[iframeId].iframe),
                removeListeners: removeIframeListeners.bind(null, settings[iframeId].iframe),
                resize: trigger.bind(null, "Window resize", "resize", settings[iframeId].iframe),
                moveToAnchor: function(anchor) {
                  trigger("Move to anchor", "moveToAnchor:" + anchor, settings[iframeId].iframe, iframeId);
                },
                sendMessage: function(message) {
                  message = JSON.stringify(message);
                  trigger("Send Message", "message:" + message, settings[iframeId].iframe, iframeId);
                }
              };
            }
          }
          function init(msg) {
            function iFrameLoaded() {
              trigger("iFrame.onload", msg, iframe, undefined, true);
              checkReset();
            }
            function createDestroyObserver(MutationObserver3) {
              if (!iframe.parentNode) {
                return;
              }
              var destroyObserver = new MutationObserver3(function(mutations) {
                mutations.forEach(function(mutation) {
                  var removedNodes = Array.prototype.slice.call(mutation.removedNodes);
                  removedNodes.forEach(function(removedNode) {
                    if (removedNode === iframe) {
                      closeIFrame(iframe);
                    }
                  });
                });
              });
              destroyObserver.observe(iframe.parentNode, {
                childList: true
              });
            }
            var MutationObserver2 = getMutationObserver();
            if (MutationObserver2) {
              createDestroyObserver(MutationObserver2);
            }
            addEventListener(iframe, "load", iFrameLoaded);
            trigger("init", msg, iframe, undefined, true);
          }
          function checkOptions(options2) {
            if (typeof options2 !== "object") {
              throw new TypeError("Options is not an object");
            }
          }
          function copyOptions(options2) {
            for (var option in defaults) {
              if (Object.prototype.hasOwnProperty.call(defaults, option)) {
                settings[iframeId][option] = Object.prototype.hasOwnProperty.call(options2, option) ? options2[option] : defaults[option];
              }
            }
          }
          function getTargetOrigin(remoteHost) {
            return remoteHost === "" || remoteHost.match(/^(about:blank|javascript:|file:\/\/)/) !== null ? "*" : remoteHost;
          }
          function depricate(key) {
            var splitName = key.split("Callback");
            if (splitName.length === 2) {
              var name = "on" + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
              this[name] = this[key];
              delete this[key];
              warn2(iframeId, "Deprecated: '" + key + "' has been renamed '" + name + "'. The old method will be removed in the next major version.");
            }
          }
          function processOptions(options2) {
            options2 = options2 || {};
            settings[iframeId] = {
              firstRun: true,
              iframe,
              remoteHost: iframe.src && iframe.src.split("/").slice(0, 3).join("/")
            };
            checkOptions(options2);
            Object.keys(options2).forEach(depricate, options2);
            copyOptions(options2);
            if (settings[iframeId]) {
              settings[iframeId].targetOrigin = settings[iframeId].checkOrigin === true ? getTargetOrigin(settings[iframeId].remoteHost) : "*";
            }
          }
          function beenHere() {
            return iframeId in settings && "iFrameResizer" in iframe;
          }
          var iframeId = ensureHasId(iframe.id);
          if (!beenHere()) {
            processOptions(options);
            setScrolling();
            setLimits();
            setupBodyMarginValues();
            init(createOutgoingMsg(iframeId));
            setupIFrameObject();
          } else {
            warn2(iframeId, "Ignored iFrame, already setup.");
          }
        }
        function debouce(fn, time) {
          if (timer === null) {
            timer = setTimeout(function() {
              timer = null;
              fn();
            }, time);
          }
        }
        var frameTimer = {};
        function debounceFrameEvents(fn, time, frameId) {
          if (!frameTimer[frameId]) {
            frameTimer[frameId] = setTimeout(function() {
              frameTimer[frameId] = null;
              fn();
            }, time);
          }
        }
        function fixHiddenIFrames() {
          function checkIFrames() {
            function checkIFrame(settingId) {
              function chkDimension(dimension) {
                return (settings[settingId] && settings[settingId].iframe.style[dimension]) === "0px";
              }
              function isVisible(el) {
                return el.offsetParent !== null;
              }
              if (settings[settingId] && isVisible(settings[settingId].iframe) && (chkDimension("height") || chkDimension("width"))) {
                trigger("Visibility change", "resize", settings[settingId].iframe, settingId);
              }
            }
            Object.keys(settings).forEach(function(key) {
              checkIFrame(key);
            });
          }
          function mutationObserved(mutations) {
            log("window", "Mutation observed: " + mutations[0].target + " " + mutations[0].type);
            debouce(checkIFrames, 16);
          }
          function createMutationObserver() {
            var target = document.querySelector("body"), config = {
              attributes: true,
              attributeOldValue: false,
              characterData: true,
              characterDataOldValue: false,
              childList: true,
              subtree: true
            }, observer2 = new MutationObserver2(mutationObserved);
            observer2.observe(target, config);
          }
          var MutationObserver2 = getMutationObserver();
          if (MutationObserver2) {
            createMutationObserver();
          }
        }
        function resizeIFrames(event) {
          function resize() {
            sendTriggerMsg("Window " + event, "resize");
          }
          log("window", "Trigger event: " + event);
          debouce(resize, 16);
        }
        function tabVisible() {
          function resize() {
            sendTriggerMsg("Tab Visable", "resize");
          }
          if (document.visibilityState !== "hidden") {
            log("document", "Trigger event: Visiblity change");
            debouce(resize, 16);
          }
        }
        function sendTriggerMsg(eventName, event) {
          function isIFrameResizeEnabled(iframeId) {
            return settings[iframeId] && settings[iframeId].resizeFrom === "parent" && settings[iframeId].autoResize && !settings[iframeId].firstRun;
          }
          Object.keys(settings).forEach(function(iframeId) {
            if (isIFrameResizeEnabled(iframeId)) {
              trigger(eventName, event, settings[iframeId].iframe, iframeId);
            }
          });
        }
        function setupEventListeners() {
          addEventListener(window, "message", iFrameListener);
          addEventListener(window, "resize", function() {
            resizeIFrames("resize");
          });
          addEventListener(document, "visibilitychange", tabVisible);
          addEventListener(document, "-webkit-visibilitychange", tabVisible);
        }
        function factory() {
          function init(options, element) {
            function chkType() {
              if (!element.tagName) {
                throw new TypeError("Object is not a valid DOM element");
              } else if (element.tagName.toUpperCase() !== "IFRAME") {
                throw new TypeError("Expected <IFRAME> tag, found <" + element.tagName + ">");
              }
            }
            if (element) {
              chkType();
              setupIFrame(element, options);
              iFrames.push(element);
            }
          }
          function warnDeprecatedOptions(options) {
            if (options && options.enablePublicMethods) {
              warn2("enablePublicMethods option has been removed, public methods are now always available in the iFrame");
            }
          }
          var iFrames;
          setupRequestAnimationFrame();
          setupEventListeners();
          return function iFrameResizeF(options, target) {
            iFrames = [];
            warnDeprecatedOptions(options);
            switch (typeof target) {
              case "undefined":
              case "string":
                Array.prototype.forEach.call(document.querySelectorAll(target || "iframe"), init.bind(undefined, options));
                break;
              case "object":
                init(options, target);
                break;
              default:
                throw new TypeError("Unexpected data type (" + typeof target + ")");
            }
            return iFrames;
          };
        }
        function createJQueryPublicMethod($) {
          if (!$.fn) {
            info("", "Unable to bind to jQuery, it is not fully loaded.");
          } else if (!$.fn.iFrameResize) {
            $.fn.iFrameResize = function $iFrameResizeF(options) {
              function init(index, element) {
                setupIFrame(element, options);
              }
              return this.filter("iframe").each(init).end();
            };
          }
        }
        if (window.jQuery) {
          createJQueryPublicMethod(window.jQuery);
        }
        if (typeof define === "function" && define.amd) {
          define([], factory);
        } else if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = factory();
        }
        window.iFrameResize = window.iFrameResize || factory();
      })();
    }
  });

  // node_modules/iframe-resizer/js/iframeResizer.contentWindow.js
  var require_iframeResizer_contentWindow = __commonJS({
    "node_modules/iframe-resizer/js/iframeResizer.contentWindow.js"(exports, module) {
      (function(undefined) {
        if (typeof window === "undefined")
          return;
        var autoResize = true, base = 10, bodyBackground = "", bodyMargin = 0, bodyMarginStr = "", bodyObserver = null, bodyPadding = "", calculateWidth = false, doubleEventList = { resize: 1, click: 1 }, eventCancelTimer = 128, firstRun = true, height = 1, heightCalcModeDefault = "bodyOffset", heightCalcMode = heightCalcModeDefault, initLock = true, initMsg = "", inPageLinks = {}, interval = 32, intervalTimer = null, logging = false, msgID = "[iFrameSizer]", msgIdLen = msgID.length, myID = "", resetRequiredMethods = {
          max: 1,
          min: 1,
          bodyScroll: 1,
          documentElementScroll: 1
        }, resizeFrom = "child", sendPermit = true, target = window.parent, targetOriginDefault = "*", tolerance = 0, triggerLocked = false, triggerLockedTimer = null, throttledTimer = 16, width = 1, widthCalcModeDefault = "scroll", widthCalcMode = widthCalcModeDefault, win = window, onMessage = function() {
          warn2("onMessage function not defined");
        }, onReady = function() {
        }, onPageInfo = function() {
        }, customCalcMethods = {
          height: function() {
            warn2("Custom height calculation function not defined");
            return document.documentElement.offsetHeight;
          },
          width: function() {
            warn2("Custom width calculation function not defined");
            return document.body.scrollWidth;
          }
        }, eventHandlersByName = {}, passiveSupported = false;
        function noop() {
        }
        try {
          var options = Object.create({}, {
            passive: {
              get: function() {
                passiveSupported = true;
              }
            }
          });
          window.addEventListener("test", noop, options);
          window.removeEventListener("test", noop, options);
        } catch (error2) {
        }
        function addEventListener(el, evt, func, options2) {
          el.addEventListener(evt, func, passiveSupported ? options2 || {} : false);
        }
        function removeEventListener(el, evt, func) {
          el.removeEventListener(evt, func, false);
        }
        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }
        function throttle2(func) {
          var context, args, result, timeout = null, previous = 0, later = function() {
            previous = getNow();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) {
              context = args = null;
            }
          };
          return function() {
            var now = getNow();
            if (!previous) {
              previous = now;
            }
            var remaining = throttledTimer - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > throttledTimer) {
              if (timeout) {
                clearTimeout(timeout);
                timeout = null;
              }
              previous = now;
              result = func.apply(context, args);
              if (!timeout) {
                context = args = null;
              }
            } else if (!timeout) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
        }
        var getNow = Date.now || function() {
          return new Date().getTime();
        };
        function formatLogMsg(msg) {
          return msgID + "[" + myID + "] " + msg;
        }
        function log(msg) {
          if (logging && typeof window.console === "object") {
            console.log(formatLogMsg(msg));
          }
        }
        function warn2(msg) {
          if (typeof window.console === "object") {
            console.warn(formatLogMsg(msg));
          }
        }
        function init() {
          readDataFromParent();
          log("Initialising iFrame (" + window.location.href + ")");
          readDataFromPage();
          setMargin();
          setBodyStyle("background", bodyBackground);
          setBodyStyle("padding", bodyPadding);
          injectClearFixIntoBodyElement();
          checkHeightMode();
          checkWidthMode();
          stopInfiniteResizingOfIFrame();
          setupPublicMethods();
          startEventListeners();
          inPageLinks = setupInPageLinks();
          sendSize("init", "Init message from host page");
          onReady();
        }
        function readDataFromParent() {
          function strBool(str) {
            return str === "true";
          }
          var data2 = initMsg.substr(msgIdLen).split(":");
          myID = data2[0];
          bodyMargin = undefined !== data2[1] ? Number(data2[1]) : bodyMargin;
          calculateWidth = undefined !== data2[2] ? strBool(data2[2]) : calculateWidth;
          logging = undefined !== data2[3] ? strBool(data2[3]) : logging;
          interval = undefined !== data2[4] ? Number(data2[4]) : interval;
          autoResize = undefined !== data2[6] ? strBool(data2[6]) : autoResize;
          bodyMarginStr = data2[7];
          heightCalcMode = undefined !== data2[8] ? data2[8] : heightCalcMode;
          bodyBackground = data2[9];
          bodyPadding = data2[10];
          tolerance = undefined !== data2[11] ? Number(data2[11]) : tolerance;
          inPageLinks.enable = undefined !== data2[12] ? strBool(data2[12]) : false;
          resizeFrom = undefined !== data2[13] ? data2[13] : resizeFrom;
          widthCalcMode = undefined !== data2[14] ? data2[14] : widthCalcMode;
        }
        function depricate(key) {
          var splitName = key.split("Callback");
          if (splitName.length === 2) {
            var name = "on" + splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
            this[name] = this[key];
            delete this[key];
            warn2("Deprecated: '" + key + "' has been renamed '" + name + "'. The old method will be removed in the next major version.");
          }
        }
        function readDataFromPage() {
          function readData() {
            var data2 = window.iFrameResizer;
            log("Reading data from page: " + JSON.stringify(data2));
            Object.keys(data2).forEach(depricate, data2);
            onMessage = "onMessage" in data2 ? data2.onMessage : onMessage;
            onReady = "onReady" in data2 ? data2.onReady : onReady;
            targetOriginDefault = "targetOrigin" in data2 ? data2.targetOrigin : targetOriginDefault;
            heightCalcMode = "heightCalculationMethod" in data2 ? data2.heightCalculationMethod : heightCalcMode;
            widthCalcMode = "widthCalculationMethod" in data2 ? data2.widthCalculationMethod : widthCalcMode;
          }
          function setupCustomCalcMethods(calcMode, calcFunc) {
            if (typeof calcMode === "function") {
              log("Setup custom " + calcFunc + "CalcMethod");
              customCalcMethods[calcFunc] = calcMode;
              calcMode = "custom";
            }
            return calcMode;
          }
          if ("iFrameResizer" in window && Object === window.iFrameResizer.constructor) {
            readData();
            heightCalcMode = setupCustomCalcMethods(heightCalcMode, "height");
            widthCalcMode = setupCustomCalcMethods(widthCalcMode, "width");
          }
          log("TargetOrigin for parent set to: " + targetOriginDefault);
        }
        function chkCSS(attr, value) {
          if (value.indexOf("-") !== -1) {
            warn2("Negative CSS value ignored for " + attr);
            value = "";
          }
          return value;
        }
        function setBodyStyle(attr, value) {
          if (undefined !== value && value !== "" && value !== "null") {
            document.body.style[attr] = value;
            log("Body " + attr + ' set to "' + value + '"');
          }
        }
        function setMargin() {
          if (undefined === bodyMarginStr) {
            bodyMarginStr = bodyMargin + "px";
          }
          setBodyStyle("margin", chkCSS("margin", bodyMarginStr));
        }
        function stopInfiniteResizingOfIFrame() {
          document.documentElement.style.height = "";
          document.body.style.height = "";
          log('HTML & body height set to "auto"');
        }
        function manageTriggerEvent(options2) {
          var listener = {
            add: function(eventName) {
              function handleEvent() {
                sendSize(options2.eventName, options2.eventType);
              }
              eventHandlersByName[eventName] = handleEvent;
              addEventListener(window, eventName, handleEvent, { passive: true });
            },
            remove: function(eventName) {
              var handleEvent = eventHandlersByName[eventName];
              delete eventHandlersByName[eventName];
              removeEventListener(window, eventName, handleEvent);
            }
          };
          if (options2.eventNames && Array.prototype.map) {
            options2.eventName = options2.eventNames[0];
            options2.eventNames.map(listener[options2.method]);
          } else {
            listener[options2.method](options2.eventName);
          }
          log(capitalizeFirstLetter(options2.method) + " event listener: " + options2.eventType);
        }
        function manageEventListeners(method) {
          manageTriggerEvent({
            method,
            eventType: "Animation Start",
            eventNames: ["animationstart", "webkitAnimationStart"]
          });
          manageTriggerEvent({
            method,
            eventType: "Animation Iteration",
            eventNames: ["animationiteration", "webkitAnimationIteration"]
          });
          manageTriggerEvent({
            method,
            eventType: "Animation End",
            eventNames: ["animationend", "webkitAnimationEnd"]
          });
          manageTriggerEvent({
            method,
            eventType: "Input",
            eventName: "input"
          });
          manageTriggerEvent({
            method,
            eventType: "Mouse Up",
            eventName: "mouseup"
          });
          manageTriggerEvent({
            method,
            eventType: "Mouse Down",
            eventName: "mousedown"
          });
          manageTriggerEvent({
            method,
            eventType: "Orientation Change",
            eventName: "orientationchange"
          });
          manageTriggerEvent({
            method,
            eventType: "Print",
            eventName: ["afterprint", "beforeprint"]
          });
          manageTriggerEvent({
            method,
            eventType: "Ready State Change",
            eventName: "readystatechange"
          });
          manageTriggerEvent({
            method,
            eventType: "Touch Start",
            eventName: "touchstart"
          });
          manageTriggerEvent({
            method,
            eventType: "Touch End",
            eventName: "touchend"
          });
          manageTriggerEvent({
            method,
            eventType: "Touch Cancel",
            eventName: "touchcancel"
          });
          manageTriggerEvent({
            method,
            eventType: "Transition Start",
            eventNames: [
              "transitionstart",
              "webkitTransitionStart",
              "MSTransitionStart",
              "oTransitionStart",
              "otransitionstart"
            ]
          });
          manageTriggerEvent({
            method,
            eventType: "Transition Iteration",
            eventNames: [
              "transitioniteration",
              "webkitTransitionIteration",
              "MSTransitionIteration",
              "oTransitionIteration",
              "otransitioniteration"
            ]
          });
          manageTriggerEvent({
            method,
            eventType: "Transition End",
            eventNames: [
              "transitionend",
              "webkitTransitionEnd",
              "MSTransitionEnd",
              "oTransitionEnd",
              "otransitionend"
            ]
          });
          if (resizeFrom === "child") {
            manageTriggerEvent({
              method,
              eventType: "IFrame Resized",
              eventName: "resize"
            });
          }
        }
        function checkCalcMode(calcMode, calcModeDefault, modes, type) {
          if (calcModeDefault !== calcMode) {
            if (!(calcMode in modes)) {
              warn2(calcMode + " is not a valid option for " + type + "CalculationMethod.");
              calcMode = calcModeDefault;
            }
            log(type + ' calculation method set to "' + calcMode + '"');
          }
          return calcMode;
        }
        function checkHeightMode() {
          heightCalcMode = checkCalcMode(heightCalcMode, heightCalcModeDefault, getHeight, "height");
        }
        function checkWidthMode() {
          widthCalcMode = checkCalcMode(widthCalcMode, widthCalcModeDefault, getWidth, "width");
        }
        function startEventListeners() {
          if (autoResize === true) {
            manageEventListeners("add");
            setupMutationObserver();
          } else {
            log("Auto Resize disabled");
          }
        }
        function disconnectMutationObserver() {
          if (bodyObserver !== null) {
            bodyObserver.disconnect();
          }
        }
        function stopEventListeners() {
          manageEventListeners("remove");
          disconnectMutationObserver();
          clearInterval(intervalTimer);
        }
        function injectClearFixIntoBodyElement() {
          var clearFix = document.createElement("div");
          clearFix.style.clear = "both";
          clearFix.style.display = "block";
          clearFix.style.height = "0";
          document.body.appendChild(clearFix);
        }
        function setupInPageLinks() {
          function getPagePosition() {
            return {
              x: window.pageXOffset !== undefined ? window.pageXOffset : document.documentElement.scrollLeft,
              y: window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop
            };
          }
          function getElementPosition(el) {
            var elPosition = el.getBoundingClientRect(), pagePosition = getPagePosition();
            return {
              x: parseInt(elPosition.left, 10) + parseInt(pagePosition.x, 10),
              y: parseInt(elPosition.top, 10) + parseInt(pagePosition.y, 10)
            };
          }
          function findTarget(location) {
            function jumpToTarget(target3) {
              var jumpPosition = getElementPosition(target3);
              log("Moving to in page link (#" + hash + ") at x: " + jumpPosition.x + " y: " + jumpPosition.y);
              sendMsg(jumpPosition.y, jumpPosition.x, "scrollToOffset");
            }
            var hash = location.split("#")[1] || location, hashData = decodeURIComponent(hash), target2 = document.getElementById(hashData) || document.getElementsByName(hashData)[0];
            if (undefined !== target2) {
              jumpToTarget(target2);
            } else {
              log("In page link (#" + hash + ") not found in iFrame, so sending to parent");
              sendMsg(0, 0, "inPageLink", "#" + hash);
            }
          }
          function checkLocationHash() {
            var hash = window.location.hash;
            var href = window.location.href;
            if (hash !== "" && hash !== "#") {
              findTarget(href);
            }
          }
          function bindAnchors() {
            function setupLink(el) {
              function linkClicked(e) {
                e.preventDefault();
                findTarget(this.getAttribute("href"));
              }
              if (el.getAttribute("href") !== "#") {
                addEventListener(el, "click", linkClicked);
              }
            }
            Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), setupLink);
          }
          function bindLocationHash() {
            addEventListener(window, "hashchange", checkLocationHash);
          }
          function initCheck() {
            setTimeout(checkLocationHash, eventCancelTimer);
          }
          function enableInPageLinks() {
            if (Array.prototype.forEach && document.querySelectorAll) {
              log("Setting up location.hash handlers");
              bindAnchors();
              bindLocationHash();
              initCheck();
            } else {
              warn2("In page linking not fully supported in this browser! (See README.md for IE8 workaround)");
            }
          }
          if (inPageLinks.enable) {
            enableInPageLinks();
          } else {
            log("In page linking not enabled");
          }
          return {
            findTarget
          };
        }
        function setupPublicMethods() {
          log("Enable public methods");
          win.parentIFrame = {
            autoResize: function autoResizeF(resize) {
              if (resize === true && autoResize === false) {
                autoResize = true;
                startEventListeners();
              } else if (resize === false && autoResize === true) {
                autoResize = false;
                stopEventListeners();
              }
              sendMsg(0, 0, "autoResize", JSON.stringify(autoResize));
              return autoResize;
            },
            close: function closeF() {
              sendMsg(0, 0, "close");
            },
            getId: function getIdF() {
              return myID;
            },
            getPageInfo: function getPageInfoF(callback) {
              if (typeof callback === "function") {
                onPageInfo = callback;
                sendMsg(0, 0, "pageInfo");
              } else {
                onPageInfo = function() {
                };
                sendMsg(0, 0, "pageInfoStop");
              }
            },
            moveToAnchor: function moveToAnchorF(hash) {
              inPageLinks.findTarget(hash);
            },
            reset: function resetF() {
              resetIFrame("parentIFrame.reset");
            },
            scrollTo: function scrollToF(x, y) {
              sendMsg(y, x, "scrollTo");
            },
            scrollToOffset: function scrollToF(x, y) {
              sendMsg(y, x, "scrollToOffset");
            },
            sendMessage: function sendMessageF(msg, targetOrigin) {
              sendMsg(0, 0, "message", JSON.stringify(msg), targetOrigin);
            },
            setHeightCalculationMethod: function setHeightCalculationMethodF(heightCalculationMethod) {
              heightCalcMode = heightCalculationMethod;
              checkHeightMode();
            },
            setWidthCalculationMethod: function setWidthCalculationMethodF(widthCalculationMethod) {
              widthCalcMode = widthCalculationMethod;
              checkWidthMode();
            },
            setTargetOrigin: function setTargetOriginF(targetOrigin) {
              log("Set targetOrigin: " + targetOrigin);
              targetOriginDefault = targetOrigin;
            },
            size: function sizeF(customHeight, customWidth) {
              var valString = "" + (customHeight || "") + (customWidth ? "," + customWidth : "");
              sendSize("size", "parentIFrame.size(" + valString + ")", customHeight, customWidth);
            }
          };
        }
        function initInterval() {
          if (interval !== 0) {
            log("setInterval: " + interval + "ms");
            intervalTimer = setInterval(function() {
              sendSize("interval", "setInterval: " + interval);
            }, Math.abs(interval));
          }
        }
        function setupBodyMutationObserver() {
          function addImageLoadListners(mutation) {
            function addImageLoadListener(element) {
              if (element.complete === false) {
                log("Attach listeners to " + element.src);
                element.addEventListener("load", imageLoaded, false);
                element.addEventListener("error", imageError, false);
                elements.push(element);
              }
            }
            if (mutation.type === "attributes" && mutation.attributeName === "src") {
              addImageLoadListener(mutation.target);
            } else if (mutation.type === "childList") {
              Array.prototype.forEach.call(mutation.target.querySelectorAll("img"), addImageLoadListener);
            }
          }
          function removeFromArray(element) {
            elements.splice(elements.indexOf(element), 1);
          }
          function removeImageLoadListener(element) {
            log("Remove listeners from " + element.src);
            element.removeEventListener("load", imageLoaded, false);
            element.removeEventListener("error", imageError, false);
            removeFromArray(element);
          }
          function imageEventTriggered(event, type, typeDesc) {
            removeImageLoadListener(event.target);
            sendSize(type, typeDesc + ": " + event.target.src);
          }
          function imageLoaded(event) {
            imageEventTriggered(event, "imageLoad", "Image loaded");
          }
          function imageError(event) {
            imageEventTriggered(event, "imageLoadFailed", "Image load failed");
          }
          function mutationObserved(mutations) {
            sendSize("mutationObserver", "mutationObserver: " + mutations[0].target + " " + mutations[0].type);
            mutations.forEach(addImageLoadListners);
          }
          function createMutationObserver() {
            var target2 = document.querySelector("body"), config = {
              attributes: true,
              attributeOldValue: false,
              characterData: true,
              characterDataOldValue: false,
              childList: true,
              subtree: true
            };
            observer2 = new MutationObserver2(mutationObserved);
            log("Create body MutationObserver");
            observer2.observe(target2, config);
            return observer2;
          }
          var elements = [], MutationObserver2 = window.MutationObserver || window.WebKitMutationObserver, observer2 = createMutationObserver();
          return {
            disconnect: function() {
              if ("disconnect" in observer2) {
                log("Disconnect body MutationObserver");
                observer2.disconnect();
                elements.forEach(removeImageLoadListener);
              }
            }
          };
        }
        function setupMutationObserver() {
          var forceIntervalTimer = 0 > interval;
          if (window.MutationObserver || window.WebKitMutationObserver) {
            if (forceIntervalTimer) {
              initInterval();
            } else {
              bodyObserver = setupBodyMutationObserver();
            }
          } else {
            log("MutationObserver not supported in this browser!");
            initInterval();
          }
        }
        function getComputedStyle2(prop, el) {
          var retVal = 0;
          el = el || document.body;
          retVal = document.defaultView.getComputedStyle(el, null);
          retVal = retVal !== null ? retVal[prop] : 0;
          return parseInt(retVal, base);
        }
        function chkEventThottle(timer) {
          if (timer > throttledTimer / 2) {
            throttledTimer = 2 * timer;
            log("Event throttle increased to " + throttledTimer + "ms");
          }
        }
        function getMaxElement(side, elements) {
          var elementsLength = elements.length, elVal = 0, maxVal = 0, Side = capitalizeFirstLetter(side), timer = getNow();
          for (var i = 0; i < elementsLength; i++) {
            elVal = elements[i].getBoundingClientRect()[side] + getComputedStyle2("margin" + Side, elements[i]);
            if (elVal > maxVal) {
              maxVal = elVal;
            }
          }
          timer = getNow() - timer;
          log("Parsed " + elementsLength + " HTML elements");
          log("Element position calculated in " + timer + "ms");
          chkEventThottle(timer);
          return maxVal;
        }
        function getAllMeasurements(dimensions) {
          return [
            dimensions.bodyOffset(),
            dimensions.bodyScroll(),
            dimensions.documentElementOffset(),
            dimensions.documentElementScroll()
          ];
        }
        function getTaggedElements(side, tag) {
          function noTaggedElementsFound() {
            warn2("No tagged elements (" + tag + ") found on page");
            return document.querySelectorAll("body *");
          }
          var elements = document.querySelectorAll("[" + tag + "]");
          if (elements.length === 0)
            noTaggedElementsFound();
          return getMaxElement(side, elements);
        }
        function getAllElements() {
          return document.querySelectorAll("body *");
        }
        var getHeight = {
          bodyOffset: function getBodyOffsetHeight() {
            return document.body.offsetHeight + getComputedStyle2("marginTop") + getComputedStyle2("marginBottom");
          },
          offset: function() {
            return getHeight.bodyOffset();
          },
          bodyScroll: function getBodyScrollHeight() {
            return document.body.scrollHeight;
          },
          custom: function getCustomWidth() {
            return customCalcMethods.height();
          },
          documentElementOffset: function getDEOffsetHeight() {
            return document.documentElement.offsetHeight;
          },
          documentElementScroll: function getDEScrollHeight() {
            return document.documentElement.scrollHeight;
          },
          max: function getMaxHeight() {
            return Math.max.apply(null, getAllMeasurements(getHeight));
          },
          min: function getMinHeight() {
            return Math.min.apply(null, getAllMeasurements(getHeight));
          },
          grow: function growHeight() {
            return getHeight.max();
          },
          lowestElement: function getBestHeight() {
            return Math.max(getHeight.bodyOffset() || getHeight.documentElementOffset(), getMaxElement("bottom", getAllElements()));
          },
          taggedElement: function getTaggedElementsHeight() {
            return getTaggedElements("bottom", "data-iframe-height");
          }
        }, getWidth = {
          bodyScroll: function getBodyScrollWidth() {
            return document.body.scrollWidth;
          },
          bodyOffset: function getBodyOffsetWidth() {
            return document.body.offsetWidth;
          },
          custom: function getCustomWidth() {
            return customCalcMethods.width();
          },
          documentElementScroll: function getDEScrollWidth() {
            return document.documentElement.scrollWidth;
          },
          documentElementOffset: function getDEOffsetWidth() {
            return document.documentElement.offsetWidth;
          },
          scroll: function getMaxWidth() {
            return Math.max(getWidth.bodyScroll(), getWidth.documentElementScroll());
          },
          max: function getMaxWidth() {
            return Math.max.apply(null, getAllMeasurements(getWidth));
          },
          min: function getMinWidth() {
            return Math.min.apply(null, getAllMeasurements(getWidth));
          },
          rightMostElement: function rightMostElement() {
            return getMaxElement("right", getAllElements());
          },
          taggedElement: function getTaggedElementsWidth() {
            return getTaggedElements("right", "data-iframe-width");
          }
        };
        function sizeIFrame(triggerEvent, triggerEventDesc, customHeight, customWidth) {
          function resizeIFrame() {
            height = currentHeight;
            width = currentWidth;
            sendMsg(height, width, triggerEvent);
          }
          function isSizeChangeDetected() {
            function checkTolarance(a, b) {
              var retVal = Math.abs(a - b) <= tolerance;
              return !retVal;
            }
            currentHeight = undefined !== customHeight ? customHeight : getHeight[heightCalcMode]();
            currentWidth = undefined !== customWidth ? customWidth : getWidth[widthCalcMode]();
            return checkTolarance(height, currentHeight) || calculateWidth && checkTolarance(width, currentWidth);
          }
          function isForceResizableEvent() {
            return !(triggerEvent in { init: 1, interval: 1, size: 1 });
          }
          function isForceResizableCalcMode() {
            return heightCalcMode in resetRequiredMethods || calculateWidth && widthCalcMode in resetRequiredMethods;
          }
          function logIgnored() {
            log("No change in size detected");
          }
          function checkDownSizing() {
            if (isForceResizableEvent() && isForceResizableCalcMode()) {
              resetIFrame(triggerEventDesc);
            } else if (!(triggerEvent in { interval: 1 })) {
              logIgnored();
            }
          }
          var currentHeight, currentWidth;
          if (isSizeChangeDetected() || triggerEvent === "init") {
            lockTrigger();
            resizeIFrame();
          } else {
            checkDownSizing();
          }
        }
        var sizeIFrameThrottled = throttle2(sizeIFrame);
        function sendSize(triggerEvent, triggerEventDesc, customHeight, customWidth) {
          function recordTrigger() {
            if (!(triggerEvent in { reset: 1, resetPage: 1, init: 1 })) {
              log("Trigger event: " + triggerEventDesc);
            }
          }
          function isDoubleFiredEvent() {
            return triggerLocked && triggerEvent in doubleEventList;
          }
          if (!isDoubleFiredEvent()) {
            recordTrigger();
            if (triggerEvent === "init") {
              sizeIFrame(triggerEvent, triggerEventDesc, customHeight, customWidth);
            } else {
              sizeIFrameThrottled(triggerEvent, triggerEventDesc, customHeight, customWidth);
            }
          } else {
            log("Trigger event cancelled: " + triggerEvent);
          }
        }
        function lockTrigger() {
          if (!triggerLocked) {
            triggerLocked = true;
            log("Trigger event lock on");
          }
          clearTimeout(triggerLockedTimer);
          triggerLockedTimer = setTimeout(function() {
            triggerLocked = false;
            log("Trigger event lock off");
            log("--");
          }, eventCancelTimer);
        }
        function triggerReset(triggerEvent) {
          height = getHeight[heightCalcMode]();
          width = getWidth[widthCalcMode]();
          sendMsg(height, width, triggerEvent);
        }
        function resetIFrame(triggerEventDesc) {
          var hcm = heightCalcMode;
          heightCalcMode = heightCalcModeDefault;
          log("Reset trigger event: " + triggerEventDesc);
          lockTrigger();
          triggerReset("reset");
          heightCalcMode = hcm;
        }
        function sendMsg(height2, width2, triggerEvent, msg, targetOrigin) {
          function setTargetOrigin() {
            if (undefined === targetOrigin) {
              targetOrigin = targetOriginDefault;
            } else {
              log("Message targetOrigin: " + targetOrigin);
            }
          }
          function sendToParent() {
            var size = height2 + ":" + width2, message = myID + ":" + size + ":" + triggerEvent + (undefined !== msg ? ":" + msg : "");
            log("Sending message to host page (" + message + ")");
            target.postMessage(msgID + message, targetOrigin);
          }
          if (sendPermit === true) {
            setTargetOrigin();
            sendToParent();
          }
        }
        function receiver(event) {
          var processRequestFromParent = {
            init: function initFromParent() {
              initMsg = event.data;
              target = event.source;
              init();
              firstRun = false;
              setTimeout(function() {
                initLock = false;
              }, eventCancelTimer);
            },
            reset: function resetFromParent() {
              if (!initLock) {
                log("Page size reset by host page");
                triggerReset("resetPage");
              } else {
                log("Page reset ignored by init");
              }
            },
            resize: function resizeFromParent() {
              sendSize("resizeParent", "Parent window requested size check");
            },
            moveToAnchor: function moveToAnchorF() {
              inPageLinks.findTarget(getData());
            },
            inPageLink: function inPageLinkF() {
              this.moveToAnchor();
            },
            pageInfo: function pageInfoFromParent() {
              var msgBody = getData();
              log("PageInfoFromParent called from parent: " + msgBody);
              onPageInfo(JSON.parse(msgBody));
              log(" --");
            },
            message: function messageFromParent() {
              var msgBody = getData();
              log("onMessage called from parent: " + msgBody);
              onMessage(JSON.parse(msgBody));
              log(" --");
            }
          };
          function isMessageForUs() {
            return msgID === ("" + event.data).substr(0, msgIdLen);
          }
          function getMessageType() {
            return event.data.split("]")[1].split(":")[0];
          }
          function getData() {
            return event.data.substr(event.data.indexOf(":") + 1);
          }
          function isMiddleTier() {
            return !(typeof module !== "undefined" && module.exports) && "iFrameResize" in window || "jQuery" in window && "iFrameResize" in window.jQuery.prototype;
          }
          function isInitMsg() {
            return event.data.split(":")[2] in { true: 1, false: 1 };
          }
          function callFromParent() {
            var messageType = getMessageType();
            if (messageType in processRequestFromParent) {
              processRequestFromParent[messageType]();
            } else if (!isMiddleTier() && !isInitMsg()) {
              warn2("Unexpected message (" + event.data + ")");
            }
          }
          function processMessage() {
            if (firstRun === false) {
              callFromParent();
            } else if (isInitMsg()) {
              processRequestFromParent.init();
            } else {
              log('Ignored message of type "' + getMessageType() + '". Received before initialization.');
            }
          }
          if (isMessageForUs()) {
            processMessage();
          }
        }
        function chkLateLoaded() {
          if (document.readyState !== "loading") {
            window.parent.postMessage("[iFrameResizerChild]Ready", "*");
          }
        }
        function mouse(e) {
          sendMsg(e.screenY, e.screenX, e.type);
        }
        addEventListener(window, "message", receiver);
        addEventListener(window, "readystatechange", chkLateLoaded);
        addEventListener(window.document, "mouseenter", mouse);
        addEventListener(window.document, "mouseleave", mouse);
        chkLateLoaded();
      })();
    }
  });

  // node_modules/iframe-resizer/js/index.js
  var require_js = __commonJS({
    "node_modules/iframe-resizer/js/index.js"(exports) {
      var iframeResize = require_iframeResizer();
      exports.iframeResize = iframeResize;
      exports.iframeResizer = iframeResize;
      exports.iframeResizerContentWindow = require_iframeResizer_contentWindow();
    }
  });

  // node_modules/iframe-resizer/index.js
  var require_iframe_resizer = __commonJS({
    "node_modules/iframe-resizer/index.js"(exports, module) {
      module.exports = require_js();
    }
  });

  // node_modules/interactjs/dist/interact.min.js
  var require_interact_min = __commonJS({
    "node_modules/interactjs/dist/interact.min.js"(exports, module) {
      !function(t) {
        typeof exports == "object" && typeof module != "undefined" ? module.exports = t() : typeof define == "function" && define.amd ? define([], t) : (typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this).interact = t();
      }(function() {
        var t = {};
        Object.defineProperty(t, "__esModule", { value: true }), t.default = void 0, t.default = function(t2) {
          return !(!t2 || !t2.Window) && t2 instanceof t2.Window;
        };
        var e = {};
        Object.defineProperty(e, "__esModule", { value: true }), e.init = i, e.getWindow = function(e2) {
          return (0, t.default)(e2) ? e2 : (e2.ownerDocument || e2).defaultView || r.window;
        }, e.window = e.realWindow = void 0;
        var n = void 0;
        e.realWindow = n;
        var r = void 0;
        function i(t2) {
          e.realWindow = n = t2;
          var i2 = t2.document.createTextNode("");
          i2.ownerDocument !== t2.document && typeof t2.wrap == "function" && t2.wrap(i2) === i2 && (t2 = t2.wrap(t2)), e.window = r = t2;
        }
        e.window = r, typeof window != "undefined" && window && i(window);
        var o = {};
        Object.defineProperty(o, "__esModule", { value: true }), o.default = void 0;
        var a = function(t2) {
          return !!t2 && typeof t2 == "object";
        }, s = function(t2) {
          return typeof t2 == "function";
        }, l = { window: function(n2) {
          return n2 === e.window || (0, t.default)(n2);
        }, docFrag: function(t2) {
          return a(t2) && t2.nodeType === 11;
        }, object: a, func: s, number: function(t2) {
          return typeof t2 == "number";
        }, bool: function(t2) {
          return typeof t2 == "boolean";
        }, string: function(t2) {
          return typeof t2 == "string";
        }, element: function(t2) {
          if (!t2 || typeof t2 != "object")
            return false;
          var n2 = e.getWindow(t2) || e.window;
          return /object|function/.test(typeof n2.Element) ? t2 instanceof n2.Element : t2.nodeType === 1 && typeof t2.nodeName == "string";
        }, plainObject: function(t2) {
          return a(t2) && !!t2.constructor && /function Object\b/.test(t2.constructor.toString());
        }, array: function(t2) {
          return a(t2) && t2.length !== void 0 && s(t2.splice);
        } };
        o.default = l;
        var c = {};
        function u(t2) {
          var e2 = t2.interaction;
          if (e2.prepared.name === "drag") {
            var n2 = e2.prepared.axis;
            n2 === "x" ? (e2.coords.cur.page.y = e2.coords.start.page.y, e2.coords.cur.client.y = e2.coords.start.client.y, e2.coords.velocity.client.y = 0, e2.coords.velocity.page.y = 0) : n2 === "y" && (e2.coords.cur.page.x = e2.coords.start.page.x, e2.coords.cur.client.x = e2.coords.start.client.x, e2.coords.velocity.client.x = 0, e2.coords.velocity.page.x = 0);
          }
        }
        function d(t2) {
          var e2 = t2.iEvent, n2 = t2.interaction;
          if (n2.prepared.name === "drag") {
            var r2 = n2.prepared.axis;
            if (r2 === "x" || r2 === "y") {
              var i2 = r2 === "x" ? "y" : "x";
              e2.page[i2] = n2.coords.start.page[i2], e2.client[i2] = n2.coords.start.client[i2], e2.delta[i2] = 0;
            }
          }
        }
        Object.defineProperty(c, "__esModule", { value: true }), c.default = void 0;
        var f = { id: "actions/drag", install: function(t2) {
          var e2 = t2.actions, n2 = t2.Interactable, r2 = t2.defaults;
          n2.prototype.draggable = f.draggable, e2.map.drag = f, e2.methodDict.drag = "draggable", r2.actions.drag = f.defaults;
        }, listeners: { "interactions:before-action-move": u, "interactions:action-resume": u, "interactions:action-move": d, "auto-start:check": function(t2) {
          var e2 = t2.interaction, n2 = t2.interactable, r2 = t2.buttons, i2 = n2.options.drag;
          if (i2 && i2.enabled && (!e2.pointerIsDown || !/mouse|pointer/.test(e2.pointerType) || (r2 & n2.options.drag.mouseButtons) != 0))
            return t2.action = { name: "drag", axis: i2.lockAxis === "start" ? i2.startAxis : i2.lockAxis }, false;
        } }, draggable: function(t2) {
          return o.default.object(t2) ? (this.options.drag.enabled = t2.enabled !== false, this.setPerAction("drag", t2), this.setOnEvents("drag", t2), /^(xy|x|y|start)$/.test(t2.lockAxis) && (this.options.drag.lockAxis = t2.lockAxis), /^(xy|x|y)$/.test(t2.startAxis) && (this.options.drag.startAxis = t2.startAxis), this) : o.default.bool(t2) ? (this.options.drag.enabled = t2, this) : this.options.drag;
        }, beforeMove: u, move: d, defaults: { startAxis: "xy", lockAxis: "xy" }, getCursor: function() {
          return "move";
        } }, p = f;
        c.default = p;
        var v = {};
        Object.defineProperty(v, "__esModule", { value: true }), v.default = void 0;
        var h = { init: function(t2) {
          var e2 = t2;
          h.document = e2.document, h.DocumentFragment = e2.DocumentFragment || g, h.SVGElement = e2.SVGElement || g, h.SVGSVGElement = e2.SVGSVGElement || g, h.SVGElementInstance = e2.SVGElementInstance || g, h.Element = e2.Element || g, h.HTMLElement = e2.HTMLElement || h.Element, h.Event = e2.Event, h.Touch = e2.Touch || g, h.PointerEvent = e2.PointerEvent || e2.MSPointerEvent;
        }, document: null, DocumentFragment: null, SVGElement: null, SVGSVGElement: null, SVGElementInstance: null, Element: null, HTMLElement: null, Event: null, Touch: null, PointerEvent: null };
        function g() {
        }
        var m = h;
        v.default = m;
        var y = {};
        Object.defineProperty(y, "__esModule", { value: true }), y.default = void 0;
        var b = { init: function(t2) {
          var n2 = v.default.Element, r2 = e.window.navigator;
          b.supportsTouch = "ontouchstart" in t2 || o.default.func(t2.DocumentTouch) && v.default.document instanceof t2.DocumentTouch, b.supportsPointerEvent = r2.pointerEnabled !== false && !!v.default.PointerEvent, b.isIOS = /iP(hone|od|ad)/.test(r2.platform), b.isIOS7 = /iP(hone|od|ad)/.test(r2.platform) && /OS 7[^\d]/.test(r2.appVersion), b.isIe9 = /MSIE 9/.test(r2.userAgent), b.isOperaMobile = r2.appName === "Opera" && b.supportsTouch && /Presto/.test(r2.userAgent), b.prefixedMatchesSelector = "matches" in n2.prototype ? "matches" : "webkitMatchesSelector" in n2.prototype ? "webkitMatchesSelector" : "mozMatchesSelector" in n2.prototype ? "mozMatchesSelector" : "oMatchesSelector" in n2.prototype ? "oMatchesSelector" : "msMatchesSelector", b.pEventTypes = b.supportsPointerEvent ? v.default.PointerEvent === t2.MSPointerEvent ? { up: "MSPointerUp", down: "MSPointerDown", over: "mouseover", out: "mouseout", move: "MSPointerMove", cancel: "MSPointerCancel" } : { up: "pointerup", down: "pointerdown", over: "pointerover", out: "pointerout", move: "pointermove", cancel: "pointercancel" } : null, b.wheelEvent = "onmousewheel" in v.default.document ? "mousewheel" : "wheel";
        }, supportsTouch: null, supportsPointerEvent: null, isIOS7: null, isIOS: null, isIe9: null, isOperaMobile: null, prefixedMatchesSelector: null, pEventTypes: null, wheelEvent: null }, x = b;
        y.default = x;
        var _ = {};
        function w(t2) {
          var e2 = t2.parentNode;
          if (o.default.docFrag(e2)) {
            for (; (e2 = e2.host) && o.default.docFrag(e2); )
              ;
            return e2;
          }
          return e2;
        }
        function P(t2, n2) {
          return e.window !== e.realWindow && (n2 = n2.replace(/\/deep\//g, " ")), t2[y.default.prefixedMatchesSelector](n2);
        }
        Object.defineProperty(_, "__esModule", { value: true }), _.nodeContains = function(t2, e2) {
          if (t2.contains)
            return t2.contains(e2);
          for (; e2; ) {
            if (e2 === t2)
              return true;
            e2 = e2.parentNode;
          }
          return false;
        }, _.closest = function(t2, e2) {
          for (; o.default.element(t2); ) {
            if (P(t2, e2))
              return t2;
            t2 = w(t2);
          }
          return null;
        }, _.parentNode = w, _.matchesSelector = P, _.indexOfDeepestElement = function(t2) {
          for (var n2, r2 = [], i2 = 0; i2 < t2.length; i2++) {
            var o2 = t2[i2], a2 = t2[n2];
            if (o2 && i2 !== n2)
              if (a2) {
                var s2 = E(o2), l2 = E(a2);
                if (s2 !== o2.ownerDocument)
                  if (l2 !== o2.ownerDocument)
                    if (s2 !== l2) {
                      r2 = r2.length ? r2 : S(a2);
                      var c2 = void 0;
                      if (a2 instanceof v.default.HTMLElement && o2 instanceof v.default.SVGElement && !(o2 instanceof v.default.SVGSVGElement)) {
                        if (o2 === l2)
                          continue;
                        c2 = o2.ownerSVGElement;
                      } else
                        c2 = o2;
                      for (var u2 = S(c2, a2.ownerDocument), d2 = 0; u2[d2] && u2[d2] === r2[d2]; )
                        d2++;
                      for (var f2 = [u2[d2 - 1], u2[d2], r2[d2]], p2 = f2[0].lastChild; p2; ) {
                        if (p2 === f2[1]) {
                          n2 = i2, r2 = u2;
                          break;
                        }
                        if (p2 === f2[2])
                          break;
                        p2 = p2.previousSibling;
                      }
                    } else
                      h2 = o2, g2 = a2, void 0, void 0, (parseInt(e.getWindow(h2).getComputedStyle(h2).zIndex, 10) || 0) >= (parseInt(e.getWindow(g2).getComputedStyle(g2).zIndex, 10) || 0) && (n2 = i2);
                  else
                    n2 = i2;
              } else
                n2 = i2;
          }
          var h2, g2;
          return n2;
        }, _.matchesUpTo = function(t2, e2, n2) {
          for (; o.default.element(t2); ) {
            if (P(t2, e2))
              return true;
            if ((t2 = w(t2)) === n2)
              return P(t2, e2);
          }
          return false;
        }, _.getActualElement = function(t2) {
          return t2.correspondingUseElement || t2;
        }, _.getScrollXY = M, _.getElementClientRect = O, _.getElementRect = function(t2) {
          var n2 = O(t2);
          if (!y.default.isIOS7 && n2) {
            var r2 = M(e.getWindow(t2));
            n2.left += r2.x, n2.right += r2.x, n2.top += r2.y, n2.bottom += r2.y;
          }
          return n2;
        }, _.getPath = function(t2) {
          for (var e2 = []; t2; )
            e2.push(t2), t2 = w(t2);
          return e2;
        }, _.trySelector = function(t2) {
          return !!o.default.string(t2) && (v.default.document.querySelector(t2), true);
        };
        var E = function(t2) {
          return t2.parentNode || t2.host;
        };
        function S(t2, e2) {
          for (var n2, r2 = [], i2 = t2; (n2 = E(i2)) && i2 !== e2 && n2 !== i2.ownerDocument; )
            r2.unshift(i2), i2 = n2;
          return r2;
        }
        function M(t2) {
          return { x: (t2 = t2 || e.window).scrollX || t2.document.documentElement.scrollLeft, y: t2.scrollY || t2.document.documentElement.scrollTop };
        }
        function O(t2) {
          var e2 = t2 instanceof v.default.SVGElement ? t2.getBoundingClientRect() : t2.getClientRects()[0];
          return e2 && { left: e2.left, right: e2.right, top: e2.top, bottom: e2.bottom, width: e2.width || e2.right - e2.left, height: e2.height || e2.bottom - e2.top };
        }
        var T = {};
        Object.defineProperty(T, "__esModule", { value: true }), T.default = function(t2, e2) {
          for (var n2 in e2)
            t2[n2] = e2[n2];
          return t2;
        };
        var I = {};
        function D(t2, e2, n2) {
          return t2 === "parent" ? (0, _.parentNode)(n2) : t2 === "self" ? e2.getRect(n2) : (0, _.closest)(n2, t2);
        }
        Object.defineProperty(I, "__esModule", { value: true }), I.getStringOptionResult = D, I.resolveRectLike = function(t2, e2, n2, r2) {
          var i2 = t2;
          return o.default.string(i2) ? i2 = D(i2, e2, n2) : o.default.func(i2) && (i2 = i2.apply(void 0, r2)), o.default.element(i2) && (i2 = (0, _.getElementRect)(i2)), i2;
        }, I.rectToXY = function(t2) {
          return t2 && { x: "x" in t2 ? t2.x : t2.left, y: "y" in t2 ? t2.y : t2.top };
        }, I.xywhToTlbr = function(t2) {
          return !t2 || "left" in t2 && "top" in t2 || ((t2 = (0, T.default)({}, t2)).left = t2.x || 0, t2.top = t2.y || 0, t2.right = t2.right || t2.left + t2.width, t2.bottom = t2.bottom || t2.top + t2.height), t2;
        }, I.tlbrToXywh = function(t2) {
          return !t2 || "x" in t2 && "y" in t2 || ((t2 = (0, T.default)({}, t2)).x = t2.left || 0, t2.y = t2.top || 0, t2.width = t2.width || (t2.right || 0) - t2.x, t2.height = t2.height || (t2.bottom || 0) - t2.y), t2;
        }, I.addEdges = function(t2, e2, n2) {
          t2.left && (e2.left += n2.x), t2.right && (e2.right += n2.x), t2.top && (e2.top += n2.y), t2.bottom && (e2.bottom += n2.y), e2.width = e2.right - e2.left, e2.height = e2.bottom - e2.top;
        };
        var j = {};
        Object.defineProperty(j, "__esModule", { value: true }), j.default = function(t2, e2, n2) {
          var r2 = t2.options[n2], i2 = r2 && r2.origin || t2.options.origin, o2 = (0, I.resolveRectLike)(i2, t2, e2, [t2 && e2]);
          return (0, I.rectToXY)(o2) || { x: 0, y: 0 };
        };
        var z = {};
        function A(t2) {
          return t2.trim().split(/ +/);
        }
        Object.defineProperty(z, "__esModule", { value: true }), z.default = function t2(e2, n2, r2) {
          if (r2 = r2 || {}, o.default.string(e2) && e2.search(" ") !== -1 && (e2 = A(e2)), o.default.array(e2))
            return e2.reduce(function(e3, i3) {
              return (0, T.default)(e3, t2(i3, n2, r2));
            }, r2);
          if (o.default.object(e2) && (n2 = e2, e2 = ""), o.default.func(n2))
            r2[e2] = r2[e2] || [], r2[e2].push(n2);
          else if (o.default.array(n2))
            for (var i2 = 0; i2 < n2.length; i2++) {
              var a2;
              a2 = n2[i2], t2(e2, a2, r2);
            }
          else if (o.default.object(n2))
            for (var s2 in n2) {
              var l2 = A(s2).map(function(t3) {
                return "" + e2 + t3;
              });
              t2(l2, n2[s2], r2);
            }
          return r2;
        };
        var C = {};
        Object.defineProperty(C, "__esModule", { value: true }), C.default = void 0, C.default = function(t2, e2) {
          return Math.sqrt(t2 * t2 + e2 * e2);
        };
        var k = {};
        function R(t2, e2) {
          for (var n2 in e2) {
            var r2 = R.prefixedPropREs, i2 = false;
            for (var o2 in r2)
              if (n2.indexOf(o2) === 0 && r2[o2].test(n2)) {
                i2 = true;
                break;
              }
            i2 || typeof e2[n2] == "function" || (t2[n2] = e2[n2]);
          }
          return t2;
        }
        Object.defineProperty(k, "__esModule", { value: true }), k.default = void 0, R.prefixedPropREs = { webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/, moz: /(Pressure)$/ };
        var F = R;
        k.default = F;
        var X = {};
        function Y(t2) {
          return t2 instanceof v.default.Event || t2 instanceof v.default.Touch;
        }
        function W(t2, e2, n2) {
          return t2 = t2 || "page", (n2 = n2 || {}).x = e2[t2 + "X"], n2.y = e2[t2 + "Y"], n2;
        }
        function B(t2, e2) {
          return e2 = e2 || { x: 0, y: 0 }, y.default.isOperaMobile && Y(t2) ? (W("screen", t2, e2), e2.x += window.scrollX, e2.y += window.scrollY) : W("page", t2, e2), e2;
        }
        function L(t2, e2) {
          return e2 = e2 || {}, y.default.isOperaMobile && Y(t2) ? W("screen", t2, e2) : W("client", t2, e2), e2;
        }
        function N(t2) {
          var e2 = [];
          return o.default.array(t2) ? (e2[0] = t2[0], e2[1] = t2[1]) : t2.type === "touchend" ? t2.touches.length === 1 ? (e2[0] = t2.touches[0], e2[1] = t2.changedTouches[0]) : t2.touches.length === 0 && (e2[0] = t2.changedTouches[0], e2[1] = t2.changedTouches[1]) : (e2[0] = t2.touches[0], e2[1] = t2.touches[1]), e2;
        }
        function V(t2) {
          for (var e2 = { pageX: 0, pageY: 0, clientX: 0, clientY: 0, screenX: 0, screenY: 0 }, n2 = 0; n2 < t2.length; n2++) {
            var r2 = t2[n2];
            for (var i2 in e2)
              e2[i2] += r2[i2];
          }
          for (var o2 in e2)
            e2[o2] /= t2.length;
          return e2;
        }
        Object.defineProperty(X, "__esModule", { value: true }), X.copyCoords = function(t2, e2) {
          t2.page = t2.page || {}, t2.page.x = e2.page.x, t2.page.y = e2.page.y, t2.client = t2.client || {}, t2.client.x = e2.client.x, t2.client.y = e2.client.y, t2.timeStamp = e2.timeStamp;
        }, X.setCoordDeltas = function(t2, e2, n2) {
          t2.page.x = n2.page.x - e2.page.x, t2.page.y = n2.page.y - e2.page.y, t2.client.x = n2.client.x - e2.client.x, t2.client.y = n2.client.y - e2.client.y, t2.timeStamp = n2.timeStamp - e2.timeStamp;
        }, X.setCoordVelocity = function(t2, e2) {
          var n2 = Math.max(e2.timeStamp / 1e3, 1e-3);
          t2.page.x = e2.page.x / n2, t2.page.y = e2.page.y / n2, t2.client.x = e2.client.x / n2, t2.client.y = e2.client.y / n2, t2.timeStamp = n2;
        }, X.setZeroCoords = function(t2) {
          t2.page.x = 0, t2.page.y = 0, t2.client.x = 0, t2.client.y = 0;
        }, X.isNativePointer = Y, X.getXY = W, X.getPageXY = B, X.getClientXY = L, X.getPointerId = function(t2) {
          return o.default.number(t2.pointerId) ? t2.pointerId : t2.identifier;
        }, X.setCoords = function(t2, e2, n2) {
          var r2 = e2.length > 1 ? V(e2) : e2[0];
          B(r2, t2.page), L(r2, t2.client), t2.timeStamp = n2;
        }, X.getTouchPair = N, X.pointerAverage = V, X.touchBBox = function(t2) {
          if (!t2.length)
            return null;
          var e2 = N(t2), n2 = Math.min(e2[0].pageX, e2[1].pageX), r2 = Math.min(e2[0].pageY, e2[1].pageY), i2 = Math.max(e2[0].pageX, e2[1].pageX), o2 = Math.max(e2[0].pageY, e2[1].pageY);
          return { x: n2, y: r2, left: n2, top: r2, right: i2, bottom: o2, width: i2 - n2, height: o2 - r2 };
        }, X.touchDistance = function(t2, e2) {
          var n2 = e2 + "X", r2 = e2 + "Y", i2 = N(t2), o2 = i2[0][n2] - i2[1][n2], a2 = i2[0][r2] - i2[1][r2];
          return (0, C.default)(o2, a2);
        }, X.touchAngle = function(t2, e2) {
          var n2 = e2 + "X", r2 = e2 + "Y", i2 = N(t2), o2 = i2[1][n2] - i2[0][n2], a2 = i2[1][r2] - i2[0][r2];
          return 180 * Math.atan2(a2, o2) / Math.PI;
        }, X.getPointerType = function(t2) {
          return o.default.string(t2.pointerType) ? t2.pointerType : o.default.number(t2.pointerType) ? [void 0, void 0, "touch", "pen", "mouse"][t2.pointerType] : /touch/.test(t2.type) || t2 instanceof v.default.Touch ? "touch" : "mouse";
        }, X.getEventTargets = function(t2) {
          var e2 = o.default.func(t2.composedPath) ? t2.composedPath() : t2.path;
          return [_.getActualElement(e2 ? e2[0] : t2.target), _.getActualElement(t2.currentTarget)];
        }, X.newCoords = function() {
          return { page: { x: 0, y: 0 }, client: { x: 0, y: 0 }, timeStamp: 0 };
        }, X.coordsToEvent = function(t2) {
          return { coords: t2, get page() {
            return this.coords.page;
          }, get client() {
            return this.coords.client;
          }, get timeStamp() {
            return this.coords.timeStamp;
          }, get pageX() {
            return this.coords.page.x;
          }, get pageY() {
            return this.coords.page.y;
          }, get clientX() {
            return this.coords.client.x;
          }, get clientY() {
            return this.coords.client.y;
          }, get pointerId() {
            return this.coords.pointerId;
          }, get target() {
            return this.coords.target;
          }, get type() {
            return this.coords.type;
          }, get pointerType() {
            return this.coords.pointerType;
          }, get buttons() {
            return this.coords.buttons;
          }, preventDefault: function() {
          } };
        }, Object.defineProperty(X, "pointerExtend", { enumerable: true, get: function() {
          return k.default;
        } });
        var q = {};
        Object.defineProperty(q, "__esModule", { value: true }), q.BaseEvent = void 0;
        var U = function() {
          function t2(t3) {
            this.type = void 0, this.target = void 0, this.currentTarget = void 0, this.interactable = void 0, this._interaction = void 0, this.timeStamp = void 0, this.immediatePropagationStopped = false, this.propagationStopped = false, this._interaction = t3;
          }
          var e2 = t2.prototype;
          return e2.preventDefault = function() {
          }, e2.stopPropagation = function() {
            this.propagationStopped = true;
          }, e2.stopImmediatePropagation = function() {
            this.immediatePropagationStopped = this.propagationStopped = true;
          }, t2;
        }();
        q.BaseEvent = U, Object.defineProperty(U.prototype, "interaction", { get: function() {
          return this._interaction._proxy;
        }, set: function() {
        } });
        var G = {};
        Object.defineProperty(G, "__esModule", { value: true }), G.find = G.findIndex = G.from = G.merge = G.remove = G.contains = void 0, G.contains = function(t2, e2) {
          return t2.indexOf(e2) !== -1;
        }, G.remove = function(t2, e2) {
          return t2.splice(t2.indexOf(e2), 1);
        };
        var H = function(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2];
            t2.push(r2);
          }
          return t2;
        };
        G.merge = H, G.from = function(t2) {
          return H([], t2);
        };
        var $ = function(t2, e2) {
          for (var n2 = 0; n2 < t2.length; n2++)
            if (e2(t2[n2], n2, t2))
              return n2;
          return -1;
        };
        G.findIndex = $, G.find = function(t2, e2) {
          return t2[$(t2, e2)];
        };
        var K = {};
        Object.defineProperty(K, "__esModule", { value: true }), K.DropEvent = void 0;
        var Z = function(t2) {
          var e2, n2;
          function r2(e3, n3, r3) {
            var i3;
            (i3 = t2.call(this, n3._interaction) || this).target = void 0, i3.dropzone = void 0, i3.dragEvent = void 0, i3.relatedTarget = void 0, i3.draggable = void 0, i3.timeStamp = void 0, i3.propagationStopped = false, i3.immediatePropagationStopped = false;
            var o2 = r3 === "dragleave" ? e3.prev : e3.cur, a2 = o2.element, s2 = o2.dropzone;
            return i3.type = r3, i3.target = a2, i3.currentTarget = a2, i3.dropzone = s2, i3.dragEvent = n3, i3.relatedTarget = n3.target, i3.draggable = n3.interactable, i3.timeStamp = n3.timeStamp, i3;
          }
          n2 = t2, (e2 = r2).prototype = Object.create(n2.prototype), e2.prototype.constructor = e2, e2.__proto__ = n2;
          var i2 = r2.prototype;
          return i2.reject = function() {
            var t3 = this, e3 = this._interaction.dropState;
            if (this.type === "dropactivate" || this.dropzone && e3.cur.dropzone === this.dropzone && e3.cur.element === this.target)
              if (e3.prev.dropzone = this.dropzone, e3.prev.element = this.target, e3.rejected = true, e3.events.enter = null, this.stopImmediatePropagation(), this.type === "dropactivate") {
                var n3 = e3.activeDrops, i3 = G.findIndex(n3, function(e4) {
                  var n4 = e4.dropzone, r3 = e4.element;
                  return n4 === t3.dropzone && r3 === t3.target;
                });
                e3.activeDrops.splice(i3, 1);
                var o2 = new r2(e3, this.dragEvent, "dropdeactivate");
                o2.dropzone = this.dropzone, o2.target = this.target, this.dropzone.fire(o2);
              } else
                this.dropzone.fire(new r2(e3, this.dragEvent, "dragleave"));
          }, i2.preventDefault = function() {
          }, i2.stopPropagation = function() {
            this.propagationStopped = true;
          }, i2.stopImmediatePropagation = function() {
            this.immediatePropagationStopped = this.propagationStopped = true;
          }, r2;
        }(q.BaseEvent);
        K.DropEvent = Z;
        var J = {};
        function Q(t2, e2) {
          for (var n2 = 0; n2 < t2.slice().length; n2++) {
            var r2 = t2.slice()[n2], i2 = r2.dropzone, o2 = r2.element;
            e2.dropzone = i2, e2.target = o2, i2.fire(e2), e2.propagationStopped = e2.immediatePropagationStopped = false;
          }
        }
        function tt(t2, e2) {
          for (var n2 = function(t3, e3) {
            for (var n3 = t3.interactables, r3 = [], i3 = 0; i3 < n3.list.length; i3++) {
              var a2 = n3.list[i3];
              if (a2.options.drop.enabled) {
                var s2 = a2.options.drop.accept;
                if (!(o.default.element(s2) && s2 !== e3 || o.default.string(s2) && !_.matchesSelector(e3, s2) || o.default.func(s2) && !s2({ dropzone: a2, draggableElement: e3 })))
                  for (var l2 = o.default.string(a2.target) ? a2._context.querySelectorAll(a2.target) : o.default.array(a2.target) ? a2.target : [a2.target], c2 = 0; c2 < l2.length; c2++) {
                    var u2 = l2[c2];
                    u2 !== e3 && r3.push({ dropzone: a2, element: u2, rect: a2.getRect(u2) });
                  }
              }
            }
            return r3;
          }(t2, e2), r2 = 0; r2 < n2.length; r2++) {
            var i2 = n2[r2];
            i2.rect = i2.dropzone.getRect(i2.element);
          }
          return n2;
        }
        function et(t2, e2, n2) {
          for (var r2 = t2.dropState, i2 = t2.interactable, o2 = t2.element, a2 = [], s2 = 0; s2 < r2.activeDrops.length; s2++) {
            var l2 = r2.activeDrops[s2], c2 = l2.dropzone, u2 = l2.element, d2 = l2.rect;
            a2.push(c2.dropCheck(e2, n2, i2, o2, u2, d2) ? u2 : null);
          }
          var f2 = _.indexOfDeepestElement(a2);
          return r2.activeDrops[f2] || null;
        }
        function nt(t2, e2, n2) {
          var r2 = t2.dropState, i2 = { enter: null, leave: null, activate: null, deactivate: null, move: null, drop: null };
          return n2.type === "dragstart" && (i2.activate = new K.DropEvent(r2, n2, "dropactivate"), i2.activate.target = null, i2.activate.dropzone = null), n2.type === "dragend" && (i2.deactivate = new K.DropEvent(r2, n2, "dropdeactivate"), i2.deactivate.target = null, i2.deactivate.dropzone = null), r2.rejected || (r2.cur.element !== r2.prev.element && (r2.prev.dropzone && (i2.leave = new K.DropEvent(r2, n2, "dragleave"), n2.dragLeave = i2.leave.target = r2.prev.element, n2.prevDropzone = i2.leave.dropzone = r2.prev.dropzone), r2.cur.dropzone && (i2.enter = new K.DropEvent(r2, n2, "dragenter"), n2.dragEnter = r2.cur.element, n2.dropzone = r2.cur.dropzone)), n2.type === "dragend" && r2.cur.dropzone && (i2.drop = new K.DropEvent(r2, n2, "drop"), n2.dropzone = r2.cur.dropzone, n2.relatedTarget = r2.cur.element), n2.type === "dragmove" && r2.cur.dropzone && (i2.move = new K.DropEvent(r2, n2, "dropmove"), i2.move.dragmove = n2, n2.dropzone = r2.cur.dropzone)), i2;
        }
        function rt(t2, e2) {
          var n2 = t2.dropState, r2 = n2.activeDrops, i2 = n2.cur, o2 = n2.prev;
          e2.leave && o2.dropzone.fire(e2.leave), e2.enter && i2.dropzone.fire(e2.enter), e2.move && i2.dropzone.fire(e2.move), e2.drop && i2.dropzone.fire(e2.drop), e2.deactivate && Q(r2, e2.deactivate), n2.prev.dropzone = i2.dropzone, n2.prev.element = i2.element;
        }
        function it(t2, e2) {
          var n2 = t2.interaction, r2 = t2.iEvent, i2 = t2.event;
          if (r2.type === "dragmove" || r2.type === "dragend") {
            var o2 = n2.dropState;
            e2.dynamicDrop && (o2.activeDrops = tt(e2, n2.element));
            var a2 = r2, s2 = et(n2, a2, i2);
            o2.rejected = o2.rejected && !!s2 && s2.dropzone === o2.cur.dropzone && s2.element === o2.cur.element, o2.cur.dropzone = s2 && s2.dropzone, o2.cur.element = s2 && s2.element, o2.events = nt(n2, 0, a2);
          }
        }
        Object.defineProperty(J, "__esModule", { value: true }), J.default = void 0;
        var ot = { id: "actions/drop", install: function(t2) {
          var e2 = t2.actions, n2 = t2.interactStatic, r2 = t2.Interactable, i2 = t2.defaults;
          t2.usePlugin(c.default), r2.prototype.dropzone = function(t3) {
            return function(t4, e3) {
              if (o.default.object(e3)) {
                if (t4.options.drop.enabled = e3.enabled !== false, e3.listeners) {
                  var n3 = (0, z.default)(e3.listeners), r3 = Object.keys(n3).reduce(function(t5, e4) {
                    return t5[/^(enter|leave)/.test(e4) ? "drag" + e4 : /^(activate|deactivate|move)/.test(e4) ? "drop" + e4 : e4] = n3[e4], t5;
                  }, {});
                  t4.off(t4.options.drop.listeners), t4.on(r3), t4.options.drop.listeners = r3;
                }
                return o.default.func(e3.ondrop) && t4.on("drop", e3.ondrop), o.default.func(e3.ondropactivate) && t4.on("dropactivate", e3.ondropactivate), o.default.func(e3.ondropdeactivate) && t4.on("dropdeactivate", e3.ondropdeactivate), o.default.func(e3.ondragenter) && t4.on("dragenter", e3.ondragenter), o.default.func(e3.ondragleave) && t4.on("dragleave", e3.ondragleave), o.default.func(e3.ondropmove) && t4.on("dropmove", e3.ondropmove), /^(pointer|center)$/.test(e3.overlap) ? t4.options.drop.overlap = e3.overlap : o.default.number(e3.overlap) && (t4.options.drop.overlap = Math.max(Math.min(1, e3.overlap), 0)), "accept" in e3 && (t4.options.drop.accept = e3.accept), "checker" in e3 && (t4.options.drop.checker = e3.checker), t4;
              }
              return o.default.bool(e3) ? (t4.options.drop.enabled = e3, t4) : t4.options.drop;
            }(this, t3);
          }, r2.prototype.dropCheck = function(t3, e3, n3, r3, i3, a2) {
            return function(t4, e4, n4, r4, i4, a3, s2) {
              var l2 = false;
              if (!(s2 = s2 || t4.getRect(a3)))
                return !!t4.options.drop.checker && t4.options.drop.checker(e4, n4, l2, t4, a3, r4, i4);
              var c2 = t4.options.drop.overlap;
              if (c2 === "pointer") {
                var u2 = (0, j.default)(r4, i4, "drag"), d2 = X.getPageXY(e4);
                d2.x += u2.x, d2.y += u2.y;
                var f2 = d2.x > s2.left && d2.x < s2.right, p2 = d2.y > s2.top && d2.y < s2.bottom;
                l2 = f2 && p2;
              }
              var v2 = r4.getRect(i4);
              if (v2 && c2 === "center") {
                var h2 = v2.left + v2.width / 2, g2 = v2.top + v2.height / 2;
                l2 = h2 >= s2.left && h2 <= s2.right && g2 >= s2.top && g2 <= s2.bottom;
              }
              return v2 && o.default.number(c2) && (l2 = Math.max(0, Math.min(s2.right, v2.right) - Math.max(s2.left, v2.left)) * Math.max(0, Math.min(s2.bottom, v2.bottom) - Math.max(s2.top, v2.top)) / (v2.width * v2.height) >= c2), t4.options.drop.checker && (l2 = t4.options.drop.checker(e4, n4, l2, t4, a3, r4, i4)), l2;
            }(this, t3, e3, n3, r3, i3, a2);
          }, n2.dynamicDrop = function(e3) {
            return o.default.bool(e3) ? (t2.dynamicDrop = e3, n2) : t2.dynamicDrop;
          }, (0, T.default)(e2.phaselessTypes, { dragenter: true, dragleave: true, dropactivate: true, dropdeactivate: true, dropmove: true, drop: true }), e2.methodDict.drop = "dropzone", t2.dynamicDrop = false, i2.actions.drop = ot.defaults;
        }, listeners: { "interactions:before-action-start": function(t2) {
          var e2 = t2.interaction;
          e2.prepared.name === "drag" && (e2.dropState = { cur: { dropzone: null, element: null }, prev: { dropzone: null, element: null }, rejected: null, events: null, activeDrops: [] });
        }, "interactions:after-action-start": function(t2, e2) {
          var n2 = t2.interaction, r2 = (t2.event, t2.iEvent);
          if (n2.prepared.name === "drag") {
            var i2 = n2.dropState;
            i2.activeDrops = null, i2.events = null, i2.activeDrops = tt(e2, n2.element), i2.events = nt(n2, 0, r2), i2.events.activate && (Q(i2.activeDrops, i2.events.activate), e2.fire("actions/drop:start", { interaction: n2, dragEvent: r2 }));
          }
        }, "interactions:action-move": it, "interactions:after-action-move": function(t2, e2) {
          var n2 = t2.interaction, r2 = t2.iEvent;
          n2.prepared.name === "drag" && (rt(n2, n2.dropState.events), e2.fire("actions/drop:move", { interaction: n2, dragEvent: r2 }), n2.dropState.events = {});
        }, "interactions:action-end": function(t2, e2) {
          if (t2.interaction.prepared.name === "drag") {
            var n2 = t2.interaction, r2 = t2.iEvent;
            it(t2, e2), rt(n2, n2.dropState.events), e2.fire("actions/drop:end", { interaction: n2, dragEvent: r2 });
          }
        }, "interactions:stop": function(t2) {
          var e2 = t2.interaction;
          if (e2.prepared.name === "drag") {
            var n2 = e2.dropState;
            n2 && (n2.activeDrops = null, n2.events = null, n2.cur.dropzone = null, n2.cur.element = null, n2.prev.dropzone = null, n2.prev.element = null, n2.rejected = false);
          }
        } }, getActiveDrops: tt, getDrop: et, getDropEvents: nt, fireDropEvents: rt, defaults: { enabled: false, accept: null, overlap: "pointer" } }, at = ot;
        J.default = at;
        var st = {};
        function lt(t2) {
          var e2 = t2.interaction, n2 = t2.iEvent, r2 = t2.phase;
          if (e2.prepared.name === "gesture") {
            var i2 = e2.pointers.map(function(t3) {
              return t3.pointer;
            }), a2 = r2 === "start", s2 = r2 === "end", l2 = e2.interactable.options.deltaSource;
            if (n2.touches = [i2[0], i2[1]], a2)
              n2.distance = X.touchDistance(i2, l2), n2.box = X.touchBBox(i2), n2.scale = 1, n2.ds = 0, n2.angle = X.touchAngle(i2, l2), n2.da = 0, e2.gesture.startDistance = n2.distance, e2.gesture.startAngle = n2.angle;
            else if (s2) {
              var c2 = e2.prevEvent;
              n2.distance = c2.distance, n2.box = c2.box, n2.scale = c2.scale, n2.ds = 0, n2.angle = c2.angle, n2.da = 0;
            } else
              n2.distance = X.touchDistance(i2, l2), n2.box = X.touchBBox(i2), n2.scale = n2.distance / e2.gesture.startDistance, n2.angle = X.touchAngle(i2, l2), n2.ds = n2.scale - e2.gesture.scale, n2.da = n2.angle - e2.gesture.angle;
            e2.gesture.distance = n2.distance, e2.gesture.angle = n2.angle, o.default.number(n2.scale) && n2.scale !== 1 / 0 && !isNaN(n2.scale) && (e2.gesture.scale = n2.scale);
          }
        }
        Object.defineProperty(st, "__esModule", { value: true }), st.default = void 0;
        var ct = { id: "actions/gesture", before: ["actions/drag", "actions/resize"], install: function(t2) {
          var e2 = t2.actions, n2 = t2.Interactable, r2 = t2.defaults;
          n2.prototype.gesturable = function(t3) {
            return o.default.object(t3) ? (this.options.gesture.enabled = t3.enabled !== false, this.setPerAction("gesture", t3), this.setOnEvents("gesture", t3), this) : o.default.bool(t3) ? (this.options.gesture.enabled = t3, this) : this.options.gesture;
          }, e2.map.gesture = ct, e2.methodDict.gesture = "gesturable", r2.actions.gesture = ct.defaults;
        }, listeners: { "interactions:action-start": lt, "interactions:action-move": lt, "interactions:action-end": lt, "interactions:new": function(t2) {
          t2.interaction.gesture = { angle: 0, distance: 0, scale: 1, startAngle: 0, startDistance: 0 };
        }, "auto-start:check": function(t2) {
          if (!(t2.interaction.pointers.length < 2)) {
            var e2 = t2.interactable.options.gesture;
            if (e2 && e2.enabled)
              return t2.action = { name: "gesture" }, false;
          }
        } }, defaults: {}, getCursor: function() {
          return "";
        } }, ut = ct;
        st.default = ut;
        var dt = {};
        function ft(t2, e2, n2, r2, i2, a2, s2) {
          if (!e2)
            return false;
          if (e2 === true) {
            var l2 = o.default.number(a2.width) ? a2.width : a2.right - a2.left, c2 = o.default.number(a2.height) ? a2.height : a2.bottom - a2.top;
            if (s2 = Math.min(s2, Math.abs((t2 === "left" || t2 === "right" ? l2 : c2) / 2)), l2 < 0 && (t2 === "left" ? t2 = "right" : t2 === "right" && (t2 = "left")), c2 < 0 && (t2 === "top" ? t2 = "bottom" : t2 === "bottom" && (t2 = "top")), t2 === "left")
              return n2.x < (l2 >= 0 ? a2.left : a2.right) + s2;
            if (t2 === "top")
              return n2.y < (c2 >= 0 ? a2.top : a2.bottom) + s2;
            if (t2 === "right")
              return n2.x > (l2 >= 0 ? a2.right : a2.left) - s2;
            if (t2 === "bottom")
              return n2.y > (c2 >= 0 ? a2.bottom : a2.top) - s2;
          }
          return !!o.default.element(r2) && (o.default.element(e2) ? e2 === r2 : _.matchesUpTo(r2, e2, i2));
        }
        function pt(t2) {
          var e2 = t2.iEvent, n2 = t2.interaction;
          if (n2.prepared.name === "resize" && n2.resizeAxes) {
            var r2 = e2;
            n2.interactable.options.resize.square ? (n2.resizeAxes === "y" ? r2.delta.x = r2.delta.y : r2.delta.y = r2.delta.x, r2.axes = "xy") : (r2.axes = n2.resizeAxes, n2.resizeAxes === "x" ? r2.delta.y = 0 : n2.resizeAxes === "y" && (r2.delta.x = 0));
          }
        }
        Object.defineProperty(dt, "__esModule", { value: true }), dt.default = void 0;
        var vt = { id: "actions/resize", before: ["actions/drag"], install: function(t2) {
          var e2 = t2.actions, n2 = t2.browser, r2 = t2.Interactable, i2 = t2.defaults;
          vt.cursors = function(t3) {
            return t3.isIe9 ? { x: "e-resize", y: "s-resize", xy: "se-resize", top: "n-resize", left: "w-resize", bottom: "s-resize", right: "e-resize", topleft: "se-resize", bottomright: "se-resize", topright: "ne-resize", bottomleft: "ne-resize" } : { x: "ew-resize", y: "ns-resize", xy: "nwse-resize", top: "ns-resize", left: "ew-resize", bottom: "ns-resize", right: "ew-resize", topleft: "nwse-resize", bottomright: "nwse-resize", topright: "nesw-resize", bottomleft: "nesw-resize" };
          }(n2), vt.defaultMargin = n2.supportsTouch || n2.supportsPointerEvent ? 20 : 10, r2.prototype.resizable = function(e3) {
            return function(t3, e4, n3) {
              return o.default.object(e4) ? (t3.options.resize.enabled = e4.enabled !== false, t3.setPerAction("resize", e4), t3.setOnEvents("resize", e4), o.default.string(e4.axis) && /^x$|^y$|^xy$/.test(e4.axis) ? t3.options.resize.axis = e4.axis : e4.axis === null && (t3.options.resize.axis = n3.defaults.actions.resize.axis), o.default.bool(e4.preserveAspectRatio) ? t3.options.resize.preserveAspectRatio = e4.preserveAspectRatio : o.default.bool(e4.square) && (t3.options.resize.square = e4.square), t3) : o.default.bool(e4) ? (t3.options.resize.enabled = e4, t3) : t3.options.resize;
            }(this, e3, t2);
          }, e2.map.resize = vt, e2.methodDict.resize = "resizable", i2.actions.resize = vt.defaults;
        }, listeners: { "interactions:new": function(t2) {
          t2.interaction.resizeAxes = "xy";
        }, "interactions:action-start": function(t2) {
          !function(t3) {
            var e2 = t3.iEvent, n2 = t3.interaction;
            if (n2.prepared.name === "resize" && n2.prepared.edges) {
              var r2 = e2, i2 = n2.rect;
              n2._rects = { start: (0, T.default)({}, i2), corrected: (0, T.default)({}, i2), previous: (0, T.default)({}, i2), delta: { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 } }, r2.edges = n2.prepared.edges, r2.rect = n2._rects.corrected, r2.deltaRect = n2._rects.delta;
            }
          }(t2), pt(t2);
        }, "interactions:action-move": function(t2) {
          !function(t3) {
            var e2 = t3.iEvent, n2 = t3.interaction;
            if (n2.prepared.name === "resize" && n2.prepared.edges) {
              var r2 = e2, i2 = n2.interactable.options.resize.invert, o2 = i2 === "reposition" || i2 === "negate", a2 = n2.rect, s2 = n2._rects, l2 = s2.start, c2 = s2.corrected, u2 = s2.delta, d2 = s2.previous;
              if ((0, T.default)(d2, c2), o2) {
                if ((0, T.default)(c2, a2), i2 === "reposition") {
                  if (c2.top > c2.bottom) {
                    var f2 = c2.top;
                    c2.top = c2.bottom, c2.bottom = f2;
                  }
                  if (c2.left > c2.right) {
                    var p2 = c2.left;
                    c2.left = c2.right, c2.right = p2;
                  }
                }
              } else
                c2.top = Math.min(a2.top, l2.bottom), c2.bottom = Math.max(a2.bottom, l2.top), c2.left = Math.min(a2.left, l2.right), c2.right = Math.max(a2.right, l2.left);
              for (var v2 in c2.width = c2.right - c2.left, c2.height = c2.bottom - c2.top, c2)
                u2[v2] = c2[v2] - d2[v2];
              r2.edges = n2.prepared.edges, r2.rect = c2, r2.deltaRect = u2;
            }
          }(t2), pt(t2);
        }, "interactions:action-end": function(t2) {
          var e2 = t2.iEvent, n2 = t2.interaction;
          if (n2.prepared.name === "resize" && n2.prepared.edges) {
            var r2 = e2;
            r2.edges = n2.prepared.edges, r2.rect = n2._rects.corrected, r2.deltaRect = n2._rects.delta;
          }
        }, "auto-start:check": function(t2) {
          var e2 = t2.interaction, n2 = t2.interactable, r2 = t2.element, i2 = t2.rect, a2 = t2.buttons;
          if (i2) {
            var s2 = (0, T.default)({}, e2.coords.cur.page), l2 = n2.options.resize;
            if (l2 && l2.enabled && (!e2.pointerIsDown || !/mouse|pointer/.test(e2.pointerType) || (a2 & l2.mouseButtons) != 0)) {
              if (o.default.object(l2.edges)) {
                var c2 = { left: false, right: false, top: false, bottom: false };
                for (var u2 in c2)
                  c2[u2] = ft(u2, l2.edges[u2], s2, e2._latestPointer.eventTarget, r2, i2, l2.margin || vt.defaultMargin);
                c2.left = c2.left && !c2.right, c2.top = c2.top && !c2.bottom, (c2.left || c2.right || c2.top || c2.bottom) && (t2.action = { name: "resize", edges: c2 });
              } else {
                var d2 = l2.axis !== "y" && s2.x > i2.right - vt.defaultMargin, f2 = l2.axis !== "x" && s2.y > i2.bottom - vt.defaultMargin;
                (d2 || f2) && (t2.action = { name: "resize", axes: (d2 ? "x" : "") + (f2 ? "y" : "") });
              }
              return !t2.action && void 0;
            }
          }
        } }, defaults: { square: false, preserveAspectRatio: false, axis: "xy", margin: NaN, edges: null, invert: "none" }, cursors: null, getCursor: function(t2) {
          var e2 = t2.edges, n2 = t2.axis, r2 = t2.name, i2 = vt.cursors, o2 = null;
          if (n2)
            o2 = i2[r2 + n2];
          else if (e2) {
            for (var a2 = "", s2 = ["top", "bottom", "left", "right"], l2 = 0; l2 < s2.length; l2++) {
              var c2 = s2[l2];
              e2[c2] && (a2 += c2);
            }
            o2 = i2[a2];
          }
          return o2;
        }, defaultMargin: null }, ht = vt;
        dt.default = ht;
        var gt = {};
        Object.defineProperty(gt, "__esModule", { value: true }), gt.default = void 0;
        var mt = { id: "actions", install: function(t2) {
          t2.usePlugin(st.default), t2.usePlugin(dt.default), t2.usePlugin(c.default), t2.usePlugin(J.default);
        } };
        gt.default = mt;
        var yt = {};
        Object.defineProperty(yt, "__esModule", { value: true }), yt.default = void 0, yt.default = {};
        var bt = {};
        Object.defineProperty(bt, "__esModule", { value: true }), bt.default = void 0;
        var xt, _t, wt = 0, Pt = { request: function(t2) {
          return xt(t2);
        }, cancel: function(t2) {
          return _t(t2);
        }, init: function(t2) {
          if (xt = t2.requestAnimationFrame, _t = t2.cancelAnimationFrame, !xt)
            for (var e2 = ["ms", "moz", "webkit", "o"], n2 = 0; n2 < e2.length; n2++) {
              var r2 = e2[n2];
              xt = t2[r2 + "RequestAnimationFrame"], _t = t2[r2 + "CancelAnimationFrame"] || t2[r2 + "CancelRequestAnimationFrame"];
            }
          xt = xt && xt.bind(t2), _t = _t && _t.bind(t2), xt || (xt = function(e3) {
            var n3 = Date.now(), r3 = Math.max(0, 16 - (n3 - wt)), i2 = t2.setTimeout(function() {
              e3(n3 + r3);
            }, r3);
            return wt = n3 + r3, i2;
          }, _t = function(t3) {
            return clearTimeout(t3);
          });
        } };
        bt.default = Pt;
        var Et = {};
        Object.defineProperty(Et, "__esModule", { value: true }), Et.getContainer = Mt, Et.getScroll = Ot, Et.getScrollSize = function(t2) {
          return o.default.window(t2) && (t2 = window.document.body), { x: t2.scrollWidth, y: t2.scrollHeight };
        }, Et.getScrollSizeDelta = function(t2, e2) {
          var n2 = t2.interaction, r2 = t2.element, i2 = n2 && n2.interactable.options[n2.prepared.name].autoScroll;
          if (!i2 || !i2.enabled)
            return e2(), { x: 0, y: 0 };
          var o2 = Mt(i2.container, n2.interactable, r2), a2 = Ot(o2);
          e2();
          var s2 = Ot(o2);
          return { x: s2.x - a2.x, y: s2.y - a2.y };
        }, Et.default = void 0;
        var St = { defaults: { enabled: false, margin: 60, container: null, speed: 300 }, now: Date.now, interaction: null, i: 0, x: 0, y: 0, isScrolling: false, prevTime: 0, margin: 0, speed: 0, start: function(t2) {
          St.isScrolling = true, bt.default.cancel(St.i), t2.autoScroll = St, St.interaction = t2, St.prevTime = St.now(), St.i = bt.default.request(St.scroll);
        }, stop: function() {
          St.isScrolling = false, St.interaction && (St.interaction.autoScroll = null), bt.default.cancel(St.i);
        }, scroll: function() {
          var t2 = St.interaction, e2 = t2.interactable, n2 = t2.element, r2 = t2.prepared.name, i2 = e2.options[r2].autoScroll, a2 = Mt(i2.container, e2, n2), s2 = St.now(), l2 = (s2 - St.prevTime) / 1e3, c2 = i2.speed * l2;
          if (c2 >= 1) {
            var u2 = { x: St.x * c2, y: St.y * c2 };
            if (u2.x || u2.y) {
              var d2 = Ot(a2);
              o.default.window(a2) ? a2.scrollBy(u2.x, u2.y) : a2 && (a2.scrollLeft += u2.x, a2.scrollTop += u2.y);
              var f2 = Ot(a2), p2 = { x: f2.x - d2.x, y: f2.y - d2.y };
              (p2.x || p2.y) && e2.fire({ type: "autoscroll", target: n2, interactable: e2, delta: p2, interaction: t2, container: a2 });
            }
            St.prevTime = s2;
          }
          St.isScrolling && (bt.default.cancel(St.i), St.i = bt.default.request(St.scroll));
        }, check: function(t2, e2) {
          var n2;
          return (n2 = t2.options[e2].autoScroll) == null ? void 0 : n2.enabled;
        }, onInteractionMove: function(t2) {
          var e2 = t2.interaction, n2 = t2.pointer;
          if (e2.interacting() && St.check(e2.interactable, e2.prepared.name))
            if (e2.simulation)
              St.x = St.y = 0;
            else {
              var r2, i2, a2, s2, l2 = e2.interactable, c2 = e2.element, u2 = e2.prepared.name, d2 = l2.options[u2].autoScroll, f2 = Mt(d2.container, l2, c2);
              if (o.default.window(f2))
                s2 = n2.clientX < St.margin, r2 = n2.clientY < St.margin, i2 = n2.clientX > f2.innerWidth - St.margin, a2 = n2.clientY > f2.innerHeight - St.margin;
              else {
                var p2 = _.getElementClientRect(f2);
                s2 = n2.clientX < p2.left + St.margin, r2 = n2.clientY < p2.top + St.margin, i2 = n2.clientX > p2.right - St.margin, a2 = n2.clientY > p2.bottom - St.margin;
              }
              St.x = i2 ? 1 : s2 ? -1 : 0, St.y = a2 ? 1 : r2 ? -1 : 0, St.isScrolling || (St.margin = d2.margin, St.speed = d2.speed, St.start(e2));
            }
        } };
        function Mt(t2, n2, r2) {
          return (o.default.string(t2) ? (0, I.getStringOptionResult)(t2, n2, r2) : t2) || (0, e.getWindow)(r2);
        }
        function Ot(t2) {
          return o.default.window(t2) && (t2 = window.document.body), { x: t2.scrollLeft, y: t2.scrollTop };
        }
        var Tt = { id: "auto-scroll", install: function(t2) {
          var e2 = t2.defaults, n2 = t2.actions;
          t2.autoScroll = St, St.now = function() {
            return t2.now();
          }, n2.phaselessTypes.autoscroll = true, e2.perAction.autoScroll = St.defaults;
        }, listeners: { "interactions:new": function(t2) {
          t2.interaction.autoScroll = null;
        }, "interactions:destroy": function(t2) {
          t2.interaction.autoScroll = null, St.stop(), St.interaction && (St.interaction = null);
        }, "interactions:stop": St.stop, "interactions:action-move": function(t2) {
          return St.onInteractionMove(t2);
        } } };
        Et.default = Tt;
        var It = {};
        Object.defineProperty(It, "__esModule", { value: true }), It.warnOnce = function(t2, n2) {
          var r2 = false;
          return function() {
            return r2 || (e.window.console.warn(n2), r2 = true), t2.apply(this, arguments);
          };
        }, It.copyAction = function(t2, e2) {
          return t2.name = e2.name, t2.axis = e2.axis, t2.edges = e2.edges, t2;
        };
        var Dt = {};
        function jt(t2) {
          return o.default.bool(t2) ? (this.options.styleCursor = t2, this) : t2 === null ? (delete this.options.styleCursor, this) : this.options.styleCursor;
        }
        function zt(t2) {
          return o.default.func(t2) ? (this.options.actionChecker = t2, this) : t2 === null ? (delete this.options.actionChecker, this) : this.options.actionChecker;
        }
        Object.defineProperty(Dt, "__esModule", { value: true }), Dt.default = void 0;
        var At = { id: "auto-start/interactableMethods", install: function(t2) {
          var e2 = t2.Interactable;
          e2.prototype.getAction = function(e3, n2, r2, i2) {
            var o2 = function(t3, e4, n3, r3, i3) {
              var o3 = t3.getRect(r3), a2 = { action: null, interactable: t3, interaction: n3, element: r3, rect: o3, buttons: e4.buttons || { 0: 1, 1: 4, 3: 8, 4: 16 }[e4.button] };
              return i3.fire("auto-start:check", a2), a2.action;
            }(this, n2, r2, i2, t2);
            return this.options.actionChecker ? this.options.actionChecker(e3, n2, o2, this, i2, r2) : o2;
          }, e2.prototype.ignoreFrom = (0, It.warnOnce)(function(t3) {
            return this._backCompatOption("ignoreFrom", t3);
          }, "Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."), e2.prototype.allowFrom = (0, It.warnOnce)(function(t3) {
            return this._backCompatOption("allowFrom", t3);
          }, "Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."), e2.prototype.actionChecker = zt, e2.prototype.styleCursor = jt;
        } };
        Dt.default = At;
        var Ct = {};
        function kt(t2, e2, n2, r2, i2) {
          return e2.testIgnoreAllow(e2.options[t2.name], n2, r2) && e2.options[t2.name].enabled && Yt(e2, n2, t2, i2) ? t2 : null;
        }
        function Rt(t2, e2, n2, r2, i2, o2, a2) {
          for (var s2 = 0, l2 = r2.length; s2 < l2; s2++) {
            var c2 = r2[s2], u2 = i2[s2], d2 = c2.getAction(e2, n2, t2, u2);
            if (d2) {
              var f2 = kt(d2, c2, u2, o2, a2);
              if (f2)
                return { action: f2, interactable: c2, element: u2 };
            }
          }
          return { action: null, interactable: null, element: null };
        }
        function Ft(t2, e2, n2, r2, i2) {
          var a2 = [], s2 = [], l2 = r2;
          function c2(t3) {
            a2.push(t3), s2.push(l2);
          }
          for (; o.default.element(l2); ) {
            a2 = [], s2 = [], i2.interactables.forEachMatch(l2, c2);
            var u2 = Rt(t2, e2, n2, a2, s2, r2, i2);
            if (u2.action && !u2.interactable.options[u2.action.name].manualStart)
              return u2;
            l2 = _.parentNode(l2);
          }
          return { action: null, interactable: null, element: null };
        }
        function Xt(t2, e2, n2) {
          var r2 = e2.action, i2 = e2.interactable, o2 = e2.element;
          r2 = r2 || { name: null }, t2.interactable = i2, t2.element = o2, (0, It.copyAction)(t2.prepared, r2), t2.rect = i2 && r2.name ? i2.getRect(o2) : null, Lt(t2, n2), n2.fire("autoStart:prepared", { interaction: t2 });
        }
        function Yt(t2, e2, n2, r2) {
          var i2 = t2.options, o2 = i2[n2.name].max, a2 = i2[n2.name].maxPerElement, s2 = r2.autoStart.maxInteractions, l2 = 0, c2 = 0, u2 = 0;
          if (!(o2 && a2 && s2))
            return false;
          for (var d2 = 0; d2 < r2.interactions.list.length; d2++) {
            var f2 = r2.interactions.list[d2], p2 = f2.prepared.name;
            if (f2.interacting()) {
              if (++l2 >= s2)
                return false;
              if (f2.interactable === t2) {
                if ((c2 += p2 === n2.name ? 1 : 0) >= o2)
                  return false;
                if (f2.element === e2 && (u2++, p2 === n2.name && u2 >= a2))
                  return false;
              }
            }
          }
          return s2 > 0;
        }
        function Wt(t2, e2) {
          return o.default.number(t2) ? (e2.autoStart.maxInteractions = t2, this) : e2.autoStart.maxInteractions;
        }
        function Bt(t2, e2, n2) {
          var r2 = n2.autoStart.cursorElement;
          r2 && r2 !== t2 && (r2.style.cursor = ""), t2.ownerDocument.documentElement.style.cursor = e2, t2.style.cursor = e2, n2.autoStart.cursorElement = e2 ? t2 : null;
        }
        function Lt(t2, e2) {
          var n2 = t2.interactable, r2 = t2.element, i2 = t2.prepared;
          if (t2.pointerType === "mouse" && n2 && n2.options.styleCursor) {
            var a2 = "";
            if (i2.name) {
              var s2 = n2.options[i2.name].cursorChecker;
              a2 = o.default.func(s2) ? s2(i2, n2, r2, t2._interacting) : e2.actions.map[i2.name].getCursor(i2);
            }
            Bt(t2.element, a2 || "", e2);
          } else
            e2.autoStart.cursorElement && Bt(e2.autoStart.cursorElement, "", e2);
        }
        Object.defineProperty(Ct, "__esModule", { value: true }), Ct.default = void 0;
        var Nt = { id: "auto-start/base", before: ["actions"], install: function(t2) {
          var e2 = t2.interactStatic, n2 = t2.defaults;
          t2.usePlugin(Dt.default), n2.base.actionChecker = null, n2.base.styleCursor = true, (0, T.default)(n2.perAction, { manualStart: false, max: 1 / 0, maxPerElement: 1, allowFrom: null, ignoreFrom: null, mouseButtons: 1 }), e2.maxInteractions = function(e3) {
            return Wt(e3, t2);
          }, t2.autoStart = { maxInteractions: 1 / 0, withinInteractionLimit: Yt, cursorElement: null };
        }, listeners: { "interactions:down": function(t2, e2) {
          var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget;
          n2.interacting() || Xt(n2, Ft(n2, r2, i2, o2, e2), e2);
        }, "interactions:move": function(t2, e2) {
          !function(t3, e3) {
            var n2 = t3.interaction, r2 = t3.pointer, i2 = t3.event, o2 = t3.eventTarget;
            n2.pointerType !== "mouse" || n2.pointerIsDown || n2.interacting() || Xt(n2, Ft(n2, r2, i2, o2, e3), e3);
          }(t2, e2), function(t3, e3) {
            var n2 = t3.interaction;
            if (n2.pointerIsDown && !n2.interacting() && n2.pointerWasMoved && n2.prepared.name) {
              e3.fire("autoStart:before-start", t3);
              var r2 = n2.interactable, i2 = n2.prepared.name;
              i2 && r2 && (r2.options[i2].manualStart || !Yt(r2, n2.element, n2.prepared, e3) ? n2.stop() : (n2.start(n2.prepared, r2, n2.element), Lt(n2, e3)));
            }
          }(t2, e2);
        }, "interactions:stop": function(t2, e2) {
          var n2 = t2.interaction, r2 = n2.interactable;
          r2 && r2.options.styleCursor && Bt(n2.element, "", e2);
        } }, maxInteractions: Wt, withinInteractionLimit: Yt, validateAction: kt };
        Ct.default = Nt;
        var Vt = {};
        Object.defineProperty(Vt, "__esModule", { value: true }), Vt.default = void 0;
        var qt = { id: "auto-start/dragAxis", listeners: { "autoStart:before-start": function(t2, e2) {
          var n2 = t2.interaction, r2 = t2.eventTarget, i2 = t2.dx, a2 = t2.dy;
          if (n2.prepared.name === "drag") {
            var s2 = Math.abs(i2), l2 = Math.abs(a2), c2 = n2.interactable.options.drag, u2 = c2.startAxis, d2 = s2 > l2 ? "x" : s2 < l2 ? "y" : "xy";
            if (n2.prepared.axis = c2.lockAxis === "start" ? d2[0] : c2.lockAxis, d2 !== "xy" && u2 !== "xy" && u2 !== d2) {
              n2.prepared.name = null;
              for (var f2 = r2, p2 = function(t3) {
                if (t3 !== n2.interactable) {
                  var i3 = n2.interactable.options.drag;
                  if (!i3.manualStart && t3.testIgnoreAllow(i3, f2, r2)) {
                    var o2 = t3.getAction(n2.downPointer, n2.downEvent, n2, f2);
                    if (o2 && o2.name === "drag" && function(t4, e3) {
                      if (!e3)
                        return false;
                      var n3 = e3.options.drag.startAxis;
                      return t4 === "xy" || n3 === "xy" || n3 === t4;
                    }(d2, t3) && Ct.default.validateAction(o2, t3, f2, r2, e2))
                      return t3;
                  }
                }
              }; o.default.element(f2); ) {
                var v2 = e2.interactables.forEachMatch(f2, p2);
                if (v2) {
                  n2.prepared.name = "drag", n2.interactable = v2, n2.element = f2;
                  break;
                }
                f2 = (0, _.parentNode)(f2);
              }
            }
          }
        } } };
        Vt.default = qt;
        var Ut = {};
        function Gt(t2) {
          var e2 = t2.prepared && t2.prepared.name;
          if (!e2)
            return null;
          var n2 = t2.interactable.options;
          return n2[e2].hold || n2[e2].delay;
        }
        Object.defineProperty(Ut, "__esModule", { value: true }), Ut.default = void 0;
        var Ht = { id: "auto-start/hold", install: function(t2) {
          var e2 = t2.defaults;
          t2.usePlugin(Ct.default), e2.perAction.hold = 0, e2.perAction.delay = 0;
        }, listeners: { "interactions:new": function(t2) {
          t2.interaction.autoStartHoldTimer = null;
        }, "autoStart:prepared": function(t2) {
          var e2 = t2.interaction, n2 = Gt(e2);
          n2 > 0 && (e2.autoStartHoldTimer = setTimeout(function() {
            e2.start(e2.prepared, e2.interactable, e2.element);
          }, n2));
        }, "interactions:move": function(t2) {
          var e2 = t2.interaction, n2 = t2.duplicate;
          e2.autoStartHoldTimer && e2.pointerWasMoved && !n2 && (clearTimeout(e2.autoStartHoldTimer), e2.autoStartHoldTimer = null);
        }, "autoStart:before-start": function(t2) {
          var e2 = t2.interaction;
          Gt(e2) > 0 && (e2.prepared.name = null);
        } }, getHoldDuration: Gt };
        Ut.default = Ht;
        var $t = {};
        Object.defineProperty($t, "__esModule", { value: true }), $t.default = void 0;
        var Kt = { id: "auto-start", install: function(t2) {
          t2.usePlugin(Ct.default), t2.usePlugin(Ut.default), t2.usePlugin(Vt.default);
        } };
        $t.default = Kt;
        var Zt = {};
        Object.defineProperty(Zt, "__esModule", { value: true }), Zt.default = void 0, Zt.default = {};
        var Jt = {};
        function Qt(t2) {
          return /^(always|never|auto)$/.test(t2) ? (this.options.preventDefault = t2, this) : o.default.bool(t2) ? (this.options.preventDefault = t2 ? "always" : "never", this) : this.options.preventDefault;
        }
        function te(t2) {
          var e2 = t2.interaction, n2 = t2.event;
          e2.interactable && e2.interactable.checkAndPreventDefault(n2);
        }
        function ee(t2) {
          var n2 = t2.Interactable;
          n2.prototype.preventDefault = Qt, n2.prototype.checkAndPreventDefault = function(n3) {
            return function(t3, n4, r2) {
              var i2 = t3.options.preventDefault;
              if (i2 !== "never")
                if (i2 !== "always") {
                  if (n4.events.supportsPassive && /^touch(start|move)$/.test(r2.type)) {
                    var a2 = (0, e.getWindow)(r2.target).document, s2 = n4.getDocOptions(a2);
                    if (!s2 || !s2.events || s2.events.passive !== false)
                      return;
                  }
                  /^(mouse|pointer|touch)*(down|start)/i.test(r2.type) || o.default.element(r2.target) && (0, _.matchesSelector)(r2.target, "input,select,textarea,[contenteditable=true],[contenteditable=true] *") || r2.preventDefault();
                } else
                  r2.preventDefault();
            }(this, t2, n3);
          }, t2.interactions.docEvents.push({ type: "dragstart", listener: function(e2) {
            for (var n3 = 0; n3 < t2.interactions.list.length; n3++) {
              var r2 = t2.interactions.list[n3];
              if (r2.element && (r2.element === e2.target || (0, _.nodeContains)(r2.element, e2.target)))
                return void r2.interactable.checkAndPreventDefault(e2);
            }
          } });
        }
        Object.defineProperty(Jt, "__esModule", { value: true }), Jt.install = ee, Jt.default = void 0;
        var ne = { id: "core/interactablePreventDefault", install: ee, listeners: ["down", "move", "up", "cancel"].reduce(function(t2, e2) {
          return t2["interactions:" + e2] = te, t2;
        }, {}) };
        Jt.default = ne;
        var re, ie = {};
        Object.defineProperty(ie, "__esModule", { value: true }), ie.default = void 0, function(t2) {
          t2.touchAction = "touchAction", t2.boxSizing = "boxSizing", t2.noListeners = "noListeners";
        }(re || (re = {}));
        var oe = "[interact.js] ", ae = { touchAction: "https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action", boxSizing: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing" }, se = [{ name: re.touchAction, perform: function(t2) {
          return !function(t3, e2, n2) {
            for (var r2 = t3; o.default.element(r2); ) {
              if (le(r2, "touchAction", n2))
                return true;
              r2 = (0, _.parentNode)(r2);
            }
            return false;
          }(t2.element, 0, /pan-|pinch|none/);
        }, getInfo: function(t2) {
          return [t2.element, ae.touchAction];
        }, text: 'Consider adding CSS "touch-action: none" to this element\n' }, { name: re.boxSizing, perform: function(t2) {
          var e2 = t2.element;
          return t2.prepared.name === "resize" && e2 instanceof v.default.HTMLElement && !le(e2, "boxSizing", /border-box/);
        }, text: 'Consider adding CSS "box-sizing: border-box" to this resizable element', getInfo: function(t2) {
          return [t2.element, ae.boxSizing];
        } }, { name: re.noListeners, perform: function(t2) {
          var e2 = t2.prepared.name;
          return !(t2.interactable.events.types[e2 + "move"] || []).length;
        }, getInfo: function(t2) {
          return [t2.prepared.name, t2.interactable];
        }, text: "There are no listeners set for this action" }];
        function le(t2, n2, r2) {
          var i2 = t2.style[n2] || e.window.getComputedStyle(t2)[n2];
          return r2.test((i2 || "").toString());
        }
        var ce = { id: "dev-tools", install: function(t2, e2) {
          var n2 = (e2 === void 0 ? {} : e2).logger, r2 = t2.Interactable, i2 = t2.defaults;
          t2.logger = n2 || console, i2.base.devTools = { ignore: {} }, r2.prototype.devTools = function(t3) {
            return t3 ? ((0, T.default)(this.options.devTools, t3), this) : this.options.devTools;
          };
        }, listeners: { "interactions:action-start": function(t2, e2) {
          for (var n2 = t2.interaction, r2 = 0; r2 < se.length; r2++) {
            var i2, o2 = se[r2], a2 = n2.interactable && n2.interactable.options;
            a2 && a2.devTools && a2.devTools.ignore[o2.name] || !o2.perform(n2) || (i2 = e2.logger).warn.apply(i2, [oe + o2.text].concat(o2.getInfo(n2)));
          }
        } }, checks: se, CheckName: re, links: ae, prefix: oe };
        ie.default = ce;
        var ue = {};
        Object.defineProperty(ue, "__esModule", { value: true }), ue.default = void 0, ue.default = {};
        var de = {};
        Object.defineProperty(de, "__esModule", { value: true }), de.default = function t2(e2) {
          var n2 = {};
          for (var r2 in e2) {
            var i2 = e2[r2];
            o.default.plainObject(i2) ? n2[r2] = t2(i2) : o.default.array(i2) ? n2[r2] = G.from(i2) : n2[r2] = i2;
          }
          return n2;
        };
        var fe = {};
        Object.defineProperty(fe, "__esModule", { value: true }), fe.getRectOffset = he, fe.default = void 0;
        var pe = function() {
          function t2(t3) {
            this.states = [], this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 }, this.startDelta = null, this.result = null, this.endResult = null, this.edges = void 0, this.interaction = void 0, this.interaction = t3, this.result = ve();
          }
          var e2 = t2.prototype;
          return e2.start = function(t3, e3) {
            var n2 = t3.phase, r2 = this.interaction, i2 = function(t4) {
              var e4 = t4.interactable.options[t4.prepared.name], n3 = e4.modifiers;
              return n3 && n3.length ? n3 : ["snap", "snapSize", "snapEdges", "restrict", "restrictEdges", "restrictSize"].map(function(t5) {
                var n4 = e4[t5];
                return n4 && n4.enabled && { options: n4, methods: n4._methods };
              }).filter(function(t5) {
                return !!t5;
              });
            }(r2);
            this.prepareStates(i2), this.edges = (0, T.default)({}, r2.edges), this.startOffset = he(r2.rect, e3), this.startDelta = { x: 0, y: 0 };
            var o2 = { phase: n2, pageCoords: e3, preEnd: false };
            return this.result = ve(), this.startAll(o2), this.result = this.setAll(o2);
          }, e2.fillArg = function(t3) {
            var e3 = this.interaction;
            t3.interaction = e3, t3.interactable = e3.interactable, t3.element = e3.element, t3.rect = t3.rect || e3.rect, t3.edges = this.edges, t3.startOffset = this.startOffset;
          }, e2.startAll = function(t3) {
            this.fillArg(t3);
            for (var e3 = 0; e3 < this.states.length; e3++) {
              var n2 = this.states[e3];
              n2.methods.start && (t3.state = n2, n2.methods.start(t3));
            }
          }, e2.setAll = function(t3) {
            this.fillArg(t3);
            var e3 = t3.phase, n2 = t3.preEnd, r2 = t3.skipModifiers, i2 = t3.rect;
            t3.coords = (0, T.default)({}, t3.pageCoords), t3.rect = (0, T.default)({}, i2);
            for (var o2 = r2 ? this.states.slice(r2) : this.states, a2 = ve(t3.coords, t3.rect), s2 = 0; s2 < o2.length; s2++) {
              var l2 = o2[s2], c2 = l2.options, u2 = (0, T.default)({}, t3.coords), d2 = null;
              l2.methods.set && this.shouldDo(c2, n2, e3) && (t3.state = l2, d2 = l2.methods.set(t3), I.addEdges(this.interaction.edges, t3.rect, { x: t3.coords.x - u2.x, y: t3.coords.y - u2.y })), a2.eventProps.push(d2);
            }
            a2.delta.x = t3.coords.x - t3.pageCoords.x, a2.delta.y = t3.coords.y - t3.pageCoords.y, a2.rectDelta.left = t3.rect.left - i2.left, a2.rectDelta.right = t3.rect.right - i2.right, a2.rectDelta.top = t3.rect.top - i2.top, a2.rectDelta.bottom = t3.rect.bottom - i2.bottom;
            var f2 = this.result.coords, p2 = this.result.rect;
            if (f2 && p2) {
              var v2 = a2.rect.left !== p2.left || a2.rect.right !== p2.right || a2.rect.top !== p2.top || a2.rect.bottom !== p2.bottom;
              a2.changed = v2 || f2.x !== a2.coords.x || f2.y !== a2.coords.y;
            }
            return a2;
          }, e2.applyToInteraction = function(t3) {
            var e3 = this.interaction, n2 = t3.phase, r2 = e3.coords.cur, i2 = e3.coords.start, o2 = this.result, a2 = this.startDelta, s2 = o2.delta;
            n2 === "start" && (0, T.default)(this.startDelta, o2.delta);
            for (var l2 = [[i2, a2], [r2, s2]], c2 = 0; c2 < l2.length; c2++) {
              var u2 = l2[c2], d2 = u2[0], f2 = u2[1];
              d2.page.x += f2.x, d2.page.y += f2.y, d2.client.x += f2.x, d2.client.y += f2.y;
            }
            var p2 = this.result.rectDelta, v2 = t3.rect || e3.rect;
            v2.left += p2.left, v2.right += p2.right, v2.top += p2.top, v2.bottom += p2.bottom, v2.width = v2.right - v2.left, v2.height = v2.bottom - v2.top;
          }, e2.setAndApply = function(t3) {
            var e3 = this.interaction, n2 = t3.phase, r2 = t3.preEnd, i2 = t3.skipModifiers, o2 = this.setAll({ preEnd: r2, phase: n2, pageCoords: t3.modifiedCoords || e3.coords.cur.page });
            if (this.result = o2, !o2.changed && (!i2 || i2 < this.states.length) && e3.interacting())
              return false;
            if (t3.modifiedCoords) {
              var a2 = e3.coords.cur.page, s2 = { x: t3.modifiedCoords.x - a2.x, y: t3.modifiedCoords.y - a2.y };
              o2.coords.x += s2.x, o2.coords.y += s2.y, o2.delta.x += s2.x, o2.delta.y += s2.y;
            }
            this.applyToInteraction(t3);
          }, e2.beforeEnd = function(t3) {
            var e3 = t3.interaction, n2 = t3.event, r2 = this.states;
            if (r2 && r2.length) {
              for (var i2 = false, o2 = 0; o2 < r2.length; o2++) {
                var a2 = r2[o2];
                t3.state = a2;
                var s2 = a2.options, l2 = a2.methods, c2 = l2.beforeEnd && l2.beforeEnd(t3);
                if (c2)
                  return this.endResult = c2, false;
                i2 = i2 || !i2 && this.shouldDo(s2, true, t3.phase, true);
              }
              i2 && e3.move({ event: n2, preEnd: true });
            }
          }, e2.stop = function(t3) {
            var e3 = t3.interaction;
            if (this.states && this.states.length) {
              var n2 = (0, T.default)({ states: this.states, interactable: e3.interactable, element: e3.element, rect: null }, t3);
              this.fillArg(n2);
              for (var r2 = 0; r2 < this.states.length; r2++) {
                var i2 = this.states[r2];
                n2.state = i2, i2.methods.stop && i2.methods.stop(n2);
              }
              this.states = null, this.endResult = null;
            }
          }, e2.prepareStates = function(t3) {
            this.states = [];
            for (var e3 = 0; e3 < t3.length; e3++) {
              var n2 = t3[e3], r2 = n2.options, i2 = n2.methods, o2 = n2.name;
              this.states.push({ options: r2, methods: i2, index: e3, name: o2 });
            }
            return this.states;
          }, e2.restoreInteractionCoords = function(t3) {
            var e3 = t3.interaction, n2 = e3.coords, r2 = e3.rect, i2 = e3.modification;
            if (i2.result) {
              for (var o2 = i2.startDelta, a2 = i2.result, s2 = a2.delta, l2 = a2.rectDelta, c2 = [[n2.start, o2], [n2.cur, s2]], u2 = 0; u2 < c2.length; u2++) {
                var d2 = c2[u2], f2 = d2[0], p2 = d2[1];
                f2.page.x -= p2.x, f2.page.y -= p2.y, f2.client.x -= p2.x, f2.client.y -= p2.y;
              }
              r2.left -= l2.left, r2.right -= l2.right, r2.top -= l2.top, r2.bottom -= l2.bottom;
            }
          }, e2.shouldDo = function(t3, e3, n2, r2) {
            return !(!t3 || t3.enabled === false || r2 && !t3.endOnly || t3.endOnly && !e3 || n2 === "start" && !t3.setStart);
          }, e2.copyFrom = function(t3) {
            this.startOffset = t3.startOffset, this.startDelta = t3.startDelta, this.edges = t3.edges, this.states = t3.states.map(function(t4) {
              return (0, de.default)(t4);
            }), this.result = ve((0, T.default)({}, t3.result.coords), (0, T.default)({}, t3.result.rect));
          }, e2.destroy = function() {
            for (var t3 in this)
              this[t3] = null;
          }, t2;
        }();
        function ve(t2, e2) {
          return { rect: e2, coords: t2, delta: { x: 0, y: 0 }, rectDelta: { left: 0, right: 0, top: 0, bottom: 0 }, eventProps: [], changed: true };
        }
        function he(t2, e2) {
          return t2 ? { left: e2.x - t2.left, top: e2.y - t2.top, right: t2.right - e2.x, bottom: t2.bottom - e2.y } : { left: 0, top: 0, right: 0, bottom: 0 };
        }
        fe.default = pe;
        var ge = {};
        function me(t2) {
          var e2 = t2.iEvent, n2 = t2.interaction.modification.result;
          n2 && (e2.modifiers = n2.eventProps);
        }
        Object.defineProperty(ge, "__esModule", { value: true }), ge.makeModifier = function(t2, e2) {
          var n2 = t2.defaults, r2 = { start: t2.start, set: t2.set, beforeEnd: t2.beforeEnd, stop: t2.stop }, i2 = function(t3) {
            var i3 = t3 || {};
            for (var o2 in i3.enabled = i3.enabled !== false, n2)
              o2 in i3 || (i3[o2] = n2[o2]);
            var a2 = { options: i3, methods: r2, name: e2, enable: function() {
              return i3.enabled = true, a2;
            }, disable: function() {
              return i3.enabled = false, a2;
            } };
            return a2;
          };
          return e2 && typeof e2 == "string" && (i2._defaults = n2, i2._methods = r2), i2;
        }, ge.addEventModifiers = me, ge.default = void 0;
        var ye = { id: "modifiers/base", before: ["actions"], install: function(t2) {
          t2.defaults.perAction.modifiers = [];
        }, listeners: { "interactions:new": function(t2) {
          var e2 = t2.interaction;
          e2.modification = new fe.default(e2);
        }, "interactions:before-action-start": function(t2) {
          var e2 = t2.interaction.modification;
          e2.start(t2, t2.interaction.coords.start.page), t2.interaction.edges = e2.edges, e2.applyToInteraction(t2);
        }, "interactions:before-action-move": function(t2) {
          return t2.interaction.modification.setAndApply(t2);
        }, "interactions:before-action-end": function(t2) {
          return t2.interaction.modification.beforeEnd(t2);
        }, "interactions:action-start": me, "interactions:action-move": me, "interactions:action-end": me, "interactions:after-action-start": function(t2) {
          return t2.interaction.modification.restoreInteractionCoords(t2);
        }, "interactions:after-action-move": function(t2) {
          return t2.interaction.modification.restoreInteractionCoords(t2);
        }, "interactions:stop": function(t2) {
          return t2.interaction.modification.stop(t2);
        } } };
        ge.default = ye;
        var be = {};
        Object.defineProperty(be, "__esModule", { value: true }), be.defaults = void 0, be.defaults = { base: { preventDefault: "auto", deltaSource: "page" }, perAction: { enabled: false, origin: { x: 0, y: 0 } }, actions: {} };
        var xe = {};
        Object.defineProperty(xe, "__esModule", { value: true }), xe.InteractEvent = void 0;
        var _e = function(t2) {
          var e2, n2;
          function r2(e3, n3, r3, i3, o2, a2, s2) {
            var l2;
            (l2 = t2.call(this, e3) || this).target = void 0, l2.currentTarget = void 0, l2.relatedTarget = null, l2.screenX = void 0, l2.screenY = void 0, l2.button = void 0, l2.buttons = void 0, l2.ctrlKey = void 0, l2.shiftKey = void 0, l2.altKey = void 0, l2.metaKey = void 0, l2.page = void 0, l2.client = void 0, l2.delta = void 0, l2.rect = void 0, l2.x0 = void 0, l2.y0 = void 0, l2.t0 = void 0, l2.dt = void 0, l2.duration = void 0, l2.clientX0 = void 0, l2.clientY0 = void 0, l2.velocity = void 0, l2.speed = void 0, l2.swipe = void 0, l2.timeStamp = void 0, l2.axes = void 0, l2.preEnd = void 0, o2 = o2 || e3.element;
            var c2 = e3.interactable, u2 = (c2 && c2.options || be.defaults).deltaSource, d2 = (0, j.default)(c2, o2, r3), f2 = i3 === "start", p2 = i3 === "end", v2 = f2 ? function(t3) {
              if (t3 === void 0)
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              return t3;
            }(l2) : e3.prevEvent, h2 = f2 ? e3.coords.start : p2 ? { page: v2.page, client: v2.client, timeStamp: e3.coords.cur.timeStamp } : e3.coords.cur;
            return l2.page = (0, T.default)({}, h2.page), l2.client = (0, T.default)({}, h2.client), l2.rect = (0, T.default)({}, e3.rect), l2.timeStamp = h2.timeStamp, p2 || (l2.page.x -= d2.x, l2.page.y -= d2.y, l2.client.x -= d2.x, l2.client.y -= d2.y), l2.ctrlKey = n3.ctrlKey, l2.altKey = n3.altKey, l2.shiftKey = n3.shiftKey, l2.metaKey = n3.metaKey, l2.button = n3.button, l2.buttons = n3.buttons, l2.target = o2, l2.currentTarget = o2, l2.preEnd = a2, l2.type = s2 || r3 + (i3 || ""), l2.interactable = c2, l2.t0 = f2 ? e3.pointers[e3.pointers.length - 1].downTime : v2.t0, l2.x0 = e3.coords.start.page.x - d2.x, l2.y0 = e3.coords.start.page.y - d2.y, l2.clientX0 = e3.coords.start.client.x - d2.x, l2.clientY0 = e3.coords.start.client.y - d2.y, l2.delta = f2 || p2 ? { x: 0, y: 0 } : { x: l2[u2].x - v2[u2].x, y: l2[u2].y - v2[u2].y }, l2.dt = e3.coords.delta.timeStamp, l2.duration = l2.timeStamp - l2.t0, l2.velocity = (0, T.default)({}, e3.coords.velocity[u2]), l2.speed = (0, C.default)(l2.velocity.x, l2.velocity.y), l2.swipe = p2 || i3 === "inertiastart" ? l2.getSwipe() : null, l2;
          }
          n2 = t2, (e2 = r2).prototype = Object.create(n2.prototype), e2.prototype.constructor = e2, e2.__proto__ = n2;
          var i2 = r2.prototype;
          return i2.getSwipe = function() {
            var t3 = this._interaction;
            if (t3.prevEvent.speed < 600 || this.timeStamp - t3.prevEvent.timeStamp > 150)
              return null;
            var e3 = 180 * Math.atan2(t3.prevEvent.velocityY, t3.prevEvent.velocityX) / Math.PI;
            e3 < 0 && (e3 += 360);
            var n3 = 112.5 <= e3 && e3 < 247.5, r3 = 202.5 <= e3 && e3 < 337.5;
            return { up: r3, down: !r3 && 22.5 <= e3 && e3 < 157.5, left: n3, right: !n3 && (292.5 <= e3 || e3 < 67.5), angle: e3, speed: t3.prevEvent.speed, velocity: { x: t3.prevEvent.velocityX, y: t3.prevEvent.velocityY } };
          }, i2.preventDefault = function() {
          }, i2.stopImmediatePropagation = function() {
            this.immediatePropagationStopped = this.propagationStopped = true;
          }, i2.stopPropagation = function() {
            this.propagationStopped = true;
          }, r2;
        }(q.BaseEvent);
        xe.InteractEvent = _e, Object.defineProperties(_e.prototype, { pageX: { get: function() {
          return this.page.x;
        }, set: function(t2) {
          this.page.x = t2;
        } }, pageY: { get: function() {
          return this.page.y;
        }, set: function(t2) {
          this.page.y = t2;
        } }, clientX: { get: function() {
          return this.client.x;
        }, set: function(t2) {
          this.client.x = t2;
        } }, clientY: { get: function() {
          return this.client.y;
        }, set: function(t2) {
          this.client.y = t2;
        } }, dx: { get: function() {
          return this.delta.x;
        }, set: function(t2) {
          this.delta.x = t2;
        } }, dy: { get: function() {
          return this.delta.y;
        }, set: function(t2) {
          this.delta.y = t2;
        } }, velocityX: { get: function() {
          return this.velocity.x;
        }, set: function(t2) {
          this.velocity.x = t2;
        } }, velocityY: { get: function() {
          return this.velocity.y;
        }, set: function(t2) {
          this.velocity.y = t2;
        } } });
        var we = {};
        Object.defineProperty(we, "__esModule", { value: true }), we.PointerInfo = void 0, we.PointerInfo = function(t2, e2, n2, r2, i2) {
          this.id = void 0, this.pointer = void 0, this.event = void 0, this.downTime = void 0, this.downTarget = void 0, this.id = t2, this.pointer = e2, this.event = n2, this.downTime = r2, this.downTarget = i2;
        };
        var Pe, Ee, Se = {};
        function Me(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t2, r2.key, r2);
          }
        }
        Object.defineProperty(Se, "__esModule", { value: true }), Object.defineProperty(Se, "PointerInfo", { enumerable: true, get: function() {
          return we.PointerInfo;
        } }), Se.default = Se.Interaction = Se._ProxyMethods = Se._ProxyValues = void 0, Se._ProxyValues = Pe, function(t2) {
          t2.interactable = "", t2.element = "", t2.prepared = "", t2.pointerIsDown = "", t2.pointerWasMoved = "", t2._proxy = "";
        }(Pe || (Se._ProxyValues = Pe = {})), Se._ProxyMethods = Ee, function(t2) {
          t2.start = "", t2.move = "", t2.end = "", t2.stop = "", t2.interacting = "";
        }(Ee || (Se._ProxyMethods = Ee = {}));
        var Oe = 0, Te = function() {
          var t2, e2;
          function n2(t3) {
            var e3 = this, n3 = t3.pointerType, r3 = t3.scopeFire;
            this.interactable = null, this.element = null, this.rect = void 0, this._rects = void 0, this.edges = void 0, this._scopeFire = void 0, this.prepared = { name: null, axis: null, edges: null }, this.pointerType = void 0, this.pointers = [], this.downEvent = null, this.downPointer = {}, this._latestPointer = { pointer: null, event: null, eventTarget: null }, this.prevEvent = null, this.pointerIsDown = false, this.pointerWasMoved = false, this._interacting = false, this._ending = false, this._stopped = true, this._proxy = null, this.simulation = null, this.doMove = (0, It.warnOnce)(function(t4) {
              this.move(t4);
            }, "The interaction.doMove() method has been renamed to interaction.move()"), this.coords = { start: X.newCoords(), prev: X.newCoords(), cur: X.newCoords(), delta: X.newCoords(), velocity: X.newCoords() }, this._id = Oe++, this._scopeFire = r3, this.pointerType = n3;
            var i2 = this;
            this._proxy = {};
            var o2 = function(t4) {
              Object.defineProperty(e3._proxy, t4, { get: function() {
                return i2[t4];
              } });
            };
            for (var a2 in Pe)
              o2(a2);
            var s2 = function(t4) {
              Object.defineProperty(e3._proxy, t4, { value: function() {
                return i2[t4].apply(i2, arguments);
              } });
            };
            for (var l2 in Ee)
              s2(l2);
            this._scopeFire("interactions:new", { interaction: this });
          }
          t2 = n2, (e2 = [{ key: "pointerMoveTolerance", get: function() {
            return 1;
          } }]) && Me(t2.prototype, e2);
          var r2 = n2.prototype;
          return r2.pointerDown = function(t3, e3, n3) {
            var r3 = this.updatePointer(t3, e3, n3, true), i2 = this.pointers[r3];
            this._scopeFire("interactions:down", { pointer: t3, event: e3, eventTarget: n3, pointerIndex: r3, pointerInfo: i2, type: "down", interaction: this });
          }, r2.start = function(t3, e3, n3) {
            return !(this.interacting() || !this.pointerIsDown || this.pointers.length < (t3.name === "gesture" ? 2 : 1) || !e3.options[t3.name].enabled) && ((0, It.copyAction)(this.prepared, t3), this.interactable = e3, this.element = n3, this.rect = e3.getRect(n3), this.edges = this.prepared.edges ? (0, T.default)({}, this.prepared.edges) : { left: true, right: true, top: true, bottom: true }, this._stopped = false, this._interacting = this._doPhase({ interaction: this, event: this.downEvent, phase: "start" }) && !this._stopped, this._interacting);
          }, r2.pointerMove = function(t3, e3, n3) {
            this.simulation || this.modification && this.modification.endResult || this.updatePointer(t3, e3, n3, false);
            var r3, i2, o2 = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
            this.pointerIsDown && !this.pointerWasMoved && (r3 = this.coords.cur.client.x - this.coords.start.client.x, i2 = this.coords.cur.client.y - this.coords.start.client.y, this.pointerWasMoved = (0, C.default)(r3, i2) > this.pointerMoveTolerance);
            var a2 = this.getPointerIndex(t3), s2 = { pointer: t3, pointerIndex: a2, pointerInfo: this.pointers[a2], event: e3, type: "move", eventTarget: n3, dx: r3, dy: i2, duplicate: o2, interaction: this };
            o2 || X.setCoordVelocity(this.coords.velocity, this.coords.delta), this._scopeFire("interactions:move", s2), o2 || this.simulation || (this.interacting() && (s2.type = null, this.move(s2)), this.pointerWasMoved && X.copyCoords(this.coords.prev, this.coords.cur));
          }, r2.move = function(t3) {
            t3 && t3.event || X.setZeroCoords(this.coords.delta), (t3 = (0, T.default)({ pointer: this._latestPointer.pointer, event: this._latestPointer.event, eventTarget: this._latestPointer.eventTarget, interaction: this }, t3 || {})).phase = "move", this._doPhase(t3);
          }, r2.pointerUp = function(t3, e3, n3, r3) {
            var i2 = this.getPointerIndex(t3);
            i2 === -1 && (i2 = this.updatePointer(t3, e3, n3, false));
            var o2 = /cancel$/i.test(e3.type) ? "cancel" : "up";
            this._scopeFire("interactions:" + o2, { pointer: t3, pointerIndex: i2, pointerInfo: this.pointers[i2], event: e3, eventTarget: n3, type: o2, curEventTarget: r3, interaction: this }), this.simulation || this.end(e3), this.removePointer(t3, e3);
          }, r2.documentBlur = function(t3) {
            this.end(t3), this._scopeFire("interactions:blur", { event: t3, type: "blur", interaction: this });
          }, r2.end = function(t3) {
            var e3;
            this._ending = true, t3 = t3 || this._latestPointer.event, this.interacting() && (e3 = this._doPhase({ event: t3, interaction: this, phase: "end" })), this._ending = false, e3 === true && this.stop();
          }, r2.currentAction = function() {
            return this._interacting ? this.prepared.name : null;
          }, r2.interacting = function() {
            return this._interacting;
          }, r2.stop = function() {
            this._scopeFire("interactions:stop", { interaction: this }), this.interactable = this.element = null, this._interacting = false, this._stopped = true, this.prepared.name = this.prevEvent = null;
          }, r2.getPointerIndex = function(t3) {
            var e3 = X.getPointerId(t3);
            return this.pointerType === "mouse" || this.pointerType === "pen" ? this.pointers.length - 1 : G.findIndex(this.pointers, function(t4) {
              return t4.id === e3;
            });
          }, r2.getPointerInfo = function(t3) {
            return this.pointers[this.getPointerIndex(t3)];
          }, r2.updatePointer = function(t3, e3, n3, r3) {
            var i2 = X.getPointerId(t3), o2 = this.getPointerIndex(t3), a2 = this.pointers[o2];
            return r3 = r3 !== false && (r3 || /(down|start)$/i.test(e3.type)), a2 ? a2.pointer = t3 : (a2 = new we.PointerInfo(i2, t3, e3, null, null), o2 = this.pointers.length, this.pointers.push(a2)), X.setCoords(this.coords.cur, this.pointers.map(function(t4) {
              return t4.pointer;
            }), this._now()), X.setCoordDeltas(this.coords.delta, this.coords.prev, this.coords.cur), r3 && (this.pointerIsDown = true, a2.downTime = this.coords.cur.timeStamp, a2.downTarget = n3, X.pointerExtend(this.downPointer, t3), this.interacting() || (X.copyCoords(this.coords.start, this.coords.cur), X.copyCoords(this.coords.prev, this.coords.cur), this.downEvent = e3, this.pointerWasMoved = false)), this._updateLatestPointer(t3, e3, n3), this._scopeFire("interactions:update-pointer", { pointer: t3, event: e3, eventTarget: n3, down: r3, pointerInfo: a2, pointerIndex: o2, interaction: this }), o2;
          }, r2.removePointer = function(t3, e3) {
            var n3 = this.getPointerIndex(t3);
            if (n3 !== -1) {
              var r3 = this.pointers[n3];
              this._scopeFire("interactions:remove-pointer", { pointer: t3, event: e3, eventTarget: null, pointerIndex: n3, pointerInfo: r3, interaction: this }), this.pointers.splice(n3, 1), this.pointerIsDown = false;
            }
          }, r2._updateLatestPointer = function(t3, e3, n3) {
            this._latestPointer.pointer = t3, this._latestPointer.event = e3, this._latestPointer.eventTarget = n3;
          }, r2.destroy = function() {
            this._latestPointer.pointer = null, this._latestPointer.event = null, this._latestPointer.eventTarget = null;
          }, r2._createPreparedEvent = function(t3, e3, n3, r3) {
            return new xe.InteractEvent(this, t3, this.prepared.name, e3, this.element, n3, r3);
          }, r2._fireEvent = function(t3) {
            this.interactable.fire(t3), (!this.prevEvent || t3.timeStamp >= this.prevEvent.timeStamp) && (this.prevEvent = t3);
          }, r2._doPhase = function(t3) {
            var e3 = t3.event, n3 = t3.phase, r3 = t3.preEnd, i2 = t3.type, o2 = this.rect;
            if (o2 && n3 === "move" && (I.addEdges(this.edges, o2, this.coords.delta[this.interactable.options.deltaSource]), o2.width = o2.right - o2.left, o2.height = o2.bottom - o2.top), this._scopeFire("interactions:before-action-" + n3, t3) === false)
              return false;
            var a2 = t3.iEvent = this._createPreparedEvent(e3, n3, r3, i2);
            return this._scopeFire("interactions:action-" + n3, t3), n3 === "start" && (this.prevEvent = a2), this._fireEvent(a2), this._scopeFire("interactions:after-action-" + n3, t3), true;
          }, r2._now = function() {
            return Date.now();
          }, n2;
        }();
        Se.Interaction = Te;
        var Ie = Te;
        Se.default = Ie;
        var De = {};
        function je(t2) {
          t2.pointerIsDown && (ke(t2.coords.cur, t2.offset.total), t2.offset.pending.x = 0, t2.offset.pending.y = 0);
        }
        function ze(t2) {
          Ae(t2.interaction);
        }
        function Ae(t2) {
          if (!function(t3) {
            return !(!t3.offset.pending.x && !t3.offset.pending.y);
          }(t2))
            return false;
          var e2 = t2.offset.pending;
          return ke(t2.coords.cur, e2), ke(t2.coords.delta, e2), I.addEdges(t2.edges, t2.rect, e2), e2.x = 0, e2.y = 0, true;
        }
        function Ce(t2) {
          var e2 = t2.x, n2 = t2.y;
          this.offset.pending.x += e2, this.offset.pending.y += n2, this.offset.total.x += e2, this.offset.total.y += n2;
        }
        function ke(t2, e2) {
          var n2 = t2.page, r2 = t2.client, i2 = e2.x, o2 = e2.y;
          n2.x += i2, n2.y += o2, r2.x += i2, r2.y += o2;
        }
        Object.defineProperty(De, "__esModule", { value: true }), De.addTotal = je, De.applyPending = Ae, De.default = void 0, Se._ProxyMethods.offsetBy = "";
        var Re = { id: "offset", before: ["modifiers", "pointer-events", "actions", "inertia"], install: function(t2) {
          t2.Interaction.prototype.offsetBy = Ce;
        }, listeners: { "interactions:new": function(t2) {
          t2.interaction.offset = { total: { x: 0, y: 0 }, pending: { x: 0, y: 0 } };
        }, "interactions:update-pointer": function(t2) {
          return je(t2.interaction);
        }, "interactions:before-action-start": ze, "interactions:before-action-move": ze, "interactions:before-action-end": function(t2) {
          var e2 = t2.interaction;
          if (Ae(e2))
            return e2.move({ offset: true }), e2.end(), false;
        }, "interactions:stop": function(t2) {
          var e2 = t2.interaction;
          e2.offset.total.x = 0, e2.offset.total.y = 0, e2.offset.pending.x = 0, e2.offset.pending.y = 0;
        } } };
        De.default = Re;
        var Fe = {};
        Object.defineProperty(Fe, "__esModule", { value: true }), Fe.default = Fe.InertiaState = void 0;
        var Xe = function() {
          function t2(t3) {
            this.active = false, this.isModified = false, this.smoothEnd = false, this.allowResume = false, this.modification = null, this.modifierCount = 0, this.modifierArg = null, this.startCoords = null, this.t0 = 0, this.v0 = 0, this.te = 0, this.targetOffset = null, this.modifiedOffset = null, this.currentOffset = null, this.lambda_v0 = 0, this.one_ve_v0 = 0, this.timeout = null, this.interaction = void 0, this.interaction = t3;
          }
          var e2 = t2.prototype;
          return e2.start = function(t3) {
            var e3 = this.interaction, n2 = Ye(e3);
            if (!n2 || !n2.enabled)
              return false;
            var r2 = e3.coords.velocity.client, i2 = (0, C.default)(r2.x, r2.y), o2 = this.modification || (this.modification = new fe.default(e3));
            if (o2.copyFrom(e3.modification), this.t0 = e3._now(), this.allowResume = n2.allowResume, this.v0 = i2, this.currentOffset = { x: 0, y: 0 }, this.startCoords = e3.coords.cur.page, this.modifierArg = { interaction: e3, interactable: e3.interactable, element: e3.element, rect: e3.rect, edges: e3.edges, pageCoords: this.startCoords, preEnd: true, phase: "inertiastart" }, this.t0 - e3.coords.cur.timeStamp < 50 && i2 > n2.minSpeed && i2 > n2.endSpeed)
              this.startInertia();
            else {
              if (o2.result = o2.setAll(this.modifierArg), !o2.result.changed)
                return false;
              this.startSmoothEnd();
            }
            return e3.modification.result.rect = null, e3.offsetBy(this.targetOffset), e3._doPhase({ interaction: e3, event: t3, phase: "inertiastart" }), e3.offsetBy({ x: -this.targetOffset.x, y: -this.targetOffset.y }), e3.modification.result.rect = null, this.active = true, e3.simulation = this, true;
          }, e2.startInertia = function() {
            var t3 = this, e3 = this.interaction.coords.velocity.client, n2 = Ye(this.interaction), r2 = n2.resistance, i2 = -Math.log(n2.endSpeed / this.v0) / r2;
            this.targetOffset = { x: (e3.x - i2) / r2, y: (e3.y - i2) / r2 }, this.te = i2, this.lambda_v0 = r2 / this.v0, this.one_ve_v0 = 1 - n2.endSpeed / this.v0;
            var o2 = this.modification, a2 = this.modifierArg;
            a2.pageCoords = { x: this.startCoords.x + this.targetOffset.x, y: this.startCoords.y + this.targetOffset.y }, o2.result = o2.setAll(a2), o2.result.changed && (this.isModified = true, this.modifiedOffset = { x: this.targetOffset.x + o2.result.delta.x, y: this.targetOffset.y + o2.result.delta.y }), this.onNextFrame(function() {
              return t3.inertiaTick();
            });
          }, e2.startSmoothEnd = function() {
            var t3 = this;
            this.smoothEnd = true, this.isModified = true, this.targetOffset = { x: this.modification.result.delta.x, y: this.modification.result.delta.y }, this.onNextFrame(function() {
              return t3.smoothEndTick();
            });
          }, e2.onNextFrame = function(t3) {
            var e3 = this;
            this.timeout = bt.default.request(function() {
              e3.active && t3();
            });
          }, e2.inertiaTick = function() {
            var t3, e3, n2, r2, i2, o2 = this, a2 = this.interaction, s2 = Ye(a2).resistance, l2 = (a2._now() - this.t0) / 1e3;
            if (l2 < this.te) {
              var c2, u2 = 1 - (Math.exp(-s2 * l2) - this.lambda_v0) / this.one_ve_v0;
              this.isModified ? (0, 0, t3 = this.targetOffset.x, e3 = this.targetOffset.y, n2 = this.modifiedOffset.x, r2 = this.modifiedOffset.y, c2 = { x: We(i2 = u2, 0, t3, n2), y: We(i2, 0, e3, r2) }) : c2 = { x: this.targetOffset.x * u2, y: this.targetOffset.y * u2 };
              var d2 = { x: c2.x - this.currentOffset.x, y: c2.y - this.currentOffset.y };
              this.currentOffset.x += d2.x, this.currentOffset.y += d2.y, a2.offsetBy(d2), a2.move(), this.onNextFrame(function() {
                return o2.inertiaTick();
              });
            } else
              a2.offsetBy({ x: this.modifiedOffset.x - this.currentOffset.x, y: this.modifiedOffset.y - this.currentOffset.y }), this.end();
          }, e2.smoothEndTick = function() {
            var t3 = this, e3 = this.interaction, n2 = e3._now() - this.t0, r2 = Ye(e3).smoothEndDuration;
            if (n2 < r2) {
              var i2 = { x: Be(n2, 0, this.targetOffset.x, r2), y: Be(n2, 0, this.targetOffset.y, r2) }, o2 = { x: i2.x - this.currentOffset.x, y: i2.y - this.currentOffset.y };
              this.currentOffset.x += o2.x, this.currentOffset.y += o2.y, e3.offsetBy(o2), e3.move({ skipModifiers: this.modifierCount }), this.onNextFrame(function() {
                return t3.smoothEndTick();
              });
            } else
              e3.offsetBy({ x: this.targetOffset.x - this.currentOffset.x, y: this.targetOffset.y - this.currentOffset.y }), this.end();
          }, e2.resume = function(t3) {
            var e3 = t3.pointer, n2 = t3.event, r2 = t3.eventTarget, i2 = this.interaction;
            i2.offsetBy({ x: -this.currentOffset.x, y: -this.currentOffset.y }), i2.updatePointer(e3, n2, r2, true), i2._doPhase({ interaction: i2, event: n2, phase: "resume" }), (0, X.copyCoords)(i2.coords.prev, i2.coords.cur), this.stop();
          }, e2.end = function() {
            this.interaction.move(), this.interaction.end(), this.stop();
          }, e2.stop = function() {
            this.active = this.smoothEnd = false, this.interaction.simulation = null, bt.default.cancel(this.timeout);
          }, t2;
        }();
        function Ye(t2) {
          var e2 = t2.interactable, n2 = t2.prepared;
          return e2 && e2.options && n2.name && e2.options[n2.name].inertia;
        }
        function We(t2, e2, n2, r2) {
          var i2 = 1 - t2;
          return i2 * i2 * e2 + 2 * i2 * t2 * n2 + t2 * t2 * r2;
        }
        function Be(t2, e2, n2, r2) {
          return -n2 * (t2 /= r2) * (t2 - 2) + e2;
        }
        Fe.InertiaState = Xe;
        var Le = { id: "inertia", before: ["modifiers", "actions"], install: function(t2) {
          var e2 = t2.defaults;
          t2.usePlugin(De.default), t2.usePlugin(ge.default), t2.actions.phases.inertiastart = true, t2.actions.phases.resume = true, e2.perAction.inertia = { enabled: false, resistance: 10, minSpeed: 100, endSpeed: 10, allowResume: true, smoothEndDuration: 300 };
        }, listeners: { "interactions:new": function(t2) {
          var e2 = t2.interaction;
          e2.inertia = new Xe(e2);
        }, "interactions:before-action-end": function(t2) {
          var e2 = t2.interaction, n2 = t2.event;
          return (!e2._interacting || e2.simulation || !e2.inertia.start(n2)) && null;
        }, "interactions:down": function(t2) {
          var e2 = t2.interaction, n2 = t2.eventTarget, r2 = e2.inertia;
          if (r2.active)
            for (var i2 = n2; o.default.element(i2); ) {
              if (i2 === e2.element) {
                r2.resume(t2);
                break;
              }
              i2 = _.parentNode(i2);
            }
        }, "interactions:stop": function(t2) {
          var e2 = t2.interaction.inertia;
          e2.active && e2.stop();
        }, "interactions:before-action-resume": function(t2) {
          var e2 = t2.interaction.modification;
          e2.stop(t2), e2.start(t2, t2.interaction.coords.cur.page), e2.applyToInteraction(t2);
        }, "interactions:before-action-inertiastart": function(t2) {
          return t2.interaction.modification.setAndApply(t2);
        }, "interactions:action-resume": ge.addEventModifiers, "interactions:action-inertiastart": ge.addEventModifiers, "interactions:after-action-inertiastart": function(t2) {
          return t2.interaction.modification.restoreInteractionCoords(t2);
        }, "interactions:after-action-resume": function(t2) {
          return t2.interaction.modification.restoreInteractionCoords(t2);
        } } };
        Fe.default = Le;
        var Ne = {};
        function Ve(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2];
            if (t2.immediatePropagationStopped)
              break;
            r2(t2);
          }
        }
        Object.defineProperty(Ne, "__esModule", { value: true }), Ne.Eventable = void 0;
        var qe = function() {
          function t2(t3) {
            this.options = void 0, this.types = {}, this.propagationStopped = false, this.immediatePropagationStopped = false, this.global = void 0, this.options = (0, T.default)({}, t3 || {});
          }
          var e2 = t2.prototype;
          return e2.fire = function(t3) {
            var e3, n2 = this.global;
            (e3 = this.types[t3.type]) && Ve(t3, e3), !t3.propagationStopped && n2 && (e3 = n2[t3.type]) && Ve(t3, e3);
          }, e2.on = function(t3, e3) {
            var n2 = (0, z.default)(t3, e3);
            for (t3 in n2)
              this.types[t3] = G.merge(this.types[t3] || [], n2[t3]);
          }, e2.off = function(t3, e3) {
            var n2 = (0, z.default)(t3, e3);
            for (t3 in n2) {
              var r2 = this.types[t3];
              if (r2 && r2.length)
                for (var i2 = 0; i2 < n2[t3].length; i2++) {
                  var o2 = n2[t3][i2], a2 = r2.indexOf(o2);
                  a2 !== -1 && r2.splice(a2, 1);
                }
            }
          }, e2.getRect = function(t3) {
            return null;
          }, t2;
        }();
        Ne.Eventable = qe;
        var Ue = {};
        Object.defineProperty(Ue, "__esModule", { value: true }), Ue.default = function(t2, e2) {
          if (e2.phaselessTypes[t2])
            return true;
          for (var n2 in e2.map)
            if (t2.indexOf(n2) === 0 && t2.substr(n2.length) in e2.phases)
              return true;
          return false;
        };
        var Ge = {};
        function He(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t2, r2.key, r2);
          }
        }
        Object.defineProperty(Ge, "__esModule", { value: true }), Ge.Interactable = void 0;
        var $e = function() {
          var t2, n2;
          function r2(t3, n3, r3, i3) {
            this.options = void 0, this._actions = void 0, this.target = void 0, this.events = new Ne.Eventable(), this._context = void 0, this._win = void 0, this._doc = void 0, this._scopeEvents = void 0, this._rectChecker = void 0, this._actions = n3.actions, this.target = t3, this._context = n3.context || r3, this._win = (0, e.getWindow)((0, _.trySelector)(t3) ? this._context : t3), this._doc = this._win.document, this._scopeEvents = i3, this.set(n3);
          }
          t2 = r2, (n2 = [{ key: "_defaults", get: function() {
            return { base: {}, perAction: {}, actions: {} };
          } }]) && He(t2.prototype, n2);
          var i2 = r2.prototype;
          return i2.setOnEvents = function(t3, e2) {
            return o.default.func(e2.onstart) && this.on(t3 + "start", e2.onstart), o.default.func(e2.onmove) && this.on(t3 + "move", e2.onmove), o.default.func(e2.onend) && this.on(t3 + "end", e2.onend), o.default.func(e2.oninertiastart) && this.on(t3 + "inertiastart", e2.oninertiastart), this;
          }, i2.updatePerActionListeners = function(t3, e2, n3) {
            (o.default.array(e2) || o.default.object(e2)) && this.off(t3, e2), (o.default.array(n3) || o.default.object(n3)) && this.on(t3, n3);
          }, i2.setPerAction = function(t3, e2) {
            var n3 = this._defaults;
            for (var r3 in e2) {
              var i3 = r3, a2 = this.options[t3], s2 = e2[i3];
              i3 === "listeners" && this.updatePerActionListeners(t3, a2.listeners, s2), o.default.array(s2) ? a2[i3] = G.from(s2) : o.default.plainObject(s2) ? (a2[i3] = (0, T.default)(a2[i3] || {}, (0, de.default)(s2)), o.default.object(n3.perAction[i3]) && "enabled" in n3.perAction[i3] && (a2[i3].enabled = s2.enabled !== false)) : o.default.bool(s2) && o.default.object(n3.perAction[i3]) ? a2[i3].enabled = s2 : a2[i3] = s2;
            }
          }, i2.getRect = function(t3) {
            return t3 = t3 || (o.default.element(this.target) ? this.target : null), o.default.string(this.target) && (t3 = t3 || this._context.querySelector(this.target)), (0, _.getElementRect)(t3);
          }, i2.rectChecker = function(t3) {
            var e2 = this;
            return o.default.func(t3) ? (this._rectChecker = t3, this.getRect = function(t4) {
              var n3 = (0, T.default)({}, e2._rectChecker(t4));
              return "width" in n3 || (n3.width = n3.right - n3.left, n3.height = n3.bottom - n3.top), n3;
            }, this) : t3 === null ? (delete this.getRect, delete this._rectChecker, this) : this.getRect;
          }, i2._backCompatOption = function(t3, e2) {
            if ((0, _.trySelector)(e2) || o.default.object(e2)) {
              for (var n3 in this.options[t3] = e2, this._actions.map)
                this.options[n3][t3] = e2;
              return this;
            }
            return this.options[t3];
          }, i2.origin = function(t3) {
            return this._backCompatOption("origin", t3);
          }, i2.deltaSource = function(t3) {
            return t3 === "page" || t3 === "client" ? (this.options.deltaSource = t3, this) : this.options.deltaSource;
          }, i2.context = function() {
            return this._context;
          }, i2.inContext = function(t3) {
            return this._context === t3.ownerDocument || (0, _.nodeContains)(this._context, t3);
          }, i2.testIgnoreAllow = function(t3, e2, n3) {
            return !this.testIgnore(t3.ignoreFrom, e2, n3) && this.testAllow(t3.allowFrom, e2, n3);
          }, i2.testAllow = function(t3, e2, n3) {
            return !t3 || !!o.default.element(n3) && (o.default.string(t3) ? (0, _.matchesUpTo)(n3, t3, e2) : !!o.default.element(t3) && (0, _.nodeContains)(t3, n3));
          }, i2.testIgnore = function(t3, e2, n3) {
            return !(!t3 || !o.default.element(n3)) && (o.default.string(t3) ? (0, _.matchesUpTo)(n3, t3, e2) : !!o.default.element(t3) && (0, _.nodeContains)(t3, n3));
          }, i2.fire = function(t3) {
            return this.events.fire(t3), this;
          }, i2._onOff = function(t3, e2, n3, r3) {
            o.default.object(e2) && !o.default.array(e2) && (r3 = n3, n3 = null);
            var i3 = t3 === "on" ? "add" : "remove", a2 = (0, z.default)(e2, n3);
            for (var s2 in a2) {
              s2 === "wheel" && (s2 = y.default.wheelEvent);
              for (var l2 = 0; l2 < a2[s2].length; l2++) {
                var c2 = a2[s2][l2];
                (0, Ue.default)(s2, this._actions) ? this.events[t3](s2, c2) : o.default.string(this.target) ? this._scopeEvents[i3 + "Delegate"](this.target, this._context, s2, c2, r3) : this._scopeEvents[i3](this.target, s2, c2, r3);
              }
            }
            return this;
          }, i2.on = function(t3, e2, n3) {
            return this._onOff("on", t3, e2, n3);
          }, i2.off = function(t3, e2, n3) {
            return this._onOff("off", t3, e2, n3);
          }, i2.set = function(t3) {
            var e2 = this._defaults;
            for (var n3 in o.default.object(t3) || (t3 = {}), this.options = (0, de.default)(e2.base), this._actions.methodDict) {
              var r3 = n3, i3 = this._actions.methodDict[r3];
              this.options[r3] = {}, this.setPerAction(r3, (0, T.default)((0, T.default)({}, e2.perAction), e2.actions[r3])), this[i3](t3[r3]);
            }
            for (var a2 in t3)
              o.default.func(this[a2]) && this[a2](t3[a2]);
            return this;
          }, i2.unset = function() {
            if (o.default.string(this.target))
              for (var t3 in this._scopeEvents.delegatedEvents)
                for (var e2 = this._scopeEvents.delegatedEvents[t3], n3 = e2.length - 1; n3 >= 0; n3--) {
                  var r3 = e2[n3], i3 = r3.selector, a2 = r3.context, s2 = r3.listeners;
                  i3 === this.target && a2 === this._context && e2.splice(n3, 1);
                  for (var l2 = s2.length - 1; l2 >= 0; l2--)
                    this._scopeEvents.removeDelegate(this.target, this._context, t3, s2[l2][0], s2[l2][1]);
                }
            else
              this._scopeEvents.remove(this.target, "all");
          }, r2;
        }();
        Ge.Interactable = $e;
        var Ke = {};
        Object.defineProperty(Ke, "__esModule", { value: true }), Ke.InteractableSet = void 0;
        var Ze = function() {
          function t2(t3) {
            var e3 = this;
            this.list = [], this.selectorMap = {}, this.scope = void 0, this.scope = t3, t3.addListeners({ "interactable:unset": function(t4) {
              var n2 = t4.interactable, r2 = n2.target, i2 = n2._context, a2 = o.default.string(r2) ? e3.selectorMap[r2] : r2[e3.scope.id], s2 = G.findIndex(a2, function(t5) {
                return t5.context === i2;
              });
              a2[s2] && (a2[s2].context = null, a2[s2].interactable = null), a2.splice(s2, 1);
            } });
          }
          var e2 = t2.prototype;
          return e2.new = function(t3, e3) {
            e3 = (0, T.default)(e3 || {}, { actions: this.scope.actions });
            var n2 = new this.scope.Interactable(t3, e3, this.scope.document, this.scope.events), r2 = { context: n2._context, interactable: n2 };
            return this.scope.addDocument(n2._doc), this.list.push(n2), o.default.string(t3) ? (this.selectorMap[t3] || (this.selectorMap[t3] = []), this.selectorMap[t3].push(r2)) : (n2.target[this.scope.id] || Object.defineProperty(t3, this.scope.id, { value: [], configurable: true }), t3[this.scope.id].push(r2)), this.scope.fire("interactable:new", { target: t3, options: e3, interactable: n2, win: this.scope._win }), n2;
          }, e2.get = function(t3, e3) {
            var n2 = e3 && e3.context || this.scope.document, r2 = o.default.string(t3), i2 = r2 ? this.selectorMap[t3] : t3[this.scope.id];
            if (!i2)
              return null;
            var a2 = G.find(i2, function(e4) {
              return e4.context === n2 && (r2 || e4.interactable.inContext(t3));
            });
            return a2 && a2.interactable;
          }, e2.forEachMatch = function(t3, e3) {
            for (var n2 = 0; n2 < this.list.length; n2++) {
              var r2 = this.list[n2], i2 = void 0;
              if ((o.default.string(r2.target) ? o.default.element(t3) && _.matchesSelector(t3, r2.target) : t3 === r2.target) && r2.inContext(t3) && (i2 = e3(r2)), i2 !== void 0)
                return i2;
            }
          }, t2;
        }();
        Ke.InteractableSet = Ze;
        var Je = {};
        Object.defineProperty(Je, "__esModule", { value: true }), Je.default = void 0;
        var Qe = function() {
          function t2(t3) {
            this.currentTarget = void 0, this.originalEvent = void 0, this.type = void 0, this.originalEvent = t3, (0, k.default)(this, t3);
          }
          var e2 = t2.prototype;
          return e2.preventOriginalDefault = function() {
            this.originalEvent.preventDefault();
          }, e2.stopPropagation = function() {
            this.originalEvent.stopPropagation();
          }, e2.stopImmediatePropagation = function() {
            this.originalEvent.stopImmediatePropagation();
          }, t2;
        }();
        function tn(t2) {
          if (!o.default.object(t2))
            return { capture: !!t2, passive: false };
          var e2 = (0, T.default)({}, t2);
          return e2.capture = !!t2.capture, e2.passive = !!t2.passive, e2;
        }
        var en = { id: "events", install: function(t2) {
          var e2 = [], n2 = {}, r2 = [], i2 = { add: a2, remove: s2, addDelegate: function(t3, e3, i3, o2, s3) {
            var u2 = tn(s3);
            if (!n2[i3]) {
              n2[i3] = [];
              for (var d2 = 0; d2 < r2.length; d2++) {
                var f2 = r2[d2];
                a2(f2, i3, l2), a2(f2, i3, c2, true);
              }
            }
            var p2 = n2[i3], v2 = G.find(p2, function(n3) {
              return n3.selector === t3 && n3.context === e3;
            });
            v2 || (v2 = { selector: t3, context: e3, listeners: [] }, p2.push(v2)), v2.listeners.push([o2, u2]);
          }, removeDelegate: function(t3, e3, r3, i3, o2) {
            var a3, u2 = tn(o2), d2 = n2[r3], f2 = false;
            if (d2)
              for (a3 = d2.length - 1; a3 >= 0; a3--) {
                var p2 = d2[a3];
                if (p2.selector === t3 && p2.context === e3) {
                  for (var v2 = p2.listeners, h2 = v2.length - 1; h2 >= 0; h2--) {
                    var g2 = v2[h2], m2 = g2[0], y2 = g2[1], b2 = y2.capture, x2 = y2.passive;
                    if (m2 === i3 && b2 === u2.capture && x2 === u2.passive) {
                      v2.splice(h2, 1), v2.length || (d2.splice(a3, 1), s2(e3, r3, l2), s2(e3, r3, c2, true)), f2 = true;
                      break;
                    }
                  }
                  if (f2)
                    break;
                }
              }
          }, delegateListener: l2, delegateUseCapture: c2, delegatedEvents: n2, documents: r2, targets: e2, supportsOptions: false, supportsPassive: false };
          function a2(t3, n3, r3, o2) {
            var a3 = tn(o2), s3 = G.find(e2, function(e3) {
              return e3.eventTarget === t3;
            });
            s3 || (s3 = { eventTarget: t3, events: {} }, e2.push(s3)), s3.events[n3] || (s3.events[n3] = []), t3.addEventListener && !G.contains(s3.events[n3], r3) && (t3.addEventListener(n3, r3, i2.supportsOptions ? a3 : a3.capture), s3.events[n3].push(r3));
          }
          function s2(t3, n3, r3, o2) {
            var a3 = tn(o2), l3 = G.findIndex(e2, function(e3) {
              return e3.eventTarget === t3;
            }), c3 = e2[l3];
            if (c3 && c3.events)
              if (n3 !== "all") {
                var u2 = false, d2 = c3.events[n3];
                if (d2) {
                  if (r3 === "all") {
                    for (var f2 = d2.length - 1; f2 >= 0; f2--)
                      s2(t3, n3, d2[f2], a3);
                    return;
                  }
                  for (var p2 = 0; p2 < d2.length; p2++)
                    if (d2[p2] === r3) {
                      t3.removeEventListener(n3, r3, i2.supportsOptions ? a3 : a3.capture), d2.splice(p2, 1), d2.length === 0 && (delete c3.events[n3], u2 = true);
                      break;
                    }
                }
                u2 && !Object.keys(c3.events).length && e2.splice(l3, 1);
              } else
                for (n3 in c3.events)
                  c3.events.hasOwnProperty(n3) && s2(t3, n3, "all");
          }
          function l2(t3, e3) {
            for (var r3 = tn(e3), i3 = new Qe(t3), a3 = n2[t3.type], s3 = X.getEventTargets(t3)[0], l3 = s3; o.default.element(l3); ) {
              for (var c3 = 0; c3 < a3.length; c3++) {
                var u2 = a3[c3], d2 = u2.selector, f2 = u2.context;
                if (_.matchesSelector(l3, d2) && _.nodeContains(f2, s3) && _.nodeContains(f2, l3)) {
                  var p2 = u2.listeners;
                  i3.currentTarget = l3;
                  for (var v2 = 0; v2 < p2.length; v2++) {
                    var h2 = p2[v2], g2 = h2[0], m2 = h2[1], y2 = m2.capture, b2 = m2.passive;
                    y2 === r3.capture && b2 === r3.passive && g2(i3);
                  }
                }
              }
              l3 = _.parentNode(l3);
            }
          }
          function c2(t3) {
            return l2(t3, true);
          }
          return t2.document.createElement("div").addEventListener("test", null, { get capture() {
            return i2.supportsOptions = true;
          }, get passive() {
            return i2.supportsPassive = true;
          } }), t2.events = i2, i2;
        } };
        Je.default = en;
        var nn = {};
        Object.defineProperty(nn, "__esModule", { value: true }), nn.createInteractStatic = function(t2) {
          var e2 = function e3(n2, r2) {
            var i2 = t2.interactables.get(n2, r2);
            return i2 || ((i2 = t2.interactables.new(n2, r2)).events.global = e3.globalEvents), i2;
          };
          return e2.getPointerAverage = X.pointerAverage, e2.getTouchBBox = X.touchBBox, e2.getTouchDistance = X.touchDistance, e2.getTouchAngle = X.touchAngle, e2.getElementRect = _.getElementRect, e2.getElementClientRect = _.getElementClientRect, e2.matchesSelector = _.matchesSelector, e2.closest = _.closest, e2.globalEvents = {}, e2.version = "1.10.2", e2.scope = t2, e2.use = function(t3, e3) {
            return this.scope.usePlugin(t3, e3), this;
          }, e2.isSet = function(t3, e3) {
            return !!this.scope.interactables.get(t3, e3 && e3.context);
          }, e2.on = (0, It.warnOnce)(function(t3, e3, n2) {
            if (o.default.string(t3) && t3.search(" ") !== -1 && (t3 = t3.trim().split(/ +/)), o.default.array(t3)) {
              for (var r2 = 0; r2 < t3.length; r2++) {
                var i2 = t3[r2];
                this.on(i2, e3, n2);
              }
              return this;
            }
            if (o.default.object(t3)) {
              for (var a2 in t3)
                this.on(a2, t3[a2], e3);
              return this;
            }
            return (0, Ue.default)(t3, this.scope.actions) ? this.globalEvents[t3] ? this.globalEvents[t3].push(e3) : this.globalEvents[t3] = [e3] : this.scope.events.add(this.scope.document, t3, e3, { options: n2 }), this;
          }, "The interact.on() method is being deprecated"), e2.off = (0, It.warnOnce)(function(t3, e3, n2) {
            if (o.default.string(t3) && t3.search(" ") !== -1 && (t3 = t3.trim().split(/ +/)), o.default.array(t3)) {
              for (var r2 = 0; r2 < t3.length; r2++) {
                var i2 = t3[r2];
                this.off(i2, e3, n2);
              }
              return this;
            }
            if (o.default.object(t3)) {
              for (var a2 in t3)
                this.off(a2, t3[a2], e3);
              return this;
            }
            var s2;
            return (0, Ue.default)(t3, this.scope.actions) ? t3 in this.globalEvents && (s2 = this.globalEvents[t3].indexOf(e3)) !== -1 && this.globalEvents[t3].splice(s2, 1) : this.scope.events.remove(this.scope.document, t3, e3, n2), this;
          }, "The interact.off() method is being deprecated"), e2.debug = function() {
            return this.scope;
          }, e2.supportsTouch = function() {
            return y.default.supportsTouch;
          }, e2.supportsPointerEvent = function() {
            return y.default.supportsPointerEvent;
          }, e2.stop = function() {
            for (var t3 = 0; t3 < this.scope.interactions.list.length; t3++)
              this.scope.interactions.list[t3].stop();
            return this;
          }, e2.pointerMoveTolerance = function(t3) {
            return o.default.number(t3) ? (this.scope.interactions.pointerMoveTolerance = t3, this) : this.scope.interactions.pointerMoveTolerance;
          }, e2.addDocument = function(t3, e3) {
            this.scope.addDocument(t3, e3);
          }, e2.removeDocument = function(t3) {
            this.scope.removeDocument(t3);
          }, e2;
        };
        var rn = {};
        Object.defineProperty(rn, "__esModule", { value: true }), rn.default = void 0;
        var on2 = { methodOrder: ["simulationResume", "mouseOrPen", "hasPointer", "idle"], search: function(t2) {
          for (var e2 = 0; e2 < on2.methodOrder.length; e2++) {
            var n2;
            n2 = on2.methodOrder[e2];
            var r2 = on2[n2](t2);
            if (r2)
              return r2;
          }
          return null;
        }, simulationResume: function(t2) {
          var e2 = t2.pointerType, n2 = t2.eventType, r2 = t2.eventTarget, i2 = t2.scope;
          if (!/down|start/i.test(n2))
            return null;
          for (var o2 = 0; o2 < i2.interactions.list.length; o2++) {
            var a2 = i2.interactions.list[o2], s2 = r2;
            if (a2.simulation && a2.simulation.allowResume && a2.pointerType === e2)
              for (; s2; ) {
                if (s2 === a2.element)
                  return a2;
                s2 = _.parentNode(s2);
              }
          }
          return null;
        }, mouseOrPen: function(t2) {
          var e2, n2 = t2.pointerId, r2 = t2.pointerType, i2 = t2.eventType, o2 = t2.scope;
          if (r2 !== "mouse" && r2 !== "pen")
            return null;
          for (var a2 = 0; a2 < o2.interactions.list.length; a2++) {
            var s2 = o2.interactions.list[a2];
            if (s2.pointerType === r2) {
              if (s2.simulation && !an(s2, n2))
                continue;
              if (s2.interacting())
                return s2;
              e2 || (e2 = s2);
            }
          }
          if (e2)
            return e2;
          for (var l2 = 0; l2 < o2.interactions.list.length; l2++) {
            var c2 = o2.interactions.list[l2];
            if (!(c2.pointerType !== r2 || /down/i.test(i2) && c2.simulation))
              return c2;
          }
          return null;
        }, hasPointer: function(t2) {
          for (var e2 = t2.pointerId, n2 = t2.scope, r2 = 0; r2 < n2.interactions.list.length; r2++) {
            var i2 = n2.interactions.list[r2];
            if (an(i2, e2))
              return i2;
          }
          return null;
        }, idle: function(t2) {
          for (var e2 = t2.pointerType, n2 = t2.scope, r2 = 0; r2 < n2.interactions.list.length; r2++) {
            var i2 = n2.interactions.list[r2];
            if (i2.pointers.length === 1) {
              var o2 = i2.interactable;
              if (o2 && (!o2.options.gesture || !o2.options.gesture.enabled))
                continue;
            } else if (i2.pointers.length >= 2)
              continue;
            if (!i2.interacting() && e2 === i2.pointerType)
              return i2;
          }
          return null;
        } };
        function an(t2, e2) {
          return t2.pointers.some(function(t3) {
            return t3.id === e2;
          });
        }
        var sn = on2;
        rn.default = sn;
        var ln = {};
        function cn(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t2, r2.key, r2);
          }
        }
        Object.defineProperty(ln, "__esModule", { value: true }), ln.default = void 0;
        var un = ["pointerDown", "pointerMove", "pointerUp", "updatePointer", "removePointer", "windowBlur"];
        function dn(t2, e2) {
          return function(n2) {
            var r2 = e2.interactions.list, i2 = X.getPointerType(n2), o2 = X.getEventTargets(n2), a2 = o2[0], s2 = o2[1], l2 = [];
            if (/^touch/.test(n2.type)) {
              e2.prevTouchTime = e2.now();
              for (var c2 = 0; c2 < n2.changedTouches.length; c2++) {
                var u2 = n2.changedTouches[c2], d2 = { pointer: u2, pointerId: X.getPointerId(u2), pointerType: i2, eventType: n2.type, eventTarget: a2, curEventTarget: s2, scope: e2 }, f2 = fn(d2);
                l2.push([d2.pointer, d2.eventTarget, d2.curEventTarget, f2]);
              }
            } else {
              var p2 = false;
              if (!y.default.supportsPointerEvent && /mouse/.test(n2.type)) {
                for (var v2 = 0; v2 < r2.length && !p2; v2++)
                  p2 = r2[v2].pointerType !== "mouse" && r2[v2].pointerIsDown;
                p2 = p2 || e2.now() - e2.prevTouchTime < 500 || n2.timeStamp === 0;
              }
              if (!p2) {
                var h2 = { pointer: n2, pointerId: X.getPointerId(n2), pointerType: i2, eventType: n2.type, curEventTarget: s2, eventTarget: a2, scope: e2 }, g2 = fn(h2);
                l2.push([h2.pointer, h2.eventTarget, h2.curEventTarget, g2]);
              }
            }
            for (var m2 = 0; m2 < l2.length; m2++) {
              var b2 = l2[m2], x2 = b2[0], _2 = b2[1], w2 = b2[2];
              b2[3][t2](x2, n2, _2, w2);
            }
          };
        }
        function fn(t2) {
          var e2 = t2.pointerType, n2 = t2.scope, r2 = { interaction: rn.default.search(t2), searchDetails: t2 };
          return n2.fire("interactions:find", r2), r2.interaction || n2.interactions.new({ pointerType: e2 });
        }
        function pn(t2, e2) {
          var n2 = t2.doc, r2 = t2.scope, i2 = t2.options, o2 = r2.interactions.docEvents, a2 = r2.events, s2 = a2[e2];
          for (var l2 in r2.browser.isIOS && !i2.events && (i2.events = { passive: false }), a2.delegatedEvents)
            s2(n2, l2, a2.delegateListener), s2(n2, l2, a2.delegateUseCapture, true);
          for (var c2 = i2 && i2.events, u2 = 0; u2 < o2.length; u2++) {
            var d2 = o2[u2];
            s2(n2, d2.type, d2.listener, c2);
          }
        }
        var vn = { id: "core/interactions", install: function(t2) {
          for (var e2 = {}, n2 = 0; n2 < un.length; n2++) {
            var r2 = un[n2];
            e2[r2] = dn(r2, t2);
          }
          var i2, o2 = y.default.pEventTypes;
          function a2() {
            for (var e3 = 0; e3 < t2.interactions.list.length; e3++) {
              var n3 = t2.interactions.list[e3];
              if (n3.pointerIsDown && n3.pointerType === "touch" && !n3._interacting)
                for (var r3 = function() {
                  var e4 = n3.pointers[i3];
                  t2.documents.some(function(t3) {
                    var n4 = t3.doc;
                    return (0, _.nodeContains)(n4, e4.downTarget);
                  }) || n3.removePointer(e4.pointer, e4.event);
                }, i3 = 0; i3 < n3.pointers.length; i3++)
                  r3();
            }
          }
          (i2 = v.default.PointerEvent ? [{ type: o2.down, listener: a2 }, { type: o2.down, listener: e2.pointerDown }, { type: o2.move, listener: e2.pointerMove }, { type: o2.up, listener: e2.pointerUp }, { type: o2.cancel, listener: e2.pointerUp }] : [{ type: "mousedown", listener: e2.pointerDown }, { type: "mousemove", listener: e2.pointerMove }, { type: "mouseup", listener: e2.pointerUp }, { type: "touchstart", listener: a2 }, { type: "touchstart", listener: e2.pointerDown }, { type: "touchmove", listener: e2.pointerMove }, { type: "touchend", listener: e2.pointerUp }, { type: "touchcancel", listener: e2.pointerUp }]).push({ type: "blur", listener: function(e3) {
            for (var n3 = 0; n3 < t2.interactions.list.length; n3++)
              t2.interactions.list[n3].documentBlur(e3);
          } }), t2.prevTouchTime = 0, t2.Interaction = function(e3) {
            var n3, r3, i3, o3;
            function a3() {
              return e3.apply(this, arguments) || this;
            }
            return r3 = e3, (n3 = a3).prototype = Object.create(r3.prototype), n3.prototype.constructor = n3, n3.__proto__ = r3, a3.prototype._now = function() {
              return t2.now();
            }, i3 = a3, (o3 = [{ key: "pointerMoveTolerance", get: function() {
              return t2.interactions.pointerMoveTolerance;
            }, set: function(e4) {
              t2.interactions.pointerMoveTolerance = e4;
            } }]) && cn(i3.prototype, o3), a3;
          }(Se.default), t2.interactions = { list: [], new: function(e3) {
            e3.scopeFire = function(e4, n4) {
              return t2.fire(e4, n4);
            };
            var n3 = new t2.Interaction(e3);
            return t2.interactions.list.push(n3), n3;
          }, listeners: e2, docEvents: i2, pointerMoveTolerance: 1 }, t2.usePlugin(Jt.default);
        }, listeners: { "scope:add-document": function(t2) {
          return pn(t2, "add");
        }, "scope:remove-document": function(t2) {
          return pn(t2, "remove");
        }, "interactable:unset": function(t2, e2) {
          for (var n2 = t2.interactable, r2 = e2.interactions.list.length - 1; r2 >= 0; r2--) {
            var i2 = e2.interactions.list[r2];
            i2.interactable === n2 && (i2.stop(), e2.fire("interactions:destroy", { interaction: i2 }), i2.destroy(), e2.interactions.list.length > 2 && e2.interactions.list.splice(r2, 1));
          }
        } }, onDocSignal: pn, doOnInteractions: dn, methodNames: un };
        ln.default = vn;
        var hn = {};
        function gn(t2, e2) {
          for (var n2 = 0; n2 < e2.length; n2++) {
            var r2 = e2[n2];
            r2.enumerable = r2.enumerable || false, r2.configurable = true, "value" in r2 && (r2.writable = true), Object.defineProperty(t2, r2.key, r2);
          }
        }
        Object.defineProperty(hn, "__esModule", { value: true }), hn.initScope = yn, hn.Scope = void 0;
        var mn = function() {
          function t2() {
            var t3 = this;
            this.id = "__interact_scope_" + Math.floor(100 * Math.random()), this.isInitialized = false, this.listenerMaps = [], this.browser = y.default, this.defaults = (0, de.default)(be.defaults), this.Eventable = Ne.Eventable, this.actions = { map: {}, phases: { start: true, move: true, end: true }, methodDict: {}, phaselessTypes: {} }, this.interactStatic = (0, nn.createInteractStatic)(this), this.InteractEvent = xe.InteractEvent, this.Interactable = void 0, this.interactables = new Ke.InteractableSet(this), this._win = void 0, this.document = void 0, this.window = void 0, this.documents = [], this._plugins = { list: [], map: {} }, this.onWindowUnload = function(e3) {
              return t3.removeDocument(e3.target);
            };
            var e2 = this;
            this.Interactable = function(t4) {
              var n3, r2;
              function i2() {
                return t4.apply(this, arguments) || this;
              }
              r2 = t4, (n3 = i2).prototype = Object.create(r2.prototype), n3.prototype.constructor = n3, n3.__proto__ = r2;
              var o2, a2, s2 = i2.prototype;
              return s2.set = function(n4) {
                return t4.prototype.set.call(this, n4), e2.fire("interactable:set", { options: n4, interactable: this }), this;
              }, s2.unset = function() {
                t4.prototype.unset.call(this), e2.interactables.list.splice(e2.interactables.list.indexOf(this), 1), e2.fire("interactable:unset", { interactable: this });
              }, o2 = i2, (a2 = [{ key: "_defaults", get: function() {
                return e2.defaults;
              } }]) && gn(o2.prototype, a2), i2;
            }(Ge.Interactable);
          }
          var n2 = t2.prototype;
          return n2.addListeners = function(t3, e2) {
            this.listenerMaps.push({ id: e2, map: t3 });
          }, n2.fire = function(t3, e2) {
            for (var n3 = 0; n3 < this.listenerMaps.length; n3++) {
              var r2 = this.listenerMaps[n3].map[t3];
              if (r2 && r2(e2, this, t3) === false)
                return false;
            }
          }, n2.init = function(t3) {
            return this.isInitialized ? this : yn(this, t3);
          }, n2.pluginIsInstalled = function(t3) {
            return this._plugins.map[t3.id] || this._plugins.list.indexOf(t3) !== -1;
          }, n2.usePlugin = function(t3, e2) {
            if (!this.isInitialized)
              return this;
            if (this.pluginIsInstalled(t3))
              return this;
            if (t3.id && (this._plugins.map[t3.id] = t3), this._plugins.list.push(t3), t3.install && t3.install(this, e2), t3.listeners && t3.before) {
              for (var n3 = 0, r2 = this.listenerMaps.length, i2 = t3.before.reduce(function(t4, e3) {
                return t4[e3] = true, t4[bn(e3)] = true, t4;
              }, {}); n3 < r2; n3++) {
                var o2 = this.listenerMaps[n3].id;
                if (i2[o2] || i2[bn(o2)])
                  break;
              }
              this.listenerMaps.splice(n3, 0, { id: t3.id, map: t3.listeners });
            } else
              t3.listeners && this.listenerMaps.push({ id: t3.id, map: t3.listeners });
            return this;
          }, n2.addDocument = function(t3, n3) {
            if (this.getDocIndex(t3) !== -1)
              return false;
            var r2 = e.getWindow(t3);
            n3 = n3 ? (0, T.default)({}, n3) : {}, this.documents.push({ doc: t3, options: n3 }), this.events.documents.push(t3), t3 !== this.document && this.events.add(r2, "unload", this.onWindowUnload), this.fire("scope:add-document", { doc: t3, window: r2, scope: this, options: n3 });
          }, n2.removeDocument = function(t3) {
            var n3 = this.getDocIndex(t3), r2 = e.getWindow(t3), i2 = this.documents[n3].options;
            this.events.remove(r2, "unload", this.onWindowUnload), this.documents.splice(n3, 1), this.events.documents.splice(n3, 1), this.fire("scope:remove-document", { doc: t3, window: r2, scope: this, options: i2 });
          }, n2.getDocIndex = function(t3) {
            for (var e2 = 0; e2 < this.documents.length; e2++)
              if (this.documents[e2].doc === t3)
                return e2;
            return -1;
          }, n2.getDocOptions = function(t3) {
            var e2 = this.getDocIndex(t3);
            return e2 === -1 ? null : this.documents[e2].options;
          }, n2.now = function() {
            return (this.window.Date || Date).now();
          }, t2;
        }();
        function yn(t2, n2) {
          return t2.isInitialized = true, e.init(n2), v.default.init(n2), y.default.init(n2), bt.default.init(n2), t2.window = n2, t2.document = n2.document, t2.usePlugin(ln.default), t2.usePlugin(Je.default), t2;
        }
        function bn(t2) {
          return t2 && t2.replace(/\/.*$/, "");
        }
        hn.Scope = mn;
        var xn = {};
        Object.defineProperty(xn, "__esModule", { value: true }), xn.init = xn.default = void 0;
        var _n = new hn.Scope(), wn = _n.interactStatic;
        xn.default = wn;
        var Pn = function(t2) {
          return _n.init(t2);
        };
        xn.init = Pn, typeof window == "object" && window && Pn(window);
        var En = {};
        Object.defineProperty(En, "__esModule", { value: true }), En.default = void 0, En.default = function() {
        };
        var Sn = {};
        Object.defineProperty(Sn, "__esModule", { value: true }), Sn.default = void 0, Sn.default = function() {
        };
        var Mn = {};
        Object.defineProperty(Mn, "__esModule", { value: true }), Mn.default = void 0, Mn.default = function(t2) {
          var e2 = [["x", "y"], ["left", "top"], ["right", "bottom"], ["width", "height"]].filter(function(e3) {
            var n3 = e3[0], r2 = e3[1];
            return n3 in t2 || r2 in t2;
          }), n2 = function(n3, r2) {
            for (var i2 = t2.range, o2 = t2.limits, a2 = o2 === void 0 ? { left: -1 / 0, right: 1 / 0, top: -1 / 0, bottom: 1 / 0 } : o2, s2 = t2.offset, l2 = s2 === void 0 ? { x: 0, y: 0 } : s2, c2 = { range: i2, grid: t2, x: null, y: null }, u2 = 0; u2 < e2.length; u2++) {
              var d2 = e2[u2], f2 = d2[0], p2 = d2[1], v2 = Math.round((n3 - l2.x) / t2[f2]), h2 = Math.round((r2 - l2.y) / t2[p2]);
              c2[f2] = Math.max(a2.left, Math.min(a2.right, v2 * t2[f2] + l2.x)), c2[p2] = Math.max(a2.top, Math.min(a2.bottom, h2 * t2[p2] + l2.y));
            }
            return c2;
          };
          return n2.grid = t2, n2.coordFields = e2, n2;
        };
        var On = {};
        Object.defineProperty(On, "__esModule", { value: true }), Object.defineProperty(On, "edgeTarget", { enumerable: true, get: function() {
          return En.default;
        } }), Object.defineProperty(On, "elements", { enumerable: true, get: function() {
          return Sn.default;
        } }), Object.defineProperty(On, "grid", { enumerable: true, get: function() {
          return Mn.default;
        } });
        var Tn = {};
        Object.defineProperty(Tn, "__esModule", { value: true }), Tn.default = void 0;
        var In = { id: "snappers", install: function(t2) {
          var e2 = t2.interactStatic;
          e2.snappers = (0, T.default)(e2.snappers || {}, On), e2.createSnapGrid = e2.snappers.grid;
        } };
        Tn.default = In;
        var Dn = {};
        function jn() {
          return (jn = Object.assign || function(t2) {
            for (var e2 = 1; e2 < arguments.length; e2++) {
              var n2 = arguments[e2];
              for (var r2 in n2)
                Object.prototype.hasOwnProperty.call(n2, r2) && (t2[r2] = n2[r2]);
            }
            return t2;
          }).apply(this, arguments);
        }
        Object.defineProperty(Dn, "__esModule", { value: true }), Dn.aspectRatio = Dn.default = void 0;
        var zn = { start: function(t2) {
          var e2 = t2.state, n2 = t2.rect, r2 = t2.edges, i2 = t2.pageCoords, o2 = e2.options.ratio, a2 = e2.options, s2 = a2.equalDelta, l2 = a2.modifiers;
          o2 === "preserve" && (o2 = n2.width / n2.height), e2.startCoords = (0, T.default)({}, i2), e2.startRect = (0, T.default)({}, n2), e2.ratio = o2, e2.equalDelta = s2;
          var c2 = e2.linkedEdges = { top: r2.top || r2.left && !r2.bottom, left: r2.left || r2.top && !r2.right, bottom: r2.bottom || r2.right && !r2.top, right: r2.right || r2.bottom && !r2.left };
          if (e2.xIsPrimaryAxis = !(!r2.left && !r2.right), e2.equalDelta)
            e2.edgeSign = (c2.left ? 1 : -1) * (c2.top ? 1 : -1);
          else {
            var u2 = e2.xIsPrimaryAxis ? c2.top : c2.left;
            e2.edgeSign = u2 ? -1 : 1;
          }
          if ((0, T.default)(t2.edges, c2), l2 && l2.length) {
            var d2 = new fe.default(t2.interaction);
            d2.copyFrom(t2.interaction.modification), d2.prepareStates(l2), e2.subModification = d2, d2.startAll(jn({}, t2));
          }
        }, set: function(t2) {
          var e2 = t2.state, n2 = t2.rect, r2 = t2.coords, i2 = (0, T.default)({}, r2), o2 = e2.equalDelta ? An : Cn;
          if (o2(e2, e2.xIsPrimaryAxis, r2, n2), !e2.subModification)
            return null;
          var a2 = (0, T.default)({}, n2);
          (0, I.addEdges)(e2.linkedEdges, a2, { x: r2.x - i2.x, y: r2.y - i2.y });
          var s2 = e2.subModification.setAll(jn({}, t2, { rect: a2, edges: e2.linkedEdges, pageCoords: r2, prevCoords: r2, prevRect: a2 })), l2 = s2.delta;
          return s2.changed && (o2(e2, Math.abs(l2.x) > Math.abs(l2.y), s2.coords, s2.rect), (0, T.default)(r2, s2.coords)), s2.eventProps;
        }, defaults: { ratio: "preserve", equalDelta: false, modifiers: [], enabled: false } };
        function An(t2, e2, n2) {
          var r2 = t2.startCoords, i2 = t2.edgeSign;
          e2 ? n2.y = r2.y + (n2.x - r2.x) * i2 : n2.x = r2.x + (n2.y - r2.y) * i2;
        }
        function Cn(t2, e2, n2, r2) {
          var i2 = t2.startRect, o2 = t2.startCoords, a2 = t2.ratio, s2 = t2.edgeSign;
          if (e2) {
            var l2 = r2.width / a2;
            n2.y = o2.y + (l2 - i2.height) * s2;
          } else {
            var c2 = r2.height * a2;
            n2.x = o2.x + (c2 - i2.width) * s2;
          }
        }
        Dn.aspectRatio = zn;
        var kn = (0, ge.makeModifier)(zn, "aspectRatio");
        Dn.default = kn;
        var Rn = {};
        Object.defineProperty(Rn, "__esModule", { value: true }), Rn.default = void 0;
        var Fn = function() {
        };
        Fn._defaults = {};
        var Xn = Fn;
        Rn.default = Xn;
        var Yn = {};
        Object.defineProperty(Yn, "__esModule", { value: true }), Object.defineProperty(Yn, "default", { enumerable: true, get: function() {
          return Rn.default;
        } });
        var Wn = {};
        function Bn(t2, e2, n2) {
          return o.default.func(t2) ? I.resolveRectLike(t2, e2.interactable, e2.element, [n2.x, n2.y, e2]) : I.resolveRectLike(t2, e2.interactable, e2.element);
        }
        Object.defineProperty(Wn, "__esModule", { value: true }), Wn.getRestrictionRect = Bn, Wn.restrict = Wn.default = void 0;
        var Ln = { start: function(t2) {
          var e2 = t2.rect, n2 = t2.startOffset, r2 = t2.state, i2 = t2.interaction, o2 = t2.pageCoords, a2 = r2.options, s2 = a2.elementRect, l2 = (0, T.default)({ left: 0, top: 0, right: 0, bottom: 0 }, a2.offset || {});
          if (e2 && s2) {
            var c2 = Bn(a2.restriction, i2, o2);
            if (c2) {
              var u2 = c2.right - c2.left - e2.width, d2 = c2.bottom - c2.top - e2.height;
              u2 < 0 && (l2.left += u2, l2.right += u2), d2 < 0 && (l2.top += d2, l2.bottom += d2);
            }
            l2.left += n2.left - e2.width * s2.left, l2.top += n2.top - e2.height * s2.top, l2.right += n2.right - e2.width * (1 - s2.right), l2.bottom += n2.bottom - e2.height * (1 - s2.bottom);
          }
          r2.offset = l2;
        }, set: function(t2) {
          var e2 = t2.coords, n2 = t2.interaction, r2 = t2.state, i2 = r2.options, o2 = r2.offset, a2 = Bn(i2.restriction, n2, e2);
          if (a2) {
            var s2 = I.xywhToTlbr(a2);
            e2.x = Math.max(Math.min(s2.right - o2.right, e2.x), s2.left + o2.left), e2.y = Math.max(Math.min(s2.bottom - o2.bottom, e2.y), s2.top + o2.top);
          }
        }, defaults: { restriction: null, elementRect: null, offset: null, endOnly: false, enabled: false } };
        Wn.restrict = Ln;
        var Nn = (0, ge.makeModifier)(Ln, "restrict");
        Wn.default = Nn;
        var Vn = {};
        Object.defineProperty(Vn, "__esModule", { value: true }), Vn.restrictEdges = Vn.default = void 0;
        var qn = { top: 1 / 0, left: 1 / 0, bottom: -1 / 0, right: -1 / 0 }, Un = { top: -1 / 0, left: -1 / 0, bottom: 1 / 0, right: 1 / 0 };
        function Gn(t2, e2) {
          for (var n2 = ["top", "left", "bottom", "right"], r2 = 0; r2 < n2.length; r2++) {
            var i2 = n2[r2];
            i2 in t2 || (t2[i2] = e2[i2]);
          }
          return t2;
        }
        var Hn = { noInner: qn, noOuter: Un, start: function(t2) {
          var e2, n2 = t2.interaction, r2 = t2.startOffset, i2 = t2.state, o2 = i2.options;
          if (o2) {
            var a2 = (0, Wn.getRestrictionRect)(o2.offset, n2, n2.coords.start.page);
            e2 = I.rectToXY(a2);
          }
          e2 = e2 || { x: 0, y: 0 }, i2.offset = { top: e2.y + r2.top, left: e2.x + r2.left, bottom: e2.y - r2.bottom, right: e2.x - r2.right };
        }, set: function(t2) {
          var e2 = t2.coords, n2 = t2.edges, r2 = t2.interaction, i2 = t2.state, o2 = i2.offset, a2 = i2.options;
          if (n2) {
            var s2 = (0, T.default)({}, e2), l2 = (0, Wn.getRestrictionRect)(a2.inner, r2, s2) || {}, c2 = (0, Wn.getRestrictionRect)(a2.outer, r2, s2) || {};
            Gn(l2, qn), Gn(c2, Un), n2.top ? e2.y = Math.min(Math.max(c2.top + o2.top, s2.y), l2.top + o2.top) : n2.bottom && (e2.y = Math.max(Math.min(c2.bottom + o2.bottom, s2.y), l2.bottom + o2.bottom)), n2.left ? e2.x = Math.min(Math.max(c2.left + o2.left, s2.x), l2.left + o2.left) : n2.right && (e2.x = Math.max(Math.min(c2.right + o2.right, s2.x), l2.right + o2.right));
          }
        }, defaults: { inner: null, outer: null, offset: null, endOnly: false, enabled: false } };
        Vn.restrictEdges = Hn;
        var $n = (0, ge.makeModifier)(Hn, "restrictEdges");
        Vn.default = $n;
        var Kn = {};
        Object.defineProperty(Kn, "__esModule", { value: true }), Kn.restrictRect = Kn.default = void 0;
        var Zn = (0, T.default)({ get elementRect() {
          return { top: 0, left: 0, bottom: 1, right: 1 };
        }, set elementRect(t2) {
        } }, Wn.restrict.defaults), Jn = { start: Wn.restrict.start, set: Wn.restrict.set, defaults: Zn };
        Kn.restrictRect = Jn;
        var Qn = (0, ge.makeModifier)(Jn, "restrictRect");
        Kn.default = Qn;
        var tr = {};
        Object.defineProperty(tr, "__esModule", { value: true }), tr.restrictSize = tr.default = void 0;
        var er = { width: -1 / 0, height: -1 / 0 }, nr = { width: 1 / 0, height: 1 / 0 }, rr = { start: function(t2) {
          return Vn.restrictEdges.start(t2);
        }, set: function(t2) {
          var e2 = t2.interaction, n2 = t2.state, r2 = t2.rect, i2 = t2.edges, o2 = n2.options;
          if (i2) {
            var a2 = I.tlbrToXywh((0, Wn.getRestrictionRect)(o2.min, e2, t2.coords)) || er, s2 = I.tlbrToXywh((0, Wn.getRestrictionRect)(o2.max, e2, t2.coords)) || nr;
            n2.options = { endOnly: o2.endOnly, inner: (0, T.default)({}, Vn.restrictEdges.noInner), outer: (0, T.default)({}, Vn.restrictEdges.noOuter) }, i2.top ? (n2.options.inner.top = r2.bottom - a2.height, n2.options.outer.top = r2.bottom - s2.height) : i2.bottom && (n2.options.inner.bottom = r2.top + a2.height, n2.options.outer.bottom = r2.top + s2.height), i2.left ? (n2.options.inner.left = r2.right - a2.width, n2.options.outer.left = r2.right - s2.width) : i2.right && (n2.options.inner.right = r2.left + a2.width, n2.options.outer.right = r2.left + s2.width), Vn.restrictEdges.set(t2), n2.options = o2;
          }
        }, defaults: { min: null, max: null, endOnly: false, enabled: false } };
        tr.restrictSize = rr;
        var ir = (0, ge.makeModifier)(rr, "restrictSize");
        tr.default = ir;
        var or = {};
        Object.defineProperty(or, "__esModule", { value: true }), Object.defineProperty(or, "default", { enumerable: true, get: function() {
          return Rn.default;
        } });
        var ar = {};
        Object.defineProperty(ar, "__esModule", { value: true }), ar.snap = ar.default = void 0;
        var sr = { start: function(t2) {
          var e2, n2 = t2.interaction, r2 = t2.interactable, i2 = t2.element, o2 = t2.rect, a2 = t2.state, s2 = t2.startOffset, l2 = a2.options, c2 = l2.offsetWithOrigin ? function(t3) {
            var e3 = t3.interaction.element;
            return (0, I.rectToXY)((0, I.resolveRectLike)(t3.state.options.origin, null, null, [e3])) || (0, j.default)(t3.interactable, e3, t3.interaction.prepared.name);
          }(t2) : { x: 0, y: 0 };
          if (l2.offset === "startCoords")
            e2 = { x: n2.coords.start.page.x, y: n2.coords.start.page.y };
          else {
            var u2 = (0, I.resolveRectLike)(l2.offset, r2, i2, [n2]);
            (e2 = (0, I.rectToXY)(u2) || { x: 0, y: 0 }).x += c2.x, e2.y += c2.y;
          }
          var d2 = l2.relativePoints;
          a2.offsets = o2 && d2 && d2.length ? d2.map(function(t3, n3) {
            return { index: n3, relativePoint: t3, x: s2.left - o2.width * t3.x + e2.x, y: s2.top - o2.height * t3.y + e2.y };
          }) : [(0, T.default)({ index: 0, relativePoint: null }, e2)];
        }, set: function(t2) {
          var e2 = t2.interaction, n2 = t2.coords, r2 = t2.state, i2 = r2.options, a2 = r2.offsets, s2 = (0, j.default)(e2.interactable, e2.element, e2.prepared.name), l2 = (0, T.default)({}, n2), c2 = [];
          i2.offsetWithOrigin || (l2.x -= s2.x, l2.y -= s2.y);
          for (var u2 = 0; u2 < a2.length; u2++)
            for (var d2 = a2[u2], f2 = l2.x - d2.x, p2 = l2.y - d2.y, v2 = 0, h2 = i2.targets.length; v2 < h2; v2++) {
              var g2, m2 = i2.targets[v2];
              (g2 = o.default.func(m2) ? m2(f2, p2, e2._proxy, d2, v2) : m2) && c2.push({ x: (o.default.number(g2.x) ? g2.x : f2) + d2.x, y: (o.default.number(g2.y) ? g2.y : p2) + d2.y, range: o.default.number(g2.range) ? g2.range : i2.range, source: m2, index: v2, offset: d2 });
            }
          for (var y2 = { target: null, inRange: false, distance: 0, range: 0, delta: { x: 0, y: 0 } }, b2 = 0; b2 < c2.length; b2++) {
            var x2 = c2[b2], _2 = x2.range, w2 = x2.x - l2.x, P2 = x2.y - l2.y, E2 = (0, C.default)(w2, P2), S2 = E2 <= _2;
            _2 === 1 / 0 && y2.inRange && y2.range !== 1 / 0 && (S2 = false), y2.target && !(S2 ? y2.inRange && _2 !== 1 / 0 ? E2 / _2 < y2.distance / y2.range : _2 === 1 / 0 && y2.range !== 1 / 0 || E2 < y2.distance : !y2.inRange && E2 < y2.distance) || (y2.target = x2, y2.distance = E2, y2.range = _2, y2.inRange = S2, y2.delta.x = w2, y2.delta.y = P2);
          }
          return y2.inRange && (n2.x = y2.target.x, n2.y = y2.target.y), r2.closest = y2, y2;
        }, defaults: { range: 1 / 0, targets: null, offset: null, offsetWithOrigin: true, origin: null, relativePoints: null, endOnly: false, enabled: false } };
        ar.snap = sr;
        var lr = (0, ge.makeModifier)(sr, "snap");
        ar.default = lr;
        var cr = {};
        Object.defineProperty(cr, "__esModule", { value: true }), cr.snapSize = cr.default = void 0;
        var ur = { start: function(t2) {
          var e2 = t2.state, n2 = t2.edges, r2 = e2.options;
          if (!n2)
            return null;
          t2.state = { options: { targets: null, relativePoints: [{ x: n2.left ? 0 : 1, y: n2.top ? 0 : 1 }], offset: r2.offset || "self", origin: { x: 0, y: 0 }, range: r2.range } }, e2.targetFields = e2.targetFields || [["width", "height"], ["x", "y"]], ar.snap.start(t2), e2.offsets = t2.state.offsets, t2.state = e2;
        }, set: function(t2) {
          var e2 = t2.interaction, n2 = t2.state, r2 = t2.coords, i2 = n2.options, a2 = n2.offsets, s2 = { x: r2.x - a2[0].x, y: r2.y - a2[0].y };
          n2.options = (0, T.default)({}, i2), n2.options.targets = [];
          for (var l2 = 0; l2 < (i2.targets || []).length; l2++) {
            var c2 = (i2.targets || [])[l2], u2 = void 0;
            if (u2 = o.default.func(c2) ? c2(s2.x, s2.y, e2) : c2) {
              for (var d2 = 0; d2 < n2.targetFields.length; d2++) {
                var f2 = n2.targetFields[d2], p2 = f2[0], v2 = f2[1];
                if (p2 in u2 || v2 in u2) {
                  u2.x = u2[p2], u2.y = u2[v2];
                  break;
                }
              }
              n2.options.targets.push(u2);
            }
          }
          var h2 = ar.snap.set(t2);
          return n2.options = i2, h2;
        }, defaults: { range: 1 / 0, targets: null, offset: null, endOnly: false, enabled: false } };
        cr.snapSize = ur;
        var dr = (0, ge.makeModifier)(ur, "snapSize");
        cr.default = dr;
        var fr = {};
        Object.defineProperty(fr, "__esModule", { value: true }), fr.snapEdges = fr.default = void 0;
        var pr = { start: function(t2) {
          var e2 = t2.edges;
          return e2 ? (t2.state.targetFields = t2.state.targetFields || [[e2.left ? "left" : "right", e2.top ? "top" : "bottom"]], cr.snapSize.start(t2)) : null;
        }, set: cr.snapSize.set, defaults: (0, T.default)((0, de.default)(cr.snapSize.defaults), { targets: null, range: null, offset: { x: 0, y: 0 } }) };
        fr.snapEdges = pr;
        var vr = (0, ge.makeModifier)(pr, "snapEdges");
        fr.default = vr;
        var hr = {};
        Object.defineProperty(hr, "__esModule", { value: true }), Object.defineProperty(hr, "default", { enumerable: true, get: function() {
          return Rn.default;
        } });
        var gr = {};
        Object.defineProperty(gr, "__esModule", { value: true }), Object.defineProperty(gr, "default", { enumerable: true, get: function() {
          return Rn.default;
        } });
        var mr = {};
        Object.defineProperty(mr, "__esModule", { value: true }), mr.default = void 0;
        var yr = { aspectRatio: Dn.default, restrictEdges: Vn.default, restrict: Wn.default, restrictRect: Kn.default, restrictSize: tr.default, snapEdges: fr.default, snap: ar.default, snapSize: cr.default, spring: hr.default, avoid: Yn.default, transform: gr.default, rubberband: or.default };
        mr.default = yr;
        var br = {};
        Object.defineProperty(br, "__esModule", { value: true }), br.default = void 0;
        var xr = { id: "modifiers", install: function(t2) {
          var e2 = t2.interactStatic;
          for (var n2 in t2.usePlugin(ge.default), t2.usePlugin(Tn.default), e2.modifiers = mr.default, mr.default) {
            var r2 = mr.default[n2], i2 = r2._defaults, o2 = r2._methods;
            i2._methods = o2, t2.defaults.perAction[n2] = i2;
          }
        } };
        br.default = xr;
        var _r = {};
        Object.defineProperty(_r, "__esModule", { value: true }), _r.default = void 0, _r.default = {};
        var wr = {};
        function Pr(t2) {
          if (t2 === void 0)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t2;
        }
        Object.defineProperty(wr, "__esModule", { value: true }), wr.PointerEvent = wr.default = void 0;
        var Er = function(t2) {
          var e2, n2;
          function r2(e3, n3, r3, i3, o2, a2) {
            var s2;
            if ((s2 = t2.call(this, o2) || this).type = void 0, s2.originalEvent = void 0, s2.pointerId = void 0, s2.pointerType = void 0, s2.double = void 0, s2.pageX = void 0, s2.pageY = void 0, s2.clientX = void 0, s2.clientY = void 0, s2.dt = void 0, s2.eventable = void 0, X.pointerExtend(Pr(s2), r3), r3 !== n3 && X.pointerExtend(Pr(s2), n3), s2.timeStamp = a2, s2.originalEvent = r3, s2.type = e3, s2.pointerId = X.getPointerId(n3), s2.pointerType = X.getPointerType(n3), s2.target = i3, s2.currentTarget = null, e3 === "tap") {
              var l2 = o2.getPointerIndex(n3);
              s2.dt = s2.timeStamp - o2.pointers[l2].downTime;
              var c2 = s2.timeStamp - o2.tapTime;
              s2.double = !!(o2.prevTap && o2.prevTap.type !== "doubletap" && o2.prevTap.target === s2.target && c2 < 500);
            } else
              e3 === "doubletap" && (s2.dt = n3.timeStamp - o2.tapTime);
            return s2;
          }
          n2 = t2, (e2 = r2).prototype = Object.create(n2.prototype), e2.prototype.constructor = e2, e2.__proto__ = n2;
          var i2 = r2.prototype;
          return i2._subtractOrigin = function(t3) {
            var e3 = t3.x, n3 = t3.y;
            return this.pageX -= e3, this.pageY -= n3, this.clientX -= e3, this.clientY -= n3, this;
          }, i2._addOrigin = function(t3) {
            var e3 = t3.x, n3 = t3.y;
            return this.pageX += e3, this.pageY += n3, this.clientX += e3, this.clientY += n3, this;
          }, i2.preventDefault = function() {
            this.originalEvent.preventDefault();
          }, r2;
        }(q.BaseEvent);
        wr.PointerEvent = wr.default = Er;
        var Sr = {};
        Object.defineProperty(Sr, "__esModule", { value: true }), Sr.default = void 0;
        var Mr = { id: "pointer-events/base", before: ["inertia", "modifiers", "auto-start", "actions"], install: function(t2) {
          t2.pointerEvents = Mr, t2.defaults.actions.pointerEvents = Mr.defaults, (0, T.default)(t2.actions.phaselessTypes, Mr.types);
        }, listeners: { "interactions:new": function(t2) {
          var e2 = t2.interaction;
          e2.prevTap = null, e2.tapTime = 0;
        }, "interactions:update-pointer": function(t2) {
          var e2 = t2.down, n2 = t2.pointerInfo;
          !e2 && n2.hold || (n2.hold = { duration: 1 / 0, timeout: null });
        }, "interactions:move": function(t2, e2) {
          var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget;
          t2.duplicate || n2.pointerIsDown && !n2.pointerWasMoved || (n2.pointerIsDown && Ir(t2), Or({ interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: "move" }, e2));
        }, "interactions:down": function(t2, e2) {
          !function(t3, e3) {
            for (var n2 = t3.interaction, r2 = t3.pointer, i2 = t3.event, o2 = t3.eventTarget, a2 = t3.pointerIndex, s2 = n2.pointers[a2].hold, l2 = _.getPath(o2), c2 = { interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: "hold", targets: [], path: l2, node: null }, u2 = 0; u2 < l2.length; u2++) {
              var d2 = l2[u2];
              c2.node = d2, e3.fire("pointerEvents:collect-targets", c2);
            }
            if (c2.targets.length) {
              for (var f2 = 1 / 0, p2 = 0; p2 < c2.targets.length; p2++) {
                var v2 = c2.targets[p2].eventable.options.holdDuration;
                v2 < f2 && (f2 = v2);
              }
              s2.duration = f2, s2.timeout = setTimeout(function() {
                Or({ interaction: n2, eventTarget: o2, pointer: r2, event: i2, type: "hold" }, e3);
              }, f2);
            }
          }(t2, e2), Or(t2, e2);
        }, "interactions:up": function(t2, e2) {
          Ir(t2), Or(t2, e2), function(t3, e3) {
            var n2 = t3.interaction, r2 = t3.pointer, i2 = t3.event, o2 = t3.eventTarget;
            n2.pointerWasMoved || Or({ interaction: n2, eventTarget: o2, pointer: r2, event: i2, type: "tap" }, e3);
          }(t2, e2);
        }, "interactions:cancel": function(t2, e2) {
          Ir(t2), Or(t2, e2);
        } }, PointerEvent: wr.PointerEvent, fire: Or, collectEventTargets: Tr, defaults: { holdDuration: 600, ignoreFrom: null, allowFrom: null, origin: { x: 0, y: 0 } }, types: { down: true, move: true, up: true, cancel: true, tap: true, doubletap: true, hold: true } };
        function Or(t2, e2) {
          var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget, a2 = t2.type, s2 = t2.targets, l2 = s2 === void 0 ? Tr(t2, e2) : s2, c2 = new wr.PointerEvent(a2, r2, i2, o2, n2, e2.now());
          e2.fire("pointerEvents:new", { pointerEvent: c2 });
          for (var u2 = { interaction: n2, pointer: r2, event: i2, eventTarget: o2, targets: l2, type: a2, pointerEvent: c2 }, d2 = 0; d2 < l2.length; d2++) {
            var f2 = l2[d2];
            for (var p2 in f2.props || {})
              c2[p2] = f2.props[p2];
            var v2 = (0, j.default)(f2.eventable, f2.node);
            if (c2._subtractOrigin(v2), c2.eventable = f2.eventable, c2.currentTarget = f2.node, f2.eventable.fire(c2), c2._addOrigin(v2), c2.immediatePropagationStopped || c2.propagationStopped && d2 + 1 < l2.length && l2[d2 + 1].node !== c2.currentTarget)
              break;
          }
          if (e2.fire("pointerEvents:fired", u2), a2 === "tap") {
            var h2 = c2.double ? Or({ interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: "doubletap" }, e2) : c2;
            n2.prevTap = h2, n2.tapTime = h2.timeStamp;
          }
          return c2;
        }
        function Tr(t2, e2) {
          var n2 = t2.interaction, r2 = t2.pointer, i2 = t2.event, o2 = t2.eventTarget, a2 = t2.type, s2 = n2.getPointerIndex(r2), l2 = n2.pointers[s2];
          if (a2 === "tap" && (n2.pointerWasMoved || !l2 || l2.downTarget !== o2))
            return [];
          for (var c2 = _.getPath(o2), u2 = { interaction: n2, pointer: r2, event: i2, eventTarget: o2, type: a2, path: c2, targets: [], node: null }, d2 = 0; d2 < c2.length; d2++) {
            var f2 = c2[d2];
            u2.node = f2, e2.fire("pointerEvents:collect-targets", u2);
          }
          return a2 === "hold" && (u2.targets = u2.targets.filter(function(t3) {
            return t3.eventable.options.holdDuration === n2.pointers[s2].hold.duration;
          })), u2.targets;
        }
        function Ir(t2) {
          var e2 = t2.interaction, n2 = t2.pointerIndex, r2 = e2.pointers[n2].hold;
          r2 && r2.timeout && (clearTimeout(r2.timeout), r2.timeout = null);
        }
        var Dr = Mr;
        Sr.default = Dr;
        var jr = {};
        function zr(t2) {
          var e2 = t2.interaction;
          e2.holdIntervalHandle && (clearInterval(e2.holdIntervalHandle), e2.holdIntervalHandle = null);
        }
        Object.defineProperty(jr, "__esModule", { value: true }), jr.default = void 0;
        var Ar = { id: "pointer-events/holdRepeat", install: function(t2) {
          t2.usePlugin(Sr.default);
          var e2 = t2.pointerEvents;
          e2.defaults.holdRepeatInterval = 0, e2.types.holdrepeat = t2.actions.phaselessTypes.holdrepeat = true;
        }, listeners: ["move", "up", "cancel", "endall"].reduce(function(t2, e2) {
          return t2["pointerEvents:" + e2] = zr, t2;
        }, { "pointerEvents:new": function(t2) {
          var e2 = t2.pointerEvent;
          e2.type === "hold" && (e2.count = (e2.count || 0) + 1);
        }, "pointerEvents:fired": function(t2, e2) {
          var n2 = t2.interaction, r2 = t2.pointerEvent, i2 = t2.eventTarget, o2 = t2.targets;
          if (r2.type === "hold" && o2.length) {
            var a2 = o2[0].eventable.options.holdRepeatInterval;
            a2 <= 0 || (n2.holdIntervalHandle = setTimeout(function() {
              e2.pointerEvents.fire({ interaction: n2, eventTarget: i2, type: "hold", pointer: r2, event: r2 }, e2);
            }, a2));
          }
        } }) };
        jr.default = Ar;
        var Cr = {};
        function kr(t2) {
          return (0, T.default)(this.events.options, t2), this;
        }
        Object.defineProperty(Cr, "__esModule", { value: true }), Cr.default = void 0;
        var Rr = { id: "pointer-events/interactableTargets", install: function(t2) {
          var e2 = t2.Interactable;
          e2.prototype.pointerEvents = kr;
          var n2 = e2.prototype._backCompatOption;
          e2.prototype._backCompatOption = function(t3, e3) {
            var r2 = n2.call(this, t3, e3);
            return r2 === this && (this.events.options[t3] = e3), r2;
          };
        }, listeners: { "pointerEvents:collect-targets": function(t2, e2) {
          var n2 = t2.targets, r2 = t2.node, i2 = t2.type, o2 = t2.eventTarget;
          e2.interactables.forEachMatch(r2, function(t3) {
            var e3 = t3.events, a2 = e3.options;
            e3.types[i2] && e3.types[i2].length && t3.testIgnoreAllow(a2, r2, o2) && n2.push({ node: r2, eventable: e3, props: { interactable: t3 } });
          });
        }, "interactable:new": function(t2) {
          var e2 = t2.interactable;
          e2.events.getRect = function(t3) {
            return e2.getRect(t3);
          };
        }, "interactable:set": function(t2, e2) {
          var n2 = t2.interactable, r2 = t2.options;
          (0, T.default)(n2.events.options, e2.pointerEvents.defaults), (0, T.default)(n2.events.options, r2.pointerEvents || {});
        } } };
        Cr.default = Rr;
        var Fr = {};
        Object.defineProperty(Fr, "__esModule", { value: true }), Fr.default = void 0;
        var Xr = { id: "pointer-events", install: function(t2) {
          t2.usePlugin(Sr), t2.usePlugin(jr.default), t2.usePlugin(Cr.default);
        } };
        Fr.default = Xr;
        var Yr = {};
        Object.defineProperty(Yr, "__esModule", { value: true }), Yr.default = void 0, Yr.default = {};
        var Wr = {};
        function Br(t2) {
          var e2 = t2.Interactable;
          t2.actions.phases.reflow = true, e2.prototype.reflow = function(e3) {
            return function(t3, e4, n2) {
              for (var r2 = o.default.string(t3.target) ? G.from(t3._context.querySelectorAll(t3.target)) : [t3.target], i2 = n2.window.Promise, a2 = i2 ? [] : null, s2 = function() {
                var o2 = r2[l2], s3 = t3.getRect(o2);
                if (!s3)
                  return "break";
                var c2 = G.find(n2.interactions.list, function(n3) {
                  return n3.interacting() && n3.interactable === t3 && n3.element === o2 && n3.prepared.name === e4.name;
                }), u2 = void 0;
                if (c2)
                  c2.move(), a2 && (u2 = c2._reflowPromise || new i2(function(t4) {
                    c2._reflowResolve = t4;
                  }));
                else {
                  var d2 = (0, I.tlbrToXywh)(s3), f2 = { page: { x: d2.x, y: d2.y }, client: { x: d2.x, y: d2.y }, timeStamp: n2.now() }, p2 = X.coordsToEvent(f2);
                  u2 = function(t4, e5, n3, r3, i3) {
                    var o3 = t4.interactions.new({ pointerType: "reflow" }), a3 = { interaction: o3, event: i3, pointer: i3, eventTarget: n3, phase: "reflow" };
                    o3.interactable = e5, o3.element = n3, o3.prevEvent = i3, o3.updatePointer(i3, i3, n3, true), X.setZeroCoords(o3.coords.delta), (0, It.copyAction)(o3.prepared, r3), o3._doPhase(a3);
                    var s4 = t4.window.Promise, l3 = s4 ? new s4(function(t5) {
                      o3._reflowResolve = t5;
                    }) : void 0;
                    return o3._reflowPromise = l3, o3.start(r3, e5, n3), o3._interacting ? (o3.move(a3), o3.end(i3)) : (o3.stop(), o3._reflowResolve()), o3.removePointer(i3, i3), l3;
                  }(n2, t3, o2, e4, p2);
                }
                a2 && a2.push(u2);
              }, l2 = 0; l2 < r2.length && s2() !== "break"; l2++)
                ;
              return a2 && i2.all(a2).then(function() {
                return t3;
              });
            }(this, e3, t2);
          };
        }
        Object.defineProperty(Wr, "__esModule", { value: true }), Wr.install = Br, Wr.default = void 0;
        var Lr = { id: "reflow", install: Br, listeners: { "interactions:stop": function(t2, e2) {
          var n2 = t2.interaction;
          n2.pointerType === "reflow" && (n2._reflowResolve && n2._reflowResolve(), G.remove(e2.interactions.list, n2));
        } } };
        Wr.default = Lr;
        var Nr = {};
        Object.defineProperty(Nr, "__esModule", { value: true }), Nr.default = void 0, Nr.default = {};
        var Vr = { exports: {} };
        Object.defineProperty(Vr.exports, "__esModule", { value: true }), Vr.exports.default = void 0, xn.default.use(_r.default), xn.default.use(Jt.default), xn.default.use(De.default), xn.default.use(Zt.default), xn.default.use(yt.default), xn.default.use(Fr.default), xn.default.use(Fe.default), xn.default.use(br.default), xn.default.use($t.default), xn.default.use(gt.default), xn.default.use(Et.default), xn.default.use(Wr.default), xn.default.use(ue.default), xn.default.use(Nr.default), xn.default.use(Yr.default), xn.default.use(ie.default);
        var qr = xn.default;
        if (Vr.exports.default = qr, Vr)
          try {
            Vr.exports = xn.default;
          } catch (t2) {
          }
        xn.default.default = xn.default, Vr = Vr.exports;
        var Ur = { exports: {} };
        Object.defineProperty(Ur.exports, "__esModule", { value: true }), Ur.exports.default = void 0;
        var Gr = Vr.default;
        if (Ur.exports.default = Gr, Ur)
          try {
            Ur.exports = Vr.default;
          } catch (t2) {
          }
        return Vr.default.default = Vr.default, Ur.exports;
      });
    }
  });

  // ns-hugo:C:\dev\products\aircontrol\themes\aircontrol\assets\js\components\resizeBlock.js
  var import_iframe_resizer = __toModule(require_iframe_resizer());
  var import_interactjs = __toModule(require_interact_min());
  var resizeBlock_default = () => {
    return {
      resizing: false,
      width: "100%",
      setWidth(event) {
        if (!event)
          return;
        if (event.device === "desktop") {
          this.width = "100%";
        }
        if (event.device === "tablet") {
          this.width = "900px";
        }
        if (event.device === "mobile") {
          this.width = "400px";
        }
      },
      init() {
        const [iframe] = import_iframe_resizer.default.iframeResizer({
          scrolling: false,
          autoResize: false,
          checkOrigin: false,
          resizeFrom: "child",
          sizeHeight: true,
          heightCalculationMethod: "lowestElement"
        }, this.$refs.iframe);
        (0, import_interactjs.default)(this.$refs.root).resizable({
          invert: "none",
          edges: {
            top: false,
            left: false,
            bottom: false,
            right: this.$refs.handle
          },
          modifiers: [
            import_interactjs.default.modifiers.restrictSize({
              min: {
                width: 336
              }
            }),
            import_interactjs.default.modifiers.restrictEdges({
              outer: "parent"
            })
          ]
        }).on("resizestart", (e) => {
          this.resizing = true;
        }).on("resizeend", (e) => {
          this.resizing = false;
          if (e.rect.width === this.$refs.root.parentElement.clientWidth) {
            this.width = "100%";
          }
        }).on("resizemove", (e) => {
          this.width = `${e.rect.width}px`;
          iframe.iFrameResizer.resize();
        });
      }
    };
  };

  // ns-hugo:C:\dev\products\aircontrol\themes\aircontrol\assets\js\components\noticesHandler.js
  var noticesHandler_default = () => {
    return {
      notices: [],
      visible: [],
      add(notice) {
        notice.id = Date.now();
        this.notices.push(notice);
        this.fire(notice.id);
      },
      fire(id) {
        this.visible.push(this.notices.find((notice) => notice.id == id));
        const timeShown = 2e3 * this.visible.length;
        setTimeout(() => {
          this.remove(id);
        }, timeShown);
      },
      remove(id) {
        const notice = this.visible.find((notice2) => notice2.id == id);
        const index = this.visible.indexOf(notice);
        this.visible.splice(index, 1);
      }
    };
  };

  // node_modules/alpinejs/dist/module.esm.js
  var __create2 = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __markAsModule2 = (target) => __defProp2(target, "__esModule", { value: true });
  var __commonJS2 = (callback, module) => () => {
    if (!module) {
      module = { exports: {} };
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames2(module))
        if (!__hasOwnProp2.call(target, key) && key !== "default")
          __defProp2(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc2(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule2 = (module) => {
    return __exportStar(__markAsModule2(__defProp2(module != null ? __create2(__getProtoOf2(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var require_shared_cjs = __commonJS2((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeMap(str, expectsLowerCase) {
      const map = Object.create(null);
      const list = str.split(",");
      for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
    }
    var PatchFlagNames = {
      [1]: `TEXT`,
      [2]: `CLASS`,
      [4]: `STYLE`,
      [8]: `PROPS`,
      [16]: `FULL_PROPS`,
      [32]: `HYDRATE_EVENTS`,
      [64]: `STABLE_FRAGMENT`,
      [128]: `KEYED_FRAGMENT`,
      [256]: `UNKEYED_FRAGMENT`,
      [512]: `NEED_PATCH`,
      [1024]: `DYNAMIC_SLOTS`,
      [2048]: `DEV_ROOT_FRAGMENT`,
      [-1]: `HOISTED`,
      [-2]: `BAIL`
    };
    var slotFlagsText = {
      [1]: "STABLE",
      [2]: "DYNAMIC",
      [3]: "FORWARDED"
    };
    var GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
    var isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
    var range = 2;
    function generateCodeFrame(source, start2 = 0, end = source.length) {
      const lines = source.split(/\r?\n/);
      let count = 0;
      const res = [];
      for (let i = 0; i < lines.length; i++) {
        count += lines[i].length + 1;
        if (count >= start2) {
          for (let j = i - range; j <= i + range || end > count; j++) {
            if (j < 0 || j >= lines.length)
              continue;
            const line = j + 1;
            res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
            const lineLength = lines[j].length;
            if (j === i) {
              const pad = start2 - (count - lineLength) + 1;
              const length = Math.max(1, end > count ? lineLength - pad : end - start2);
              res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
            } else if (j > i) {
              if (end > count) {
                const length = Math.max(Math.min(end - count, lineLength), 1);
                res.push(`   |  ` + "^".repeat(length));
              }
              count += lineLength + 1;
            }
          }
          break;
        }
      }
      return res.join("\n");
    }
    var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
    var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
    var unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
    var attrValidationCache = {};
    function isSSRSafeAttrName(name) {
      if (attrValidationCache.hasOwnProperty(name)) {
        return attrValidationCache[name];
      }
      const isUnsafe = unsafeAttrCharRE.test(name);
      if (isUnsafe) {
        console.error(`unsafe attribute name: ${name}`);
      }
      return attrValidationCache[name] = !isUnsafe;
    }
    var propsToAttrMap = {
      acceptCharset: "accept-charset",
      className: "class",
      htmlFor: "for",
      httpEquiv: "http-equiv"
    };
    var isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
    var isKnownAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
    function normalizeStyle(value) {
      if (isArray(value)) {
        const res = {};
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
          if (normalized) {
            for (const key in normalized) {
              res[key] = normalized[key];
            }
          }
        }
        return res;
      } else if (isObject(value)) {
        return value;
      }
    }
    var listDelimiterRE = /;(?![^(]*\))/g;
    var propertyDelimiterRE = /:(.+)/;
    function parseStringStyle(cssText) {
      const ret = {};
      cssText.split(listDelimiterRE).forEach((item) => {
        if (item) {
          const tmp = item.split(propertyDelimiterRE);
          tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
        }
      });
      return ret;
    }
    function stringifyStyle(styles) {
      let ret = "";
      if (!styles) {
        return ret;
      }
      for (const key in styles) {
        const value = styles[key];
        const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
        if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
          ret += `${normalizedKey}:${value};`;
        }
      }
      return ret;
    }
    function normalizeClass(value) {
      let res = "";
      if (isString(value)) {
        res = value;
      } else if (isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          const normalized = normalizeClass(value[i]);
          if (normalized) {
            res += normalized + " ";
          }
        }
      } else if (isObject(value)) {
        for (const name in value) {
          if (value[name]) {
            res += name + " ";
          }
        }
      }
      return res.trim();
    }
    var HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
    var SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
    var VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
    var isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
    var isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
    var isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
    var escapeRE = /["'&<>]/;
    function escapeHtml(string) {
      const str = "" + string;
      const match = escapeRE.exec(str);
      if (!match) {
        return str;
      }
      let html = "";
      let escaped;
      let index;
      let lastIndex = 0;
      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            escaped = "&quot;";
            break;
          case 38:
            escaped = "&amp;";
            break;
          case 39:
            escaped = "&#39;";
            break;
          case 60:
            escaped = "&lt;";
            break;
          case 62:
            escaped = "&gt;";
            break;
          default:
            continue;
        }
        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }
        lastIndex = index + 1;
        html += escaped;
      }
      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
    var commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
    function escapeHtmlComment(src) {
      return src.replace(commentStripRE, "");
    }
    function looseCompareArrays(a, b) {
      if (a.length !== b.length)
        return false;
      let equal = true;
      for (let i = 0; equal && i < a.length; i++) {
        equal = looseEqual(a[i], b[i]);
      }
      return equal;
    }
    function looseEqual(a, b) {
      if (a === b)
        return true;
      let aValidType = isDate(a);
      let bValidType = isDate(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? a.getTime() === b.getTime() : false;
      }
      aValidType = isArray(a);
      bValidType = isArray(b);
      if (aValidType || bValidType) {
        return aValidType && bValidType ? looseCompareArrays(a, b) : false;
      }
      aValidType = isObject(a);
      bValidType = isObject(b);
      if (aValidType || bValidType) {
        if (!aValidType || !bValidType) {
          return false;
        }
        const aKeysCount = Object.keys(a).length;
        const bKeysCount = Object.keys(b).length;
        if (aKeysCount !== bKeysCount) {
          return false;
        }
        for (const key in a) {
          const aHasKey = a.hasOwnProperty(key);
          const bHasKey = b.hasOwnProperty(key);
          if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
            return false;
          }
        }
      }
      return String(a) === String(b);
    }
    function looseIndexOf(arr, val) {
      return arr.findIndex((item) => looseEqual(item, val));
    }
    var toDisplayString = (val) => {
      return val == null ? "" : isObject(val) ? JSON.stringify(val, replacer, 2) : String(val);
    };
    var replacer = (_key, val) => {
      if (isMap(val)) {
        return {
          [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
            entries[`${key} =>`] = val2;
            return entries;
          }, {})
        };
      } else if (isSet(val)) {
        return {
          [`Set(${val.size})`]: [...val.values()]
        };
      } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
        return String(val);
      }
      return val;
    };
    var babelParserDefaultPlugins = [
      "bigInt",
      "optionalChaining",
      "nullishCoalescingOperator"
    ];
    var EMPTY_OBJ = Object.freeze({});
    var EMPTY_ARR = Object.freeze([]);
    var NOOP = () => {
    };
    var NO = () => false;
    var onRE = /^on[^a-z]/;
    var isOn = (key) => onRE.test(key);
    var isModelListener = (key) => key.startsWith("onUpdate:");
    var extend = Object.assign;
    var remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
        arr.splice(i, 1);
      }
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasOwn = (val, key) => hasOwnProperty.call(val, key);
    var isArray = Array.isArray;
    var isMap = (val) => toTypeString(val) === "[object Map]";
    var isSet = (val) => toTypeString(val) === "[object Set]";
    var isDate = (val) => val instanceof Date;
    var isFunction = (val) => typeof val === "function";
    var isString = (val) => typeof val === "string";
    var isSymbol = (val) => typeof val === "symbol";
    var isObject = (val) => val !== null && typeof val === "object";
    var isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
    };
    var objectToString = Object.prototype.toString;
    var toTypeString = (value) => objectToString.call(value);
    var toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    var isPlainObject = (val) => toTypeString(val) === "[object Object]";
    var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
    var cacheStringFunction = (fn) => {
      const cache = Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    var camelizeRE = /-(\w)/g;
    var camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    });
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
    var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
    var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
    var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
    var invokeArrayFns = (fns, arg) => {
      for (let i = 0; i < fns.length; i++) {
        fns[i](arg);
      }
    };
    var def = (obj, key, value) => {
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value
      });
    };
    var toNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
    };
    var _globalThis;
    var getGlobalThis = () => {
      return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
    };
    exports.EMPTY_ARR = EMPTY_ARR;
    exports.EMPTY_OBJ = EMPTY_OBJ;
    exports.NO = NO;
    exports.NOOP = NOOP;
    exports.PatchFlagNames = PatchFlagNames;
    exports.babelParserDefaultPlugins = babelParserDefaultPlugins;
    exports.camelize = camelize;
    exports.capitalize = capitalize;
    exports.def = def;
    exports.escapeHtml = escapeHtml;
    exports.escapeHtmlComment = escapeHtmlComment;
    exports.extend = extend;
    exports.generateCodeFrame = generateCodeFrame;
    exports.getGlobalThis = getGlobalThis;
    exports.hasChanged = hasChanged;
    exports.hasOwn = hasOwn;
    exports.hyphenate = hyphenate;
    exports.invokeArrayFns = invokeArrayFns;
    exports.isArray = isArray;
    exports.isBooleanAttr = isBooleanAttr2;
    exports.isDate = isDate;
    exports.isFunction = isFunction;
    exports.isGloballyWhitelisted = isGloballyWhitelisted;
    exports.isHTMLTag = isHTMLTag;
    exports.isIntegerKey = isIntegerKey;
    exports.isKnownAttr = isKnownAttr;
    exports.isMap = isMap;
    exports.isModelListener = isModelListener;
    exports.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
    exports.isObject = isObject;
    exports.isOn = isOn;
    exports.isPlainObject = isPlainObject;
    exports.isPromise = isPromise;
    exports.isReservedProp = isReservedProp;
    exports.isSSRSafeAttrName = isSSRSafeAttrName;
    exports.isSVGTag = isSVGTag;
    exports.isSet = isSet;
    exports.isSpecialBooleanAttr = isSpecialBooleanAttr;
    exports.isString = isString;
    exports.isSymbol = isSymbol;
    exports.isVoidTag = isVoidTag;
    exports.looseEqual = looseEqual;
    exports.looseIndexOf = looseIndexOf;
    exports.makeMap = makeMap;
    exports.normalizeClass = normalizeClass;
    exports.normalizeStyle = normalizeStyle;
    exports.objectToString = objectToString;
    exports.parseStringStyle = parseStringStyle;
    exports.propsToAttrMap = propsToAttrMap;
    exports.remove = remove;
    exports.slotFlagsText = slotFlagsText;
    exports.stringifyStyle = stringifyStyle;
    exports.toDisplayString = toDisplayString;
    exports.toHandlerKey = toHandlerKey;
    exports.toNumber = toNumber;
    exports.toRawType = toRawType;
    exports.toTypeString = toTypeString;
  });
  var require_shared = __commonJS2((exports, module) => {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_shared_cjs();
    }
  });
  var require_reactivity_cjs = __commonJS2((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var shared = require_shared();
    var targetMap = new WeakMap();
    var effectStack = [];
    var activeEffect;
    var ITERATE_KEY = Symbol("iterate");
    var MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
    function isEffect(fn) {
      return fn && fn._isEffect === true;
    }
    function effect3(fn, options = shared.EMPTY_OBJ) {
      if (isEffect(fn)) {
        fn = fn.raw;
      }
      const effect4 = createReactiveEffect(fn, options);
      if (!options.lazy) {
        effect4();
      }
      return effect4;
    }
    function stop2(effect4) {
      if (effect4.active) {
        cleanup(effect4);
        if (effect4.options.onStop) {
          effect4.options.onStop();
        }
        effect4.active = false;
      }
    }
    var uid = 0;
    function createReactiveEffect(fn, options) {
      const effect4 = function reactiveEffect() {
        if (!effect4.active) {
          return fn();
        }
        if (!effectStack.includes(effect4)) {
          cleanup(effect4);
          try {
            enableTracking();
            effectStack.push(effect4);
            activeEffect = effect4;
            return fn();
          } finally {
            effectStack.pop();
            resetTracking();
            activeEffect = effectStack[effectStack.length - 1];
          }
        }
      };
      effect4.id = uid++;
      effect4.allowRecurse = !!options.allowRecurse;
      effect4._isEffect = true;
      effect4.active = true;
      effect4.raw = fn;
      effect4.deps = [];
      effect4.options = options;
      return effect4;
    }
    function cleanup(effect4) {
      const { deps } = effect4;
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].delete(effect4);
        }
        deps.length = 0;
      }
    }
    var shouldTrack = true;
    var trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function enableTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = true;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function track(target, type, key) {
      if (!shouldTrack || activeEffect === void 0) {
        return;
      }
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Set());
      }
      if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (activeEffect.options.onTrack) {
          activeEffect.options.onTrack({
            effect: activeEffect,
            target,
            type,
            key
          });
        }
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        return;
      }
      const effects = new Set();
      const add2 = (effectsToAdd) => {
        if (effectsToAdd) {
          effectsToAdd.forEach((effect4) => {
            if (effect4 !== activeEffect || effect4.allowRecurse) {
              effects.add(effect4);
            }
          });
        }
      };
      if (type === "clear") {
        depsMap.forEach(add2);
      } else if (key === "length" && shared.isArray(target)) {
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 >= newValue) {
            add2(dep);
          }
        });
      } else {
        if (key !== void 0) {
          add2(depsMap.get(key));
        }
        switch (type) {
          case "add":
            if (!shared.isArray(target)) {
              add2(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                add2(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (shared.isIntegerKey(key)) {
              add2(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!shared.isArray(target)) {
              add2(depsMap.get(ITERATE_KEY));
              if (shared.isMap(target)) {
                add2(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (shared.isMap(target)) {
              add2(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
      const run = (effect4) => {
        if (effect4.options.onTrigger) {
          effect4.options.onTrigger({
            effect: effect4,
            target,
            key,
            type,
            newValue,
            oldValue,
            oldTarget
          });
        }
        if (effect4.options.scheduler) {
          effect4.options.scheduler(effect4);
        } else {
          effect4();
        }
      };
      effects.forEach(run);
    }
    var isNonTrackableKeys = /* @__PURE__ */ shared.makeMap(`__proto__,__v_isRef,__isVue`);
    var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(shared.isSymbol));
    var get2 = /* @__PURE__ */ createGetter();
    var shallowGet = /* @__PURE__ */ createGetter(false, true);
    var readonlyGet = /* @__PURE__ */ createGetter(true);
    var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
    var arrayInstrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      const method = Array.prototype[key];
      arrayInstrumentations[key] = function(...args) {
        const arr = toRaw2(this);
        for (let i = 0, l = this.length; i < l; i++) {
          track(arr, "get", i + "");
        }
        const res = method.apply(arr, args);
        if (res === -1 || res === false) {
          return method.apply(arr, args.map(toRaw2));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      const method = Array.prototype[key];
      arrayInstrumentations[key] = function(...args) {
        pauseTracking();
        const res = method.apply(this, args);
        resetTracking();
        return res;
      };
    });
    function createGetter(isReadonly2 = false, shallow = false) {
      return function get3(target, key, receiver) {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
          return target;
        }
        const targetIsArray = shared.isArray(target);
        if (!isReadonly2 && targetIsArray && shared.hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (shared.isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly2) {
          track(target, "get", key);
        }
        if (shallow) {
          return res;
        }
        if (isRef(res)) {
          const shouldUnwrap = !targetIsArray || !shared.isIntegerKey(key);
          return shouldUnwrap ? res.value : res;
        }
        if (shared.isObject(res)) {
          return isReadonly2 ? readonly(res) : reactive3(res);
        }
        return res;
      };
    }
    var set2 = /* @__PURE__ */ createSetter();
    var shallowSet = /* @__PURE__ */ createSetter(true);
    function createSetter(shallow = false) {
      return function set3(target, key, value, receiver) {
        let oldValue = target[key];
        if (!shallow) {
          value = toRaw2(value);
          oldValue = toRaw2(oldValue);
          if (!shared.isArray(target) && isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
          }
        }
        const hadKey = shared.isArray(target) && shared.isIntegerKey(key) ? Number(key) < target.length : shared.hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (target === toRaw2(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (shared.hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
        }
        return result;
      };
    }
    function deleteProperty(target, key) {
      const hadKey = shared.hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    function has(target, key) {
      const result = Reflect.has(target, key);
      if (!shared.isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    function ownKeys(target) {
      track(target, "iterate", shared.isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    }
    var mutableHandlers = {
      get: get2,
      set: set2,
      deleteProperty,
      has,
      ownKeys
    };
    var readonlyHandlers = {
      get: readonlyGet,
      set(target, key) {
        {
          console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
      },
      deleteProperty(target, key) {
        {
          console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
      }
    };
    var shallowReactiveHandlers = shared.extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
    });
    var shallowReadonlyHandlers = shared.extend({}, readonlyHandlers, {
      get: shallowReadonlyGet
    });
    var toReactive = (value) => shared.isObject(value) ? reactive3(value) : value;
    var toReadonly = (value) => shared.isObject(value) ? readonly(value) : value;
    var toShallow = (value) => value;
    var getProto = (v) => Reflect.getPrototypeOf(v);
    function get$1(target, key, isReadonly2 = false, isShallow = false) {
      target = target["__v_raw"];
      const rawTarget = toRaw2(target);
      const rawKey = toRaw2(key);
      if (key !== rawKey) {
        !isReadonly2 && track(rawTarget, "get", key);
      }
      !isReadonly2 && track(rawTarget, "get", rawKey);
      const { has: has2 } = getProto(rawTarget);
      const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
      if (has2.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has2.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    }
    function has$1(key, isReadonly2 = false) {
      const target = this["__v_raw"];
      const rawTarget = toRaw2(target);
      const rawKey = toRaw2(key);
      if (key !== rawKey) {
        !isReadonly2 && track(rawTarget, "has", key);
      }
      !isReadonly2 && track(rawTarget, "has", rawKey);
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    }
    function size(target, isReadonly2 = false) {
      target = target["__v_raw"];
      !isReadonly2 && track(toRaw2(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    }
    function add(value) {
      value = toRaw2(value);
      const target = toRaw2(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, value);
      if (!hadKey) {
        target.add(value);
        trigger(target, "add", value, value);
      }
      return this;
    }
    function set$1(key, value) {
      value = toRaw2(value);
      const target = toRaw2(this);
      const { has: has2, get: get3 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw2(key);
        hadKey = has2.call(target, key);
      } else {
        checkIdentityKeys(target, has2, key);
      }
      const oldValue = get3.call(target, key);
      target.set(key, value);
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (shared.hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
      return this;
    }
    function deleteEntry(key) {
      const target = toRaw2(this);
      const { has: has2, get: get3 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw2(key);
        hadKey = has2.call(target, key);
      } else {
        checkIdentityKeys(target, has2, key);
      }
      const oldValue = get3 ? get3.call(target, key) : void 0;
      const result = target.delete(key);
      if (hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    function clear() {
      const target = toRaw2(this);
      const hadItems = target.size !== 0;
      const oldTarget = shared.isMap(target) ? new Map(target) : new Set(target);
      const result = target.clear();
      if (hadItems) {
        trigger(target, "clear", void 0, void 0, oldTarget);
      }
      return result;
    }
    function createForEach(isReadonly2, isShallow) {
      return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw2(target);
        const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      };
    }
    function createIterableMethod(method, isReadonly2, isShallow) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw2(target);
        const targetIsMap = shared.isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow ? toShallow : isReadonly2 ? toReadonly : toReactive;
        !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        return {
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          },
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        {
          const key = args[0] ? `on key "${args[0]}" ` : ``;
          console.warn(`${shared.capitalize(type)} operation ${key}failed: target is readonly.`, toRaw2(this));
        }
        return type === "delete" ? false : this;
      };
    }
    var mutableInstrumentations = {
      get(key) {
        return get$1(this, key);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    var shallowInstrumentations = {
      get(key) {
        return get$1(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    var readonlyInstrumentations = {
      get(key) {
        return get$1(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    var shallowReadonlyInstrumentations = {
      get(key) {
        return get$1(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    var iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true, false);
      shallowInstrumentations[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
    });
    function createInstrumentationGetter(isReadonly2, shallow) {
      const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly2;
        } else if (key === "__v_isReadonly") {
          return isReadonly2;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(shared.hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
      };
    }
    var mutableCollectionHandlers = {
      get: createInstrumentationGetter(false, false)
    };
    var shallowCollectionHandlers = {
      get: createInstrumentationGetter(false, true)
    };
    var readonlyCollectionHandlers = {
      get: createInstrumentationGetter(true, false)
    };
    var shallowReadonlyCollectionHandlers = {
      get: createInstrumentationGetter(true, true)
    };
    function checkIdentityKeys(target, has2, key) {
      const rawKey = toRaw2(key);
      if (rawKey !== key && has2.call(target, rawKey)) {
        const type = shared.toRawType(target);
        console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
      }
    }
    var reactiveMap = new WeakMap();
    var shallowReactiveMap = new WeakMap();
    var readonlyMap = new WeakMap();
    var shallowReadonlyMap = new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(shared.toRawType(value));
    }
    function reactive3(target) {
      if (target && target["__v_isReadonly"]) {
        return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
    }
    function shallowReactive(target) {
      return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
    }
    function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
    }
    function shallowReadonly(target) {
      return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
    }
    function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
      if (!shared.isObject(target)) {
        {
          console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
      }
      if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
    }
    function isReactive2(value) {
      if (isReadonly(value)) {
        return isReactive2(value["__v_raw"]);
      }
      return !!(value && value["__v_isReactive"]);
    }
    function isReadonly(value) {
      return !!(value && value["__v_isReadonly"]);
    }
    function isProxy(value) {
      return isReactive2(value) || isReadonly(value);
    }
    function toRaw2(observed) {
      return observed && toRaw2(observed["__v_raw"]) || observed;
    }
    function markRaw(value) {
      shared.def(value, "__v_skip", true);
      return value;
    }
    var convert = (val) => shared.isObject(val) ? reactive3(val) : val;
    function isRef(r) {
      return Boolean(r && r.__v_isRef === true);
    }
    function ref(value) {
      return createRef(value);
    }
    function shallowRef(value) {
      return createRef(value, true);
    }
    var RefImpl = class {
      constructor(_rawValue, _shallow = false) {
        this._rawValue = _rawValue;
        this._shallow = _shallow;
        this.__v_isRef = true;
        this._value = _shallow ? _rawValue : convert(_rawValue);
      }
      get value() {
        track(toRaw2(this), "get", "value");
        return this._value;
      }
      set value(newVal) {
        if (shared.hasChanged(toRaw2(newVal), this._rawValue)) {
          this._rawValue = newVal;
          this._value = this._shallow ? newVal : convert(newVal);
          trigger(toRaw2(this), "set", "value", newVal);
        }
      }
    };
    function createRef(rawValue, shallow = false) {
      if (isRef(rawValue)) {
        return rawValue;
      }
      return new RefImpl(rawValue, shallow);
    }
    function triggerRef(ref2) {
      trigger(toRaw2(ref2), "set", "value", ref2.value);
    }
    function unref(ref2) {
      return isRef(ref2) ? ref2.value : ref2;
    }
    var shallowUnwrapHandlers = {
      get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
      set: (target, key, value, receiver) => {
        const oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, receiver);
        }
      }
    };
    function proxyRefs(objectWithRefs) {
      return isReactive2(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
    }
    var CustomRefImpl = class {
      constructor(factory) {
        this.__v_isRef = true;
        const { get: get3, set: set3 } = factory(() => track(this, "get", "value"), () => trigger(this, "set", "value"));
        this._get = get3;
        this._set = set3;
      }
      get value() {
        return this._get();
      }
      set value(newVal) {
        this._set(newVal);
      }
    };
    function customRef(factory) {
      return new CustomRefImpl(factory);
    }
    function toRefs(object) {
      if (!isProxy(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
      }
      const ret = shared.isArray(object) ? new Array(object.length) : {};
      for (const key in object) {
        ret[key] = toRef(object, key);
      }
      return ret;
    }
    var ObjectRefImpl = class {
      constructor(_object, _key) {
        this._object = _object;
        this._key = _key;
        this.__v_isRef = true;
      }
      get value() {
        return this._object[this._key];
      }
      set value(newVal) {
        this._object[this._key] = newVal;
      }
    };
    function toRef(object, key) {
      return isRef(object[key]) ? object[key] : new ObjectRefImpl(object, key);
    }
    var ComputedRefImpl = class {
      constructor(getter, _setter, isReadonly2) {
        this._setter = _setter;
        this._dirty = true;
        this.__v_isRef = true;
        this.effect = effect3(getter, {
          lazy: true,
          scheduler: () => {
            if (!this._dirty) {
              this._dirty = true;
              trigger(toRaw2(this), "set", "value");
            }
          }
        });
        this["__v_isReadonly"] = isReadonly2;
      }
      get value() {
        const self2 = toRaw2(this);
        if (self2._dirty) {
          self2._value = this.effect();
          self2._dirty = false;
        }
        track(self2, "get", "value");
        return self2._value;
      }
      set value(newValue) {
        this._setter(newValue);
      }
    };
    function computed(getterOrOptions) {
      let getter;
      let setter;
      if (shared.isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => {
          console.warn("Write operation failed: computed value is readonly");
        };
      } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
      }
      return new ComputedRefImpl(getter, setter, shared.isFunction(getterOrOptions) || !getterOrOptions.set);
    }
    exports.ITERATE_KEY = ITERATE_KEY;
    exports.computed = computed;
    exports.customRef = customRef;
    exports.effect = effect3;
    exports.enableTracking = enableTracking;
    exports.isProxy = isProxy;
    exports.isReactive = isReactive2;
    exports.isReadonly = isReadonly;
    exports.isRef = isRef;
    exports.markRaw = markRaw;
    exports.pauseTracking = pauseTracking;
    exports.proxyRefs = proxyRefs;
    exports.reactive = reactive3;
    exports.readonly = readonly;
    exports.ref = ref;
    exports.resetTracking = resetTracking;
    exports.shallowReactive = shallowReactive;
    exports.shallowReadonly = shallowReadonly;
    exports.shallowRef = shallowRef;
    exports.stop = stop2;
    exports.toRaw = toRaw2;
    exports.toRef = toRef;
    exports.toRefs = toRefs;
    exports.track = track;
    exports.trigger = trigger;
    exports.triggerRef = triggerRef;
    exports.unref = unref;
  });
  var require_reactivity = __commonJS2((exports, module) => {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_reactivity_cjs();
    }
  });
  var flushPending = false;
  var flushing = false;
  var queue = [];
  function scheduler(callback) {
    queueJob(callback);
  }
  function queueJob(job) {
    if (!queue.includes(job))
      queue.push(job);
    queueFlush();
  }
  function queueFlush() {
    if (!flushing && !flushPending) {
      flushPending = true;
      queueMicrotask(flushJobs);
    }
  }
  function flushJobs() {
    flushPending = false;
    flushing = true;
    for (let i = 0; i < queue.length; i++) {
      queue[i]();
    }
    queue.length = 0;
    flushing = false;
  }
  var reactive;
  var effect;
  var release;
  var raw;
  var shouldSchedule = true;
  function disableEffectScheduling(callback) {
    shouldSchedule = false;
    callback();
    shouldSchedule = true;
  }
  function setReactivityEngine(engine) {
    reactive = engine.reactive;
    release = engine.release;
    effect = (callback) => engine.effect(callback, { scheduler: (task) => {
      if (shouldSchedule) {
        scheduler(task);
      } else {
        task();
      }
    } });
    raw = engine.raw;
  }
  function overrideEffect(override) {
    effect = override;
  }
  function elementBoundEffect(el) {
    let cleanup = () => {
    };
    let wrappedEffect = (callback) => {
      let effectReference = effect(callback);
      if (!el._x_effects) {
        el._x_effects = new Set();
        el._x_runEffects = () => {
          el._x_effects.forEach((i) => i());
        };
      }
      el._x_effects.add(effectReference);
      cleanup = () => {
        if (effectReference === void 0)
          return;
        el._x_effects.delete(effectReference);
        release(effectReference);
      };
    };
    return [wrappedEffect, () => {
      cleanup();
    }];
  }
  var onAttributeAddeds = [];
  var onElRemoveds = [];
  var onElAddeds = [];
  function onElAdded(callback) {
    onElAddeds.push(callback);
  }
  function onElRemoved(callback) {
    onElRemoveds.push(callback);
  }
  function onAttributesAdded(callback) {
    onAttributeAddeds.push(callback);
  }
  function onAttributeRemoved(el, name, callback) {
    if (!el._x_attributeCleanups)
      el._x_attributeCleanups = {};
    if (!el._x_attributeCleanups[name])
      el._x_attributeCleanups[name] = [];
    el._x_attributeCleanups[name].push(callback);
  }
  function cleanupAttributes(el, names) {
    if (!el._x_attributeCleanups)
      return;
    Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
      (names === void 0 || names.includes(name)) && value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    });
  }
  var observer = new MutationObserver(onMutate);
  var currentlyObserving = false;
  function startObservingMutations() {
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
    currentlyObserving = true;
  }
  function stopObservingMutations() {
    observer.disconnect();
    currentlyObserving = false;
  }
  var recordQueue = [];
  var willProcessRecordQueue = false;
  function flushObserver() {
    recordQueue = recordQueue.concat(observer.takeRecords());
    if (recordQueue.length && !willProcessRecordQueue) {
      willProcessRecordQueue = true;
      queueMicrotask(() => {
        processRecordQueue();
        willProcessRecordQueue = false;
      });
    }
  }
  function processRecordQueue() {
    onMutate(recordQueue);
    recordQueue.length = 0;
  }
  function mutateDom(callback) {
    if (!currentlyObserving)
      return callback();
    flushObserver();
    stopObservingMutations();
    let result = callback();
    startObservingMutations();
    return result;
  }
  function onMutate(mutations) {
    let addedNodes = [];
    let removedNodes = [];
    let addedAttributes = new Map();
    let removedAttributes = new Map();
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].target._x_ignoreMutationObserver)
        continue;
      if (mutations[i].type === "childList") {
        mutations[i].addedNodes.forEach((node) => node.nodeType === 1 && addedNodes.push(node));
        mutations[i].removedNodes.forEach((node) => node.nodeType === 1 && removedNodes.push(node));
      }
      if (mutations[i].type === "attributes") {
        let el = mutations[i].target;
        let name = mutations[i].attributeName;
        let oldValue = mutations[i].oldValue;
        let add = () => {
          if (!addedAttributes.has(el))
            addedAttributes.set(el, []);
          addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
        };
        let remove = () => {
          if (!removedAttributes.has(el))
            removedAttributes.set(el, []);
          removedAttributes.get(el).push(name);
        };
        if (el.hasAttribute(name) && oldValue === null) {
          add();
        } else if (el.hasAttribute(name)) {
          remove();
          add();
        } else {
          remove();
        }
      }
    }
    removedAttributes.forEach((attrs, el) => {
      cleanupAttributes(el, attrs);
    });
    addedAttributes.forEach((attrs, el) => {
      onAttributeAddeds.forEach((i) => i(el, attrs));
    });
    for (let node of addedNodes) {
      if (removedNodes.includes(node))
        continue;
      onElAddeds.forEach((i) => i(node));
    }
    for (let node of removedNodes) {
      if (addedNodes.includes(node))
        continue;
      onElRemoveds.forEach((i) => i(node));
    }
    addedNodes = null;
    removedNodes = null;
    addedAttributes = null;
    removedAttributes = null;
  }
  function addScopeToNode(node, data2, referenceNode) {
    node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
    return () => {
      node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
    };
  }
  function refreshScope(element, scope) {
    let existingScope = element._x_dataStack[0];
    Object.entries(scope).forEach(([key, value]) => {
      existingScope[key] = value;
    });
  }
  function closestDataStack(node) {
    if (node._x_dataStack)
      return node._x_dataStack;
    if (node instanceof ShadowRoot) {
      return closestDataStack(node.host);
    }
    if (!node.parentNode) {
      return [];
    }
    return closestDataStack(node.parentNode);
  }
  function mergeProxies(objects) {
    return new Proxy({}, {
      ownKeys: () => {
        return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
      },
      has: (target, name) => {
        return objects.some((obj) => obj.hasOwnProperty(name));
      },
      get: (target, name) => {
        return (objects.find((obj) => obj.hasOwnProperty(name)) || {})[name];
      },
      set: (target, name, value) => {
        let closestObjectWithKey = objects.find((obj) => obj.hasOwnProperty(name));
        if (closestObjectWithKey) {
          closestObjectWithKey[name] = value;
        } else {
          objects[objects.length - 1][name] = value;
        }
        return true;
      }
    });
  }
  function initInterceptors(data2) {
    let isObject = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
    let recurse = (obj, basePath = "") => {
      Object.entries(obj).forEach(([key, value]) => {
        let path = basePath === "" ? key : `${basePath}.${key}`;
        if (typeof value === "object" && value !== null && value._x_interceptor) {
          obj[key] = value.initialize(data2, path, key);
        } else {
          if (isObject(value) && value !== obj && !(value instanceof Element)) {
            recurse(value, path);
          }
        }
      });
    };
    return recurse(data2);
  }
  function interceptor(callback, mutateObj = () => {
  }) {
    let obj = {
      initialValue: void 0,
      _x_interceptor: true,
      initialize(data2, path, key) {
        return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
      }
    };
    mutateObj(obj);
    return (initialValue) => {
      if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
        let initialize = obj.initialize.bind(obj);
        obj.initialize = (data2, path, key) => {
          let innerValue = initialValue.initialize(data2, path, key);
          obj.initialValue = innerValue;
          return initialize(data2, path, key);
        };
      } else {
        obj.initialValue = initialValue;
      }
      return obj;
    };
  }
  function get(obj, path) {
    return path.split(".").reduce((carry, segment) => carry[segment], obj);
  }
  function set(obj, path, value) {
    if (typeof path === "string")
      path = path.split(".");
    if (path.length === 1)
      obj[path[0]] = value;
    else if (path.length === 0)
      throw error;
    else {
      if (obj[path[0]])
        return set(obj[path[0]], path.slice(1), value);
      else {
        obj[path[0]] = {};
        return set(obj[path[0]], path.slice(1), value);
      }
    }
  }
  var magics = {};
  function magic(name, callback) {
    magics[name] = callback;
  }
  function injectMagics(obj, el) {
    Object.entries(magics).forEach(([name, callback]) => {
      Object.defineProperty(obj, `$${name}`, {
        get() {
          return callback(el, { Alpine: alpine_default, interceptor });
        },
        enumerable: false
      });
    });
    return obj;
  }
  function evaluate(el, expression, extras = {}) {
    let result;
    evaluateLater(el, expression)((value) => result = value, extras);
    return result;
  }
  function evaluateLater(...args) {
    return theEvaluatorFunction(...args);
  }
  var theEvaluatorFunction = normalEvaluator;
  function setEvaluator(newEvaluator) {
    theEvaluatorFunction = newEvaluator;
  }
  function normalEvaluator(el, expression) {
    let overriddenMagics = {};
    injectMagics(overriddenMagics, el);
    let dataStack = [overriddenMagics, ...closestDataStack(el)];
    if (typeof expression === "function") {
      return generateEvaluatorFromFunction(dataStack, expression);
    }
    let evaluator = generateEvaluatorFromString(dataStack, expression);
    return tryCatch.bind(null, el, expression, evaluator);
  }
  function generateEvaluatorFromFunction(dataStack, func) {
    return (receiver = () => {
    }, { scope = {}, params = [] } = {}) => {
      let result = func.apply(mergeProxies([scope, ...dataStack]), params);
      runIfTypeOfFunction(receiver, result);
    };
  }
  var evaluatorMemo = {};
  function generateFunctionFromString(expression) {
    if (evaluatorMemo[expression]) {
      return evaluatorMemo[expression];
    }
    let AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression) || /^(let|const)/.test(expression) ? `(() => { ${expression} })()` : expression;
    let func = new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
    evaluatorMemo[expression] = func;
    return func;
  }
  function generateEvaluatorFromString(dataStack, expression) {
    let func = generateFunctionFromString(expression);
    return (receiver = () => {
    }, { scope = {}, params = [] } = {}) => {
      func.result = void 0;
      func.finished = false;
      let completeScope = mergeProxies([scope, ...dataStack]);
      let promise = func(func, completeScope);
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params);
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params);
        });
      }
    };
  }
  function runIfTypeOfFunction(receiver, value, scope, params) {
    if (typeof value === "function") {
      let result = value.apply(scope, params);
      if (result instanceof Promise) {
        result.then((i) => runIfTypeOfFunction(receiver, i, scope, params));
      } else {
        receiver(result);
      }
    } else {
      receiver(value);
    }
  }
  function tryCatch(el, expression, callback, ...args) {
    try {
      return callback(...args);
    } catch (e) {
      console.warn(`Alpine Expression Error: ${e.message}

Expression: "${expression}"

`, el);
      throw e;
    }
  }
  var prefixAsString = "x-";
  function prefix(subject = "") {
    return prefixAsString + subject;
  }
  function setPrefix(newPrefix) {
    prefixAsString = newPrefix;
  }
  var directiveHandlers = {};
  function directive(name, callback) {
    directiveHandlers[name] = callback;
  }
  function directives(el, attributes, originalAttributeOverride) {
    let transformedAttributeMap = {};
    let directives2 = Array.from(attributes).map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
    return directives2.map((directive2) => {
      return getDirectiveHandler(el, directive2);
    });
  }
  var isDeferringHandlers = false;
  var directiveHandlerStack = [];
  function deferHandlingDirectives(callback) {
    isDeferringHandlers = true;
    let flushHandlers = () => {
      while (directiveHandlerStack.length)
        directiveHandlerStack.shift()();
    };
    let stopDeferring = () => {
      isDeferringHandlers = false;
      flushHandlers();
    };
    callback(flushHandlers);
    stopDeferring();
  }
  function getDirectiveHandler(el, directive2) {
    let noop = () => {
    };
    let handler3 = directiveHandlers[directive2.type] || noop;
    let cleanups = [];
    let cleanup = (callback) => cleanups.push(callback);
    let [effect3, cleanupEffect] = elementBoundEffect(el);
    cleanups.push(cleanupEffect);
    let utilities = {
      Alpine: alpine_default,
      effect: effect3,
      cleanup,
      evaluateLater: evaluateLater.bind(evaluateLater, el),
      evaluate: evaluate.bind(evaluate, el)
    };
    let doCleanup = () => cleanups.forEach((i) => i());
    onAttributeRemoved(el, directive2.original, doCleanup);
    let fullHandler = () => {
      if (el._x_ignore || el._x_ignoreSelf)
        return;
      handler3.inline && handler3.inline(el, directive2, utilities);
      handler3 = handler3.bind(handler3, el, directive2, utilities);
      isDeferringHandlers ? directiveHandlerStack.push(handler3) : handler3();
    };
    fullHandler.runCleanups = doCleanup;
    return fullHandler;
  }
  var startingWith = (subject, replacement) => ({ name, value }) => {
    if (name.startsWith(subject))
      name = name.replace(subject, replacement);
    return { name, value };
  };
  var into = (i) => i;
  function toTransformedAttributes(callback) {
    return ({ name, value }) => {
      let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
        return transform(carry);
      }, { name, value });
      if (newName !== name)
        callback(newName, name);
      return { name: newName, value: newValue };
    };
  }
  var attributeTransformers = [];
  function mapAttributes(callback) {
    attributeTransformers.push(callback);
  }
  function outNonAlpineAttributes({ name }) {
    return alpineAttributeRegex().test(name);
  }
  var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
  function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
    return ({ name, value }) => {
      let typeMatch = name.match(alpineAttributeRegex());
      let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/);
      let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
      let original = originalAttributeOverride || transformedAttributeMap[name] || name;
      return {
        type: typeMatch ? typeMatch[1] : null,
        value: valueMatch ? valueMatch[1] : null,
        modifiers: modifiers.map((i) => i.replace(".", "")),
        expression: value,
        original
      };
    };
  }
  var DEFAULT = "DEFAULT";
  var directiveOrder = [
    "ignore",
    "ref",
    "data",
    "bind",
    "init",
    "for",
    "model",
    "transition",
    "show",
    "if",
    DEFAULT,
    "element"
  ];
  function byPriority(a, b) {
    let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
    let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
    return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
  }
  function dispatch(el, name, detail = {}) {
    el.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }
  var tickStack = [];
  var isHolding = false;
  function nextTick(callback) {
    tickStack.push(callback);
    queueMicrotask(() => {
      isHolding || setTimeout(() => {
        releaseNextTicks();
      });
    });
  }
  function releaseNextTicks() {
    isHolding = false;
    while (tickStack.length)
      tickStack.shift()();
  }
  function holdNextTicks() {
    isHolding = true;
  }
  function walk(el, callback) {
    if (el instanceof ShadowRoot) {
      Array.from(el.children).forEach((el2) => walk(el2, callback));
      return;
    }
    let skip = false;
    callback(el, () => skip = true);
    if (skip)
      return;
    let node = el.firstElementChild;
    while (node) {
      walk(node, callback, false);
      node = node.nextElementSibling;
    }
  }
  function warn(message, ...args) {
    console.warn(`Alpine Warning: ${message}`, ...args);
  }
  function start() {
    if (!document.body)
      warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
    dispatch(document, "alpine:init");
    dispatch(document, "alpine:initializing");
    startObservingMutations();
    onElAdded((el) => initTree(el, walk));
    onElRemoved((el) => nextTick(() => destroyTree(el)));
    onAttributesAdded((el, attrs) => {
      directives(el, attrs).forEach((handle) => handle());
    });
    let outNestedComponents = (el) => !closestRoot(el.parentNode || closestRoot(el));
    Array.from(document.querySelectorAll(rootSelectors())).filter(outNestedComponents).forEach((el) => {
      initTree(el);
    });
    dispatch(document, "alpine:initialized");
  }
  var rootSelectorCallbacks = [];
  function rootSelectors() {
    return rootSelectorCallbacks.map((fn) => fn());
  }
  function addRootSelector(selectorCallback) {
    rootSelectorCallbacks.push(selectorCallback);
  }
  function closestRoot(el) {
    if (rootSelectors().some((selector) => el.matches(selector)))
      return el;
    if (!el.parentElement)
      return;
    return closestRoot(el.parentElement);
  }
  function isRoot(el) {
    return rootSelectors().some((selector) => el.matches(selector));
  }
  function initTree(el, walker = walk) {
    deferHandlingDirectives(() => {
      walker(el, (el2, skip) => {
        directives(el2, el2.attributes).forEach((handle) => handle());
        el2._x_ignore && skip();
      });
    });
  }
  function destroyTree(root) {
    walk(root, (el) => cleanupAttributes(el));
  }
  function plugin(callback) {
    callback(alpine_default);
  }
  var stores = {};
  var isReactive = false;
  function store(name, value) {
    if (!isReactive) {
      stores = reactive(stores);
      isReactive = true;
    }
    if (value === void 0) {
      return stores[name];
    }
    stores[name] = value;
    if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
      stores[name].init();
    }
  }
  function getStores() {
    return stores;
  }
  var isCloning = false;
  function skipDuringClone(callback) {
    return (...args) => isCloning || callback(...args);
  }
  function clone(oldEl, newEl) {
    newEl._x_dataStack = oldEl._x_dataStack;
    isCloning = true;
    dontRegisterReactiveSideEffects(() => {
      cloneTree(newEl);
    });
    isCloning = false;
  }
  function cloneTree(el) {
    let hasRunThroughFirstEl = false;
    let shallowWalker = (el2, callback) => {
      walk(el2, (el3, skip) => {
        if (hasRunThroughFirstEl && isRoot(el3))
          return skip();
        hasRunThroughFirstEl = true;
        callback(el3, skip);
      });
    };
    initTree(el, shallowWalker);
  }
  function dontRegisterReactiveSideEffects(callback) {
    let cache = effect;
    overrideEffect((callback2, el) => {
      let storedEffect = cache(callback2);
      release(storedEffect);
      return () => {
      };
    });
    callback();
    overrideEffect(cache);
  }
  var datas = {};
  function data(name, callback) {
    datas[name] = callback;
  }
  function getNamedDataProvider(name) {
    return datas[name];
  }
  var Alpine = {
    get reactive() {
      return reactive;
    },
    get release() {
      return release;
    },
    get effect() {
      return effect;
    },
    get raw() {
      return raw;
    },
    version: "3.1.0",
    disableEffectScheduling,
    setReactivityEngine,
    addRootSelector,
    mapAttributes,
    evaluateLater,
    setEvaluator,
    closestRoot,
    interceptor,
    mutateDom,
    directive,
    evaluate,
    nextTick,
    prefix: setPrefix,
    plugin,
    magic,
    store,
    start,
    clone,
    data
  };
  var alpine_default = Alpine;
  var import_reactivity9 = __toModule2(require_reactivity());
  magic("nextTick", () => nextTick);
  magic("dispatch", (el) => dispatch.bind(dispatch, el));
  magic("watch", (el) => (key, callback) => {
    let evaluate2 = evaluateLater(el, key);
    let firstTime = true;
    let oldValue;
    effect(() => evaluate2((value) => {
      let div = document.createElement("div");
      div.dataset.throwAway = value;
      if (!firstTime)
        callback(value, oldValue);
      oldValue = value;
      firstTime = false;
    }));
  });
  magic("store", getStores);
  magic("refs", (el) => closestRoot(el)._x_refs || {});
  magic("el", (el) => el);
  function setClasses(el, value) {
    if (Array.isArray(value)) {
      return setClassesFromString(el, value.join(" "));
    } else if (typeof value === "object" && value !== null) {
      return setClassesFromObject(el, value);
    }
    return setClassesFromString(el, value);
  }
  function setClassesFromString(el, classString) {
    let split = (classString2) => classString2.split(" ").filter(Boolean);
    let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
    let addClassesAndReturnUndo = (classes) => {
      el.classList.add(...classes);
      return () => {
        el.classList.remove(...classes);
      };
    };
    classString = classString === true ? classString = "" : classString || "";
    return addClassesAndReturnUndo(missingClasses(classString));
  }
  function setClassesFromObject(el, classObject) {
    let split = (classString) => classString.split(" ").filter(Boolean);
    let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
    let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
    let added = [];
    let removed = [];
    forRemove.forEach((i) => {
      if (el.classList.contains(i)) {
        el.classList.remove(i);
        removed.push(i);
      }
    });
    forAdd.forEach((i) => {
      if (!el.classList.contains(i)) {
        el.classList.add(i);
        added.push(i);
      }
    });
    return () => {
      removed.forEach((i) => el.classList.add(i));
      added.forEach((i) => el.classList.remove(i));
    };
  }
  function setStyles(el, value) {
    if (typeof value === "object" && value !== null) {
      return setStylesFromObject(el, value);
    }
    return setStylesFromString(el, value);
  }
  function setStylesFromObject(el, value) {
    let previousStyles = {};
    Object.entries(value).forEach(([key, value2]) => {
      previousStyles[key] = el.style[key];
      el.style[key] = value2;
    });
    setTimeout(() => {
      if (el.style.length === 0) {
        el.removeAttribute("style");
      }
    });
    return () => {
      setStyles(el, previousStyles);
    };
  }
  function setStylesFromString(el, value) {
    let cache = el.getAttribute("style", value);
    el.setAttribute("style", value);
    return () => {
      el.setAttribute("style", cache);
    };
  }
  function once(callback, fallback = () => {
  }) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      } else {
        fallback.apply(this, arguments);
      }
    };
  }
  directive("transition", (el, { value, modifiers, expression }) => {
    if (!expression) {
      registerTransitionsFromHelper(el, modifiers, value);
    } else {
      registerTransitionsFromClassString(el, expression, value);
    }
  });
  function registerTransitionsFromClassString(el, classString, stage) {
    registerTransitionObject(el, setClasses, "");
    let directiveStorageMap = {
      enter: (classes) => {
        el._x_transition.enter.during = classes;
      },
      "enter-start": (classes) => {
        el._x_transition.enter.start = classes;
      },
      "enter-end": (classes) => {
        el._x_transition.enter.end = classes;
      },
      leave: (classes) => {
        el._x_transition.leave.during = classes;
      },
      "leave-start": (classes) => {
        el._x_transition.leave.start = classes;
      },
      "leave-end": (classes) => {
        el._x_transition.leave.end = classes;
      }
    };
    directiveStorageMap[stage](classString);
  }
  function registerTransitionsFromHelper(el, modifiers, stage) {
    registerTransitionObject(el, setStyles);
    let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
    let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
    let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
    if (modifiers.includes("in") && !doesntSpecify) {
      modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
    }
    if (modifiers.includes("out") && !doesntSpecify) {
      modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
    }
    let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
    let wantsOpacity = wantsAll || modifiers.includes("opacity");
    let wantsScale = wantsAll || modifiers.includes("scale");
    let opacityValue = wantsOpacity ? 0 : 1;
    let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
    let delay = modifierValue(modifiers, "delay", 0);
    let origin = modifierValue(modifiers, "origin", "center");
    let property = "opacity, transform";
    let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
    let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
    let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
    if (transitioningIn) {
      el._x_transition.enter.during = {
        transformOrigin: origin,
        transitionDelay: delay,
        transitionProperty: property,
        transitionDuration: `${durationIn}s`,
        transitionTimingFunction: easing
      };
      el._x_transition.enter.start = {
        opacity: opacityValue,
        transform: `scale(${scaleValue})`
      };
      el._x_transition.enter.end = {
        opacity: 1,
        transform: `scale(1)`
      };
    }
    if (transitioningOut) {
      el._x_transition.leave.during = {
        transformOrigin: origin,
        transitionDelay: delay,
        transitionProperty: property,
        transitionDuration: `${durationOut}s`,
        transitionTimingFunction: easing
      };
      el._x_transition.leave.start = {
        opacity: 1,
        transform: `scale(1)`
      };
      el._x_transition.leave.end = {
        opacity: opacityValue,
        transform: `scale(${scaleValue})`
      };
    }
  }
  function registerTransitionObject(el, setFunction, defaultValue = {}) {
    if (!el._x_transition)
      el._x_transition = {
        enter: { during: defaultValue, start: defaultValue, end: defaultValue },
        leave: { during: defaultValue, start: defaultValue, end: defaultValue },
        in(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.enter.during,
            start: this.enter.start,
            end: this.enter.end,
            entering: true
          }, before, after);
        },
        out(before = () => {
        }, after = () => {
        }) {
          transition(el, setFunction, {
            during: this.leave.during,
            start: this.leave.start,
            end: this.leave.end,
            entering: false
          }, before, after);
        }
      };
  }
  window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
    let clickAwayCompatibleShow = () => requestAnimationFrame(show);
    if (value) {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
      return;
    }
    el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
      el._x_transition.out(() => {
      }, () => resolve(hide));
      el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
    }) : Promise.resolve(hide);
    queueMicrotask(() => {
      let closest = closestHide(el);
      if (closest) {
        if (!closest._x_hideChildren)
          closest._x_hideChildren = [];
        closest._x_hideChildren.push(el);
      } else {
        queueMicrotask(() => {
          let hideAfterChildren = (el2) => {
            let carry = Promise.all([
              el2._x_hidePromise,
              ...(el2._x_hideChildren || []).map(hideAfterChildren)
            ]).then(([i]) => i());
            delete el2._x_hidePromise;
            delete el2._x_hideChildren;
            return carry;
          };
          hideAfterChildren(el).catch((e) => {
            if (!e.isFromCancelledTransition)
              throw e;
          });
        });
      }
    });
  };
  function closestHide(el) {
    let parent = el.parentNode;
    if (!parent)
      return;
    return parent._x_hidePromise ? parent : closestHide(parent);
  }
  function transition(el, setFunction, { during, start: start2, end, entering } = {}, before = () => {
  }, after = () => {
  }) {
    if (el._x_transitioning)
      el._x_transitioning.cancel();
    if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
      before();
      after();
      return;
    }
    let undoStart, undoDuring, undoEnd;
    performTransition(el, {
      start() {
        undoStart = setFunction(el, start2);
      },
      during() {
        undoDuring = setFunction(el, during);
      },
      before,
      end() {
        undoStart();
        undoEnd = setFunction(el, end);
      },
      after,
      cleanup() {
        undoDuring();
        undoEnd();
      }
    }, entering);
  }
  function performTransition(el, stages, entering) {
    let interrupted, reachedBefore, reachedEnd;
    let finish = once(() => {
      mutateDom(() => {
        interrupted = true;
        if (!reachedBefore)
          stages.before();
        if (!reachedEnd) {
          stages.end();
          releaseNextTicks();
        }
        stages.after();
        if (el.isConnected)
          stages.cleanup();
        delete el._x_transitioning;
      });
    });
    el._x_transitioning = {
      beforeCancels: [],
      beforeCancel(callback) {
        this.beforeCancels.push(callback);
      },
      cancel: once(function() {
        while (this.beforeCancels.length) {
          this.beforeCancels.shift()();
        }
        ;
        finish();
      }),
      finish,
      entering
    };
    mutateDom(() => {
      stages.start();
      stages.during();
    });
    holdNextTicks();
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
      let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
      if (duration === 0)
        duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
      mutateDom(() => {
        stages.before();
      });
      reachedBefore = true;
      requestAnimationFrame(() => {
        if (interrupted)
          return;
        mutateDom(() => {
          stages.end();
        });
        releaseNextTicks();
        setTimeout(el._x_transitioning.finish, duration + delay);
        reachedEnd = true;
      });
    });
  }
  function modifierValue(modifiers, key, fallback) {
    if (modifiers.indexOf(key) === -1)
      return fallback;
    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue)
      return fallback;
    if (key === "scale") {
      if (isNaN(rawValue))
        return fallback;
    }
    if (key === "duration") {
      let match = rawValue.match(/([0-9]+)ms/);
      if (match)
        return match[1];
    }
    if (key === "origin") {
      if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
      }
    }
    return rawValue;
  }
  var handler = () => {
  };
  handler.inline = (el, { modifiers }, { cleanup }) => {
    modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
    cleanup(() => {
      modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
    });
  };
  directive("ignore", handler);
  directive("effect", (el, { expression }, { effect: effect3 }) => effect3(evaluateLater(el, expression)));
  function bind(el, name, value, modifiers = []) {
    if (!el._x_bindings)
      el._x_bindings = reactive({});
    el._x_bindings[name] = value;
    name = modifiers.includes("camel") ? camelCase(name) : name;
    switch (name) {
      case "value":
        bindInputValue(el, value);
        break;
      case "style":
        bindStyles(el, value);
        break;
      case "class":
        bindClasses(el, value);
        break;
      default:
        bindAttribute(el, name, value);
        break;
    }
  }
  function bindInputValue(el, value) {
    if (el.type === "radio") {
      if (el.attributes.value === void 0) {
        el.value = value;
      }
      if (window.fromModel) {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    } else if (el.type === "checkbox") {
      if (Number.isInteger(value)) {
        el.value = value;
      } else if (!Number.isInteger(value) && !Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
        el.value = String(value);
      } else {
        if (Array.isArray(value)) {
          el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
        } else {
          el.checked = !!value;
        }
      }
    } else if (el.tagName === "SELECT") {
      updateSelect(el, value);
    } else {
      if (el.value === value)
        return;
      el.value = value;
    }
  }
  function bindClasses(el, value) {
    if (el._x_undoAddedClasses)
      el._x_undoAddedClasses();
    el._x_undoAddedClasses = setClasses(el, value);
  }
  function bindStyles(el, value) {
    if (el._x_undoAddedStyles)
      el._x_undoAddedStyles();
    el._x_undoAddedStyles = setStyles(el, value);
  }
  function bindAttribute(el, name, value) {
    if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
      el.removeAttribute(name);
    } else {
      if (isBooleanAttr(name))
        value = name;
      setIfChanged(el, name, value);
    }
  }
  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }
  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map((value2) => {
      return value2 + "";
    });
    Array.from(el.options).forEach((option) => {
      option.selected = arrayWrappedValue.includes(option.value);
    });
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function isBooleanAttr(attrName) {
    const booleanAttributes = [
      "disabled",
      "checked",
      "required",
      "readonly",
      "hidden",
      "open",
      "selected",
      "autofocus",
      "itemscope",
      "multiple",
      "novalidate",
      "allowfullscreen",
      "allowpaymentrequest",
      "formnovalidate",
      "autoplay",
      "controls",
      "loop",
      "muted",
      "playsinline",
      "default",
      "ismap",
      "reversed",
      "async",
      "defer",
      "nomodule"
    ];
    return booleanAttributes.includes(attrName);
  }
  function attributeShouldntBePreservedIfFalsy(name) {
    return !["aria-pressed", "aria-checked"].includes(name);
  }
  function on(el, event, modifiers, callback) {
    let listenerTarget = el;
    let handler3 = (e) => callback(e);
    let options = {};
    let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
    if (modifiers.includes("camel"))
      event = camelCase2(event);
    if (modifiers.includes("passive"))
      options.passive = true;
    if (modifiers.includes("window"))
      listenerTarget = window;
    if (modifiers.includes("document"))
      listenerTarget = document;
    if (modifiers.includes("prevent"))
      handler3 = wrapHandler(handler3, (next, e) => {
        e.preventDefault();
        next(e);
      });
    if (modifiers.includes("stop"))
      handler3 = wrapHandler(handler3, (next, e) => {
        e.stopPropagation();
        next(e);
      });
    if (modifiers.includes("self"))
      handler3 = wrapHandler(handler3, (next, e) => {
        e.target === el && next(e);
      });
    if (modifiers.includes("away") || modifiers.includes("outside")) {
      listenerTarget = document;
      handler3 = wrapHandler(handler3, (next, e) => {
        if (el.contains(e.target))
          return;
        if (el.offsetWidth < 1 && el.offsetHeight < 1)
          return;
        next(e);
      });
    }
    handler3 = wrapHandler(handler3, (next, e) => {
      if (isKeyEvent(event)) {
        if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
          return;
        }
      }
      next(e);
    });
    if (modifiers.includes("debounce")) {
      let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler3 = debounce(handler3, wait, this);
    }
    if (modifiers.includes("throttle")) {
      let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
      let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
      handler3 = throttle(handler3, wait, this);
    }
    if (modifiers.includes("once")) {
      handler3 = wrapHandler(handler3, (next, e) => {
        next(e);
        listenerTarget.removeEventListener(event, handler3, options);
      });
    }
    listenerTarget.addEventListener(event, handler3, options);
    return () => {
      listenerTarget.removeEventListener(event, handler3, options);
    };
  }
  function camelCase2(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      let context = this, args = arguments;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
  }
  function isKeyEvent(event) {
    return ["keydown", "keyup"].includes(event);
  }
  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter((i) => {
      return !["window", "document", "prevent", "stop", "once"].includes(i);
    });
    if (keyModifiers.includes("debounce")) {
      let debounceIndex = keyModifiers.indexOf("debounce");
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
    }
    if (keyModifiers.length === 0)
      return false;
    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key))
      return false;
    const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
        if (modifier === "cmd" || modifier === "super")
          modifier = "meta";
        return e[`${modifier}Key`];
      });
      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        if (keyModifiers[0] === keyToModifier(e.key))
          return false;
      }
    }
    return true;
  }
  function keyToModifier(key) {
    switch (key) {
      case "/":
        return "slash";
      case " ":
      case "Spacebar":
        return "space";
      default:
        return key && kebabCase(key);
    }
  }
  directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup }) => {
    let evaluate2 = evaluateLater(el, expression);
    let assignmentExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    let evaluateAssignment = evaluateLater(el, assignmentExpression);
    var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
    let assigmentFunction = generateAssignmentFunction(el, modifiers, expression);
    let removeListener = on(el, event, modifiers, (e) => {
      evaluateAssignment(() => {
      }, { scope: {
        $event: e,
        rightSideOfExpression: assigmentFunction
      } });
    });
    cleanup(() => removeListener());
    el._x_forceModelUpdate = () => {
      evaluate2((value) => {
        if (value === void 0 && expression.match(/\./))
          value = "";
        window.fromModel = true;
        mutateDom(() => bind(el, "value", value));
        delete window.fromModel;
      });
    };
    effect3(() => {
      if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
        return;
      el._x_forceModelUpdate();
    });
  });
  function generateAssignmentFunction(el, modifiers, expression) {
    if (el.type === "radio") {
      mutateDom(() => {
        if (!el.hasAttribute("name"))
          el.setAttribute("name", expression);
      });
    }
    return (event, currentValue) => {
      return mutateDom(() => {
        if (event instanceof CustomEvent && event.detail !== void 0) {
          return event.detail;
        } else if (el.type === "checkbox") {
          if (Array.isArray(currentValue)) {
            let newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
            return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
          } else {
            return event.target.checked;
          }
        } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
          return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
            let rawValue = option.value || option.text;
            return safeParseNumber(rawValue);
          }) : Array.from(event.target.selectedOptions).map((option) => {
            return option.value || option.text;
          });
        } else {
          let rawValue = event.target.value;
          return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
        }
      });
    };
  }
  function safeParseNumber(rawValue) {
    let number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric2(number) ? number : rawValue;
  }
  function checkedAttrLooseCompare2(valueA, valueB) {
    return valueA == valueB;
  }
  function isNumeric2(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
  addRootSelector(() => `[${prefix("init")}]`);
  directive("init", skipDuringClone((el, { expression }) => evaluate(el, expression, {}, false)));
  directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.textContent = value;
        });
      });
    });
  });
  directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
    let evaluate2 = evaluateLater2(expression);
    effect3(() => {
      evaluate2((value) => {
        mutateDom(() => {
          el.innerHTML = value;
        });
      });
    });
  });
  mapAttributes(startingWith(":", into(prefix("bind:"))));
  directive("bind", (el, { value, modifiers, expression, original }, { effect: effect3 }) => {
    if (!value)
      return applyBindingsObject(el, expression, original, effect3);
    if (value === "key")
      return storeKeyForXFor(el, expression);
    let evaluate2 = evaluateLater(el, expression);
    effect3(() => evaluate2((result) => {
      if (result === void 0 && expression.match(/\./))
        result = "";
      mutateDom(() => bind(el, value, result, modifiers));
    }));
  });
  function applyBindingsObject(el, expression, original, effect3) {
    let getBindings = evaluateLater(el, expression);
    let cleanupRunners = [];
    effect3(() => {
      while (cleanupRunners.length)
        cleanupRunners.pop()();
      getBindings((bindings) => {
        let attributes = Object.entries(bindings).map(([name, value]) => ({ name, value }));
        directives(el, attributes, original).map((handle) => {
          cleanupRunners.push(handle.runCleanups);
          handle();
        });
      });
    });
  }
  function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression;
  }
  addRootSelector(() => `[${prefix("data")}]`);
  directive("data", skipDuringClone((el, { expression }, { cleanup }) => {
    expression = expression === "" ? "{}" : expression;
    let dataProvider = getNamedDataProvider(expression);
    let data2 = {};
    if (dataProvider) {
      let magics2 = injectMagics({}, el);
      data2 = dataProvider.bind(magics2)();
    } else {
      data2 = evaluate(el, expression);
    }
    injectMagics(data2, el);
    let reactiveData = reactive(data2);
    initInterceptors(reactiveData);
    let undo = addScopeToNode(el, reactiveData);
    if (reactiveData["init"])
      reactiveData["init"]();
    cleanup(() => {
      undo();
      reactiveData["destroy"] && reactiveData["destroy"]();
    });
  }));
  directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
    let evaluate2 = evaluateLater(el, expression);
    let hide = () => mutateDom(() => {
      el.style.display = "none";
      el._x_isShown = false;
    });
    let show = () => mutateDom(() => {
      if (el.style.length === 1 && el.style.display === "none") {
        el.removeAttribute("style");
      } else {
        el.style.removeProperty("display");
      }
      el._x_isShown = true;
    });
    let clickAwayCompatibleShow = () => setTimeout(show);
    let toggle = once((value) => value ? show() : hide(), (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    });
    let oldValue;
    let firstTime = true;
    effect3(() => evaluate2((value) => {
      if (!firstTime && value === oldValue)
        return;
      if (modifiers.includes("immediate"))
        value ? clickAwayCompatibleShow() : hide();
      toggle(value);
      oldValue = value;
      firstTime = false;
    }));
  });
  directive("for", (el, { expression }, { effect: effect3, cleanup }) => {
    let iteratorNames = parseForExpression(expression);
    let evaluateItems = evaluateLater(el, iteratorNames.items);
    let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
    el._x_prevKeys = [];
    el._x_lookup = {};
    effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
    cleanup(() => {
      Object.values(el._x_lookup).forEach((el2) => el2.remove());
      delete el._x_prevKeys;
      delete el._x_lookup;
    });
  });
  function loop(el, iteratorNames, evaluateItems, evaluateKey) {
    let isObject = (i) => typeof i === "object" && !Array.isArray(i);
    let templateEl = el;
    evaluateItems((items) => {
      if (isNumeric3(items) && items >= 0) {
        items = Array.from(Array(items).keys(), (i) => i + 1);
      }
      let lookup = el._x_lookup;
      let prevKeys = el._x_prevKeys;
      let scopes = [];
      let keys = [];
      if (isObject(items)) {
        items = Object.entries(items).map(([key, value]) => {
          let scope = getIterationScopeVariables(iteratorNames, value, key, items);
          evaluateKey((value2) => keys.push(value2), { scope: { index: key, ...scope } });
          scopes.push(scope);
        });
      } else {
        for (let i = 0; i < items.length; i++) {
          let scope = getIterationScopeVariables(iteratorNames, items[i], i, items);
          evaluateKey((value) => keys.push(value), { scope: { index: i, ...scope } });
          scopes.push(scope);
        }
      }
      let adds = [];
      let moves = [];
      let removes = [];
      let sames = [];
      for (let i = 0; i < prevKeys.length; i++) {
        let key = prevKeys[i];
        if (keys.indexOf(key) === -1)
          removes.push(key);
      }
      prevKeys = prevKeys.filter((key) => !removes.includes(key));
      let lastKey = "template";
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let prevIndex = prevKeys.indexOf(key);
        if (prevIndex === -1) {
          prevKeys.splice(i, 0, key);
          adds.push([lastKey, i]);
        } else if (prevIndex !== i) {
          let keyInSpot = prevKeys.splice(i, 1)[0];
          let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
          prevKeys.splice(i, 0, keyForSpot);
          prevKeys.splice(prevIndex, 0, keyInSpot);
          moves.push([keyInSpot, keyForSpot]);
        } else {
          sames.push(key);
        }
        lastKey = key;
      }
      for (let i = 0; i < removes.length; i++) {
        let key = removes[i];
        lookup[key].remove();
        lookup[key] = null;
        delete lookup[key];
      }
      for (let i = 0; i < moves.length; i++) {
        let [keyInSpot, keyForSpot] = moves[i];
        let elInSpot = lookup[keyInSpot];
        let elForSpot = lookup[keyForSpot];
        let marker = document.createElement("div");
        mutateDom(() => {
          elForSpot.after(marker);
          elInSpot.after(elForSpot);
          marker.before(elInSpot);
          marker.remove();
        });
        refreshScope(elForSpot, scopes[keys.indexOf(keyForSpot)]);
      }
      for (let i = 0; i < adds.length; i++) {
        let [lastKey2, index] = adds[i];
        let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
        let scope = scopes[index];
        let key = keys[index];
        let clone2 = document.importNode(templateEl.content, true).firstElementChild;
        addScopeToNode(clone2, reactive(scope), templateEl);
        initTree(clone2);
        mutateDom(() => {
          lastEl.after(clone2);
        });
        lookup[key] = clone2;
      }
      for (let i = 0; i < sames.length; i++) {
        refreshScope(lookup[sames[i]], scopes[keys.indexOf(sames[i])]);
      }
      templateEl._x_prevKeys = keys;
    });
  }
  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\s*\(|\)\s*$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch)
      return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].replace(stripParensRE, "").trim();
    let iteratorMatch = item.match(forIteratorRE);
    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, "").trim();
      res.index = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }
    return res;
  }
  function getIterationScopeVariables(iteratorNames, item, index, items) {
    let scopeVariables = {};
    if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
      let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
      names.forEach((name, i) => {
        scopeVariables[name] = item[i];
      });
    } else {
      scopeVariables[iteratorNames.item] = item;
    }
    if (iteratorNames.index)
      scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection)
      scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }
  function isNumeric3(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  }
  function handler2() {
  }
  handler2.inline = (el, { expression }, { cleanup }) => {
    let root = closestRoot(el);
    if (!root._x_refs)
      root._x_refs = {};
    root._x_refs[expression] = el;
    cleanup(() => delete root._x_refs[expression]);
  };
  directive("ref", handler2);
  directive("if", (el, { expression }, { effect: effect3, cleanup }) => {
    let evaluate2 = evaluateLater(el, expression);
    let show = () => {
      if (el._x_currentIfEl)
        return el._x_currentIfEl;
      let clone2 = el.content.cloneNode(true).firstElementChild;
      addScopeToNode(clone2, {}, el);
      initTree(clone2);
      mutateDom(() => el.after(clone2));
      el._x_currentIfEl = clone2;
      el._x_undoIf = () => {
        clone2.remove();
        delete el._x_currentIfEl;
      };
      return clone2;
    };
    let hide = () => el._x_undoIf?.() || delete el._x_undoIf;
    effect3(() => evaluate2((value) => {
      value ? show() : hide();
    }));
    cleanup(() => el._x_undoIf && el._x_undoIf());
  });
  mapAttributes(startingWith("@", into(prefix("on:"))));
  directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup }) => {
    let evaluate2 = expression ? evaluateLater(el, expression) : () => {
    };
    let removeListener = on(el, value, modifiers, (e) => {
      evaluate2(() => {
      }, { scope: { $event: e }, params: [e] });
    });
    cleanup(() => removeListener());
  }));
  alpine_default.setEvaluator(normalEvaluator);
  alpine_default.setReactivityEngine({ reactive: import_reactivity9.reactive, effect: import_reactivity9.effect, release: import_reactivity9.stop, raw: import_reactivity9.toRaw });
  var src_default = alpine_default;
  var module_default = src_default;

  // <stdin>
  window.Alpine = module_default;
  window.resizeBlock = resizeBlock_default;
  window.noticesHandler = noticesHandler_default;
  module_default.start();
})();
