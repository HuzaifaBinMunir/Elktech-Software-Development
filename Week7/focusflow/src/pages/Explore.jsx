import { useEffect, useMemo, useState } from "react";
import { fetchPosts } from "../services/api";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="section-chip">Explore</span>
          <h2>Discover ideas and save your favorites</h2>
          <p>Browse content fetched from a live API and interact with the interface.</p>
        </div>
      </div>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && filteredPosts.length === 0 && (
        <p className="empty-message">No matching posts found.</p>
      )}

      {!loading && !error && filteredPosts.length > 0 && (
        <div className="card-grid">
          {filteredPosts.slice(0, 12).map((post) => (
            <Card key={post.id} item={post} />
          ))}
        </div>
      )}
    </section>
  );
}