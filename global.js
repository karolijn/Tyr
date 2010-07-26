function fetchPostRankData(url, params, data, callback)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(d)
  {
    if (xhr.readyState == 4)
    {
      var response = null;
      if (xhr.status == 200)
        response = JSON.parse(xhr.responseText);

      callback(data, response);
    }
  }

  xhr.open('POST', url, true);
  xhr.send(params);
}