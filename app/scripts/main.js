$(document).ready(function(){

	'use strict';

	var cachingEnabled = false,
			keepCheckingForCaching = true,
			cacheAddress = 'http://localhost:1337/',
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

				$('.pdfs').html('') ;

				$.each(files, function(){

					numOfFiles++;

					var uniqueParts = this.link.replace('https://www.dropbox.com', ''),
						pdfUrl = 'https://dl.dropboxusercontent.com' + uniqueParts + '?token_hash=AAE5nMnBD0EXGKzQIDq9hn5IcY8BApGhlxFqhml882aXKg&dl=1',
						googleDocsViewer = 'https://docs.google.com/viewer?url=' + encodeURIComponent(pdfUrl) + '&embedded=true' ;

					console.log('gdoc url', googleDocsViewer) ;

					if(cachingEnabled){

						// $('.pdfs').append($('<iframe />').attr('src', googleDocsViewer)) ;

						var $docWrapper = $('<div />').addClass('documentWrapper'),
								$page1 = $('<img />').attr('src', cacheAddress + encodeURIComponent(googleDocsViewer) + '/1') ;

						$docWrapper.append($page1) ;

						$('.pdfs').append($docWrapper) ;

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


				$('.pdfs iframe').css({ opacity: 1 / numOfFiles }) ;

				$('.status').tooltip({
					html: true,
					title: fileNames,
					placement: 'bottom'
				}) ;

			},
			multiselect: true
		});

	}) ;

}) ;