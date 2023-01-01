let clubsView = { search: '', data: [], loading: false, timestamp: new Date() }
const formatterClubs = () => {
  document.querySelector('#clubs div.content').innerHTML =
  clubsView.data
      .filter(_ => !clubsView.search || JSON.stringify(_).toLowerCase().includes(clubsView.search))
      .map(
        (_) =>
          `<div style="position: relative; flex:1 0 11%; margin:0rem; min-width:300px; padding:0rem;">
<b style="background: #1D71B9; padding: 0.1rem; display: inline-block; margin: 0 0.0 0.2rem 0;">${_.number}</b>
<span style="color: black">${_.name}</span> 
</div>`
      )
      .join('') +
    ['', '', '', '', '']
      .map(
        () =>
          '<div style="flex: 1 0 11%; margin: 0; padding: 0; min-width: 300px"></div>'
      )
      .join('');
};

addClubsCB((clubs) => {
  clubsView = clubs;
  formatterClubs();
});

setTimeout(() => {
  document.querySelector('#clubs div.control').innerHTML = `<span></span><input
    placeholder="Suche"
    type="text"
    style="display: flex;flex-wrap: wrap;padding: 0.5rem;border: none;border-bottom: 3px solid #1d71b9;outline: none;width: auto;"
  />`;
  document
    .querySelector('#clubs div.control input')
    .addEventListener('keyup', (e) => {
      clubsView.search = e.target.value.toLowerCase();
      formatterClubs();
    });
}, 100);