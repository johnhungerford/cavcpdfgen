const express = require('express');
const request = require('request');
const jsdom = require('jsdom');
const pdfkit = require('pdfkit');
const router = express.Router();

const getCaseReport = (req, res, next) => {
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

const parseCaseReport = (req, res, next) => {
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

const genNoa = (req, res, next) => {
    const doc = new pdfkit();

    const bold = 'fonts/Arial Bold.ttf';
    const norm = 'fonts/Arial.ttf';

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let y = 72;
    let x = 72;
    const lh = doc.heightOfString('TEST', { width: doc.widthOfString('TEST')}) + 2;

    doc.fontSize(13);
    doc.font(bold).text('IN THE UNITED STATES COURT OF APPEALS', x, y, {align: 'center', paragraphGap: 0});
    y += lh;
    doc.font(bold).text('FOR VETERANS CLAIMS', x, y, {align: 'center', paragraphGap: 0});
    y += 2*lh;

    const yDocketTop = y;
    doc.font(bold).text(`${res.locals.party1[0].toUpperCase()},`, x, y, {align: 'left'});
    for (let i = 1; i < res.locals.party1.length - 1; i++) {
        y += lh;
        doc.font(norm).text(`${res.locals.party1[i]},`, x, y, {align: 'left'});
    }

    y += lh;
    x += 72 / 2;
    console.log(res.locals.party1[res.locals.party1.length - 1]);
    doc.font(norm).text(`${res.locals.party1[res.locals.party1.length - 1]},`, x, y, {align: 'left'});
    y += (res.locals.party1.length + res.locals.party2.length <= 5 ? 2 : 1) * lh;
    x = 72;
    doc.text('v.', x, y, {align: 'left'});
    if (res.locals.party1.length + res.locals.party2.length <= 5) y += lh;
    y += lh;
    doc.font(bold).text(`${res.locals.party2[0].toUpperCase()},`, x, y, {align: 'left'});
    for (let i = 1; i < res.locals.party2.length - 1; i++) {
        y += lh;
        doc.font(norm).text(`${res.locals.party2[i]},`, x, y, {align: 'left'});
    }

    y += lh;
    x += 72 / 2;
    doc.font(norm).text(`${res.locals.party2[res.locals.party2.length - 1]},`, x, y, {align: 'left'});

    y = yDocketTop;
    x = 72;
    for (let i = 0; i < 3; i++) {
        doc.text(')', x, y, {align: 'center'});
        y += lh;
    }

    doc.text(')', x, y, {align: 'center'});
    x = 72 * 3.5;
    doc.text(`Vet. App. No. ${req.params.csnum}`, x, y, {align: 'center'});
    y += lh;
    x = 72;
    
    for (let i = 0; i < 4; i++) {
        doc.text(')', x, y, {align: 'center'});
        y += lh;
    }

    y += lh / 2;
    x = 72;
    doc.font(bold).text('NOTICE OF APPEARANCE', x, y, {align: 'center'});
    y += lh * 2;
    doc.font(norm).text(
        'The Clerk will please enter my appearance for the Secretary as the representative of record. I hereby certify that I am admitted to practice before this Court. I will accept service for the Secretary.',
        x, y,
        {align: 'left', indent: 36, lineGap: lh / 2}
    );
    
    y += 6*lh;
    

    x += 3 * 72;
    doc.font(norm).text('Respectfully submitted,', x, y);
    y += 2 * lh;
    doc.text(`/s/ ${res.locals.user.fullname}`, x, y, {underline: true});
    y += lh;
    doc.font(bold).text(`${res.locals.user.fullname.toUpperCase()}`, x, y);
    y += lh;
    doc.font(norm).text(`Appellate Attorney`, x, y);
    y += lh;
    doc.text(`${res.locals.user.office}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.department}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.street}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.city}, ${res.locals.user.state} ${res.locals.user.zip}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.phone}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.email}`, x, y);
    y += 2 * lh;
    doc.text(`Attorney for the Appellee`, x, y);
    y += lh;
    doc.text(`Secretary of Veterans Affairs`, x, y);

    doc.pipe(res);
    doc.end();
};

const genDates = (req, res, next) => {
    let dateDoc;
    if (req.params.date) {
        dateDoc = new Date(req.params.date);
    } else {
        dateDoc = new Date();
    }

    let dateStay = new Date(dateDoc);
    dateStay.setDate(dateStay.getDate() + 30);
    while (true) {
        if (isWeekend(dateStay)) {
            dateStay.setDate(dateStay.getDate() + 1);
        } else if (isHoliday(dateStay)) {
            dateStay.setDate(dateStay.getDate() + 1);
        } else {
            break;
        }
    }

    res.locals.dates = {
        doc: dateDoc.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
        stay: dateStay.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
    }

    console.log(res.locals);
    return next();

    function isWeekend(dateIn) {
        const day = dateIn.getDay();
        if (day === 0 || day === 6) return true;
        return false;
    }

    function isHoliday(dateIn) {
        const [ month, date, day, monthweek, year ] = [
            dateIn.getMonth(),
            dateIn.getDate(),
            dateIn.getDay(),
            Math.floor(dateIn.getDate() + 1 / 7),
            dateIn.getYear(),
        ]
        
        if (day === 1) {
            if (week === 0) {
                if (month === 8) return true;
            } else if (week === 1) {
                if (month === 9) return true;
            } else if (week === 2) {
                if (month === 0) return true;
                if (month === 1) return true;
            } else if (week === 3) {
                if (month === 4 && date > 24) return true;
            } else if (week === 4) {
                if (month === 4) return true;
            }
        }

        if (day === 4 && month === 10 && week === 3) return true;

        const newYrDay = new Date(`January 1, ${year}`).getDay();
        const newYrDayNextYr = new Date(`January 1, ${year + 1}`).getDay();
        if (
            (month === 0  && date === 1) ||
            (month === 0  && date === 2  && newYrDay === 0) ||
            (month === 11 && date === 31 && newYrDayNextYr === 6)
        ) return true;

        const inaugDay = new Date(`January 20, ${year}`).getDay();
        if (
            (month === 0 && date === 20 && year % 4 === 0) ||
            (month === 0 && date === 19 && year % 4 === 0 && inaugDay === 6) ||
            (month === 0 && date === 21 && year % 4 === 0 && inaugDay === 0)
        ) return true;

        const indDay = new Date(`July 4, ${year}`).getDay();
        if (
            (month === 6 && date === 4) ||
            (month === 6 && date === 3 && indDay === 6) ||
            (month === 6 && date === 5 && indDay === 0)
        ) return true;

        const vetDay = new Date(`November 11, ${year}`).getDay();
        if (
            (month === 10 && date === 11) ||
            (month === 10 && date === 10 && vetDay === 6) ||
            (month === 10 && date === 12 && vetDay === 0)
        ) return true;

        const chrisDay = new Date(`December 25, ${year}`).getDay();
        if (
            (month === 11 && date === 25) ||
            (month === 11 && date === 24 && chrisDay === 6) ||
            (month === 11 && date === 26 && chrisDay === 0)
        ) return true;

        return false;
    }
};

const genStay = (req, res, next) => {
    console.log(`docDate: ${res.locals.dates.doc}\n stayDate: ${res.locals.dates.stay}`);
    const doc = new pdfkit();

    const bold = 'fonts/Arial Bold.ttf';
    const norm = 'fonts/Arial.ttf';

    res.statusCode = 200;
    res.setHeader('Content-type', 'application/pdf');
    res.setHeader('Access-Control-Allow-Origin', '*');

    let y = 72;
    let x = 72;
    const lh = doc.heightOfString('TEST', { width: doc.widthOfString('TEST')}) + 2;

    doc.fontSize(13);
    doc.font(bold).text('IN THE UNITED STATES COURT OF APPEALS', x, y, {align: 'center', paragraphGap: 0});
    y += lh;
    doc.font(bold).text('FOR VETERANS CLAIMS', x, y, {align: 'center', paragraphGap: 0});
    y += lh;

    const yDocketTop = y;
    doc.font(bold).text(`${res.locals.party1[0].toUpperCase()},`, x, y, {align: 'left'});
    for (let i = 1; i < res.locals.party1.length - 1; i++) {
        y += lh;
        doc.font(norm).text(`${res.locals.party1[i]},`, x, y, {align: 'left'});
    }

    y += lh;
    x += 72 / 2;
    console.log(res.locals.party1[res.locals.party1.length - 1]);
    doc.font(norm).text(`${res.locals.party1[res.locals.party1.length - 1]},`, x, y, {align: 'left'});
    y += (res.locals.party1.length + res.locals.party2.length <= 5 ? 2 : 1) * lh;
    x = 72;
    doc.text('v.', x, y, {align: 'left'});
    if (res.locals.party1.length + res.locals.party2.length <= 5) y += lh;
    y += lh;
    doc.font(bold).text(`${res.locals.party2[0].toUpperCase()},`, x, y, {align: 'left'});
    for (let i = 1; i < res.locals.party2.length - 1; i++) {
        y += lh;
        doc.font(norm).text(`${res.locals.party2[i]},`, x, y, {align: 'left'});
    }

    y += lh;
    x += 72 / 2;
    doc.font(norm).text(`${res.locals.party2[res.locals.party2.length - 1]},`, x, y, {align: 'left'});

    y = yDocketTop;
    x = 72;
    for (let i = 0; i < 3; i++) {
        doc.text(')', x, y, {align: 'center'});
        y += lh;
    }

    doc.text(')', x, y, {align: 'center'});
    x = 72 * 3.5;
    doc.text(`Vet. App. No. ${req.params.csnum}`, x, y, {align: 'center'});
    y += lh;
    x = 72;
    
    for (let i = 0; i < 4; i++) {
        doc.text(')', x, y, {align: 'center'});
        y += lh;
    }

    y += lh / 2;
    x = 72;
    doc.font(bold).text('APPELLEE’S UNOPPOSED MOTION FOR A 30-DAY STAY', x, y, {align: 'center'});
    y += lh;
    doc.font(norm).text(
        `Pursuant to U.S. Vet. App. R. 5, 27, and 45, the Secretary moves the Court for a 30-day stay of proceedings from ${res.locals.dates.doc}, until ${res.locals.dates.stay}, in the interest of judicial efficiency as the parties consider the prospects of a joint resolution of the matter on appeal.`,
        x, y,
        {align: 'left', indent: 36, lineGap: lh / 2}
    );
    doc.font(bold).text(
        `WHEREFORE,`, {align: 'left', indent: 36, lineGap: lh / 2, continued: true}
    ).font(norm).text(` the Secretary respectfully moves the Court for a 30-day stay of proceedings, until ${res.locals.dates.stay}.`);
    y = doc.y;
    y += lh;
    x += 3 * 72;
    doc.font(norm).text('Respectfully submitted,', x, y);
    y += 2 * lh;
    doc.text(`/s/ ${res.locals.user.fullname}`, x, y, {underline: true});
    y += lh;
    doc.font(bold).text(`${res.locals.user.fullname.toUpperCase()}`, x, y);
    y += lh;
    doc.font(norm).text(`Appellate Attorney`, x, y);
    y += lh;
    doc.text(`${res.locals.user.office}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.department}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.street}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.city}, ${res.locals.user.state} ${res.locals.user.zip}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.phone}`, x, y);
    y += lh;
    doc.text(`${res.locals.user.email}`, x, y);
    y += 2 * lh;
    doc.text(`Attorney for the Appellee`, x, y);
    y += lh;
    doc.text(`Secretary of Veterans Affairs`, x, y);

    doc.pipe(res);
    doc.end();
};

router.get('/noa', (req, res, next) => {
    return res.json({ success: false, message: 'No case number!'});
});

router.get('/stay', (req, res, next) => {
    return res.json({ success: false, message: 'No case number!'});
});

router.get('/noa/:csnum', getCaseReport, parseCaseReport, genNoa);
router.get('/stay/:csnum/:date', getCaseReport, parseCaseReport, genDates, genStay);
router.get('/stay/:csnum', getCaseReport, parseCaseReport, genDates, genStay);

module.exports = router;
