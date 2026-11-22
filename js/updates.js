(function () {
  'use strict';

  var cacheDuration = 15 * 60 * 1000;
  var cachePrefix = 'sneppxov:github:v1:';

  function readCache(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var value = JSON.parse(raw);
      if (!value || Date.now() - value.savedAt > cacheDuration || !Array.isArray(value.data))
        return null;
      return value.data;
    } catch (error) {
      return null;
    }
  }

  function writeCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data: data }));
    } catch (error) {
      // Browser storage can be disabled or full; live data still renders.
    }
  }

  async function loadData(url) {
    var cached = readCache(cachePrefix + url);
    if (cached) return cached;
    var response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json' },
      credentials: 'omit',
    });
    if (!response.ok) throw new Error('GitHub returned HTTP ' + response.status);
    var data = await response.json();
    if (!Array.isArray(data)) throw new Error('GitHub returned an unexpected response');
    writeCache(cachePrefix + url, data);
    return data;
  }

  function safeGitHubURL(value) {
    try {
      var url = new URL(value);
      return url.protocol === 'https:' && url.hostname === 'github.com' ? url.href : null;
    } catch (error) {
      return null;
    }
  }

  function formatDate(value) {
    if (!value) return '';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
  }

  function addMessage(list, message) {
    list.replaceChildren();
    var item = document.createElement('li');
    item.textContent = message;
    list.append(item);
  }

  function renderCommits(list, records) {
    list.replaceChildren();
    if (!records.length) return addMessage(list, 'No commits were returned.');
    records.slice(0, 3).forEach(function (record) {
      var commit = record && record.commit ? record.commit : {};
      var author = commit.author || {};
      var committer = commit.committer || {};
      var url = safeGitHubURL(record && record.html_url);
      var sha = record && typeof record.sha === 'string' ? record.sha : '';
      var message = typeof commit.message === 'string' ? commit.message.split('\n')[0] : 'Commit';
      if (!url || !sha) return;
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = message;
      var meta = document.createElement('span');
      meta.className = 'update-meta';
      meta.textContent = [sha.slice(0, 7), formatDate(author.date || committer.date)]
        .filter(Boolean)
        .join(' · ');
      item.append(link, meta);
      list.append(item);
    });
    if (!list.children.length) addMessage(list, 'No valid commit records were returned.');
  }

  function renderReleases(list, records) {
    list.replaceChildren();
    if (!records.length) return addMessage(list, 'No published releases were returned.');
    records.slice(0, 3).forEach(function (record) {
      var url = safeGitHubURL(record && record.html_url);
      var name = record && (record.name || record.tag_name);
      if (!url || typeof name !== 'string' || !name) return;
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = name;
      var meta = document.createElement('span');
      meta.className = 'update-meta';
      meta.textContent = [formatDate(record.published_at), record.prerelease ? 'Pre-release' : '']
        .filter(Boolean)
        .join(' · ');
      item.append(link, meta);
      list.append(item);
    });
    if (!list.children.length) addMessage(list, 'No valid release records were returned.');
  }

  document.querySelectorAll('.live-updates[data-repo]').forEach(function (card) {
    var repo = card.getAttribute('data-repo');
    var status = card.querySelector('[data-update-status]');
    var commits = card.querySelector('[data-commits]');
    var releases = card.querySelector('[data-releases]');
    if (!repo || !status || !commits || !releases) return;
    var base = 'https://api.github.com/repos/' + repo;
    Promise.allSettled([
      loadData(base + '/commits?per_page=3').then(data => renderCommits(commits, data)),
      loadData(base + '/releases?per_page=3').then(data => renderReleases(releases, data)),
    ]).then(function (results) {
      var failed = results.some(result => result.status === 'rejected');
      status.textContent = failed
        ? 'Some live GitHub data could not be loaded. The source links are still available.'
        : 'Loaded from GitHub. This browser caches results for up to 15 minutes.';
      results.forEach(function (result, index) {
        if (result.status === 'rejected')
          addMessage(index === 0 ? commits : releases, 'Live data is temporarily unavailable.');
      });
    });
  });
})();
