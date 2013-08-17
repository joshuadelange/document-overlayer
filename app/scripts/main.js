$(document).ready(function(){

	'use strict';

	$('.openDropbox').click(function(){

		var numOfFiles = 0,
			fileNames = '' ;

		Dropbox.choose({
			success: function(files) {

				$('.pdfs').html('') ;

				$.each(files, function(){

					numOfFiles++;

					var uniqueParts = this.link.replace('https://www.dropbox.com', ''),
						pdfUrl = 'https://dl.dropboxusercontent.com' + uniqueParts + '?token_hash=AAE5nMnBD0EXGKzQIDq9hn5IcY8BApGhlxFqhml882aXKg&convert_doc_to_pdf=1&disable_range=1',
						googleDocsViewer = 'http://docs.google.com/viewer?url=' + encodeURIComponent(pdfUrl) + '&embedded=true',
						$iframe = $('<iframe />').attr('src', googleDocsViewer) ;

					$('.pdfs').append($iframe) ;

					if(numOfFiles === 1) {
						fileNames = this.name ;
					}
					else {
						fileNames = fileNames + '<br>' + this.name ;
					}

					$('.status').html('Showing ' + numOfFiles + ' files') ;

				}) ;


				$('.pdfs iframe').css({ opacity: 100 / numOfFiles + '%' }) ;

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