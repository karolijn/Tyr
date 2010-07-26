function safariEventListener(event)
{
  if (event.name == 'fetchPostRanks')
  {
    var url = 'http://api.postrank.com/v1/postrank?appkey=tyr&format=json';
    fetchPostRankData(url, event.message, event, safariFetchPostRanksCallback);
  }
  else  if (event.name == 'fetchPostRankMetrics')
  {
    var url = 'http://api.postrank.com/v2/entry/metrics?appkey=tyr&format=json&raw=true';
    fetchPostRankData(url, event.message, event, safariFetchPostRankMetricsCallback);
  }
  else if (event.name == 'loadSettings')
  {
    event.target.page.dispatchMessage('settingsLoaded', safari.extension.settings);
  }
  else if (event.name == 'storeSetting')
  {
    safari.extension.settings.setItem(event.message.name, event.message.value);
  }
}
safari.application.addEventListener("message", safariEventListener, false);

function safariFetchPostRanksCallback(data, ranks)
{
  data.target.page.dispatchMessage('receivedPostRanks', ranks);
}

function safariFetchPostRankMetricsCallback(data, metrics)
{
  data.target.page.dispatchMessage('receivedPostRankMetrics', metrics);
}