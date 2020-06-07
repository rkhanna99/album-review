/*The module I created for the final project*/


/*Helper function that will be used to sort names by Alphabetical order*/
function sort_name(val1, val2) {
  let val1Name = val1["album_name"].toUpperCase();
  let val2Name = val2["album_name"].toUpperCase();
  return val1Name.localeCompare(val2Name);
}

module.exports = {
  sort_name: sort_name
}
