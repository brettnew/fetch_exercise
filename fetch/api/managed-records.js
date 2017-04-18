import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
  let uri = URI(window.path + "?limit=11");
  return sendRequest(uri, options);
}

function sendRequest(uri, options = {}) {
  let previousPage = 0;
  let nextPage = 2;

  if ("page" in options) {
    previousPage = options.page - 1;
    nextPage = options.page + 1;
    let offset = (options.page - 1) * 10;
    uri.addSearch("offset", offset);
  }

  if ("colors" in options) { uri.addSearch("color[]", options.colors); }

  return fetch(uri, options)
  .then(response => {
    return response.json();
  }).then(returnedValue => {

    let result = {
                    previousPage: null,
                    nextPage: null,
                    ids: [],
                    open: [],
                    closedPrimaryCount: 0
                  };

    returnedValue.forEach(function(obj, i) {

      if (i < 10) {
        result.ids.push(obj.id);

        (obj.color === "red" || obj.color === "yellow" || obj.color === "blue")
        ? obj.isPrimary = true : obj.isPrimary = false;

        if (obj.disposition === "closed" && obj.isPrimary) {
          result.closedPrimaryCount++;
        }

        if (obj.disposition === "open") { result.open.push(obj); }

      } else {
        result.nextPage = nextPage;
      }
    });

    if (previousPage !== 0) { result.previousPage = previousPage; }

    return result;
  })
  .catch(error => console.log("error", error));
}

export default retrieve;
