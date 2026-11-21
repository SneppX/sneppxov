(function () {
  'use strict';
  var name = document.getElementById('projectName'),
    description = document.getElementById('projectDescription'),
    category = document.getElementById('projectCategory'),
    actions = document.getElementById('projectActions'),
    references = document.getElementById('projectReferences');
  if (!name || !description || !actions || !references) return;
  var id = new URLSearchParams(window.location.search).get('id');
  function makeLink(label, value, external) {
    if (typeof value !== 'string') return null;
    var url;
    try {
      url = new URL(value, window.location.href);
    } catch (error) {
      return null;
    }
    if (external && url.protocol !== 'https:') return null;
    if (!external && url.origin !== window.location.origin) return null;
    var a = document.createElement('a');
    a.href = url.href;
    a.textContent = label + (external ? ' ↗' : '');
    a.className = external ? 'button button-secondary' : 'text-link';
    if (external) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    return a;
  }
  function render(item) {
    name.textContent = item.name;
    description.textContent = item.description;
    category.textContent = item.category;
    var repo = makeLink('Open source repository', item.repository, true);
    if (repo) actions.append(repo);
    var website = makeLink('Project website', item.website, true);
    if (website) actions.append(website);
    references.replaceChildren();
    (Array.isArray(item.references) ? item.references : []).forEach(function (ref) {
      var a = makeLink(ref.label, ref.url, false);
      if (a) {
        var row = document.createElement('div');
        row.append(a);
        references.append(row);
      }
    });
    if (!references.children.length) {
      var p = document.createElement('p');
      p.textContent =
        'No separate documentation links are listed for this project yet. Check the repository for current documentation.';
      references.append(p);
    }
  }
  if (!id) {
    name.textContent = 'Project not specified';
    description.textContent = 'Choose a project from the directory.';
    return;
  }
  fetch('data/projects.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Project data could not be loaded.');
      return response.json();
    })
    .then(function (records) {
      if (!Array.isArray(records)) throw new Error('Project data has an invalid format.');
      var item = records.find(function (record) {
        return record && record.id === id;
      });
      if (!item) throw new Error('No public project matches this address.');
      render(item);
    })
    .catch(function (error) {
      name.textContent = 'Project unavailable';
      description.textContent = error.message;
      actions.replaceChildren();
      references.replaceChildren();
    });
})();
