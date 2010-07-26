function chromeEventListener(request, sender, callback)
{
  if (request.action == 'fetchPostRanks')
    fetchPostRanks(request.params, callback, chromeFetchPostRanksCallback);

  else if (request.action == 'loadSettings')
    callback(chrome.extension.getBackgroundPage().localStorage);

  else if (request.action == 'storeSetting')
    chrome.extension.getBackgroundPage().localStorage[request.name] = request.value;
}
chrome.extension.onRequest.addListener(chromeEventListener);

function chromeFetchPostRanksCallback(data, ranks)
{
  data(ranks);
}