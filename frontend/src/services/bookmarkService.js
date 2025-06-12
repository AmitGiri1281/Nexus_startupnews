export const getBookmarks = () => {
  const bookmarks = localStorage.getItem('startupNewsBookmarks');
  return bookmarks ? JSON.parse(bookmarks) : [];
};

export const addBookmark = (article) => {
  const bookmarks = getBookmarks();
  const existingIndex = bookmarks.findIndex(b => b.url === article.url);
  
  if (existingIndex === -1) {
    const newBookmarks = [...bookmarks, article];
    localStorage.setItem('startupNewsBookmarks', JSON.stringify(newBookmarks));
    return true;
  }
  return false;
};

export const removeBookmark = (articleUrl) => {
  const bookmarks = getBookmarks();
  const newBookmarks = bookmarks.filter(b => b.url !== articleUrl);
  localStorage.setItem('startupNewsBookmarks', JSON.stringify(newBookmarks));
};

export const isBookmarked = (articleUrl) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.url === articleUrl);
};