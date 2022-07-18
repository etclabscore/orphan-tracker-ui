import {GetHeaders, GetStatus, ListenCheckbox} from './utils';
import {initSortable} from "./sortable";

const tableBody = document.querySelector('#mytable-body');
const loadingIcon = document.querySelector('#loading-icon');
const empyUnclesHash = "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"

const tableRowStatus = document.querySelector('tr#latest-block');
const statusChainID = document.querySelector('#status-chain-id');
const statusUptime = document.querySelector('#status-uptime');

const style = document.querySelector('#mystyle');

// makeHeaderTableRow makes a table row for a header.
// It returns HTML.
function makeHeaderTableRow(headerJSON, lastOfDupes) {
    // headerJSON.orphan = true;
    // headerJSON.sha3Uncles = "set";
    const str = `
<tr class="
    ${headerJSON.orphan ? 'orphan' : 'canon'} 
    ${headerJSON.sha3Uncles !== empyUnclesHash ? 'uncler' : ''} 
    ${lastOfDupes ? 'dupeEnd' : ''}
    ${headerJSON.is_latest ? 'latest' : ''}
    ">
    
    <!--    ○ ◌-->
    <td class="td-uncle-orphan-ui">
        ${headerJSON.orphan ? '<span class="orphan-ui">●</span>' : ''}${headerJSON.sha3Uncles !== empyUnclesHash ? '<span class="uncler-ui">◌</span>' : ''} 
     </td>
    <td class="td-header-number"><span>${headerJSON.number}</span></td>
    <td class="td-header-timestamp">${headerJSON.timestamp}</td>
    <td class="truncate-hash td-header-miner">${headerJSON.miner}</td>
    <td class="truncate-hash td-header-hash"><span>${headerJSON.hash}</span></td>
    <td class="truncate-hash td-header-uncleBy">${headerJSON.uncleBy}</td>
    <td>${headerJSON.gasUsed}</td>
</tr>`;

    return str;
}

function makeHeaderTableRowForCanonicalBlock(number) {
    const str = `
        <tr class="canon canon-uncontested-row">
        <td></td>
        <td class="td-header-number uncontested-canonical"><span>${number}</span></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        </tr>
    `;
    return str;
}

let latestBlockNumber = 0;

GetStatus()
    .then(res => {
        res.latest_header["is_latest"] = true;
        const statusRowHTML = makeHeaderTableRow(res.latest_header, false);

        latestBlockNumber = res.latest_header.number;

        // How to replace HTML element.
        // https://stackoverflow.com/a/13433551
        if (tableRowStatus.outerHTML) {
            tableRowStatus.outerHTML = statusRowHTML;
        } else {
            var tmpObj = document.createElement("div");
            tmpObj.innerHTML = '<!--THIS DATA SHOULD BE REPLACED-->';
            var ObjParent = Obj.parentNode; //Okey, element should be parented
            ObjParent.replaceChild(tmpObj, tableRowStatus); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
            ObjParent.innerHTML = ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>', statusRowHTML);
        }

        statusChainID.innerHTML = `${res.chain_id}`;
        statusUptime.innerHTML = `${res.uptime}s`;

    })
    .then(() => {
        GetHeaders()
            .then(res => {
                loadingIcon.style.display = 'none';
                // tableBody.innerHTML = "";

                for (let i = 0; i < res.length; i++) {
                    const header = res[i];

                    // If this is the last of a set of duplicates, add a class to the row.
                    const lastOfDupes = i === res.length - 1 || res[i + 1].number !== header.number;

                    if (i === 0) {
                        for (let j = latestBlockNumber -1; j > header.number; j--) {
                            tableBody.insertAdjacentHTML('beforeend', makeHeaderTableRowForCanonicalBlock(j));
                        }
                    }

                    const row = makeHeaderTableRow(header, lastOfDupes);
                    tableBody.insertAdjacentHTML("beforeend", row);

                    // Insert boring canonical rows between the interesting, contested blocks.
                    // These will be hidden by CSS.
                    if (i !== res.length - 1) {
                        for (let j = header.number - 1; j > res[i + 1].number; j--) {
                            const row = makeHeaderTableRowForCanonicalBlock(j);
                            tableBody.insertAdjacentHTML("beforeend", row);
                        }
                    }
                }

            })
            .then(() => {
                initSortable();
            })
            .catch(err => (tableBody.innerHTML = err));
    })
    .catch(err => {
        // tableRowStatus.innerHTML = err;
    });



ListenCheckbox('fill-canonical', function (el) {

    if (el.checked) {
        style.innerHTML = `tr.canon.canon-uncontested-row { display: table-row; }`;
    } else {
        style.innerHTML = `tr.canon.canon-uncontested-row { display: none; }`;
    }
});
