import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";

interface postTypes {
  name: string;
  color: string;
}
interface getPostTypes {
  name: string;
  color: string;
  id: string;
}
export default function App() {
  const [fechedData, setFechedData] = useState<
    getPostTypes[] | undefined
  >(undefined);
  const [newPost, setNewPost] = useState<postTypes>({
    name: "",
    color: "",
  });
  const fetchData = async () => {
    const response = await axios.get("http://localhost:3000/posts");
    if (response.status === 200) setFechedData(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    if (newPost.name === "" || newPost.color === "") {
      e.preventDefault();
      return;
    }
    const response = await axios.post(
      "http://localhost:3000/posts/",
      newPost
    );
    if (response.status === 200) setFechedData(response.data);
    setNewPost({ name: "", color: "" });
  };

  const handleDelete = (id:string) => {
    axios.delete(`http://localhost:3000/posts/${id}`),
      setFechedData(
        fechedData?.filter((post) => post.id !==id )
      );
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          value={newPost.name}
          onChange={handleOnChange}
        />
        <input
          type='text'
          name='color'
          value={newPost.color}
          onChange={handleOnChange}
        />
        <button type='submit'>Submit</button>
      </form>
      <div>
        {fechedData?.map((post) => (
          <div key={post.id}>
            <h1>{post.name}</h1> <h3>{post.color}</h3>{" "}
            <button>Edit</button>
            <button
              onClick={() => {
                handleDelete(post.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
