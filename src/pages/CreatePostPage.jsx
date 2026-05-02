import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function CreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Title is required!')
      return
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({ title: title.trim(), content, image_url: imageUrl, upvotes: 0 })
      .select()
      .single()

    if (error) {
      console.error(error)
      alert('Something went wrong. Check the console.')
      return
    }

    navigate(`/post/${data.id}`)
  }

  return (
    <div>
      <Link to="/" className="back-link">← Back to Feed</Link>
      <div className="form-card">
        <h2>Create New Post</h2>

        <div className="form-group">
          <label>Title *</label>
          <input
            className="form-input"
            type="text"
            placeholder="What's on your mind? A build, a tip, a question..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Content (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Explain your build, share your story, or ask the community..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input
            className="form-input"
            type="text"
            placeholder="https://i.imgur.com/..."
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Create Post
        </button>
      </div>
    </div>
  )
}

export default CreatePostPage
