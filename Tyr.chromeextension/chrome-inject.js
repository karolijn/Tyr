function sendPostRankRequest(params)
{
  chrome.extension.sendRequest({'action' : 'fetchPostRanks', 'params' : params}, receivedPostRanks);
}

function sendPostRankMetricsRequest(params)
{
  chrome.extension.sendRequest({'action' : 'fetchPostRankMetrics', 'params' : params}, receivedPostRankMetrics);
}

function storeSetting(name, value)
{
  chrome.extension.sendRequest({'action' : 'storeSetting', 'name' : name, 'value' : value + ''});
}

function loadSettings()
{
  chrome.extension.sendRequest({'action' : 'loadSettings'}, settingsLoaded);
}
