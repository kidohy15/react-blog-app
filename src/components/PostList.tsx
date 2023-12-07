import AuthContext from "context/AuthContext";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "firebaseApp";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface PostListProps {
  hasNavigation?: boolean;
}

type TabType = "all" | "my";

export interface PostProps {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
}

export default function PostList({ hasNavigation = true }: PostListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  // firestore에서 리스트 값 가져오기
  const getPosts = async () => {
    const datas = await getDocs(collection(db, "posts"));
    // console.log("datas", datas);
    setPosts([]); // 동일 리스트가 쌓이지 않도록 호출 시 처음에 초기화
    datas?.forEach((doc) => {
      // console.log(doc.data(), doc.id);
      const dataObj = { ...doc.data(), id: doc.id };
      setPosts((prev) => [...prev, dataObj as PostProps]);
    });
  };

  // console.log("posts", posts);

  // 삭제 버튼
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && id) {
      await deleteDoc(doc(db, "posts", id));
      toast.success("게시글을 삭제했습니다.");
      getPosts(); // 삭제 후 변경된 posts 리스트를 가져오도록 한다
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      { hasNavigation && (
        <div className="post__navigation">
          <div
            role="presentation"
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "post__navigation--active" : ""}>
            전체
          </div>
          <div
            role="presentation"
            onClick={() => setActiveTab("my")}
            className={activeTab === "my" ? "post__navigation--active" : ""}>
            나의 글
          </div>
        </div>
      )}
      <div className="post__list">
        {posts?.length > 0 ? posts.map((post, index) => (
          <div key={post?.id} className="post__box">
            <Link to={`/posts/${post?.id}`}>
              <div className="post__profile-box">
                <div className="post__profile"></div>
                <div className="post__author-name">{post?.email}</div>
                <div className="post__date">{post?.createdAt}</div>
              </div>
              <div className="post__title">{post?.title}</div>
              <div className="post__text">{post?.summary}</div>
            </Link>
            
              {post?.email === user?.email && (
                <div className="post__utils-box">
                <div
                  className="post__delete"
                  role="presentation"
                  onClick={() => handleDelete(post.id as string)}
                >
                  삭제
                </div>
                  <div className="post__edit">
                  <Link to={`/posts/edit/${post?.id}`}>
                    수정
                  </Link>
                  </div>
                </div>
              )}
            
          </div>
        )) : (
          <div className="post__no-post">게시글이 업습니다.</div>
        )}
      </div>
    </>
  );
}
