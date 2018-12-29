/* CONSTANTS */

// ITEMS TITLE
var ITEMS = [
  "חלב",
  "גבנצ"
];

UPDATE_AMAZON_DATA_TYPE = "הכנסת משיכה";
RESET_AMAZON_DATA_TYPE = "איפוס מצב המטבחון";

ITEMS_FIRST_START = 2;
SHEET_AMAZON_FORM = 0;

RAW_DATA_COL = 2;
STAT_DATA_COL = 3;

TIME_FORMAT = "dd/MM/yy HH:mm";
TIME_ZONE = "Asia/Jerusalem";
date = new Date();

// Sheets
var ss = SpreadsheetApp.getActiveSpreadsheet();

var elementCount = ITEMS.length;
var itemSheets = [];

for (var i = 0; i < elementCount; i++) {
  itemSheets.push(ss.getSheetByName(ITEMS[i]));
}

// Helper functions
function isInt(str) {
  return !isNaN(parseInt(str)) && isFinite(str);
}

// Form submit trigger
function onFormSubmit() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[SHEET_AMAZON_FORM];
  
  // At the end just delete all rows
  var formUrl = ss.getFormUrl();
  var form = FormApp.openByUrl(formUrl);
  form.deleteAllResponses();
  
  // Run update for every item in the sheet
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    // Update the sheet according to the data
    // in the line.
    insertTheDataIn(data[i]);
    sheet.deleteRow(2);
  }
}

// Form submit updater, takes a row of form data
// in the style of [time, TYPE, item1, item2, ...]
function insertTheDataIn(data) {
  // Get type of data
  var type = data[1];
  
  // Update accordingly
  if (type == UPDATE_AMAZON_DATA_TYPE) {
    updateUsingAmazonData(data);
  }
  
  if (type == RESET_AMAZON_DATA_TYPE) {
    resetUsingAmazonData(data);
  }
}

// Form submit resetter, Resets the numbers in the sheet
// to the current numbers in data
function resetUsingAmazonData(data) {
  // For every data element, update its sheet
  // With new data, when the new data is just
  // the data
    
  for (var i = ITEMS_FIRST_START; i < data.length; i++) {
    var sheet = itemSheets[i-ITEMS_FIRST_START];
    var formattedDate = Utilities.formatDate(date, TIME_ZONE, TIME_FORMAT);
    
    // Append new cell
    sheet.appendRow([formattedDate, 'amazon_reset', data[i], ""]);
  }
}

// Form submit updater, Adds the numbers in the sheet
// to the current numbers in data
function updateUsingAmazonData(data) {
  // For every data element, update its sheet
  // With new data, when the new data is basically
  // last_data + data
  
  for (var i = ITEMS_FIRST_START; i < data.length; i++) {
    // Check non emptiness of the number, If it is 
    // empty then we don't update it
    if (!isInt(data[i])) {
      continue;
    }
    
    var sheet = itemSheets[i-ITEMS_FIRST_START];
    var formattedDate = Utilities.formatDate(date, TIME_ZONE, TIME_FORMAT);
    
    // Get last row
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var old_data = sheet.getRange(lastRow, 1, 1, lastCol).getValues()[0];
    
    // Fix them to be always numberic,
    // isInt is a function I implemented.
    var old_raw = old_data[RAW_DATA_COL];
    var old_stat = old_data[STAT_DATA_COL];
    
    if (!isInt(old_raw)) {
      old_raw = 0;
    }
    
    old_raw = parseInt(old_raw);
    
    raw = parseInt(data[i]);
    // Append new cell
    sheet.appendRow([formattedDate, 'amazon_update', old_raw + raw, ""]);
  }
}
