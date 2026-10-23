// Feature comparison table renderer
(function () {
  'use strict';

  var table = document.getElementById('comparisonTable');
  if (!table) return;

  var tbody = table.querySelector('tbody');
  if (!tbody) return;

  fetch('data/comparison.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      data.forEach(function (row) {
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + escapeHtml(row.feature) + '</td>' +
          row.sneppxov.split(' ').map(function (v) {
            return '<span class="feature-badge ' + (v === 'Yes' ? 'yes' : 'no') + '">' + v + '</span>';
          }).join('') +
          '<td></td><td></td><td></td>';
        // Actually we need 4 columns for sneppxov, sneppx-alg, sneppx-shield, sneppx-serve
        tr.innerHTML =
          '<td>' + escapeHtml(row.feature) + '</td>' +
          '<td><span class="feature-badge ' + (row.sneppxov === 'Yes' ? 'yes' : 'no') + '">' + row.sneppxov + '</span></td>' +
          '<td><span class="feature-badge ' + (row.sneppx_alg === 'Yes' ? 'yes' : 'no') + '">' + row.sneppx_alg + '</span></td>' +
          '<td><span class="feature-badge ' + (row.sneppx_shield === 'Yes' ? 'yes' : 'no') + '">' + row.sneppx_shield + '</span></td>' +
          '<td><span class="feature-badge ' + (row.sneppx_serve === 'Yes' ? 'yes' : 'no') + '">' + row.sneppx_serve + '</span></td>';
        tbody.appendChild(tr);
      });
    });

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
