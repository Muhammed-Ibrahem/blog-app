export const convertPostsToAnArray = (data) => {
  const Arr = [];
  for (const key in data) {
    // if (!data[key]?.live) continue;
    Arr.push({
      postId: key,
      ...data[key],
    });
  }
  return Arr.sort((a, e) => e.time - a.time);
};
