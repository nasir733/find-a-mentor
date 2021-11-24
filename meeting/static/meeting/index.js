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
    async generateResourceId(AppId,uid,cname,tokenRes,mode,meetingid) {
      const customerKey = "461006031933455789b478ddcba69df6"
      // Customer secret
      const customerSecret = "b600378f495c46148c60dbb16e7bd05e"
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ":" + customerSecret
      
      fetch(`https://api.agora.io/v1/apps/${AppId}/cloud_recording/acquire`,{
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(plainCredential),

        },
        body:JSON.stringify({
          cname: cname,
          uid: uid,
          clientRequest:{
            region:"AP",
            // "resourceExpiredHour":  24
        }
      })
 
        }
      )
      .then(response => response.json())
      .then(data => {
        this.resourceId = data.resourceId;
        console.log(this.resourceId);
        fetch(`https://api.agora.io/v1/apps/${tokenRes.data.appID}/cloud_recording/resourceid/${data.resourceId}/mode/${mode}/start`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              'Authorization': 'Basic ' + btoa(plainCredential),
            },
            body: JSON.stringify(
            {
              uid: uid,
              cname: cname,
              clientRequest: {
                token: tokenRes.data.token,
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
                  secretKey:"rDnON5pI/KxLllrI5mx79lA1XWtGdGiRl2Td6rgx",
                  vendor: 1,
                  fileNamePrefix: ["directory1", "directory2"],
                },
              },
        }
        
        ),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("recording data",data);
        fetch('/meeting/create_recording/',{
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
              "X-CSRFToken": CSRF_TOKEN,
          },
          body: JSON.stringify({
            "meetingid": meetingid,
            "resourceId": data.resourceId,
            "mode": mode,
            "uid": uid,
            "sid": data.sid,
            "cname": cname,
          })

        })
        .then((res) => res.json())
        .then((data) => {
          console.log("recording data saved",data);
          if(data.success == true){
            this.recordingStarted = true;
          }
        });
      }
      );
      });
     
    },
    async stopRecording(AppId,uid,cname,tokenRes,mode,meetingid){
      const customerKey = "461006031933455789b478ddcba69df6"
      // Customer secret
      const customerSecret = "b600378f495c46148c60dbb16e7bd05e"
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ":" + customerSecret
      fetch(`https://api.agora.io/v1/apps/${AppId}/cloud_recording/acquire`,{
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(plainCredential),

        },
        body:JSON.stringify({
          cname : cname,
          uid: uid,
          clientRequest:{
            region:"AP",
            // "resourceExpiredHour":  24
        }
      })
 
        }
      )
      .then(response => response.json())
      .then(x => {
        console.log(x);
        fetch('/meeting/stop_recording_request/',{
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
              "X-CSRFToken": CSRF_TOKEN,
          },
          body: JSON.stringify({
            "meetingid": meetingid,
            "mode":mode,
            "uid": uid,
            "cname": cname,
            "resourceId": x.resourceId,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          console.log("recording stop resource data generated",data);
          if(data.success == true){
            
            fetch(`https://api.agora.io/v1/apps/${AppId}/cloud_recording/resourceid/${data.resourceId}/sid/${String(data.sid)}/mode/${mode}/stop`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json;charset=utf-8",
                'Authorization': 'Basic ' + btoa(plainCredential),
                },
                body: JSON.stringify(
                {
                  cname: cname,
                  uid: uid, 
                  clientRequest:{
                      async_stop: false   
                  },
                }
                ),
            })
            .then((res) => res.json())
            .then((data) => {
              console.log("recording stop api data",data);
              fetch('/meeting/recording_completed/',{
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",

                    "X-CSRFToken": CSRF_TOKEN,
                },
                body: JSON.stringify({
                  "meetingid": meetingid,
                  'record_completion':data,
                }),
              }).then((res) => res.json())
              .then((data) => {
                this.recordingStarted = false;
              });
            });
          }
        });

      });
      
    },
    async startRecording(calleeName,meetingid) {
      const channelName = `${AUTH_USER}_${calleeName}`;
      const tokenRes = await this.generateToken(channelName);
      
      
      const mode ="mix";
      console.log("your token",tokenRes)
      
      const customerKey = "461006031933455789b478ddcba69df6"
      // Customer secret
      const customerSecret = "b600378f495c46148c60dbb16e7bd05e"
      // Concatenate customer key and customer secret and use base64 to encode the concatenated string
      const plainCredential = customerKey + ":" + customerSecret
      const resid = this.resourceId;
      if (this.recordingStarted){
      this.stopRecording(tokenRes.data.appID,AUTH_USER_ID,channelName,tokenRes,mode,meetingid)
      }else{
        this.generateResourceId(tokenRes.data.appID,AUTH_USER_ID,channelName,tokenRes,mode,meetingid);
      }
    },
   
  },
});