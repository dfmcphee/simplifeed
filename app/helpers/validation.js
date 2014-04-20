exports.validEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

exports.validFileType = function (fileType){
  switch(fileType) {
  case 'image/jpeg':
    return true;
    break;
  case 'image/gif':
    return true;
    break;
  case 'image/png':
      return true;
      break;
  default:
    return false;
  }
}
