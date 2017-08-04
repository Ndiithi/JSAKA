var selectedKey=''
var subscribeSiteSet=new Set();
var unSubscribeSiteSet=new Set();
var sitesMap=new HashTable(3);


var subscribeKeywordSet=new Set();
var unsubscribeKeywordSet=new Set();
var keywordsMap=new HashTable(3);
var siteKeywordMap=new HashTable(3);



$(document).ready(function(){

	fetchAllSites();
	fetchAllKeywords();
	
	addBtnEvents();
	//add event on edit button for selected item
	$("button.edit-keyword").click(function (event) {
		$("div#edit-modal").modal('hide');
		var newKeyword=$("input.edit-keyword").val();
		editUrl='/edit-keyword/'+newKeyword+'/'+selectedKey+'/';
		$.ajax({
            type: 'PUT', // define the type of HTTP verb we want to use
            url: editUrl, // the url where we want to POST 
            encode: true,
            success: function (data, textStatus, jqXHR) {
                console.log("submit Successfully");
                $("div.alert").removeClass("alert-danger");
                $("div.alert").addClass("alert-success");
                $("p.messageFeedback").text("Edit successfull");
                closeAlert();
                fetchAllKeywords();
            },
            error: function (response, request) {
            	$("div.alert").removeClass("alert-success");
            	$("div.alert").addClass("alert-danger");
                var parsed_data = response.responseText;
                $("p.messageFeedback").text(parsed_data);
                closeAlert();
            }

        });
		
		
	});
	
	//add event on delete button for selected item
	$("button.delete-keyword").click(function (event) {
		$("div#delete-modal").modal('hide');
		var delUrl='/delete-keyword/'+selectedKey+'/';
		$.ajax({
            type: 'DELETE', // define the type of HTTP verb we want to use 
            url: delUrl, // the url where we want to POST 
            encode: true,
            success: function (data, textStatus, jqXHR) {
                console.log("submit Successfully");
                $("div.alert").removeClass("alert-danger");
                $("div.alert").addClass("alert-success");
                $("p.messageFeedback").text("Delete successfully");
                closeAlert();
                fetchAllKeywords();
            },
            error: function (response, request) {
            	$("div.alert").removeClass("alert-success");
            	$("div.alert").addClass("alert-danger");
                var parsed_data = response.responseText;
                $("p.messageFeedback").text(parsed_data);
                closeAlert();
            }

        });
	});
	
	//add event on add button for new item
	$("button.save-keyword").click(function (event) {
		$("div#new-keyword-modal").modal('hide');
		var newKeyword=$("input#new-keyword").val();
		var formData = {
            "keyword":newKeyword
        };
		
		$.ajax({
            type: 'POST', // define the type of HTTP verb we want to use 
            url: '/add-keyword/', // the url where we want to POST 
            data: formData, // our data object
            encode: true,
            success: function (data, textStatus, jqXHR) {
                console.log("submit Successfully");
                $("div.alert").addClass("alert-success");
                $("p.messageFeedback").text("Created successfully");
                closeAlert();
                fetchAllKeywords();
            },
            error: function (response, request) {
            	$("div.alert").removeClass("alert-success");
            	$("div.alert").addClass("alert-danger");
                var parsed_data = response.responseText;
                $("p.messageFeedback").text(parsed_data);
                closeAlert();
            }

        });
		
		
	});
	
	//add event to list of subscribe site.
	$(".nonsubscribed-sites").click(function (event) {
		$(event.target).toggleClass("select-item");
		$(event.target).toggleClass("item-list"); 
		var bool=$("#"+event.target.id).hasClass("select-item");
		if(bool) subscribeSiteSet.add(event.target.id);
		else subscribeSiteSet.remove(event.target.id);
		subscribeSiteSet.print();
	});

	
	//add event to list of unsubscribe site.
	$(".subscribed-sites").click(function (event) {
		$(event.target).toggleClass("select-item");
		$(event.target).toggleClass("item-list"); 
		
		var bool=$("#"+event.target.id).hasClass("select-item");
		if(bool) unSubscribeSiteSet.add(event.target.id);
		else unSubscribeSiteSet.remove(event.target.id);
		
		if(unSubscribeSiteSet.length()!=0){
			$(".keywordSection").css("display","");
		}else{
			$(".keywordSection").css("display","none");
		    $(".keywordSection").fadeTo(300, 500).slideUp(500, function () {
		    $(".keywordSection").slideUp(500);
		    });
		}
	});
	
	//add event to subscribe btn to add selected sites to subscription list
	$(".site-subscribe-btn").click(function (event) {
		jQuery.each(subscribeSiteSet.values,function(index, value){
			var siteName=sitesMap.search(value);
			$(".subscribed-sites").append("<li id="+value+">"+siteName+"</li>");
			$(".nonsubscribed-sites li#"+value).remove();
			unSubscribeSiteSet.remove(value);
			subscribeSiteSet.add(value);
		});
	});

	
	//add event to unsubscribe btn to remove selected sites from subscription list
	$(".site-unsubscribe-btn").click(function (event) {
		jQuery.each(unSubscribeSiteSet.values,function(index, value){
			var siteName=sitesMap.search(value);
			$(".subscribed-sites li#"+value).remove();
			$(".nonsubscribed-sites").append("<li id="+value+">"+siteName+"</li>");
			
			//unSubscribeSiteSet.add(value);
			//subscribeSiteSet.remove(value);
		});
	});
	
	

	
	//add event to list of nonsubscribe keywords list.
	$(".nonsubscribed-keywords").click(function (event) {
		$(event.target).toggleClass("select-item");
		$(event.target).toggleClass("item-list"); 
		var bool=$(event.target).hasClass("select-item");
		if(bool) subscribeKeywordSet.add(event.target.id);
		else unsubscribeKeywordSet.remove(event.target.id);
		subscribeKeywordSet.print();
	});

	
	//add event to list of unsubscribe site.
	$(".subscribed-keywords").click(function (event) {
		$(event.target).toggleClass("select-item");
		$(event.target).toggleClass("item-list"); 
		var bool=$(event.target).hasClass("select-item");
		if(bool) unsubscribeKeywordSet.add(event.target.id);
		else subscribeKeywordSet.remove(event.target.id);
		unsubscribeKeywordSet.print();
	});
	
	//add event to subscribe btn to add selected sites to subscription list
	$(".keyword-subscribe-btn").click(function (event) {
		jQuery.each(subscribeKeywordSet.values,function(index, value){
			var keywordName=keywordsMap.search(value);
			$(".nonsubscribed-keywords #"+value).remove();
			$(".subscribed-keywords").append("<li id="+value+">"+keywordName+"</li>");
			unsubscribeKeywordSet.empty();
			subscribeKeywordSet.empty();
		});
	});

	
	//add event to unsubscribe btn to remove selected keyword(s) from subscription list
	$(".keyword-unsubscribe-btn").click(function (event) {
		jQuery.each(unsubscribeKeywordSet.values,function(index, value){
			var keywordName=keywordsMap.search(value);
			$(".subscribed-keywords li#"+value).remove();
			$(".nonsubscribed-keywords").append("<li id="+value+">"+keywordName+"</li>");
			unsubscribeKeywordSet.empty();
			subscribeKeywordSet.empty();
		});
	});

	
	$(".new-subsription-btn").click(function (event) {
		var style=$("#site-keyword").css("display");
		if(style!=='none') {
			$("#site-keyword").css("display","none");
			$(".new-subsription-btn").html("<i class='fa fa-plus-circle' aria-hidden='true'></i>  Add new");
		}else {
			$("#site-keyword").css("display","block");
			$(".new-subsription-btn").html("<i class='fa fa-plus-circle' aria-hidden='true'></i>  Save subscription");
		}
	});

	
	
});






// add events for edit and delete buttons from the subscriptions table
function addBtnEvents(){
	 $("button.keyword").click(function (event) {
	    	console.log("Clicked id "+event.target.id);
	    	selectedKey=event.target.id;
	    	var keywordEl='td#'+selectedKey+'-keyword';
	    	console.log("keyword selector"+keywordEl)
	    	$('input.edit-keyword').val($(keywordEl).html());
	    	$('label.delete-keyword').html($(keywordEl).html());
	    	
	    });
	
}




function fetchAllKeywords(){
	
	$.ajax({
        type: 'GET', // define the type of HTTP verb we want to use
        url: '/getAllKeywords/', // the url where we want to POST
        dataType: 'json', // what type of data do we expect back from the server
        encode: true,
        success: function (data, textStatus, jqXHR) {
        	for(var i in data){
        		keywordsMap.add('keyword-'+i,data[i]);
        		
        		$(".nonsubscribed-keywords").append("<li id=keyword-"+i+">"+data[i]+"</li>");
        	}
        },
        error: function (data, textStatus, jqXHR) {

        	 $(".nonsubscribed-keywords").append("<li>We faced problems while loading available keywords. Kindly reload page</li>");

        }

    });
	
}

function fetchAllSites(){

	console.log("Fetching sites");
	$.ajax({
        type: 'GET', // define the type of HTTP verb we want to use
        url: '/getAllSites/', // the url where we want to POST
        dataType: 'json', // what type of data do we expect back from the server
        encode: true,
        success: function (data, textStatus, jqXHR) {
        	console.log(data);
        	for(var i in data){
        		sitesMap.add('site-'+i,data[i]);
        		$(".nonsubscribed-sites").append("<li id=site-"+i+">"+data[i]+"</li>");
        	}

        },
        error: function (data, textStatus, jqXHR) {

        	 $(".nonsubscribed-sites").append("<li>We faced problems while loading available sites. Kindly reload page</li>");

        }

    });
	
}



function  closeAlert() {
    $("#alerter").css('display', 'block');
    $("#alerter").fadeTo(3000, 500).slideUp(50, function () {
    $("#alerter").slideUp(50);
    });
}
