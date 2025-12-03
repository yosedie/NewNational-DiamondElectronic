// helper function for converting URL category name to friendly and more readable name
// For example "smart-watches" after this function will be "Smart Watches"
const formatCategoryName = (categoryName: string) => {
  const categoryNameArray = categoryName.split("-");
  return categoryNameArray
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// helper function for converting category name to URL category name
// For example "smart watches" after this function will be "smart-watches"
const convertCategoryNameToURLFriendly = (categoryName: string) => {
  const categoryNameArray = categoryName.split(" ");
  return categoryNameArray.join("-");
};

export { formatCategoryName, convertCategoryNameToURLFriendly };
