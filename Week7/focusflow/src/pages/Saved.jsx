import Card from "../components/Card";
import { useAppContext } from "../context/AppContext";

export default function Saved() {
  const { savedItems } = useAppContext();

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="section-chip">Saved</span>
          <h2>Your favorite posts</h2>
          <p>These items are stored in shared global state using Context API.</p>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <p className="empty-message">You have not saved any posts yet.</p>
      ) : (
        <div className="card-grid">
          {savedItems.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}