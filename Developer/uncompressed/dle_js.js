var c_cache        = [];
var dle_poll_voted = [];

function reload () {
	
	var rndval = new Date().getTime(); 
	
	document.getElementById('dle-captcha').innerHTML = '<img src="'+dle_root+'engine/modules/antibot/antibot.php?rndval=' + rndval + '" width="160" height="80" alt="" />';
	
};

function dle_change_sort(sort, direction){

  var frm = document.getElementById('news_set_sort');

  frm.dlenewssortby.value=sort;
  frm.dledirection.value=direction;

  frm.submit();
  return false;

};

function doPoll( event, news_id){

    var frm = document.getElementById('dlepollform_'+news_id);
	var dle_poll_result = frm.status.value;
	var vote_check = '';

  if (dle_poll_voted[news_id] == 1) { return; }

  if (event != 'results' && dle_poll_result != 1) {
    for (var i=0;i < frm.elements.length;i++) {
        var elmnt = frm.elements[i];
        if (elmnt.type=='radio') {
            if(elmnt.checked == true){ vote_check = elmnt.value; break;}
        }
        if (elmnt.type=='checkbox') {
            if(elmnt.checked == true){ vote_check = vote_check + elmnt.value + ' ';}
        }
    }

	if (event == 'vote' && vote_check == '') { return; }

	dle_poll_voted[news_id]  = 1;

  } else { dle_poll_result = 1; frm.status.value = 1; }

  if (dle_poll_result == 1 && event == 'vote') { dle_poll_result = 0; frm.status.value = 0; event = 'list'; }

  ShowLoading('');

  $.post(dle_root + "engine/ajax/controller.php?mod=poll", { news_id: news_id, action: event, answer: vote_check, dle_skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		$("#dle-poll-list-"+news_id).fadeOut(500, function() {
			$(this).html(data);
			$(this).fadeIn(500);
		});

  });

}

function IPMenu( m_ip, l1, l2, l3 ){

	var menu = [];
	
	menu[0]='<a href="https://www.nic.ru/whois/?searchWord=' + m_ip + '" target="_blank">' + l1 + '</a>';
	menu[1]='<a href="' + dle_root + dle_admin + '?mod=iptools&ip=' + m_ip + '" target="_blank">' + l2 + '</a>';
	menu[2]='<a href="' + dle_root + dle_admin + '?mod=blockip&ip=' + m_ip + '" target="_blank">' + l3 + '</a>';
	
	return menu;
};


function ajax_save_for_edit( news_id, event )
{
	var allow_br = 0;
	var news_txt = '';

	var params = {};

	if (quick_wysiwyg == "2") {

		tinyMCE.triggerSave();

	}

	$.each($('#ajaxnews'+news_id).serializeArray(), function(index,value) {

		params[value.name] = value.value;

	});

	params['id'] = news_id;
	params['field'] = event;
	params['action'] = "save";
	params['user_hash'] = dle_login_hash;

	ShowLoading('');

	$.post(dle_root + "engine/ajax/controller.php?mod=editnews", params, function(data){

		HideLoading('');

		if (data != "ok") {

			DLEalert ( data, dle_info );

		} else {

			$('#dlepopup-news-edit').dialog('close');
		    DLEconfirm( dle_save_ok, dle_confirm, function () {
				location.reload(true);
			} );

		}

	});

	return false;
};

function ajax_prep_for_edit( news_id, event )
{
	for (var i = 0, length = c_cache.length; i < length; i++) {
	    if (i in c_cache) {
			if ( c_cache[ i ] || c_cache[ i ] != '' )
			{
				ajax_cancel_comm_edit( i );
			}
	    }
	}

	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=editnews", { id: news_id, field: event, action: "edit" }, function(data){

		HideLoading('');
		var shadow = 'none';

		$('#modal-overlay').remove();

		$('body').prepend('<div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #666666; opacity: .40;filter:Alpha(Opacity=40); z-index: 999; display:none;"></div>');
		$('#modal-overlay').css({'filter' : 'alpha(opacity=40)'}).fadeIn();

		var b = {};
	
		b[dle_act_lang[3]] = function() { 
			$(this).dialog('close');	
		};
	
		b[dle_act_lang[4]] = function() { 
			ajax_save_for_edit( news_id, event );			
		};
	
		$('#dlepopup-news-edit').remove();
						
		$('body').prepend("<div id='dlepopup-news-edit' class='dlepopupnewsedit' title='"+menu_short+"' style='display:none'></div>");

		$('.dlepopupnewsedit').html('');
		
		var wh = $(window).height() * 0.9;
		var ww = $(window).width() * 0.9;
		
		if(ww > 1024) { ww=1024; }
		
		$('#dlepopup-news-edit').dialog({
			autoOpen: true,
			width: ww,
			height: wh,
			buttons: b,
			resizable: false,
			dialogClass: "modalfixed dle-popup-quickedit",
			dragStart: function(event, ui) {
				shadow = $(".modalfixed").css('box-shadow');
				$(".modalfixed").css('box-shadow', 'none');
			},
			dragStop: function(event, ui) {
				$(".modalfixed").css('box-shadow', shadow);
			},
			close: function(event, ui) {
					$(this).dialog('destroy');
					$('#modal-overlay').fadeOut(function() {
			        $('#modal-overlay').remove();
			    });
			 }
		});

		if ($(window).width() > 830 && $(window).height() > 530 ) {
			$('.modalfixed.ui-dialog').css({position:"fixed"});
			$( '#dlepopup-news-edit').dialog( "option", "position", ['0','0'] );
		}
		
		$('#dlepopup-news-edit').css({overflow:"auto"});
		$('#dlepopup-news-edit').css({'overflow-x':"hidden"});
		
		$("#dlepopup-news-edit").html(data);

	}, 'html');

	return false;
};


function ajax_comm_edit( c_id, area )
{

	for (var i = 0, length = c_cache.length; i < length; i++) {
	    if (i in c_cache) {
			if ( c_cache[ i ] != '' )
			{
				ajax_cancel_comm_edit( i );
			}
	    }
	}

	if ( ! c_cache[ c_id ] || c_cache[ c_id ] == '' )
	{
		c_cache[ c_id ] = $('#comm-id-'+c_id).html();
	}

	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=editcomments", { id: c_id, area: area, action: "edit" }, function(data){

		HideLoading('');

		$('#comm-id-'+c_id).html(data);

		setTimeout(function() {
           $("html,body").stop().animate({scrollTop: $("#comm-id-" + c_id).offset().top - 100}, 700);
        }, 100);

	}, 'html');
	return false;
};

function ajax_cancel_comm_edit( c_id )
{
	if ( c_cache[ c_id ] != "" )
	{
		$("#comm-id-"+c_id).html(c_cache[ c_id ]);
	}

	c_cache[ c_id ] = '';

	return false;
};

function ajax_save_comm_edit( c_id, area )
{

	if (dle_wysiwyg == "2") {

		tinyMCE.triggerSave();

	}

	var comm_txt = $('#dleeditcomments'+c_id).val();


	ShowLoading('');

	$.post(dle_root + "engine/ajax/controller.php?mod=editcomments", { id: c_id, comm_txt: comm_txt, area: area, action: "save", user_hash: dle_login_hash }, function(data){

		HideLoading('');
		c_cache[ c_id ] = '';
		$("#comm-id-"+c_id).html(data);

	});
	return false;
};

function DeleteComments(id, hash) {

    DLEconfirm( dle_del_agree, dle_confirm, function () {

		ShowLoading('');
	
		$.get(dle_root + "engine/ajax/controller.php?mod=deletecomments", { id: id, dle_allow_hash: hash }, function(r){
	
			HideLoading('');
	
			r = parseInt(r);
		
			if (!isNaN(r)) {
				var node = null;
				
				if( dle_tree_comm == '1') { node = $("#comments-tree-item-" + r); } else { node = $("#comment-id-" + r); }

				$("html,body").stop().animate({scrollTop: node.offset().top - 70}, 700);
		
				setTimeout(function() { node.hide('blind',{},1400);}, 700);
				
			}
	
		});

	} );

};

function MarkSpam(id, hash) {

    DLEconfirm( dle_spam_agree, dle_confirm, function () {

		ShowLoading('');
	
		$.get(dle_root + "engine/ajax/controller.php?mod=adminfunction", { id: id, action: 'commentsspam', user_hash: hash }, function(data){
	
			HideLoading('');
	
			if (data != "error") {
	
			    DLEconfirm( data, dle_confirm, function () {
					location.reload(true);
				} );
	
			}
	
		});

	} );

};

function doFavorites( fav_id, event, alert )
{
	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=favorites", { fav_id: fav_id, action: event, skin: dle_skin, alert: alert, user_hash: dle_login_hash }, function(data){

		HideLoading('');
		if( alert ) { 
			DLEalert(data, dle_info); 
		} else {
			$("#fav-id-" + fav_id).html(data);
		}


	});

	return false;
};

function CheckLogin()
{
	var name = document.getElementById('name').value;

	ShowLoading('');

	$.post(dle_root + "engine/ajax/controller.php?mod=registration", { name: name, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		$("#result-registration").html(data);

	});

	return false;
};

function doCalendar(month, year, effect){

	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=calendar", { month: month, year: year }, function(data){
		HideLoading('');

		if (effect == "left" ) {

			$("#calendar-layer").hide('slide',{ direction: "left" }, 500, function(){
				$("#calendar-layer").html(data).show('slide',{ direction: "right" }, 500);
			});

		} else {

			$("#calendar-layer").hide('slide',{ direction: "right" }, 500, function(){
				$("#calendar-layer").html(data).show('slide',{ direction: "left" }, 500);
			});

		}

	});
};


function doRate( rate, id ) {
	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=rating", { go_rate: rate, news_id: id, skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		if ( data.success ) {
			var rating = data.rating;

			rating = rating.replace(/&lt;/g, "<");
			rating = rating.replace(/&gt;/g, ">");
			rating = rating.replace(/&amp;/g, "&");

			$("#ratig-layer-" + id).html(rating);
			$("#vote-num-id-" + id).html(data.votenum);

		} else if (data.error) {
			
			DLEalert ( data.errorinfo, dle_info );
			
		}

	}, "json");
};

function doCommentsRate( rate, id ) {
	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=ratingcomments", { go_rate: rate, c_id: id, skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		if ( data.success ) {
			var rating = data.rating;

			rating = rating.replace(/&lt;/g, "<");
			rating = rating.replace(/&gt;/g, ">");
			rating = rating.replace(/&amp;/g, "&");

			$("#comments-ratig-layer-" + id).html(rating);
			$("#comments-vote-num-id-" + id).html(data.votenum);
			
		} else if (data.error) {
			
			DLEalert ( data.errorinfo, dle_info );
			
		}

	}, "json");
};

function ajax_cancel_reply(){
	
	$('#dlefastreplycomments').hide('blind',{},1400);
	
};

function ajax_fast_reply( id, indent){

	var comments = 	$('#comments'+id).val();
	var name = 	$('#name'+id).val();
	var mail = 	'';
	var editor_mode = '';
	var question_answer = $('#question_answer'+id).val();
	var sec_code = $('#sec_code'+id).val();
	var recaptcha = $('#recaptcha'+id).val();
	var allow_subscribe = $( '#subscribe'+id+':checked' ).val();
	var postid = 	$('#postid'+id).val();
	var g_recaptcha_response = '';
		
	if (name == '' || comments == '')
	{
		DLEalert ( dle_req_field, dle_info );
		return false;
	}

	if ( recaptcha ) {
		g_recaptcha_response = grecaptcha.getResponse(recaptcha_widget);
	}

	if (!allow_subscribe) {
		allow_subscribe = 0;
	}
		
	if (!sec_code) {
		sec_code = '';
	}
	
	if (!question_answer) {
		question_answer = '';
	}

	ShowLoading('');
	
	$.post(dle_root + "engine/ajax/controller.php?mod=addcomments", { post_id: postid, parent: id, indent: indent, comments: comments, name: name, mail: mail, editor_mode: editor_mode, skin: dle_skin, sec_code: sec_code, question_answer: question_answer, g_recaptcha_response: g_recaptcha_response, allow_subscribe: allow_subscribe, user_hash: dle_login_hash}, function(data){
	
		HideLoading('');
			
		$('#blind-animation'+id).remove();

		$('#dlefastreplyesponse').html(data);
	
		if (data != 'error' && document.getElementById('blind-animation'+id)) {

			$("html,body").stop().animate({scrollTop: $("#dlefastreplyesponse").offset().top - 100}, 600);
		
			setTimeout(function() { $('#blind-animation'+id).show('blind',{},700); $('#dlefastreplycomments').hide('blind',{},700);}, 600);
		}
	
	}, 'html');
		
	return false;
	
}

function DLESendPM( name ) {
	var b = {};
	
	$('#dlesendpmpopup').remove();
	$('#dleprofilepopup').remove();

	b[dle_act_lang[3]] = function() { 
		$(this).dialog('close');
	};

	b[dle_p_send] = function() {
		
		if (dle_wysiwyg == "2") {
			tinyMCE.triggerSave();
		}
		
		var subj = 	$('#pm_subj').val();
		var comments = 	$('#pm_text').val();
		var name = 	$('#pm_name').val();
		var question_answer = $('#pm_question_answer').val();	
		var sec_code = $('#sec_code_pm').val();
		var recaptcha = $('#pm_recaptcha').val();
		var outboxcopy = $( '#outboxcopy:checked' ).val();
		
		var g_recaptcha_response = '';
		
		if (name == '' || comments == '' || subj == '')
		{
			DLEalert ( dle_req_field, dle_info );
			return false;
		}
		
		if ( recaptcha ) {
			g_recaptcha_response = grecaptcha.getResponse(recaptcha_widget);
		}

		if (!outboxcopy) {
			outboxcopy = 0;
		}
		
		if (!sec_code) {
			sec_code = '';
		}
		if (!question_answer) {
			question_answer = '';
		}

		ShowLoading('');
	
		$.post(dle_root + "engine/ajax/controller.php?mod=pm", { action: 'send_pm', subj: subj, comments: comments, name: name, skin: dle_skin, sec_code: sec_code, question_answer: question_answer, g_recaptcha_response: g_recaptcha_response, outboxcopy: outboxcopy, user_hash: dle_login_hash}, function(data){
	
			HideLoading('');
			
			if ( data.success ) {
				$('#dlesendpmpopup').remove();
				DLEalert ( data.success, dle_info );
			} else if (data.error) {
				DLEalert ( data.error, dle_info );
			}
	
		}, 'json');
		
		return false;
	};
	
	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=pm", { name: name, action: 'show_send', skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		$('body').append(data);
			
		$('#dlesendpmpopup').dialog({
			autoOpen: true,
			width: 800,
			resizable: false,
			dialogClass: "modalfixed dle-popup-sendpm",
			buttons: b
		});
			
		$('.modalfixed.ui-dialog').css({position:"fixed"});
		$('#dlesendpmpopup').dialog( "option", "position", ['0','0'] );
		
	}, 'html');
	
	return false;

}

function dle_reply( id, indent, simple){
	var b = {};
	var editor_mode = '';
	
	$('#dlereplypopup').remove();
	
	if ( simple == '1' ) {
		$('#dlefastreplycomments').remove();
		$('#dlefastreplyesponse').remove();
	}
	
	b[dle_act_lang[3]] = function() { 
		$(this).dialog('close');
	};
	
	b[dle_p_send] = function() {
		
		if (dle_wysiwyg == "1" || dle_wysiwyg == "2") {
	
			if (dle_wysiwyg == "2") {
				tinyMCE.triggerSave();
			}
	
			editor_mode = 'wysiwyg';
	
		}
		
		var comments = 	$('#comments'+id).val();
		var name = 	$('#name'+id).val();
		var mail = 	$('#mail'+id).val();
		var question_answer = $('#question_answer'+id).val();
		var sec_code = $('#sec_code'+id).val();
		var recaptcha = $('#recaptcha'+id).val();
		var allow_subscribe = $( '#subscribe'+id+':checked' ).val();
		var postid = 	$('#postid'+id).val();
		var g_recaptcha_response = '';
		
		if (name == '' || comments == '')
		{
			DLEalert ( dle_req_field, dle_info );
			return false;
		}
		
		if ( recaptcha ) {
			g_recaptcha_response = grecaptcha.getResponse(recaptcha_widget);
		}

		if (!allow_subscribe) {
			allow_subscribe = 0;
		}
		
		if (!sec_code) {
			sec_code = '';
		}
		if (!question_answer) {
			question_answer = '';
		}

		ShowLoading('');
	
		$.post(dle_root + "engine/ajax/controller.php?mod=addcomments", { post_id: postid, parent: id, indent: indent, comments: comments, name: name, mail: mail, editor_mode: editor_mode, skin: dle_skin, sec_code: sec_code, question_answer: question_answer, g_recaptcha_response: g_recaptcha_response, allow_subscribe: allow_subscribe, user_hash: dle_login_hash}, function(data){
	
			HideLoading('');
			
			$('#blind-animation'+id).remove();
			
			if( $('#comments-tree-item-'+id).length ){

				$('#comments-tree-item-'+id).append(data);
				
				if (data != 'error' && document.getElementById('blind-animation'+id)) {
					$('#dlereplypopup').remove();
					$("html,body").stop().animate({scrollTop: $("#comments-tree-item-"+id).offset().top + $("#comments-tree-item-"+id).height() - 100}, 600);
			
					setTimeout(function() { $('#blind-animation'+id).show('blind',{},700);}, 600);
				}
			
			} else if($('#comment-id-'+id).length ) {
				
				$('#comment-id-'+id).append(data);

				if (data != 'error' && document.getElementById('blind-animation'+id)) {
					$('#dlereplypopup').remove();
					$("html,body").stop().animate({scrollTop: $("#comment-id-"+id).offset().top + $("#comment-id-"+id).height() - 100}, 600);
			
					setTimeout(function() { $('#blind-animation'+id).show('blind',{},700);}, 600);
				}
				
			}
			

	
		}, 'html');
		
		return false;
	};
	
	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=replycomments", { id: id, indent: indent, skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		if ( simple == '1' ) {
			
			$('#comment-id-'+id).append("<div id='dlefastreplyesponse'></div><div id='dlefastreplycomments' style='display:none'></div>");
			
			$('#dlefastreplycomments').html(data);
			
			$("html,body").stop().animate({scrollTop: $("#comment-id-"+id).offset().top + $("#comment-id-"+id).height() - 100}, 600);
			
			setTimeout(function() { $('#dlefastreplycomments').show('blind',{},700);}, 600);
			
		} else {
			$('body').append("<div id='dlereplypopup' title='"+dle_reply_title+"' style='display:none'></div>");
			
			$('#dlereplypopup').html(data);
			
			$('#dlereplypopup').dialog({
				autoOpen: true,
				width: 800,
				resizable: false,
				dialogClass: "modalfixed dle-popup-replycomments",
				buttons: b
			});
			
			$('.modalfixed.ui-dialog').css({position:"fixed"});
			$('#dlereplypopup').dialog( "option", "position", ['0','0'] );
		}
		
	}, 'html');
	
	return false;
};

function doAddComments(){

	var form = document.getElementById('dle-comments-form');
	var editor_mode = '';
	var question_answer = '';
	var sec_code = '';
	var g_recaptcha_response= '';
	var allow_subscribe= "0";
	var mail = '';
	
	if (dle_wysiwyg == "1" || dle_wysiwyg == "2") {

		if (dle_wysiwyg == "2") {
			tinyMCE.triggerSave();
		}

		editor_mode = 'wysiwyg';

	}

	if (form.comments.value == '' || form.name.value == '')
	{
		DLEalert ( dle_req_field, dle_info );
		return false;
	}

	if ( form.question_answer ) {

	   question_answer = form.question_answer.value;

    }

	if ( form.sec_code ) {

	   sec_code = form.sec_code.value;

    }

	if ( typeof grecaptcha != "undefined"  ) {
	   g_recaptcha_response = grecaptcha.getResponse();
    }

	if ( form.allow_subscribe ) {

		if ( form.allow_subscribe.checked == true ) {
	
		   allow_subscribe= "1";

		}

    }

	if ( form.mail ) {

	   mail = form.mail.value;

    }

	ShowLoading('');

	$.post(dle_root + "engine/ajax/controller.php?mod=addcomments", { post_id: form.post_id.value, comments: form.comments.value, name: form.name.value, mail: mail, editor_mode: editor_mode, skin: dle_skin, sec_code: sec_code, question_answer: question_answer, g_recaptcha_response: g_recaptcha_response, allow_subscribe: allow_subscribe, user_hash: dle_login_hash}, function(data){

		HideLoading('');

		$('#dle-ajax-comments').html(data);

		if (data != 'error' && document.getElementById('blind-animation')) {

			$("html,body").stop().animate({scrollTop: $("#dle-ajax-comments").offset().top - 100}, 600);
	
			setTimeout(function() { $('#blind-animation').show('blind',{},700);}, 600);

			if ( form.sec_code ) {
	           form.sec_code.value = '';
	           reload();
		    }

			if ( typeof grecaptcha != "undefined" ) {
			   grecaptcha.reset();
		    }
		    
		}

	}, 'html');
	
	return false;

};

function isHistoryApiAvailable() {
    return !!(window.history && history.pushState);
};

function CommentsPage( cstart, news_id, url ) 
{
	ShowLoading('');


	$.get(dle_root + "engine/ajax/controller.php?mod=comments", { cstart: cstart, news_id: news_id, skin: dle_skin }, function(data){

		HideLoading('');

		if (!isNaN(cstart) && !isNaN(news_id)) {

			$('#dle-comm-link').off('click');

			$('#dle-comm-link').on('click', function() {
				CommentsPage( cstart, news_id );
				return false;
			});

		
		}

		scroll( 0, $("#dle-comments-list").offset().top - 100 );
	
		$("#dle-comments-list").html(data.comments); 
		$(".dle-comments-navigation").html(data.navigation); 

		if( isHistoryApiAvailable() ) {
			window.history.pushState(null, null, url);
		}


	}, "json");

	return false;
};

function dle_copy_quote(qname) 
{
	dle_txt= '';

	if (window.getSelection) 
	{
		dle_txt=window.getSelection();
	}
	else if (document.selection) 
	{
		dle_txt=document.selection.createRange().text;
	}
	if (dle_txt != "")
	{
		dle_txt='[quote='+qname+']'+dle_txt+'[/quote]';
	}
};

function dle_fastreply( name ) 
{
	if ( !document.getElementById('dle-comments-form') ) return false;

	var input=document.getElementById('dle-comments-form').comments;
	var finalhtml = "";
	
	if (dle_wysiwyg == "0" || dle_wysiwyg == "-1" ) {
		
		if (dle_wysiwyg == "0") {
			input.value += "[b]"+name+"[/b],"+"\n";
		} else {
			input.value += name+","+"\n";
		}
		
		input.focus();

	} else {
	
		finalhtml = "<b>"+name+"</b>,"+"<br />";
	
		if (dle_wysiwyg == "1") {
			$('#comments').froalaEditor('events.focus');
			$('#comments').froalaEditor('html.insert', finalhtml, true);
		} else {
			tinyMCE.execCommand('mceInsertContent', false, finalhtml);
		}
	}

	setTimeout(function() {
          $("html,body").stop().animate({scrollTop: $("#dle-comments-form").offset().top - 100}, 700);
    }, 100);
		
	return false;
};

function dle_ins( id ) 
{
	if ( !document.getElementById('dle-comments-form') ) return false;

	var input=document.getElementById('dle-comments-form').comments;
	var finalhtml = "";

	if( dle_txt != "" ) {

		if (dle_wysiwyg == "0" || dle_wysiwyg == "-1") {
	
			input.value += dle_txt+'\n';
			input.focus();

		} else {
	
			finalhtml = dle_txt+'<br />';
	
			if (dle_wysiwyg == "1") {
				$('#comments').froalaEditor('events.focus');
				$('#comments').froalaEditor('html.insert', finalhtml, true);
			} else {
				tinyMCE.execCommand('mceInsertContent', false, finalhtml);
			}
		}

		setTimeout(function() {
	          $("html,body").stop().animate({scrollTop: $("#dle-comments-form").offset().top - 100}, 700);
	    }, 100);

	} else {

		ShowLoading('');

		$.get(dle_root + "engine/ajax/controller.php?mod=quote", { id: id, user_hash: dle_login_hash }, function(data){

			HideLoading('');

			data = data.replace(/&lt;/g, "<");
			data = data.replace(/&gt;/g, ">");
			data = data.replace(/&amp;/g, "&");
			data = data.replace(/&quot;/g, '"');
			data = data.replace(/&#039;/g, "'");
			data = data.replace(/&#039;/g, "'");
			data = data.replace(/&#34;/g, '"');

			if (dle_wysiwyg == "0" || dle_wysiwyg == "-1") {
				
				input.value += data+'\n';
				input.focus();
	
			} else {
		
				finalhtml = data+'<br />';
	
				if (dle_wysiwyg == "1") {
					$('#comments').froalaEditor('events.focus');
					$('#comments').froalaEditor('html.insert', finalhtml, true);
				} else {
					tinyMCE.execCommand('mceInsertContent', false, finalhtml);
				}
			}

			setTimeout(function() {
		          $("html,body").stop().animate({scrollTop: $("#dle-comments-form").offset().top - 100}, 700);
		    }, 100);

		});

	}


	return false;

};

function ShowOrHide( id ) {

	  var item = $("#" + id);
	  var image = null;

	  if ( document.getElementById('image-'+ id) ) {

		image = document.getElementById('image-'+ id);

	  }

	var scrolltime = (item.height() / 200) * 1000;

	if (scrolltime > 3000 ) { scrolltime = 3000; }

	if (scrolltime < 250 ) { scrolltime = 250; }

	if (item.css("display") == "none") { 

		item.show('blind',{}, scrolltime );

		if (image) { image.src = dle_root + 'templates/'+ dle_skin + '/dleimages/spoiler-minus.gif';}

	} else {

		if (scrolltime > 2000 ) { scrolltime = 2000; }

		item.hide('blind',{}, scrolltime );
		if (image) { image.src = dle_root + 'templates/'+ dle_skin + '/dleimages/spoiler-plus.gif';}
	}

};


function ckeck_uncheck_all() {
    var frm = document.pmlist;
    for (var i=0;i<frm.elements.length;i++) {
        var elmnt = frm.elements[i];
        if (elmnt.type=='checkbox') {
            if(frm.master_box.checked == true){ elmnt.checked=false; }
            else{ elmnt.checked=true; }
        }
    }
    if(frm.master_box.checked == true){ frm.master_box.checked = false; }
    else{ frm.master_box.checked = true; }
};

function confirmDelete(url){

    DLEconfirm( dle_del_agree, dle_confirm, function () {
		document.location=url;
	} );
};

function setNewField(which, formname)
{
	if (which != selField)
	{
		fombj    = formname;
		selField = which;

	}
};

function dle_news_delete( id ){

		var b = {};
	
		b[dle_act_lang[1]] = function() { 
			$(this).dialog("close");						
		};

		if (allow_dle_delete_news) {

			b[dle_del_msg] = function() { 
				$(this).dialog("close");
	
				var bt = {};
						
				bt[dle_act_lang[3]] = function() { 
					$(this).dialog('close');						
				};
						
				bt[dle_p_send] = function() { 
					if ( $('#dle-promt-text').val().length < 1) {
						$('#dle-promt-text').addClass('ui-state-error');
					} else {
						var response = $('#dle-promt-text').val();
						$(this).dialog('close');
						$('#dlepopup').remove();
						$.post(dle_root + 'engine/ajax/controller.php?mod=message', { id: id, user_hash: dle_login_hash, text: response },
							function(data){
								if (data == 'ok') { document.location=dle_root + 'index.php?do=deletenews&id=' + id + '&hash=' + dle_login_hash; } else { DLEalert('Send Error', dle_info); }
						});
		
					}				
				};
						
				$('#dlepopup').remove();
						
				$('body').append("<div id='dlepopup' class='dle-promt' title='"+dle_notice+"' style='display:none'>"+dle_p_text+"<br /><br /><textarea name='dle-promt-text' id='dle-promt-text' class='ui-widget-content ui-corner-all' style='width:97%;height:100px;'></textarea></div>");
						
				$('#dlepopup').dialog({
					autoOpen: true,
					width: 500,
					resizable: false,
					dialogClass: "modalfixed dle-popup-newsdelete",
					buttons: bt
				});

				$('.modalfixed.ui-dialog').css({position:"fixed"});
				$('#dlepopup').dialog( "option", "position", ['0','0'] );
						
			};
		}
	
		b[dle_act_lang[0]] = function() { 
			$(this).dialog("close");
			document.location=dle_root + 'index.php?do=deletenews&id=' + id + '&hash=' + dle_login_hash;					
		};
	
		$("#dlepopup").remove();
	
		$("body").append("<div id='dlepopup' class='dle-promt' title='"+dle_confirm+"' style='display:none'><div id='dlepopupmessage'>"+dle_del_agree+"</div></div>");
	
		$('#dlepopup').dialog({
			autoOpen: true,
			width: 500,
			resizable: false,
			dialogClass: "modalfixed dle-popup-newsdelete",
			buttons: b
		});

		$('.modalfixed.ui-dialog').css({position:"fixed"});
		$('#dlepopup').dialog( "option", "position", ['0','0'] );


};

function MenuNewsBuild( m_id, event ){

var menu=[];

menu[0]='<a onclick="ajax_prep_for_edit(\'' + m_id + '\', \'' + event + '\'); return false;" href="#">' + menu_short + '</a>';

if (dle_admin != '') {

	menu[1]='<a href="' + dle_root + dle_admin + '?mod=editnews&action=editnews&id=' + m_id + '" target="_blank">' + menu_full + '</a>';

}

if (allow_dle_delete_news) {

	menu[2]='<a onclick="sendNotice (\'' + m_id + '\'); return false;" href="#">' + dle_notice + '</a>';
	menu[3]='<a onclick="dle_news_delete (\'' + m_id + '\'); return false;" href="#">' + dle_del_news + '</a>';

}

return menu;
};

function sendNotice( id ){
	var b = {};

	b[dle_act_lang[3]] = function() { 
		$(this).dialog('close');						
	};

	b[dle_p_send] = function() { 
		if ( $('#dle-promt-text').val().length < 1) {
			$('#dle-promt-text').addClass('ui-state-error');
		} else {
			var response = $('#dle-promt-text').val();
			$(this).dialog('close');
			$('#dlepopup').remove();
			$.post(dle_root + 'engine/ajax/controller.php?mod=message', { id: id, user_hash: dle_login_hash, text: response, allowdelete: "no" },
				function(data){
					if (data == 'ok') { DLEalert(dle_p_send_ok, dle_info); }
				});

		}				
	};

	$('#dlepopup').remove();
					
	$('body').append("<div id='dlepopup' title='"+dle_notice+"' style='display:none'><br />"+dle_p_text+"<br /><br /><textarea name='dle-promt-text' id='dle-promt-text' class='ui-widget-content ui-corner-all' style='width:97%;height:100px;'></textarea></div>");
					
	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		dialogClass: "modalfixed dle-popup-sendmessage",
		buttons: b
	});

	$('.modalfixed.ui-dialog').css({position:"fixed"});
	$('#dlepopup').dialog( "option", "position", ['0','0'] );

};

function AddComplaint( id, action ){
	var b = {};

	b[dle_act_lang[3]] = function() { 
		$(this).dialog('close');						
	};

	b[dle_p_send] = function() { 
		if ( $('#dle-promt-text').val().length < 1) {
			$('#dle-promt-text').addClass('ui-state-error');
		} else {
			var response = $('#dle-promt-text').val();
			$(this).dialog('close');
			$('#dlepopup').remove();
			$.post(dle_root + 'engine/ajax/controller.php?mod=complaint', { id: id,  text: response, action: action, user_hash: dle_login_hash },
				function(data){
					if (data == 'ok') { DLEalert(dle_p_send_ok, dle_info); } else { DLEalert(data, dle_info); }
				});

		}				
	};

	$('#dlepopup').remove();
					
	$('body').append("<div id='dlepopup' title='"+dle_complaint+"' style='display:none'><br /><textarea name='dle-promt-text' id='dle-promt-text' class='ui-widget-content ui-corner-all' style='width:97%;height:100px;'></textarea></div>");
					
	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		dialogClass: "modalfixed dle-popup-complaint",
		buttons: b
	});

	$('.modalfixed.ui-dialog').css({position:"fixed"});
	$('#dlepopup').dialog( "option", "position", ['0','0'] );

};

function DLEalert(message, title){

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' class='dle-alert' title='" + title + "' style='display:none'>"+ message +"</div>");

	$('#dlepopup').dialog({
		autoOpen: true,
		width: 470,
		resizable: false,
		dialogClass: "modalfixed dle-popup-alert",
		buttons: {
			"Ok": function() { 
				$(this).dialog("close");
				$("#dlepopup").remove();							
			} 
		}
	});

	$('.modalfixed.ui-dialog').css({position:"fixed"});
	$('#dlepopup').dialog( "option", "position", ['0','0'] );
};

function DLEconfirm(message, title, callback){

	var b = {};

	b[dle_act_lang[1]] = function() { 
					$(this).dialog("close");
					$("#dlepopup").remove();						
			    };

	b[dle_act_lang[0]] = function() { 
					$(this).dialog("close");
					$("#dlepopup").remove();
					if( callback ) callback();					
				};

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' class='dle-confirm' title='" + title + "' style='display:none'>"+ message +"</div>");

	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		dialogClass: "modalfixed dle-popup-confirm",
		buttons: b
	});

	$('.modalfixed.ui-dialog').css({position:"fixed"});
	$('#dlepopup').dialog( "option", "position", ['0','0'] );
};

function DLEprompt(message, d, title, callback, allowempty){

	var b = {};

	b[dle_act_lang[3]] = function() { 
					$(this).dialog("close");						
			    };

	b[dle_act_lang[2]] = function() { 
					if ( !allowempty && $("#dle-promt-text").val().length < 1) {
						 $("#dle-promt-text").addClass('ui-state-error');
					} else {
						var response = $("#dle-promt-text").val()
						$(this).dialog("close");
						$("#dlepopup").remove();
						if( callback ) callback( response );	
					}				
				};

	$("#dlepopup").remove();

	$("body").append("<div id='dlepopup' class='dle-promt' title='" + title + "' style='display:none'>"+ message +"<br /><br /><input type='text' name='dle-promt-text' id='dle-promt-text' class='ui-widget-content ui-corner-all' style='width:97%;' value='" + d + "'/></div>");

	$('#dlepopup').dialog({
		autoOpen: true,
		width: 500,
		resizable: false,
		dialogClass: "modalfixed dle-popup-promt",
		buttons: b
	});

	$('.modalfixed.ui-dialog').css({position:"fixed"});
	$('#dlepopup').dialog( "option", "position", ['0','0'] );

	if (d.length > 0) {
		$("#dle-promt-text").select().focus();
	} else {
		$("#dle-promt-text").focus();
	}

};

var dle_user_profile = '';
var dle_user_profile_link = '';

function ShowPopupProfile( r, allowedit )
{
	var b = {};

	b[menu_profile] = function() { 
					document.location=dle_user_profile_link;						
			    };

	if (dle_group != 5) {

		b[menu_send] = function() {
			DLESendPM(dle_user_profile);
		};
	}

	if (allowedit == 1) {

		b[menu_uedit] = function() {
					$(this).dialog("close");

					var b1 = {};

					$('body').append('<div id="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #666666; opacity: .40;filter:Alpha(Opacity=40); z-index: 999; display:none;"></div>');
					$('#modal-overlay').css({'filter' : 'alpha(opacity=40)'}).fadeIn('slow');
				
					$("#dleuserpopup").remove();
					$("body").append("<div id='dleuserpopup' title='"+menu_uedit+"' style='display:none'></div>");

					b1[dle_act_lang[3]] = function() { 
											$(this).dialog("close");
											$("#dleuserpopup").remove();
							    };

				    b1[dle_act_lang[5]] = function() {
				      window.frames.edituserframe.confirmDelete(dle_login_hash);
				    };

					b1[dle_act_lang[4]] = function() { 
						document.getElementById('edituserframe').contentWindow.document.getElementById('saveuserform').submit();							
					};
				
					$('#dleuserpopup').dialog({
						autoOpen: true,
						show: 'fade',
						width: 700,
						resizable: false,
						dialogClass: "modalfixed dle-popup-userprofileadmin",
						buttons: b1,
						open: function(event, ui) {
							$("#dleuserpopup").html("<iframe name='edituserframe' id='edituserframe' width='100%' height='400' src='" + dle_root + dle_admin + "?mod=editusers&action=edituser&user=" + dle_user_profile + "&skin=" + dle_skin + "' frameborder='0' marginwidth='0' marginheight='0' allowtransparency='true'></iframe>");
						},
						beforeClose: function(event, ui) { 
							$("#dleuserpopup").html("");
						},
						close: function(event, ui) {
								$('#modal-overlay').fadeOut('slow', function() {
						        $('#modal-overlay').remove();
						    });
						 }
					});
			
					if ($(window).width() > 830 && $(window).height() > 530 ) {
						$('.modalfixed.ui-dialog').css({position:"fixed"});
						$('#dleuserpopup').dialog( "option", "position", ['0','0'] );
					}


			    };

	}

	$("#dleprofilepopup").remove();

	$("body").append(r);

	$('#dleprofilepopup').dialog({
		autoOpen: true,
		show: 'fade',
		hide: 'fade',
		resizable: false,
		dialogClass: "dle-popup-userprofile",
		buttons: b,
		width: 550
	});
	
	return false;
};

function ShowProfile( name, url, allowedit )
{

	if (dle_user_profile == name && document.getElementById('dleprofilepopup')) {$('#dleprofilepopup').dialog('open');return false;}

	dle_user_profile = name;
	dle_user_profile_link = url;

	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=profile", { name: name, skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		ShowPopupProfile( data, allowedit );

	});

	
	return false;
};

function FastSearch()
{
	$('#story').attr('autocomplete', 'off');
	$('#story').blur(function(){
		 	$('#searchsuggestions').fadeOut();
	});

	$('#story').keyup(function() {
		var inputString = $(this).val();

		if(inputString.length == 0) {
			$('#searchsuggestions').fadeOut();
		} else {

			if (dle_search_value != inputString && inputString.length > 3) {
				clearInterval(dle_search_delay);
				dle_search_delay = setInterval(function() { dle_do_search(inputString); }, 600);
			}

		}
	
	});
};

function dle_do_search( inputString )
{
	clearInterval(dle_search_delay);

	$('#searchsuggestions').remove();

	$("body").append("<div id='searchsuggestions' style='display:none'></div>");

	$.post(dle_root + "engine/ajax/controller.php?mod=search", {query: ""+inputString+"", user_hash: dle_login_hash}, function(data) {
			$('#searchsuggestions').html(data).fadeIn().css({'position' : 'absolute', top:0, left:0}).position({
				my: "left top",
				at: "left bottom",
				of: "#story",
				collision: "fit flip"
			});
		});

	dle_search_value = inputString;

};

function ShowLoading( message )
{

	$('#loading-layer').remove();

	$('body').append("<div id='loading-layer' style='display:none'></div>");

	if ( message )
	{
		$("#loading-layer").html(message);
	} else {
		$("#loading-layer").html(dle_act_lang[6]);
	}
		
	var setX = ( $(window).width()  - $("#loading-layer").width()  ) / 2;
	var setY = ( $(window).height() - $("#loading-layer").height() ) / 2;
			
	$("#loading-layer").css( {
		left : setX + "px",
		top : setY + "px",
		position : 'fixed',
		zIndex : '99'
	});
		
	$("#loading-layer").fadeTo('slow', 0.6);

};

function HideLoading( message )
{
	$("#loading-layer").fadeOut('slow', function() {
		$('#loading-layer').remove();
  		}
	);
};

function ShowAllVotes( )
{
	if (document.getElementById('dlevotespopup')) {$('#dlevotespopup').dialog('open');return false;}

	$.ajaxSetup({
	  cache: false
	});

	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=allvotes&dle_skin=" + dle_skin, function(data){

		HideLoading('');
		$("#dlevotespopup").remove();	
	
		$("body").append( data );

		$(".dlevotebutton").button();

			$('#dlevotespopup').dialog({
				autoOpen: true,
				show: 'fade',
				hide: 'fade',
				resizable: false,
				dialogClass: "dle-popup-allvotes",
				width: 600
			});

			if ($('#dlevotespopupcontent').height() > 400 ) {

				$('#dlevotespopupcontent').height(400);
				$('#dlevotespopup').dialog( "option", "height", $('#dlevotespopupcontent').height() + 60 );
				$('#dlevotespopup').dialog( "option", "position", 'center' );
			} else {

				$('#dlevotespopup').dialog( "option", "height", $('#dlevotespopupcontent').height() + 60 );
				$('#dlevotespopup').dialog( "option", "position", 'center' );

			}

	 });

	return false;
};

function fast_vote( vote_id )
{
	var vote_check = $('#vote_' + vote_id + ' input:radio[name=vote_check]:checked').val();
	
	if (typeof vote_check == "undefined") {
		return false;
	}
	
	ShowLoading('');

	$.get(dle_root + "engine/ajax/controller.php?mod=vote", { vote_id: vote_id, vote_action: "vote", vote_mode: "fast_vote", vote_check: vote_check, dle_skin: dle_skin, user_hash: dle_login_hash }, function(data){

		HideLoading('');

		$("#dle-vote_list-" + vote_id).fadeOut(500, function() {
			$(this).html(data);
			$(this).fadeIn(500);
		});

	});

	return false;
};

function AddIgnorePM( id, text ){

    DLEconfirm( text, dle_confirm, function () {

		ShowLoading('');
	
		$.get(dle_root + "engine/ajax/controller.php?mod=pm", { id: id, action: "add_ignore", skin: dle_skin, user_hash: dle_login_hash }, function(data){
	
			HideLoading('');
	
			DLEalert ( data, dle_info );
			return false;
		
	
		});

	} );
};

function DelIgnorePM( id, text ){

    DLEconfirm( text, dle_confirm, function () {

		ShowLoading('');
	
		$.get(dle_root + "engine/ajax/controller.php?mod=pm", { id: id, action: "del_ignore", skin: dle_skin, user_hash: dle_login_hash }, function(data){
	
			HideLoading('');
	
			$("#dle-ignore-list-" + id).html('');
			DLEalert ( data, dle_info );
			return false;
		
	
		});

	} );
};

function subscribe( id ){

	DLEconfirm( dle_sub_agree, dle_confirm, function () {	
		ShowLoading('');
		
		$.get(dle_root + "engine/ajax/controller.php?mod=commentssubscribe", { news_id: id, skin: dle_skin, user_hash: dle_login_hash }, function(data){
			
			HideLoading('');
			
			if ( data.success ) {
				DLEalert ( data.info, dle_info );
			} else if (data.error) {
				DLEalert ( data.errorinfo, dle_info );
			}
			
		}, "json");
	} );
	
	return false;
};

function media_upload ( area, author, news_id, wysiwyg){

		var rndval = new Date().getTime();
		var shadow = 'none';

		$('#mediaupload').remove();
		$('body').append("<div id='mediaupload' title='"+text_upload+"' style='display:none'></div>");
	
		$('#mediaupload').dialog({
			autoOpen: true,
			width: 710,
			resizable: false,
			dialogClass: "modalfixed dle-popup-upload",
			open: function(event, ui) { 
				$("#mediaupload").html("<iframe name='mediauploadframe' id='mediauploadframe' width='100%' height='550' src='"+dle_root+"engine/ajax/controller.php?mod=upload&area=" + area + "&author=" + author + "&news_id=" + news_id + "&wysiwyg=" + wysiwyg + "&skin=" + dle_skin + "&rndval=" + rndval + "' frameborder='0' marginwidth='0' marginheight='0' allowtransparency='true'></iframe>");
				$( ".ui-dialog" ).draggable( "option", "containment", "" );
			},
			dragStart: function(event, ui) {
				shadow = $(".modalfixed").css('box-shadow');
				$(".modalfixed").fadeTo(0, 0.6).css('box-shadow', 'none');
				$("#mediaupload").css('visibility', 'hidden');
			},
			dragStop: function(event, ui) {
				$(".modalfixed").fadeTo(0, 1).css('box-shadow', shadow);
				$("#mediaupload").css('visibility', 'visible');
			},
			beforeClose: function(event, ui) { 
				$("#mediaupload").html("");
			}
		});

		if ($(window).width() > 830 && $(window).height() > 530 ) {
			$('.modalfixed.ui-dialog').css({position:"fixed"});
			$('#mediaupload').dialog( "option", "position", ['0','0'] );
		}
		return false;

};

function dropdownmenu(obj, e, menucontents, menuwidth){

	if (window.event) event.cancelBubble=true;
	else if (e.stopPropagation) e.stopPropagation();

	var menudiv = $('#dropmenudiv');

	if (menudiv.is(':visible')) { clearhidemenu(); menudiv.fadeOut('fast'); return false; }

	menudiv.remove();

	$('body').append('<div id="dropmenudiv" style="display:none;position:absolute;z-index:100;width:165px;"></div>');

	menudiv = $('#dropmenudiv');

	menudiv.html(menucontents.join(""));

	if (menuwidth) menudiv.width(menuwidth);

	var windowx = $(document).width() - 30;
	var offset = $(obj).offset();

	if (windowx-offset.left < menudiv.width())
			offset.left = offset.left - (menudiv.width()-$(obj).width());

	menudiv.css( {
		left : offset.left + "px",
		top : offset.top+$(obj).height()+"px"
	});

	menudiv.fadeTo('fast', 0.9);

	menudiv.mouseenter(function(){
	      clearhidemenu();
	    }).mouseleave(function(){
	      delayhidemenu();
	});

	$(document).one("click", function() {
		hidemenu();
	});

	return false;
};

function hidemenu(e){
	$("#dropmenudiv").fadeOut("fast");
};

function delayhidemenu(){
	delayhide=setTimeout("hidemenu()",1000);
};

function clearhidemenu(){

	if (typeof delayhide!="undefined")
		clearTimeout(delayhide);
};

jQuery(function($){
	
		var hsloaded = false;
		var dlebannerids = new Array();
		
		$(document).keydown(function(event){
		    if (event.which == 13 && event.ctrlKey) {
		    	
		    	event.preventDefault();

				if (window.getSelection) {
					var selectedText = window.getSelection();
				}
				else if (document.getSelection) {
					var selectedText = document.getSelection();
				}
				else if (document.selection) {
					var selectedText = document.selection.createRange().text;
				}

				if (selectedText == "" ) { return false; }

				if (selectedText.toString().length > 255 ) { DLEalert(dle_big_text, dle_info); return false;}

				var b = {};
			
				b[dle_act_lang[3]] = function() { 
					$(this).dialog('close');						
				};
			
				b[dle_p_send] = function() { 
					if ( $('#dle-promt-text').val().length < 1) {
						$('#dle-promt-text').addClass('ui-state-error');
					} else {
						var response = $('#dle-promt-text').val();
						var selectedText = $('#orfom').text();
						$(this).dialog('close');

						$('#dlepopup').remove();

						$.post(dle_root + 'engine/ajax/controller.php?mod=complaint', { seltext: selectedText,  text: response, user_hash: dle_login_hash, action: "orfo", url: window.location.href },
							function(data){
								if (data == 'ok') {  DLEalert(dle_p_send_ok, dle_info); } else { DLEalert(data, dle_info); }
							});
			
					}				
				};
			
				$('#dlepopup').remove();
								
				$('body').append("<div id='dlepopup' class='dle-promt' title='"+dle_orfo_title+"' style='display:none'><textarea name='dle-promt-text' id='dle-promt-text' class='ui-widget-content ui-corner-all' style='width:97%;height:80px;'></textarea><div id='orfom' style='display:none'>"+selectedText+"</div></div>");
								
				$('#dlepopup').dialog({
					autoOpen: true,
					width: 600,
					resizable: false,
					dialogClass: "modalfixed dle-popup-complaint",
					buttons: b
				});
			
				$('.modalfixed.ui-dialog').css({position:"fixed"});
				$('#dlepopup').dialog( "option", "position", ['0','0'] );
				
		    };
			
		});
		
		setTimeout(function() {
			$("img[data-maxwidth]").each(function(){
				var width = $(this).width();
				var maxwidth =  $(this).data('maxwidth');

				if( $(this)[0].naturalWidth ) {
					width = $(this)[0].naturalWidth;
				}
				
				if (width > maxwidth) {
					$(this).width(maxwidth);
					
					$(this).wrap( '<a href="'+$(this).attr('src')+'" onclick="return hs.expand(this)"></a>' );
					
					if (typeof hs == "undefined" && hsloaded == false ) {
						hsloaded = true;
						$.getScript( dle_root + 'engine/classes/highslide/highslide.js', function() {
							hs.graphicsDir = dle_root + 'engine/classes/highslide/graphics/';
							hs.numberOfImagesToPreload = 0;
							hs.captionEval = 'this.thumb.alt';
							hs.showCredits = false;
							hs.align = 'center';
							hs.transitions = ['expand', 'crossfade'];
						});
					}
				}
			});
		}, 300);
		
		setTimeout(function() {
			$("div[data-dlebclicks]").each(function(){
				var id = $(this).data('dlebid');

				$(this).find('a').on('click', function() {
					$.post(dle_root + "engine/ajax/controller.php?mod=adminfunction", { 'id': id, action: 'bannersclick', user_hash: dle_login_hash });
				});

			});
		}, 400);

		$("div[data-dlebviews]").each(function(){
			dlebannerids.push($(this).data('dlebid'));
		});

		if(dlebannerids.length)	{
			setTimeout(function() {
				$.post(dle_root + "engine/ajax/controller.php?mod=adminfunction", { 'ids[]': dlebannerids, action: 'bannersviews', user_hash: dle_login_hash });
	        }, 1000);
		}
});