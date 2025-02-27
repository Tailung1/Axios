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
  const [editId, setEditId] = useState<number>(0);
  const [currentEditPost, setCurrentEditPost] = useState<Post | undefined>(
    undefined
  );

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
    formData.title = "";
    formData.body = "";
  };

  const handleEdit = (id: number) => {
    const foundPost = posts.find((post) => post.id === id);
    if (foundPost) {
      setCurrentEditPost(foundPost);
    }
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3000/posts/${id}`);
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <>
      <ul>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            value={formData.title}
            name="title"
            type="text"
            placeholder="title"
          />
          <input
            onChange={handleChange}
            value={formData.body}
            name="body"
            type="text"
            placeholder="body"
          />
          <button>Submit</button>
        </form>
        {posts?.map((post) => (
          <li key={post.id}>
            {
              <>
                <h1>
                  {" "}
                  {editId === post.id ? (
                    <input value={currentEditPost?.title} />
                  ) : (
                    post.title
                  )}
                </h1>
                <p>
                  {editId === post.id ? (
                    <input value={currentEditPost?.body} />
                  ) : (
                    post.body
                  )}
                </p>
                <button>Edit</button>
                <button onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </>
            }
          </li>
        ))}
      </ul>
    </>
  );
}
export default App;
