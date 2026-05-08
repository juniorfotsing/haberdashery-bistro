/* Open/closed status, today's-hours highlight, footer year */
(function () {
  /* Hours config (24h, end > start; 24 = midnight) */
  var HOURS = {
    0: [12, 22], // Sun
    1: [16, 22], // Mon
    2: [16, 22], // Tue
    3: [12, 22], // Wed
    4: [12, 22], // Thu
    5: [12, 24], // Fri
    6: [12, 24]  // Sat
  };
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function fmt(h) {
    if (h === 24 || h === 0) return '12 am';
    if (h === 12) return '12 noon';
    if (h > 12)  return (h - 12) + ' pm';
    return h + ' am';
  }

  /* Footer year */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Highlight today in the hours list */
  var today = new Date().getDay();
  document.querySelectorAll('#hoursList li').forEach(function (li) {
    if (parseInt(li.dataset.day, 10) === today) {
      li.classList.add('today');
      li.style.position = 'relative';
    }
  });

  /* Nav status — open/closed + when next */
  var statusEl = document.getElementById('navStatus');
  var textEl   = document.getElementById('statusText');
  if (!statusEl || !textEl) return;

  var now   = new Date();
  var d     = now.getDay();
  var h     = now.getHours() + now.getMinutes() / 60;
  var range = HOURS[d];
  var open  = h >= range[0] && h < range[1];

  if (open) {
    statusEl.classList.add('open');
    textEl.textContent = 'Open now · until ' + fmt(range[1]);
    return;
  }

  /* Find next opening — same day later, or upcoming day */
  var next = null;
  for (var i = 0; i <= 7; i++) {
    var dd = (d + i) % 7;
    var r  = HOURS[dd];
    if (i === 0 && h < r[0]) { next = { day: 'today', hour: r[0] }; break; }
    if (i  >  0)             { next = { day: i === 1 ? 'tomorrow' : DAYS[dd], hour: r[0] }; break; }
  }
  textEl.textContent = next
    ? 'Closed · opens ' + fmt(next.hour) + ' ' + next.day
    : 'Closed';
})();
