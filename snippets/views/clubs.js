let clubsView = { search: '', data: [], loading: false, timestamp: new Date() };
const formatterClubs = () => {
  document.querySelector('#clubs div.content').innerHTML =
    clubsView.data
      .filter(
        (_) =>
          !clubsView.search ||
          JSON.stringify(_).toLowerCase().includes(clubsView.search)
      )
      .map(
        (_, i) => `
<a role="button" href='#popup=clubView_${i}' id='clubView_${i}' style='text-decoration: none; border: 1px solid #1D71B9; cursor: pointer; flex:1 0 11%; margin:0.25rem; min-width:300px; padding:0.5rem; display: flex; flex-direction: row; align-items: center;'>
  <b>${_.number}</b>&nbsp;|&nbsp;
  <span style='color: black; text-align: left; flex: 1;'>${_.name}</span>${
          _.cert1
            ? `&nbsp;<img style='width: 1rem; height: 1rem' src='${clubsView.certs.cert1.thumb}' title='${clubsView.certs.cert1.name}' />`
            : ''
        } 
</a>`
      )
      .join('') +
    ['', '', '', '', '']
      .map(
        () =>
          `<div style='visibility: hidden; flex: 1 0 11%; margin:0 0.25rem; min-width:300px; padding:0 0.5rem;'></div>`
      )
      .join('');
};

setTimeout(() => {
  clubs.addCB((clubs) => {
    clubsView = clubs;
    formatterClubs();
  });
  clubs.addPopupCB('clubView', (id, target, pane) => {
    pane.innerHTML = `
  <div style='position: relative; display: flex; flex-direction: column; flex: 1'><a href='#' role='button' style='text-decoration: none; color: white; position: absolute; right: 0;margin: 0.5rem; background: #1D71B9; border: none; padding: 0.5rem 1rem; font-size: 1.5rem; font-weight: bold;'>X</a>${
    clubs.data[id].geolocation
      ? `<iframe width="100%" style="flex: 1" frameborder="0" scrolling="no" src="https://www.openstreetmap.org/export/embed.html?bbox=${
          clubs.data[id].geolocation.split(':')[1]
        }%2C${
          clubs.data[id].geolocation.split(':')[id]
        }%2C11.067352294921875%2C50.31181759082695&amp;layer=mapnik"></iframe>`
      : ''
  }<dl style='margin: 0.5rem'>
    <dt style='float: left;'>BTV-ID:</dt><dd>&nbsp;${clubs.data[id].number}</dd>
    <dt style='float: left;'>Verein:</dt><dd>&nbsp;${clubs.data[id].name}</dd>
    <dt style='float: left;'>Webseite:</dt><dd>&nbsp;<a href='${
      clubs.data[id].website
    }'>${clubs.data[id].website}</a></dd>
  </dl><ul style='margin: 0.5rem; padding: 0; list-style: none; display: flex; flex-wrap: wrap;'>${
    clubs.data[id].cert1
      ? `<li><a style='padding: 1rem; padding-top: 0; display: flex; flex-direction: column' href='${clubs.certs[
          'cert1'
        ].proof(
          clubs.data[id]
        )}'><img style='height: 3.5rem; width: 3.5rem;' src='${
          clubs.certs['cert1'].img
        }'>${clubs.certs['cert1'].name}</a></li>`
      : ''
  }</ul></div>`;
  });

  document.querySelector('#clubs div.control').innerHTML = `
<span></span><input
  placeholder='Suche'
  type='text'
  style='display: flex;flex-wrap: wrap;padding: 0.5rem;border: none;border-bottom: 3px solid #1d71b9;outline: none;width: auto;'
/>`;
  document
    .querySelector('#clubs div.control input')
    .addEventListener('keyup', (e) => {
      var str = window.location.search;
      str = replaceQueryParam('rows', 55, str);
      str = replaceQueryParam('cols', 'no', str);
      window.location = window.location.pathname + str;

      clubsView.search = e.target.value.toLowerCase();
      formatterClubs();
    });
}, 100);
