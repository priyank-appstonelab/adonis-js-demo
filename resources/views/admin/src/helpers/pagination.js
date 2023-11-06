function replaceQueryParam(param, newval, search) {
  var questionIndex = search.indexOf("?");

  if (questionIndex < 0) {
    search = search + "?";
    search = search + param + "=" + newval;
    return search;
  }

  var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
  var query = search.replace(regex, "$1").replace(/&$/, "");

  var indexOfEquals = query.indexOf("=");

  return (
    (indexOfEquals >= 0 ? query + "&" : query + "") +
    (newval ? param + "=" + newval : "")
  );
}

function getPaginationData(data, moreParams) {
  console.log(data, moreParams, "1");
  let current_url = location.href;
  for (var key in moreParams) {
    current_url = replaceQueryParam(key, moreParams[key], current_url);
  }

  return {
    total: data.total,
    per_page: data.per_page,
    current_page: data.current_page,
    last_page: data.last_page,
    next_page_url:
      data.current_page > 1
        ? replaceQueryParam("page", data.current_page, current_url)
        : null,
    prev_page_url:
      data.current_page != data.last_page
        ? replaceQueryParam("page", data.current_page - 1, current_url)
        : null,
    from:
      parseInt(data.current_page) * parseInt(data.per_page) -
      parseInt(data.per_page) +
      1,
    to: parseInt(data.current_page) * parseInt(data.per_page),
  };
}
export default getPaginationData;
