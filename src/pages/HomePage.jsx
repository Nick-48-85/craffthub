import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import PostCard from '../components/PostCard'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [orderBy, setOrderBy] = useState('created_at')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [orderBy])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .order(orderBy, { ascending: false })
    if (error) console.error(error)
    else setPosts(data)
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          style={{ width: 'auto' }}
          value={orderBy}
          onChange={e => setOrderBy(e.target.value)}
        >
          <option value="created_at">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
        <Link to="/create" className="btn btn-primary">+ New Post</Link>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No posts yet. Be the first to share!</div>
      ) : (
        filtered.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}

export default HomePage
