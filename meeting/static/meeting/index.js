const app = new Vue({
  el: "#app",
  delimiters: ["${", "}"],
  data: {
    callPlaced: false,
    client: null,
    localStream: null,
    mutedAudio: false,
    mutedVideo: false,
    userOnlineChannel: null,
    onlineUsers: [],
    incomingCall: false,
    incomingCaller: "",
    agoraChannel: null,
    recordingStarted: false,
    resourceId: null,
    sid: null,
    mediaRecorder: null,
    chunks: [],
  },
  mounted() {
    this.initUserOnlineChannel();
  },

  methods: {
    initUserOnlineChannel() {
      const userOnlineChannel = pusher.subscribe("presence-online-channel");

      // Start Pusher Presence Channel Event Listeners

      userOnlineChannel.bind("pusher:subscription_succeeded", (data) => {
        // From Laravel Echo, wrapper for Pusher Js Client
        let members = Object.keys(data.members).map((k) => data.members[k]);
        this.onlineUsers = members;
      });

      userOnlineChannel.bind("pusher:member_added", (data) => {
        let user = data.info;
        // check user availability
        const joiningUserIndex = this.onlineUsers.findIndex(
          (data) => data.id === user.id
        );
        if (joiningUserIndex < 0) {
          this.onlineUsers.push(user);
        }
      });

      userOnlineChannel.bind("pusher:member_removed", (data) => {
        let user = data.info;
        const leavingUserIndex = this.onlineUsers.findIndex(
          (data) => data.id === user.id
        );
        this.onlineUsers.splice(leavingUserIndex, 1);
      });

      userOnlineChannel.bind("pusher:subscription_error", (err) => {
        console.log("Subscription Error", err);
      });

      userOnlineChannel.bind("an_event", (data) => {
        console.log("a_channel: ", data);
      });

      userOnlineChannel.bind("make-agora-call", (data) => {
        // Listen to incoming call. This can be replaced with a private channel

        if (parseInt(data.userToCall) === parseInt(AUTH_USER_ID)) {
          const callerIndex = this.onlineUsers.findIndex(
            (user) => user.id === data.from
          );
          this.incomingCaller = this.onlineUsers[callerIndex]["name"];
          this.incomingCall = true;

          // the channel that was sent over to the user being called is what
          // the receiver will use to join the call when accepting the call.
          this.agoraChannel = data.channelName;
        }
      });
    },

    getUserOnlineStatus(id) {
      const onlineUserIndex = this.onlineUsers.findIndex(
        (data) => data.id === id
      );
      if (onlineUserIndex < 0) {
        return "Offline";
      }
      return "Online";
    },

    async placeCall(id, calleeName) {
      try {
        // channelName = the caller's and the callee's id. you can use anything. tho.
        const channelName = `${AUTH_USER}_${calleeName}`;
        const tokenRes = await this.generateToken(channelName);

        // // Broadcasts a call event to the callee and also gets back the token
        let placeCallRes = await axios.post(
          "/meeting/call-user/",
          {
            user_to_call: id,
            channel_name: channelName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": CSRF_TOKEN,
            },
          }
        );

        this.initializeAgora(tokenRes.data.appID);
        this.joinRoom(tokenRes.data.token, channelName);
      } catch (error) {
        console.log(error);
      }
    },

    async acceptCall() {
      const tokenRes = await this.generateToken(this.agoraChannel);
      this.initializeAgora(tokenRes.data.appID);

      this.joinRoom(tokenRes.data.token, this.agoraChannel);
      this.incomingCall = false;
      this.callPlaced = true;
    },

    declineCall() {
      // You can send a request to the caller to
      // alert them of rejected call
      this.incomingCall = false;
    },

    generateToken(channelName) {
      return axios.post(
        "/meeting/token/",
        {
          channelName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN,
          },
        }
      );
    },

    /**
     * Agora Events and Listeners
     */
    initializeAgora(agora_app_id) {
      this.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
      this.client.init(
        agora_app_id,
        () => {
          console.log("AgoraRTC client initialized");
        },
        (err) => {
          console.log("AgoraRTC client init failed", err);
        }
      );
    },

    async joinRoom(token, channel) {
      this.client.join(
        token,
        channel,
        AUTH_USER,
        (uid) => {
          console.log("User " + uid + " join channel successfully");
          this.callPlaced = true;
          this.createLocalStream();
          this.initializedAgoraListeners();
        },
        (err) => {
          console.log("Join channel failed", err);
        }
      );
    },

    initializedAgoraListeners() {
      //   Register event listeners
      this.client.on("stream-published", function (evt) {
        console.log("Publish local stream successfully");
        console.log(evt);
      });

      //subscribe remote stream
      this.client.on("stream-added", ({ stream }) => {
        console.log("New stream added: " + stream.getId());
        this.client.subscribe(stream, function (err) {
          console.log("Subscribe stream failed", err);
        });
      });

      this.client.on("stream-subscribed", (evt) => {
        // Attach remote stream to the remote-video div

        console.log("incoming remote stream event: ", evt);

        evt.stream.play("remote-video");
        this.client.publish(evt.stream);
      });

      this.client.on("stream-removed", ({ stream }) => {
        console.log(String(stream.getId()));
        stream.close();
      });

      this.client.on("peer-online", (evt) => {
        console.log("peer-online", evt.uid);
      });

      this.client.on("peer-leave", (evt) => {
        var uid = evt.uid;
        var reason = evt.reason;
        console.log("remote user left ", uid, "reason: ", reason);
      });

      this.client.on("stream-unpublished", (evt) => {
        console.log(evt);
      });
    },

    createLocalStream() {
      this.localStream = AgoraRTC.createStream({
        audio: true,
        video: true,
      });

      // Initialize the local stream
      this.localStream.init(
        () => {
          // Play the local stream
          this.localStream.play("local-video");
          // Publish the local stream
          this.client.publish(this.localStream, (err) => {
            console.log("publish local stream", err);
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },

    endCall() {
      this.localStream.close();
      this.client.leave(
        () => {
          console.log("Leave channel successfully");
          this.callPlaced = false;
        },
        (err) => {
          console.log("Leave channel failed");
        }
      );
      window.pusher.unsubscribe();
    },

    handleAudioToggle() {
      if (this.mutedAudio) {
        this.localStream.unmuteAudio();
        this.mutedAudio = false;
      } else {
        this.localStream.muteAudio();
        this.mutedAudio = true;
      }
    },

    handleVideoToggle() {
      if (this.mutedVideo) {
        this.localStream.unmuteVideo();
        this.mutedVideo = false;
      } else {
        this.localStream.muteVideo();
        this.mutedVideo = true;
      }
    },
    async generateResourceId(
      AppId,
      uid,
      cname,
      tokenRes,
      mode,
      meetingid,
      token
    ) {
      const customerKey = "461006031933455789b478ddcba69df6";
      // Customer secret
      const customerSecret = "b600378f495c46148c60dbb16e7bd05e";
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ":" + customerSecret;
      console.log("Basic " + btoa(plainCredential));
      fetch(`https://api.agora.io/v1/apps/${AppId}/cloud_recording/acquire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(plainCredential),
        },
        body: JSON.stringify({
          cname: cname,
          uid: uid,
          clientRequest: {
            region: "AP",
            // "resourceExpiredHour":  24
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("cname is ", cname);
          console.log("uid is", uid);
          this.resourceId = data.resourceId;
          console.log(this.resourceId);
          const starttoken = token;
          console.log("starttoken is ", starttoken);
          fetch(
            `https://api.agora.io/v1/apps/${AppId}/cloud_recording/resourceid/${this.resourceId}/mode/${mode}/start`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: "Basic " + btoa(plainCredential),
              },
              body: JSON.stringify({
                uid: uid,
                cname: cname,
                clientRequest: {
                  token: starttoken,
                  recordingConfig: {
                    maxIdleTime: 21600,
                    streamTypes: 2,
                    channelType: 0,
                    videoStreamType: 0,
                    transcodingConfig: {
                      height: 640,
                      width: 360,
                      bitrate: 500,
                      fps: 15,
                      mixedVideoLayout: 0,
                      backgroundColor: "#212121",
                    },
                  },
                  recordingFileConfig: {
                    avFileType: ["hls", "mp4"],
                  },
                  storageConfig: {
                    accessKey: "AKIAQVPXYDDKO66DFQWP",
                    region: 1,
                    bucket: "findamentorrecordings",
                    secretKey: "rDnON5pI/KxLllrI5mx79lA1XWtGdGiRl2Td6rgx",
                    vendor: 1,
                    fileNamePrefix: [],
                  },
                },
              }),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("recording data", data);
              console.table(data);
              this.resourceId = data.resourceId;
              this.sid = data.sid;
              fetch("/meeting/create_recording/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": CSRF_TOKEN,
                },
                body: JSON.stringify({
                  meetingid: meetingid,
                  resourceId: data.resourceId,
                  mode: mode,
                  uid: uid,
                  sid: data.sid,
                  cname: cname,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log("recording data saved", data);
                  if (data.success == true) {
                    this.recordingStarted = true;
                  }
                });
            });
        });
    },
    async stopRecording(
      AppId,
      uid,
      cname,
      tokenRes,
      mode,
      meetingid,
      calleeName
    ) {
      const customerKey = "461006031933455789b478ddcba69df6";
      // Customer secret
      const customerSecret = "b600378f495c46148c60dbb16e7bd05e";
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ":" + customerSecret;
      this.recordingStarted = false;
      this.mediaRecorder.stop();

      // // {
      // //     "recording_url": "",
      // //     "sid": "",
      // //     "resourceId": "",
      // //     "stopresponse": null,
      // //     "recording": null,
      // //     "mentor": null,
      // //     "meeting": null,
      // //     "content": null
      // // }
    },
    handleRecord(
      { stream, mimeType },
      AUTH_USER_ID,
      channelName,
      tokenRes,
      mode,
      meetingid,
      calleeName
    ) {
      // to collect stream chunks
      let recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
        // shouldStop => forceStop by user
        if (this.recordingStarted === false) {
          this.mediaRecorder.stop();
        }
      };
      this.mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, {
          type: mimeType,
        });
        recordedChunks = [];
        // const filename = window.prompt("Enter file name"); // input filename from user for download
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob); // create download link for the file
        downloadLink.download = `${AUTH_USER}_${calleeName}.webm`; // naming the file with user provided name
        downloadLink.click(); // click on the link to download the file
        const myFile = new File([blob], `${AUTH_USER}_${calleeName}.webm`, {
          type: blob.type,
        });
        const formData = new FormData();
        formData.append("recording", myFile);

        formData.append("resourceId", " ");
        formData.append("sid", "");
        formData.append("mentor", AUTH_USER_ID);
        formData.append("meeting", meetingid);

        fetch("/meeting/recording/", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
        this.recordingStarted = false;
      };

      this.mediaRecorder.start(200); // here 200ms is interval of chunk collection
    },
    async recordScreen(
      AUTH_USER_ID,
      channelName,
      tokenRes,
      mode,
      meetingid,
      calleeName
    ) {
      const mimeType = "video/webm";
      const constraints = {
        video: true,
      };
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      // voiceStream for recording voice with screen recording
      const voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      let tracks = [
        ...displayStream.getTracks(),
        ...voiceStream.getAudioTracks(),
      ];
      const stream = new MediaStream(tracks);
      this.handleRecord(
        { stream, mimeType },
        AUTH_USER_ID,
        channelName,
        tokenRes,
        mode,
        meetingid,
        calleeName
      );
    },
    async startRecording(calleeName, meetingid) {
      const channelName = `${AUTH_USER}_${calleeName}`;
      console.log(channelName);
      const tokenRes = await this.generateToken(channelName);
      const mode = "mix";
      console.log("your token", tokenRes);
      const customerKey = "461006031933455789b478ddcba69df6";
      // Customer secret
      const customerSecret = "b600378f495c46148c60dbb16e7bd05e";
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ":" + customerSecret;
      const resid = this.resourceId;
      if (this.recordingStarted) {
        this.stopRecording(
          tokenRes.data.appID,
          AUTH_USER_ID,
          channelName,
          tokenRes,
          mode,
          meetingid,
          calleeName
        );
      } else {
        this.recordScreen(
          AUTH_USER_ID,
          channelName,
          tokenRes,
          mode,
          meetingid,
          calleeName
        );

        this.recordingStarted = true;
      }
    },
  },
});
