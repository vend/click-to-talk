function talk() {
  var participants = gapi.hangout.getParticipants();

  for (var index in participants) {
    var participant = participants[index];

    if (participant.id !== gapi.hangout.getLocalParticipantId()) {
      gapi.hangout.av.muteParticipantMicrophone(participant.id);
    } else {
      activeParticipant = participant;
      document.getElementById('talker-image').src = activeParticipant.person.image.url;
    }
  }
  gapi.hangout.av.setMicrophoneMute(false);
}

function unmute() {
  gapi.hangout.data.setValue("muted", "false");
}

function onStateChange(stateChangeEvent) {
  var muted = gapi.hangout.data.getValue("muted");
  gapi.hangout.av.setMicrophoneMute(muted === "true");
}

function configureSession() {
  var muted = gapi.hangout.data.getValue("muted");
  if (typeof muted === 'undefined') {
    gapi.hangout.data.setValue("muted", "true");
  } else {
    gapi.hangout.av.setMicrophoneMute(muted === "true");
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
      }
    }
  );
}
 
// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);
