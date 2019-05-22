const pdfkit = require('pdfkit');

module.exports.genNoa = (req, res, next) => {
    const doc = new pdfkit();

    const bold = 'fonts/Arial Bold.ttf';
    const norm = 'fonts/Arial.ttf';
    const downloadFileName = `noa-${req.params.csnum}.pdf`;

    res.statusCode = 200;
    res.setHeader('Content-disposition', `attachment; filename=${downloadFileName}`);
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

module.exports.genStay = (req, res, next) => {
    console.log(`docDate: ${res.locals.dates.doc}\n stayDate: ${res.locals.dates.stay}`);
    const doc = new pdfkit();

    const bold = 'fonts/Arial Bold.ttf';
    const norm = 'fonts/Arial.ttf';
    const downloadFileName = req.params.date === undefined ?
        `stay-${req.params.csnum}-${new Date().toISOString().split('T')[0]}.pdf` :
        `stay-${req.params.csnum}-${req.params.date}.pdf`;

    res.statusCode = 200;
    res.setHeader('Content-disposition', `attachment; filename=${downloadFileName}`);
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
    y += 1.8 * lh;
    doc.font(bold).text(`${res.locals.user.general.toUpperCase()}`, x, y);
    y += lh;
    doc.font(norm).text(`General Counsel`, x, y);
    y += 1.8 * lh;
    doc.font(bold).text(`${res.locals.user.chief.toUpperCase()}`, x, y);
    y += lh;
    doc.font(norm).text(`Chief Counsel`, x, y);
    y += 1.8 * lh;
    doc.text(`/s/ ${res.locals.user.deputy}`, x, y, {underline: true});
    y += lh;
    doc.font(bold).text(`${res.locals.user.deputy.toUpperCase()}`, x, y);
    y += lh;
    doc.font(norm).text(`Deputy Chief Counsel`, x, y);
    y += 1.8 * lh;
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

    doc.pipe(res);
    doc.end();
};

module.exports.genExtension = (req, res, next) => {

}
