function MyYearPivotComparator(a, b) {
    var requiredOrder = ['2012', '2010', '2008', '2006', '2004', '2002', '2000'];
    return requiredOrder.indexOf(a) - requiredOrder.indexOf(b);
}