import moment from 'moment'
import commaNumber from 'comma-number';

const auth = JSON.parse(sessionStorage.getItem("auth"));


const permissions = () => {
    let access = [];
    if (auth?.permissions){
        access = JSON.parse(auth.permissions);
    }
    if (access.length > 0) {
        access = access.map(permission => permission.toLowerCase());
    }
    return access;
};

const authHeaders = {
  Authorization: `Bearer ${auth != null ? auth.token : ""}`,
};
const dateFormat = "DD-MMM-YYYY";
let amountFormat = commaNumber.bindWith(',', '.')

const pathSplitter = (path, index) => {
  const segments = path.split('/').filter(Boolean);
  return segments[index] || undefined;
};

let getLastPathSegment = () => {
 // Split pathname by '/', filter out empty segments, and get the last segment
 const parts = window.location.pathname.split('/').filter(Boolean);
 let lastSegment = parts.pop() || ''; // Get the last segment or an empty string if none

 // Replace hyphens with spaces, convert to lowercase, and trim any leading/trailing spaces
 lastSegment = lastSegment
   .replace(/-/g, ' ')   // Replace all hyphens with spaces
   .toLowerCase()        // Convert to lowercase
   .trim();              // Remove any leading or trailing spaces
   

 return lastSegment;
};

const convertNumberToWords =  (amountToWord)=>{
  var words = new Array();
  words[0] = '';
  words[1] = 'One';
  words[2] = 'Two';
  words[3] = 'Three';
  words[4] = 'Four';
  words[5] = 'Five';
  words[6] = 'Six';
  words[7] = 'Seven';
  words[8] = 'Eight';
  words[9] = 'Nine';
  words[10] = 'Ten';
  words[11] = 'Eleven';
  words[12] = 'Twelve';
  words[13] = 'Thirteen';
  words[14] = 'Fourteen';
  words[15] = 'Fifteen';
  words[16] = 'Sixteen';
  words[17] = 'Seventeen';
  words[18] = 'Eighteen';
  words[19] = 'Nineteen';
  words[20] = 'Twenty';
  words[30] = 'Thirty';
  words[40] = 'Forty';
  words[50] = 'Fifty';
  words[60] = 'Sixty';
  words[70] = 'Seventy';
  words[80] = 'Eighty';
  words[90] = 'Ninety';
  let amount = amountToWord == null ? '0.00' : amountToWord.toString();
  var atemp = amount.split(".");
  var number = atemp[0].split(",").join("");
  var n_length = number.length;
  var words_string = "";
  
  if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
          received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
          n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++, j++) {
          if (i == 0 || i == 2 || i == 4 || i == 7) {
              if (n_array[i] == 1) {
                  n_array[j] = 10 + parseInt(n_array[j]);
                  n_array[i] = 0;
              }
          }
      }
      let value = "";
      for (var i = 0; i < 9; i++) {
          if (i == 0 || i == 2 || i == 4 || i == 7) {
              value = n_array[i] * 10;
          } else {
              value = n_array[i];
          }
          if (value != 0) {
              words_string += words[value] + " ";
          }
          if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
              words_string += "Crores ";
          }
          if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
              words_string += "Lakhs ";
          }
          if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
              words_string += "Thousand ";
          }
          if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
              words_string += "Hundred and ";
          } else if (i == 6 && value != 0) {
              words_string += "Hundred ";
          }
      }
      words_string = words_string.split("  ").join(" ");
  }
  return words_string + ` Only`;
}
let cashBankAccountFilterTypes = "Cash,Bank Account,Card,Mobile Banking"


export { auth, authHeaders, dateFormat,amountFormat,pathSplitter,getLastPathSegment,  cashBankAccountFilterTypes,convertNumberToWords,permissions};
