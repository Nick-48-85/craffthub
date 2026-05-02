import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function timeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .eq('id', id)
      .single()
    if (error) console.error(error)
    else setPost(data)
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select()
      .eq('post_id', id)
      .order('created_at', { ascending: true })
    if (error) console.error(error)
    else setComments(data)
  }

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select()
      .single()
    if (!error && data) setPost(data)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    // delete comments first to avoid FK constraint issues
    await supabase.from('comments').delete().eq('post_id', id)
    await supabase.from('posts').delete().eq('id', id)
    navigate('/')
  }

  const handleComment = async () => {
    if (!commentText.trim()) return
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: Number(id), content: commentText.trim() })
      .select()
      .single()
    if (!error && data) {
      setComments([...comments, data])
      setCommentText('')
    }
  }

  if (!post) return <div className="empty-state">Loading post...</div>

  return (
    <div>
      <Link to="/" className="back-link">← Back to Feed</Link>

      {/* Post Detail */}
      <div className="post-detail">
        <div className="post-detail-meta">Posted {timeAgo(post.created_at)}</div>
        <div className="post-detail-title">{post.title}</div>

        {post.content && (
          <div className="post-detail-content">{post.content}</div>
        )}

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post image"
            className="post-detail-image"
            onError={e => { e.target.style.display = 'none' }}
          />
        )}

        {/* Upvote */}
        <div className="upvote-row">
          <button className="upvote-btn" onClick={handleUpvote}>
            ⬆ Upvote
          </button>
          <span className="upvote-count">{post.upvotes} upvotes</span>
        </div>

        {/* Edit / Delete */}
        <div className="post-actions">
          <Link to={`/edit/${post.id}`} className="btn btn-ghost">✏️ Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>🗑️ Delete</button>
        </div>
      </div>

      {/* Comments */}
      <div className="comments-section">
        <h3>💬 Comments ({comments.length})</h3>

        {comments.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            No comments yet. Be the first!
          </div>
        )}

        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-meta">{timeAgo(comment.created_at)}</div>
            <div>{comment.content}</div>
          </div>
        ))}

        <div className="comment-form">
          <textarea
            className="form-textarea"
            placeholder="Leave a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            style={{ minHeight: '80px' }}
          />
          <button
            className="btn btn-primary"
            onClick={handleComment}
            style={{ alignSelf: 'flex-start' }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostPage
