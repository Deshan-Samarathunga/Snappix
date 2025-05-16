
// client/src/pages/SinglePostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import PostCard from "../components/PostCard";

export default function SinglePostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const token = localStorage.getItem("snappixSession");

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setPost(res.data))
            .catch((err) => console.error("Failed to fetch post:", err));
    }, [id, token]);

    return (
        <div className="bg-black text-white min-vh-100 overflow-hidden">
            <Topbar />
            <div className="d-flex">
                <Sidebar />
                <main
                    className="flex-grow-1 px-4 pt-4 pb-5 d-flex justify-content-center"
                    style={{
                        marginLeft: "280px",
                        marginTop: "60px",
                        height: "calc(100vh - 60px)",
                        overflowY: "auto",
                        backgroundColor: "#1a1a1b",
                    }}
                >
                    <div className="w-100" style={{ maxWidth: "700px" }}>
                        {post ? <PostCard post={post} location="single" /> : <p>Loading...</p>}
                    </div>
                </main>
            </div>
        </div>
    );
}
