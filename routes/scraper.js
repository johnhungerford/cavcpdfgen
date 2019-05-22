const request = require('request');
const jsdom = require('jsdom');

module.exports.getCaseReport = (req, res, next) => {
    if (req.params.csnum === undefined || req.params.csnum.length !== 7) {
        return res.json({success: false, message: 'missing case number'});
    }

    let postUrl = 'https://efiling.uscourts.cavc.gov/cmecf/servlet/TransportRoom';
    
    request(
        {
            uri: postUrl,
            method: "POST",
            form: {
                servlet: 'CaseSummary.jsp',
                caseNum: req.params.csnum,
                // caseNum: '19-1485',
                fullDocketReport: 'Y',
                incPrior: 'Y',
                incAssoc: 'Y',
                incPtyAty: 'Y',
                incCaption: 'long',
                incDktEntries: 'Y',
                dateFrom: '',
                dateTo: '',
                incPdfMulti: 'Y',
                actionType: 'Run Docket Report',
            },
        },
        (errReq, resReq, body) => {
            if (errReq) return res.json({success: false, message: errReq.message});
            res.locals.resHtml = body;
            return next();
        }
    );
}

module.exports.parseCaseReport = (req, res, next) => {
    const dom = new jsdom.JSDOM(res.locals.resHtml);

    const body = dom.window.document.querySelector('body');
    const party1Html = body.children[6].children[0].children[0].children[0].children[0].children[0].children[1].children[0].innerHTML;
    const party1BrSplit = party1Html.split('<br>');
    const party1 = [];
    for (let str of party1BrSplit[0].split(', ')) party1.push(str);
    console.log(party1BrSplit[1]);
    party1.push(party1BrSplit[1].replace(/&nbsp;/g,'').replace(/\n/g, ''));
    console.log(party1BrSplit[1].replace(/&nbsp;/g,''));
    console.log(party1[party1.length - 1]);

    const party2Html = body.children[6].children[0].children[0].children[0].children[0].children[0].children[3].children[0].innerHTML;
    const party2BrSplit = party2Html.split('<br>');
    const party2 = [];
    for (let str of party2BrSplit[0].split(', ')) party2.push(str);
    console.log(party2BrSplit[1]);
    party2.push(party2BrSplit[1].replace(/&nbsp;/g,'').replace(/\n/g, ''));

    res.locals.party1 = party1;
    res.locals.party2 = party2;
    return next();
};

module.exports.getPriorExtensions = (req, res, next) => {

};
