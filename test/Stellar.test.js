const AsciiTable = require('ascii-table');

contract('Stellar', function ([_, owner, recipient,]) {
    const singleReport = [2315.39, 2303.58, 6151.93, 1844.82, 4264.79, 5725.79, 5857.99, 1371.85, 4544.31, 5319.75];
    const batchReport = [29406.01, 29526.77, 16902.48, 28168.85, 26407.93, 29968.64, 24758.33, 22514.30, 27960.55, 34913.40];
    const singleBatchReport = [5697.70, 2679.04, 4000.03, 3683.63, 2880.02, 6189.71, 3649.63, 3672.30, 3311.37, 3800.43];

    beforeEach(async function () {
    });

    describe.only('fake news', function () {
        it('1 should equal 1', async function () {
            assert.equal(1, 1);
        });
    });

    after(async function () {

        console.log('\n');

        let singleTable = new AsciiTable('Stellar (Single)');
        singleTable.setHeading('tx timings (millis)');
        singleReport.forEach((x) => {
            singleTable.addRow(x);
        });
        console.log(singleTable.toString());
        console.log('\n');

        let batchTable = new AsciiTable('Stellar (Batch)');
        batchTable.setHeading('tx timings (millis)');
        batchReport.forEach((x) => {
            batchTable.addRow(x);
        });
        console.log(batchTable.toString());
        console.log('\n');
    });

});
