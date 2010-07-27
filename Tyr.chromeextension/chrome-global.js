function chromeEventListener(request, sender, callback)
{
  if (request.action == 'fetchPostRanks')
  {
    var url = 'http://api.postrank.com/v1/postrank?appkey=tyr&format=json';
    fetchPostRankData(url, request.params, callback, chromeFetchPostRankDataCallback);
  }
  else if (request.action == 'fetchPostRankMetrics')
  {
    var url = 'http://api.postrank.com/v2/entry/metrics?appkey=tyr&format=json&raw=true';
    fetchPostRankData(url, request.params, callback, chromeFetchPostRankDataCallback);
  }
  else if (request.action == 'loadSettings')
  {
    callback(chrome.extension.getBackgroundPage().localStorage);
  }
  else if (request.action == 'storeSetting')
  {
    chrome.extension.getBackgroundPage().localStorage[request.name] = request.value;
  }
}
chrome.extension.onRequest.addListener(chromeEventListener);

function chromeFetchPostRankDataCallback(data, response)
{
  data(response);
}