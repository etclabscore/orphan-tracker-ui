const apiPath = process.env.NODE_ENV !== 'production' ? 'http://localhost:8081' : '';
// const apiPath = process.env.NODE_ENV !== 'production' ? 'https://classic.orphans.etccore.in' : '';

export const GetHeaders = () => {
    let search = document.location.search;
    if (search === "") {
        if (window.history.replaceState) {
            let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?limit=100&include_txes=false';
            window.history.replaceState({path: newurl}, '', newurl);
        }
    }

    const body = fetch(apiPath + '/api/headers' + document.location.search).then(
        res => res.json()
    ).catch((err) => {
        console.log(err);
        return Promise.reject(err);
    });
    return body;
};

export const GetStatus = () => {
    const body = fetch(apiPath + '/status').then(
        res => res.json()
    ).catch((err) => {
        console.log(err);
        console.debug(res);
        return Promise.reject(err);
    });
    return body;
};

/*
 "uptime": 324,
  "chain_id": 61,
  "latest_header": {
        "created_at": "0001-01-01T00:00:00Z",
        "updated_at": "0001-01-01T00:00:00Z",
        "hash": "0x4018a7851f87ac7c7c7da1549aa11717979acaaef8937e67b1db3a573e5df29a",
        "parentHash": "0x742fe6c7bb519a9209fb1ab4a69e9133b34b7926bebd62b100033f6f60ed89e4",
        "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
        "miner": "0xDf7D7e053933b5cC24372f878c90E62dADAD5d42",
        "stateRoot": "0xf9df79e74c9f87a3774bdc52ece20837314e9579f831006a85c23adbe16a32d9",
        "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
        "difficulty": "267018370939767",
        "number": 15536588,
        "gasLimit": 8031275,
        "gasUsed": 0,
        "timestamp": 1657896534,
        "extraData": "c3RyYXR1bS1hc2lhLTE=",
        "mixHash": "0x5e7b903556dcaa4a738152830194044b9a94f1ccf189a98146e5f66af81c96ca",
        "nonce": "14687018096225711779",
        "baseFeePerGas": "<nil>",
        "orphan": false,
        "uncleBy": ""
    }
 */

export const ListenCheckbox = (id, onChange) => {
    const el = document.querySelector(`#${id}`);
    if (el) {
        const searchParams = new URLSearchParams(document.location.search.substring(1));
        if (searchParams.get('fill_canonical_chain') === 'true') {
            el.checked = true;
        }
        onChange(el);
        el.addEventListener('change', (e) => {
            const searchParams = new URLSearchParams(document.location.search.substring(1));
            if (e.target.checked) {
                searchParams.set("fill_canonical", e.target.checked);
            } else {
                searchParams.delete("fill_canonical");
            }
            const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
            window.history.replaceState({path: newurl}, '', newurl);
            onChange(e.target);

        });
    }
};
