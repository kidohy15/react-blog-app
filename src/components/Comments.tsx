import { useContext, useState } from "react"
import { PostProps } from "./PostList";
import AuthContext from "context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "firebaseApp";

// 댓글 더미 데이터
// const COMMENTS = [
//   {
//     id: 1,
//     email: "test@test.copm",
//     content: "댓글입니다.",
//     createdAt: "2023-06-13",
//   },
//   {
//     id: 2,
//     email: "test@test.copm",
//     content: "댓글입니다.",
//     createdAt: "2023-06-13",
//   },
// ]

interface CommentProps {
  post: PostProps;
  getPost: (id: string) => Promise<void>;
}

export default function Comments({ post, getPost }: CommentProps) {
  console.log("post",post)  
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "comment") {
      setComment(value);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (post && post?.id) {
        const postRef = doc(db, "posts", post.id);

        if (user?.uid) {
          const commentObj = {
            content: comment,
            uid: user.uid,
            email: user.email,
            createdAt: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };
          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updateDated: new Date()?.toLocaleDateString("ko", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
          
          // 문서 업데이트
          await getPost(post.id); // 댓글 실시간 반영
        };
      }
      toast.success("댓글을 생성했습니다.");
      setComment(""); // 작성되면 댓글 작성칸은 비워준다
    } catch {

    }
  };

  return (
    <div className="comments">
      <form className="comments__form" onSubmit={onSubmit}>
        <div className="form__block">
          <label htmlFor="comment">댓글 입력</label>
          <textarea
            name="comment"
            id="comment"
            required
            value={comment}
            onChange={onChange}
          />
        </div>
        <div className="form__block form__block-reverse">
          <input type="submit" value="입력" className="form__btn-submit"></input>
        </div>
      </form>
      <div className="comments__list">
        {/* {COMMENTS?.map((comment) => ( 더미 데이터 사용했던 부분 */}
        {post.comments
          ?.slice(0)
          ?.reverse()
          .map((comment) => (
          <div key={comment.createdAt} className="comment__box">
            <div className="comment__profile-box">
              <div className="comment__email">{comment?.email}</div>
              <div className="comment__date">{comment?.createdAt}</div>
              <div className="comment__delete">삭제</div>
            </div>
            <div className="comment__text">{comment?.content}</div>
          </div>
        ))}
      </div>
    </div>
  )

}