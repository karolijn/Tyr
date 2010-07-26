function sendPostRankRequest(params)
{
  chrome.extension.sendRequest({'action' : 'fetchPostRanks', 'params' : params}, receivedPostRanks);
}

function storeSetting(name, value)
{
  chrome.extension.sendRequest({'action' : 'storeSetting', 'name' : name, 'value' : value + ''});
}

$(document).ready(function()
{
  chrome.extension.sendRequest({'action' : 'loadSettings'}, settingsLoaded);
});
