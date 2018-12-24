var wt=[];
var disable=chrome.i18n.getMessage("dis");
var enable=chrome.i18n.getMessage("ena");
var on=chrome.i18n.getMessage("on");
var loc_one=chrome.i18n.getMessage("loc_one");
var loc_two=chrome.i18n.getMessage("loc_two");
var hasblock=chrome.i18n.getMessage("hasblock");
var req=chrome.i18n.getMessage("request");
var inactive=chrome.i18n.getMessage("inactive");
var sug=chrome.i18n.getMessage("suggestions");
var tip=chrome.i18n.getMessage("tips");

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

function switchelement(url,tabs){
	 ru=rooturl(url);
	 img=document.getElementById("flag").getAttribute('src');
	 if(img=="shield3.png"){removeelement(ru,tabs);}else{addelement(ru,tabs);}
}

function addelement(ru,tabs){
	 res={};
	 res[ru]="o"
	  chrome.storage.local.set(res, function() {
		  changeicon(ru,tabs);
		  chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
}
function removeelement(ru,tabs){
	  chrome.storage.local.remove(ru, function() {
		  changeicon(ru,tabs)
		  chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
        });
}
function changeicon(ru,tabs){
        chrome.storage.local.get(ru, function(result) {
          if(ru in result){document.getElementById("flag").setAttribute('src','shield3.png');
		  document.getElementById("dis").innerHTML = enable;
		  }
		  else{document.getElementById("flag").setAttribute('src','white.png');
		  document.getElementById("dis").innerHTML = disable;}
        });
}

//$( document ).ready(function() {
			chrome.storage.local.get(null, function(result) {
			wt=result;
			syncmessage();
		});
		document.getElementById("reload").onclick = function() {
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				switchelement(tabs[0].url,tabs);		   
			});
		};

		document.getElementById("dis").innerHTML=disable;
		document.getElementById("on").innerHTML=on;
		document.getElementById("loc_one").innerHTML=loc_one;
		document.getElementById("loc_two").innerHTML=loc_two;
		document.getElementById("suggest").innerHTML=sug;
		document.getElementById("tip").innerHTML=tip;
//});

//window.addEventListener('load', function() {
		document.getElementById("tips").addEventListener('click',function() {
			console.log("clicked");
	    chrome.tabs.create({url: "https://www.trafiklite.com/smartadblock/"});
	});
//});

function islocal(url){
	if(url.includes("http://") || url.includes("https://")){
		return false;
	}
	else{
		return true;
	}
}

function syncmessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		ro=rooturl(tabs[0].url);
			if(ro in wt){
			document.getElementById("status").innerHTML = inactive;
			}
		else
		{	
		chrome.browserAction.getBadgeText({}, function(result) {
			if(result==""){result=0;}
			if(result<2){plu="";}else{plu="s";}
			document.getElementById("status").innerHTML = hasblock+" "+result+" "+req+plu;
		});
		}
	});
			chrome.storage.local.get(null, function(result) {
			wt=result;
		});
}

setInterval(function(){ 
syncmessage(); 
}, 500);

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var url = tabs[0].url;
		ro=rooturl(url);
		if(islocal(url)){
			document.getElementById("tips").style.display = 'none';
			document.getElementById("container").style.display = 'none';
			document.getElementById("topcontainer").style.display = 'none';
			document.getElementById("local").style.display = 'block';
		}
		changeicon(ro,tabs);
		document.getElementById("site").innerHTML = ro;
		document.getElementById("siteup").innerHTML = ro;
		document.getElementById("fav").src=tabs[0].favIconUrl;
		syncmessage();
	});