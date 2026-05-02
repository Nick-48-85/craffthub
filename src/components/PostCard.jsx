import { Link } from 'react-router-dom'

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

function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="post-card">
      <div className="post-card-meta">Posted {timeAgo(post.created_at)}</div>
      <div className="post-card-title">{post.title}</div>
      <div className="post-card-upvotes">⬆ {post.upvotes} upvotes</div>
    </Link>
  )
}

export default PostCard
