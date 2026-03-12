import { useAppContext } from "../context/AppContext";

export default function Card({ item }) {
  const { toggleSave, isSaved } = useAppContext();
  const saved = isSaved(item.id);

  return (
    <article className="card">
      <div className="card-top">
        <span className="card-tag">Post #{item.id}</span>
        <button className={saved ? "save-btn saved" : "save-btn"} onClick={() => toggleSave(item)}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <h3>{item.title}</h3>
      <p>{item.body}</p>

      <div className="card-footer">
        <span>👍 {item.reactions?.likes ?? 0} Likes</span>
        <span>👀 {item.views ?? 0} Views</span>
      </div>
    </article>
  );
}