const express = require('express');
const router = express.Router();

const scraper = require('./scraper');
const genDates = require('./gendates');
const docGen = require('./docgen');

router.get('/noa', (req, res, next) => {
    return res.json({ success: false, message: 'No case number!'});
});

router.get('/stay', (req, res, next) => {
    return res.json({ success: false, message: 'No case number!'});
});

router.get(
    '/noa/:csnum', 
    scraper.getCaseReport, 
    scraper.parseCaseReport, 
    docGen.genNoa
);

router.get(
    '/stay/:csnum', 
    scraper.getCaseReport, 
    scraper.parseCaseReport, 
    genDates.genStayDates, 
    docGen.genStay
);

router.get(
    '/stay/:csnum/:date', 
    scraper.getCaseReport, 
    scraper.parseCaseReport, 
    genDates.genStayDates, 
    docGen.genStay
);

router.get(
    '/ext/:csnum/', 
    scraper.getCaseReport, 
    scraper.getPriorExtensions, 
    genDates.genExtensionDates, 
    docGen.genExtension
);

router.get(
    '/ext/:csnum/:date', 
    scraper.getCaseReport,
    scraper.getPriorExtensions, 
    genDates.genExtensionDates, 
    docGen.genExtension
);

module.exports = router;
