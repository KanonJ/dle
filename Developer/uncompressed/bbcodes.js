var uagent = navigator.userAgent.toLowerCase();
var is_ie = uagent.indexOf("msie") >= 0 ? true : false;

var ie_range_cache = '';
var list_open_tag = '';
var list_close_tag = '';
var listitems = '';
var playlist = '';
var bbtags   = new Array();

var rus_lr2="\u0415-\u0435-\u041e-\u043e-\u0401-\u0401-\u0401-\u0401-\u0416-\u0416-\u0427-\u0427-\u0428-\u0428-\u0429-\u0429-\u042a-\u042c-\u042d-\u042d-\u042e-\u042e-\u042f-\u042f-\u042f-\u042f-\u0451-\u0451-\u0436-\u0447-\u0448-\u0449-\u044d-\u044e-\u044f-\u044f".split("-");var lat_lr2=("/E-/e-/O-/o-\u042bO-\u042bo-\u0419O-\u0419o-\u0417H-\u0417h-\u0426H-\u0426h-\u0421H-\u0421h-\u0428H-\u0428h-\u044a"+String.fromCharCode(35)+"-\u044c"+String.fromCharCode(39)+"-\u0419E-\u0419e-\u0419U-\u0419u-\u0419A-\u0419a-\u042bA-\u042ba-\u044bo-\u0439o-\u0437h-\u0446h-\u0441h-\u0448h-\u0439e-\u0439u-\u0439a-\u044ba").split("-");
var rus_lr1="\u0410-\u0411-\u0412-\u0413-\u0414-\u0415-\u0417-\u0418-\u0419-\u041a-\u041b-\u041c-\u041d-\u041e-\u041f-\u0420-\u0421-\u0422-\u0423-\u0424-\u0425-\u0425-\u0426-\u0429-\u042b-\u042f-\u0430-\u0431-\u0432-\u0433-\u0434-\u0435-\u0437-\u0438-\u0439-\u043a-\u043b-\u043c-\u043d-\u043e-\u043f-\u0440-\u0441-\u0442-\u0443-\u0444-\u0445-\u0445-\u0446-\u0449-\u044a-\u044b-\u044c-\u044c-\u044f".split("-");
var lat_lr1=("A-B-V-G-D-E-Z-I-J-K-L-M-N-O-P-R-S-T-U-F-H-X-C-W-Y-Q-a-b-v-g-d-e-z-i-j-k-l-m-n-o-p-r-s-t-u-f-h-x-c-w-"+String.fromCharCode(35)+"-y-"+String.fromCharCode(39)+"-"+String.fromCharCode(96)+"-q").split("-");

function setFieldName(which)
{
    if (which != selField)
    {
        selField = which;

    }
};

function emoticon(theSmilie)
{
	doInsert(" " + theSmilie + " ", "", false);
};

function pagebreak()
{
	doInsert("{PAGEBREAK}", "", false);
};

function simpletag(thetag)
{

	doInsert("[" + thetag + "]", "[/" + thetag + "]", true);

};

function DLEimagePrompt( d, callback ){

	var b = {};
    var urlvalue = '';
    var urltitle = '';

	if( d.indexOf("http://") != -1 || d.indexOf("https://") != -1 ) {
		urlvalue = d;
		urltitle = '';
	} else {
		urlvalue = 'http://';
		urltitle = d;	
	}

	b[dle_act_lang[3]] = function() { 
					$(this).dialog("close");						
			    };

	b[dle_act_lang[2]] = function() { 
					if ( $("#dle-promt-text").val().length < 1) {
						 $("#dle-promt-text").addClass('ui-state-error');
					} else {
						var imageurl = $("#dle-promt-text").val();
						var imagealt = $("#dle-image-alt").val();
						var imagealign = $("#dleimagealign").val();
						$(this).dialog("close");
						$("#dlepopup").remove();
						if( callback ) callback( imageurl, imagealt, imagealign );	
					}				
				};

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' title='" + dle_prompt + "' style='display:none'>"+ text_enter_image +"<br /><input type='text' name='dle-promt-text' id='dle-promt-text' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + urlvalue + "'/><br /><br />"+ text_alt_image +"<br /><input type='text' name='dle-image-alt' id='dle-image-alt' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + urltitle + "'/><br /><br />"+img_align+"&nbsp;"+img_align_sel+"</div>");

	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		dialogClass: "dle-popup-imageinsert",
		buttons: b
	});

};

function DLEurlPrompt( d, callback ){

	var b = {};
    var urlvalue = '';
    var urltitle = '';

	if( d.indexOf("http://") != -1 || d.indexOf("https://") != -1 || d.indexOf("ftp://") != -1) {
		urlvalue = d;
		urltitle = d;
	} else {
		urlvalue = 'http://';
		urltitle = d;	
	}

	b[dle_act_lang[3]] = function() { 
					$(this).dialog("close");						
			    };

	b[dle_act_lang[2]] = function() { 
					if ( $("#dle-promt-url").val().length < 1) {
						 $("#dle-promt-url").addClass('ui-state-error');
					} else if ($("#dle-promt-title").val().length < 1) {
						 $("#dle-promt-title").addClass('ui-state-error');
					} else {
						var dleurl = $("#dle-promt-url").val();
						var dleurltitle = $("#dle-promt-title").val();
						var dleurltooltip = $("#dle-promt-tooltip").val();
						$(this).dialog("close");
						$("#dlepopup").remove();
						if( callback ) callback( dleurl, dleurltitle, dleurltooltip);	
					}				
				};

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' title='" + dle_prompt + "' style='display:none'>"+ text_enter_url +"<br /><input type='text' name='dle-promt-url' id='dle-promt-url' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + urlvalue + "'/><br /><br />"+ text_enter_url_name +"<br /><input type='text' name='dle-promt-title' id='dle-promt-title' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + urltitle + "'/><br /><br />"+ text_enter_tooltip +"<br /><input type='text' name='dle-promt-tooltip' id='dle-promt-tooltip' class='ui-widget-content ui-corner-all' style='width:97%;' value=''/></div>");

	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		dialogClass: "dle-popup-urlinsert",
		buttons: b
	});

};

function tag_url()
{
	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='My Webpage';
    }

	DLEurlPrompt(thesel, function (dleurl, dleurltitle, dleurltooltip) {

		if( dleurltooltip.length > 0 ) {
			dleurl = dleurl + '|' + dleurltooltip;
		}
	
		doInsert("[url="+dleurl+"]"+dleurltitle+"[/url]", "", false);

		ie_range_cache = null;

	});
}

function tag_leech()
{
	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='My Webpage';
    }

	DLEurlPrompt(thesel, function (dleurl, dleurltitle, dleurltooltip) {
		
		if( dleurltooltip.length > 0 ) {
			dleurl = dleurl + '|' + dleurltooltip;
		}
		
		doInsert("[leech="+dleurl+"]"+dleurltitle+"[/leech]", "", false);

		ie_range_cache = null;

	});
};

function tag_youtube()
{
	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='http://';
    }

	DLEprompt(text_enter_url, thesel, dle_prompt, function (r) {

		doInsert("[media="+r+"]", "", false);
		ie_range_cache = null;
	
	});
};

function tag_flash()
{

	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='http://';
    }

	DLEprompt(text_enter_flash, thesel, dle_prompt, function (r) {

		var enterURL = r;

		DLEprompt(text_enter_size, "425,264", dle_prompt, function (r) {

			doInsert("[flash="+r+"]"+enterURL+"[/flash]", "", false);
			ie_range_cache = null;
	
		});

	});

};

function tag_list(type)
{

	list_open_tag = type == 'ol' ? '[ol=1]\n' : '[list]\n';
	list_close_tag = type == 'ol' ? '[/ol]' : '[/list]';
	listitems = '';

	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='';
    }

	insert_list( thesel );

};

function insert_list( thesel )
{
	DLEprompt(text_enter_list, thesel, dle_prompt, function (r) {

		if (r != '') {

			listitems += '[*]' + r + '\n';
			insert_list('');

		} else {

			if( listitems )
			{
				doInsert(list_open_tag + listitems + list_close_tag, "", false);
				ie_range_cache = null;
			}
		}

	}, true);

};

function tag_image()
{

	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='http://';
    }

	DLEimagePrompt(thesel, function (imageurl, imagealt, imagealign) {

		var imgoption = "";

		if (imagealt != "") { 

			imgoption = "|"+imagealt;

		}

		if (imagealign != "" && imagealign != "center") { 

			imgoption = imagealign+imgoption;

		}

		if (imgoption != "" ) {

			imgoption = "="+imgoption;

		}

		if (imagealign == "center") {
			doInsert("[center][img"+imgoption+"]"+imageurl+"[/img][/center]", "", false);
		}
		else {
			doInsert("[img"+imgoption+"]"+imageurl+"[/img]", "", false);
		}

		ie_range_cache = null;

	});

};

function tag_video()
{
	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='http://';
    }

	DLEvideoPrompt(thesel, function (url, poster, descr) {
		var videolink = url;

		if (poster != "" || descr != "" ) { 
			videolink += '|' + poster;
		}
		
		if (descr != "" ) { 
			videolink += '|' + descr;
		}
		
		if(videolink != "" && videolink != "http://") {
			playlist += videolink;
		}else if(playlist != "") {
			playlist = playlist.substring(0, playlist.length - 1);
		}
		
		if (playlist != "" ) {
			doInsert("[video="+playlist+"]", "", false);
		}
		ie_range_cache = null;
		playlist = '';
	
	});
};

function DLEvideoPrompt( d, callback ){

	var b = {};

	if( d.indexOf("http://") != -1 || d.indexOf("https://") != -1) {
		urlvalue = d;
	} else {
		urlvalue = 'http://';
	}
	
	b[dle_act_lang[3]] = function() { 
		$(this).dialog("close");
	};

	b[button_addplaylist] = function() { 
		var videourl = $("#dle-promt-url").val();
		var videoposter = $("#dle-promt-poster").val();
		var videodescr = $("#dle-promt-descr").val();
		
		var videolink = videourl;

		if (videoposter != "" || videodescr != "" ) { 
			videolink += '|' + videoposter;
		}
		
		if (videodescr != "" ) { 
			videolink += '|' + videodescr;
		}
		
		if (videolink != "" && videolink != "http://") {
			playlist +=  videolink + ',';
		}
		
		$("#dle-promt-url").val('http://');
		$("#dle-promt-poster").val('');
		$("#dle-promt-descr").val('');

	};
	
	b[button_insert] = function() { 
		var videourl = $("#dle-promt-url").val();
		var videoposter = $("#dle-promt-poster").val();
		var videodescr = $("#dle-promt-descr").val();
		$(this).dialog("close");
		$("#dlepopup").remove();
		if( callback ) callback( videourl, videoposter, videodescr );	
	};

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' title='" + dle_prompt + "' style='display:none'>"+ text_url_video +"<br /><input type='text' name='dle-promt-url' id='dle-promt-url' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + urlvalue + "'/><br /><br />"+ text_descr +"<br /><input type='text' name='dle-promt-descr' id='dle-promt-descr' class='ui-widget-content ui-corner-all' style='width:97%;' value=''/><br /><br />"+ text_url_poster +"<br /><input type='text' name='dle-promt-poster' id='dle-promt-poster' class='ui-widget-content ui-corner-all' style='width:97%;' value=''/>");
	
	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		buttons: b
	});

	$("#dle-promt-url").select().focus();
};

function tag_audio()
{
	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel ='http://';
    }

	DLEaudioPrompt(thesel, function (url, descr) {
		var audiolink = url;
		
		if (descr != "" ) { 
			audiolink += '|' + descr;
		}
		
		if(audiolink != "" && audiolink != "http://") {
			playlist += audiolink;
		}else if(playlist != "") {
			playlist = playlist.substring(0, playlist.length - 1);
		}
		
		if (playlist != "" ) {
			doInsert("[audio="+playlist+"]", "", false);
		}
		ie_range_cache = null;
		playlist = '';
	
	});
	
}

function DLEaudioPrompt( d, callback ){

	var b = {};

	if( d.indexOf("http://") != -1 || d.indexOf("https://") != -1) {
		urlvalue = d;
	} else {
		urlvalue = 'http://';
	}
	
	b[dle_act_lang[3]] = function() { 
		$(this).dialog("close");
	};

	b[button_addplaylist] = function() { 
		var videourl = $("#dle-promt-url").val();
		var videodescr = $("#dle-promt-descr").val();
		
		var videolink = videourl;
		
		if (videodescr != "" ) { 
			videolink += '|' + videodescr;
		}
		
		if (videolink != "" && videolink != "http://") {
			playlist +=  videolink + ',';
		}
		
		$("#dle-promt-url").val('http://');
		$("#dle-promt-descr").val('');

	};
	
	b[button_insert] = function() { 
		var videourl = $("#dle-promt-url").val();
		var videodescr = $("#dle-promt-descr").val();
		$(this).dialog("close");
		$("#dlepopup").remove();
		if( callback ) callback( videourl, videodescr );	
	};

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' title='" + dle_prompt + "' style='display:none'>"+ text_url_audio +"<br /><input type='text' name='dle-promt-url' id='dle-promt-url' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + urlvalue + "'/><br /><br />"+ text_descr +"<br /><input type='text' name='dle-promt-descr' id='dle-promt-descr' class='ui-widget-content ui-corner-all' style='width:97%;' value=''/>");
	
	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		buttons: b
	});

	$("#dle-promt-url").select().focus();
};

function tag_email()
{
	var thesel = get_sel(eval('fombj.'+ selField));
		
	if (!thesel) {
		   thesel ='';
	}

	DLEprompt(text_enter_email, thesel, dle_prompt, function (r) {

		doInsert("[email="+r+"]"+r+"[/email]", "", false);
		ie_range_cache = null;
	
	});
};

function show_bb_dropdown(obj)
{
	$(obj).blur(function(){
		$(obj).next().fadeOut();
	});

	$(obj).next().show().css({'position' : 'absolute', top:0, left:0}).position({
		my: "left top",
		at: "left bottom",
		of: $(obj),
		collision: "fit flip"
	});
	
};

function insert_header(value) {
	
	doInsert("[h" +value+ "]", "[/h" +value+ "]", true );
	ie_range_cache = null;
	
};

function doInsert(ibTag, ibClsTag, isSingle) {
	var isClose = false;
	var obj_ta = eval('fombj.'+ selField);
	
	if (typeof obj_ta == "undefined") {
		var obj_ta = eval('fombj.'+ $(".bb-pane").nextAll("textarea").first().attr('id'));
	}
	
	if (typeof obj_ta == "undefined") {
		return false;
	}
	
	obj_ta.focus();

 	if ( obj_ta.selectionEnd != null ) { 
		var ss = obj_ta.selectionStart;
		var st = obj_ta.scrollTop;
		var es = obj_ta.selectionEnd;
		
		var start  = (obj_ta.value).substring(0, ss);
		var middle = (obj_ta.value).substring(ss, es);
		var end    = (obj_ta.value).substring(es, obj_ta.textLength);
		var left_indent = 0;

		if(!isSingle) {
			middle = "";
		} else {
			if(ibClsTag != "" && middle == "" ) {
				left_indent = ibClsTag.length;
			}
		}
		
		if (obj_ta.selectionEnd - obj_ta.selectionStart > 0)
		{
			middle = ibTag + middle + ibClsTag;
		}
		else
		{
			middle = ibTag + middle + ibClsTag;
		}
		
		obj_ta.value = start + middle + end;
		
		var cpos = ss + (middle.length) - left_indent;
		
		obj_ta.selectionStart = cpos;
		obj_ta.selectionEnd   = cpos;
		obj_ta.scrollTop      = st;


	} else if ( is_ie ) {

		if (obj_ta.isTextEdit) {

			var sel = document.selection;
			var rng = ie_range_cache ? ie_range_cache : sel.createRange();
			rng.colapse;
			if((sel.type == "Text" || sel.type == "None") && rng != null)
			{
				if(ibClsTag != "" && rng.text.length > 0)
					ibTag += rng.text + ibClsTag;
				else if(isSingle)
					ibTag += rng.text + ibClsTag;
	
				rng.text = ibTag;
			}

		} else {
				obj_ta.value += ibTag + ibClsTag;
		}
		
		rng.select();
	    ie_range_cache = null;

	} else {
		obj_ta.value += ibTag + ibClsTag;
	}

	return isClose;
};

function setColor(color)
{
		doInsert("[color=" +color+ "]", "[/color]", true );
		ie_range_cache = null;

};

function dle_smiley ( text ){
	doInsert(' ' + text + ' ', '', false);

	ie_range_cache = null;
};

function pagelink()
{

	var thesel = get_sel(eval('fombj.'+ selField));

    if (!thesel) {
        thesel = text_pages;
    }

	DLEprompt(text_enter_page, "1", dle_prompt, function (r) {

		var enterURL = r;

		DLEprompt(text_enter_page_name, thesel, dle_prompt, function (r) {

			doInsert("[page="+enterURL+"]"+r+"[/page]", "", false);
			ie_range_cache = null;
	
		});

	});
};

function translit()
{
	var obj_ta = eval('fombj.'+ selField);

	if ( is_ie ) {

		if (obj_ta.isTextEdit) {

			obj_ta.focus();
			var sel = document.selection;
			var rng = sel.createRange();
			rng.colapse;

			if((sel.type == "Text" || sel.type == "None") && rng != null) {
				rng.text = dotranslate(rng.text);
			}
		} else {

			obj_ta.value = dotranslate(obj_ta.value);
		}

	} else {
		obj_ta.value = dotranslate(obj_ta.value);
	}

	obj_ta.focus();

	return;
};

function dotranslate(text)
{
    var txtnew = "";
    var symb = 0;
    var subsymb = "";
    var trans = 1;
    for (kk=0;kk<text.length;kk++)
    {
        subsymb = text.substr(kk,1);
        if ((subsymb=="[") || (subsymb=="<"))
        {
            trans = 0;
        }
        if ((subsymb=="]") || (subsymb==">"))
        {
            trans = 1;
        }
        if (trans)
        {
            symb = transsymbtocyr(txtnew.substr(txtnew.length-1,1), subsymb);
        }
        else
        {
            symb = txtnew.substr(txtnew.length-1,1) + subsymb;
        }
        txtnew = txtnew.substr(0,txtnew.length-1) + symb;
    }
    return txtnew;
};

function transsymbtocyr(pretxt,txt)
{
	var doubletxt = pretxt+txt;
	var code = txt.charCodeAt(0);
	if (!(((code>=65) && (code<=123))||(code==35)||(code==39))) return doubletxt;
	var ii;
	for (ii=0; ii<lat_lr2.length; ii++)
	{
		if (lat_lr2[ii]==doubletxt) return rus_lr2[ii];
	}
	for (ii=0; ii<lat_lr1.length; ii++)
	{
		if (lat_lr1[ii]==txt) return pretxt+rus_lr1[ii];
	}
	return doubletxt;
};

function insert_font(value, tag)
{
    if (value == 0)
    {
    	return;
	}
	
	doInsert("[" +tag+ "=" +value+ "]", "[/" +tag+ "]", true );
	ie_range_cache = null;

};

function get_sel(obj)
{

 if (document.selection) 
 {
   if ( is_ie )
   {
		document.getElementById(selField).focus();
		ie_range_cache = document.selection.createRange();
   }

   var s = document.selection.createRange();

   if (s.text)
   {
	 return s.text;
   }
 }
 else if (typeof(obj.selectionStart)=="number")
 {
   if (obj.selectionStart!=obj.selectionEnd)
   {
     var start = obj.selectionStart;
     var end = obj.selectionEnd;
	 return (obj.value.substr(start,end-start));
   }
 }

 return false;

};
function dle_image_upload(name, id)
{

	document.getElementById(selField).focus();

	if ( is_ie )
	{
		ie_range_cache = document.selection.createRange();
	}

	$("#dle_emo").remove();
	$("#cp").remove();
	$("#dlepopup").remove();

	media_upload ( selField, name, id, 'no');

}
function tag_typograf() {
	$('#' + selField).val(dletp.execute(document.getElementById( selField ).value));
};