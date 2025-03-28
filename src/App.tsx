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
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/posts");
      if (response.status === 200) setFechedData(response.data);
    };
    fetchData();
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/posts/",
      newPost
    );
    if (response.status === 200) setFechedData(response.data);
    setNewPost({ name: "", color: "" });
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
            <h1>{post.name}</h1> <p>{post.color}</p>{" "}
            <button>Edit</button>
            <button>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
