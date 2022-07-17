import {GetHeaders, GetStatus} from './utils';

const tableBody = document.querySelector('#mytable-body');
const loadingIcon = document.querySelector('#loading-icon');
const empyUnclesHash = "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"

const tableRowStatus = document.querySelector('tr#latest-block');

// makeHeaderTableRow makes a table row for a header.
// It returns HTML.
function makeHeaderTableRow(headerJSON, lastOfDupes) {
    return `
<tr class="
    ${headerJSON.orphan ? 'orphan' : 'canon'} 
    ${headerJSON.sha3Uncles !== empyUnclesHash ? 'uncler' : ''} 
    ${lastOfDupes ? 'dupeEnd' : ''}
    ${headerJSON.is_latest ? 'latest' : ''}
    ">
    <td>${headerJSON.number}</td>
    <td>${headerJSON.timestamp}</td>
    <td class="truncate-hash">${headerJSON.miner}</td>
    <td class="truncate-hash">${headerJSON.hash}</td>
    <td class="truncate-hash">${headerJSON.uncleBy}</td>
    <td>${headerJSON.gasUsed}</td>
</tr>`;
}

GetHeaders()
    .then(res => {
        loadingIcon.style.display = 'none';
        // tableBody.innerHTML = "";

        for (let i = 0; i < res.length; i++) {
            const header = res[i];

            // If this is the last of a set of duplicates, add a class to the row.
            const lastOfDupes = i === res.length - 1 || res[i + 1].number !== header.number;

            const row = makeHeaderTableRow(header, lastOfDupes);
            tableBody.innerHTML += row;
        }

    })
    .catch(err => (tableBody.innerHTML = err));

GetStatus()
    .then(res => {
        res.latest_header["is_latest"] = true;
        const statusRowHTML = makeHeaderTableRow(res.latest_header, false);

        // How to replace HTML element.
        // https://stackoverflow.com/a/13433551
        if (tableRowStatus.outerHTML) {
            tableRowStatus.outerHTML = statusRowHTML;
        } else {
            var tmpObj=document.createElement("div");
            tmpObj.innerHTML='<!--THIS DATA SHOULD BE REPLACED-->';
            var ObjParent=Obj.parentNode; //Okey, element should be parented
            ObjParent.replaceChild(tmpObj,tableRowStatus); //here we placing our temporary data instead of our target, so we can find it then and replace it into whatever we want to replace to
            ObjParent.innerHTML=ObjParent.innerHTML.replace('<div><!--THIS DATA SHOULD BE REPLACED--></div>',statusRowHTML);
        }

    })
    .catch(err => {
        // tableRowStatus.innerHTML = err;
    });
