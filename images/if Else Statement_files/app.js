// =======================================
// EDV Embedded App SDK v1.0.0
// =======================================
const transformScriptTags = () => {
  (function () {
    // ---------------------------------------------------------------------------------
    // EDV Embedded App SDK - Global Resources
    //
    // This is place for all EDV js api global resources like: functions, variables, configs,...
    // ---------------------------------------------------------------------------------
    window._EDV || (window._EDV = {});

    // const DOMAIN = "http://localhost:5010";
    const DOMAIN = "https://chat.codelearn.io";

    const printLog = function (...message) {
      console.log(...message);
    };

    _EDV.Message = (function () {
      function Message() {}

      Message.name = "Message";

      Message.init = function () {
        this.bindEvents();
        this.bindRootDOM();
        // this.bindChatWindowsDOM();
      };

      Message.bindEvents = function () {
        window.addEventListener("message", this.__addEventMessageCallback.bind(this), false);
      };

      Message.bindRootDOM = function () {
        const newContent = document.createElement("div");
        const content = `<iframe src="${DOMAIN}" id="app-iframe-root" style="visibility: hidden; display: none"></iframe>`;
        const containerRef = document.getElementById("chat-root");
        if (containerRef) {
          newContent.innerHTML = content;
          containerRef.appendChild(newContent);
        } else {
          console.error("EDV Embedded App SDK: not load container #chat-root");
        }
      };

      Message.bindChatWindowsDOM = function () {
        const newContent = document.createElement("div");
        const content = `<iframe src="${DOMAIN}/messages" id="app-iframe-chat-window" style="visibility: hidden; display: none"></iframe>`;
        const containerRef = document.getElementById("chat-root");
        if (containerRef) {
          newContent.innerHTML = content;
          containerRef.appendChild(newContent);
        } else {
          console.error("EDV Embedded App SDK: not load container #chat-root");
        }
      };

      Message.__addEventMessageCallback = function (response) {
        let responseData;
        try {
          responseData = JSON.parse(response.data);
          printLog("Received: ", responseData);
          this.exec(responseData.message, responseData.data);
        } catch (ex) {
          return void printLog("Received invalid JSON and cannot process the message. " + ex + " : ", response.data);
        }
      };

      Message.exec = function (message, data) {
        let root = document.getElementById("app-iframe-root");
        let chatWindow = document.getElementById("app-iframe-chat-window");
        switch (message) {
          case "EDV.API.initial":
            const styleElement = document.createElement("style");
            const cssStyles = `
              #app-iframe-root {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100vh;
                border: none;
                background-color: transparent;
                visibility: visible !important;
                display: none;
                z-index: -1;
                overflow: hidden;
                //left: auto;
                //max-width: 388px;
                //box-shadow: 0 12px 28px 0 rgba(0,0,0,.2), 0 2px 4px 0 rgba(0,0,0,.1);
              }
              #app-iframe-chat-window {
                position: fixed;
                top: auto;
                bottom: 0;
                left: 0;
                max-height: 448px;
                right: 400px;
              }
            `;
            styleElement.textContent = cssStyles;
            document.head.appendChild(styleElement);
            let intervalId = null;
            let varCounter = 0;
            intervalId = setInterval(function () {
              let accessKey = localStorage.getItem("AccessKey");
              if (varCounter <= 120) {
                varCounter++;
                if (accessKey && window._EDV && window._EDV.Message) {
                  clearInterval(intervalId);
                  window._EDV.Message.postMessage("EDV.API.Auth.initial", {
                    currentUserId: CurrentUserId,
                    accessKey: accessKey,
                  });
                  window._EDV.Message.postMessage("EDV.API.LangGuest.initial", LANG_CURRENT);
                  $(".chat").removeClass("hide");
                }
              } else {
                clearInterval(intervalId);
              }
            }, 1000);
            break;
          case "EDV.API.Chat.open":
            root.style.zIndex = 2147483999;
            root.style.display = "block";
            break;
          case "EDV.API.Chat.close":
            root.style.zIndex = -1;
            root.style.display = "none";
            break;
          case "EDV.API.Chat.chatWindows":
            chatWindow.style.zIndex = 2147483999;
            chatWindow.style.display = "block";
            this.postMessage("EDV.API.Chat.chatWindows.response", data);
            break;
          case "EDV.API.Chat.count":
            const count = data;
            const chatCountRef = document.getElementById("chat-count");
            const cls = ["label", "label-warning"];
            if (!chatCountRef) {
              console.error("EDV Embedded App SDK: not load element #chat-count");
              return;
            }
            if (count > 0) {
              chatCountRef.classList.add(...cls);
              chatCountRef.style.display = "block";
              chatCountRef.innerHTML = `<span>${count > 99 ? "99+" : count}</span>`;
            } else {
              chatCountRef.classList.remove(...cls);
              chatCountRef.style.display = "none";
            }
            break;
          default:
            break;
        }
      };

      Message.postMessage = function (message, data) {
        let postData = JSON.stringify({
          message: message,
          data: data,
        });
        printLog("Sent: ", postData);
        let root = document.getElementById("app-iframe-root");
        if (root && root.contentWindow) {
          root.contentWindow.postMessage(postData, "*");
        }
        let chatWindow = document.getElementById("app-iframe-chat-window");
        if (chatWindow && chatWindow.contentWindow) {
          chatWindow.contentWindow.postMessage(postData, "*");
        }
        return void 0;
      };

      return Message;
    })();

    window._EDV.Message.init();
  }.call(this));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", transformScriptTags, false);
} else {
  transformScriptTags();
}
