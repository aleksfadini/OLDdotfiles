var sam=[];


function treatrule(txt){
	s=false;
	or=txt;
	txt=txt.toLowerCase();
	txt=txt.trim();
	if(txt.length<3){return false;}
	if(txt.includes("{")){return false;}
	if(txt.includes("[")){return false;}
	if(txt.includes("#")){return false;}
	if(txt.startsWith("!")){return false;}
	if(txt.startsWith("[")){return false;}
	if(txt.includes("csp=script-src")){return false;}
	if(!txt.includes("^") && !txt.includes("*") && !txt.includes("|") && !txt.includes("$")){quicklist.push(txt);}
	a=[];
	a["white"]="normal";
	a["longest"]=longest(txt);
	if(txt.startsWith("@@")){
		a["white"]="exception";
		txt=txt.replace("@@","");
	}
	arr=txt.split("$");
	txt=arr[0];
	parr=arr[1];
	a["root"]="";
	a["or"]=or;
	a["domtarget"]=true;
	roo=txt.replaceAll("*","");
	roo=roo.replaceAll("^","");
	roo=roo.replaceAll("|","");
	ro=rooturl(roo);
	if(!txt.startsWith("|")){pref=".*";a["domtarget"]=false;}
	if(txt.startsWith("||")){
		pref="^[A-Za-z0-9\\-]*:\/\/[A-Za-z0-9\\-]*\\.";
		txt=txt.replace("||www.","||");
		txt=txt.replace("||www2.","||");
		txt=txt.replace("||www3.","||");
		txt=txt.substr(2);
		a["root"]=ro;
		}
	else{
		if(txt.startsWith("|"))
		{pref="^";txt=txt.substr(1);a["root"]=ro;}
	}
	suff=".*";
	if(txt.includes("|")){
	arr=txt.split("|");
	txt=arr[0];
	suff="$";
	}
		txt=txt.replaceAll("\\","\\\\");
		txt=txt.replaceAll(".","\\"+".");
		txt=txt.replaceAll("*",".*");
		txt=txt.replaceAll("?","\\?");
		txt=txt.replaceAll("(","\\(");
		txt=txt.replaceAll(")","\\)");
		txt=txt.replaceAll("/","\\/");
		txt=txt.replaceAll("^","(\\?|\\/|).*");
		txt=txt.replaceAll("+","\.");
		fin=pref+txt+suff;
		fin=fin.replaceAll(".*.*",".*");		
	r= new RegExp(fin);
	a["reg"]=r;
	a["tp"]=false;
	a["onsite"]=false;
	a["domainw"]=[];
	a["domainb"]=[];
	a["typew"]=[];
	a["typeb"]=[];
	if (typeof parr != 'undefined'){
		p_arr=parr.split(',');
		var ne = p_arr.length;
		for (var i = 0; i < ne; i++) {
			k=p_arr[i];
			if(k=="third-party"){a["tp"]=true;}
			if(k=="~third-party"){a["onsite"]=true;}
			if(k.includes("domain=")){
				res=extractdom(k);
				a["domainw"]=res["dw"];
				a["domainb"]=res["db"];
				}
			if(!k.includes("domain=") && !k.includes("=") && k!="third-party"){
				if(k.includes('~')){
					a["typeb"].push(k.replace("~",""));
					if(k.replace("~","")=="subdocument"){
						a["typeb"].push("main_frame");
					}
				}
				else{
					a["typew"].push(k);
					if(k=="subdocument"){
						a["typew"].push("main_frame");
					}
				}
			}
		}
	}
	return a;
}

function matchregex(m,n){
	if(typeof m == "undefined"){return false;}
	if(m==null){return false;}
	if(m.includes(n)){return true;}
	return false;
}

function checkreq(req,txt,whiteonly){
	rule=treatrule(txt);
	if(whiteonly && rule["white"]=="normal"){return ;}
	source_root=rooturl(req["initiator"]);
	target_root=rooturl(req["url"]);
	if(rule["tp"]){
		if(source_root==target_root){return "nomatch"+rule["white"];}
	}
	if(rule["onsite"]){
		if(track){console.log("tp");}
		if(source_root!=target_root){return "nomatch"+rule["white"];}
	}
	if(rule["domainw"].length>0){
		if(!rule["domainw"].includes(source_root)){return "nomatch"+rule["white"];}
	}
	if(rule["domainb"].length>0){
		if(rule["domainb"].includes(source_root)){return "nomatch"+rule["white"];}
	}
	if(rule["typew"].length>0){
		if(!rule["typew"].includes(req["type"])){return "nomatch"+rule["white"];}
	}
	if(rule["typeb"].length>0){
		if(rule["typeb"].includes(req["type"])){return "nomatch"+rule["white"];}
	}
	n=req["url"].toLowerCase();
	m=n.match(rule["reg"]);
	if(matchregex(m,n)){
			return "match"+rule["white"];
	}
	else{
		return "nomatch"+rule["white"];
	}
}

function extractdom(txt){
	txt=txt.replace("domain=","");
	arr=txt.split("|");
	res=[];
	res["dw"]=[];
	res["db"]=[];
	var ne = arr.length;
	for (var i = 0; i < ne; i++) {
		if(arr[i].includes('~')){
			res["db"].push(arr[i].replace("~",""));
		}
		else
		{
			res["dw"].push(arr[i]);;
		}
	}
	return res;
}

function longest(str){
	best="";
	bestl=0;
	buff="";
	buffl=0;
	for (var i = 0; i < str.length; i++) {
		l=str.charAt(i);
		if(l=="$"){return best;}
		if(l=="|" && i>1){return best;}
		forb=["|","*","$","@","^"];
		if(forb.includes(l)){
			buff="";
			buffl=0;
		}
		else{
			buff=buff+l;
			buffl=buffl+1;
			if(buffl>bestl){
				best=buff;
				bestl=buffl;
			}
		}
	}
	return best;
}