function talk() {
  var participants = gapi.hangout.getParticipants();
  gapi.hangout.data.setValue("talking", gapi.hangout.getLocalParticipantId());
  gapi.hangout.data.setValue("muted", "true");

  for (var index in participants) {
    var participant = participants[index];

    if (participant.id !== gapi.hangout.getLocalParticipantId()) {
      gapi.hangout.av.muteParticipantMicrophone(participant.id);
    }
  }
}

function unmute() {
  gapi.hangout.data.setValue("muted", "false");
  gapi.hangout.data.setValue("talking", "");
}

function onStateChange(stateChangeEvent) {
  var muted = gapi.hangout.data.getValue("muted");
  if (typeof muted !== 'undefined') {
    if (muted === "true") {
        var activeParticipantID = gapi.hangout.data.getValue("talking");
        var activeParticipant = gapi.hangout.getParticipantById(activeParticipantID);

        if (activeParticipantID === gapi.hangout.getLocalParticipantId()) {
          gapi.hangout.av.setMicrophoneMute(false);
        } else {
          gapi.hangout.av.setMicrophoneMute(true);
        };

        if (activeParticipant) {
          document.getElementById('talker-image').src = activeParticipant.person.image.url;
        };
    } else {
      gapi.hangout.av.setMicrophoneMute(false);
    };
  } else {
    gapi.hangout.av.setMicrophoneMute(true);
  }
}

function configureSession() {
  var muted = gapi.hangout.data.getValue("muted");
  if (typeof muted === 'undefined') {
    gapi.hangout.data.setValue("muted", "true");
  } else {
    gapi.hangout.av.setMicrophoneMute(muted === "true");
  }
}

function onKeyPress(e) {
  e = e || window.event;
  var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
  if (charCode == 116) {
    talk();
  } else if (charCode == 117) {
    unmute();
  }
}

// This runs when the gadget is ready
function init() {
  // When API is ready...
  gapi.hangout.onApiReady.add(
    function(eventObj) {
      if (eventObj.isApiReady) {
        configureSession();

        gapi.hangout.data.onStateChanged.add(onStateChange);

        document.onkeypress = onKeyPress;
      }
    }
  );
}
 
// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);
