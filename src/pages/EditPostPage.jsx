import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .eq('id', id)
        .single()
      if (error) console.error(error)
      else {
        setTitle(data.title)
        setContent(data.content || '')
        setImageUrl(data.image_url || '')
      }
    }
    fetchPost()
  }, [id])

  const handleUpdate = async () => {
    if (!title.trim()) {
      alert('Title is required!')
      return
    }

    const { error } = await supabase
      .from('posts')
      .update({ title: title.trim(), content, image_url: imageUrl })
      .eq('id', id)

    if (error) {
      console.error(error)
      alert('Something went wrong.')
      return
    }

    navigate(`/post/${id}`)
  }

  return (
    <div>
      <Link to={`/post/${id}`} className="back-link">← Back to Post</Link>
      <div className="form-card">
        <h2>Edit Post</h2>

        <div className="form-group">
          <label>Title *</label>
          <input
            className="form-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Content (Optional)</label>
          <textarea
            className="form-textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input
            className="form-input"
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleUpdate}>
          Update Post
        </button>
      </div>
    </div>
  )
}

export default EditPostPage
