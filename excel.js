function getExcelStyles() {
    return [
        {
            id: 'indent-1',
            alignment: {
                indent: 1,
            },
            // note, dataType: 'string' required to ensure that numeric values aren't right-aligned
            dataType: 'string',
        },
        {
            id: 'indent-2',
            alignment: {
                indent: 2,
            },
            dataType: 'string',
        },
        {
            id: 'indent-3',
            alignment: {
                indent: 3,
            },
            dataType: 'string',
        },
    ]
}

function rowGroupCallback(params) {
    return params.node.key;
}

function getIndentClass(params) {
    var indent = 0;
    var node = params.node;
    while (node && node.parent) {
        indent++;
        node = node.parent;
    }
    return ['indent-' + indent];
}

function onBtnExportDataAsExcel() {
    gridOptions.api.exportDataAsExcel({
        processRowGroupCallback: rowGroupCallback,
    });
}