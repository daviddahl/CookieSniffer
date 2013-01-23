let Cu = Components.utils;
let Ci = Components.interfaces;
let Cc = Components.classes;
let Cr = Components.results;
let Cid = Components.ID;

function log(aMessage) {
  var _msg = "CookieSniffer: " + aMessage + "\n";
  dump(_msg);
}

function pprint(aObj)
{
  if (typeof aObj == "object") {
    for (let prop in aObj) {
      log(prop + ": " + aObj[prop]);
    }
  }
  else {
    log(aObj);
  }
}

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var EXPORTED_SYMBOLS = ["cookieSniffer"];

const kTOPICS = ["http-on-modify-request", "http-on-examine-response"];

function CookieSniffer()
{
  log("CookieSniffer started");
  for (let idx in kTOPICS) {
    Services.obs.addObserver(this, kTOPICS[idx],false);
  }
}

CookieSniffer.prototype = {
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver,]),

  observe: function cs_observe(aSubject, aTopic, aData) {
    log("aTopic: " + aTopic);
    switch (aTopic) {
      case "http-on-modify-request":
	      if (aSubject instanceof Components.interfaces.nsIHttpChannel) {
		      log("http-on-modify-request: " + aSubject);
		      this.handleChannelData(aSubject);
	      }
	      case "http-on-examine-response":
	      if (aSubject instanceof Components.interfaces.nsIHttpChannel) {
		      log("http-on-examine-response: " + aSubject);
		      this.handleChannelData(aSubject);
	      }
	      break;
	    default:
	      break;
    }
  },

  handleChannelData: function cs_handleChannelData(aChannel)
  {
    pprint(aChannel);
  },
};

var cookieSniffer = new CookieSniffer();
