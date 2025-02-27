import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  interface Post {
    id: number;
    title: string;
    body: string;
  }

  const [posts, setPosts] = useState<Post[] | []>([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [editId, setEditId] = useState<number | undefined>(undefined); // initialize with undefined

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get("http://localhost:3000/posts");
    const data = response.data;
    setPosts(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/posts",
      formData
    );
    if (response.status === 201) {
      setPosts([...posts, response.data]);
    }
    setFormData({ title: "", body: "" });
  };

  const handleEdit = (id: number) => {
    if (editId === id) {
      // If already editing, trigger save action (e.g., PUT request to update post)
      // Here, just toggle editId to undefined
      setEditId(undefined);
    } else {
      setEditId(id);
    }
  };

  const handleSave = async (post: Post) => {
    // Simulate a PUT request to save changes (you should replace this with actual API call)
    const updatedPost = {
      ...post,
      title: formData.title,
      body: formData.body,
    };
    const response = await axios.put(
      `http://localhost:3000/posts/${post.id}`,
      updatedPost
    );
    if (response.status === 200) {
      setPosts(posts.map((p) => (p.id === post.id ? response.data : p)));
      setEditId(undefined); // Exit edit mode after saving
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3000/posts/${id}`);
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          name="title"
          value={formData.title}
          type="text"
          placeholder="title"
        />
        <input
          onChange={handleChange}
          name="body"
          value={formData.body}
          type="text"
          placeholder="body"
        />
        <button>Submit</button>
      </form>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <>
              <h1>
                {editId === post.id ? (
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    name="title"
                    value={formData.title || post.title}
                  />
                ) : (
                  post.title
                )}
              </h1>
              <p>
                {editId === post.id ? (
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, body: e.target.value })
                    }
                    name="body"
                    value={formData.body || post.body}
                  />
                ) : (
                  post.body
                )}
              </p>

              <button
                onClick={() =>
                  editId === post.id
                    ? handleSave(post)
                    : handleEdit(post.id)
                }
              >
                {editId === post.id ? "Save" : "Edit"}
              </button>

              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
