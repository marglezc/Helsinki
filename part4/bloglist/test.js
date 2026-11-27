
const mongoose = require('mongoose')
const Blog = require('./models/blog')

require('./mongo')

mongoose.connection.once('open', async () => {
  try {
    const blog = new Blog({
      title: 'Mi primera publicación',
      author: 'Mar',
      url: 'https://example.com',
      likes: 5
    })

    await blog.save()

    console.log('Blog saved successfully')

    const blogs = await Blog.find({})
    console.log(blogs)
  } catch (error) {
    console.log(error)
  } finally {
    await mongoose.connection.close()
  }
})
