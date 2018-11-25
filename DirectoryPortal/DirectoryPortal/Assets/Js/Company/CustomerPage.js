﻿var g_CompanyID = jQuery('#g_HiddenCompanyID').val();
var g_AuthorizedToken = jQuery('#g_HiddenAuthorizedToken').val();
var g_ServiceUrl = jQuery('#g_HiddenServiceUrl').val();
var g_LocalUrl = jQuery('#g_HiddenLocalUrl').val();

var g_TempSelectedSortColumn = "";
var g_TempSelectedSortOrder = true;

$("#mainTableFilterSearch").keyup(function (e) {

    if (e.keyCode === 13) {
        GetAllCustomersByPage(1);
    }
});

GetAllCustomersByPage(1);

function GetAllCustomersByPage(pageIndex, selectedSortColumn, selectedSortOrder) {

    if (selectedSortColumn === g_TempSelectedSortColumn) { g_TempSelectedSortOrder = g_TempSelectedSortOrder === true ? false : true; } else { g_TempSelectedSortOrder = true; }

    g_TempSelectedSortColumn = selectedSortColumn === undefined ? "" : selectedSortColumn;
    
    var pageSize = jQuery('#mainTablePageSize').val();

    var filterStatus = jQuery('#mainTableFilterStatus').val();
    var filterSearch = jQuery('#mainTableFilterSearch').val();

    var params = "?companyID=" + g_CompanyID + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&sortColumn=" + g_TempSelectedSortColumn + "&sortOrder=" + g_TempSelectedSortOrder + "&filterStatus=" + filterStatus + "&filterSearch=" + filterSearch;

    jQuery.support.cors = true;
    $.ajax({
        type: "GET",
        url: g_ServiceUrl + "/api/Customer/GetCustomer" + params,
        dataType: 'json',
        cache: false,
        headers: { "Authorization": "Bearer " + g_AuthorizedToken},
        success: function (data) {
            if (data !== null && data !== undefined && data !== "undefined" && data !== "") {

                WriteResponseAllCustomersByPage(data.Result);
                WritePaginationAllCustomersByPage(pageIndex, data.AllItemCount, pageSize);
            } else {

                alert("Giriş işleminiz sırasında bir hata oluştu!");
            }
        },
        error: function (xhr, txtStatus, errorThrown) {
            alert("Hata Kodu:" + xhr.status + " " + txtStatus + "\n" + errorThrown);
        }
    });
}

function WriteResponseAllCustomersByPage(customers) {

    var strResponse = '';
    jQuery.each(customers, function (index, customer) {

        var statusColor = "#f0ad4e", statusTitle = "Passive";
        if (customer.Status === 1) { statusColor = "#5bc0de"; statusTitle = "Active"; }
        if (customer.Status === -1) { statusColor = "#dc2e2e"; statusTitle = "Deleted"; }

        strResponse += '<tr id="customer' + customer.ID + '">';
        strResponse += '<td> <img id="imgCustomer' + customer.ID + '" class="imgTable" src = "/Assets/Image/user-silhouette.png" ></td>';
        strResponse += '<td>' + customer.Name + '</td>';
        strResponse += '<td>' + customer.Email + '</td>';
        strResponse += '<td>' + customer.Phone + '</td>';
        strResponse += '<td>' + (customer.Description !== null ? customer.Description : '') + '</td>';
        strResponse += '<td> <i class="fa fa-circle" title="' + statusTitle + '" style="color:' + statusColor + '"></i></td>';
        strResponse += '</tr>';
    });

    jQuery('#mainTableBody').html(strResponse);
}

function WritePaginationAllCustomersByPage(currentPageIndex, allItemCount, currentPageSize) {

    var strResult = "", pageCount = Math.floor(allItemCount / currentPageSize), startIndex = currentPageIndex - 2, finisIndex = currentPageIndex;
    if (allItemCount % currentPageSize !== 0) { pageCount++; }

    if (startIndex < 0) { startIndex = 0; if (finisIndex < pageCount) finisIndex = 2; }
    if (finisIndex < pageCount) { finisIndex++; }

    if (currentPageIndex > 4) { strResult += '<li><a class="input-sm cursorPointer" onclick="GetAllCustomersByPage(1); return false;" aria-label="Previous"><i  class="fa fa-angle-double-left"></i></a></li>'; }
    if (currentPageIndex > 1) { strResult += '<li><a class="input-sm cursorPointer" onclick="GetAllCustomersByPage(' + (currentPageIndex - 1) + ');return false;"><i  class="fa fa-chevron-left"></i></a></li>'; }
    for (var i = startIndex; i < finisIndex; i++) { strResult += '<li><a class="input-sm cursorPointer" onclick="GetAllCustomersByPage(' + (i + 1) + '); return false;">' + (i + 1) + '</a></li>'; }
    if (currentPageIndex < pageCount) { strResult += '<li><a class="input-sm cursorPointer" onclick="GetAllCustomersByPage(' + (currentPageIndex + 1) + ');return false;"><i class="fa fa-chevron-right"></i></a></li>'; }
    if (currentPageIndex < pageCount - 3) { strResult += '<li><a class="input-sm cursorPointer" onclick="GetAllCustomersByPage(' + pageCount + '); return false;" aria-label="Next"><i  class="fa fa-angle-double-right"></i></a></li>'; }

    jQuery("#mainTablePagination").html(strResult);

    var strTotalCountShow = "Customers " + (((currentPageIndex - 1) * currentPageSize) + 1) + "-" + (((currentPageIndex) * currentPageSize)) + " / " + allItemCount + " Total";
    jQuery("#mainTablePaginationInfo").html(strTotalCountShow);

}