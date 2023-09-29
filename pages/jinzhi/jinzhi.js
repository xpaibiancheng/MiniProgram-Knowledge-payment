Page({
    data: {
      binary: '',
      octal: '',
      decimal: '',
      hex: ''
    },
  
    binaryInput: function (e) {
      var decimal = parseInt(e.detail.value, 2);
      this.setData({
        binary: e.detail.value,
        octal: decimal.toString(8),
        decimal: decimal.toString(),
        hex: decimal.toString(16).toUpperCase()
      });
    },
  
    octalInput: function (e) {
      var decimal = parseInt(e.detail.value, 8);
      this.setData({
        binary: decimal.toString(2),
        octal: e.detail.value,
        decimal: decimal.toString(),
        hex: decimal.toString(16).toUpperCase()
      });
    },
  
    decimalInput: function (e) {
      var decimal = parseInt(e.detail.value);
      this.setData({
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: e.detail.value,
        hex: decimal.toString(16).toUpperCase()
      });
    },
  
    hexInput: function (e) {
      var decimal = parseInt(e.detail.value, 16);
      this.setData({
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        decimal: decimal.toString(),
        hex: e.detail.value.toUpperCase()
      });
    }
  })
  