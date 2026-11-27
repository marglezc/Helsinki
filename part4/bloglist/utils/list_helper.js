
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((best, blog) =>
    blog.likes > best.likes ? blog : best
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const topAuthorBy = (blogs, metricKey, getIncrement) => {
  if (blogs.length === 0) {
    return null
  }

  const totals = new Map()
  for (const blog of blogs) {
    totals.set(blog.author, (totals.get(blog.author) || 0) + getIncrement(blog))
  }

  let topAuthor = null
  let maxTotal = -Infinity
  for (const [author, total] of totals.entries()) {
    if (total > maxTotal) {
      topAuthor = author
      maxTotal = total
    }
  }

  return { author: topAuthor, [metricKey]: maxTotal }
}

const mostBlogs = (blogs) => topAuthorBy(blogs, 'blogs', () => 1)

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
