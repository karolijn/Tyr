function safariInjectEventListener(event)
{
  if (event.name == 'receivedPostRanks')
  {
    receivedPostRanks(event.message);
  }
  else if (event.name == 'receivedPostRankMetrics')
  {
    receivedPostRankMetrics(event.message);
  }
  else if (event.name == 'settingsLoaded')
  {
    settingsLoaded(event.message);
  }
}
safari.self.addEventListener('message', safariInjectEventListener, false);

function sendPostRankRequest(params)
{
  safari.self.tab.dispatchMessage('fetchPostRanks', params);
}

function sendPostRankMetricsRequest(params)
{
  safari.self.tab.dispatchMessage('fetchPostRankMetrics', params);
}

function storeSetting(name, value)
{
  safari.self.tab.dispatchMessage('storeSetting', {'name' : name, 'value' : value + ''});
}

function loadSettings()
{
  safari.self.tab.dispatchMessage('loadSettings');
}