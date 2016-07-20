/*
 * @(#)util.js
 */

/*
 * Author: Jianmin Liu
 * Created: 2015/07/20
 */

var MarkLogic;

(function(MarkLogic) {
  (function(Util) {
    function parseMultiPart(body, contentType) {
      // Examples for content types:
      // multipart/mixed; boundary=ML_BOUNDARY_7372759131301359002
      var contentTypeLen = contentType.length;
      var boundary = null;
  
      if (15 <= contentTypeLen && contentType.substr(0, 15) === 'multipart/mixed') {
        boundary = contentType.replace(/^multipart.mixed\s*;\s*boundary\s*=\s*([^\s;]+)([\s;].*)?$/, '$1');
        if (boundary.length === contentTypeLen) {
          // error: multipart/mixed response without boundary
          return null;
        }
      }

      // Parse Content-Disposition header string.
      function parseContentDisposition(str) {
        var qescRegExp = /\\([\u0000-\u007f])/g;
        var params = {};
        var parts = str.split(';');

        for (var i = 0; i < parts.length; i++) {
          var part = parts[i].trim();
          var segments = part.split('=');
          if (segments.length === 2) {
            var key = segments[0];
            var value = segments[1];
            if (value[0] === '"') {
              // remove quotes and escapes
              value = value.substr(1, value.length - 2).replace(qescRegExp, '$1');
            }
            params[key] = value;
          }
        }

        return params;
      }

      // \r\n is part of the boundary.
      boundary = '\r\n--' + boundary;
      var s = body;

      // Prepend what has been stripped by the body parsing mechanism.
      s = '\r\n' + s;

      var parts = s.split(new RegExp(boundary));
      var docs = [];
      var metadata = null;

      // First part is a preamble, last part is closing '--'
      for (var i = 1; i < parts.length-1; i++) {
        var subparts = parts[i].split('\r\n\r\n');
        var headers = subparts[0].split('\r\n');

        for (var j = 1; j < headers.length; j++) {
          var header = headers[j];
          var segments = header.split(':');
          if (segments.length === 2) {
            if ('content-disposition' === segments[0].toLowerCase()) {
              var params = parseContentDisposition(segments[1]);
              var uri = params.filename;
              if (uri) {
                var doc = JSON.parse(subparts[1]);
                doc.uri = uri;
                docs.push(doc);
                break;
              } else {
                metadata = JSON.parse(subparts[1]);
              }
            }
          }
        }
      }
      return {results: docs, metadata: metadata};
    }
    Util.parseMultiPart = parseMultiPart;

  })(MarkLogic.Util || (MarkLogic.Util = {}));
  var Util = MarkLogic.Util;
})(MarkLogic || (MarkLogic = {}));

/* end of util.js */
