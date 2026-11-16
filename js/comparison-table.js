// Accessible renderer for the project comparison catalog.
(function () {
  'use strict';

  var table = document.getElementById('comparisonTable');
  if (!table) return;

  var tbody = table.querySelector('tbody');
  if (!tbody) return;

  var columns = [
    { key: 'sneppxov' },
    { key: 'sneppx-alg' },
    { key: 'sneppx-shield' },
    { key: 'sneppx-serve' }
  ];

  function showError() {
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'Comparison data could not be loaded. Please refresh the page.';
    row.appendChild(cell);
    tbody.replaceChildren(row);
  }

  function render(data) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Expected a non-empty comparison array.');
    }

    var rows = data.map(function (record) {
      if (!record || typeof record.feature !== 'string' || !record.feature.trim()) {
        throw new Error('Comparison row is missing its feature name.');
      }

      var row = document.createElement('tr');
      var feature = document.createElement('th');
      feature.setAttribute('scope', 'row');
      feature.textContent = record.feature;
      row.appendChild(feature);

      columns.forEach(function (column) {
        var value = record[column.key];
        if (value !== 'Yes' && value !== 'No') {
          throw new Error('Comparison row contains an invalid project value.');
        }

        var cell = document.createElement('td');
        var badge = document.createElement('span');
        badge.className = 'feature-badge ' + (value === 'Yes' ? 'yes' : 'no');
        badge.textContent = value;
        cell.appendChild(badge);
        row.appendChild(cell);
      });

      return row;
    });

    tbody.replaceChildren.apply(tbody, rows);
  }

  fetch('data/comparison.json')
    .then(function (response) {
      if (!response || !response.ok) {
        throw new Error('Comparison request failed.');
      }
      return response.json();
    })
    .then(render)
    .catch(showError);
})();
