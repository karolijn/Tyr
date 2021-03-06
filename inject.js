var links = [];
var pr_timer = null;
var level = 1.0;

jQuery.fn.reverse = function()
{
  return this.pushStack(this.get().reverse(), arguments);
};

var siteStyles = [
  'td.title a',              // hacker news
  'h2.title a:nth-child(1)', // google news
  'a.title',                 // reddit
  'a.l',                     // google
  'a.taggedlink',            // delicious
  'div.news-body h3 a'       // digg
];

function settingsLoaded(settings)
{
  level = parseFloat(settings.level);
  setupPostRankDropdown($('#chrome-viewer'));
  shadeByPostRank();
}

function getSiteLinks()
{
  var links = [];

  for (var s in siteStyles)
    $(siteStyles[s]).each(function(i, obj) { links.push(MD5($(obj).attr('href'))) });

  return links;
}

function formatPostRankNumber(postrank)
{
  if (postrank == 10) return postrank + '';
  if (Math.floor(postrank) == postrank) return postrank + ".0";
  return postrank + '';
}

function formatEngagementValue(value)
{
  var val = Math.ceil(value) + '';

  var sections = [];
  while(val.length > 3)
  {
    var section = val.substr(val.length - 3);
    sections.unshift(section);
    val = val.substr(0, val.length - 3);
  }

  if (val.length > 0) sections.unshift(val);
  val = sections.join(',');

  return val;
}

function cleanMetricName(name)
{
  name = name.replace(/hn_/, 'Hacker News ');
  name = name.replace(/ms_/, 'MySpace ');
  name = name.replace(/ff_/, 'FriendFeed ');
  name = name.replace(/gr_/, 'Google Reader ');
  name = name.replace(/fb_/, 'FaceBook ');
  name = name.replace(/YBuzz_/, 'Yahoo! Buzz ');
  name = name.replace(/n4g_/, 'N4G ');
  name = name.replace(/meme_/, 'Me.Me ');
  name = name.replace(/_/, ' ');
  name = name.replace(/\w+/g, function(a) { return a.charAt(0).toUpperCase() + a.substr(1); });

  return name;
}

function shadeByPostRank()
{
  $('#entries .entry .collapsed').each(function(i, obj)
  {
    var pr = $('.postrank', obj)[0];
    if (pr == undefined) return;

    var post_level = parseFloat(pr.innerHTML);

    if (post_level < level)
    {
      $(obj).fadeTo('slow', Math.max(0.15, (post_level / 10) - 0.2));
      $(obj).click(function(event) { $(obj).fadeTo('fast', 1.0); });
    }
    else
      $(obj).fadeTo('slow', 1.0);
  });
}

function setSelected(val)
{
  return (level == val ? ' selected="selected"' : '')
}

function setupPostRankDropdown(obj)
{
  $(obj).attr('pr-injected', 'true');

  sel = $('<select id="pr-dropdown">' +
      '<option value="1.0" class="pr-all"' + setSelected(1.0) + '>PR all</option>' +
      '<option value="2.7" class="pr-good"' + setSelected(2.7) + '>PR good</option>' +
      '<option value="5.4" class="pr-great"' + setSelected(5.4) + '>PR great</option>' +
      '<option value="7.6" class="pr-best"' + setSelected(7.6) + '>PR best</option>' +
    '</select>')

  sel.change(function(event)
  {
    level = parseFloat(event.target.options[event.target.selectedIndex].value);
    shadeByPostRank();
    storeSetting('level', level);
  });

  sel.insertAfter($('#viewer-refresh', $(obj)));
}

function setupReaderEntries(obj)
{
  $(obj).find('.entry-original, .entry-title-link').reverse().each(function(i, obj) {
      links.push($(obj).attr('href'));
  });
}

function setupPostRankLoadTimer()
{
  if (pr_timer != null) clearTimeout(pr_timer);

  pr_timer = setTimeout(function()
  {
    if (links.length > 0)
    {
      params =  '';
      $.each(links, function(i, obj) { params += 'url[]=' + escape(obj) + "&" });

      sendPostRankRequest(params);
      links = [];
    }

    pr_timer = null;
  }, 5);
}

function receivedPostRanks(ranks)
{
  $(document).find('#entries .entry').reverse().each(function(i, obj)
  {
    // stop iterator if we have already inserted the postrank data
    if ($(obj).find('b.postrank').length == 1) { return false; }

    var link = $($('a.entry-original', obj)[0]).attr('href');
    var pos = $('h2.entry-title', obj)[0];

    // expanded mode selectors
    if (typeof(link) == 'undefined') {
      pos = $('a.entry-title-link', obj)[0];
      link = $(pos).attr('href');
    }

    var data = ranks[link];
    if (data != undefined)
    {
      $('<b class="postrank" style="background-color: ' + data['postrank_color'] + ';">' +
            formatPostRankNumber(data['postrank']) +
        '</b>').insertBefore(pos);
    }
  });

  shadeByPostRank();
}

function receivedPostRankMetrics(data)
{
  inject = function(i, obj)
  {
    md5 = MD5($(obj).attr('href'));

    if (typeof(data[md5]) != 'undefined')
    {
      var keys = [];
      for (prop in data[md5])
        keys.push(prop);

      metrics = '';
      for (var k in keys.sort())
      {
        var prop = keys[k];
        if (prop == 'raw') continue;

        var prop_name = cleanMetricName(prop);

        if (metrics.length > 0) metrics += "\n";
        metrics += prop_name + ": " + data[md5][prop];
      }

      $(obj).attr('title', metrics);
      $(obj).html($(obj).text() + "<span class='comhead' style='font-size: 75%;'> - " +
                                    formatEngagementValue(data[md5]['raw']) +
                                    " engagement points -</span>");
    }
  }

  for (var s in siteStyles)
    $(siteStyles[s]).each(inject);
}

function handleDOMNodeInserted(event)
{
  if (!event.target) return;
  else if (event.target.className && event.target.className.match(/entry\sentry-/))
  {
    setupReaderEntries(event.target);
    setupPostRankLoadTimer();
  }
}
document.addEventListener('DOMNodeInserted', function(e) { handleDOMNodeInserted(e) }, false);

$(document).ready(function()
{
  loadSettings();

  var params = '';
  $.each(getSiteLinks(), function(i, obj) { params += "url[]=" + obj + "&" })

  if (params.length != 0)
    sendPostRankMetricsRequest(params)
});
