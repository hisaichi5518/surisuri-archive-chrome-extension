function dataURItoBlob(dataURI) {
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

$(document).on("click", ".link", function(e) {
  chrome.tabs.create({ url: e.currentTarget.href });
});

chrome.tabs.getSelected(null, function(tab) {
  chrome.tabs.captureVisibleTab(
    null, {format: 'png', quality: 100},
    function(dataURI) {
      var blob = dataURItoBlob(dataURI);
      var fd = new FormData();
      fd.append("image", blob);
      fd.append("title", tab.title + " " + (new Date()).toString());
      fd.append("description", tab.url);
      $.ajax({
        url: "http://surisuri-archive.herokuapp.com/sites",
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json'
      })
      .done(function() {
        $("#container").html('アーカイブりました。<a class="link" href="https://suzuri.jp/surisuri-archive">見てください。</a>')
      })
      .fail(function() {
        $("#container").html("失敗しました。どんまいです。")
      });
    }
  );
});
