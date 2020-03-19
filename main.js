// specify the columns
var columnDefs = [
    {
        headerName: 'Country',
        field: 'country',
        enableRowGroup: true, // allow gui to set grouping for this column
        enablePivot: true, // allow gui to set pivot for this column
        filter: 'agSetColumnFilter',
    },
    {
        headerName: 'Year',
        field: 'year',
        enableRowGroup: true,
        enablePivot: true,
        pivotComparator: MyYearPivotComparator,
        filter: 'agNumberColumnFilter',
    },
    {
        headerName: 'Sport',
        field: 'sport',
        enableRowGroup: true,
        enablePivot: true,
        filter: 'agSetColumnFilter',
    },
    {
        headerName: 'Athlete',
        field: 'athlete',
        enableRowGroup: true,
        enablePivot: true,
        filter: 'agSetColumnFilter',
    },
    {
        headerName: 'Name Length',
        valueGetter: 'data ? data.athlete.length : ""',
        filter: 'agNumberColumnFilter',
    },
    {
        headerName: 'Date',
        field: 'date',
        filter: 'agDateColumnFilter',
    },
    {
        headerName: 'Gold',
        field: 'gold',
        enableValue: true, // allow gui to set aggregations for this column
        filter: 'agNumberColumnFilter',
    },
    {
        headerName: 'Silver',
        field: 'silver',
        enableValue: true,
        filter: 'agNumberColumnFilter',
    },
    {
        headerName: 'Bronze',
        field: 'bronze',
        enableValue: true,
        filter: 'agNumberColumnFilter',
    }
];

// specify the default columns options
var defaultColDef = {
    /* flex: 1, // show all columns in the grid without vertical scrollbar */
    sortable: true,
    filter: true,
    filterParams: {
        applyButton: true,
        clearButton: true,
        resetButton: true,
        textFormatter: replaceAccents,
    },
    resizable: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
};

// specify the group columns options
var autoGroupColumnDef = {
    // headerName: 'CUSTOM NAME',
    cellClass: getIndentClass,
    minWidth: 250,
    flex: 1,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
        suppressCount: true, // turn off the row count
        suppressDoubleClickExpand: true, // turn off double click for expand
        suppressEnterExpand: true, // turn off expand on Enter key
        suppressPadding: true, // turn off padding in the child rows
        checkbox: true, // enable checkbox selection
        footerValueGetter: function (params) { return 'Total (' + params.value + ')'; },
        // use an expression to return a footer value, this gives the same result as above
        // footerValueGetter: '"Total (" + x + ")"'
    }
};

// let the grid know which columns and what data to use
var gridOptions = {
    /* column defs */
    columnDefs: columnDefs,
    defaultColDef: defaultColDef,

    /* selection */
    enableRangeSelection: true,
    rowSelection: 'multiple',

    /* excel */
    excelStyles: getExcelStyles(),

    /* grouping */
    autoGroupColumnDef: autoGroupColumnDef,
    groupHideOpenParents: true, // Excel tabular format
    groupSelectsChildren: true,
    groupSelectsFiltered: true, // only the children that pass the current filter will get selected
    groupMultiAutoColumn: true, // automatically creates one column for each individual group
    rowGroupPanelShow: 'always', // 'never' | 'always' | 'onlyWhenGrouping'
    suppressDragLeaveHidesColumns: true,
    groupIncludeFooter: true,
    groupIncludeTotalFooter: true,
    rememberGroupStateWhenNewData: true,
    groupDefaultExpanded: 0,

    // groupUseEntireRow: true, // mutually exclusive with autoGroupColumnDef and groupHideOpenParents options
    // groupRowRenderer: 'agGroupCellRenderer',
    // groupRowRendererParams: {
    //     suppressCount: true,
    //     checkbox: true,
    //     // innerRenderer is optional, we could leave this out and use the default
    //     innerRenderer: function (params) { return params.node.key; },
    // },
    // defaultGroupSortComparator: function (nodeA, nodeB) {
    //     if (nodeA.key < nodeB.key) {
    //         return -1;
    //     } else if (nodeA.key > nodeB.key) {
    //         return 1;
    //     } else {
    //         return 0;
    //     }
    // },

    /* pivoting */
    pivotPanelShow: 'always',
    pivotColumnGroupTotals: 'after', // 'before' | 'after'
    pivotRowTotals: 'before',
    // this is a callback that gets called on each column definition
    processSecondaryColDef: function (colDef) {
        // make all the columns upper case
        colDef.headerName = colDef.headerName.toUpperCase();

        // the pivot keys are the keys use for the pivot
        // don't change these, but you can use them for your information
        // console.log('Pivot Keys:');
        // console.log(colDef.pivotKeys);
        // // the value column is the value we are aggregating on
        // console.log('Pivot Value Keys:');
        // console.log(colDef.pivotValueColumn);
    },

    // QUESTION: how to retrieve grouping column? use agGroupCellRenderer?
    // this is a callback that gets called on each group definition
    processSecondaryColGroupDef: function (colGroupDef) {
        // for fun, add a css class for 2002
        if (colGroupDef.pivotKeys[0] === '2002') {
            colGroupDef.headerClass = 'color-background-pivot';
        }
        // put 'year' in front of each group
        colGroupDef.headerName = 'Year ' + colGroupDef.headerName;
    },

    /* icons (https://www.ag-grid.com/javascript-grid-icons/) */
    icons: {
        // shown on row group when contracted (click to expand)
        groupContracted: '<img src="https://cdn.rawgit.com/ag-grid/ag-grid-docs/56853d5aa6513433f77ac3f808a4681fdd21ea1d/src/javascript-grid-icons/plus.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
        // shown on row group when expanded (click to contract)
        groupExpanded: '<img src="https://cdn.rawgit.com/ag-grid/ag-grid-docs/56853d5aa6513433f77ac3f808a4681fdd21ea1d/src/javascript-grid-icons/minus.png" style="height: 12px; width: 12px;padding-right: 2px"/>',
        // column tool panel tab
        columns: '<i class="fa fa-table"/>',
        // filter tool panel tab
        filter: '<i class="fa fa-filter"/>',
        'custom-stats': '<span class="ag-icon ag-icon-custom-stats"></span>',
    },

    /* filtering */
    popupParent: document.querySelector('body'), // enable size modulation of filtering menu
    floatingFilter: true,

    /* side bar */
    sideBar: {
        defaultToolPanel: 'columns',
        // hiddenByDefault: true,
        position: 'left', // 'left' | 'right'
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                    // suppressRowGroups: true,
                    // suppressValues: true,
                }
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            },
            {
                id: 'customStats',
                labelDefault: 'Custom Stats',
                labelKey: 'customStats',
                iconKey: 'custom-stats',
                toolPanel: 'customStatsToolPanel',
            },
        ],
    },

    /* status bar */
    statusBar: {
        statusPanels: [
            {
                statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'
            },
            {
                statusPanel: 'agTotalRowCountComponent',
                align: 'center'
            },
            {
                statusPanel: 'agFilteredRowCountComponent',
            },
            {
                statusPanel: 'agSelectedRowCountComponent',
            },
            {
                statusPanel: 'agAggregationComponent',
                statusPanelParams: {
                    // possible values are: 'count', 'sum', 'min', 'max', 'avg'
                    aggFuncs: ['min', 'max', 'avg']
                }
            },
        ],
    },

    /* components */
    components: {
        customStatsToolPanel: CustomStatsToolPanel,
    },

    /* other */
    animateRows: true,
    getContextMenuItems: getContextMenuItems,
    // we don't want the grid putting in 'sum' in the headers for us
    suppressAggFuncInHeader: true,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid.simpleHttpRequest({
        url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        }
        );
});

function getSelectedRows() {
    var selectedNodes = gridOptions.api.getSelectedNodes()
    var selectedData = selectedNodes.map(function (node) { return node.data })
    var selectedDataStringPresentation = selectedData.map(function (node) { return node.country + ' ' + node.year }).join(', ')
    alert('Selected nodes: ' + selectedDataStringPresentation);
}

function expandAll() {
    gridOptions.api.expandAll();
}

function collapseAll() {
    gridOptions.api.collapseAll();
}

function expandRussia() {
    gridOptions.api.forEachNode(function (node) {
        if (node.key === 'Russia') {
            node.setExpanded(true);
        }
    });
}

function getContextMenuItems(params) {
    return [
        'autoSizeAll',
        'expandAll',
        'contractAll',
        'resetColumns',
        'separator',
        'copy',
        'copyWithHeaders',
        'paste',
        'separator',
        'export',
        'separator',
        'chartRange'
    ];
}