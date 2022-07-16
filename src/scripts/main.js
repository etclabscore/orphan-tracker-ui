import {GetHeaders} from './utils';

const tableBody = document.querySelector('#mytable-body');
const loadingIcon = document.querySelector('#loading-icon');
const empyUnclesHash = "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"

// makeHeaderTableRow makes a table row for a header.
// It returns HTML.
function makeHeaderTableRow(headerJSON, lastOfDupes) {
    return `
<tr class="${headerJSON.orphan ? 'orphan' : 'canon'} ${headerJSON.sha3Uncles !== empyUnclesHash ? 'uncler' : ''} ${lastOfDupes ? 'dupeEnd' : ''}">
    <td>${headerJSON.number}</td>
    <td>${headerJSON.timestamp}</td>
    <td>${headerJSON.miner.substring(0, 10)}</td>
    <td>${headerJSON.gasUsed}</td>
    <td>${headerJSON.hash.substring(0, 10)}</td>
    <td>${headerJSON.uncleBy.substring(0, 10)}</td>
</tr>`;
}

GetHeaders()
    .then(res => {
        loadingIcon.style.display = 'none';
        tableBody.innerHTML = "";

        for (let i = 0; i < res.length; i++) {
            const header = res[i];

            // If this is the last of a set of duplicates, add a class to the row.
            const lastOfDupes = i === res.length - 1 || res[i + 1].number !== header.number;

            const row = makeHeaderTableRow(header, lastOfDupes);
            tableBody.innerHTML += row;
        }

    })
    .catch(err => (tableBody.innerHTML = err));
