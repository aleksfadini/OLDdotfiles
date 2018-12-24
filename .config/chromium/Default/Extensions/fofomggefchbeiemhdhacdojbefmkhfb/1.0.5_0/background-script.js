affiche('start');
var block_count=[];
var tabid=0+'id';
var letgo=false;
var sb_rc="";
var sb_sel="";
block_count[tabid]=0;
var cssrule=[];
cssrule["sab***all"]=[];
cssrule["sab***gdpr"]=[];
cssrule["sab***social"]=[];
cssrule["sab***iframe"]=[];
var cssrulewhite=[];
cssrulewhite["all"]=[];
var cssdelay=[];
var whitegdpr=[];
var whitesocial=[];
var reqrule=[];
reqrule["sub"]=[];
reqrule["dom"]=[];
reqrule["domtarget"]=[];
var cookierules=[];
cookierules["all"]=[];
var csswhite=[];
var allwhite=[];
var reqwhite=[];
var sublongest=[];
var subrules=[];
tot=0;
var followtab=[];
var sourcetab;
var popuptab;
var popuprisk=[];
var popupsourcewhite=[];
var quicklist=[];
var wt=[];
var taburl="";
var dangerrules=[];
var veryquick=[];
var idstourl=[];
var treatedframes=[];
var numberofupdates=[];
var debugmode=false;
var skipcookie=false;
var skipsocial=false;
var dangerforbrules=[];
var targetwhitelist=[];
var reqforce=[];
var nomulti=[];
var topazf=[];
var topazs=[]
var topazdelay=[];
var tarif=[];
var dltry=0;
var dlerror=false;
var firefox=false;

if(!firefox){
	chrome.contentSettings.notifications.set({
	  primaryPattern: '<all_urls>',
	  setting: 'block',
	});
}

chrome.tabs.query(
  {currentWindow: true, active : true},
  function(tab){tabid=tab.id+'id';}
)
newtabanalysis();
chrome.browserAction.setBadgeBackgroundColor({color: "#999"});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function isabrowserpage(url){
	if(url.startsWith("about:blank")){return false;}
	if(url.startsWith("chrome-extension")){return true;}
	if(url.startsWith("chrome://")){return true;}
	if(url.startsWith("about:")){return true;}
	if(url.startsWith("view-source:")){return true;}
	return false;
}

function isextensionpage(url){
	if(url.startsWith("https://chrome.google.com/")){return true;}
	if(url.startsWith("https://addons.mozilla.")){return true;}
	return false;
}

function isnotdefinedyet(url){
	if(url==""){return true;}
	if(url=="about:blank"){return true;}
	return false;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function affiche(t){
	if(debugmode){console.log(t);}
}

function getparenturl(detail){
	tkey=detail["tabId"]+"p";
	if(tkey in idstourl){return idstourl[tkey];}
	if(detail["parentFrameId"]==-1){
		return detail["initiator"];
	}
	if(detail["tabId"]>=0){
		if(track){console.log("calling tab id "+detail["tabId"]);}
		chrome.tabs.get(detail["tabId"],function callback() {if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError.message);} else {
			chrome.tabs.get(detail["tabId"],function(tab) {
				if(typeof tab != 'undefined'){
					if (typeof tab["url"] == 'undefined'){
						return "";
					}
					else
					{
						return tab["url"];
					}
				}
			});	
		}});
	}
	if(detail["frameId"]==0){
		return detail["url"];
		}
		return "";
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function rooturl(url) {
	if (typeof url == 'undefined'){return "";}
	url=url.trim();
	url=url.replace("www.","");
	url=url.replace("www2.","");
	url=url.replace("www3.","");
	if (url.startsWith("chrome-extension")){return "chrome-extension";}
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
		if(domain in suf){
			domain = splitArr[arrLen - 3] + '.' + domain;
		}
    }
    return domain;
}

function makecookierule(txt){
	txt=txt.replace("!C!","");
	arr=txt.split("##");
	if(arr[0]==""){
		cookierules["all"].push(arr[1]);
	}
	else{
		arrc=arr[0].split(",");
		var ne = arrc.length;
		for (var i = 0; i < ne; i++) {
			if(!(arrc[i] in cookierules)){cookierules[arrc[i]]=[];}
				cookierules[arrc[i]].push(arr[1]);
		}
	}
}

function checkflag(txt){
	if(txt.includes("skipcookie")){
		skipcookie=true;
	}
	if(txt.includes("skipsocial")){
		skipsocial=true;
	}
}

function treatreqexception(txt){
	txt=txt.replace("!#r#","");
	if(txt.includes("||")){
		var splitarr=txt.split("||");
		reqwhite.push(splitarr[0]);
		var splitroot=splitarr[0];
		var tail=splitarr[1];
		var tailarr=tail.split(",");
		var ne = tailarr.length;
		reqforce[splitroot]=[];
		for (var i = 0; i < ne; i++) {
			reqforce[splitroot].push(tailarr[i]);
		}
	}
	else{
		reqwhite.push(txt);
	}
}

function topdelay(txt){
	if(txt.includes("||")){
		var toparr=txt.split("||");
		return toparr[1];
	}
	return 0;
}

function topazroot(txt){
	if(txt.includes("||")){
		var toparr=txt.split("||");
		txt=toparr[0];
	}
	if(txt.includes("!")){
		var toparr=txt.split("!");
		txt=toparr[1];
	}
	return txt;
}

function topazcode(txt){
	if(txt.includes("!")){
		var toparr=txt.split("!");
		return toparr[0];
	}
	return "";
}

function treattopazf(txt){
	var r=topazroot(txt);
	var c=topazcode(txt);
	topazf[r]=c;
	return ;
}

function treattopazs(txt){
	var d=topdelay(txt);
	var r=topazroot(txt);
	var c=topazcode(txt);
	if(d>0){topazdelay[r]=d;}
	topazs[r]=c;
	return ;
}

function treattarif(txt){
	if(txt.includes("##")){
		var tarifarr=txt.split("##");
		var webs=tarifarr[0];
		var rull=tarifarr[1];
		if(!(webs in tarif)){tarif[webs]="";}
		tarif[webs]+=" "+rull+'{display:none !important;}';
	}
}

function treatcss(txt,i,key="sab***all"){
	txt=txt.trim();
	track=false;
	if(txt.startsWith("!if!")){treatcss(txt.replace("!if!",""),i,"sab***iframe");return "css";}
	if(txt.startsWith("!tarif!")){treattarif(txt.replace("!tarif!",""));return "css";}
	if(txt.startsWith("!sp1!")){treattopazf(txt.replace("!sp1!",""));return "css";}
	if(txt.startsWith("!sp2!")){treattopazs(txt.replace("!sp2!",""));return "css";}
	if(txt.startsWith("!~!")){veryquick.push(txt.replace("!~!",""));return "css";}
	if(txt.startsWith("!D!")){dangerrules.push(txt.replace("!D!",""));return "css";}
	if(txt.startsWith("!C!")){makecookierule(txt);return "css";}
	if(txt.startsWith("!o->!")){popupsourcewhite.push(txt.replace("!o->!",""));return "css";}
	if(txt.startsWith("!->o!")){targetwhitelist.push(txt.replace("!->o!",""));return "css";}
	if(txt.startsWith("!flag!")){checkflag(txt);return "css";}
	if(txt.startsWith("!danger!")){dangerforbrules.push(txt.replace("!danger!",""));return "css";}
	if(txt.startsWith("!nomulti!")){nomulti[txt.replace("!nomulti!","")]="";return "css";}
	if(txt.startsWith("!*")){popuprisk.push(txt.replace("!*",""));return "css";}
	if(txt.startsWith("!##")){allwhite.push(txt.replace("!##",""));return "css";}
	if(txt.startsWith("!#r#")){treatreqexception(txt);return "css";}
	if(txt.startsWith("!#t#")){txt=txt.replace("!#t#","");arr=txt.split("|");cssdelay[arr[0]]=arr[1];return "css";}
	if(txt.startsWith("!#")){csswhite.push(txt.replace("!#",""));return "css";}
	if(txt.startsWith("!") || txt.startsWith("[")){return "css";}
	if(txt.includes("#")){
		if(txt.includes("#@")){
			tarr=txt.split("#@#");
			if(tarr[0]==""){
				cssrulewhite["all"].push(tarr[1]);
				return "css";
			}
			else{
				arr=tarr[0].split(",");
				var ne = arr.length;
				for (var i = 0; i < ne; i++) {
					if(!(arr[i] in cssrulewhite)){cssrulewhite[arr[i]]=[];}
					cssrulewhite[arr[i]].push(tarr[1]);
				}
			}
			return "css";
		}
		else
		if(txt.includes("##")){
			tarr=txt.split("##");
			if(tarr[0]==""){
				cssrule[key]+=" "+tarr[1]+'{display:none !important;}';
			}
			else{
				arr=tarr[0].split(",");
				var ne = arr.length;
				for (var i = 0; i < ne; i++) {
					if(!(arr[i] in cssrule)){cssrule[arr[i]]="";}
					cssrule[arr[i]]+=" "+tarr[1]+'{display:none !important;}';
				}
			}
			return "css";
		}
	}
	else{
	}
	return "";
}

function make_req_rules(easy_arr){
	var ne = easy_arr.length;
	var cssrule="";
	d=0;
	dt=0;
	s=0;
	c=0;
	for (var i = 0; i < ne; i++) {
		b=treatcss(easy_arr[i],i);
		track=false;
		if(b=="css"){
			c++;
			continue;
			}
		a=treatrule(easy_arr[i]);
		txt=easy_arr[i];
		if(a!==false){
			m = a["domainw"].length;
			if(m>0){
				for (var j = 0; j < m; j++) {
					if(!(a["domainw"][j] in reqrule["dom"])){reqrule["dom"][a["domainw"][j]]=[];}
					reqrule["dom"][a["domainw"][j]].push(easy_arr[i]);
					d++;
				}
			}
			if(m==0 && a["domtarget"]){
				if(!(a["root"] in reqrule["domtarget"])){reqrule["domtarget"][a["root"]]=[];}
				reqrule["domtarget"][a["root"]].push(easy_arr[i]);
				dt++;
			}
			if(m==0 && !a["domtarget"]){
				sublongest.push(a["longest"]);
				subrules.push(easy_arr[i]);
				s++;
			}
		}
	}
	affiche("Domain limited rules "+d);
	affiche("Domain target rules "+dt);
	affiche("substring rules "+s);
	affiche("css rules "+c);
}

function extracttext(arr){
	var xhr = new XMLHttpRequest();
	var easy;
	var easy_att;
	var skipall=false;
	if(arr.length==0){
		if(dlerror==true && dltry==0){
			dltry=1;
			initfilters("second");
			return 0;
		}
		var nnp=popuprisk.length;
		var popupriskjson={};
		for (var i = 0; i < nnp; i++) {
			popupriskjson[popuprisk[i]]="";
		}
		var myJsonString = JSON.stringify(popupriskjson);
		res={};
		res["popuprisk"]=myJsonString;
		chrome.storage.local.set(res, function() {
        });
		var d=new Date();
		chrome.storage.local.set({"lastupdate": d.toString()}, function() {
			console.log("stored last update "+d.toString());
        });
		return 0;
	}
	txt=arr.pop();
	if(txt.includes("https:")){
		suff="?r="+makeid();
	xhr.open("GET", txt+suff, true);
	}
	else{
		
	xhr.open('GET', chrome.extension.getURL(txt), true);
	}
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200)
		{
			dlerror=true;
		}
		if(xhr.readyState == XMLHttpRequest.DONE)
		{
			if(txt.includes("cookie")){
				if(skipcookie){
					skipall=true;
				}
			}
			if(txt.includes("social")){
				if(skipsocial){
					skipall=true;
				}
			}
			if(skipall==false){
			easy=xhr.responseText;
			easy_arr=easy.split("\n"); 
			make_req_rules(easy_arr);
			}
			extracttext(arr);
		}
	};
	xhr.send();	
}

function initfilters(err=""){
cssrule=[];
reqrule=[];
reqrule["sub"]=[];
reqrule["dom"]=[];
reqrule["domtarget"]=[];
csswhite=[];
allwhite=[];
reqwhite=[];
sublongest=[];
subrules=[];
popuprisk=[];
quicklist=[];
veryquick=[];
cssrule["sab***all"]=[];
cssrule["sab***gdpr"]=[];
cssrule["sab***social"]=[];
cssrule["sab***iframe"]=[];
whitegdpr=[];
whitesocial=[];
treatedframes=[];
dangerrules=[];
idstourl=[];
numberofupdates=[];
cookierules=[];
cookierules["all"]=[];
skipcookie=false;
skipsocial=false;
dangerforbrules=[];
targetwhitelist=[];
cssdelay=[];
reqforce=[];
nomulti=[];
topazf=[];
topazs=[];
topazdelay=[];
tarif=[];

var randnum=makeid(); 
var elp='https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_';
var fbp='https://raw.githubusercontent.com/easylist/easylist/master/fanboy-addon/fanboy_';
var addf='https://www.trafiklite.com/smartadblock/filters/sabfilter.txt';
var cf=fbp+'cookie_general_hide.txt';
var cwf=fbp+'cookie_whitelist_general_hide.txt';
var sf=fbp+'social_general_hide.txt';
var swf=fbp+'social_whitelist_general_hide.txt';
var swf=fbp+'social_whitelist_general_hide.txt';
var ela=elp+'adservers.txt';
var elg=elp+'general_block.txt';
var elgd=elp+'general_block_dimensions.txt';
var elgh=elp+'general_hide.txt';
var elsb=elp+'specific_block.txt';
var elsh=elp+'specific_hide.txt';
var elt=elp+'thirdparty.txt';
var elw=elp+'whitelist.txt';
var elwd=elp+'whitelist_dimensions.txt';
var elwgh=elp+'whitelist_general_hide.txt';
var elbase="https://easylist.to/easylist/easylist.txt";
var inp=[elbase,cf,cwf,sf,swf,addf];
if(err=="second"){
	inp=[ela,elg,elgd,elgh,elsb,elsh,elt,elw,elwd,elwgh,cf,cwf,sf,swf,addf];
}
extracttext(inp);	
}

initfilters();

function checklastupdate(){
        chrome.storage.local.get(["lastupdate"], function(result) {
			var d=new Date();
			diff=(d-Date.parse(result["lastupdate"]));
			if(diff>86400000){
				affiche("reloading arrays");
				initfilters();
			}
        });
}

function refreshcounter(){
	chrome.storage.local.get(null, function(result) {
		wt=result;
		ru=rooturl(taburl);
		if(ru in wt){
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setIcon({path : "icons/sbgry38.png"});
			chrome.browserAction.setTitle({title: 'SmartAdBlock is disabled on this page'});
			return;
		}
		if(tabid in block_count){
			if(block_count[tabid]>0){
				chrome.browserAction.setBadgeText({text: ''+block_count[tabid]});
				chrome.browserAction.setIcon({path : "icons/sbr38.png"});
				chrome.browserAction.setTitle({title: 'SmartAdBlock has blocked '+block_count[tabid]+' requests'});
			}
			else{
				chrome.browserAction.setBadgeText({text: ''});
				chrome.browserAction.setIcon({path : "icons/sbr38.png"});
				chrome.browserAction.setTitle({title: 'SmartAdBlock'});
			}
		}
		else{
			chrome.browserAction.setBadgeText({text: ''});
			chrome.browserAction.setIcon({path : "icons/sbr38.png"});
			chrome.browserAction.setTitle({title: 'SmartAdBlock'});
		}
	});
}

function checkall(req){
	lu=0;
	found=false;
	if (typeof req["initiator"] == 'undefined'){return false;}
	if(isabrowserpage(req["initiator"])){return false;}
	if(isextensionpage(req["initiator"])){return false;}
	tri=rooturl(req["initiator"]);
	tro=rooturl(req["url"]);
	if(tri in reqrule["dom"]){
		rulz=reqrule["dom"][tri];
		for (var i = 0; i <  Object.keys(rulz).length; i++) {
			lu++;
			c=checkreq(req,rulz[i],found);
			if (c=="matchnormal") {
				affiche("match rule");
				affiche(rulz[i]);
			  found=true;
			}
			if (c=="matchexception") {
			  return false;
			}
		}
	}
	if(tro in reqrule["domtarget"]){
		rulz=reqrule["domtarget"][tro];
		for (var i = 0; i <  Object.keys(rulz).length; i++) {
			lu++;
			c=checkreq(req,rulz[i],found);
			if (c=="matchnormal") {
				affiche("match rule");
				affiche(rulz[i]);
			  found=true;
			}
			if (c=="matchexception") {
			  return false;
			}
		}
	}
	for (var j = 0; j < sublongest.length; j++) {	
		if(req["url"].includes(sublongest[j])){
			lu++;
			c=checkreq(req,subrules[j],found);
			if (c=="matchnormal") {
				affiche("match rule");
				affiche(subrules[j]);
			  found=true;
			}
			if (c=="matchexception") {
			  return false;
			}
		}
	}
	if(found){return true;}
  return false;
}

function dangertest(details){
	if (typeof details["initiator"] != 'undefined'){
		ru=rooturl(details["initiator"]);
		if(popupdanger(ru)){
			var ne = dangerrules.length;
			for (var i = 0; i < ne; i++) {
				if(details["initiator"].includes(dangerrules[i])){return true;}
			}
		}
	}
	return false;
}

function fastcheck(details){
	if(details["type"]=="ping"){return false;}
	if(details["type"]=="stylesheet"){return false;}
	if("initiator" in details){
		if("url" in details){
			if(details["url"]==details["initiator"]){
				return false;
			}
		}
	}
	return checkall(details);
}

function reqwhiteforce(ru,details){
	if(typeof details["url"]!="undefined"){
		var durl=details["url"];
		if(ru in reqforce){
			reqarr=reqforce[ru];
			var ne = reqarr.length;
			for (var i = 0; i < ne; i++) {
				if(durl.includes(reqarr[i])){
					increment(details["tabId"]);
					refreshcounter();
					return {cancel: true};
					}
			}
		}
	}
	return ;
}

 chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
			track=false;
			txt=details["url"];
			if(txt.includes("ad6media")){track=true;}
			parenturl=details["url"];
			parenturl=getparenturl(details);
			ru=rooturl(parenturl);
			if(ru in wt){return;}
			if(isallwhite(ru)){return ;}
			if(isreqwhite(ru)){return reqwhiteforce(ru,details);}
			details["initiator"]=parenturl;
			test=fastcheck(details);
			if(!test){test=dangertest(details);}
			if(!test){
				var ifru=rooturl(details["url"]);
				if(ifru in tarif){
					var ifid="n"+details["frameId"];
					if(!(ifid in treatedframes) && details["frameId"]>0){
						chrome.tabs.insertCSS(details["tabId"], {code: tarif[ifru], frameId : details["frameId"],allFrames:true,matchAboutBlank : true,runAt:"document_end"},callback);
						treatedframes[ifid]=1;
					}
					if((ifid in treatedframes) && details["frameId"]>0){
						if(treatedframes[ifid]<4){
							chrome.tabs.insertCSS(details["tabId"], {code: tarif[ifru], frameId : details["frameId"],allFrames:true,matchAboutBlank : true,runAt:"document_end"},callback);
							treatedframes[ifid]=treatedframes[ifid]+1;
						}
					}
				}
			}
			if(test){
				affiche("blocking");
				affiche(details);
				affiche(details["url"]);		
				increment(details["tabId"]);
				refreshcounter();
			}
			else{
			}
          return {cancel: test};
        },
        {urls: ["<all_urls>"]},
        ["blocking"]);
		

function increment(idnum){
	fullid=idnum+"id";
	if(fullid in block_count){
		block_count[fullid]++;	
	}
	else{
		block_count[fullid]=1;
	}
}

function newtabanalysis(isnew){
		ban_anim=false;
		chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function(tabs) {

		if (typeof tabs !== 'undefined') {
			var tab = tabs[0];
			if (typeof tab !== 'undefined' && !isnotdefinedyet(tab.url)) {
				if ("id" in tab) {
				tabid=tab.id+'id';
				taburl=tab.url;
				idstourl[tab.id+"p"]=tab.url;
				}
				else{
					tabid=-1+'id';
					taburl="";
				}
			}
			if (isnew=="new"){block_count[tabid]=0;}
			if(tabid in block_count){
				refreshcounter();
			}
			else{
				block_count[tabid]=0;
				refreshcounter();
			}
		}
	});        
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.validtab) {
	  affiche("received pass true");
	  letgo=true;
	  setTimeout(function(){ letgo=false;}, 800);
	  sb_rc=message.rc;
	  return;
  }
  if(message.cm) {
	  sb_rc=message.rc;
	  sb_sel=message.sl;
	  return;
  }
  if(message.start){
	  affiche("new tab started");
	  affiche(sender);
	  numberofupdates[sender.tab.id+"p"]=0;
	  return;
  }
});

function iscsswhite(txt){
	if(txt==""){return false;}
	var ne = csswhite.length;
	for (var i = 0; i < ne; i++) {
		if(txt.includes(csswhite[i])){return true;}
	}
	return false;
}

function isallwhite(txt){
	if(txt==""){return false;}
	var ne = allwhite.length;
	for (var i = 0; i < ne; i++) {
		if(txt.includes(allwhite[i])){
			return true;}
	}
	return false;
}

function isreqwhite(txt){
	if(txt==""){return false;}
	var ne = reqwhite.length;
	for (var i = 0; i < ne; i++) {
		if(txt.includes(reqwhite[i])){
			return true;}
	}
	return false;
}

function insertautocookie(txt,tab){
	delay=200;
	if(txt.includes("||")){
		arrt=txt.split("||");
		delay=arrt[1];
		txt=arrt[0];
	}	
	deb='window.addEventListener("load", function() { setTimeout(function(){';
	debb='window.addEventListener("DOMContentLoaded", function() { setTimeout(function(){';
	
	end='}, '+delay+'); });';	
	endd='}, 0); });';	
	sep="'";

	codetxt=deb+'if(typeof($('+sep+txt+sep+')[0])!="undefined"){$('+sep+txt+sep+')[0].click();}'+end;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
	codetxt=debb+'if((typeof document.querySelectorAll('+sep+txt+sep+')[0])!="undefined"){document.querySelectorAll('+sep+txt+sep+')[0].click();}'+endd;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
	codetxt=deb+'if(typeof($('+sep+txt+sep+')[0])!="undefined"){$('+sep+txt+sep+')[0].click();}'+endd;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
}

function insertlatecss(txt,tab,delay){
	//delay=2000;
	sep="'";
	txt=txt.replaceAll("'","");
	deb='window.addEventListener("load", function() { setTimeout(function(){  $("head").append('+sep+'<style>'+txt+'</style>'+sep+');';
	end='}, '+delay+'); });';	
	codetxt=deb+end;
	chrome.tabs.executeScript(tab.id,  {code: codetxt, runAt:"document_start"},callback);
}

function topazrep(txt){
	res="";
	if(txt.includes("t")){res=res+"top:0px !important;"}
	if(txt.includes("o")){res=res+"opacity:0 !important;"}
	if(txt.includes("p")){res=res+"pointer-events:none !important;"}
	if(txt.includes("a")){res=res+"position:absolute !important;"}
	if(txt.includes("z")){res=res+"z-index:-999 !important;"}
	return res;
}

function insertion(tab){
	if(isabrowserpage(tab.url)){return ;}
	if(isextensionpage(tab.url)){return ;}
	affiche("inserting CSS");
	ru=rooturl(tab.url);
	nall=cookierules["all"].length;
	for (var i = 0; i < nall; i++) {
		insertautocookie(cookierules["all"][i],tab);
	}
	if(ru in cookierules){
		ns=cookierules[ru].length;
		for (var i = 0; i < ns; i++) {
			affiche(cookierules[ru][i]);
			insertautocookie(cookierules[ru][i],tab);
		}
	}
	var istopazf=false;
	var istopazs=false;
	if(ru in topazf){istopazf=true;}
	if(ru in topazs){istopazs=true;}
	if(iscsswhite(tab.url)){return;}
	for (var key in cssrule) {
		if (cssrule.hasOwnProperty(key)) {
			if(tab.url.includes(key)){
				affiche("including css for "+key);
				if(isabrowserpage(tab.url)){return;}
				try {
					if(istopazf==false){
						chrome.tabs.insertCSS(tab.id, {code: cssrule[key], allFrames:false,runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
					}
					if(istopazf==true){
						var toptxt=topazf[ru];
						var rep=topazrep(toptxt);
						var modkeyop=cssrule[key].replaceAll("display:none",rep);
						chrome.tabs.insertCSS(tab.id, {code: modkeyop, allFrames:false,runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
					}
					if(istopazs==true){
						var toptxt=topazs[ru];
						var rep=topazrep(toptxt);
						var del=topazdelay[ru];
						var modkeyop=cssrule[key].replaceAll("display:none",rep);
						insertlatecss(modkeyop,tab,del);
					}
				}
				catch(err) {
					affiche("insertion error");
				}
			}
		}
	}
		modall=cssrule["sab***all"];
			var ne = cssrulewhite["all"].length;
			for (var i = 0; i < ne; i++) {
					exc=cssrulewhite["all"][i];
					modall=modall.replace(exc,".dep_sab_deprecated");
				}	
		if(ru in cssrulewhite){
			var ne = cssrulewhite[ru].length;
			for (var i = 0; i < ne; i++) {
					exc=cssrulewhite[ru][i];
					modall=modall.replace(exc,".dep_sab_deprecated");
				}
			}
				try {
					if(istopazf==false){
						chrome.tabs.insertCSS(tab.id, {code: modall, allFrames:false, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
					}
					if(istopazf==true){
						var toptxt=topazf[ru];
						var rep=topazrep(toptxt);
						var modallop=modall.replaceAll("display:none",rep);
						chrome.tabs.insertCSS(tab.id, {code: modallop, allFrames:false, runAt:"document_start", cssOrigin : "user",matchAboutBlank : true},callback);
					}
					if(istopazs==true){
						var toptxt=topazs[ru];
						var rep=topazrep(toptxt);
						var del=topazdelay[ru];
						var modallop=modall.replaceAll("display:none",rep);
						insertlatecss(modallop,tab,del);
					}
				}
				catch(err) {
					affiche("insertion error");
				}
}

function callback() {
    if (chrome.runtime.lastError) {
		//console.log("error");
    } else {
		//console.log("insertion worked");
    }
}

function sharpurl(txt){
	if (typeof txt == 'undefined'){return "";}
	txt=txt.trim();
	txt=txt.replace("http://","");
	txt=txt.replace("https://","");
	if(txt.slice(-1)=="/"){txt=txt.slice(0, -1);}
	return txt;
}

function isexpected(url){
	url=sharpurl(url);
	if(url==""){return false;}
	exp=sharpurl(sb_rc);
	expp=sharpurl(sb_sel);
	return (exp==url || expp==url);
}

function isalreadyloaded(tab){
	if(!(tab.id in idstourl)){return false;}
	urls=idstourl[tab.id];
	arr=urls.split("#");
	urls=arr[0];
	arr=urls.split("?");
	urls=arr[0];
	urlo=tab.url;
	arr=urlo.split("#");
	urlo=arr[0];
	arr=urlo.split("?");
	urlo=arr[0];
	return urlo==urls;
}

function isdangerforbidden(txt){
	nda=dangerforbrules.length;
	for (var i = 0; i < nda; i++) {
		if(txt.includes(dangerforbrules[i])){return true;}
	}
	return false;
}

function isnomulti(sourcetab){
	if(typeof(sourcetab)!="undefined"){
		if("url" in sourcetab){
			source=sourcetab.url;
			su=rooturl(source);
			return (su in nomulti);
		}
	}
	return false;
}

function emp(){}

function tryremove(id){
	try{
		var removing = chrome.tabs.remove(id);
		removing.then(emp,emp);
	}
	catch(err){
	}	
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status==="complete"){
		affiche("complete");
	}
	if(changeInfo.status=="loading"){
		if(firefox){
			if(tab.url=="about:blank"){return;}
		}
		affiche("loading");
		sttab=tabId+'id';
		affiche(tab);
		affiche(idstourl);
		if(sttab in followtab){
			source=sourcetab.url;
			delete followtab[sttab];
			if(popupdanger(source)){
				if(!firefox){
					if(isnotdefinedyet(tab.url)){
						tryremove(tab.id);
						notify(sourcetab.id,tab.url);
						return 0;
					}
				}
				s=isasearch(tab.url) || istargetwhitelisted(tab.url);
				ru=rooturl(tab.url);
				su=rooturl(source);
				if(!isexpected(tab.url) && !s){
					tryremove(tab.id);
					notify(sourcetab.id,tab.url);
					return 0;
				}
				t=tab.url;
				if(isdangerforbidden(t)){
					tryremove(tab.id);
					notify(sourcetab.id,tab.url);
					return 0;
				}
			}
			a=popupcheck(tab,sourcetab);
			if(a==0){return 0;}
		}
		tinum=tab.id+"p";
		if(tinum in idstourl){
			ruold=rooturl(idstourl[tinum]);
			runew=rooturl(tab.url);
			if(runew!=ruold){
				numberofupdates[tinum]=0;
			}
		}
		updatelimit=3;
		if(isnomulti(tab)){updatelimit=2;}
		if(tinum in numberofupdates){
			if(numberofupdates[tinum]>updatelimit){
				return;
			}
		}
		else{
			numberofupdates[tinum]=1;
		}
		t=tab.url;
		if(isabrowserpage(t)){return;}
			block_count[tab.id+"id"]=0;
			registernewtab(tab);
			checklastupdate();
			numberofupdates[tinum]++;
	}
});

function registernewtab(tab){
		ru=rooturl(tab.url);
		chrome.storage.local.get(null, function(result) {
			wt=result;
			affiche("registering new tab "+(ru in wt));
			affiche("ru "+ru);
			affiche("wt");
			affiche(wt);
			if((ru in wt)==false){
				insertion(tab);
			}
			newtabanalysis();
		});
}

function popupcheck(tab,tabb){
		if(tab.url==""){
		chrome.tabs.remove(tab.id);
		notify(tabb.id,tab.url);
		return 0;
		}
		ru=rooturl(tab.url);
        source=tabb.url;
		samedomain=(rooturl(source)==ru);
		se=isabrowserpage(tab.url);
		se=se || (isexpected(tab.url));
		se=se || samedomain;
		se=se || istargetwhitelisted(tab.url);
		if(tab.active==true && !se){
			tryremove(tab.id);
			notify(tabb.id,tab.url);
			return 0;
		}    
		return 1;
}

function isasearch(txt){
return txt.includes("google") && txt.includes("/search");
}

function popupdanger(url){
	if (typeof url == 'undefined'){return false;}
	url=url.toLowerCase();
	url=url.replace("http://","");
	url=url.replace("https://","");
	arr=url.split("/");
	url=arr[0];
	arr=url.split("?");
	url=arr[0];
	if(url in wt){return false;}
	for (var j = 0; j < popuprisk.length; j++) {
		if(url.includes(popuprisk[j])){
			return true;
		}
	}
	return false;
}

function notify(id,txt){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(id, {action: "newtab",url: txt}, function(response) {});  
	});
}

function allowpopup(tab){
	if(typeof tab!="undefined"){url=tab.url;}
	url_short=rooturl(url);
	if(url_short in wt){return true;}
	if(isallwhite(url)){return true;}
	if(isabrowserpage(url)){return true;}
	var ne = popupsourcewhite.length;
	for (var i = 0; i < ne; i++) {
		if(url.includes(popupsourcewhite[i])){return true;}
	}
	return false;
}

function istargetwhitelisted(txt){
	nta=targetwhitelist.length;
	for (var i = 0; i < nta; i++) {
		if(txt.includes(targetwhitelist[i])){return true;}
	}
	return false;
}

function gettabsource(tab){
	if(typeof(tab)!="undefined"){
		if("url" in tab){
			return rooturl(tab.url);
		}
	}
return "";
}
chrome.tabs.onCreated.addListener(function(tab) { 
	rutt=rooturl(tab.url);
	samedomain=false;
	lasttab=parseInt(tabid.replace("id",""));
	chrome.tabs.get(lasttab,function(tabb) {
		su=gettabsource(tabb);
		if(allowpopup(tabb)){
			registernewtab(tab);
			return ;
		}
		if(popupdanger(su) && !isabrowserpage(tab.url)){
			s=isasearch(tab.url);
			if(sb_rc!=tab.url && !isnotdefinedyet(tab.url) && !s){
				tryremove(tab.id);
				notify(tabb.id,tab.url);
				return 0;
			}
			if(isdangerforbidden(tab.url)){
				tryremove(tab.id);
				notify(tabb.id,tab.url);
				return 0;
			}
		samedomain=(su==rutt  && !isnotdefinedyet(tab.url));
		se=istargetwhitelisted(rutt);
		se=se || isexpected(tab.url);
		se=se || isabrowserpage(tab.url);
		se=se || (su in wt);
		if(!isnotdefinedyet(tab.url) && !samedomain && !letgo && !isabrowserpage(tab.url) && tab.active==true && !se){
			tryremove(tab.id);
			notify(tabb.id,tab.url);
			return 0;
		}    
		else{
			if(isnotdefinedyet(tab.url) && !se){
				followtab[tab.id+"id"]="ok";
				popuptab=tab;
				sourcetab=tabb;
			}  
			else{
			}
		}
		}
    });
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
newtabanalysis();
});

chrome.windows.onFocusChanged.addListener(function(tabId, changeInfo, tab) {
newtabanalysis();
});

function addelement(){
  chrome.storage.local.set({"site": "o"}, function() {
		  readelement();
        });
}
function readelement(){
        chrome.storage.local.get(["site"], function(result) {
        });
}
