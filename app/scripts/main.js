$(document).ready(function(){

	'use strict';

	var cachingEnabled = false,
			keepCheckingForCaching = true,
			cacheAddress = 'http://localhost:1337/',
			currentDocuments = [],
			currentPage = 1,
			waitingForPages = 0,
			requests = [],
			checkForCachingServer = function(){

		console.log('checing for caching server...') ;

		$.ajax({
			url: cacheAddress,
			success: function(){
				console.log('caching = on') ;
				$('.cacheStatus').fadeIn() ;
				cachingEnabled = true ;
			},
			error: function(){

				console.log('caching not found') ;

				if(keepCheckingForCaching) {
					console.log('trying again') ;
					setTimeout(function(){
						checkForCachingServer() ;
					}, 1000) ;
				}

			}
		}) ;

	} ;

	checkForCachingServer() ;

	$('.openDropbox').click(function(){

		keepCheckingForCaching = false ;

		var numOfFiles = 0,
			fileNames = '' ;

		Dropbox.choose({
			success: function(files) {

				currentPage = 1 ;

				currentDocuments = [] ;

				$('.pdfs').html('') ;

				console.log(this, arguments) ;

				$.each(files, function(){

					numOfFiles++;

					var uniqueParts = this.link.replace('https://www.dropbox.com', ''),
						pdfUrl = 'https://dl.dropboxusercontent.com' + uniqueParts + '?token_hash=AAE5nMnBD0EXGKzQIDq9hn5IcY8BApGhlxFqhml882aXKg&dl=1',
						googleDocsViewer = 'https://docs.google.com/viewer?url=' + encodeURIComponent(pdfUrl) + '&embedded=true' ;

					console.log('gdoc url', googleDocsViewer) ;

					if(cachingEnabled){

						currentDocuments.push(googleDocsViewer) ;

					}
					else{

						$('.pdfs').append($('<iframe />').attr('src', googleDocsViewer)) ;

					}


					if(numOfFiles === 1) {
						fileNames = this.name ;
					}
					else {
						fileNames = fileNames + '<br>' + this.name ;
					}

					$('.status').html('Showing ' + numOfFiles + ' files') ;

				}) ;

				if(cachingEnabled) {

					$('.pagination').fadeIn() ;

					var $pageWrapper = $('<div />').addClass('page') ;
					$('.pdfs').append($pageWrapper) ;
	
					loadPage(currentPage) ;
	
				}

				$('.pdfs iframe, .pdfs img').css({ opacity: 1 / numOfFiles }) ;

				$('.status').tooltip({
					html: true,
					title: fileNames,
					placement: 'bottom'
				}) ;

			},
			multiselect: true
		});
	}) ;

	var loadPage = function(pageNumber) {

		stopAllRequests() ;

		waitingForPages = 0 ;

		console.log('loading page with ', currentDocuments) ;

		$('.page').html('') ;

		$.each(currentDocuments, function(){

			console.log('loading page ' + pageNumber + ' for ' + this) ;

			var pageLocation = cacheAddress + encodeURIComponent(this) + '/' + pageNumber,
					$page = $('<img />').attr('src', pageLocation) ;

			$('.page').append($page) ;

			waitingForPages++ ;

			$('.status').html('Waiting for ' + waitingForPages + ' documents to load.') ;

			$('.page img[src="' + pageLocation + '"]').load(function(){

				// console.log('loaded!', this) ;

				waitingForPages--;

				if(waitingForPages === 0){
					$('.status').html('All documents loaded') ;

					console.log('loading documents around this one') ;

					$.each(currentDocuments, function(){

						//pinging the next page so it will start caching
						requests.push($.ajax({
							url: cacheAddress + encodeURIComponent(this) + '/' + parseInt(pageNumber + 1, 10)
						})) ;

						//pinging the previous page so it will start caching
						requests.push($.ajax({
							url: cacheAddress + encodeURIComponent(this) + '/' + parseInt(pageNumber - 1, 10)
						})) ;

					}) ;

				}
				else{
					$('.status').html('Waiting for ' + waitingForPages + ' documents to load') ;
				}


			}) ;

		}) ;

		$('.page img').css('opacity', 1 / currentDocuments.length) ;

	} ;

	$('.nextPage').click(function(){
		currentPage++ ;
		loadPage(currentPage) ;
	}) ;

	$('.previousPage').click(function(){
		currentPage-- ;
		loadPage(currentPage) ;
	}) ;

	var stopAllRequests = function(){
		$.each(requests, function(){
			this.abort() ;
		}) ;
	} ;


}) ;